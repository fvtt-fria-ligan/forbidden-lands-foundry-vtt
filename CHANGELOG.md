# Changelog

## 11.3.3

### Patch Changes

- [#364](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/364) [`d515a9f`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d515a9f06a5c8cf71a721d131a75a0e2676b6988) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Solved #363 - Editors erroring out when opened

- [#365](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/365) [`9f88f2b`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9f88f2b87b779c8b140440d588b25ff61f37c773) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Resolve issue where sheet templates were located in wrong directory

- [#366](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/366) [`0f388e0`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0f388e0292a7a9d84edbdf46fc0a93886c4db23e) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Solved problems where modifiers were not handled correctly

## 11.3.2

### Patch Changes

- [#360](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/360) [`8245492`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/824549275da83ac341cd0c2ec8b115acb3807376) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Fixing issues with refactoring and CI/CD.

- [#362](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/362) [`6a8df7e`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6a8df7e088f12f5fd1927511da15144fa11c204a) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Somewhere a regression happened in Foundry, or YZUR where applying modifiers before a roll-object was rolled would make the object immutable. Fixed by moving the roll modification to after evaluating the roll.

## 11.3.1

### Patch Changes

- [#358](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/pull/358) [`986cbd9`](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/986cbd9fe0c77142aab98245d5c0953f085f60cd) Thanks [@aMediocreDad](https://github.com/aMediocreDad)! - Updated package structure, modernizing development environment

## [11.3.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.2.1...v11.3.0) (2023-08-27)

### Features

- ✨ Add Changelog menu in Settings ([c9814aa](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c9814aa071a048135ae7b80cc0ba41e476d93307))
- ✨ Initial implementation of dark mode ([1652080](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1652080271f27235e00152146e9fc6ba4b2e57ad))

### Bug Fixes

- 🐛 Center pride button ([21c7a4d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/21c7a4d988e4fd9af7e8abc9cb8c4ed9c61fbb18))
- 🐛 Contrast issues in dark and light-mode ([ea5b3b7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ea5b3b7d5c7910a201a3c524778c4296752d635e))

### [11.2.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.2.0...v11.2.1) (2023-08-18)

## [11.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.1.3...v11.2.0) (2023-08-13)

### Features

- ✨ add damage to enricher ([6cd8c39](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6cd8c39f14d5c4633856d08f59b744f066d7afb8))
- ✨ add fblr enricher ([9a6b2d6](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9a6b2d656439e8fb897d793d4f2523a96b6b6e86))

### Bug Fixes

- 🐛 allow dices greater than 9 ([8bc5a5f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8bc5a5f6aace15f36adac6c8cbf94837afeb5981))
- 🐛 code formating ([b9c79a1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b9c79a118e64a3e37b3f23624ef528f48f40fcc7))
- 🐛 i18n modifier label ([474b9da](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/474b9dae2e502bd1441a577521cae06b50b114f5))
- use correct attributes when conditions block resting. ([16b7119](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/16b71194d0c188bcdad1caa853419d53677b2c07))

### [11.1.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.1.1...v11.1.3) (2023-07-01)

### Bug Fixes

- 🐛 JSON formatting errors ([dad3216](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/dad32164793b79dcac31916d05c87b957a3140e0))
- 🐛 Relative url in font import declaration ([e5dfe4d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/e5dfe4df0e87359a649d4b1987f39eecc3181f1f)), closes [#346](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/346)

### [11.1.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.1.1...v11.1.2) (2023-07-01)

### Bug Fixes

- 🐛 Commit files with only case changes in their name ([77ff925](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/77ff9255939ec233f59174561a6e8502a3bf7db1))

### [11.1.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.1.0...v11.1.1) (2023-06-11)

### Bug Fixes

- 🐛 Adventure Site journal entries not working correctly ([27d7bbe](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/27d7bbe3b45afc51cf1dbd0601a85d5e4e973eb7)), closes [#343](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/343)

## [11.1.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.0.1...v11.1.0) (2023-05-26)

### Features

- ✨ Add reputation roll ([0c7fe95](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0c7fe95683b0e8642792420629d1c8aedf32d629)), closes [#327](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/327)
- ✨ Count items in gear tab ([fdea12b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fdea12bb0639cc3be536cf712c41e5915790d346)), closes [#325](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/325)

### [11.0.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v11.0.0...v11.0.1) (2023-05-25)

### Bug Fixes

- 🐛 Adventure Site sheet rooms ([83a3373](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/83a3373a4de4d8c0d6d9b0182bac7c791251bb58)), closes [#337](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/337)

## [11.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.2.2...v11.0.0) (2023-05-25)

### Features

- ✨ Add selection of homeland to the chargen script ([5bcb732](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5bcb732bb911c0c2b817a5babe5cf5ac02ebf2ac))
- ✨ adds HEALTH and RESOLVE fields as a system option ([fe73f38](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fe73f38aa4370f3614eea822eda343506c9a55ad))
- ✨ Interface tweaks and localization ([357e192](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/357e192ac93bff6fed5f55a5866adbe23b401806))

### Bug Fixes

- 🐛 change values for consumables in chargen datasets ([88b359c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/88b359c1e00b8510fcfeed79b536ca84748073dd))
- 🐛 clearing merge conflicts ([72a2109](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/72a21091c65c573b2d9724a5751b8b0dbce0a72a))
- 🐛 formating things in last changes ([cf2ee94](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cf2ee94377d67c01b5a58444aa27ab47a42005b0))
- 🐛 i18n static strings in character-generator ([1ad652b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1ad652b63d088383102758147a61f13dec5f35c0))
- 🐛 Item layouts ([ff0a99f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ff0a99f0bc86174ea22dcb8c2f6f97746739d09e))
- 🐛 Rename all fonts ([9836bf1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9836bf1f4192106d8699f11ae1bbb060330e6486))

### [10.2.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.2.1...v10.2.2) (2023-05-04)

### Features

- ✨ Add editable roll dialog title ([5978bc0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5978bc004b9333c46aa7b5f38630a7c1253a2d51)), closes [#297](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/297)

### Bug Fixes

- 🐛 Encumbrance using temp strength not max ([4c791ee](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/4c791eee13c9198292741bfd857c674c164a792a)), closes [#319](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/319)
- 🐛 Party sheet action list dynamic size ([aa4e2e1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/aa4e2e133494ec0f06fbb9070386ff71a2b60f6f)), closes [#318](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/318)
- 🐛 Title of mishap and other table should be hunting (they use the same key) ([1ab4b86](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1ab4b86ee3285e96ba830f116d20a02329b1113b)), closes [#315](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/315)

### [10.2.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.2.0...v10.2.1) (2023-05-03)

### Bug Fixes

- 🐛 Accumulate carrying capacity modifiers ([170eb85](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/170eb85e4505f9ab95ea63d6cc0ac2a390a5b3d6)), closes [#295](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/295)
- 🐛 Add setting for collapsing sheet header buttons ([db5f679](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/db5f67913b960b8b95fe520872151b4f3ab5ffe1))
- 🐛 Find a prey button not working ([16f1d86](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/16f1d86473f064acb9f4034ea2f78d53dd56e29a)), closes [#310](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/310)

## [10.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.1.1...v10.2.0) (2023-05-02)

### Features

- ✨ Add Editor enrichers ([9b9b326](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9b9b32635cf0ad946c9ef9c51ac4194dff418450))
- ✨ Buttons for random tables in roll cards and party sheet ([134de1f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/134de1fc2b2b627c46c29cbd022b89ab915a906e))
- ✨ Monster attack/movement/armor improvements ([8fbeff5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8fbeff52d048a7b09ea376477452b5286a0b339f))

### Bug Fixes

- 🐛 Fixes [#301](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/301) ([10f69e6](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/10f69e69fdc0eed8c68c3746a2295ab8b640c728))
- 🐛 Improve random table section ([c7eef82](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c7eef820c61d3624755981e0ce04f249ae649333))
- 🐛 Journal style fixes ([becae28](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/becae28159be993efac125561b02c1271dcbafdc))
- 🐛 Minor style fixes ([8bc671d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8bc671d17859d19e88251642e1389b75835f7e77))
- 🐛 Style Improvements ([bc36d39](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/bc36d3906fecf952ddb2778ed335a81957e48455))
- 🐛 Support negative dice in generic roll chat macro ([5b55bce](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5b55bce65f686f13f839de06b7f2e24e8b0cf9e7))
- **lang:** Update German localization ([cbdadc9](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cbdadc90f1a9280bb3f54d4df2baa48cc1749494))
- **lang:** Update Swedish Localization ([5b34891](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5b348914df5f27573fd34681992191bb9a647f90))

### [10.1.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.1.0...v10.1.1) (2023-02-23)

### Bug Fixes

- 🐛 Not only equipped items provide modifiers to rolls ([3d7e1aa](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3d7e1aacb6953ec5b9e528fbad9c0333f943776b))

## [10.1.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.4...v10.1.0) (2023-02-22)

### Features

- Add parry/dodge modifiers ([#291](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/291)) ([1f74dad](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1f74dad2099806b4052bee7f8ba5a3a38970df52)), closes [#282](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/282)

### Bug Fixes

- Artifact die on total armor roll ([#293](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/293)) ([ae2bdb9](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ae2bdb9b8c80e39c143a8bbcfa9dcdcb91a682ec)), closes [#286](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/286)
- Not rolling arrow dice on ranged weapons ([#290](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/290)) ([9bbbc18](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9bbbc185ef1f95e7c2bd6205b811b5b97596b1ac)), closes [#281](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/281)
- Roll modifiers on equipped items only ([#294](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/294)) ([16ebe4a](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/16ebe4a0d5a742e25254b533c3be16d3adeb1822)), closes [#289](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/289)

### [10.0.4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.3...v10.0.4) (2022-11-27)

### Bug Fixes

- Editor indent and max-width ([#280](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/280)) ([22ecea2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/22ecea274fd8213455c983eaa546335cfe58daa6))

### [10.0.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.2...v10.0.3) (2022-11-23)

### Bug Fixes

- 🐛 Cannot act when empathy is broken ([f403fb2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/f403fb2dfe455d982ecc3f8f7d13528d38dc56ec)), closes [#258](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/258)
- 🐛 Damage displaying on weapon related actions ([886de07](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/886de07825355900ab00eaa0869236a4890d7926)), closes [#276](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/276)
- 🐛 Enrich Actor Fields ([fb923ba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fb923ba2fb14d699d30dbf4d719bc8428b303cdc))
- 🐛 Enrich item fields ([6a8619b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6a8619b4743c1564c738c2db1958a64ca2993c8d))
- 🐛 Improve scene thumbnails in sidebar ([8b27554](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8b27554e67d02c32f673dec43c2b947d1228bc58))
- 🐛 Incorrect owner chech for push button visibility ([43ddb9d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/43ddb9de41d675bc2fd2f76b42ae9c3b83dc673a))
- 🐛 Lineheights and text-indents ([2645e8e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/2645e8e3316bc811c34d891d83f51a24a548f3bd))
- 🐛 Wrong paths in experimental dataset ([7bd7309](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7bd730996e8b516d859cbd43530b10e978250d8e))

### [10.0.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.1...v10.0.2) (2022-11-07)

### Bug Fixes

- 🐛 Inability to update raw material value from character ([6c7fa7d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6c7fa7db768c64a81b5a6da0a657b7fcd77c90f2))

### [10.0.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.0...v10.0.1) (2022-11-06)

### Bug Fixes

- 🐛 Reimplement adventure sites ([96ba869](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/96ba8692f65ecc17dd81cd96378d13f2fd16d4b7))

## [10.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.0-4...v10.0.0) (2022-11-06)

### Bug Fixes

- 🐛 Audio Playlists controls no active indication ([95d0e15](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/95d0e15e84160a3ef386445382f8af5909dcfd19)), closes [#254](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/254)
- 🐛 Error when player clicks 'rest' Fixes [#253](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/253) ([0ac28bf](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0ac28bf05866731b8ba5ca37eb18126b885712c8))
- 🐛 Fix charactersheet config ([818c4eb](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/818c4ebe9be37439bd528cd052384299493f120f))
- 🐛 Further editor CSS fixes ([257fe00](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/257fe00d39f10bbd1976a3459cec07295ee7b14b))
- 🐛 Minor alignment char sheet ([06fddd0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/06fddd018e1f2554291d64dd9ab9006da8251608))
- 🐛 Reset font size scale, various style fixes ([18a23cd](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/18a23cd10ccab8a48b1362d5aa74396ba8ca7488)), closes [#268](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/268) [#266](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/266) [#267](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/267)
- 🐛 Style fixes to sheets, editor ([efe0a7c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/efe0a7c43b6df066f95d4d736d29c965feb2e3f5))
- 🐛 Update manifest, add message ([853a871](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/853a871a2d696be42a840b3acf6d7e7b8028b050))

## [10.0.0-4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.0-3...v10.0.0-4) (2022-09-24)

### Bug Fixes

- 🐛 Fixes [#249](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/249) ([3b6df76](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3b6df76414a10a11f284629689a276bd28e7a838))
- 🐛 Fixes [#262](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/262) ([ef270cf](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ef270cf4280b49aabba83f8e59f7c0e713fd4e84))
- 🐛 Journal Sidebar CSS fix ([3b9a858](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3b9a8584d60e1adf52b2287c4fe908bc3a16bfb6))

## [10.0.0-3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.0-2...v10.0.0-3) (2022-09-18)

### Bug Fixes

- 🐛 Fix editor issues in item/actor sheets ([0e92817](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0e9281787b34425efff350eac5191ff77c9d872c)), closes [#261](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/261)
- 🐛 Revert to releases latest manifests ([0639b9a](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0639b9a6cc3f35ec19d58b29db56b83d7ef191c8)), closes [#264](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/264)

## [10.0.0-2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.2.2...v10.0.0-2) (2022-09-11)

### Bug Fixes

- 🐛 Add alpha warning message, remove system.json from releases ([0492d4b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0492d4bd33b8c641dac82146489da000b39c9b89))
- 🐛 V9 compatible manifest ([8caff11](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8caff11d15788c4b5d56b9d392e0722bbf95f7fd)), closes [#252](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/252)

## [10.0.0-1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v10.0.0-0...v10.0.0-1) (2022-08-11)

### Bug Fixes

- 🐛 V9 compatible manifest ([d227ab3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d227ab336ff1bca65ba8c237af66a6cdfbb90dd0)), closes [#252](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/252)

## [10.0.0-0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.2.2...v10.0.0-0) (2022-07-18)

### [9.2.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.2.1...v9.2.2) (2022-07-18)

### Bug Fixes

- 🐛 Incorrect use of FA6 icon ([aeba586](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/aeba58609a14c0f8226bd4e4d01692b01379a89d))

### [9.2.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.2.0...v9.2.1) (2022-07-18)

### Bug Fixes

- 🐛 Correct reference to combat hbs ([1b69227](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1b6922713d62f4b71690f4c4a6eac8907ff5ce5f))

## [9.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.1.1...v9.2.0) (2022-07-18)

### Features

- ✨ Add collapsible table sections ([b0997a4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b0997a4655e134e047cc668a75850275d1b98b40))
- ✨ Add drop and pickup buttons ([996e7ba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/996e7ba3a9313a2fdee087afce5c17d4ed683838))
- ✨ Add hotbardrop macros ([b2ca3cd](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b2ca3cd516d6bc47d776c7df1109933b897a9c30))
- ✨ Add new 'carried' state to items through flags ([56a8b10](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/56a8b10b7a9a8d41cba5918f3f4f83e86584c833))
- ✨ Add sorting buttons ([b7fa36e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b7fa36ed242b8cf1317ce4c15c692f7413324415))
- ✨ Support armor macros, add generic macros to generated pack ([59dffa8](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/59dffa876b68479d87548fa8bb7e681efd14f44f))

### Bug Fixes

- 🐛 Create Dialog blocked previous create functionality ([f1e6d35](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/f1e6d356c579bb928feb5eb4553d8abe7a56cc7a))
- 🐛 Fixes to list-items display ([5bc7ffc](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5bc7ffc49110f1ec46272c32752e342ee3d23ffa))
- 🐛 Only show equipped weapons & armor in combat tab ([8671b57](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8671b577aa1ed614ef1f8d4e539d8b236005dca4))
- 🐛 Positive modifiers not applying to rolls ([dab87f3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/dab87f3329773666d90ebb10cc9e8c65b2d7aa1b))

### [9.1.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.1.0...v9.1.1) (2022-07-12)

### Bug Fixes

- 🐛 Monster attack not scaling correctly ([6d31f70](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6d31f70d035619df8f54a7611fe5c57423801586))

## [9.1.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v8.2.1...v9.1.0) (2022-07-12)

### Features

- ✨ Add conditions active effect and let it affect rest ([e4a485b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/e4a485bc439843f6afeede7c973ba0baa6e6f746))
- ✨ Add damage to monster attack cards ([8dc4313](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8dc4313d8c5cfaf155ce1745282facc03290684d))
- ✨ Add Gear Bonus toggle ([829bd71](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/829bd7138fa51f9214ae43a4f6a74f927a9ddec0))
- ✨ Add setting for max initiative ([636f886](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/636f886866fca9b150cc6538d063f7034a5f808e))
- ✨ Armor and Weapon 'Features' into TinyMCE editor ([e873cc4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/e873cc4f60ade07645a368c06e70eae3d98c038c))
- ✨ Distinguish between gear rolled ([0c37c84](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0c37c843d09888d8919e6a46bc263d1a22eb0b5f))
- ✨ Move Unlimited Push-setting to actor sheet config ([05ef19f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/05ef19fcc8f6c6083ff2192775c77884e54b9e5f))
- ✨ Remove sleepy and be more accurate in chat message ([d214df2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d214df27b4fe0334b7d44b45582ff9f7f9934cfc))
- add damage in all gears selected ([31edc4c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/31edc4ca9963e640cf65af5604f439039e9d21e9))
- wip ([38dd7f8](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/38dd7f8c2c9391cabfbc1822cbba6e7b73f2a59e))

### Bug Fixes

- 🐛 Add gear data to monster attack rolls ([ff2e3f0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ff2e3f0978977d09092c2c09d6efb75d8758bdf7))
- 🐛 Add shortbow with arrows to Enlisted event ([0cedf52](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0cedf52d4a54a3a877e2d5fc9f04fa1c635bfbbb))
- 🐛 Fixes [#200](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/200) ([9a814f5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9a814f5cc0587de090cf1faeac608656b0a9a568))
- 🐛 Hidden fields displayed in chat message ([cb433c4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cb433c419ebf88b2f115e8983bee50ea6bae5de2))
- 🐛 Incorrect logic in calculating broken state of items ([a081c70](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/a081c701ad29dba8de6da36538ffaad5d5a9a996))
- 🐛 Rolling monster attacks, and resting ([93c306b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/93c306b4c48a6796a39629c31c327e0fb0aa3166))
- 🐛 Separate gear and modifier rolls. Fix edgecases. ([63aa4b2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/63aa4b283fbe3227ccad109644f67f38d363c034))
- Issue with with null ids stored ([d3ff870](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d3ff87074e61ac3c4082f3e70ec7abb818a150b7))
- modifier accumulator and selected gears ([65d38f1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/65d38f19ab27a5fe9bf815a2a0613a95e5bf3761))
- push message with damage of selected gears ([6c7a295](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6c7a2955926a71be8c15d99d8eb16956b0e8b86a))
- remove non-useful test property ([3a02dba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3a02dbad7f2f902ecb5988c7fe961e5d21a82f88))
- remove the pesky warning ([4bfb1ab](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/4bfb1abdd098e843971eee2dbeb0fbd43102e567))

### [9.0.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v9.0.0...v9.0.1) (2022-03-29)

### Bug Fixes

- 🐛 Rolling monster attacks, and resting ([93c306b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/93c306b4c48a6796a39629c31c327e0fb0aa3166))

## [9.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v8.2.1...v9.0.0) (2022-03-26)

### Features

- ✨ Add conditions active effect and let it affect rest ([e4a485b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/e4a485bc439843f6afeede7c973ba0baa6e6f746))
- ✨ Add Gear Bonus toggle ([829bd71](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/829bd7138fa51f9214ae43a4f6a74f927a9ddec0))
- ✨ Add setting for max initiative ([636f886](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/636f886866fca9b150cc6538d063f7034a5f808e))
- ✨ Distinguish between gear rolled ([0c37c84](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0c37c843d09888d8919e6a46bc263d1a22eb0b5f))
- ✨ Move Unlimited Push-setting to actor sheet config ([05ef19f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/05ef19fcc8f6c6083ff2192775c77884e54b9e5f))
- ✨ Remove sleepy and be more accurate in chat message ([d214df2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d214df27b4fe0334b7d44b45582ff9f7f9934cfc))
- add damage in all gears selected ([31edc4c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/31edc4ca9963e640cf65af5604f439039e9d21e9))
- wip ([38dd7f8](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/38dd7f8c2c9391cabfbc1822cbba6e7b73f2a59e))

### Bug Fixes

- 🐛 Fixes [#200](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/200) ([9a814f5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9a814f5cc0587de090cf1faeac608656b0a9a568))
- 🐛 Hidden fields displayed in chat message ([cb433c4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cb433c419ebf88b2f115e8983bee50ea6bae5de2))
- 🐛 Separate gear and modifier rolls. Fix edgecases. ([63aa4b2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/63aa4b283fbe3227ccad109644f67f38d363c034))
- modifier accumulator and selected gears ([65d38f1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/65d38f19ab27a5fe9bf815a2a0613a95e5bf3761))
- push message with damage of selected gears ([6c7a295](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6c7a2955926a71be8c15d99d8eb16956b0e8b86a))
- remove non-useful test property ([3a02dba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3a02dbad7f2f902ecb5988c7fe961e5d21a82f88))

### [8.2.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v8.2.0...v8.2.1) (2022-02-28)

### Bug Fixes

- 🐛 Journal fail to initialize when not passed a type ([1b9b5d4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1b9b5d4d2c1d49f23fb280862a32558fc05615cf))

## [8.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v8.1.0...v8.2.0) (2022-02-26)

### Features

- ✨ Add fast/slow actions to combat tracker ([d7d507d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d7d507d8b56009409f71fb444fcc57792fdea89c))
- ✨ Add hide show buttons on artifact fields ([7ad359e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7ad359edd4543d2fe19a5e1cdaa0d63920805a88))
- ✨ Add rest button. ([a371128](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/a37112862d4dd4e8455272c3548e6d91a9e7d73e))
- ✨ Adventure Sites Sheet Added ([0131969](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0131969f269467a283c8c1768bb8fe10f9f0091f))
- ✨ Resolves [#99](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/99) and resolves [#16](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/16) ([8d2939b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8d2939b2ca6a46ded1b4a9f2296d5363f4357180))

### Bug Fixes

- 🐛 CSS fixes to journal and combat tracker ([8cdd774](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8cdd774983f1e8f7eb1d63915fd35afdef148a0b))
- 🐛 Fixes to generator and document ([2a8a9a9](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/2a8a9a9a9cb91386ed9b018ed26bd60ea660416f))
- 🐛 Fixes to generator and sheet ([9c8ccaa](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9c8ccaa286c144bb4e7875306e21399e9a6620bc))
- change the color of monster attack die ([838731e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/838731ebaa282b29ab1bda0d60b1ca5ebf92e9c8))
- change the translation of damage type in monster attacks ([daf41e2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/daf41e2f7d835de15180fb131f511b6fe5271006))

## [8.1.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v8.0.0...v8.1.0) (2022-01-01)

### Features

- ✨ Update 'de' files. Thanks to [@fpiekert](https://github.com/fpiekert). Resolves [#181](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/181) ([42756b9](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/42756b9107ee95a9001b5ffa712f4bcf50fa4bd4))

### Bug Fixes

- 🐛 Encumbrance for weapons and armor not computing correctly ([34c83a8](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/34c83a8d3e8e21f1c1d2f6b4ad88978a6080105c))

## [8.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.2.0...v8.0.0) (2021-12-30)

### ⚠ BREAKING CHANGES

- Incompatible with 0.8.9

### Bug Fixes

- 🐛 Encumbrance calculation, party sheet template logic ([6b713e5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6b713e5380085012ed6527d1125aea9d655566e8))
- 🐛 Party sheet pathing fixes: post rebase ([cf153fd](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cf153fd785ad47cee8fe9fd9e0f01c5e63a91c0b))
- 🐛 Reorganized party sheet files ([15c0a22](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/15c0a2221d50b046cb9ca9496d89e3f85b6d38ff))
- 🐛 V9 Compatibility, various pathing issues ([860c424](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/860c424328c08e72947c95e26d6725784b47a492))

- 💥 ♻️ Rearranged src files. ([628b5ea](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/628b5ea75070fd36813b8c3e1e73e1424528ad07))

## [7.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.1...v7.2.0) (2021-12-05)

### Features

- ✨ Update fr.json ([6c66df0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6c66df02f239989d18e272b3303bc3d9ee5eece7))

### Bug Fixes

- 🐛 Guard against null value in rollModifiers ([fe12380](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fe123803c16fe8b8d50eb59b2838cdcba78d1d57))
- 🐛 Identify gear by ID on parry modifier ([d4c04ce](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d4c04ce79eaf83ad8bf881572b91705c29738156))
- 🐛 Parry modifier accumulating when carrying multiple weapons ([7728a09](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7728a09aac1b21c3ec2cf16a2a2323b00089e5ec))

### [7.1.5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.4...v7.1.5) (2021-10-22)

### Bug Fixes

- 🐛 Guard against null value in rollModifiers ([fe12380](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fe123803c16fe8b8d50eb59b2838cdcba78d1d57))

### [7.1.4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.3...v7.1.4) (2021-10-22)

### Bug Fixes

- 🐛 Identify gear by ID on parry modifier ([d4c04ce](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d4c04ce79eaf83ad8bf881572b91705c29738156))

### [7.1.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.2...v7.1.3) (2021-10-22)

### [7.1.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.1...v7.1.2) (2021-10-22)

### Bug Fixes

- 🐛 Parry modifier accumulating when carrying multiple weapons ([7728a09](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7728a09aac1b21c3ec2cf16a2a2323b00089e5ec))

### [7.1.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.1.0...v7.1.1) (2021-10-06)

## [7.1.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.5...v7.1.0) (2021-10-04)

### Features

- ✨ Add NPC subtype ([a7a04a7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/a7a04a7a026b722467049cc8c8d1fb124f477b27))
- ✨ Change what information the limited char sheet displays ([e707a73](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/e707a7322f56091e00183d3fe8ac114d4b7b535c))

### Bug Fixes

- 🐛 Character sheet not opening if not configured with subtype ([7ae7ebc](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7ae7ebc794f959899ce42b19594b5013f315de8b))
- 🐛 Character sheet scaling issues & illegal hbs whitespace ([6da3558](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6da3558f6f51bc51979dbe3587f55d5cf64dd183))
- 🐛 Parry modifier not correctly applying ([9115cfc](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/9115cfceb3af01029eed34b23b14c915acff79cd))
- 🐛 Pause spinner should display on FireFox ([c2f43ba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c2f43ba76e60ccddcf63ed863263a501a682ba5c))
- 🐛 Power Level correctly calculating on chat cards ([d75f92c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d75f92cadbe0a36a80d7129db273484046d08030))
- 🐛 Special Encumbrance not correctly applying ([51a1b0a](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/51a1b0a981fe60daf8436ed875983de2895e03a4))
- 🐛 Typo causing changelogs not to be generated ([4c0060e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/4c0060e3da90a89d45d9c8131d958f8e72fd8e0a))

### [7.0.5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.4...v7.0.5) (2021-09-11)

### Bug Fixes

- 🐛 Fix Encumbrance not calculating without a modifier ([1397225](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/139722580bd03f45108bbe9a6123c6546d3a8f03))

### [7.0.4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.3...v7.0.4) (2021-09-11)

### Bug Fixes

- 🐛 Error when opening a charactersheet without Pack Rat ([21b94de](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/21b94de2d36a8eb8676645479500bea07ba955f0))

### [7.0.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.2...v7.0.3) (2021-09-11)

### Bug Fixes

- 🐛 Damage, Critical Injuries, Encumrance and Artifacts ([6cde605](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6cde6058d393177b682d979f80a8368f5c9f4950))

### [7.0.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.1...v7.0.2) (2021-09-04)

### Bug Fixes

- 🐛 Fixes [#154](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/154). Party sheet referenced wrong data ([c360baa](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c360baa054324be4d2a7aba5036c2dc64205ba4a))

### [7.0.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v7.0.0...v7.0.1) (2021-09-04)

### Bug Fixes

- 🐛 Consumable rolls not functioning correctly. ([02c1c5b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/02c1c5b82457729a9b1e56be97b707be71a5c1c9))

## [7.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.4...v7.0.0) (2021-09-04)

### Features

- automate consumable dice roll after ranged weapons use ([#151](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/151)) ([3eacc9c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3eacc9ca7d6b5aa4faac3d23984c14d9d1474d3e))
- ✨ Add consumable chat card and artifact modifiers ([79caa82](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/79caa82124903e5e0f987afa11e8561c9cab03dc))
- ✨ Add damage to gear, attributes and willpower ([20476fd](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/20476fd3286c3eb787192a092b1e14554d90c85c))
- ✨ Add Optional Roll Modifiers to Dialog ([c85a867](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c85a867c87fa6941bd8769d0e3f313869b2e69ad))
- ✨ Add RPGAwesome & Minor styling improvements ([fac6e36](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fac6e3608e31cbe2af03b22362fa6be3c7278574))
- ✨ Add spell roll dialog and roll result ([2bb2f54](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/2bb2f544873b90de4cb66083a8e4d5a541f6275f))
- ✨ Added all Roll APIs to sheets. ([60abbd5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/60abbd52ca58d92fba974649422133e1d659f3fb))
- ✨ Added String localization helper ([5d591fe](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5d591fe2e8405e1c863263fdfc32aa06e3ac3c96))
- ✨ New roll handling engine ([ee7c35b](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ee7c35b9580cab50cf786a3e0badd278cd5ab259))
- ✨ Upgrade to YZUR 3.0.0 ([d3aadd6](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d3aadd6e0bc144ef75b452dc29be4b880357de6b))
- ✨ YZUR roll engine added. ([b6a62ae](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b6a62ae5f5142946b00b7e02258db0954a601547))
- Improving styling of visual components ([#150](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/150)) ([b2f98eb](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b2f98ebc46530e396a99a690bd49585a30722045))

### Bug Fixes

- 🐛 Add back in missing damage from roll cards ([1d3d29f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1d3d29fa8195daaa1a4eca01308bac9bab26d5fc))
- 🐛 Chat cards not displaying correct roll type, update header buttons ([5c3adef](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5c3adef0a2541fca332aabd156f5dbb19bf30ef7))
- 🐛 Conditionally display damage ([c40c6d4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c40c6d4cb7215d621175b2df4e67bdd43d97ad66))
- 🐛 Fix scrollbars always visible in lists ([f5cecd7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/f5cecd7ecd48e6782b474a87a615ac8b897d6ec4))
- 🐛 Fix various issues with implementation ([ef61333](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ef61333e4e971ca0818dc9c77ab30d1f503974aa))
- 🐛 Fixed download badge ([4d05a4c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/4d05a4c0755cb1e2d1a769517b3c842f26fa3318))
- 🐛 Fixed License badge ([010ef4f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/010ef4f801cf5c5f855569313cd2bba9e45248be))
- 🐛 hide infos if no attribute/gear is passed ([f38beba](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/f38beba03f19849c78f00c7a786fa5fb94b6557c))
- 🐛 Issue with html encoding of editor text ([4b4cf0e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/4b4cf0ebbb9589a38d34b652463c1e3f6c6eb558))
- 🐛 Make Roll Buttons more visible using icons ([bf401fa](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/bf401fa8ddfafc809ecbb23aa0c188cb80fd3647))
- 🐛 Several visual nitpicks ([472780d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/472780d75f35e1619cdd28f8ffd8becea7460755))
- 🐛 Sort sorting ([3dede99](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/3dede99d5589d3542a21da9727afe153d5614bfc))
- 🐛 Unlimited pushes ([68edec7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/68edec7a543bc87e8e8c1a027ec00d7c8ae9c097))

### [6.0.4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.3...v6.0.4) (2021-07-14)

### Bug Fixes

- 🐛 Fixed issue with character generator not generating items ([8770a95](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8770a956208e4a4cad26ce6e1840b20ab954a94c))
- 🐛 Fixes [#138](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/138), and fixes [#139](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/139) ([dc73941](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/dc739410b29948b613fa133ebecc1a0f373fde2f))
- 🐛 Various V9 fixes for upcoming Foundry release ([0f29572](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0f2957296cbf1c3ec72262cca92155ddae767fcb))

### [6.0.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.2...v6.0.3) (2021-06-25)

### Bug Fixes

- 🐛 Fixed changing a setting not reloading window ([1196da7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1196da7adbcb95e50c41d5d9c5351d863cc3b6c6))

### [6.0.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.1...v6.0.2) (2021-06-25)

### Bug Fixes

- 🐛 Added Back in Reforged Dataset ([c1aa76d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/c1aa76d2a305c4fa0bfaa0ba60db6abb2670c96a))
- 🐛 Bumped Compatibility to 0.8.8 ([f17648d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/f17648d1384eed354d914b10ae1e833010fe32e7))
- 🐛 Fixed issue with cloning data for createDocument ([7f4faa1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7f4faa1dd7a4107f2deeeb5d2ef7f808d296b9b0))
- 🐛 Minor fixes ([cd35e8d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cd35e8de54480c61dcd10dc35ab73b9ab40cb733))

### [6.0.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.0...v6.0.1) (2021-06-20)

### Bug Fixes

- 🐛 Fixed Push-button not showing for players ([6eea2b6](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6eea2b6b7cf71245475a9dfb3b8328d39a1b6d04))

## [6.0.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.5...v6.0.0) (2021-06-19)

### Features

- ✨ Added Reforged Power Tables. ([5a880ef](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5a880ef5365508d176bb6a8ce4c5545d4cdfd763))

### Bug Fixes

- 🐛 Automatic configuration of Spanish chargen ([d23a978](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d23a9784ca39db6f774736954084ef7c6e555d5c))
- 🐛 bump compatibility and minor visual fixes ([8cfe8da](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/8cfe8da7d1e509eb5fcd4f371529f829000ce8e1))
- 🐛 Fixes [#129](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/129) [#127](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/127) and more Chargen stuff ([81a9734](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/81a9734ef861909b540ffa3005a1dee4db9c3d10))
- 🐛 Reduced size of chat headers ([6ccb427](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/6ccb427c3d0c32e0c2060d1b4d48cf9722eed62d))

## [6.0.0-0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.4...v6.0.0-0) (2021-05-23)

### Features

- ✨ Added welcome message ([eedbf67](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/eedbf67b0f74e67d185890d6a56f2799f8771c6c))

### Bug Fixes

- 🐛 Further compatibility fixes ([99c184e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/99c184e8780d0c8875ed536e154f2d17ca041bc0))
- 🐛 Initial compatibility fixes and recommendations ([206be62](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/206be62ef403b29f47b0f18fd11556f7dcfce5c6))

### [5.3.5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v6.0.0-0...v5.3.5) (2021-05-23)

## [6.0.0-0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.4...v6.0.0-0) (2021-05-23)

### Features

- ✨ Added Critical Injury time to heal in sheets ([23d9aa4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/23d9aa44bb945ed37c443ed18dc740b75a349215)), closes [#112](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/112)
- ✨ Added dynamic message system ([b1e7243](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b1e724320280bf808e2bd15ebe9083357e45f8c3))
- ✨ Added semver comparison tool. ([5278ed3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5278ed3f3a07d7e4a6c9270d6ee8e8abdcd29ff0))
- ✨ Added Spanish localized Chargen ([296c6cd](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/296c6cd18a0ca21e79c80a794da29e9a10695372))
- ✨ Added welcome message ([eedbf67](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/eedbf67b0f74e67d185890d6a56f2799f8771c6c))

### Bug Fixes

- 🐛 Fixes [#123](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/123) Chargen not randomizing added paths. ([31abb58](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/31abb58fc86c6ac97141e6133936e4e9b440a6f9))
- 🐛 Further compatibility fixes ([99c184e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/99c184e8780d0c8875ed536e154f2d17ca041bc0))
- 🐛 Initial compatibility fixes and recommendations ([206be62](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/206be62ef403b29f47b0f18fd11556f7dcfce5c6))
- 🐛 Several logical errors fixed ([fb13c76](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/fb13c766cada3b4559f366e676518204b98c7826))

### [5.3.4](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.3...v5.3.4) (2021-05-20)

### Bug Fixes

- 🐛 Added 2nd GM Screen Hook ([431256d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/431256d60ff52e517d82d4b5051be916f6159f2e))

### [5.3.3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.2...v5.3.3) (2021-05-20)

### Bug Fixes

- 🐛 GM screen disabled buttons in sheets. ([15059d7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/15059d779d97eaf6a9b65a84aeb4d2614e9a4822))
- 🐛 Journal title border now displaying properly. ([bd81b70](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/bd81b70f1263d66e097ccb81f049b7e26b7663ed))

### [5.3.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.1...v5.3.2) (2021-05-11)

### Bug Fixes

- 🐛 Chargen now deletes existing items. ([1623f63](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1623f630d2e535313fa43ec749d6140409bf2c20))
- 🐛 Fixes [#115](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/115) ([1a0e68c](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/1a0e68c181353c446a3e98528d748beb8ce8e002))

### [5.3.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.3.0...v5.3.1) (2021-05-08)

## [5.3.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.2.1...v5.3.0) (2021-05-08)

### Features

- ✨ Added default portraits for the actor entities ([d014bf5](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/d014bf59748200b0f71c7df582ba00f273f8f550))
- ✨ Changed how datasets are loaded ([b10bb29](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b10bb296e224851d512be50713ae379b8abf9e88))
- ✨ Changed to a file picker for dynamic import ([150b471](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/150b471f3d786beab6efb534b14be1a68126c8d6))
- **character-generator:** refactoring to allow dataset file to be translated independently. ([35b5f8e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/35b5f8e4ba83f59618a02cb9c2cd8ce9cf03d469))
- **character-generator:** refactoring to allow dataset file to be translated independently. ([2a3d16a](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/2a3d16a2adbfdb72a6eebf66256a6ec66ee523e6))

### Bug Fixes

- 🐛 Fixed mistaken blocked push for GM ([aa31c8e](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/aa31c8e5dcaca54913ab679946190e5a4dd4ebb9))
- 🐛 Border and Alignment fixes ([eec3644](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/eec36441252fd66781f83d55b8421cfa1f3aa075))
- 🐛 Formatting, more alignment and an undefined error ([913f2d3](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/913f2d32ca67ec03b4bba3184aa2af5c925b5c4e))
- 🐛 Moved i18n of Attr/Skills to Handlebars helper ([ab606e7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/ab606e7146aae58b394c5a86be991b59af83d3c8))

### [5.2.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.2.0...v5.2.1) (2021-04-25)

## [5.2.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.1.2...v5.2.0) (2021-04-25)

### Features

- ✨ ♻️ Ported the Styling of Journal entries to the system ([cfb654a](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/cfb654aa53bd3d61e696167d1eadddde44da2322))
- ✨ Diceless artifact category ([33f3229](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/33f32298af3315d0707f85a716fc7dc65a5b3c29)), closes [#105](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/105)
- ✨ Limited character sheet ([af19ff7](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/af19ff7547dd6e516c85b09e5c7f8384f34d0c4a))

### Bug Fixes

- 🐛 Character generator now treats elves correctly ([5b13978](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/5b13978e1552ec60d6ba502b951d5109d0b2752b)), closes [#95](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/issues/95)
- 🐛 Fixes to character generator ([7a573b0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/7a573b00ccf2826c2777dd2a235b914f9e733eb2))
- 🐛 Various alignment and layout fixes ([0bf68c1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/0bf68c105c78596b8008800473b0711ff7748513))

### [5.1.2](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.1.1...v5.1.2) (2021-04-19)

### Bug Fixes

- 🐛 Several fixes to sheets ([11a9b9f](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/11a9b9fc7a5a12dfe589556e92c56e388f9a8644))

### [5.1.1](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/compare/v5.1.0...v5.1.1) (2021-04-18)

### Bug Fixes

- 🐛 Hotfix for various issues introduced in 5.1.0 ([b5d32cc](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b5d32cc9aedfdad0eaeddba870566b86a21ad37b))
- 🐛 Minor bug in system.json zip link ([b23ca0d](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commit/b23ca0d51ffd1dacf106e8fb61cf6b86654149a7))
