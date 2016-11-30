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
    htmlmin    = require('gulp-htmlmin'),
    hash       = require('gulp-hash'),
    del        = require('del');



//=============================================================== Errors
var fancyErrorHandler = function(err){
    console.log(err.stack);
                 
    notifier.notify({
        'title': 'Hackadashery Error :(',
        'message': err.message
    });

    this.emit('end');
}



//=============================================================== Cleaning dist
gulp.task('clean', function() {
  return del('dist/**/*');
});
    gulp.task('clean:css', function() {
        return del('dist/css/**/*');
    });
    gulp.task('clean:data', function() {
        return del('dist/**/*.json');
    });
    gulp.task('clean:js', function() {
        return del('dist/**/*.js');
    });



//=============================================================== Sass -> CSS
gulp.task('sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(globbing({
        extensions: ['.scss']
    }))
    .pipe(sass())
    .on('error', fancyErrorHandler)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./dist/css'));
});
gulp.task('watch:sass', function() { gulp.watch('src/sass/**/*.scss', gulp.series('clean:css', 'sass', 'hash:css')); });



//=============================================================== es6 -> JS
gulp.task('es6', function(done) {
    glob('./src/es6/**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .on('error', fancyErrorHandler)
                .pipe(source(entry))
                .pipe(rename({
                    dirname: '',
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist/js'));
                //.pipe(hash.manifest('assets.json'))
                //.pipe(gulp.dest('./'));
        });
        es.merge(tasks).on('end', done);
    })
});
gulp.task('watch:es6', function() {  gulp.watch('src/es6/**/*.js', gulp.series('clean:js', 'es6', 'hash:js')); });



//=============================================================== Service Worker
//has to be in the root for full control over the various routes. 
//This can be set from within the dist folder but we would need to add an http header - and we're hosted on github so that's not going to happen.
//The solution - it gets it's own build process in this here gulp file! 
gulp.task('sw', function(done) {
    glob('./src/sw/**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .on('error', fancyErrorHandler)
                .pipe(source(entry))
                .pipe(rename({
                    dirname: '',
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./'));
        });
        es.merge(tasks).on('end', done);
    })
});
gulp.task('watch:sw', function() {  gulp.watch('src/sw/**/*.js', gulp.series('sw')); });

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
gulp.task('watch:data', function() {  gulp.watch('src/data/**/*', gulp.series('clean:data', 'data')); });



//=============================================================== Hashing
gulp.task('hash', function () { gulp.series('hash:css','hash:js'); });

    gulp.task('hash:css', function () {
        return gulp.src(['dist/**/*.css'])
            .pipe(hash())
            .pipe(gulp.dest('./dist'))
            .pipe(hash.manifest('assets.json'))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('hash:js', function () {
        return gulp.src(['dist/**/*.js'])
            .pipe(hash())
            .pipe(gulp.dest('./dist'))
            .pipe(hash.manifest('assets.json'))
            .pipe(gulp.dest('./dist'));
    });


//=============================================================== `gulp`
gulp.task('watch', gulp.parallel('watch:sass', 'watch:es6', 'watch:sw', 'watch:hbs', 'watch:data'));
gulp.task('default', gulp.series('clean','sass','hash:css','es6','hash:js','sw','hbs','data','watch'));