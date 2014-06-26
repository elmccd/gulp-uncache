var gulp = require('gulp'),
    uncache = require('gulp-uncache'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    usemin = require('gulp-usemin');


gulp.task('uncache', function () {
    return gulp.src('dist/index.html')
        .pipe(uncache({
            rename:true,
            append:'hash',
            srcDir:'dist',
            distDir:'dist'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('usemin', function () {
    return gulp.src('dist/index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('default', function (callback) {
    runSequence('clean', 'copy', 'usemin', 'uncache', callback);
});
