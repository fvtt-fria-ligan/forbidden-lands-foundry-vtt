export class CharacterConverter {
	constructor(dataset) {
		this.character = null;
		this.dataset = dataset;
	}

	async convert(character) {
		this.character = character;
		let actorData = {
			data: this.buildCharacterData(),
			items: this.buildCharacterItems(),
		};

		return actorData;
	}

	buildCharacterData() {
		const kin = this.dataset.kin[this.character.kin];
		const age = this.character.age;
		// eslint-disable-next-line no-unused-vars
		const agePenalty = age.ageKey;
		const profession = this.dataset.profession[this.character.profession];

		let data = {
			bio: {
				kin: { value: kin.name },
				age: { value: age.ageNumber },
				profession: { value: profession.name },
				note: { value: this.generateNotes(this.character) },
			},
			consumable: {
				food: { value: profession.consumables.food },
				water: { value: profession.consumables.water },
				arrows: { value: profession.consumables.arrows },
				torches: { value: profession.consumables.torches },
			},
			currency: {
				gold: { value: profession.currency.gold > 0 ? this.rollNumber(1, profession.currency.gold) : 0 },
				silver: { value: profession.currency.silver > 0 ? this.rollNumber(1, profession.currency.silver) : 0 },
				copper: { value: profession.currency.copper > 0 ? this.rollNumber(1, profession.currency.copper) : 0 },
			},
			attribute: this.generateAttributes(),
			skill: this.generateSkills(),
		};

		return data;
	}

	buildCharacterItems() {
		let items = [];

		items = items.concat(this.buildTalents());
		items = items.concat(this.buildEventGear());

		return items;
	}

	buildEventGear() {
		let gear = [];
		for (let i = 0; i < this.character.formativeEvents.length; i++) {
			let event = this.character.formativeEvents[i];
			gear.push(this.createNewItem(event.items).toObject());
		}

		return gear;
	}

	buildTalents() {
		const kin = this.dataset.kin[this.character.kin];
		const profession = this.dataset.profession[this.character.profession];
		let talents = [
			this.getItem(kin.talent, "talent"),
			this.getItem(profession.paths[this.character.path], "talent"),
		];
		for (let i = 0; i < this.character.formativeEvents.length; i++) {
			const event = this.character.formativeEvents[i];
			talents.push(this.getExactItem(event.talent, "talent"));
		}

		return talents;
	}

	getExactItem(itemName, type = false) {
		const nameLowerCase = itemName.toLowerCase();
		type = type ? type.toLowerCase() : type;
		let item = game.items.find(
			(i) => i.name.toLowerCase() === nameLowerCase && (type === false || i.type === type),
		);
		if (!item) {
			item = this.createNewItem(itemName, type);
		}
		return item.toObject();
	}

	getItem(itemName, type = false) {
		const nameLowerCase = itemName.toLowerCase();
		type = type ? type.toLowerCase() : type;
		let item = game.items.find(
			(i) => i.name.toLowerCase().includes(nameLowerCase) && (type === false || i.type === type),
		);
		if (!item) {
			item = this.createNewItem(itemName, type);
		}
		return item.toObject();
	}

	createNewItem(itemName, type = false) {
		let ItemClass = CONFIG.Item.documentClass;
		return new ItemClass({
			name: itemName,
			type: type || "gear",
			data: type === "talent" ? {} : { weight: "none" },
		});
	}

	generateAttributes() {
		let attributes = JSON.parse(JSON.stringify(this.character.childhood.attributes));
		const agePenalty = this.character.age.ageKey;

		const attrs = ["strength", "agility", "wits", "empathy"];
		for (let i = 0; i < agePenalty; i++) {
			attributes[attrs[this.rollNumber(0, 3)]] -= 1;
		}

		return {
			strength: { value: attributes.strength, max: attributes.strength },
			agility: { value: attributes.agility, max: attributes.agility },
			wits: { value: attributes.wits, max: attributes.wits },
			empathy: { value: attributes.empathy, max: attributes.empathy },
		};
	}

	generateSkills() {
		const skills = Object.keys(game.fbl.config.skills).reduce((obj, skill) => {
			const skillValue = { value: 0 };
			return { ...obj, [skill]: skillValue };
		}, {});

		function increaseSkill(skillObj) {
			for (const [skillName, skillValue] of Object.entries(skillObj)) {
				skills[skillName].value += parseInt(skillValue);
			}
		}

		increaseSkill(this.character.childhood.skills);

		for (const event of this.character.formativeEvents) {
			increaseSkill(event.skills);
		}

		return skills;
	}

	generateNotes(character) {
		const childhood = character.childhood;
		let notes = `<h3>Childhood: ${childhood.name}</h3><p>${childhood.description}</p>`;
		for (let i = 0; i < character.formativeEvents.length; i++) {
			const event = character.formativeEvents[i];
			notes += `<h3>Formative Event: ${event.name}</h3><p>${event.description}</p>`;
		}
		const noteWrapper = `<div class="fbl-core">${notes}</div>`;
		return noteWrapper;
	}

	rollNumber(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	}
}
