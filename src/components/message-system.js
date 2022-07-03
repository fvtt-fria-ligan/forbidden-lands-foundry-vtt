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
	if (type === "chat") return sendToChat(title, content);
};

const isCurrent = (msg) => {
	const isDisplayable = !msg.display === "once" || !hasDisplayed(msg.title);
	const correctCoreVersion =
		foundry.utils.isNewerVersion(msg["max-core-version"] ?? "100.0.0", game.version) &&
		foundry.utils.isNewerVersion(game.version, msg["min-core-version"] ?? "0.0.0");
	const correctSysVersion = semverComp(
		msg["min-sys-version"] ?? "0.0.0",
		game.system.version,
		msg["max-sys-version"] ?? "100.0.0",
		{ gEqMin: true },
	);
	return isDisplayable && correctCoreVersion && correctSysVersion;
};

const hasDisplayed = (identifier) => {
	const settings = game.settings.get("forbidden-lands", "messages");
	if (settings?.includes(identifier)) return true;
	else return false;
};

const displayPrompt = (title, content) => {
	content = content.replace("{name}", game.user.name);
	return Dialog.prompt({
		title: title,
		content: content,
		label: "Understood!",
		options: { width: 600, height: 700 },
		callback: () => setDisplayed(title),
	});
};

const sendToChat = (title, content) => {
	content = content.replace("{name}", game.user.name);
	setDisplayed(title);
	return ChatMessage.create({
		title: title,
		content: `<div class="forbidden-lands chat-item">${content}</div>`,
	});
};

const setDisplayed = async (identifier) => {
	const settings = game.settings.get("forbidden-lands", "messages");
	settings.push(identifier);
	await game.settings.set("forbidden-lands", "messages", settings.flat());
};
