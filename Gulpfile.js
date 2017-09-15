var gulp        = require('gulp'),
  argv          = require('yargs').argv,
  addSrc        = require('gulp-add-src'),
  concat        = require('gulp-concat'),
  sass          = require('gulp-sass'),
  cleanCSS      = require('gulp-clean-css'),
  plumber       = require('gulp-plumber'),
  cssLint       = require('gulp-csslint'),
  ejs           = require('gulp-ejs'),
  ejsLint       = require('ejs-lint'),
  ejsmin        = require('gulp-ejsmin'),
  minifyejs     = require('gulp-minify-ejs'),
  gutil         = require('gulp-util'),
  sassLint      = require('gulp-sass-lint'),
  uglify        = require('gulp-uglify'),
  esLint        = require('gulp-eslint'),
  imgmin        = require('gulp-imagemin'),
  browserSync   = require('browser-sync'),
  autoprefixer  = require('gulp-autoprefixer'),
  minify        = require('gulp-minify'),
  sourcemaps    = require('gulp-sourcemaps'),
  config        = require('./build.config.json'),
  rename        = require('gulp-rename'),
  reload        = browserSync.reload;

var BUILD_DIR   = './dist/',
    SOURCE_DIR  = './source/';

gulp.task('ejs', function() {
  gulp.src(SOURCE_DIR + '*.ejs')
    .pipe(plumber())
    .pipe(ejs(
      {},
      {}, 
      { ext: '.html' }
    ).on('error', gutil.log))
    .pipe(ejsmin({removeComment: true}))
    .pipe(minifyejs())
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(reload({stream: true}));
});

// Copy file vendor to dist
// Pending
gulp.task('copy', function() {
  gulp.src(config.vendor_files.js)
    .pipe(gulp.dest(config.build_dir + '/vendor/js'));
  gulp.src(config.vendor_files.css)
    .pipe(gulp.dest(config.build_dir + '/vendor/css'));
  gulp.src(SOURCE_DIR + 'assets/fonts/**/**')
    .pipe(gulp.dest(BUILD_DIR + 'fonts'));
});

// CSS lint
gulp.task('css-lint', function() {
  gulp.src(SOURCE_DIR + 'assets/css/*.css')
    .pipe(plumber())
    .pipe(cssLint())
    .pipe(cssLint.formatter('junit-xml'));
});

// Sass lint
gulp.task('sass-lint', function() {
  gulp.src(SOURCE_DIR + 'assets/scss/*.s+(a|c)ss')
    .pipe(plumber())
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('sass', function() {
  gulp.src(SOURCE_DIR + 'assets/scss/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUILD_DIR + '/css'))
    .pipe(reload({stream: true}));
});

// Compile sass, css
gulp.task('compile-styles', ['css-lint', 'sass-lint'], function() {
  gulp.src(SOURCE_DIR + 'assets/scss/*.s+(a|c)ss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(addSrc(SOURCE_DIR + 'assets/css/*.css'))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUILD_DIR + '/css'))
    .pipe(reload({stream: true}));
});

gulp.task('js-lint', function() {
  gulp.src(SOURCE_DIR + 'assets/js/**/*.js')
    .pipe(esLint({
      globals: [
        'jQuery',
        '$'
      ],
      envs: [
        'browser'
      ],
      configFile: 'eslint.json'
    }))
    .pipe(esLint.formatEach('compact', process.stderr));
});

// Compile js
gulp.task('compile-scripts', ['js-lint'], function() {
  gulp.src(SOURCE_DIR + 'assets/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_DIR + 'js'))
    .pipe(reload({stream: true}));
});

// Optimize images
gulp.task('optimize-images', function() {
  gulp.src(SOURCE_DIR + 'assets/images/*')
    .pipe(imgmin([
      imgmin.gifsicle({interlaced: true}),
      imgmin.jpegtran({progressive: true}),
      imgmin.optipng({optimizationLevel: 5}),
      imgmin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(BUILD_DIR + 'images'))
    .pipe(reload({stream: true}));
});

// Watching when working
gulp.task('watch', function () {
  var argv = require('yargs').argv,
    port = argv.port || 8888;

  browserSync({
    notify: false,
    port: port,
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch([SOURCE_DIR + '**/*.ejs'], ['ejs']);
  gulp.watch([BUILD_DIR + 'css/*.css', SOURCE_DIR + 'assets/scss/**/*.s+(a|c)ss', SOURCE_DIR + 'assets/css/**/*.css'], ['compile-styles']);
  // gulp.watch([SOURCE_DIR + 'assets/scss/**/*.scss'], ['sass']);
  gulp.watch([SOURCE_DIR + 'assets/js/**/*.js'], ['compile-scripts']);
});

gulp.task('default', ['ejs', 'copy', 'compile-styles', 'compile-scripts', 'optimize-images', 'watch']);