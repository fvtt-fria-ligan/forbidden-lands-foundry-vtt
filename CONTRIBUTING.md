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

## :globe_with_meridians: Localization

We are grateful for any and all localization support we can get. To localize the system you do not need to download or set up the system. To make it easier to help with localization we are using GitLocalize. All you need is a GitHub account. Then you can [head over to our GitLocalize page](https://gitlocalize.com/repo/5750) and start translating.

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
npm run build
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
npm run build:watch
```

You can cancel watching the files for changes by using the command `ctrl + c` in the terminal window.

> **It's not working!** If somewhere along the line something failed, or you are not seeing the Forbidden Lands system in Foundry. Do not stress! Please reach out to us in either Discord or the Discussions here. See [But I just have a question!](#but-i-just-have-a-question)

### 5. .Husky

This project uses the [git hooks automator: Husky](https://typicode.github.io/husky/#/). Husky helps improve the workflow of the project by controlling commit messages for semver compatibility, and automates building, linting and formatting. For your own ease of use it is important you make sure that Husky is functioning correctly.

To do so make a test branch in the project and commit a new file using a commit message that will fail. E.g.

```bash
git checkout -b test-branch
touch test.file
git add -A
git commit -m "test commit"
```

You should now see Husky running.

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
│   ├── system.json
│   ├── template.json
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── CONTRIBUTING.md
├── foundryconfig-example.json
├── gulpfile.js
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── rollup.config.json
```

1. `.husky`: This is a git hooks enhancment tool. See [.Husky](#.husky)
2. `/archive`: This directory contains the previous builds of the system.
3. `/dist` \*_Generated_: The directory contains the output of the build process. It is not part of the git repository.
4. `/node_modules` \*_Generated_: A directory generated when running the `npm install` command. It contains all the dependencies of the project.
5. `src`: This is the directory you want to focus most of your attention on. It contains the following subdirectories:
    - `lang`: Language files. You may opt to do localization directly on the files. _**Note:** This is not the preferred way of doing localization._
    - `module`: Javascript modules. The main file `forbidden-lands.js` imports the scripts in the subdirectories and configures the system.
    - `styles`: The project uses SASS (SCSS). It is almost like CSS except it allows for modularization and more perks. `forbidden-lands.scss` only imports the various partial files.
    - `templates`: This is the folder that contains all the html, or handlebars partials if you like. They are formatted as `.hbs`.
6. `/static`: The static directory is special. It is usually ignored by `git`, and so you should be vary of changing anything within this directory. Pull requests changing the contents of this folder will likely be rejected, unless there is good reason to modify these files.
7. `.editorconfig`, `.eslintrc.js`, `.prettierrc`: These two files achieve the same goal. They lint and format the code to comply with the style guide.
8. `.eslintignore`, `.gitignore`, `.nvmrc`, `.prettierignore`: These are ignore files configured to ignore certain directories that do not require linting or configuring.
9. `CONTRIBUTING.md`: You are reading it.
10. `foundryconfig-example.json`: Rename this file `foundryconfig.json` and edit it to contain the absolute path to your `Foundry VTT/Data`-folder.
11. `gulpfile.js`: This file contains the configuration for the scripts used to build and watch the project as well as releases.
12. `LICENSE`: The License file for the project.
13. `package-lock.json` and `package.json`: These files are used by `npm` to configure the project, and track dependencies.
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

Check the instructions for [localization with GitLocalize](#globe_with_meridians-Localization), as this helps you help us with localization.

### Spread the word

We are always looking for someone who can help with the project or one of the other projects in our organization. If you do not feel like you can contribute yourself, maybe you know someone who can:vulcan_salute:

## :dart: Pull Requests

When you are ready to submit a pull request, make sure you do a few things to help speed up the process.

1.  Make sure you have not modified the files in the `/static` directory. If you need to modify static files make sure you explain in detail why, and whether you have dealt with potential migration issues.
2.  Make sure [Husky](#.husky) has done its job. E.g. check your commit messages to see that they follow [Conventional Commits Standards](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
3.  Now you are ready to submit a Pull Request. The project contains three branches: `main`, `dev`, and `localization-gitlocalize`. When submitting a Pull Request make sure to point it to the `dev` branch. `dev` is continuously merged with main after a period of testing. Then a release is cut from main.
4.  When creating the Pull Request consider prefacing the title with [an emoji that indicates the type of pull request](https://gitmoji.dev/).
5.  Briefly describe the pull request and whether you have made any deletions or modifications that may be breaking.
6.  That's it! Thank you so much for your help with improving this project:purple_heart:
