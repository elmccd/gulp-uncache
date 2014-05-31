var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uncache = require('./index.js');

gulp.task('default', function () {
    return gulp.src('src/index.html')
        .pipe(usemin({
            js: []
        })).pipe(uncache({
            append: 'hash',
            rename: true,
            srcDir: 'src',
            distDir: 'dist'
        })).pipe(gulp.dest('dist'));
});