'use strict'; 

var gulp = require('gulp'), 
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'), 
    rename = require('gulp-rename'), 
    sass = require('gulp-sass'), 
    maps = require('gulp-sourcemaps'), 
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    cleanCSS = require('gulp-clean-css'),
    eslint = require('gulp-eslint'),
    del = require('del');

gulp.task('clean', function() {
    del("dist/*");
});

//gulp concatScripts to concatenate Javascript files and copy them to 'js' folder 
gulp.task('concatScripts', function() {
	return gulp.src(['js/global.js', 'js/circle/autogrow.js', 'js/circle/circle.js'])
       .pipe(maps.init())
       .pipe(concat("app.js"))
       .pipe(maps.write('./'))
       .pipe(gulp.dest("js"));
});

//gulp scripts to concat, minify and copy JS to all.min.js that is copied to 'dist/scripts'. And create source maps
gulp.task('scripts', ["lint", "concatScripts"], function() {
    return gulp.src("js/app.js")
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist/scripts'));
});

//gulp styles to compile scss to css, concatenate and minify that is then copied to them to 'dist/styles'
gulp.task('styles', function() {
    return gulp.src("sass/global.scss")
        .pipe(maps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/styles'));
});

//gulp images to optimize image files and copy to 'dist/images'
gulp.task('images', function() {
    return gulp.src("images/*")
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));    
});

//gulp build by clean, scripts, styles, images in order 
gulp.task("build", ['clean', 'scripts', 'styles', 'images'], function() {
    return gulp.src(["index.html", "icons/**"], {base: './'})
        .pipe(gulp.dest('dist'));
});

//gulp default is build
gulp.task('default', ['build']); 

//gulp serve to do task 'build' and run server 
gulp.task('serve', ['build'], function() {
    return connect.server({
        port: 3000,
        root: 'dist'
    });
});

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(connect.reload());
});

//the scripts task should run and the current page should be reloaded by any js file changed
gulp.task('watch', ['serve'], function() {
    gulp.watch('js/**/*.js', ['scripts', 'html']);
});

// my project’s JavaScript files will be linted using ESLint 
gulp.task('lint', () => {
    return gulp.src(['js/**/*.js','!node_modules/**'])
        .pipe(eslint({
            rules: {"no-console": 1},
            globals: [ 'jQuery', '$'],
            envs: ['browser']
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
