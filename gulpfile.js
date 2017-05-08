// Requires
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
  var data = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'));
  return data;
};





// CSS task
gulp.task('css', function() {
  var processors = [
    autoprefixer(),
    cssnano({
      autoprefixer: false,
      safe: true
    })
  ];

  return gulp.src('src/css/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// JS task
gulp.task('js', function() {
  return gulp.src([
      'node_modules/svg4everybody/dist/svg4everybody.min.js',
      'node_modules/jquery/dist/jquery.slim.min.js',
      'src/js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// HTML task
gulp.task('html', function() {
  return gulp.src('src/*.{html,twig}')
    .pipe(plumber())
    .pipe(data(getData()))
    .pipe(twig())
    .pipe(gulp.dest('dist'));
});

// Images task
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(changed('dist/img'))
    .pipe(imagemin({
      interlaced: true,
      progressive: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Sprites task
gulp.task('sprites', function() {
  return gulp.src('src/icons/**/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'icons.svg'
        }
      }
    }))
    .pipe(gulp.dest('dist/sprites'));
});

// Clean task
gulp.task('clean', function() {
  return del(['dist']);
});

// Serve task
gulp.task('serve', function() {
  browserSync.init({
    notify: false,
    server: 'dist'
  });
});

// Watch task
gulp.task('watch', function() {
	gulp.watch('src/css/**/*.scss', gulp.series('css'));
	gulp.watch('src/js/**/*.js', gulp.series('js', reload));
	gulp.watch(['src/**/*.{html,twig}', 'src/**/*.json'], gulp.series('html', reload));
	gulp.watch('src/img/**/*', gulp.series('images'));
  gulp.watch('src/icons/**/*.svg', gulp.series('sprites'));
});





// Default task
gulp.task('default',
  gulp.series(
    gulp.parallel('css', 'js', 'html', 'images', 'sprites'),
    gulp.parallel('serve', 'watch')
  )
);

// Build task
gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('css', 'js', 'html', 'images', 'sprites')
  )
);
