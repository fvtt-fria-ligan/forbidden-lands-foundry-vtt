import { sep, posix } from "node:path";
import { glob } from "fs-extra-plus";

export default (async () => {
	const paths = await glob("**/*.hbs", { cwd: "src" });
	return paths.map((templatePath) => {
		templatePath = templatePath.split(sep).slice(1).join(posix.sep);
		return `systems/forbidden-lands/templates/${templatePath.replace("templates/", "")}`;
	});
})();
