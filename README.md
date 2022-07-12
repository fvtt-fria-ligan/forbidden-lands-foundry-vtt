<p align="center">
  <a href="https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/blob/main/LICENSE" target="_blank">
    <img alt="License: GPL" src="https://img.shields.io/badge/license-GPL--3.0-red?style=flat-square&label=License"/></a>
  <a href="https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases/latest" target="_blank"><img alt="system version" src="https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffvtt-fria-ligan%2Fforbidden-lands-foundry-vtt%2Fmain%2Fstatic%2Fsystem.json&label=Version&query=$.version&colorB=blue&style=flat-square"/></a>
  <a href="https://foundryvtt.com" target="_blank">
    <img src="https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffvtt-fria-ligan%2Fforbidden-lands-foundry-vtt%2Fmain%2Fstatic%2Fsystem.json&label=Foundry&query=$.compatibleCoreVersion&colorB=blue&style=flat-square" alt="foundry-compatibility-version"/></a>
  <a href="https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/graphs/commit-activity" target="_blank"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/fvtt-fria-ligan/forbidden-lands-foundry-vtt?style=flat-square&color=purple&label=Last%20commit"></a>
 <a href="https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases/latest/" target="_blank"><img alt="GitHub release (latest by SemVer including pre-releases)" src="https://img.shields.io/badge/dynamic/json?color=red&label=Downloads&query=$.assets.0.download_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2Ffvtt-fria-ligan%2Fforbidden-lands-foundry-vtt%2Freleases%2Flatest&style=flat-square"></a>
  <br/>
  <img src="https://user-images.githubusercontent.com/9851733/108728684-1a954b00-752a-11eb-9138-6fab6f83b2a8.jpg" alt="Logo" style="max-width:100%;" />
</p>

<p align="center">'Round the beggar from Varassa all sat in a ring, <br />and by the campfire they sat and heard his song. <br />About walkers and wolfkin and every terrible thing, <br />and of his fear he sang to them all night long:</p>
<p align="center"><em>"There is something beyond the mountains, <br />beyond the howls beyond the mist, <br />there is something behind the veils, <br />behind hearts cold as stone. <br />Hearken, something walks and whispers, <br />walks and lures you in and whimpers: <br />Come to us, for this earth shall ever be ours and ours alone!"</em></p>

# <p align="center">:crossed_swords::skull: Forbidden Lands for Foundry VTT :skull::crossed_swords:</p>

The **Officially supported**, and community developed system for playing Forbidden Lands on Foundry VTT.

The core system features no content. It only provides support for various mechanics required to play the game:

-   Character, and Monster sheets.
    -   Including the ability to drag-and-drop Gear, Talents, Spells and Critical Injuries.
    -   Integrated consumables roll mechanics.
    -   Automation through Roll Modifiers and Encumbrance tracking.
-   Party Sheet
    -   Bring the party together on Journeys. @maxstar's famous [Party Sheet](https://github.com/maxstar/forbidden-lands-party-sheet) is now part of the system.
-   Stronghold Sheets.
    -   Giving you the ability to track the buildings, hirelings, and resources in a stronghold through drag-and-drop.
-   Items:
    -   Gear — General equipment needed for adventuring.
    -   Weapon — Choose whether it is a normal weapon or an artifact.
    -   Armor — Armor rating, and track how to get your hands on some defense.
    -   Talent — Talents for characters. Helps you survive.
    -   Spells — Store information on powerful spells.
    -   Critical Injuries — Track those pesky injuries caused by monster attacks.
    -   Monster Attacks — For detailing vicious monster attacks causing critical injuries.
    -   Monster Talents — Monsters also have talents.
    -   Raw Materials — For building your stronghold.
    -   Stronghold Buildings — For ease of tracking the buildings in your stronghold.
    -   Stronghold Hirelings — Track wages, and capabilities of your stronghold's hirelings.
    -   Roll Modifiers can be customized on many items so you don't need to remember whether something gives you a bonus, or penalty, to your rolls.

Content for the system is available as addon modules. You can purchase them at Fria Ligan's website ([see below](#computer-websites)).

## :rocket: Install

1. Go to the setup page and choose **Game Systems**.
2. Click the **Install System** button, and paste in this [manifest link](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases/latest/download/system.json)
3. Create a Game World using the Forbidden Lands system.

## :vertical_traffic_light: Supported Modules

-   [Dice So Nice](https://foundryvtt.com/packages/dice-so-nice/) version 3.0 or later will give you beautiful 3D dice for each roll
-   [Year Zero Actions](https://foundryvtt.com/packages/alien-actions) for a better overview of what actions have been taken in combat.
-   [Forbidden Lands Card Combat](https://foundryvtt.com/packages/forbidden-card-combat) for your advanced combat needs.
-   [Token Action HUD](https://foundryvtt.com/packages/token-action-hud/) will support Forbidden Lands System very soon!
-   [Simple Calendar](https://foundryvtt.com/packages/foundryvtt-simple-calendar) now has the Forbidden Lands calendar implemented as a preset option.
-   [Virtual Tabletop Assets - Tokenizer](https://foundryvtt.com/packages/vtta-tokenizer/) is supported on all character sheets.
-   [Drag'n'Transfer](https://foundryvtt.com/packages/DragTransfer) can be set up using this array: `"character":"monster","monster":"stronghold","stronghold":"character"` (Thanks @moinen).

## :world_map: Preview

<img src="https://user-images.githubusercontent.com/9851733/115126329-9cf03780-9fce-11eb-953f-96cc54a097c4.png" alt="example" style="max-width:100%;" />

## :hammer_and_wrench: Contributing

If you want to contribute to the project, download and build it for something else, or if you simply have an issue, please read [our contributing guide](CONTRIBUTING.md) to learn more about how we accept contributions and how to set up the development version of the project.

## :pray: Contributors

:pencil2: System originally created by [@Perfectro](https://github.com/Perfectro)

:wrench: Currently developed by [@aMediocreDad](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=aMediocreDad) and [@narukaioh](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=narukaioh)

:sparkles: We have many great contributors to the project including [@patrys](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=patrys) [@maxstar](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=maxstar) [@jimorie](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=jimorie) [@giant-teapot](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=giant-teapot) [@roonel](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=roonel) [@romelwell](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=romelwell) [@moo-man](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=moo-man) [@SlamHammerfist](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=SlamHammerfist) [@lasseborly](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=lasseborly) and [@m0ppers](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=m0ppers)

:globe_with_meridians: Localization contributors: [@ptosekigloo](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=ptosekigloo) [@ptoseklukas](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=ptoseklukas) (cs), [@Bapf](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=Bapf) [@OnkelRod](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=OnkelRod) (de), [@DavidCMeier](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=DavidCMeier) [@KaWeNGoD](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=KaWeNGoD) (es), [@ismail-ahmed](https://github.com/ismail-ahmed) (fr), [@franklinbenini](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=franklinbenini) [@igorteuri](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=igorteuri) [@trprado](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=trprado) (pt-BR), and [@Rosataker](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/commits?author=Rosataker) (zh-TW)

:game_die: Dice graphics recreated by [Tomasz 'jarv' Dobrowolski](jarv@monochrome.pl) with permission from Fria Ligan.

:mage: Character Generator now features optional expanded Bitter Reach tables from [Reforged Power](https://www.drivethrurpg.com/product/351491/Reforged-Power-for-Forbidden-Lands), courtesy Experimental

As well as plenty of users who have come with great feedback, either on [the official Foundry discord server](https://discord.gg/foundryvtt) or in [issues](/../../issues)

## :computer: Websites

-   [Foundry VTT](https://foundryvtt.com/)
-   [Fria Ligan: Forbidden Lands](https://frialigan.se/en/store/?collection_id=84541866032)

## 📝 Licenses

-   **Logo and Content:** The [Forbidden Lands](https://frialigan.se/en/store/?collection_id=84541866032) logo and content is Copyright © and Trademarked by Free League Publishing. The parts of this project protected under this copyright may not be distributed commercially or freely. This includes art, logo, and copyright text (like the character-generator.json) sourced from the [Forbidden Lands](https://frialigan.se/en/store/?collection_id=84541866032) tabletop RPG.
    > Some content may be reused under [Free League's Open Gaming License](https://freeleaguepublishing.com/en/open-gaming-license/).
-   **Source Code:** All source code _(javascript, hbs, scss, as well as system templates and the like)_, are Copyright © 2021 [Free League Developer Community](https://github.com/fvtt-fria-ligan), and licenced under the [GNU General Public License v3.0](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/blob/main/LICENSE).
-   **Foundry VTT:** The project is created following the Foundry VTT [Limited License Agreement for module development](https://foundryvtt.com/article/license/).
-   **Fonts:** The fonts used in this project carry their own licenses:
    -   [IM Fell English Font Family](https://fonts.google.com/specimen/IM+Fell+English)
    -   [Poppins](https://fonts.google.com/specimen/Poppins)
