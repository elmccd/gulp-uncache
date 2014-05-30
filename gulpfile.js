var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uncache = require('./index.js');

gulp.task('default', function () {
    return gulp.src('src/index.html')
        .pipe(usemin({
            js: []
        }))
        .pipe(uncache({
            append: 'bazinga'
        }))
        .pipe(gulp.dest('dist'));
});