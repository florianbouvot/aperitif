// Requires
var pkg = require('./package.json');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var data = require('gulp-data');
var del = require('del');
var fs = require('fs');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var size = require('gulp-size');
var svgmin = require('gulp-svgmin');
var svgSymbols = require('gulp-svg-symbols');
var twig = require('gulp-twig');
var uglify = require('gulp-uglify');





// BrowserSync reload
function reload(done) {
  browserSync.reload();
  done();
};

// Get data for JSON
function getData() {
  var data = JSON.parse(fs.readFileSync(pkg.paths.src.base + pkg.vars.dataName, 'utf8'));
  return data;
};





// CSS task
gulp.task('css-vendor', function() {
  return gulp.src(pkg.globs.cssVendor)
  .pipe(rename({
    prefix: '_',
    extname: '.scss'
  }))
  .pipe(gulp.dest(pkg.paths.src.css + 'vendor'))
})

gulp.task('css', function() {
  var plugins = [
    autoprefixer(),
    cssnano({ preset: 'default' })
  ];

  return gulp.src(pkg.paths.src.css + '**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'CSS', gzip: true, showFiles: true }))
    .pipe(gulp.dest(pkg.paths.dist.css))
    .pipe(browserSync.stream());
});

// JS task
gulp.task('js', function() {
  return gulp.src(pkg.globs.js)
    .pipe(plumber())
    .pipe(concat(pkg.vars.jsName))
    .pipe(uglify())
    .pipe(size({ title: 'JS', gzip: true }))
    .pipe(gulp.dest(pkg.paths.dist.js));
});

// HTML task
gulp.task('html', function() {
  return gulp.src(pkg.paths.src.html + '*.{html,twig}')
    .pipe(data(getData()))
    .pipe(twig())
    .pipe(gulp.dest(pkg.paths.dist.html));
});

// Images task
gulp.task('images', function() {
  return gulp.src(pkg.paths.src.img + '**/*')
    .pipe(changed(pkg.paths.dist.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(size({ title: 'Images', gzip: true }))
    .pipe(gulp.dest(pkg.paths.dist.img));
});

// Sprites task
gulp.task('sprites', function() {
  return gulp.src(pkg.paths.src.sprites + '**/*.svg')
    .pipe(svgo({ plugins: [{ removeViewBox: false }] }))
    .pipe(svgSymbols({ templates: ['default-svg'] }))
    .pipe(rename(pkg.vars.spriteName))
    .pipe(size({ title: 'Sprites', gzip: true }))
    .pipe(gulp.dest(pkg.paths.dist.sprites));
});

// Fonts task
gulp.task('fonts', function() {
  return gulp.src(pkg.paths.src.fonts + '**/*.{eot,ttf,woff,woff2}')
    .pipe(changed(pkg.paths.dist.fonts))
    .pipe(size({ title: 'Fonts', gzip: true }))
    .pipe(gulp.dest(pkg.paths.dist.fonts));
})

// Clean task
gulp.task('clean', function() {
  return del(pkg.globs.clean);
});

// Serve task
gulp.task('serve', function() {
  browserSync.init({
    server: pkg.urls.local
  });

  gulp.watch(pkg.paths.src.css + '**/*.scss', gulp.series('css'));
	gulp.watch(pkg.paths.src.js + '**/*.js', gulp.series('js', reload));
	gulp.watch([
      pkg.paths.src.html + '**/*.{html,twig}',
      pkg.paths.src.base + pkg.vars.dataName
    ], gulp.series('html', reload));
	gulp.watch(pkg.paths.src.img + '**/*', gulp.series('images'));
  gulp.watch(pkg.paths.src.sprites + '**/*.svg', gulp.series('sprites'));
  gulp.watch(pkg.paths.src.fonts + '**/*.{eot,ttf,woff,woff2}', gulp.series('fonts'))
});





// Default task
gulp.task('default',
  gulp.series(
    'css-vendor',
    gulp.parallel('css', 'js', 'html', 'images', 'sprites', 'fonts'),
    'serve'
  )
);

// Build task
gulp.task('build',
  gulp.series(
    'clean',
    'css-vendor',
    gulp.parallel('css', 'js', 'html', 'images', 'sprites', 'fonts')
  )
);
