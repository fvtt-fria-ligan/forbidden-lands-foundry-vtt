import { context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { args } from "./tools/args-parser.js";
import templatePathsPromise from "./tools/get-template-paths.js";

const templatePaths = await templatePathsPromise;

const development = args.hasOwnProperty("dev");
const watch = args.hasOwnProperty("watch") && development;

if (existsSync("./forbidden-lands.js")) await rm("./forbidden-lands.js");
if (existsSync("./forbidden-lands.css")) await rm("./forbidden-lands.css");

const ctx = await context({
	bundle: true,
	entryPoints: ["./src/forbidden-lands.js", "./src/forbidden-lands.scss"],
	outdir: "./",
	format: "esm",
	logLevel: "info",
	sourcemap: development ? "inline" : false,
	ignoreAnnotations: development,
	minifyWhitespace: true,
	minifySyntax: true,
	drop: development ? [] : ["console", "debugger"],
	define: {
		GLOBALPATHS: JSON.stringify(templatePaths),
	},
	plugins: [
		sassPlugin({
			logger: {
				warn: () => "",
			},
		}),
		{
			name: "external-files",
			setup(inBuild) {
				inBuild.onResolve(
					{ filter: /(\.\/assets|\.\/fonts|\/systems)/ },
					() => {
						return { external: true };
					},
				);
			},
		},
	],
});

ctx.rebuild();

if (watch) ctx.watch();
else ctx.dispose();
