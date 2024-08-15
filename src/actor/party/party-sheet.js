import { experienceDialog } from "$components/macros/experience-dialog.js";
import { TravelActionsConfig } from "@actor/party/components/travel-actions";
import { TableConfigMenu } from "@system/core/settings.js";
import localizeString from "@utils/localize-string.js";
export class ForbiddenLandsPartySheet extends ActorSheet {
	static get defaultOptions() {
		const dragDrop = [...super.defaultOptions.dragDrop];
		dragDrop.push({
			dragSelector: ".party-member",
			dropSelector: ".party-member-list",
		});
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor", "party"],
			template: "systems/forbidden-lands/templates/actor/party/party-sheet.hbs",
			width: window.innerWidth * 0.05 + 650,
			resizable: true,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "main",
				},
			],
			dragDrop: dragDrop,
		});
	}

	get actorProperties() {
		return this.actor.system;
	}

	async getData() {
		const { data } = await super.getData();
		data.partyMembers = {};
		data.travelActions = this.getTravelActions();
		data.encounterTables = await this.getEncounterTables();
		data.isGm = game.user.isGM;
		let ownedActorId;
		for (let i = 0; i < (data.system.members || []).length; i++) {
			ownedActorId = data.system.members[i];
			data.partyMembers[ownedActorId] = game.actors.get(ownedActorId);
		}
		data.system.description = await TextEditor.enrichHTML(
			data.system.description,
			{ async: true },
		);
		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".item-delete").click(this.handleRemoveMember.bind(this));
		html.find(".reset").click((event) => {
			event.preventDefault();
			this.resetTravelActions();
			this.render(true);
		});

		html.find(".encounter-table").click(async (event) => {
			event.preventDefault();
			const target = event.currentTarget;
			const table = game.tables.get(target.dataset.id);
			await table.draw();
		});

		html.find(".configure-tables").click(async (event) => {
			event.preventDefault();
			await new TableConfigMenu().render(true);
			this.render(true);
		});

		html.find(".party-experience").click(async (event) => {
			event.preventDefault();
			return experienceDialog();
		});

		let button;
		for (const key in TravelActionsConfig) {
			for (let i = 0; i < TravelActionsConfig[key].buttons.length; i++) {
				button = TravelActionsConfig[key].buttons[i];
				html.find(`.${button.class}`).click(button.handler.bind(this, this));
			}
		}
	}

	getTravelActions() {
		const travelActions = TravelActionsConfig;
		// TODO: This should be moved to content modules to register
		const journal = game.journal.getName("Journey Reference");
		for (const action of Object.values(travelActions)) {
			if (journal)
				action.journalLink = journal.pages.getName(
					action.journalEntryName,
				)?.uuid;
			action.participants = this.document.system.travel[action.key].map((id) =>
				game.actors.get(id),
			);
		}
		return travelActions;
	}

	async getEncounterTables() {
		const tableSettings = game.settings.get(
			"forbidden-lands",
			"encounterTables",
		);
		const tables = Object.fromEntries(
			Object.entries(tableSettings)
				.filter((t) => !!t[1])
				.map((t) => [localizeString(t[0]), t[1]]),
		);
		return tables;
	}

	async handleRemoveMember(event) {
		event.preventDefault();
		const div = $(event.currentTarget).parents(".party-member");
		const entityId = div.data("entity-id");

		const partyMembers = this.actorProperties.members;
		partyMembers.splice(partyMembers.indexOf(entityId), 1);

		const updateData = {
			"system.members": partyMembers,
		};

		let travelAction;
		let actionParticipants;
		for (const travelActionKey in this.actorProperties.travel) {
			travelAction = this.actorProperties.travel[travelActionKey];
			if (travelAction.indexOf(entityId) < 0) continue;

			if (typeof travelAction === "object") {
				actionParticipants = [...travelAction];
				actionParticipants.splice(actionParticipants.indexOf(entityId), 1);
				updateData[`system.travel.${travelActionKey}`] = actionParticipants;
			} else {
				updateData[`system.travel.${travelActionKey}`] = "";
			}
		}

		await this.actor.update(updateData);

		div.slideUp(200, () => this.render(false));
	}

	_onDragStart(event) {
		if (event.currentTarget.dataset.itemId !== undefined) {
			super._onDragStart(event);
			return;
		}

		const entityId = event.currentTarget.dataset.entityId;
		event.dataTransfer.setData(
			"text/plain",
			JSON.stringify({
				type: "Actor",
				action: "assign",
				uuid: `Actor.${entityId}`,
			}),
		);
	}

	async _onDrop(event) {
		super._onDrop(event);

		const draggedItem = JSON.parse(event.dataTransfer.getData("text/plain"));
		if (!draggedItem || draggedItem.type !== "Actor") return;

		const actorId = draggedItem.uuid.split(".")[1];
		const actor = game.actors.get(actorId);
		if (actor?.type !== "character") return;

		if (draggedItem.action === "assign")
			await this.handleTravelActionAssignment(event, actor);
		else await this.handleAddToParty(actor);

		return this.render(true);
	}

	async handleTravelActionAssignment(event, actor) {
		const targetElement = event.toElement ? event.toElement : event.target;
		const actionContainer = targetElement.classList.contains("travel-action")
			? targetElement
			: targetElement.closest(".travel-action");
		if (actionContainer === null) return; // character was dragged god knows where; just pretend it never happened

		return this.assignPartyMemberToAction(
			actor,
			actionContainer.dataset.travelAction,
		);
	}

	async assignPartyMemberToAction(partyMember, travelActionKey) {
		const travelAction = this.actorProperties.travel[travelActionKey];

		// If the action already includes the party member we don't need to do anything
		if (travelAction.includes(partyMember.id)) return;

		const currentAction = Object.entries(this.actorProperties.travel).find(
			([_, array]) => array.includes(partyMember.id),
		);
		const updateData = {
			// Add party member to new action, making sure not to remove existing ones
			[`system.travel.${travelActionKey}`]: [...travelAction, partyMember.id],
			// Remove party member from old action
			[`system.travel.${currentAction[0]}`]: currentAction[1].filter(
				(id) => id !== partyMember.id,
			),
		};
		return this.actor.update(updateData);
	}

	async handleAddToParty(actor) {
		let partyMembers = this.actorProperties.members;
		const initialCount = partyMembers.length;
		partyMembers = [...new Set([...partyMembers, actor.id])];
		// We do not want to run an update if there has been no changes
		if (initialCount === partyMembers.length) return;

		const travelOther = [...this.actorProperties.travel.other, actor.id];
		return this.actor.update({
			["system.members"]: partyMembers,
			["system.travel.other"]: travelOther,
		});
	}

	async resetTravelActions() {
		const updates = Object.keys(this.actorProperties.travel).reduce(
			(acc, key) => {
				if (key === "other")
					acc[`system.travel.${key}`] = this.actorProperties.members;
				else acc[`system.travel.${key}`] = [];
				return acc;
			},
			{},
		);
		return this.actor.update(updates);
	}
}
