export class ForbiddenLandsStrongholdSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["forbidden-lands", "sheet", "actor"],
            template: "systems/forbidden-lands/model/stronghold.html",
            width: 600,
            height: 700,
            resizable: false,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "building"}]
        });
    }

    getData() {
        const data = super.getData();
        this.computeItems(data);
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
        html.find('.building.item .name').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            const gear = this.actor.getOwnedItem(div.data("itemId"));
            this.sendBuildingToChat(gear);
        });html.find('.hireling.item .name').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            const gear = this.actor.getOwnedItem(div.data("itemId"));
            this.sendHirelingToChat(gear);
        });
        html.find('.gear.item .name').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            const gear = this.actor.getOwnedItem(div.data("itemId"));
            if (gear.type === "weapon") {
                this.sendWeaponToChat(gear);
            } else if (gear.type === "armor") {
                this.sendArmorToChat(gear);
            } else if (gear.type === "artifact") {
                this.sendArtifactToChat(gear);
            } else if (gear.type === "rawMaterial") {
                this.sendRawMaterialToChat(gear);
            } else {
                this.sendGearToChat(gear);
            }
        });
    }

    computeItems(data) {
        for (let item of Object.values(data.items)) {
            item.isWeapon = item.type === 'weapon';
            item.isArmor = item.type === 'armor';
            item.isGear = item.type === 'gear';
            item.isRawMaterial = item.type === 'rawMaterial';
            item.isArtifact = item.type === 'artifact';
            item.isWeaponOrArmor = item.isWeapon || item.isArmor;
            item.isBuilding = item.type === 'building';
            item.isHireling = item.type === 'hireling';
        }
    }

    onItemCreate(event) {
        event.preventDefault();
        let header = event.currentTarget;
        let data = duplicate(header.dataset);
        data["name"] = `New ${data.type.capitalize()}`;
        this.actor.createEmbeddedEntity("OwnedItem", data);
    }

    sendBuildingToChat(building) {
        let message = "<b>" + building.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("BUILDING.REQUIREMENT") + ": </b>" + building.data.data.requirement + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.RAW_MATERIALS") + ": </b>" + building.data.data.rawMaterials + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.TOOLS") + ": </b>" + building.data.data.tools + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.TIME") + ": </b>" + building.data.data.time + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.EFFECT") + ": </b>" + building.data.data.effect + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.REPUTATION") + ": </b>" + building.data.data.reputation + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.NUMBER") + ": </b>" + building.data.data.number + "</br>" +
            "<b>" + game.i18n.localize("BUILDING.DESCRIPTION") + ": </b>" + building.data.data.description;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendHirelingToChat(hireling) {
        let message = "<b>" + hireling.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("HIRELING.SUPPLY") + ": </b>" + hireling.data.data.supply + "</br>" +
            "<b>" + game.i18n.localize("HIRELING.SALARY") + ": </b>" + hireling.data.data.salary + "</br>" +
            "<b>" + game.i18n.localize("HIRELING.NUMBER") + ": </b>" + hireling.data.data.number + "</br>" +
            "<b>" + game.i18n.localize("HIRELING.DESCRIPTION") + ": </b>" + hireling.data.data.description;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendGearToChat(gear) {
        let message = "<b>" + gear.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("GEAR.COST") + ": </b>" + gear.data.data.cost + "</br>" +
            "<b>" + game.i18n.localize("GEAR.SUPPLY") + ": </b>" + gear.data.data.supply + "</br>" +
            "<b>" + game.i18n.localize("GEAR.WEIGHT") + ": </b>" + gear.data.data.weight + "</br>" +
            "<b>" + game.i18n.localize("GEAR.RAW_MATERIAL") + ": </b>" + gear.data.data.rawMaterials + "</br>" +
            "<b>" + game.i18n.localize("GEAR.TIME") + ": </b>" + gear.data.data.time + "</br>" +
            "<b>" + game.i18n.localize("GEAR.TALENT") + ": </b>" + gear.data.data.talent + "</br>" +
            "<b>" + game.i18n.localize("GEAR.TOOLS") + ": </b>" + gear.data.data.tools + "</br>" +
            "<b>" + game.i18n.localize("GEAR.EFFECT") + ": </b>" + gear.data.data.effect;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendWeaponToChat(weapon) {
        let message = "<b>" + weapon.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("WEAPON.CATEGORY") + ": </b>" + weapon.data.data.category + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.GRIP") + ": </b>" + weapon.data.data.grip + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.BONUS") + ": </b>" + weapon.data.data.bonus + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.DAMAGE") + ": </b>" + weapon.data.data.damage + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.RANGE") + ": </b>" + weapon.data.data.range + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.FEATURE") + ": </b>" + weapon.data.data.features;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendArtifactToChat(artifact) {
        let message = "<b>" + artifact.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("WEAPON.CATEGORY") + ": </b>" + artifact.data.data.category + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.GRIP") + ": </b>" + artifact.data.data.grip + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.BONUS") + ": </b>" + artifact.data.data.bonus + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.DAMAGE") + ": </b>" + artifact.data.data.damage + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.RANGE") + ": </b>" + artifact.data.data.range + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.FEATURE") + ": </b>" + artifact.data.data.features + "</br>" +
            "<b>" + game.i18n.localize("ARTIFACT.APPEARANCE") + ": </b>" + artifact.data.data.appearance + "</br>" +
            "<b>" + game.i18n.localize("ARTIFACT.DESCRIPTION") + ": </b>" + artifact.data.data.description + "</br>" +
            "<b>" + game.i18n.localize("ARTIFACT.DRAWBACK") + ": </b>" + artifact.data.data.drawback;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendRawMaterialToChat(gear) {
        let message = "<b>" + gear.name.toUpperCase() + "</b></br></br>" +
            "<b>" + game.i18n.localize("GEAR.COST") + ": </b>" + gear.data.data.cost + "</br>" +
            "<b>" + game.i18n.localize("RAW_MATERIAL.SHELF_LIFE") + ": </b>" + gear.data.data.shelfLife + "</br>" +
            "<b>" + game.i18n.localize("GEAR.RAW_MATERIAL") + ": </b>" + gear.data.data.rawMaterials + "</br>" +
            "<b>" + game.i18n.localize("GEAR.TALENT") + ": </b>" + gear.data.data.talent + "</br>" +
            "<b>" + game.i18n.localize("GEAR.TOOLS") + ": </b>" + gear.data.data.tools;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }

    sendArmorToChat(artifact) {
        let message = "<b>" + artifact.name.toUpperCase() + "</b></br>" +
            "<b>" + game.i18n.localize("ARMOR.RATING") + ": </b>" + artifact.data.data.rating.max + "</br>" +
            "<b>" + game.i18n.localize("ARMOR.PART") + ": </b>" + artifact.data.data.part + "</br>" +
            "<b>" + game.i18n.localize("WEAPON.FEATURE") + ": </b>" + artifact.data.data.features;
        let chatData = {
            user: game.user._id,
            content: message
        };
        ChatMessage.create(chatData, {});
    }
}
