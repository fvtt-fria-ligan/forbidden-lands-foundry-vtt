import { $ } from "execa";
import { writeFileSync } from "node:fs";

/**
 * Convenience function to handle an stderr from execa.
 */
function handlePossibleError({ stderr }) {
	if (!stderr) return;
	console.error(stderr);
	process.exit(1);
}

// Version package
await $`npx changeset version`.then(handlePossibleError);

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
writeFileSync("system.json", JSON.stringify(manifest, null, "\t") + "\n");

// Format system.json
await $`npx rome format --write system.json`.then(handlePossibleError);
