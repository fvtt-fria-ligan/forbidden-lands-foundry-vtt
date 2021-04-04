import { TravelActionsConfig } from "../../components/travel-actions.js";
import { Helpers } from "../../utils/helpers.js";
import { CharacterPickerDialog } from "../../components/character-picker-dialog.js";
import { ForbiddenLandsActorSheet } from "./actor.js";

export class ForbiddenLandsPartySheet extends ForbiddenLandsActorSheet {
	static get defaultOptions() {
		let dragDrop = [...super.defaultOptions.dragDrop];
		dragDrop.push({ dragSelector: ".party-member", dropSelector: ".party-member-list" });
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/party.hbs",
			width: 700,
			height: 840,
			resizable: false,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
			dragDrop: dragDrop,
		});
	}

	getData() {
		const data = super.getData();

		data.partyMembers = {};
		data.travel = {};
		data.travelActions = TravelActionsConfig;
		let ownedActorId, assignedActorId, travelAction;
		for (let i = 0; i < (data.actor.flags.partyMembers || []).length; i++) {
			ownedActorId = data.actor.flags.partyMembers[i];
			data.partyMembers[ownedActorId] = game.actors.get(ownedActorId).data;
		}
		for (let travelActionKey in data.actor.flags.travel) {
			travelAction = data.actor.flags.travel[travelActionKey];
			data.travel[travelActionKey] = {};

			if (typeof travelAction === "object") {
				for (let i = 0; i < travelAction.length; i++) {
					assignedActorId = travelAction[i];
					data.travel[travelActionKey][assignedActorId] = game.actors.get(assignedActorId).data;
				}
			} else if (travelAction !== "") {
				data.travel[travelActionKey][travelAction] = game.actors.get(travelAction).data;
			}
		}
		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".item-delete").click(this.handleRemoveMember.bind(this));
		html.find(".reset").click(() => {
			this.assignPartyMembersToAction(this.getPartyMembers(), "other");
			this.render(true);
		});

		let button;
		for (let key in TravelActionsConfig) {
			for (let i = 0; i < TravelActionsConfig[key].buttons.length; i++) {
				button = TravelActionsConfig[key].buttons[i];
				html.find("." + button.class).click(button.handler.bind(this, this));
			}
		}
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();

		const allowTravelRollPush = game.settings.get("forbidden-lands", "allowTravelRollPush");
		if (this.actor.owner && allowTravelRollPush) {
			buttons = [
				{
					label: "Push",
					class: "push-roll",
					icon: "fas fa-skull",
					onclick: () => {
						let ownedPartyMembers = Helpers.getOwnedCharacters(this.actor.data.flags.partyMembers);
						let diceRoller;

						if (ownedPartyMembers.length === 1) {
							diceRoller = Helpers.getCharacterDiceRoller(ownedPartyMembers[0]);
							if (!diceRoller) return;
							diceRoller.push();
						} else if (ownedPartyMembers.length > 1) {
							CharacterPickerDialog.show(
								game.i18n.localize("FLPS.UI.WHO_PUSHES"),
								ownedPartyMembers,
								function (entityId) {
									diceRoller = Helpers.getCharacterDiceRoller(game.actors.get(entityId));
									if (!diceRoller) return;
									diceRoller.push();
								},
							);
						}
					},
				},
			].concat(buttons);
		}

		return buttons;
	}

	getPartyMembers() {
		return this.actor.data.flags.partyMembers || [];
	}

	async handleRemoveMember(event) {
		const div = $(event.currentTarget).parents(".party-member");
		const entityId = div.data("entity-id");

		let partyMembers = [...this.getPartyMembers()];
		partyMembers.splice(partyMembers.indexOf(entityId), 1);

		let updateData = {
			"flags.partyMembers": partyMembers,
		};

		let travelAction, actionParticipants;
		for (let travelActionKey in this.actor.data.flags.travel) {
			travelAction = this.actor.data.flags.travel[travelActionKey];
			if (travelAction.indexOf(entityId) < 0) continue;

			if (typeof travelAction === "object") {
				actionParticipants = [...travelAction];
				actionParticipants.splice(actionParticipants.indexOf(entityId), 1);
				updateData["flags.travel." + travelActionKey] = actionParticipants;
			} else {
				updateData["flags.travel." + travelActionKey] = "";
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

		let entityId = event.currentTarget.dataset.entityId;
		event.dataTransfer.setData(
			"text/plain",
			JSON.stringify({
				type: "Actor",
				action: "assign",
				id: entityId,
			}),
		);
	}

	async _onDrop(event) {
		super._onDrop(event);

		const json = event.dataTransfer.getData("text/plain");
		if (!json) return;

		let draggedItem = JSON.parse(json);
		if (draggedItem.type !== "Actor") return;

		const actor = game.actors.get(draggedItem.id);
		if (actor.data.type !== "character") return;

		if (draggedItem.action === "assign") {
			this.handleTravelActionAssignment(event, actor);
		} else {
			this.handleAddToParty(actor);
		}
		this.render(true);
	}

	async handleTravelActionAssignment(event, actor) {
		let actionContainer = event.toElement.classList.contains("travel-action")
			? event.toElement
			: event.toElement.closest(".travel-action");
		if (actionContainer === null) return; // character was dragged god knows where; just pretend it never happened

		this.assignPartyMembersToAction(actor, actionContainer.dataset.travelAction);
	}

	async assignPartyMembersToAction(partyMembers, travelActionKey) {
		if (!Array.isArray(partyMembers)) partyMembers = [partyMembers];

		let updateData = {},
			updDataKey,
			partyMemberId;
		for (let i = 0; i < partyMembers.length; i++) {
			partyMemberId = typeof partyMembers[i] === "object" ? partyMembers[i].data._id : partyMembers[i];

			// remove party member from the current assignment
			let travelAction, actionParticipants;
			for (let key in this.actor.data.flags.travel) {
				travelAction = this.actor.data.flags.travel[key];
				if (travelAction.indexOf(partyMemberId) < 0) continue;

				updDataKey = "flags.travel." + key;
				if (typeof travelAction === "object") {
					if (updateData[updDataKey] === undefined) {
						actionParticipants = [...travelAction];
						actionParticipants.splice(actionParticipants.indexOf(partyMemberId), 1);
						updateData[updDataKey] = actionParticipants;
					} else {
						updateData[updDataKey].splice(updateData[updDataKey].indexOf(partyMemberId), 1);
					}
				} else {
					updateData[updDataKey] = "";
				}
			}

			// add party member to a new assignment
			updDataKey = "flags.travel." + travelActionKey;
			if (typeof this.actor.data.flags.travel[travelActionKey] === "object") {
				if (updateData[updDataKey] === undefined) {
					actionParticipants = [...this.actor.data.flags.travel[travelActionKey]];
					actionParticipants.push(partyMemberId);
					updateData[updDataKey] = actionParticipants;
				} else {
					updateData[updDataKey].push(partyMemberId);
				}
			} else {
				updateData[updDataKey] = partyMemberId;
				// if someone was already assigned here we must move that character to the "Other" assignment
				if (this.actor.data.flags.travel[travelActionKey] !== "") {
					if (updateData["flags.travel.other"] === undefined) {
						actionParticipants = [...this.actor.data.flags.travel.other];
						actionParticipants.push(this.actor.data.flags.travel[travelActionKey]);
						updateData["flags.travel.other"] = actionParticipants;
					} else {
						updateData["flags.travel.other"].push(this.actor.data.flags.travel[travelActionKey]);
					}
				}
			}
		}

		await this.actor.update(updateData);
	}

	async handleAddToParty(actor) {
		let partyMembers = [...this.getPartyMembers()];
		let initialCount = partyMembers.length;
		partyMembers.push(actor.data._id);
		// eslint-disable-next-line no-undef
		partyMembers = [...new Set(partyMembers)]; // remove duplicate values
		if (initialCount === partyMembers.length) return; // nothing changed

		let travelOther = [...this.actor.data.flags.travel.other];
		travelOther.push(actor.data._id);
		await this.actor.update({ "flags.partyMembers": partyMembers, "flags.travel.other": travelOther });
	}

	async _renderInner(data, options) {
		const actor = this.object;
		if (data.actor.flags.partyMembers !== undefined) return super._renderInner(data, options); // everything is already initialized

		console.log("Forbidden Lands Party Sheet: initializing sheet");
		let initialData = {
			"flags.partyMembers": [],
		};

		for (let key in TravelActionsConfig) {
			initialData[`flags.travel.${key}`] = [];
		}
		await actor.update(initialData);
		return super._renderInner(data, options);
	}
}
