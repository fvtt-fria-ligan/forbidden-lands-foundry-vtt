declare module "foundry-year-zero-roller" {
	class YearZeroRollManager {
		static register(
			system: string,
			templates: {
				"ROLL.chatTemplate": string;
				"ROLL.tooltipTemplate": string;
				"ROLL.infosTemplate": string;
			},
		): void;
	}
}
