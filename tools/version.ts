// Use Bun when Bun supports node:fs/promises fully

import { $ } from "execa";
import { writeFile } from "node:fs/promises";

/**
 * Convenience function to handle an stderr from execa.
 */
function handlePossibleError({ stderr }: { stderr: string }) {
	if (!stderr) return;
	console.error(stderr);
	process.exit(1);
}

// Version package
await $`bunx changeset version`.then(handlePossibleError);

// Import versioned package.json
const {
	default: { version },
} = await import("../package.json", {
	assert: { type: "json" },
});

// Import system.json
const { default: manifest } = await import("../system.json", {
	assert: { type: "json" },
});

// Update and Write system.json
manifest.version = version;
manifest.download = manifest.download.replace(/v\d+\.\d+\.\d+/, `v${version}`);
await writeFile("system.json", JSON.stringify(manifest, null, "\t") + "\n");

// Format system.json
await $`bunx rome format --write system.json`.then(handlePossibleError);
