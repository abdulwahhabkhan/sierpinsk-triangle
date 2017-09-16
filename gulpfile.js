var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

//browser sync
var broswersync = require('browser-sync').create(),
    reload = broswersync.reload;

//nmp dependencies
var dependencies = ['lodash','pixi.js', 'd3'];

var config = {
    production: false
};

var errorHandler = function(e){
    console.error("Gulp: ", e);
}

//bundle app
gulp.task('script:app', function () {
    console.log(config.production);
    let stream = browserify(['app/app.js'], {debug: true})
        .external(dependencies)
        .transform(babelify.configure({
            presets : ["es2015"]
        }))
        .bundle()
        .pipe(source('app.js'));

    if(config.production)
        stream.pipe(buffer()).pipe(uglify()).pipe(gulp.dest('dist')).on('error', errorHandler)
    else
        stream.pipe(gulp.dest('dist')).on('error', errorHandler);

    return stream;
});

//bundle app
gulp.task('script:worker', function () {
    let stream  = browserify(['app/workers/sierpinski.js'], {debug: true})
        .transform(babelify.configure({
            presets : ["es2015"]
        }))
        .bundle()
        .pipe(source('worker.js'));

    if(config.production)
        stream.pipe(buffer()).pipe(uglify()).pipe(gulp.dest('dist')).on('error', errorHandler);
    else
        stream.pipe(gulp.dest('dist')).on('error', errorHandler);

    return stream;
});


//bundle dependencies as vendors
gulp.task('script:vendor', function () {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/bundle'))
        .on('error', errorHandler);
});

//watch changes in files
gulp.task('watch', function () {
    //start browser sync
    broswersync.init({
       server: {baseDir: './'}
    });

    gulp.watch('app/**/*.js', ['script:app', 'script:worker'])
        .on('change', reload);

    //TODO any other element needs to be added to watch list
});

//bundle
gulp.task('bundle', ['script:app', 'script:vendor', 'script:worker']);

//bundle and watch
gulp.task('dev:server', ['bundle', 'watch']);

//deploy add minimization
gulp.task('build', ['default', 'script:app', 'script:vendor', 'script:worker']);


//default
gulp.task('default', function(){
    config.production = true;
});