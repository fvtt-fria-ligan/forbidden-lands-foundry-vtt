import crudTest from "../helpers/crud-test";
const CLSName = "Actor";
export const individual = {
	character: () => crudTest(CLSName, "character", "Character1"),
	npc: () => crudTest(CLSName, "character", "NPC1", "npc"),
	monster: () => crudTest(CLSName, "monster", "Monster1"),
	party: () => crudTest(CLSName, "party", "Party1"),
	stronghold: () => crudTest(CLSName, "stronghold", "Stronghold1"),
};
// biome-ignore lint/complexity/noForEach: <explanation>
export const all = () => Object.values(individual).forEach((actor) => actor());
