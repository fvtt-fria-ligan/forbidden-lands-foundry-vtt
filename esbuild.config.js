import { context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import templatePathsPromise from "./tools/get-template-paths.js";

const templatePaths = await templatePathsPromise;

export default async ({ watch = false, production = false } = {}) => {
	const ctx = await context({
		bundle: true,
		entryPoints: ["./src/forbidden-lands.js", "./src/forbidden-lands.scss"],
		outdir: "dist",
		format: "esm",
		logLevel: "info",
		sourcemap: !production ? "inline" : false,
		ignoreAnnotations: !production,
		minifyWhitespace: true,
		minifySyntax: true,
		drop: production ? ["console", "debugger"] : [],
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
					inBuild.onResolve({ filter: /(\.\/assets|\.\/fonts|\/systems)/ }, () => {
						return { external: true };
					});
				},
			},
		],
	});

	ctx.rebuild();

	if (watch) ctx.watch();
};
