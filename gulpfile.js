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
var svgSprite = require('gulp-svg-sprite');
var twig = require('gulp-twig');
var uglify = require('gulp-uglify');





// BrowserSync reload
function reload(done) {
  browserSync.reload();
  done();
};

// Get data from JSON
function getData() {
  var data = JSON.parse(fs.readFileSync(pkg.paths.src.base + pkg.vars.dataName, 'utf8'));
  return data;
};





// CSS task
gulp.task('css', function() {
  var processors = [
    autoprefixer(),
    cssnano({
      preset: 'default'
    })
  ];

  return gulp.src(pkg.paths.src.css + pkg.vars.cssName)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(pkg.paths.dist.css))
    .pipe(browserSync.stream());
});

// JS task
gulp.task('js', function() {
  return gulp.src(pkg.globs.js)
    .pipe(plumber())
    .pipe(concat(pkg.vars.jsName))
    .pipe(uglify())
    .pipe(gulp.dest(pkg.paths.dist.js));
});

// HTML task
gulp.task('html', function() {
  return gulp.src(pkg.globs.html)
    .pipe(plumber())
    .pipe(data(getData()))
    .pipe(twig())
    .pipe(gulp.dest(pkg.paths.dist.base));
});

// Images task
gulp.task('images', function() {
  return gulp.src(pkg.globs.img)
    .pipe(changed(pkg.paths.dist.img))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(pkg.paths.dist.img));
});

// Sprites task
gulp.task('sprites', function() {
  return gulp.src(pkg.globs.sprites)
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: pkg.vars.spriteName
        }
      }
    }))
    .pipe(gulp.dest(pkg.paths.dist.sprites));
});

// Fonts task
gulp.task('fonts', function() {
  return gulp.src(pkg.globs.fonts)
    .pipe(changed(pkg.paths.dist.fonts))
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
});

// Watch task
gulp.task('watch', function() {
	gulp.watch(pkg.paths.src.css + '**/*.scss', gulp.series('css'));
	gulp.watch(pkg.paths.src.js + '**/*.js', gulp.series('js', reload));
	gulp.watch([
      pkg.paths.src.base + '**/*.{html,twig}',
      pkg.paths.src.base + pkg.vars.dataName
    ], gulp.series('html', reload));
	gulp.watch(pkg.paths.src.img + '**/*', gulp.series('images'));
  gulp.watch(pkg.paths.src.sprites + '**/*.svg', gulp.series('sprites'));
  gulp.watch(pkg.paths.src.fonts + '**/*', gulp.series('fonts'))
});





// Default task
gulp.task('default',
  gulp.series(
    gulp.parallel('css', 'js', 'html', 'images', 'sprites', 'fonts'),
    gulp.parallel('serve', 'watch')
  )
);

// Build task
gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('css', 'js', 'html', 'images', 'sprites', 'fonts')
  )
);
