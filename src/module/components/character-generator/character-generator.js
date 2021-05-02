import { CharacterConverter } from "./character-converter.js";

export class ForbiddenLandsCharacterGenerator extends Application {
	constructor(dataset = {}, existActor, options = {}) {
		super(options);

		this.character = null;
		this.existActor = existActor;
		this.dataset = dataset;
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["forbidden-lands", "sheet", "actor"],
			template: "systems/forbidden-lands/templates/character-generator.hbs",
			title: game.i18n.localize("FLCG.TITLE"),
			width: 700,
			height: 840,
			resizable: false,
		});
	}

	static async loadDataset() {
		const dataset = game.settings.get("forbidden-lands", "datasetDir") || null;
		if (dataset && dataset.substr(-4, 4) !== "json")
			throw ForbiddenLandsCharacterGenerator.handleBadDataset("Dataset is not a JSON file.");
		const lang = game.i18n.lang;
		const datasetName = game.fbl.config.dataSetConfig[lang] || "dataset";
		const defaultDataset = `systems/forbidden-lands/assets/datasets/chargen/${datasetName}.json`;
		const resp = await fetch(dataset ? dataset : defaultDataset).catch((_err) => {
			return {};
		});
		return resp.json();
	}

	async getData() {
		const data = super.getData();
		if (this.character === null) {
			this.character = await this.generateCharacter();
		}
		data.character = this.character;
		data.dataset = this.dataset;
		data.dataset.childhood = this.dataset.kin[this.character.kin].childhood;
		data.dataset.paths = this.dataset.profession[this.character.profession].paths;
		data.dataset.formativeEvents = this.dataset.profession[this.character.profession].formativeEvents;
		return data;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".chargen-randomize-all").click(this.handleRandomizeAll.bind(this));
		html.find(".chargen-create-actor").click(this.handleCreateActor.bind(this));

		html.find(".chargen-roll-kin").click(this.handleRollKin.bind(this));
		html.find(".chargen-roll-age").click(this.handleRollAge.bind(this));
		html.find(".chargen-roll-childhood").click(this.handleRollChildhood.bind(this));
		html.find(".chargen-roll-profession").click(this.handleRollProfession.bind(this));
		html.find(".chargen-roll-path").click(this.handleRollPath.bind(this));
		html.find(".chargen-roll-event").click(this.handleRollEvent.bind(this));

		html.find(".chargen-select-kin").change(this.handleInputKin.bind(this));
		html.find(".chargen-age-input").change(this.handleInputAge.bind(this));
		html.find(".chargen-select-childhood").change(this.handleInputChildhood.bind(this));
		html.find(".chargen-select-profession").change(this.handleInputProfession.bind(this));
		html.find(".chargen-select-path").change(this.handleInputPath.bind(this));
		html.find(".chargen-select-event").change(this.handleInputEvent.bind(this));
	}

	_getHeaderButtons() {
		let buttons = super._getHeaderButtons();

		return buttons;
	}

	async handleCreateActor() {
		const coverter = new CharacterConverter(this.dataset);
		const updateData = await coverter.convert(this.character);
		await this.existActor.update({ ["data"]: updateData.data });
		await this.existActor.createEmbeddedEntity("OwnedItem", updateData.items);

		return this.close();
	}

	handleInputKin(event) {
		const kinKey = $(event.currentTarget).val();
		this.character = this.setKin(this.character, kinKey);
		this.render(true);

		return false;
	}

	handleInputAge(event) {
		const mapping = ["Young", "Adult", "Old"];
		const ageNumber = parseInt($(event.currentTarget).val());
		const kin = this.dataset.kin[this.character.kin];
		let ageKey = 2;
		for (let i = 0; i < 3; i++) {
			const range = kin.age[i];
			if (ageNumber >= range[0] && ageNumber <= range[1]) {
				ageKey = i;
				break;
			}
		}
		this.character.age = { ageKey: ageKey, ageNumber: ageNumber, ageString: mapping[ageKey] };
		this.character = this.rollFormativeEvents(this.character);

		this.render(true);

		return false;
	}

	handleInputChildhood(event) {
		const childhoodKey = $(event.currentTarget).val();
		const kin = this.dataset.kin[this.character.kin];
		this.character.childhood = kin.childhood[childhoodKey];

		this.render(true);

		return false;
	}

	handleInputProfession(event) {
		const professionKey = $(event.currentTarget).val();
		this.character.profession = professionKey;
		this.character = this.rollPath(this.character);
		this.character.formativeEvents = false; // force re-roll
		this.character = this.rollFormativeEvents(this.character);

		this.render(true);

		return false;
	}

	handleInputPath(event) {
		const pathKey = parseInt($(event.currentTarget).val());
		this.character.path = pathKey;
		this.render(true);

		return false;
	}

	handleInputEvent(event) {
		const el = $(event.currentTarget);
		const id = parseInt(el.data("key"));
		const eventKey = el.val();
		const profession = this.dataset.profession[this.character.profession];

		this.character.formativeEvents[id] = profession.formativeEvents[eventKey];

		this.render(true);

		return false;
	}

	handleRollKin(_event) {
		this.character = this.setKin(this.character);
		this.render(true);

		return false;
	}

	handleRollAge(_event) {
		this.character.age = this.rollAge(this.dataset.kin[this.character.kin].age);
		this.character = this.rollFormativeEvents(this.character);

		this.render(true);

		return false;
	}

	handleRollChildhood(_event) {
		const kin = this.dataset.kin[this.character.kin];
		this.character.childhood = this.rollOn(kin.childhood);

		this.render(true);

		return false;
	}

	handleRollProfession(_event) {
		this.character.profession = this.rollOn(this.dataset.profession).key;
		this.character = this.rollPath(this.character);
		this.character.formativeEvents = false; // force re-roll
		this.character = this.rollFormativeEvents(this.character);

		this.render(true);

		return false;
	}

	handleRollPath(_event) {
		this.character = this.rollPath(this.character);
		this.render(true);

		return false;
	}

	handleRollEvent(event) {
		const profession = this.dataset.profession[this.character.profession];
		let button = $(event.currentTarget);
		const id = parseInt(button.data("key"));
		let rolled = [];
		let newEvent = {};
		for (let i = 0; i < this.character.formativeEvents.length; i++) {
			if (i === id) continue;
			const formativeEvent = this.character.formativeEvents[i];
			rolled.push(formativeEvent.key);
		}

		do {
			newEvent = this.rollOn(profession.formativeEvents);
		} while (rolled.includes(newEvent.key));
		this.character.formativeEvents[id] = newEvent;

		this.render(true);

		return false;
	}

	async handleRandomizeAll(_event) {
		this.character = await this.generateCharacter();
		this.render(true);

		return false;
	}

	async generateCharacter() {
		if (!this.dataset.profession || !this.dataset.kin)
			throw ForbiddenLandsCharacterGenerator.handleBadDataset("Dataset is not in the correct format.", this);
		let character = {};
		character = this.setKin(character);
		let profession = this.rollOn(this.dataset.profession);
		character.profession = profession.key;
		character = this.rollPath(character);
		character = this.rollFormativeEvents(character);

		return character;
	}

	setKin(character, kinKey) {
		let kin = kinKey ? this.dataset.kin[kinKey] : this.rollOn(this.dataset.kin);

		character.kin = kin.key;
		if (character.kin === "elf") {
			character.age = {
				ageNumber: NaN,
				ageKey: 1,
				ageString: "Adult",
			};
			character = this.rollFormativeEvents(character);
		} else {
			if (character.age === undefined) {
				character.age = this.rollAge(kin.age);
			} else {
				character.age.ageNumber = this.rollNumber(
					kin.age[character.age.ageKey][0],
					kin.age[character.age.ageKey][1],
				);
			}
		}
		character.childhood = this.rollOn(kin.childhood);
		character.childhood.attributes = this.mappingAttributes(character);
		character.childhood.skills = this.mappingSkills(character.childhood.skills);
		return character;
	}

	mappingAttributes(character) {
		return {
			"ATTRIBUTE.STRENGTH": character.childhood.attributes.strength,
			"ATTRIBUTE.AGILITY": character.childhood.attributes.agility,
			"ATTRIBUTE.EMPATHY": character.childhood.attributes.empathy,
			"ATTRIBUTE.WITS": character.childhood.attributes.wits,
		};
	}

	mappingSkills(skills) {
		const normalize = (skill) => {
			let SKILL_NAME = skill.shift().toUpperCase().replace(/\s/g, "_");
			return SKILL_NAME.split(".").shift() === "SKILL" ? SKILL_NAME : `SKILL.${SKILL_NAME}`;
		};

		return Object.entries(skills)
			.map((skill) => ({ [normalize(skill)]: skill.pop() }))
			.reduce((skill, item) => ({ ...skill, [Object.keys(item)]: item[Object.keys(item)] }), {});
	}

	rollPath(character) {
		character.path = this.rollNumber(0, 2);

		return character;
	}

	rollFormativeEvents(character) {
		let profession = this.dataset.profession[character.profession];
		if (!profession) return character;
		let formativeEvents = [];
		let rolled = [];
		let event = {};
		if (!character.formativeEvents) {
			for (let i = 0; i < character.age.ageKey + 1; i++) {
				do {
					event = this.rollOn(profession.formativeEvents);
				} while (rolled.includes(event.key));

				rolled.push(event.key);
				formativeEvents.push(event);
			}
		} else if (character.formativeEvents.length < character.age.ageKey + 1) {
			for (let i = 0; i < character.formativeEvents.length; i++) {
				const element = character.formativeEvents[i];
				rolled.push(element.key);
				formativeEvents.push(element);
			}
			for (let i = character.formativeEvents.length; i < character.age.ageKey + 1; i++) {
				do {
					event = this.rollOn(profession.formativeEvents);
				} while (rolled.includes(event.key));

				rolled.push(event.key);
				formativeEvents.push(event);
			}
		} else if (character.formativeEvents.length > character.age.ageKey + 1) {
			formativeEvents = character.formativeEvents.slice(0, character.age.ageKey + 1);
		} else {
			// no change needed
			formativeEvents = character.formativeEvents;
		}

		character.formativeEvents = formativeEvents.map((event) => ({
			...event,
			skills: this.mappingSkills(event.skills),
		}));

		return character;
	}

	rollOn(options) {
		let rollTable = this.buildRollTable(options);
		return options[this.rollTable(rollTable)];
	}

	rollAge(ageRanges) {
		const mapping = ["Young", "Adult", "Old"];
		let age = {};
		age.ageKey = this.rollNumber(0, 2);
		age.ageNumber = this.rollNumber(ageRanges[age.ageKey][0], ageRanges[age.ageKey][1]);
		age.ageString = mapping[age.ageKey];

		return age;
	}

	buildRollTable(options) {
		let rollTable = [];
		for (const key in options) {
			// eslint-disable-next-line no-prototype-builtins
			if (options.hasOwnProperty(key)) {
				const element = options[key];
				rollTable = rollTable.concat(Array(element.weight).fill(element.key));
			}
		}
		return rollTable;
	}

	rollNumber(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	}

	rollTable(rollTable) {
		return rollTable[this.rollNumber(0, rollTable.length - 1)];
	}

	static async handleBadDataset(err, app) {
		console.error(err);
		if (!app) return ui.notifications.error("Cannot recover, try again.");
		ui.notifications.warn("Warning: Dataset not valid. See console for details. Attempting to recover.");
		app.close();

		await game.settings.set("forbidden-lands", "datasetDir", "");
		const newChargen = await new ForbiddenLandsCharacterGenerator(
			await ForbiddenLandsCharacterGenerator.loadDataset(),
			app.existActor,
		);
		return newChargen.render(true);
	}
}
