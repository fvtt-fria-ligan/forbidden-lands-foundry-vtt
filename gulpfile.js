import gulp from "gulp";
import argv from "yargs";
import chalk from "chalk";
import fs from "fs-extra-plus";
import path from "path";
import execa from "execa";
import semver from "semver";
import esBuild from "./esbuild.config.js";

/********************/
/*  CONFIGURATION   */
/********************/
const production = process.env.NODE_ENV === "production";
const repoName = path.basename(path.resolve("."));
const sourceDirectory = "./src";
const distDirectory = "./dist";
const templateExt = "hbs";
const staticFiles = ["lang", "assets", "fonts", "scripts", "system.json", "template.json", "LICENSE"];
const getDownloadURL = (version) =>
	`https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases/download/v${version}/fbl-fvtt_v${version}.zip`;

const stdio = "inherit";

/********************/
/*      BUILD       */
/********************/

/**
 * Build the distributable JavaScript code
 */
async function buildSource() {
	await esBuild({ production });
}

/**
 * Copy other source files
 */
async function pipeTemplates() {
	const templateFiles = await fs.glob([`${sourceDirectory}/**/*.${templateExt}`]);
	if (templateFiles && templateFiles.length > 0) {
		for (const file of templateFiles) {
			await fs.copy(
				file,
				`${distDirectory}/templates/${file.replace(`${sourceDirectory}/`, "").replace("templates/", "")}`,
			);
		}
	}
}

/**
 * Copy other source files
 */
async function pipeStatics() {
	for (const file of staticFiles) {
		if (fs.existsSync(`static/${file}`)) {
			await fs.copy(`static/${file}`, `${distDirectory}/${file}`);
		}
	}
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
	buildSource({ watch: true });
	gulp.watch(`${sourceDirectory}/**/*.${templateExt}`, { ignoreInitial: false }, pipeTemplates);
	gulp.watch(
		staticFiles.map((file) => `static/${file}`),
		{ ignoreInitial: false },
		pipeStatics,
	);
}

/********************/
/*      CLEAN       */
/********************/

/**
 * Remove built files from `dist` folder while ignoring source files
 */
async function cleanDist() {
	if (await fs.existsSync(`./dist`)) await fs.remove(`./dist`);
}

/********************/
/*       LINK       */
/********************/

/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 */
function getDataPath() {
	const config = fs.readJSONSync("foundryconfig.json");

	if (config?.dataPath) {
		if (!fs.existsSync(path.resolve(config.dataPath))) {
			throw new Error("User Data path invalid, no Data directory found");
		}

		return path.resolve(config.dataPath);
	} else {
		throw new Error("No User Data path defined in foundryconfig.json");
	}
}

/**
 * Link build to User Data folder
 */
async function linkUserData() {
	let destinationDirectory;
	if (fs.existsSync(path.resolve("static/system.json"))) {
		destinationDirectory = "systems";
	} else {
		throw new Error(`Could not find ${chalk.blueBright("system.json")}`);
	}

	const linkDirectory = path.resolve(getDataPath(), destinationDirectory, repoName);

	if (argv.clean || argv.c) {
		console.log(chalk.yellow(`Removing build in ${chalk.blueBright(linkDirectory)}.`));

		await fs.remove(linkDirectory);
	} else if (!fs.existsSync(linkDirectory)) {
		console.log(chalk.green(`Linking dist to ${chalk.blueBright(linkDirectory)}.`));
		await fs.ensureDir(path.resolve(linkDirectory, ".."));
		await fs.symlink(path.resolve(distDirectory), linkDirectory);
	}
}

/********************/
/*    VERSIONING    */
/********************/

/**
 * Get the contents of the manifest file as object.
 */
function getManifest() {
	const manifestPath = `static/system.json`;

	if (fs.existsSync(manifestPath)) {
		return {
			file: fs.readJSONSync(manifestPath),
			name: "system.json",
		};
	}
}

/**
 * Get the target version based on on the current version and the argument passed as release.
 */
// eslint-disable-next-line no-shadow
function getTargetVersion(currentVersion, release) {
	if (["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"].includes(release)) {
		return semver.inc(currentVersion, release);
	} else {
		return semver.valid(release);
	}
}

async function changelog() {
	await execa("npx", ["standard-version", "--skip.bump", "--skip.tag", "--skip.commit"], { stdio });
}

/**
 * Commit and push release to Github Upstream
 */
async function commitTagPush() {
	const { version } = fs.readJSONSync("package.json");
	const commitMsg = `chore(release): Release ${version}`;
	await execa("git", ["add", "-A"], { stdio });
	await execa("git", ["commit", "--message", commitMsg], { stdio });
	await execa("git", ["tag", `v${version}`], { stdio });
	await execa("git", ["push", "upstream"], { stdio });
	await execa("git", ["push", "upstream", "--tag"], { stdio });
	return;
}

/**
 * Update version and download URL.
 */
async function bumpVersion(cb) {
	const packageJson = fs.readJSONSync("package.json");
	const packageLockJson = fs.existsSync("package-lock.json") ? fs.readJSONSync("package-lock.json") : undefined;
	const manifest = getManifest();

	if (!manifest) cb(Error(chalk.red("Manifest JSON not found")));

	try {
		// eslint-disable-next-line no-shadow
		const release = argv.release || argv.r;

		const currentVersion = packageJson.version;

		if (!release) {
			return cb(Error("Missing release type"));
		}

		const targetVersion = getTargetVersion(currentVersion, release);

		if (!targetVersion) {
			return cb(new Error(chalk.red("Error: Incorrect version arguments")));
		}

		if (targetVersion === currentVersion) {
			return cb(new Error(chalk.red("Error: Target version is identical to current version")));
		}

		console.log(`Updating version number to '${targetVersion}'`);

		packageJson.version = targetVersion;
		fs.writeJSONSync("package.json", packageJson, { spaces: "\t" });

		if (packageLockJson) {
			packageLockJson.version = targetVersion;
			fs.writeJSONSync("package-lock.json", packageLockJson, { spaces: "\t" });
		}

		manifest.file.version = targetVersion;
		manifest.file.download = getDownloadURL(targetVersion);
		fs.writeJSONSync(`static/${manifest.name}`, manifest.file, { spaces: "\t" });

		return cb();
	} catch (err) {
		cb(err);
	}
}

const execBuild = gulp.parallel(buildSource, pipeTemplates, pipeStatics);

export const clean = cleanDist;
export const build = gulp.series(clean, execBuild);

export const watch = gulp.series(buildWatch);
export const link = linkUserData;
export const bump = gulp.series(bumpVersion, changelog, clean, execBuild);
export const release = commitTagPush;
