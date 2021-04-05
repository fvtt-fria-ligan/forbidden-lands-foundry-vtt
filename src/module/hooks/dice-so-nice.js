export function registerDiceSoNice(dice3d) {
	dice3d.addSystem({ id: "forbidden-lands", name: "Forbidden Lands" }, true);
	dice3d.addColorset({
		name: "fl-base",
		category: "Forbidden Lands",
		description: "Base Dice",
		background: "#ffffff",
		edge: "#ffffff",
		material: "plastic",
	});
	dice3d.addColorset({
		name: "fl-gear",
		category: "Forbidden Lands",
		description: "Gear Dice",
		background: "#000000",
		edge: "#000000",
		material: "plastic",
	});
	dice3d.addColorset({
		name: "fl-skill",
		category: "Forbidden Lands",
		description: "Skill Dice",
		background: "#9d1920",
		edge: "#9d1920",
		material: "plastic",
	});
	dice3d.addColorset({
		name: "fl-d8",
		category: "Forbidden Lands",
		description: "D8",
		background: "#4f6d47",
		edge: "#4f6d47",
		material: "plastic",
	});
	dice3d.addColorset({
		name: "fl-d10",
		category: "Forbidden Lands",
		description: "D10",
		background: "#329bd6",
		edge: "#329bd6",
		material: "plastic",
	});
	dice3d.addColorset({
		name: "fl-d12",
		category: "Forbidden Lands",
		description: "D12",
		background: "#f15700",
		edge: "#f15700",
		material: "plastic",
	});
	dice3d.addDicePreset(
		{
			type: "db",
			labels: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-black.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-black.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-black.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-black.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-black.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-black.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-bump.png",
			],
			colorset: "fl-base",
			system: "forbidden-lands",
		},
		"d6",
	);
	dice3d.addDicePreset(
		{
			type: "dg",
			labels: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-white.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-bump.png",
			],
			colorset: "fl-gear",
			system: "forbidden-lands",
		},
		"d6",
	);
	dice3d.addDicePreset(
		{
			type: "ds",
			labels: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-skill-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-white.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-skill-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-bump.png",
			],
			colorset: "fl-skill",
			system: "forbidden-lands",
		},
		"d6",
	);
	dice3d.addDicePreset(
		{
			type: "d6",
			labels: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-skill-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-white.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-white.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d6/d6-1-skill-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d6/d6-6-bump.png",
			],
			colorset: "fl-skill",
			system: "forbidden-lands",
		},
		"d6",
	);
	dice3d.addDicePreset(
		{
			type: "d8",
			labels: [
				"systems/forbidden-lands/assets/dsn/d8/d8-1.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-2.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-3.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-4.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-5.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-6.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-7.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-8.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d8/d8-1-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-6-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-7-bump.png",
				"systems/forbidden-lands/assets/dsn/d8/d8-8-bump.png",
			],
			colorset: "fl-d8",
			system: "forbidden-lands",
		},
		"d8",
	);
	dice3d.addDicePreset(
		{
			type: "d10",
			labels: [
				"systems/forbidden-lands/assets/dsn/d10/d10-1.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-2.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-3.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-4.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-5.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-6.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-7.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-8.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-9.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-10.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d10/d10-1-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-6-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-7-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-8-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-9-bump.png",
				"systems/forbidden-lands/assets/dsn/d10/d10-10-bump.png",
			],
			colorset: "fl-d10",
			system: "forbidden-lands",
		},
		"d10",
	);
	dice3d.addDicePreset(
		{
			type: "d12",
			labels: [
				"systems/forbidden-lands/assets/dsn/d12/d12-1.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-2.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-3.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-4.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-5.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-6.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-7.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-8.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-9.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-10.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-11.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-12.png",
			],
			bumpMaps: [
				"systems/forbidden-lands/assets/dsn/d12/d12-1-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-2-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-3-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-4-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-5-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-6-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-7-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-8-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-9-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-10-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-11-bump.png",
				"systems/forbidden-lands/assets/dsn/d12/d12-12-bump.png",
			],
			colorset: "fl-d12",
			system: "forbidden-lands",
		},
		"d12",
	);
}
