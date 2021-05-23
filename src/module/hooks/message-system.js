import semverComp from "../utils/semver-compare";

export default async function displayMessages() {
	const { messages } = await fetch("systems/forbidden-lands/assets/messages/messages.jsonc")
		.then((resp) => resp.text())
		.then((jsonc) => JSON.parse(stripJSON(jsonc)));

	messages.forEach((message) => {
		handleDisplay(message);
	});
}

const stripJSON = (data) => {
	return data.replace(/[^:]\/\/(.*)/g, "");
};

const handleDisplay = (msg) => {
	const { content, title, type } = msg;
	if (!isCurrent(msg)) return;
	if (type === "prompt") return displayPrompt(title, content);
};

const isCurrent = (msg) => {
	const isDisplayable = !msg.display === "once" || !hasDisplayed(msg.title);
	const correctCoreVersion = semverComp(
		msg["min-core-version"] ?? "0.0.0",
		game.data.version,
		msg["max-core-version"] ?? "100.0.0",
		{ gEqMin: true },
	);
	const correctSysVersion = semverComp(
		msg["min-sys-version"] ?? "0.0.0",
		game.system.data.version,
		msg["max-sys-version"] ?? "100.0.0",
		{ gEqMin: true },
	);
	return isDisplayable && correctCoreVersion && correctSysVersion;
};

const hasDisplayed = (identifier) => {
	const settings = game.settings.get("forbidden-lands", "messages")[0];
	if (settings?.includes(identifier)) return true;
	else return false;
};

const displayPrompt = (title, content) => {
	content = content.replace("{name}", game.user.name);
	return Dialog.prompt({
		title: title,
		content: content,
		label: "Understood!",
		options: { width: 600 },
		callback: async () => {
			const settings = game.settings.get("forbidden-lands", "messages");
			settings[0].push(title);
			await game.settings.set("forbidden-lands", "messages", settings.flat());
		},
	});
};
