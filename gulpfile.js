var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(globbing({
        extensions: ['.scss']
    }))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('public'));
});

gulp.task('watch:sass', function() {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
});


gulp.task('watch', gulp.parallel('watch:sass'));
gulp.task('default', gulp.series('sass','watch'));