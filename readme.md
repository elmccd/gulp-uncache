# gulp-uncache
[![NPM version](https://badge.fury.io/js/gulp-uncache.svg)](http://badge.fury.io/js/gulp-uncache)
[![Build Status](https://travis-ci.org/elmccd/gulp-uncache.svg?branch=master)](https://travis-ci.org/elmccd/gulp-uncache)

> Append unique string or md5 hash to paths in html files to force refresh - remove users cache app.js -> app_8j3d7a4f.js

Supported tags with `src` or `href` attributes.

## Install

```bash
$ npm install --save-dev gulp-uncache
```
##Effect
```html
Before:
<!-- uncache -->
<script src="app.js"></script>
<!-- enduncache -->

<!-- uncache(rename:true, append:hash, srcDir:src, distDir:dist) -->
<link rel="stylesheet" href="style.css"/>
<!-- enduncache -->

After:
<script src="app.js?1401482624657"></script>

<link rel="stylesheet" href="style_46fa2c8d60.css"/>
```

##Options

###append


Type `String`


default: `time`
> String to append or one from:


> `time` - append actual time stamp

> `hash` - append md5 hash of file (prevent unnecessary refreshing file) **need correct srcDir & distDir**


###rename


Type `Boolean`


default: `false`
> If set to true rename file otherwise append string as url query string


###srcDir


Type `String`


default: `./`
> Path to dir with source files. (Used only when `rename:true`, or `append:'hash'`)


###distDir


Type `String`


default: `./`
> Path to dir where renamed files will be saved. (Used only when `rename:true`)

###template

Type `String`

default `{{path}}{{name}}_{{append}}.{{extension}}`

> Template for replace ([Hogan.js](https://github.com/twitter/hogan.js)). Available variables: `path`, `name`, `append`, `extension`

##Inline options
You can set options inline that way: (omit quotes sign)
```html
<!-- uncache(param:value, param:value) -->
```

## Examples

### Basic
#####gulpfile.js
```javascript
var gulp = require('gulp');
var uncache = require('gulp-uncache');

gulp.task('default', function () {
    return gulp.src('src/index.html')
		.pipe(uncache({
            append: 'hash',
            rename: true,
            srcDir: 'src',
            distDir: 'dist'
		}))
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
    <!--uncache(rename:false)-->
    <script src="js/file.js"></script>
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
    <link rel="stylesheet" href="style_46fa2c8d60.css"/>
</head>
<body>
    <script src="js/file.js?46fa2c8d60"></script>
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


## To do
* 'uncache' for all sources in files without `<!--uncache-->` tags
* support css images (e.g. for often changing css sprites image)

## Changelog

#####0.2.3
- option template

#####0.2.2
- inline options
- fixed parsing regexp

#####0.2.0
- option rename 
- option append hash
- allow both `'` and `"` in tags

#####0.1.3
- added append option

#####0.1.2
- fixed multi line blocks
- fixed parsing lines with attributes
- skipping incorrect tags
- log info and errors

#####0.1.1
- initial release

## License

MIT © [Maciej Dudziński](https://github.com/elmccd)

