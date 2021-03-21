const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sass = require("gulp-sass");

// Build TS
gulp.task("buildTS", function () {
	const SRC = ["./src/app/**/*.ts", "./src/app/*.ts"];
	return gulp.src(SRC).pipe(tsProject()).js.pipe(gulp.dest("dist/module"));
});

// Build CSS
gulp.task("buildCSS", function () {
	const SRC = ["src/scss/**/*.scss"];
	return gulp.src(SRC).pipe(sass()).pipe(gulp.dest("dist/style"));
});

// Pipe Template files
gulp.task("pipeTemplates", function () {
	const SRC = ["src/template/**/*.hbs"];
	return gulp.src(SRC).pipe(gulp.dest("dist/template"));
});

// Pipe static files
gulp.task("pipeStatics", function () {
	const SRC = ["static/**/*"];
	return gulp.src(SRC).pipe(gulp.dest("dist"));
});

// Pipe Localisation files
gulp.task("pipeLang", function () {
	const SRC = ["src/lang/*"];
	return gulp.src(SRC).pipe(gulp.dest("dist/lang"));
});

exports.initialize = gulp.parallel("buildTS", "buildCSS", "pipeTemplates", "pipeLang", "pipeStatics");
