/* This gulp file deals with compiling and watching 
 * the sass/css and js files for any front end devs
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    glob       = require('glob'),
    es         = require('event-stream'),
    notifier   = require('node-notifier');



//=============================================================== Errors
var fancyErrorHandler = function(err){
    console.log(err.stack);
                 
    notifier.notify({
        'title': 'Hackadashery Error :(',
        'message': err.message
    });

    this.emit('end');
}



//=============================================================== Sass
gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(globbing({
        extensions: ['.scss']
    }))
    .pipe(sass())
    .on('error', fancyErrorHandler)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('watch:sass', function() { gulp.watch('src/sass/**/*.scss', gulp.series('sass')); });



//=============================================================== JS
gulp.task('es6', function(done) {
    glob('./src/es6/**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            console.log('entry: ', entry);
            return browserify({ entries: [entry] })
                .bundle()
                .on('error', fancyErrorHandler)
                .pipe(source(entry))
                .pipe(rename({
                    dirname: '',
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist/js'));
            });
        es.merge(tasks).on('end', done);
    })
});
gulp.task('watch:es6', function() {  gulp.watch('src/es6/**/*.js', gulp.series('es6')); });



//=============================================================== `gulp`
gulp.task('watch', gulp.parallel('watch:sass', 'watch:es6'));
gulp.task('default', gulp.series('sass','es6','watch'));
