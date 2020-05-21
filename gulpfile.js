// Requires
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var pkg = require('./package.json');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var del = require('del');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var size = require('gulp-size');
var svgmin = require('gulp-svgmin');
var svgSymbols = require('gulp-svg-symbols');
var tailwind = require('tailwindcss');
var uglify = require('gulp-uglify');


// Styles task
var styles = function (done) {
  // Make sure this feature is activated before running
	if (!pkg.tasks.styles) return done();

  return src(pkg.paths.styles.input)
    .pipe(sass())
    .pipe(postcss([
      tailwind(),
      autoprefixer(),
    ]))
    .pipe(size({ title: 'CSS', gzip: true, showFiles: true }))
    .pipe(dest(pkg.paths.styles.output))
    .pipe(rename({ suffix: '.min' }))
    .pipe(csso())
    .pipe(size({ title: 'CSS', gzip: true, showFiles: true }))
    .pipe(dest(pkg.paths.styles.output))
    .pipe(browserSync.stream());
}


// Scripts task
var scripts = function (done) {
  // Make sure this feature is activated before running
	if (!pkg.tasks.scripts) return done();

  return src(pkg.globs.scripts)
    .pipe(concat(pkg.vars.scripts))
    .pipe(uglify())
    .pipe(size({ title: 'JS', gzip: true }))
    .pipe(dest(pkg.paths.scripts.output));
}


// Images task
var images = function (done) {
  // Make sure this feature is activated before running
	if (!pkg.tasks.images) return done();

  return src(pkg.paths.images.input)
    .pipe(changed(pkg.paths.images.input))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75 }),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(size({ title: 'Images', gzip: true }))
    .pipe(dest(pkg.paths.images.output));
}


// Fonts task
var fonts = function (done) {
  // Make sure this feature is activated before running
	if (!pkg.tasks.fonts) return done();

  return src(pkg.paths.fonts.input)
    .pipe(changed(pkg.paths.fonts.input))
    .pipe(dest(pkg.paths.fonts.output));
}


// Clean task
var clean = function (done) {
  // Make sure this feature is activated before running
	if (!pkg.tasks.clean) return done();

	del.sync(
    pkg.paths.clean
  );

	// Signal completion
	return done();
}


// Server task
var startServer = function (done) {
	// Make sure this feature is activated before running
	if (!pkg.tasks.reload) return done();

	// Initialize BrowserSync
	browserSync.init({
    server: {
			baseDir: pkg.paths.reload
		}
	});

	// Signal completion
	done();
};

// Reload the browser when files change
var reloadBrowser = function (done) {
  // Make sure this feature is activated before running
  if (!pkg.tasks.reload) return done();

  browserSync.reload();

  // Signal completion
  done();
};

// Watch for changes
var watchSource = function (done) {
	// Make sure this feature is activated before running
  if (!pkg.tasks.reload) return done();

  watch(pkg.paths.styles.input, series(styles));
  watch(pkg.paths.tailwind, series(styles));
  //watch(pkg.paths.scripts.input + '**/*.js', series(parallel(scripts), reloadBrowser));
  watch(pkg.paths.images.input, series(images));
  watch(pkg.paths.fonts.input, series(fonts));
  watch(pkg.paths.templates, series(reloadBrowser));

  // Signal completion
  done();
};


// Default task
exports.default = series(
  clean,
  parallel(styles, images, fonts),
  startServer,
	watchSource
);


// Build task
exports.build = series(
  clean,
  parallel(styles, images, fonts)
);
