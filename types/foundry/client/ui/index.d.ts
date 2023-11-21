import "./context.js";
import "./dialog.js";
import "./dragdrop.js";
import "./editor.js";
import "./filepicker.js";
import "./notifications.js";
import "./prosemirror.js";
import "./secrets.js";
import "./tabs.js";
import "./tooltip.js";
import "./tour.js";

declare global {
	interface FoundryUI<
		TActorDirectory extends ActorDirectory<Actor<null>>,
		TItemDirectory extends ItemDirectory<Item<null>>,
		TChatLog extends ChatLog,
		TCompendiumDirectory extends CompendiumDirectory,
		TCombatTracker extends CombatTracker<Combat | null>,
	> {
		actors: TActorDirectory;
		chat: TChatLog;
		combat: TCombatTracker;
		compendium: TCompendiumDirectory;
		controls: SceneControls;
		items: TItemDirectory;
		notifications: Notifications;
		settings: Settings;
		sidebar: Sidebar;
		tables: RollTableDirectory;
		windows: Record<number, Application>;
	}
}
