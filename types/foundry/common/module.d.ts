import * as Abstract from "./abstract/module.js";
import * as Constants from "./constants.js";
import * as Data from "./data/module.js";
import * as Documents from "./documents/module.js";
import * as Packages from "./packages/module.js";
import * as Utils from "./utils/module.js";

// global-modifying module
import "./primitives/module.js";
import "./types.js";

declare global {
	const CONST: typeof Constants;
	namespace globalThis {
		export import Color = Utils.Color;

		namespace foundry {
			export import CONST = Constants;
			export import abstract = Abstract;
			export import data = Data;
			export import documents = Documents;
			export import packages = Packages;
			export import utils = Utils;
		}
	}
}
