const alias = require("@rollup/plugin-alias");
const path = require("path");
const { nodeResolve } = require("@rollup/plugin-node-resolve"); // Node resolve is used to bundle node-modules at build if needed.
const { terser } = require("rollup-plugin-terser"); // We are using terser to shave off 42% of our codebase at production
const strip = require("@rollup/plugin-strip"); // Strip is used to remove console.logs and the hooks debug setting.
const dotenv = require("dotenv");
const result = dotenv.config();
const env = process.env.NODE_ENV || "development";

if (result.error) {
	throw result.error;
}
module.exports = {
	input: "src/forbidden-lands.js",
	output: {
		dir: "dist",
		format: "es",
		sourcemap: env === "development" ? true : false,
	},
	plugins: [
		alias({
			/**
			 * For custom files extension you might want to add "customerResolver"
			 * https://github.com/rollup/plugins/tree/master/packages/alias#custom-resolvers
			 *
			 * By doing that this plugin can read different kind of files.
			 */
			entries: [
				{
					find: "@utils",
					replacement: path.resolve(__dirname, "src/utils"),
				},
				{
					find: "@actor",
					replacement: path.resolve(__dirname, "src/actor"),
				},
				{
					find: "@item",
					replacement: path.resolve(__dirname, "src/item"),
				},
				{
					find: "@journal",
					replacement: path.resolve(__dirname, "src/journal"),
				},
				{
					find: "@components",
					replacement: path.resolve(__dirname, "src/components"),
				},
				{
					find: "@system",
					replacement: path.resolve(__dirname, "src/system"),
				},
			],
		}),
		env === "production"
			? strip({
					labels: ["hookDebug"],
			  })
			: null,
		nodeResolve(),
		env === "production"
			? terser({
					mangle: false,
					module: true,
			  })
			: null,
	],
};
