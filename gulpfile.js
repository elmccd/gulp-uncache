var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uncache = require('./index.js');

gulp.task('default', function () {
    return gulp.src('src/*.html')
        .pipe(usemin({
            js: []
        }))
        .pipe(uncache({
            template: '{{path}}{{name}}{{append}}.{{extension}}'
        }))
        .pipe(gulp.dest('dist'));
});