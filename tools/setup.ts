import { build, filesystem, print, type GluegunToolbox } from "gluegun";
import { args } from "./args-parser";

if (process.env.CI) {
	print.warning("Detected CI environment, skipping setup!");
	filesystem.write("foundryconfig.json", {
		data: { foundryBinary: "", dataPath: "" },
	});
	process.exit(0);
}

const force = Object.hasOwn(args, "force");
if (filesystem.exists("foundryconfig.json") && !force) {
	print.warning("This project has already been setup!");
	print.muted("Use --force to overwrite the existing setup");
	process.exit(0);
}

function symLinkToFixtures() {
	const fixturesPath = filesystem.resolve(
		__dirname,
		"..",
		"__fixtures__/FoundryVTT/Data/systems/forbidden-lands",
	);

	if (filesystem.exists(fixturesPath)) return;

	filesystem
		.symlinkAsync(
			filesystem.resolve(__dirname, ".."),
			filesystem.resolve(
				"__fixtures__/FoundryVTT/Data/systems",
				"forbidden-lands",
			),
		)
		.catch((err) => {
			print.error("Failed to create a symlink to the fixtures directory!");
			throw err;
		});
}

const cli = build("setup")
	.src(process.cwd())
	.defaultCommand({
		run: async (tools: GluegunToolbox) => {
			const { print, prompt, filesystem } = tools;
			print.highlight("Welcome to Forbidden Lands Development!");

			symLinkToFixtures();

			let dataPath = "";
			// biome-ignore lint/suspicious/noConfusingLabels: <explanation>
			setupData: {
				while (!dataPath) {
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
					else dataPath = filesystem.resolve(systems, "forbidden-lands");
				}

				if (filesystem.exists(dataPath)) {
					print.error(
						"The provided systems folder already contains a system named 'forbidden-lands'!",
					);
					print.muted(dataPath);
					const force = await prompt.confirm("Force a new symlink?", false);
					if (force) filesystem.remove(dataPath);
					else {
						print.warning("Skipping symlinking data directory!");
						break setupData;
					}
				}

				filesystem.symlinkAsync(process.cwd(), dataPath).catch((err) => {
					print.error("Failed to create symlink!");
					print.muted(dataPath);
					throw err;
				});
			}

			let foundryBinary = "";
			while (!foundryBinary) {
				const { path } = await prompt.ask({
					type: "input",
					name: "path",
					message: "Where is your FoundryVTT installation located?",
					initial: "/Users/user/FoundryVTT",
					required: true,
				});

				foundryBinary = filesystem.resolve(path, "resources/app/main.js");
				if (!filesystem.exists(foundryBinary)) {
					print.error(
						"The provided path does not contain a FoundryVTT installation!",
					);
					print.muted(foundryBinary);
					foundryBinary = "";
				}
			}

			const data = {
				foundryBinary,
				dataPath,
			};

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
