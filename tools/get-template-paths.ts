import { globby } from "globby";
import { posix, sep } from "node:path";

export default (async () => {
	const paths = await globby("**/*.hbs", { cwd: "./templates" });
	return paths.map((templatePath) => {
		templatePath = templatePath.split(sep).join(posix.sep);
		return `systems/forbidden-lands/templates/${templatePath}`;
	});
})();
