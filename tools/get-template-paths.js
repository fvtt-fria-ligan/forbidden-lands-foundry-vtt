const fs = require("fs-extra-plus");

(async function () {
	const templatePaths = await fs.glob("./dist/templates/**/*.hbs");
	if (templatePaths && templatePaths.length > 0)
		console.log(
			templatePaths.map((templatePath) => `systems/forbidden-lands/${templatePath.replace("./dist/", "")}`),
		);
})();
