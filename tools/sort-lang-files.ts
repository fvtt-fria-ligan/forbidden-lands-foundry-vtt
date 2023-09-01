import fs from "node:fs";

const dir = fs.readdirSync("./static/lang");

const files = dir.filter((file) => file.endsWith(".json"));

for (const file of files) {
	const contents = fs.readFileSync(`./static/lang/${file}`, "utf8");
	const json = JSON.parse(contents);
	const entries = Object.entries(json);
	const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]));
	const obj = Object.fromEntries(sorted);
	fs.writeFileSync(`./static/lang/${file}`, JSON.stringify(obj, null, "\t"));
}
