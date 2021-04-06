
export class CharacterConverter {
    constructor(dataset) {
        this.character = null;
        this.dataset = dataset;
    }

    convert(character) {
        this.character = character;
        let actorData = {
            name: this.getCharacterName(),
            type: "character",
            img: "",
            data: this.buildCharacterData(),
            token: {},
            items: this.buildCharacterItems(),
            flags: {}
        }

        return actorData;
    }

    getCharacterName() {
        const kin = this.dataset.kin[this.character.kin];
        const age = this.character.age;
        const profession = this.dataset.profession[this.character.profession];
        
        return `${age.ageString} ${kin.name} ${profession.name}`;
    }

    buildCharacterData() {
        const kin = this.dataset.kin[this.character.kin];
        const age = this.character.age;
        const agePenalty = age.ageKey;
        const profession = this.dataset.profession[this.character.profession];

        let data = {
            bio: {
                kin: { value: kin.name },
                age: { value: age.ageNumber },
                profession: { value: profession.name },
                note: { value: this.generateNotes(this.character)},
            },
            consumable: {
                food: {value: profession.consumables.food},
                water: {value: profession.consumables.water},
                arrows: {value: profession.consumables.arrows},
                torches: {value: profession.consumables.torches},
            },
            currency: {
                gold: {value: profession.currency.gold > 0 ? this.rollNumber(1, profession.currency.gold) : 0},
                silver: {value: profession.currency.silver > 0 ? this.rollNumber(1, profession.currency.silver) : 0},
                copper: {value: profession.currency.copper > 0 ? this.rollNumber(1, profession.currency.copper) : 0},
            },
            attribute: this.generateAttributes(),
            skill: this.generateSkills(),
        };

        return data;
    }

    buildCharacterItems() {
        let items = [];

        items = items.concat(this.buildTalents());
        items = items.concat(this.buildGear());
        items = items.concat(this.buildEventGear());

        return items;
    }

    buildEventGear() {
        let gear = [];
        for (let i = 0; i < this.character.formativeEvents.length; i++) {
            let event = this.character.formativeEvents[i];
            gear.push(this.createNewItem(event.items));
        }

        return gear;
    }

    buildGear() {
        const profession = this.dataset.profession[this.character.profession];
        let gear = [];
        for (let i = 0; i < profession.equipment.length; i++) {
            let item = profession.equipment[i];
            if (Array.isArray(item)) { // array from which only one item must be picked
                item = item[this.rollNumber(0, item.length-1)];
            }
            gear.push(this.getExactItem(item));
        }

        return gear;
    }

    buildTalents() {
        const kin = this.dataset.kin[this.character.kin];
        const profession = this.dataset.profession[this.character.profession];
        let talents = [
            this.getItem(kin.talent, 'talent'),
            this.getItem(profession.paths[this.character.path], 'talent'),
        ];
        for (let i = 0; i < this.character.formativeEvents.length; i++) {
            const event = this.character.formativeEvents[i];
            talents.push(this.getExactItem(event.talent, 'talent'));
        }

        return talents;
    }

    getExactItem(name, type = false) {
        const nameLowerCase = name.toLowerCase();
        type = type ? type.toLowerCase() : type;
        let item = game.items.find(i => i.name.toLowerCase() === nameLowerCase && (type === false || i.type === type));
        if (!item) {
            item = this.createNewItem(name, type);
        }
        return item;
    }

    getItem(name, type = false) {
        const nameLowerCase = name.toLowerCase();
        type = type ? type.toLowerCase() : type;
        let item = game.items.find(i => i.name.toLowerCase().includes(nameLowerCase) && (type === false || i.type === type));
        if (!item) {
            item = this.createNewItem(name, type);
        }
        return item;
    }

    createNewItem(name, type = false) {
        let ItemClass = CONFIG.Item.entityClass;
        return new ItemClass({
            name: name,
            type: type || 'gear',
            data: type === 'talent' ? {} : { weight: 'tiny' }
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
            strength: {value: attributes.strength, max: attributes.strength},
            agility: {value: attributes.agility, max: attributes.agility},
            wits: {value: attributes.wits, max: attributes.wits},
            empathy: {value: attributes.empathy, max: attributes.empathy},
        };
    }

    generateSkills() {
        let tmpSkills = JSON.parse(JSON.stringify(this.character.childhood.skills));
        let skills = {};

        for (let i = 0; i < this.character.formativeEvents.length; i++) {
            const eventSkills = this.character.formativeEvents[i].skills;
            for (const skillName in eventSkills) {
                if (eventSkills.hasOwnProperty(skillName)) {                    
                    if (tmpSkills[skillName] === undefined) {
                        tmpSkills[skillName] = 0;
                    } else {
                        tmpSkills[skillName] = parseInt(tmpSkills[skillName]);
                    }
                    tmpSkills[skillName] += parseInt(eventSkills[skillName]);
                }
            }
        }
        for (const skillName in tmpSkills) {
            if (tmpSkills.hasOwnProperty(skillName)) {
                skills[skillName] = {value: tmpSkills[skillName]}
            }
        }
        return skills;
    }

    generateNotes(character) {
        const childhood = character.childhood;
        let notes = `<h2>Childhood: ${childhood.name}</h2><p>${childhood.description}</p>`;
        for (let i = 0; i < character.formativeEvents.length; i++) {
            const event = character.formativeEvents[i];
            notes += `<h2>Formative Event: ${event.name}</h2><p>${event.description}</p>`;
        }
        return notes;
    }

    rollNumber(min, max) {
        return Math.floor(Math.random() * (max+1-min)) + min;
    }
}
