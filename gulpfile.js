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
    notifier   = require('node-notifier'),
    handlebars = require('gulp-compile-handlebars'),
    htmlmin    = require('gulp-htmlmin');



//=============================================================== Errors
var fancyErrorHandler = function(err){
    console.log(err.stack);
                 
    notifier.notify({
        'title': 'Hackadashery Error :(',
        'message': err.message
    });

    this.emit('end');
}



//=============================================================== Sass -> CSS
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



//=============================================================== es6 -> JS
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



//=============================================================== Handlebars -> HTML
gulp.task('hbs', function () {
    var templateData = {
        distUrl: 'dist/'
    },
    options = {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
        partials : {
            footer : '<footer>the end</footer>'
        },
        batch : ['./src/hbs/partials'],
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            }
        }
    }
 
    return gulp.src('src/hbs/index.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(htmlmin({collapseWhitespace: true}))
        .on('error', fancyErrorHandler)
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
});
gulp.task('watch:hbs', function() {  gulp.watch('src/hbs/**/*.hbs', gulp.series('hbs')); });



//=============================================================== data -> data
gulp.task('data', function () {
    return gulp.src('src/data/**/*')
        .pipe(gulp.dest('dist/data'));
});
gulp.task('watch:data', function() {  gulp.watch('src/data/**/*', gulp.series('data')); });



//=============================================================== `gulp`
gulp.task('watch', gulp.parallel('watch:sass', 'watch:es6', 'watch:hbs', 'watch:data'));
gulp.task('default', gulp.series('sass','es6','hbs','data','watch'));