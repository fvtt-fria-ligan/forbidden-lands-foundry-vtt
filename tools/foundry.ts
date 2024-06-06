import { $ } from "bun";
import { data } from "foundryconfig.json" with { type: "json" };

const __dirname = new URL("../", import.meta.url).pathname;

async function run() {
	const { foundryBinary } = data;
	const flags = [`--dataPath=/${__dirname}/__fixtures__/FoundryVTT`];

	await $`node ${foundryBinary} ${flags.join(" ")}`;
}

run();
