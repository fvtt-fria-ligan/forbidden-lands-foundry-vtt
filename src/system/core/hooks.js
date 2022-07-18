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
			if (dice) {
				for (const term of dice) {
					const [num, deno] = term.split("d");
					const map = {
						b: "attribute",
						s: "skill",
						g: "gear",
					};
					if (map[deno]) data[map[deno]].value += Number(num);
					else data.gear.artifactDie += term;
				}
			}
			FBLRollHandler.createRoll(data);
			return false;
		} else return true;
	});

	/**
	 * Localize header buttons on Item Sheets and Actor Sheets.
	 * These are hardcoded in English in Foundry. Bad practice. Thus we fix.
	 */
	Hooks.on("renderItemSheet", function (app, html) {
		app._element[0].style.height = "auto";

		html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
		html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
		html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));
	});

	Hooks.on("renderActorSheet", (app, html) => {
		if (app.actor.system.type === "party") app._element[0].style.height = "auto";

		html.find(".close").html(`<i class="fas fa-times"></i>` + game.i18n.localize("SHEET.CLOSE"));
		html.find(".configure-sheet").html(`<i class="fas fa-cog"></i>` + game.i18n.localize("SHEET.CONFIGURE"));
		html.find(".configure-token").html(`<i class="fas fa-user-circle"></i>` + game.i18n.localize("SHEET.TOKEN"));

		if (app.cellId?.match(/#gm-screen.+/)) {
			const buttons = html.find("button");
			buttons.each((_i, button) => {
				button.disabled = false;
			});
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
