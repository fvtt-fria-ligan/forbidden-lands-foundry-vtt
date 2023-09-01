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

4. [How do I Contribute?](#hammer_and_wrench-how-do-i-contribute)

5. [Pull Requests](#dart-pull-requests)

6. [History Rewrite](#recycle-history-rewrite)

## :globe_with_meridians: Localization

We are grateful for any and all localization support we can get. Language files can be found in the `/lang`-directory. The files are named according to the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard.

See [How do I contribute?](#hammer_and_wrench-how-do-i-contribute) for more information.

## :rocket: Get Started

> [!IMPORTANT]
> You need to have either [Node.js](https://nodejs.org/en/) or [Bun](https://bun.sh) installed.

**Fork** or [Clone](https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt.git) the project and open the project folder in your terminal:

### 1. Install dependencies.

```bash

# Install the dependencies (Bun)
bun install

# Install the dependencies (Node)
npm install
```

Note that a `postinstall` script will run the `lefthook` git hooks, as well as run the `setup`-cli that aids in linking this `repository` with your `Foundry Data-systems directory`. Should it fail to execute, you can run it manually by running `npm run postinstall`.

### 2. Test that it all works and start editing!

Build the `src` files in watch-mode:

```bash
# Build the src files with Bun
bun start

# Build the src files with Node
npm start
```

You should now be able to open Foundry VTT and create a world using the Forbidden Lands system...

Congratulations:tada:!

> You can cancel watching the files for changes by using the command `ctrl + c` in the terminal window.

### Troubleshooting

**It's not working!** If somewhere along the line something failed, or you are not seeing the Forbidden Lands system in Foundry. Do not stress! Please reach out to us in either Discord or the Discussions here. See [But I just have a question!](#but-i-just-have-a-question)

## :package: What's in the Box?

Following are some of the files and folders that you may be interested in editing, and some you shouldn't edit:

```
.
├── .changeset
├── .github
├── .vscode
├── assets
├── fonts
├── lang
├── node_modules*
├── src
│   ├── [directories]
│   ├── forbidden-lands.js
│   ├── forbidden-lands.scss
├── templates
├── tools
│   ├── [files].ts
├── .editorconfig
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── esbuild.config.ts
├── forbidden-lands.js*
├── forbidden-lands.scss*
├── foundryconfig.json*
├── bun.lockb
├── lefthook.yml
├── LICENSE
├── package.json
├── README.md
├── rome.json
├── system.json
├── template.json
└── tsconfig.json
```

\* Denotes files or directories that are automatically generated and gitignored.

## :hammer_and_wrench: How do I contribute?

> Glad you asked!

### Open issues

At any time the project has [a few open issues](/../../issues). If there is anything in there you think you would want to cut your teeth on, please do! Check [open pull requests](/../../pulls) first to see if there are anyone working on the issue. If you decide to tackle an issue, assign yourself to it, or comment on it, to indicate that you intend to work on it.

### Raise an issue

Maybe you have found a bug, or maybe you have a feature in mind that you would like to see implemented. Head over to the [issue tracker](/../../issues) first, and see if it is already listed there. If it is not, go ahead and open an issue, if it is feel free to bump it or comment on it.

If you want to work on a bug or a feature yourself, please raise an issue first then assign yourself to it or indicate that you will be working on it. This way we don't end up with two people working on the same thing:bulb:

### Localization

We are grateful for any and all localization support we can get. Language files can be found in the `/lang`-directory. The files are named according to the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) standard. If you want to contribute with localization, please follow these steps:

1.  Fork the repository.
2.  Create a new branch from the `main` branch (a GUI app may help with the git operations. E.g. [Github Desktop](https://desktop.github.com/)).
3.  Make your changes in the `.json`-file for your desired language, or make a new one\*. You can reference the `en.json`-file to see what keys are used.
4.  Commit your changes. Make sure to follow the [Conventional Commits Standards](https://www.conventionalcommits.org/en/v1.0.0/)\*\*.
5.  Push your changes to your fork.
6.  Open a pull request to the `main` branch of the repository.

\*If you are making a new file, make sure to add it to the `/system.json`-file.
\*\*Following the [Get Started](#🚀-get-started) guide below may assist in formatting both the `json` file and the commit messages.

### Spread the word

We are always looking for someone who can help with the project or one of the other projects in our organization. If you do not feel like you can contribute yourself, maybe you know someone who can:vulcan_salute:

## :dart: Pull Requests

When you are ready to submit a pull request, make sure you do a few things to help speed up the process.

1.  Keep it tidy. Fewer commits with changes logically grouped together makes it easier to review them.
2.  Now you are ready to submit a Pull Request. The project's `trunk` is a branch called `main`. When submitting a Pull Request make sure to point it to the `main` branch.
3.  When creating the Pull Request, consider prefacing the title with [an emoji that indicates the type of pull request](https://gitmoji.dev/).
4.  Briefly describe the pull request and whether you have made any deletions or modifications that may be breaking.
5.  That's it! Thank you so much for your help with improving this project:purple_heart:

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
