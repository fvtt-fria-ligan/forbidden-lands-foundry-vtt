const gulp = require("gulp");
const { rollup } = require("rollup");
const argv = require("yargs").argv;
const chalk = require("chalk");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const gulpif = require("gulp-if");
const path = require("path");
const execa = require("execa");
const rollupConfig = require("./rollup.config");
const semver = require("semver");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
sass.compiler = require("sass");

/********************/
/*  CONFIGURATION   */
/********************/

const repoName = path.basename(path.resolve("."));
const sourceDirectory = "./src";
const distDirectory = "./dist";
const stylesDirectory = `${sourceDirectory}/styles`;
const stylesExtension = "scss";
const sourceFileExtension = "js";
const srcFiles = ["lang", "templates"];
const staticFiles = ["assets", "fonts", "scripts", "system.json", "template.json", "LICENSE"];
const getDownloadURL = (version) =>
	`https://github.com/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases/download/v${version}/fbl-fvtt_v${version}.zip`;
const repoPathing = (relativeSourcePath = ".", sourcemapPath = ".") => {
	return path.resolve(path.dirname(sourcemapPath), relativeSourcePath);
};

// load environment variables
const result = dotenv.config();
if (result.error) {
	throw result.error;
}
const env = process.env.NODE_ENV || "development";
const stdio = "inherit";

/********************/
/*      BUILD       */
/********************/

/**
 * Build the distributable JavaScript code
 */
async function buildCode() {
	const build = await rollup({ input: rollupConfig.input, plugins: rollupConfig.plugins });
	return build.write({
		...rollupConfig.output,
		sourcemapPathTransform: env === "development" ? repoPathing : null,
	});
}

/**
 * Build style sheets
 */
function buildStyles() {
	return gulp
		.src(`${stylesDirectory}/forbidden-lands.${stylesExtension}`)
		.pipe(gulpif(env === "development", sourcemaps.init()))
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(gulpif(env === "development", sourcemaps.write()))
		.pipe(gulp.dest(`${distDirectory}/styles`));
}

/**
 * Copy other source files
 */
async function copyFiles() {
	for (const file of srcFiles) {
		if (fs.existsSync(`${sourceDirectory}/${file}`)) {
			await fs.copy(`${sourceDirectory}/${file}`, `${distDirectory}/${file}`);
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
	gulp.watch(`${sourceDirectory}/**/*.${sourceFileExtension}`, { ignoreInitial: false }, buildCode);
	gulp.watch(`${stylesDirectory}/**/*.${stylesExtension}`, { ignoreInitial: false }, buildStyles);
	gulp.watch(
		srcFiles.map((file) => `${sourceDirectory}/${file}`),
		{ ignoreInitial: false },
		copyFiles,
	);
}

/********************/
/*      CLEAN       */
/********************/

/**
 * Remove built files from `dist` folder while ignoring source files
 */
async function clean() {
	const files = [...staticFiles, ...srcFiles, "module"];

	if (fs.existsSync(`${stylesDirectory}/forbidden-lands.${stylesExtension}`)) {
		files.push("styles");
	}

	console.log(" ", chalk.yellow("Files to clean:"));
	console.log("   ", chalk.blueBright(files.join("\n    ")));

	for (const filePath of files) {
		await fs.remove(`${distDirectory}/${filePath}`);
	}
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

const execBuild = gulp.parallel(buildCode, buildStyles, copyFiles, pipeStatics);

exports.build = gulp.series(clean, execBuild);
exports.watch = gulp.series(buildWatch);
exports.clean = clean;
exports.link = linkUserData;
exports.bump = gulp.series(bumpVersion, changelog, clean, execBuild);
exports.release = commitTagPush;
