'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var uncache = require('./../index');

var snippets = [
    {
        name: 'script tag',
        src: '<!--uncache-->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style.css?123"/>',
        config: {
            append: '123'
        }
    },
    {
        name: 'css link tag',
        src: '<!--uncache-->' +
            '<script src="app.js"></script>' +
            '<!--enduncache-->',
        dist: '<script src="app.js?' + '123' + '"></script>',
        config: {
            append: '123'
        }
    },
    {
        name: 'script tag with other content',
        src: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
            'Architecto assumenda cum eaque est et, fugiat laboriosam maiores' +
            '<!--uncache-->' +
            '<script src="app.js"></script>' +
            '<!--enduncache-->',
        dist: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
            'Architecto assumenda cum eaque est et, fugiat laboriosam maiores' +
            '<script src="app.js?' + '12345' + '"></script>',
        config: {
            append: '12345'
        }
    },
    {
        name: 'multiple script tag',
        src: '<!-- uncache -->' +
            '<script src="app.js"></script>' +
            '\n' +
            '<script src="app2.js"></script>' +
            '\n' +
            '<script src="app3.js"></script>' +
            '<!--enduncache-->',
        dist: '' +
            '<script src="app.js?123"></script>' +
            '\n' +
            '<script src="app2.js?123"></script>' +
            '\n' +
            '<script src="app3.js?123"></script>' +
            '',
        config: {
            append: '123'
        }
    }
];


snippets.forEach(function (element, index) {
    it('should parse ' + element.name, function (cb) {
        var stream = uncache(element.config);
        stream.on('data', function (file) {
            assert.equal(file.contents.toString().trim(), element.dist.trim());
        });

        stream.on('end', cb);

        stream.write(new gutil.File({
            base: __dirname,
            path: __dirname + 'file' + index + '.html',
            contents: new Buffer(element.src)
        }));

        stream.end();
    });

});