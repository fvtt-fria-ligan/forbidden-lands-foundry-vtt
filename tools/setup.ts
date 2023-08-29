import { build, filesystem, print, type GluegunToolbox } from "gluegun";
import { args } from "./args-parser";

const force = Object.hasOwn(args, "force");
if (filesystem.exists("foundryconfig.json") && !force) {
	print.warning("This project has already been setup!");
	print.muted("Use --force to overwrite the existing setup");
	process.exit(0);
}

const cli = build("setup")
	.src(process.cwd())
	.defaultCommand({
		run: async (tools: GluegunToolbox) => {
			const { print, prompt, filesystem } = tools;
			print.highlight("Welcome to Forbidden Lands Development!");

			let data = "";
			while (!data) {
				let { directory } = await prompt.ask([
					{
						type: "input",
						name: "directory",
						message: "Where is your Foundry/Data directory located?",
						initial: "/Users/user/Foundry/Data",
						required: true,
						onCancel: () => {
							print.warning("Setup cancelled!");
							print.muted(
								"If you change your mind, run 'setup' again. Goodbye!",
							);
							process.exit(0);
						},
					},
				]);

				if (directory.startsWith("~"))
					directory = directory.replace("~", filesystem.homedir());

				const resolved = filesystem.resolve(directory);
				if (!filesystem.isDirectory(resolved)) {
					print.error("The provided directory does not exist!");
					continue;
				}

				const systems = filesystem
					.subdirectories(resolved)
					.find((dir) => dir.endsWith("systems"));

				if (!systems)
					print.error(
						"The provided directory does not contain a systems folder!",
					);
				else data = filesystem.resolve(systems, "forbidden-lands");
			}

			if (filesystem.exists(data)) {
				print.error(
					"The provided systems folder already contains a system named 'forbidden-lands'!",
				);
				print.muted(data);
				const force = await prompt.confirm("Force a new symlink?", false);
				if (!force) {
					print.warning("Setup cancelled!");
					print.muted("If you change your mind, run 'setup' again. Goodbye!");
					process.exit(0);
				} else filesystem.remove(data);
			}

			filesystem.symlinkAsync(process.cwd(), data).catch((err) => {
				print.error("Failed to create symlink!");
				print.muted(data);
				throw err;
			});

			filesystem.writeAsync("foundryconfig.json", { data }).catch((err) => {
				print.error("Failed to write foundryconfig.json");
				throw err;
			});

			print.success("Setup complete!");
			print.muted("You can now run 'start' to build in development mode.");
			print.muted(
				"Make sure to also run Foundry using the data directory you provided.",
			);
		},
	})
	.create();

cli.run();
