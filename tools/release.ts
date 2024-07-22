import { $ } from "bun";

import rootConfig from "../package.json" with { type: "json" };

const { version } = rootConfig;
const tag = `v${version}`;
const releaseLine = `v${version.split(".")[0]}`;

const { exitCode, stderr } =
	await $`git ls-remote --exit-code origin --tags refs/tags/${tag}`
		.nothrow()
		.quiet();

if (exitCode === 0) {
	console.log(
		`Action is not being published because version ${tag} is already published`,
	);
	process.exit(0);
}

if (exitCode !== 2) {
	throw new Error(`git ls-remote exited with ${exitCode}:\n${stderr}`);
}

await $`git checkout --detach`;
await $`git add --force forbidden-lands.js forbidden-lands.css`;
await $`git commit -m "chore(release): ${tag}"`;
await $`git tag ${tag} -m ${tag}`.then(() => console.log(`New tag: ${tag}`));

await $`git push --force --follow-tags origin HEAD:refs/heads/${releaseLine}`;
