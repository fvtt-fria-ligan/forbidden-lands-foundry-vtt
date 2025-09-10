import { Changelog } from "$changelog/changelog.js";
import { handleHotbarDrop } from "@components/macros/macros.js";
import { FBLRollHandler } from "@components/roll-engine/engine.js";
import { adventureSiteCreateDialog } from "@journal/adventure-sites/adventure-site-generator.js";
import { registerDiceSoNice } from "../../external-api/dice-so-nice.js";
import t from "$utils/localize-string.js";

/**
 * Registers all hooks that are not 'init' or 'ready'
 */
export default function registerHooks() {
	// Sockets
	game.socket.on("system.forbidden-lands", (data) => {
		if (data.operation === "pushRoll" && data.isOwner)
			game.messages.get(data.id)?.delete();
	});

	Hooks.once("diceSoNiceReady", (dice3d) => {
		registerDiceSoNice(dice3d);
	});

	Hooks.on("yzeCombatReady", () => {
		if (game.settings.get("forbidden-lands", "configuredYZEC")) return;
		try {
			game.settings.set("yze-combat", "resetEachRound", false);
			game.settings.set("yze-combat", "slowAndFastActions", true);
			game.settings.set("yze-combat", "initAutoDraw", true);
			game.settings.set("yze-combat", "duplicateCombatantOnCombatStart", true);
			game.settings.set(
				"yze-combat",
				"actorSpeedAttribute",
				"system.movement.value",
			);
			game.settings.set("forbidden-lands", "configuredYZEC", true);
		} catch (e) {
			console.error("Could not configure YZE Combat", e);
		}
	});

	Hooks.on("renderGamePause", (_, html, options) => {
		const imgElement = html.querySelector("img");
		const caption = html.querySelector("figcaption");

		html.style.height = `${80 + 150}px`;
		html.style.top = `calc(50vh - ${100 + 0.5 * 150}px)`;
		html.style.background = "none";
		imgElement.src = "systems/forbidden-lands/assets/fbl-sun.webp";
		imgElement.style.opacity = 0.8;
		imgElement.style.width = "150px";
		imgElement.style.height = "150px";
		imgElement.style.cssText += "--fa-animation-duration: 5s";
		caption.innerText = "Game Paused";
		caption.style.color = "#EEEEEE";
		caption.style["text-transform"] = "uppercase";
		caption.style["font-size"] = "1.75em";
		caption.style["text-shadow"] = "0px 0px 20px #000000";
	});

	/**
	 * Registers a custom chat command that lets us listen for either "/fblroll" or "/fblr".
	 * The commands take arguments like "2db" or "4ds"
	 */
	Hooks.on("chatMessage", (_html, content, _msg) => {
		const commandR = /^\/fblr(?:oll)?/i;
		if (content.match(commandR)) {
			const diceR = /(\d+d(?:[bsng]|8|10|12))/gi;
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
					if (map[deno] === "negative")
						options.modifiers.push({ value: -Number(num), active: true });
					else if (map[deno]) data[map[deno]].value += Number(num);
					else data.gear.artifactDie += term;
				}
			}
			FBLRollHandler.createRoll(data, options);
			return false;
		}
		return true;
	});

	if (game.settings.get("forbidden-lands", "collapseSheetHeaderButtons"))
		for (const hook of [
			"renderItemSheet",
			"renderActorSheet",
			"renderJournalSheet",
			"renderApplication",
		]) {
			Hooks.on(hook, (_app, html) => {
				html
					.find(".char-gen")
					?.html(
						`<i class="fas fa-leaf" data-tooltip="${game.i18n.localize(
							"SHEET.HEADER.CHAR_GEN",
						)}"></i>`,
					);
				html
					.find(".rest-up")
					?.html(
						`<i class="fas fa-bed" data-tooltip="${game.i18n.localize(
							"SHEET.HEADER.REST",
						)}"></i>`,
					);
				html
					.find(".custom-roll")
					?.html(
						`<i class="fas fa-dice" data-tooltip="${game.i18n.localize(
							"SHEET.HEADER.ROLL",
						)}"></i>`,
					);
				html
					.find(".configure-sheet")
					?.html(
						`<i class="fas fa-cog" data-tooltip="${game.i18n.localize(
							"SHEET.CONFIGURE",
						)}"></i>`,
					);
				html
					.find(".configure-token")
					?.html(
						`<i class="fas fa-user-circle" data-tooltip="${game.i18n.localize(
							"SHEET.TOKEN",
						)}"></i>`,
					);
				html
					.find(".item-post")
					?.html(
						`<i class="fas fa-comment" data-tooltip="${game.i18n.localize(
							"SHEET.HEADER.POST_ITEM",
						)}"></i>`,
					);
				html
					.find(".share-image")
					?.html(
						`<i class="fas fa-eye" data-tooltip="${game.i18n.localize(
							"JOURNAL.ActionShow",
						)}"></i>`,
					);
				html
					.find(".close")
					?.html(
						`<i class="fas fa-times" data-tooltip="${game.i18n.localize(
							"SHEET.CLOSE",
						)}"></i>`,
					);
			});
		}

	/**
	 * Localize header buttons on Item Sheets and Actor Sheets.
	 * These are hardcoded in English in Foundry. Bad practice. Thus we fix.
	 */
	Hooks.on("renderItemSheet", (app) => {
		app._element[0].style.height = "auto";
	});

	Hooks.on("renderActorSheet", (app, html) => {
		if (app.actor.system.type === "party")
			app._element[0].style.height = "auto";

		if (app.cellId?.match(/#gm-screen.+/)) {
			const buttons = html.find("button");
			buttons.each((_i, button) => {
				button.disabled = false;
			});
		}
	});

	Hooks.on("renderJournalSheet", (app, html) => {
		if (app.document.flags["forbidden-lands"]?.isBook) {
			html.addClass("fbl-book");
		}
	});

	Hooks.on("renderChatMessageHTML", (message, htmlElement, data) => {
		// 1. Handle click-to-toggle on the entire roll container
		const roll = htmlElement.querySelector(".fbl-chat-roll");
		if (roll) {
			roll.addEventListener("click", (ev) => {
				// Ignore clicks on interactive buttons
				if (ev.target.closest(".fbl-button")) return;

				const details = roll.querySelector(".fbl-roll-details");
				if (details) details.hidden = !details.hidden;
			});
		}

		// 2. Handle item drag
		const postedItem = htmlElement.querySelector(".chat-item");
		if (postedItem) {
			postedItem.classList.add("draggable");
			postedItem.setAttribute("draggable", "true");

			postedItem.addEventListener("dragstart", (ev) => {
				const itemData = message.getFlag("forbidden-lands", "itemData");
				ev.dataTransfer.setData(
					"text/plain",
					JSON.stringify({
						item: itemData,
						type: "itemDrop",
					}),
				);
			});
		}

		// 3. Handle push button
		const pushButton = htmlElement.querySelector(".fbl-button.push");
		if (pushButton) {
			pushButton.addEventListener("click", async (ev) => {
				ev.stopPropagation();

				if (message.rolls[0]?.pushable) {
					await FBLRollHandler.pushRoll(message);

					const fireEvent = () => {
						if (message.permission === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)
							message.delete();
						else
							game.socket.emit("system.forbidden-lands", {
								operation: "pushRoll",
								isOwner: message.roll?.isOwner,
								id: message.id,
							});
					};

					if (game.modules.get("dice-so-nice")?.active)
						Hooks.once("diceSoNiceRollComplete", fireEvent);
					else fireEvent();
				}
			});
		}

		// 4. Handle mishap/prey table button
		const tableButton = htmlElement.querySelector(".fbl-button.table");
		if (tableButton) {
			tableButton.addEventListener("click", async (ev) => {
				ev.stopPropagation();

				let table;

				if (tableButton.dataset.action === "prey") {
					const tables = game.settings.get("forbidden-lands", "otherTables");
					table = game.tables.get(tables["travel-find-prey"]);
				} else {
					table = game.tables.get(tableButton.dataset.id);
				}

				if (table) {
					table.draw({ displayChat: true });
				} else {
					ui.notifications?.warn("Could not find mishap table");
				}
			});
		}
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

	Hooks.on("renderSidebarTab", (app, html) => {
		if (app.tabName !== "settings") return;

		const section = html.find("#settings-documentation");
		const button = `<button type="button"><i class='fas fa-book'></i> ${game.i18n.localize(
			"CONFIG.CHANGELOG",
		)}</button>`;

		section.prepend(button).on("click", (ev) => {
			ev.preventDefault();
			new Changelog().render(true);
		});
	});

	Hooks.on("renderJournalDirectory", (app) => {
		const header = app.element.querySelector(".header-actions");
		if (!header || header.querySelector("#create-adventure-site")) return;

		const button = document.createElement("button");
		button.id = "create-adventure-site";
		button.innerHTML = `<i class="fas fa-castle"></i> ${t("ADVENTURE_SITE.BUTTON.CREATE")}`;
		button.addEventListener("click", () => adventureSiteCreateDialog());

		header.appendChild(button);
	});

	Hooks.on("renderJournalEntrySheet", (app, html, doc) => {
		const type = doc.document.getFlag("forbidden-lands", "adventureSiteType");
		const isDungeon = ["dungeon", "ice_cave", "elven_ruin"].includes(type);
		if (!isDungeon || !game.user.isGM) return;

		const button = $(
			`<button type="button" class="create" data-action="add-room"><i class="fas fa-plus-circle"></i> ${t("ADVENTURE_SITE.ADD_ROOM")}</button>`,
		);

		button.on("click", async () => {
			const path = CONFIG.fbl.adventureSites.types[type];
			const room = await CONFIG.fbl.adventureSites?.generate(
				path,
				`${type}_rooms`,
			);
			const pageName = $(room)
				.find("h4, strong")
				?.first()
				.text()
				.replace(/[^\p{L}]+/u, " ")
				.trim();
			await doc.document.createEmbeddedDocuments("JournalEntryPage", [
				{
					name: pageName,
					title: { level: 2, show: false },
					text: { content: `<div class="adventure-site">${room}</div>` },
				},
			]);
		});

		$(html).find('[data-action="createPage"]').after(button);
	});
}
