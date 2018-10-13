const babel = require("gulp-babel");
const gulp = require("gulp");
const concat = require("gulp-concat");
const watch = require("gulp-watch");


const chemins = {
  demo: "./docs/demo/modules/ui-validations/distrib/",
  demoSrc: "./docs/demo"
};

gulp.task("ui-validations.min.js", () => {
  return gulp.src([
      "sources/ui-validations.js"
    ])
    .pipe(concat("ui-validations.min.js"))
    .pipe(babel({
      presets: ["es2017"],
      compact: false,
      minified: false,
      comments: false,
      plugins: ["minify-mangle-names"]
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("ui-validations-es2015.min.js", () => {
  return gulp.src([
      "sources/ui-validations.js"
    ])
    .pipe(concat("ui-validations-es2015.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: true,
      minified: true,
      comments: false,
      plugins: ["minify-mangle-names"]
    }))
    .pipe(gulp.dest("distrib"))
});

gulp.task("watch:ui-validations.min.js", function() {
  watch("./sources/ui-validations.js", function() {
    gulp.run("ui-validations.min.js");
    gulp.run("demo");
  });
});

// gulp.task("vendor", () => {
//   return gulp.src([
//       "node_modules/htmlelement-extension/distrib/htmlElement.min.js"
//     ])
//     .pipe(gulp.dest(chemins.demoSrc))
// })

gulp.task("demo", ["ui-validations.min.js"], () => {
  return gulp.src([
      "sources/ui-validations.js"
    ])
    .pipe(concat("ui-validations.min.js"))
    .pipe(babel({
      presets: ["es2015"],
      compact: false,
      minified: false
    }))
    .pipe(gulp.dest(chemins.demo))
});


gulp.task("default", ["ui-validations.min.js", "demo"]);

gulp.task("tests", ["ui-validations.min.js"]);

gulp.task("release", ["ui-validations.min.js", "ui-validations-es2015.min.js", "demo"]);



gulp.task("all", ["default"]);

gulp.task("watch", ["watch:ui-validations.min.js"]);