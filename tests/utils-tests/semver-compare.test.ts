import { expect, it, describe } from "bun:test";
import semverComp from "@utils/semver-compare";

describe("semver-compare", () => {
	it("should accepts base cases", () => {
		expect(semverComp("5.5.5", "6.6.6", "7.7.7")).toBe(true);
		expect(semverComp("8.5.5", "6.6.6", "7.7.7")).toBe(false);
	});

	it("should accept edge cases", () => {
		expect(semverComp("5.15.200", "10.90.47", "10.101.30")).toBe(true);
		expect(semverComp("5.15.200", "10.90.47", "", { gEqMin: true })).toBe(true);
	});

	it("should throw with invalid SemVer", () => {
		expect(() => semverComp("3.3.3", "0", "02")).toThrow();
		expect(() => semverComp("0", "0", "0")).toThrow();
		// @ts-expect-error Testing invalid input
		expect(() => semverComp("0.0.0", 22)).toThrow();
		expect(() =>
			// @ts-expect-error Testing invalid input
			semverComp(Number.POSITIVE_INFINITY, "0.0.0", "0.0.0"),
		).toThrow();
		// @ts-expect-error Testing invalid input
		expect(() => semverComp({ min: "4.3.5" }, "0.0.0", "0.0.0")).toThrow();
		// @ts-expect-error Testing invalid input
		expect(() => semverComp("4.3.5", Number.NaN, "0.0.0")).toThrow;
	});

	it("should throw when missing comparators", () => {
		// @ts-expect-error Testing invalid input
		expect(() => semverComp("6.6.6")).toThrow();
		expect(() => semverComp("", "3.4.4", "")).toThrow();
		// @ts-expect-error Testing invalid input
		expect(() => semverComp(["0.0.0", "0.0.0"])).toThrow();
	});

	it("should accept equality", () => {
		expect(semverComp("6.6.6", "6.6.6", "", { eqMin: true })).toBe(true);
		expect(semverComp("8.8.8", "6.6.6", "6.6.6", { eqMax: true })).toBe(true);
		expect(
			semverComp("6.6.6", "6.6.6", "6.6.6", { eqMin: true, eqMax: true }),
		).toBe(true);
		expect(semverComp("6.6.6", "5.5.5", "", { eqMin: true })).toBe(false);
		expect(semverComp("8.8.8", "7.7.7", "6.6.6", { eqMax: true })).toBe(false);
		expect(
			semverComp("4.4.4", "6.6.6", "6.6.6", { eqMin: true, eqMax: true }),
		).toBe(false);
	});

	it("should return true if less than or equal with opts", () => {
		expect(semverComp("6.6.6", "7.7.7", "7.7.7", { lEqMax: true })).toBe(true);
		expect(semverComp("6.8.8", "7.7.8", "7.7.7", { lEqMax: true })).toBe(false);
	});

	it("should return true if greater than or equal with opts", () => {
		expect(semverComp("6.6.6", "6.6.6", "7.7.7", { gEqMin: true })).toBe(true);
		expect(semverComp("6.6.6", "5.5.5", "7.7.7", { gEqMin: true })).toBe(false);
	});

	it("should return true if less than or equal and greater than or equal with opts", () => {
		expect(
			semverComp("6.6.6", "6.6.6", "6.6.6", { gEqMin: true, lEqMax: true }),
		).toBe(true);
		expect(
			semverComp("6.7.6", "6.6.6", "6.5.6", { gEqMin: true, lEqMax: true }),
		).toBe(false);
	});
});
