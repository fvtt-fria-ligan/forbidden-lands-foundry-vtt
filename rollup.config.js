const { nodeResolve } = require("@rollup/plugin-node-resolve");
const dotenv = require("dotenv");
const result = dotenv.config();
const env = process.env.NODE_ENV || "development";
const { terser } = require("rollup-plugin-terser");

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
	plugins: [nodeResolve(), env === "production" ? terser() : null],
};
