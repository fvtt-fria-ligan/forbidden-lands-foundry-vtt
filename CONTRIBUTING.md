  <img src="https://user-images.githubusercontent.com/9851733/113288028-aac76c80-92ee-11eb-864a-356c00ff1920.png" alt="Logo" style="max-width:100%;" />
<p align="center">
:crossed_swords::skull: Thank you for wanting to contribute to this project! :skull::crossed_swords:</p>
<br>

# Contributing to Forbidden Lands for Foundry VTT

This project depends on the Foundry VTT community. That is why we try to accept all contributions no matter how small, or how new you are to programming or Foundry. The below are mostly guidelines on how to contribute to the project.

### But I just have a question!

> **Note:** [Please don't file an issue to ask a question.](/../../issues) You'll get better help by using the resources below.

If you have usage questions the best place to get help is in the [#free-league channel on the official Foundry VTT Discord](https://discord.gg/foundryvtt).

Otherwise, discussion about the development of the Forbidden Lands system can be [found in discussions](/../../discussions).

### Table of contents

1. [Localization](#globe_with_meridians-Localization)

2. [Get Started](#rocket-get-started)

3. [What's in the Box?](#package-whats-in-the-box)

4. [How do I Contribute?](hammer_and_wrench-how-do-i-contribute)

5. [Pull Requests](#dart-pull-requests)

6. [History Rewrite](#recycle-history-rewrite)

## :globe_with_meridians: Localization

We are grateful for any and all localization support we can get. To localize the system you do not need to download or set up the system. To make it easier to help with localization we are using GitLocalize. All you need is a GitHub account. Then you can [head over to our GitLocalize page](https://gitlocalize.com/repo/6008) and start translating.

Once you are done, click the yellow button that says "Create Review Request" and GitLocalize will handle the rest on your behalf.

### But I don't see my language in the list!

> Don't worry!

Click the "Add Language" button and get started. :+1:

## :rocket: Get Started

> **Important!** You need to [have node.js LTS-version installed](https://nodejs.org/en/) with npm available.

**Fork** or [Clone](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt.git) the project and open the project folder in your terminal:

### 1. Install dependencies.

```bash
# Install the dependencies.
npm install
```

### 2. Build dist folder.

```bash
# Build the dist folder where the system package lives.
npm run dev
```

### 3. Link dist folder in systems.

To make sure that Foundry VTT will be able to detect the system so you can debug properly, you need to connect your dist folder with a symbolic link or folder junction in the `systems/`-folder in `FoundryVTT/Data`. You should make sure you do not have a pre-existing forbidden-lands installation in the `systems/`-folder.

Configure a `foundryconfig.json`-file in the project's root folder it should contain information that looks like this:

```json
{
	// On Linux / macOS

	"dataPath": "/absolute/path/to/your/FoundryVTT/Data"
}
```

```json
{
	// On Windows

	"dataPath": "\\absolute\\path\\to\\your\\FoundryVTT\\Data"
}
```

```json
{
	// Relative path

	"dataPath": "../../Data"
}
```

Once you have configured where your Foundry VTT Data-folder is, you can link the dist folder:

```bash
# Run the project linking command.

npm run link-project
```

### 4. Test that it all works and start editing!

You should now be able to open Foundry VTT and create a world using the Forbidden Lands system.

If you do, congratulations:tada:! To begin editing the code:

```bash
# Run the command that builds the dist folder then watches it for changes.

npm run dev #This builds the dist directory and ports static files

npm run dev:watch #Same as above and watches for files changes.
```

You can cancel watching the files for changes by using the command `ctrl + c` in the terminal window.

> **It's not working!** If somewhere along the line something failed, or you are not seeing the Forbidden Lands system in Foundry. Do not stress! Please reach out to us in either Discord or the Discussions here. See [But I just have a question!](#but-i-just-have-a-question)

### 5. .Husky

This project uses the [git hooks automator: Husky](https://typicode.github.io/husky/#/). Husky helps improve the workflow of the project by controlling commit messages for semver compatibility, and automates building, linting and formatting. For your own ease of use it is important you make sure that Husky is functioning correctly.

To do so make a test branch in the project and commit a new file using a commit message that will fail. E.g.

```bash
git checkout -b test-branch
touch test.file
git commit -am "feat: test commit"
```

You should now see Husky running. And if it works correctly the commit should pass and an emoji should be added to the commit message lke so `feat: ✨ test commit`.

If you have permission issues with Husky on Linux or macOS. Run the below commands to set the right executable permissions for Husky and git hooks.

```bash
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## :package: What's in the Box?

Following are some of the files and folders that you may be interested in editing, and some you shouldn't edit:

```
.
├── .husky
├── archive
├── dist*
├── node_modules*
├── src
│   ├── lang
│   ├── module
│   │	├── forbidden-lands.js
│   ├── styles
│   │	├── forbidden-lands.scss
│   ├── templates
├── static
│	├── assets
│   ├── system.json
│   ├── template.json
├── .editorconfig
├── .env
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── CONTRIBUTING.md
├── foundryconfig-example.json
├── gulpfile.js
├── jsconfig.json
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── rollup.config.json
```

0. `.github/`: This directory contains Github Actions CI files and Github Issue Templates.
1. `.husky/`: This is a git hooks enhancment tool. See [.Husky](#.husky)
2. `dist/` \*_Generated_: The directory contains the output of the build process. It is not part of the git repository.
3. `node_modules/` \*_Generated_: A directory generated when running the `npm install` command. It contains all the dependencies of the project.
4. `src/`: This is the directory you want to focus most of your attention on. It contains the following subdirectories:
    - `forbidden-lands.js` imports the scripts in the subdirectories and configures the system.
    - `forbidden-lands.scss` only imports the various partial files.
5. `static/`: The static directory contains assets and the system- and template.json files. This directory rarely sees changes.
    - `assets/` Character generation datasets are contained in the `datasets` subdirectory.
    - `lang/`: Language files. You may opt to do localization directly on the files. _**Note:** This is not the preferred way of doing localization._
6. `.editorconfig`, `.eslintrc.json`, `.prettierrc.json`: These files achieve the same goal. They lint and format the code to comply with the style guide.
7. `.eslintignore`, `.gitignore`, `.nvmrc`, `.prettierignore`: These are ignore files configured to ignore certain directories that do not require linting or configuring.
8. `CHANGELOG.md`: This file contains changes made up until the latest release. It is automatically generated when one of the admins bumps the version of the system.
9. `CONTRIBUTING.md`: You are reading it.
10. `foundryconfig-example.json`: Rename this file `foundryconfig.json` and edit it to contain the absolute path to your `Foundry VTT/Data`-folder.
11. `.jsconfig.json` and `gulpfile.js`: These files contains the configuration for the scripts used to build and watch the project as well as releases.
12. `LICENSE`: The License file for the project.
13. `package-lock.json` and `package.json`, as well as `.env`: These files are used by `npm` to configure the project, and track dependencies.
14. `README.md`: The Readme and project page.
15. `rollup-config.json`: The config file for javascript concatenation.

## :hammer_and_wrench: How do I contribute?

> Glad you asked!

### Open issues

At any time the project has [a few open issues](/../../issues). If there is anything in there you think you would want to cut your teeth on, please do! Check [open pull requests](/../../pulls) first to see if there are anyone working on the issue. If you decide to tackle an issue, assign yourself to it, or comment on it, to indicate that you intend to work on it.

### Project page

Our [project page](/../../projects/1) contains a list of features and bugs that are suggested improvements to the system. Maybe there is something in there you would like to tackle.

### Raise an issue

Maybe you have found a bug, or maybe you have a feature in mind that you would like to see implemented. Head over to the [issue tracker](/../../issues) first, and see if it is already listed there. If it is not, go ahead and open an issue, if it is feel free to bump it or comment on it.

If you want to work on a bug or a feature yourself, please raise an issue first then assign yourself to it or indicate that you will be working on it. This way we don't end up with two people working on the same thing:bulb:

### Localization

Thank you for wanting to help with localization. You can find the localization files in the `static/lang` directory. The files are named according to the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard. If you want to contribute with localization, please follow these steps:

1.  Fork the repository.
2.  Create a new branch from the `main` branch.
3.  Make your changes in the `.json`-file for your desired language, or make a new one\*\*. You can reference the `en.json`-file to see what keys are used.
4.  Commit your changes. Make sure to follow the [Conventional Commits Standards](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
5.  Push your changes to your fork.
6.  Open a pull request to the `main` branch of the repository.

\*\*If you are making a new file, make sure to add it to the `manifests/v10/system.json`-file.

### Spread the word

We are always looking for someone who can help with the project or one of the other projects in our organization. If you do not feel like you can contribute yourself, maybe you know someone who can:vulcan_salute:

## :dart: Pull Requests

When you are ready to submit a pull request, make sure you do a few things to help speed up the process.

1.  Keep it tidy. Fewer commits with changes logically grouped together makes it easier to review them.
2.  Make sure [Husky](#.husky) has done its job. E.g. check your commit messages to confirm that they follow [Conventional Commits Standards](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
3.  Now you are ready to submit a Pull Request. The project contains two branches: `main`, and `localization`. When submitting a Pull Request make sure to point it to the `main` branch. Unless, you are pushing a **localization** change, then point to `localization` instead.
4.  When creating the Pull Request consider prefacing the title with [an emoji that indicates the type of pull request](https://gitmoji.dev/).
5.  Briefly describe the pull request and whether you have made any deletions or modifications that may be breaking.
6.  That's it! Thank you so much for your help with improving this project:purple_heart:

## :recycle: The History Rewrite

> If you are new around here, this information is for already existing forks.

### It all started when we got hold of a missing piece...

of the history of this repository. The rewrite was necessary to reattach the missing piece. #74 details most of what happened.

In short, on the 1st. of May a full git rewrite (filter-repo) was force pushed to the public repository. And so any forks, clones or otherwise made before that date are not compatible with the current repository.

### I have a fork. What do I do?

Ideally, wipe your local repo and clone this one as upstream, then run:

```bash
git push -f --prune --mirror
```

To force push the reset to your origin repository.

### But I already have a downstream branch in development

Recovering from this requires a bit more work. If you have only a few commits on the downstream branch [make a diff patch](https://git-scm.com/docs/diff-generate-patch) and run:

```bash
git branch --set-upstream-to upstream
git reset hard @{u}
```

Then reapply the patch: `git apply /path/to/patch.diff` and push to your server like above.

Even if you have several commits you may want to consider doing the above diff patch method. The alternative is a rebase. For guidance on this look at the easy and hard case [in this document](https://htmlpreview.github.io/?https://raw.githubusercontent.com/newren/git-filter-repo/docs/html/git-rebase.html). Try the easy case first (there has been no changes to the recent history beyond commit id changes), if this doesn't work get back to where you started and attempt the hard case. Good luck!

Should you have any issues please open a discussion.
