var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');

var prettify = require('gulp-prettify');
var notify = require('gulp-notify');

var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

var connect = require('gulp-connect');

var cache = require('gulp-cached');

var autoprefixer = require('gulp-autoprefixer');


gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('resources/views/pages/**/*.+(html|njk)')

  // Changed files
  //.pipe(cache('public'))

  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['resources/views/templates'],
      data: {
        css_path: 'Content/Styles/',
        images_path: 'Content/Images/',
        scripts_path: 'Scripts/',
      }
    }))

  // prettify html
  .pipe(prettify({indent_size: 2}))

  // output files in app folder
  .pipe(gulp.dest('public'))

   // notify the changes
   .pipe(notify({ message: "Nunjucks Completed!", onLast: true }));

});

gulp.task('sass', function () {
  return gulp.src('resources/assets/sass/**/*.scss')

    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
			browsers: ['last 45 versions'],
			cascade: false
		}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/Content/Styles'))
    .pipe(notify({ message: "Sass completed!", onLast: true }));
});


gulp.task('watch', function () {

   gulp.watch([
     'resources/views/pages/*.html',
     'resources/views/pages/**/*.html',
     'resources/views/templates/layouts/*.njk',
     'resources/views/templates/partials/*.njk',
     'resources/views/templates/partials/**/*.njk',
     'resources/views/templates/macros/*.njk',
     'resources/views/templates/macros/**/*.njk'
   ], ['nunjucks']);

   gulp.watch([
     'resources/assets/sass/**/*.scss'
   ], ['sass']);


});

gulp.task('webserver', function() {
  connect.server({
    root: 'public',
    port: 8081
  });
});

gulp.task('default', ['nunjucks', 'sass', 'webserver', 'watch']);
