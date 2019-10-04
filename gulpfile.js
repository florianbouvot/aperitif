// Requires
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var pkg = require('./package.json');
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
var purgecss = require('@fullhuman/postcss-purgecss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var size = require('gulp-size');
var svgmin = require('gulp-svgmin');
var svgSymbols = require('gulp-svg-symbols');
var tailwindcss = require('tailwindcss');
var twig = require('gulp-twig');
var uglify = require('gulp-uglify');


// Get data for JSON
function getData() {
  var data = JSON.parse(fs.readFileSync(pkg.paths.src.base + pkg.vars.dataName, 'utf8'));
  return data;
};


// CSS task
function cssOptim() {
  var plugins = [
    purgecss({
      content: pkg.globs.purgecssContent,
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:\/@\\]+/g) || [],
      whitelist: pkg.globs.purgecssWhitelist
    }),
    cssnano({ preset: 'default' })
  ];

  return src(pkg.globs.purgecss)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(size({ title: 'CSS', gzip: true, showFiles: true }))
    .pipe(dest(pkg.paths.dist.css));
}

function cssVendor() {
  return src(pkg.globs.cssVendor)
    .pipe(rename({
      prefix: '_',
      extname: '.scss'
    }))
    .pipe(dest(pkg.paths.src.css + 'vendor'));
}

function css() {
  var plugins = [
    tailwindcss(),
    autoprefixer()
  ];

  return src(pkg.paths.src.css + '*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ title: 'CSS', gzip: true, showFiles: true }))
    .pipe(dest(pkg.paths.dist.css))
    .pipe(browserSync.stream());
}


// JS task
function js() {
  return src(pkg.globs.js)
    .pipe(plumber())
    .pipe(concat(pkg.vars.jsName))
    .pipe(uglify())
    .pipe(size({ title: 'JS', gzip: true }))
    .pipe(dest(pkg.paths.dist.js));
}

function jsRgpd() {
  return src(pkg.globs.jsRgpd)
    .pipe(plumber())
    .pipe(concat(pkg.vars.jsRgpdName))
    .pipe(uglify())
    .pipe(size({ title: 'JS-RGPD', gzip: true }))
    .pipe(dest(pkg.paths.dist.js));
}


// Images task
function images() {
  return src(pkg.paths.src.img + '**/*')
    .pipe(changed(pkg.paths.dist.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(size({ title: 'Images', gzip: true }))
    .pipe(dest(pkg.paths.dist.img));
}


// Sprites task
function sprites() {
  return src(pkg.paths.src.sprites + '**/*.svg')
    .pipe(svgmin({ plugins: [{ removeViewBox: false }] }))
    .pipe(svgSymbols({ templates: ['default-svg'] }))
    .pipe(rename(pkg.vars.spriteName))
    .pipe(size({ title: 'Sprites', gzip: true }))
    .pipe(dest(pkg.paths.dist.sprites));
}


// Fonts task
function fonts() {
  return src(pkg.paths.src.fonts + '**/*.{eot,ttf,woff,woff2}')
    .pipe(changed(pkg.paths.dist.fonts))
    .pipe(size({ title: 'Fonts', gzip: true }))
    .pipe(dest(pkg.paths.dist.fonts));
}


// HTML task
function html() {
  return src(pkg.paths.src.html + '*.{html,twig}')
    .pipe(data(getData()))
    .pipe(twig())
    .pipe(dest(pkg.paths.dist.html));
}


// Clean task
function clean() {
  return del(pkg.globs.clean);
}


// Server task
function serve(cb) {
  browserSync.init({
    server: pkg.urls.local
  });

  watch(pkg.paths.src.css + '**/*.scss', series(css));
	watch(pkg.paths.src.js + '**/*.js', series(parallel(js, jsRgpd), reload));
	watch(pkg.paths.templates + '**/*.{html,twig}', series(reload));
	watch(pkg.paths.src.img + '**/*', series(images));
  watch(pkg.paths.src.sprites + '**/*.svg', series(sprites));
  watch(pkg.paths.src.fonts + '**/*.{eot,ttf,woff,woff2}', series(fonts));
  watch([
    pkg.paths.src.html + '**/*.{html,twig}',
    pkg.paths.src.base + pkg.vars.dataName
  ], series(html, reload));

  cb();
}

function reload(cb) {
  browserSync.reload();

  cb();
}


// Default task
exports.default = series(
  cssVendor,
  parallel(css, js, jsRgpd, images, sprites, fonts, html),
  serve
);


// Build task
exports.build = series(
  clean,
  cssVendor,
  parallel(css, js, jsRgpd, images, sprites, fonts, html),
  cssOptim
);
