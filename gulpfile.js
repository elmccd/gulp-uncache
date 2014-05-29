var gulp = require('gulp');
var uncache = require('./index.js');

gulp.task('default', function () {
    return gulp.src('src/*')
        .pipe(uncache())
        .pipe(gulp.dest('dist'));
});