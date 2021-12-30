const { test } = require("uvu");
const assert = require("uvu/assert");
const semverComp = require("@utils/semver-compare");

test("Invalid SemVer", () => {
	console.log("Should throw error when passed invalid semver.");
	assert.throws(() => semverComp("3.3.3", "0", "02"), "Mixed bag");
	assert.throws(() => semverComp("0", "0", "0"), "Only 0s");
	assert.throws(() => semverComp("0.0.0", 22), "Includes numbers");
	assert.throws(() => semverComp(Infinity, "0.0.0", "0.0.0"), "Infinity");
	assert.throws(() => semverComp({ min: "4.3.5" }, "0.0.0", "0.0.0"), "Object");
	assert.throws(() => semverComp("4.3.5", NaN, "0.0.0"), "NaN");
});

test("Missing Comparators", () => {
	console.log("Should throw error when passed too few comparators.");
	assert.throws(() => semverComp("6.6.6"), "One Parameter");
	assert.throws(() => semverComp("", "3.4.4", ""));
	assert.throws(() => semverComp(["0.0.0", "0.0.0"]), "Array");
});

test("Accepts Equality", () => {
	console.log("Should return true if equal");
	assert.ok(semverComp("6.6.6", "6.6.6", "", { eqMin: true }), "Equals Min");
	assert.ok(semverComp("8.8.8", "6.6.6", "6.6.6", { eqMax: true }), "Equals Max");
	assert.ok(semverComp("6.6.6", "6.6.6", "6.6.6", { eqMin: true, eqMax: true }), "Equals Max");
	assert.not.ok(semverComp("6.6.6", "5.5.5", "", { eqMin: true }), "Equals Min");
	assert.not.ok(semverComp("8.8.8", "7.7.7", "6.6.6", { eqMax: true }), "Equals Max");
	assert.not.ok(semverComp("4.4.4", "6.6.6", "6.6.6", { eqMin: true, eqMax: true }), "Equals Max");
});

test("Accepts Less Than or Equals", () => {
	console.log("Should return true if less than or equal with opts");
	assert.ok(semverComp("6.6.6", "7.7.7", "7.7.7", { lEqMax: true }));
	assert.not.ok(semverComp("6.8.8", "7.7.8", "7.7.7", { lEqMax: true }));
});

test("Accepts Greater Than or Equals", () => {
	console.log("Should return true if greater than or equal with opts");
	assert.ok(semverComp("6.6.6", "6.6.6", "7.7.7", { gEqMin: true }));
	assert.not.ok(semverComp("6.6.6", "5.5.5", "7.7.7", { gEqMin: true }));
});

test("Accepts Less Than and Greater Than", () => {
	console.log("Should return true if less than or equal and greater than or equal with opts");
	assert.ok(semverComp("6.6.6", "6.6.6", "6.6.6", { gEqMin: true, lEqMax: true }));
	assert.not.ok(semverComp("6.7.6", "6.6.6", "6.5.6", { gEqMin: true, lEqMax: true }));
});

test("Accepts Base Case", () => {
	console.log("Should return true with base case");
	assert.ok(semverComp("5.5.5", "6.6.6", "7.7.7"));
	assert.not.ok(semverComp("8.5.5", "6.6.6", "7.7.7"));
});

test("Accepts Weird Cases", () => {
	console.log("Accepts weird cases");
	assert.ok(semverComp("5.15.200", "10.90.47", "10.101.30"), "Greater than ten");
	assert.ok(semverComp("5.15.200", "10.90.47", "", { gEqMin: true }), "Greater than ten missing max");
});

test.run();
