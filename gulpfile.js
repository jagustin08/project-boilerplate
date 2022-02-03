// Initialize modules
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();

const { src, series, parallel, dest, watch } = require("gulp");

// Optimize image
function imgTask() {
  return src("app/images/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
}

// Copy HTML files
function htmlTask() {
  return src("*.html").pipe(gulp.dest("dist"));
}

// JS task
function jsTask() {
  return src("app/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"));
}

// Sass task
function sassTask() {
  return src("app/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat("main.css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"));
}

// Browsersync
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}

// Automatically reload the browser on save
function browserSyncReload() {
  browserSync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch("*.html", parallel(htmlTask, browserSyncReload));
  watch(
    ["app/sass/**/*.scss", "app/js/**/*.js"],
    parallel(sassTask, jsTask, browserSyncReload)
  );
}

// Run gulp
exports.default = series(
  parallel(htmlTask, imgTask, jsTask, sassTask, browserSyncServe),
  watchTask
);
