# gulp-uncache

> Append unique string to paths in html files to force refresh resources by clients

At actual state supported are only tags with `src=""` and `href=""` attributes with strict quotes `"`

## Install

```bash
$ npm install --save-dev gulp-uncache
```

## Usage

### Basic
```javascript
var gulp = require('gulp');
var uncache = require('gulp-uncache');

gulp.task('default', function () {
	return gulp.src('src/index.html')
		.pipe(uncache())
		.pipe(gulp.dest('dist'));
});
```
+
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
Will result in:
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

## API

### uncache()

## To do
* tests
* support more flexible syntax 
* option: rename file, instead appending url query
* append string based on file content (and change filename only when it's content has been changed)
* 'uncache' for all sources in files without `<!--uncache-->` tags
* support css images (e.g. for often changing css sprites image)


## License

MIT © [Maciej Dudziński](https://github.com/elmccd)
