import type EnJSON from "../lang/en.json";
import type CONFIG_FBL from "$system/core/config";
import type { FBLRollHandler } from "$components/roll-engine/engine";

interface GameFBL
	extends Game<
		Actor<null>,
		Actors<Actor<null>>,
		ChatMessage,
		Combat,
		Item<null>,
		Macro,
		Scene,
		User
	> {
	fbl: {
		config: typeof CONFIG_FBL;
		roll: typeof FBLRollHandler.createRoll;
	};
}

type ConfiguredConfig = Config<
	AmbientLightDocument<Scene>,
	ActiveEffect<Actor | Item | null>,
	Actor,
	ActorDelta<TokenDocument>,
	ChatLog<ChatMessage>,
	ChatMessage,
	Combat,
	Combatant<Combat | null, TokenDocument>,
	CombatTracker<Combat | null>,
	CompendiumDirectory,
	Hotbar,
	Item,
	Macro,
	MeasuredTemplateDocument<Scene>,
	TileDocument<Scene>,
	TokenDocument,
	WallDocument<Scene | null>,
	Scene,
	User,
	EffectsCanvasGroup
>;

declare global {
	interface ConfigFBL extends ConfiguredConfig {
		debug: ConfiguredConfig["debug"] & {
			ruleElement: boolean;
		};
		fbl: typeof CONFIG_FBL;
		tests: typeof import("./tests/foundry-scripts").default;
		time: {
			roundTime: number;
		};
	}

	const CONFIG: ConfigFBL;

	namespace globalThis {
		// biome-ignore lint/style/noVar: <explanation>
		var game: GameFBL;

		// biome-ignore lint/style/noVar: <explanation>
		var ui: FoundryUI<
			ActorDirectory<Actor<null>>,
			ItemDirectory<Item<null>>,
			ChatLog<ChatMessage>,
			CompendiumDirectory,
			CombatTracker<Combat>
		>;

		interface Math {
			eq: (a: number, b: number) => boolean;
			gt: (a: number, b: number) => boolean;
			gte: (a: number, b: number) => boolean;
			lt: (a: number, b: number) => boolean;
			lte: (a: number, b: number) => boolean;
			ne: (a: number, b: number) => boolean;
			ternary: (
				condition: boolean | number,
				ifTrue: number,
				ifFalse: number,
			) => number;
		}
	}

	//interface ClientSettings {}

	//interface ClientSettingsMap {}

	const EN_JSON: typeof EnJSON;
}
