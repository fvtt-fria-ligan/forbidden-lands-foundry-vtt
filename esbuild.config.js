import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

export default ({ watch = false, production = false } = {}) =>
	build({
		bundle: true,
		entryPoints: ["./src/forbidden-lands.js", "./src/forbidden-lands.scss"],
		outdir: "dist",
		format: "esm",
		logLevel: "info",
		sourcemap: !production ? "inline" : false,
		ignoreAnnotations: !production,
		minify: true,
		watch,
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
