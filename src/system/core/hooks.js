import { registerDiceSoNice } from "../../external-api/dice-so-nice.js";
import { FBLRollHandler } from "@components/roll-engine/engine.js";
import localizeString from "@utils/localize-string.js";
import { handleHotbarDrop } from "@components/macros/macros.js";

/**
 * Registers all hooks that are not 'init' or 'ready'
 */
export default function registerHooks() {
	// Sockets
	game.socket.on("system.forbidden-lands", (data) => {
		if (data.operation === "pushRoll" && data.isOwner) game.messages.get(data.id)?.delete();
	});

	Hooks.once("diceSoNiceReady", (dice3d) => {
		registerDiceSoNice(dice3d);
	});

	Hooks.on("renderPause", (_app, html) => {
		html.find("img").attr("src", "systems/forbidden-lands/assets/fbl-sun.webp");
	});

	/**
	 * Registers a custom chat command that lets us listen for either "/fblroll" or "/fblr".
	 * The commands take arguments like "2db" or "4ds"
	 */
	Hooks.on("chatMessage", (_html, content, _msg) => {
		const commandR = new RegExp("^\\/fblr(?:oll)?", "i");
		if (content.match(commandR)) {
			const diceR = new RegExp("(\\d+d(?:[bsng]|8|10|12))", "gi");
			// eslint-disable-next-line no-unused-vars
			const dice = content.match(diceR);
			const data = {
				attribute: { label: "DICE.BASE", value: 0 },
				skill: { label: "DICE.SKILL", value: 0 },
				gear: { label: "DICE.GEAR", value: 0, artifactDie: "" },
			};
			const options = {
				modifiers: [],
			};
			if (dice) {
				for (const term of dice) {
					const [num, deno] = term.split("d");
					const map = {
						b: "attribute",
						s: "skill",
						g: "gear",
						n: "negative",
					};
					if (map[deno] === "negative") options.modifiers.push({ value: -Number(num), active: true });
					else if (map[deno]) data[map[deno]].value += Number(num);
					else data.gear.artifactDie += term;
				}
			}
			FBLRollHandler.createRoll(data, options);
			return false;
		} else return true;
	});

	for (const hook of ["renderItemSheet", "renderActorSheet", "renderJournalSheet", "renderApplication"]) {
		Hooks.on(hook, (_app, html) => {
			html.find(".char-gen")?.html(
				`<i class="fas fa-leaf" data-tooltip="${game.i18n.localize("SHEET.HEADER.CHAR_GEN")}"></i>`,
			);
			html.find(".rest-up")?.html(
				`<i class="fas fa-bed" data-tooltip="${game.i18n.localize("SHEET.HEADER.REST")}"></i>`,
			);
			html.find(".custom-roll")?.html(
				`<i class="fas fa-dice" data-tooltip="${game.i18n.localize("SHEET.HEADER.ROLL")}"></i>`,
			);
			html.find(".configure-sheet")?.html(
				`<i class="fas fa-cog" data-tooltip="${game.i18n.localize("SHEET.CONFIGURE")}"></i>`,
			);
			html.find(".configure-token")?.html(
				`<i class="fas fa-user-circle" data-tooltip="${game.i18n.localize("SHEET.TOKEN")}"></i>`,
			);
			html.find(".item-post")?.html(
				`<i class="fas fa-comment" data-tooltip="${game.i18n.localize("SHEET.HEADER.POST_ITEM")}"></i>`,
			);
			html.find(".share-image")?.html(
				`<i class="fas fa-eye" data-tooltip="${game.i18n.localize("JOURNAL.ActionShow")}"></i>`,
			);
			html.find(".close")?.html(
				`<i class="fas fa-times" data-tooltip="${game.i18n.localize("SHEET.CLOSE")}"></i>`,
			);
		});
	}

	/**
	 * Localize header buttons on Item Sheets and Actor Sheets.
	 * These are hardcoded in English in Foundry. Bad practice. Thus we fix.
	 */
	Hooks.on("renderItemSheet", function (app) {
		app._element[0].style.height = "auto";
	});

	Hooks.on("renderActorSheet", function (app, html) {
		if (app.actor.system.type === "party") app._element[0].style.height = "auto";

		if (app.cellId?.match(/#gm-screen.+/)) {
			const buttons = html.find("button");
			buttons.each((_i, button) => {
				button.disabled = false;
			});
		}
	});

	Hooks.on("renderJournalSheet", function (app, html) {
		if (app.document.flags["forbidden-lands"]?.isBook) {
			html.addClass("fbl-book");
		}
	});

	Hooks.on("renderChatMessage", async (app, html) => {
		const postedItem = html.find(".chat-item")[0];
		if (postedItem) {
			postedItem.classList.add("draggable");
			postedItem.setAttribute("draggable", true);
			postedItem.addEventListener("dragstart", (ev) => {
				ev.dataTransfer.setData(
					"text/plain",
					JSON.stringify({
						item: app.getFlag("forbidden-lands", "itemData"),
						type: "itemDrop",
					}),
				);
			});
		}

		const pushButton = html.find(".fbl-button.push")[0];
		if (pushButton) {
			pushButton.addEventListener("click", async () => {
				if (app.roll.pushable) {
					await FBLRollHandler.pushRoll(app);

					const fireEvent = () => {
						if (app.permission === 3) app.delete();
						else
							game.socket.emit("system.forbidden-lands", {
								operation: "pushRoll",
								isOwner: app.roll?.isOwner,
								id: app.id,
							});
					};
					// Delete the old roll from the chat
					if (game.modules.get("dice-so-nice")?.active)
						Hooks.once("diceSoNiceRollComplete", () => {
							fireEvent();
						});
					else fireEvent();
				}
			});
		}
		const tableButton = html.find(".fbl-button.table")[0];
		if (tableButton) {
			tableButton.addEventListener("click", async () => {
				let table;

				if (tableButton.dataset.action === "prey") {
					const tables = game.settings.get("forbidden-lands", "mishapTables");
					table = game.tables.get(tables["travel-found-prey"]);
				} else table = game.tables.get(tableButton.dataset.id);

				if (table) table.draw({ displayChat: true });
				else ui.notifications?.warn("Could not find mishap table");
			});
		}
	});

	/**
	 * Registers a custom chat command that lets us listen for either "/fblroll" or "/fblr".
	 */
	Hooks.on("getCombatTrackerEntryContext", (_, options) => {
		options.splice(1, -1, {
			name: localizeString("COMBAT.DUPLICATE"),
			icon: "<i class='fas fa-copy'></i>",
			callback: (li) => {
				const combatant = game.combats.viewed.combatants.get(li.data("combatant-id"));
				if (combatant)
					return game.combats.viewed.createEmbeddedDocuments("Combatant", [combatant.clone().data]);
			},
		});
	});

	/**
	 * GM screen module causes buttons in Actor sheets to disable.
	 * Undo this, so its possible to roll Attributes, Skills, etc. from GM Screen.
	 */
	Hooks.on("gmScreenOpenClose", (app, _config) => {
		const html = app.element;
		const buttons = html.find("button");
		buttons.each((_i, button) => {
			button.disabled = false;
		});
	});

	Hooks.on("hotbarDrop", async (_, data, slot) => handleHotbarDrop(data, slot));
}
