module.exports = {
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},

	env: {
		browser: true,
		jquery: true,
	},

	extends: [
		"eslint:recommended",
		"jquery",
		"@typhonjs-fvtt/eslint-config-foundry.js/0.7.9",
		"plugin:prettier/recommended",
	],

	plugins: [],

	rules: {},

	overrides: [
		{
			files: ["./*.js"],
			env: {
				node: true,
			},
		},
	],
};
