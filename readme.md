# gulp-uncache

> Append unique string to paths in html files to force refresh user's cache

At actual state supported are only tags with `src=""` and `href=""` attributes with strict quotes `"` and limiters `<!--uncache-->` `<!--enduncache-->`

## Install

```bash
$ npm install --save-dev gulp-uncache
```
##Effect
```html
Before:
<!--uncache-->
<script src="app.js"></script>
<link rel="stylesheet" href="style.css"/>
<!--enduncache-->

After:
<script src="app.js?1401461036930"></script>
<link rel="stylesheet" href="style.css?1401461036930"/>
```
## Examples

### Basic
#####gulpfile.js
```javascript
var gulp = require('gulp');
var uncache = require('gulp-uncache');

gulp.task('default', function () {
	return gulp.src('src/index.html')
		.pipe(uncache())
		.pipe(gulp.dest('dist'));
});
```
#####src/index.html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <!--uncache-->
    <link rel="stylesheet" href="style.css"/>
    <!--enduncache-->
</head>
<body>

<!--uncache-->
<script src="app.js"></script>
<!--enduncache-->
</body>
</html>
```
#####dist/index.html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    
    <link rel="stylesheet" href="style.css?1401390721617"/>
    
</head>
<body>


<script src="app.js?1401390721617"></script>

</body>
</html>
```
### With other plugins
#####gulpfile.js
```javascript
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uncache = require('gulp-uncache');

gulp.task('default', function () {
    return gulp.src('src/index.html')
        .pipe(usemin({
            js: []
        }))
        .pipe(uncache())
        .pipe(gulp.dest('dist'));
});
```
#####src/index.html
```html
<!--uncache-->
<!-- build:js lib.js -->
<script src="js/file1.js"></script>
<script src="js/file2.js"></script>
<script src="js/file3.js"></script>
<!-- endbuild -->
<!--enduncache-->
```
#####dist/index.html
```html
<script src="lib.js?1401393153336"></script>
```
## API

### uncache()


## To do
* tests
* support more flexible syntax 
* option: rename file, instead appending url query
* append string based on file content (and change filename only when it's content has been changed)
* 'uncache' for all sources in files without `<!--uncache-->` tags
* support css images (e.g. for often changing css sprites image)

## Changelog

#####0.1.2
- fixed multi line blocks
- fixed parsing lines with attributes
- skipping incorrect tags
- log info and errors

#####0.1.1
- initial release

## License

MIT © [Maciej Dudziński](https://github.com/elmccd)
