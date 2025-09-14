declare global {
	// Hooks API
	namespace Hooks {
		function once(name: string, fn: (...args: unknown[]) => void): void;
		function on(name: string, fn: (...args: unknown[]) => void): void;
		function on(name: "canvasReady", fn: (canvas: Canvas) => void): void;
		function on(
			name: "getChatLogEntryContext",
			fn: (html: JQuery, options: EntryContextOption[]) => void,
		): void;
		function off(name: string, fn: (...args: unknown[]) => void): void;
		function call(name: string, ...args: unknown[]): boolean;
		function callAll(name: string, ...args: unknown[]): void;
	}

	// Collection base class
	class Collection<T> extends Map<string, T> {
		get(id: string): T | undefined;
		getName(name: string): T | undefined;
		filter(predicate: (item: T) => boolean): T[];
		find(predicate: (item: T) => boolean): T | undefined;
		map<U>(transform: (item: T) => U): U[];
		contents: T[];
	}

	// Base document types
	class Actor<TParent = null> {
		id: string;
		name: string;
		type: string;
		data: Record<string, unknown>;
		system: Record<string, unknown>;
		items: Collection<Item>;
		effects: Collection<ActiveEffect>;
		sheet: ActorSheet | null;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: object, options?: object | null): Promise<Actor>;
	}

	class Item<TParent = null> {
		id: string;
		name: string;
		type: string;
		data: Record<string, unknown>;
		system: Record<string, unknown>;
		actor: Actor | null;
		sheet: ItemSheet | null;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: object, options?: object | null): Promise<Item>;
	}

	class ChatMessage {
		id: string;
		data: Record<string, unknown>;
		content: string;
		speaker: Record<string, unknown>;
		user: User;
		static create(data: Record<string, unknown>): Promise<ChatMessage>;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
	}

	class Combat {
		id: string;
		data: Record<string, unknown>;
		combatants: Collection<Combatant>;
		scene: Scene;
		active: boolean;
		started: boolean;
		round: number;
		turn: number;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: Record<string, unknown>): Promise<Combat>;
	}

	class Combatant<TCombat = Combat | null, TToken = TokenDocument> {
		id: string;
		data: Record<string, unknown>;
		actor: Actor | null;
		token: TToken | null;
		combat: TCombat;
		initiative: number | null;
		hidden: boolean;
	}

	class Scene {
		id: string;
		name: string;
		data: Record<string, unknown>;
		active: boolean;
		tokens: Collection<TokenDocument>;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: Record<string, unknown>): Promise<Scene>;
	}

	class User {
		id: string;
		name: string;
		data: Record<string, unknown>;
		character: Actor | null;
		isGM: boolean;
		active: boolean;
		update(data: Record<string, unknown>): Promise<this>;
		static create(data: Record<string, unknown>): Promise<User>;
	}

	class Macro {
		id: string;
		name: string;
		data: Record<string, unknown>;
		command: string;
		execute(): Promise<unknown>;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: Record<string, unknown>): Promise<Macro>;
	}

	class ActiveEffect<TParent = Actor | Item | null> {
		id: string;
		data: Record<string, unknown>;
		label: string;
		icon: string;
		disabled: boolean;
		parent: TParent;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: Record<string, unknown>): Promise<ActiveEffect>;
	}

	class TokenDocument {
		id: string;
		data: Record<string, unknown>;
		actor: Actor | null;
		scene: Scene;
		x: number;
		y: number;
		update(data: Record<string, unknown>): Promise<this>;
		delete(): Promise<this>;
		static create(data: Record<string, unknown>): Promise<TokenDocument>;
	}

	// Additional Foundry Document types needed by global.ts
	class AmbientLightDocument<TParent = null> {
		id: string;
		data: Record<string, unknown>;
		parent: TParent;
		static create(data: Record<string, unknown>): Promise<AmbientLightDocument>;
	}

	class ActorDelta<TParent = null> {
		id: string;
		data: Record<string, unknown>;
		parent: TParent;
		static create(data: Record<string, unknown>): Promise<ActorDelta>;
	}

	class ChatLog<T = ChatMessage> {
		collection: Collection<T>;
		element: HTMLElement;
	}

	class MeasuredTemplateDocument<TParent = null> {
		id: string;
		data: Record<string, unknown>;
		parent: TParent;
		static create(
			data: Record<string, unknown>,
		): Promise<MeasuredTemplateDocument>;
	}

	class TileDocument<TParent = null> {
		id: string;
		data: Record<string, unknown>;
		parent: TParent;
		static create(data: Record<string, unknown>): Promise<TileDocument>;
	}

	class WallDocument<TParent = null> {
		id: string;
		data: Record<string, unknown>;
		parent: TParent;
		static create(data: Record<string, unknown>): Promise<WallDocument>;
	}

	class EffectsCanvasGroup {
		children: unknown[];
	}

	// Collection types
	class Actors<T = Actor> extends Collection<T> {
		static documentName: "Actor";
	}

	class Items<T = Item> extends Collection<T> {
		static documentName: "Item";
	}

	class Scenes<T = Scene> extends Collection<T> {
		static documentName: "Scene";
	}

	class Users<T = User> extends Collection<T> {
		static documentName: "User";
	}

	class Messages<T = ChatMessage> extends Collection<T> {
		static documentName: "ChatMessage";
	}

	class Macros<T = Macro> extends Collection<T> {
		static documentName: "Macro";
	}

	class CombatEncounters<T = Combat> extends Collection<T> {
		static documentName: "Combat";
	}

	// Application types
	interface ApplicationOptions {
		classes?: string[];
		template?: string;
		width?: number;
		height?: number;
		left?: number;
		top?: number;
		scale?: number;
		popOut?: boolean;
		minimizable?: boolean;
		resizable?: boolean;
		id?: string;
		title?: string;
		scrollY?: string[];
		tabs?: TabsConfiguration[];
		dragDrop?: DragDropConfiguration[];
		filters?: SearchFilterConfiguration[];
	}

	interface FormApplicationOptions extends ApplicationOptions {
		closeOnSubmit?: boolean;
		submitOnChange?: boolean;
		submitOnClose?: boolean;
		editable?: boolean;
	}

	interface TabsConfiguration {
		navSelector: string;
		contentSelector: string;
		initial: string;
	}

	interface DragDropConfiguration {
		dragSelector: string;
		dropSelector: string;
	}

	interface SearchFilterConfiguration {
		inputSelector: string;
		contentSelector: string;
	}

	class Application {
		id: string;
		element: JQuery;
		position: ApplicationPosition;
		rendered: boolean;
		_state: number;

		constructor(options?: ApplicationOptions);
		render(force?: boolean): Promise<this>;
		close(): Promise<void>;
		minimize(): Promise<void>;
		maximize(): Promise<void>;
		getData(): Record<string, unknown>;
		activateListeners(html: JQuery): void;
		static get defaultOptions(): ApplicationOptions;
	}

	interface ApplicationPosition {
		left: number;
		top: number;
		width: number;
		height: number;
		scale: number;
	}

	class FormApplication extends Application {
		object: Record<string, unknown>;
		form: HTMLFormElement | null;
		isEditable: boolean;

		constructor(
			object?: Record<string, unknown> | object,
			options?: FormApplicationOptions,
		);
		submit(options?: Record<string, unknown>): Promise<void>;
		protected _updateObject(
			event?: Event,
			formData?: Record<string, unknown>,
		): Promise<unknown>;
		static get defaultOptions(): FormApplicationOptions;
	}

	class ActorSheet extends FormApplication {
		actor: Actor;
		token: TokenDocument | null;

		constructor(actor: Actor, options?: FormApplicationOptions);
		static get defaultOptions(): FormApplicationOptions;
	}

	class ItemSheet extends FormApplication {
		item: Item;

		constructor(item: Item, options?: FormApplicationOptions);
		static get defaultOptions(): FormApplicationOptions;
	}

	interface DialogData {
		title?: string;
		content?: string;
		buttons?: Record<string, DialogButton>;
		default?: string;
		render?: (html: JQuery) => void;
		close?: (html: JQuery) => void;
		options?: ApplicationOptions;
		callback?: (result: unknown) => void;
		rejectClose?: boolean;
	}

	interface DialogButton {
		label: string;
		icon?: string;
		callback?: (html: JQuery) => void;
	}

	class Dialog extends Application {
		data: DialogData;
		callback: ((result: unknown) => void) | null;

		constructor(data: DialogData, options?: ApplicationOptions);
		static confirm(config: DialogData): Promise<boolean>;
		static prompt(config: DialogData): Promise<string>;
		static wait(
			data: DialogData,
			options?: ApplicationOptions,
		): Promise<unknown>;
	}

	// UI Directory Classes
	class ActorDirectory<T = Actor> extends Application {
		collection: Collection<T>;
	}

	class ItemDirectory<T = Item> extends Application {
		collection: Collection<T>;
	}

	class CombatTracker<T = Combat> extends Application {
		combat: T | null;
	}

	class CompendiumDirectory extends Application {
		packs: Collection<unknown>;
	}

	class Hotbar extends Application {
		macros: unknown[];
	}

	class SceneControls extends Application {}
	class MainMenu extends Application {}
	class SceneNavigation extends Application {}
	class Notifications extends Application {}
	class Pause extends Application {}
	class PlayerList extends Application {}
	class Settings extends Application {}
	class Sidebar extends Application {}
	class RollTableDirectory extends Application {}
	class CameraViews extends Application {}

	interface FoundryUI<
		TActor = ActorDirectory,
		TItem = ItemDirectory,
		TChat = ChatLog,
		TCompendium = CompendiumDirectory,
		TCombat = CombatTracker,
	> {
		actors: TActor;
		items: TItem;
		chat: TChat;
		compendium: TCompendium;
		combat: TCombat;
		controls: SceneControls;
		hotbar: Hotbar;
		menu: MainMenu;
		nav: SceneNavigation;
		notifications: Notifications;
		pause: Pause;
		players: PlayerList;
		settings: Settings;
		sidebar: Sidebar;
		tables: RollTableDirectory;
		webrtc: CameraViews;
	}

	// Utility classes
	class Localization {
		localize(key: string): string;
		format(key: string, data?: Record<string, unknown>): string;
		has(key: string): boolean;
	}

	class ClientSettings {
		get(module: string, key: string): unknown;
		set(module: string, key: string, value: unknown): Promise<unknown>;
		register(module: string, key: string, data: ClientSettingsData): void;
	}

	interface ClientSettingsData {
		name: string;
		hint?: string;
		scope: "world" | "client";
		config: boolean;
		default?: unknown;
		type?: typeof String | typeof Number | typeof Boolean | typeof Object;
		choices?: Record<string, string>;
		range?: { min: number; max: number; step: number };
		onChange?: (value: unknown) => void;
	}

	// Canvas and rendering
	class Canvas {
		ready: boolean;
		scene: Scene | null;
		dimensions: CanvasDimensions;
		stage: PIXI.Container;
		tokens: TokenLayer;
		lighting: LightingLayer;
		sounds: SoundsLayer;
		templates: TemplateLayer;
		tiles: TilesLayer;
		drawings: DrawingsLayer;
		walls: WallsLayer;
		controls: ControlsLayer;
		notes: NotesLayer;
		sight: SightLayer;
		effects: EffectsLayer;
		weather: WeatherLayer;
		grid: GridLayer;
		background: BackgroundLayer;
		foreground: ForegroundLayer;
		hud: CanvasHUD;

		draw(): Promise<void>;
		pan(options: CanvasPanOptions): Promise<void>;
	}

	interface CanvasDimensions {
		width: number;
		height: number;
		rect: Rectangle;
		sceneX: number;
		sceneY: number;
		sceneWidth: number;
		sceneHeight: number;
		size: number;
		distance: number;
	}

	interface CanvasPanOptions {
		x?: number;
		y?: number;
		scale?: number;
		duration?: number;
	}

	class CanvasLayer extends PIXI.Container {
		options: Record<string, unknown>;
		active: boolean;

		draw(): Promise<void>;
		activate(): void;
		deactivate(): void;
	}

	class TokenLayer extends CanvasLayer {}
	class LightingLayer extends CanvasLayer {}
	class SoundsLayer extends CanvasLayer {}
	class TemplateLayer extends CanvasLayer {}
	class TilesLayer extends CanvasLayer {}
	class DrawingsLayer extends CanvasLayer {}
	class WallsLayer extends CanvasLayer {}
	class ControlsLayer extends CanvasLayer {}
	class NotesLayer extends CanvasLayer {}
	class SightLayer extends CanvasLayer {}
	class EffectsLayer extends CanvasLayer {}
	class WeatherLayer extends CanvasLayer {}
	class GridLayer extends CanvasLayer {}
	class BackgroundLayer extends CanvasLayer {}
	class ForegroundLayer extends CanvasLayer {}

	class CanvasHUD {
		token: TokenHUD;
	}

	class TokenHUD extends Application {
		object: Token | null;

		bind(token: Token): void;
		clear(): void;
		_getStatusEffectChoices(): Record<string, unknown>;
	}

	class Token extends PIXI.Container {
		id: string;
		document: TokenDocument;
		scene: Scene;
		actor: Actor | null;
		controlled: boolean;
		x: number;
		y: number;
		width: number;
		height: number;

		control(options?: Record<string, unknown>): boolean;
		release(options?: Record<string, unknown>): boolean;
	}

	// Status effect type
	interface StatusEffect {
		id: string;
		label: string;
		icon: string;
		changes?: Array<{
			key: string;
			mode: number;
			value: string | number | boolean;
		}>;
		statuses?: string[];
	}

	// Context menu types
	type ContextOptionCondition = (li: JQuery) => boolean;

	interface EntryContextOption {
		name: string;
		icon: string;
		condition?: ContextOptionCondition;
		callback: (li: JQuery) => void;
	}

	// Core Game class
	class Game<
		TActor = Actor,
		TActors = Actors<TActor>,
		TChatMessage = ChatMessage,
		TCombat = Combat,
		TItem = Item,
		TMacro = Macro,
		TScene = Scene,
		TUser = User,
	> {
		actors: TActors;
		items: Items;
		scenes: Scenes;
		users: Users;
		messages: Messages;
		macros: Macros;
		combats: CombatEncounters;
		i18n: Localization;
		settings: ClientSettings;
		canvas: Canvas;
		version: string;
		data: Record<string, unknown>;
		world: Record<string, unknown>;
		user: TUser;
		ready: boolean;
		paused: boolean;
	}

	// Config interface
	interface Config<
		TAmbientLight = AmbientLightDocument,
		TActiveEffect = ActiveEffect,
		TActor = Actor,
		TActorDelta = ActorDelta,
		TChatLog = ChatLog,
		TChatMessage = ChatMessage,
		TCombat = Combat,
		TCombatant = Combatant,
		TCombatTracker = CombatTracker,
		TCompendiumDirectory = CompendiumDirectory,
		THotbar = Hotbar,
		TItem = Item,
		TMacro = Macro,
		TMeasuredTemplate = MeasuredTemplateDocument,
		TTile = TileDocument,
		TToken = TokenDocument,
		TWall = WallDocument,
		TScene = Scene,
		TUser = User,
		TEffectsCanvasGroup = EffectsCanvasGroup,
	> {
		debug: {
			hooks: boolean;
			dice: boolean;
			documents: boolean;
			fog: boolean;
			sight: boolean;
			sightRays: boolean;
			av: boolean;
			avclient: boolean;
			mouseInteraction: boolean;
			time: boolean;
		};
		Actor: {
			documentClass: typeof Actor;
			typeLabels: Record<string, string>;
		};
		Item: {
			documentClass: typeof Item;
			typeLabels: Record<string, string>;
		};
		statusEffects: StatusEffect[];
		Dice: {
			terms: Record<string, unknown>;
		};
	}

	// FBL-specific extensions
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
			config: Record<string, unknown>;
			roll: (...args: unknown[]) => unknown;
		};
	}

	// TokenHUD status effect choice interface
	interface TokenHUDStatusEffectChoice {
		id: string;
		title: string | null;
		src: string;
		isActive: boolean;
		isOverlay: boolean;
		cssClass: string;
	}

	// Foundry namespace
	namespace foundry {
		namespace applications {
			namespace hud {
				class TokenHUD extends Application {
					object: Token;

					bind(token: Token): void;
					clear(): void;
					_getStatusEffectChoices(): Record<
						string,
						TokenHUDStatusEffectChoice | undefined
					>;
				}
			}
		}

		namespace utils {
			function getProperty(
				object: Record<string, unknown>,
				key: string,
			): unknown;
			function setProperty(
				object: Record<string, unknown>,
				key: string,
				value: unknown,
			): boolean;
			function hasProperty(
				object: Record<string, unknown>,
				key: string,
			): boolean;
			function expandObject(
				obj: Record<string, unknown>,
			): Record<string, unknown>;
			function flattenObject(
				obj: Record<string, unknown>,
			): Record<string, unknown>;
		}
	}

	// Global variables
	var game: GameFBL;
	var canvas: Canvas;
	var ui: FoundryUI<
		ActorDirectory<Actor<null>>,
		ItemDirectory<Item<null>>,
		ChatLog<ChatMessage>,
		CompendiumDirectory,
		CombatTracker<Combat>
	>;

	// PIXI types (minimal)
	namespace PIXI {
		class Container {
			children: Container[];
			parent: Container | null;
			addChild(...children: Container[]): Container;
			removeChild(...children: Container[]): Container;
		}

		class Graphics extends Container {}
		class Sprite extends Container {}
		class Text extends Container {}
	}

	// Rectangle utility
	class Rectangle {
		x: number;
		y: number;
		width: number;
		height: number;

		constructor(x?: number, y?: number, width?: number, height?: number);
	}
}

export type {};
