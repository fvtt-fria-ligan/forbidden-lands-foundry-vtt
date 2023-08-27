import { glob } from "fs-extra-plus";
import { posix, sep } from "node:path";

export default (async () => {
	const paths = await glob("**/*.hbs", { cwd: "./templates" });
	return paths.map((templatePath) => {
		templatePath = templatePath.split(sep).slice(1).join(posix.sep);
		return `systems/forbidden-lands/templates/${templatePath}`;
	});
})();
