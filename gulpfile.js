const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const { src, series, parallel, dest, watch } = require("gulp");

// Sass task
function sassTask() {
  return src("app/sass/**/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat("main.css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"));
}

// JS task
function jsTask() {
  return src("app/js/**/main.js")
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js"));
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
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch(["*.html", "app/sass/**/*.scss", "app/js/**/*.js"], parallel(sassTask, jsTask, browserSyncReload));
}

exports.default = series(parallel(sassTask, jsTask, browserSyncServe), watchTask);
