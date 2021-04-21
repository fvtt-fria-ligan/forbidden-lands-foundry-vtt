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
	input: "src/module/forbidden-lands.js",
	output: {
		dir: "dist/module",
		format: "es",
		sourcemap: env === "development" ? true : false,
	},
	plugins: [
		env === "production"
			? strip({
					labels: ["hookDebug"],
			  })
			: null,
		nodeResolve(),
		terser({
			mangle: false,
			module: true,
		}),
	],
};
