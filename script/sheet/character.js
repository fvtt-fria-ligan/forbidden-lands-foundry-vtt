export class ForbiddenLandsCharacterSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["forbidden-lands", "sheet", "actor"],
            template: "systems/forbidden-lands/model/character.html",
            width: 600,
            height: 700,
            resizable: false,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}]
        });
    }

    getData() {
        const data = super.getData();
        this.computeSkills(data);
        this.computeItems(data);
        console.log(data);
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-create').click(ev => {
            this.onItemCreate(ev)
        });
        html.find('.item-edit').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(div.data("itemId"));
            item.sheet.render(true);
        });
        html.find('.item-delete').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(div.data("itemId"));
            div.slideUp(200, () => this.render(false));
        });
        html.find('.condition').click(ev => {
            const conditionName = $(ev.currentTarget).data("key");
            const conditionValue = this.actor.data.data.condition[conditionName].value
            this.actor.data.data.condition[conditionName].value = !conditionValue;
            this._render();
        });
    }

    computeSkills(data) {
        for (let skill of Object.values(data.data.skill)) {
            skill.hasStrength = skill.attribute === 'strength';
            skill.hasAgility = skill.attribute === 'agility';
            skill.hasWits = skill.attribute === 'wits';
            skill.hasEmpathy = skill.attribute === 'empathy';
        }
    }

    computeItems(data) {
        for (let item of Object.values(data.items)) {
            item.isTalent = item.type === 'talent';
            item.isWeapon = item.type === 'weapon';
            item.isArmor = item.type === 'armor';
            item.isGear = item.type === 'gear';
            item.isArtifact = item.type === 'artifact';
            item.isSpell = item.type === 'spell';
            item.isCriticalInjury = item.type === 'critical injury';
        }
    }

    onItemCreate(event) {
        event.preventDefault();
        let header = event.currentTarget;
        let data = duplicate(header.dataset);
        data["name"] = `New ${data.type.capitalize()}`;
        this.actor.createEmbeddedEntity("OwnedItem", data);
    }
}
