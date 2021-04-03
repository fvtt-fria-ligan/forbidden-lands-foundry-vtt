import {
	ArtifactD10,
	ArtifactD12,
	ArtifactD8,
	BaseDie,
	ForbiddenLandsD6,
	GearDie,
	SkillDie,
} from "../components/dice.js";

export function registerDice() {
	CONFIG.Dice.terms.b = BaseDie;
	CONFIG.Dice.terms.g = GearDie;
	CONFIG.Dice.terms.s = SkillDie;
	CONFIG.Dice.terms["6"] = ForbiddenLandsD6;
	CONFIG.Dice.terms["8"] = ArtifactD8;
	CONFIG.Dice.terms["10"] = ArtifactD10;
	CONFIG.Dice.terms["12"] = ArtifactD12;
}
