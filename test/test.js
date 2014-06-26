'use strict';
var assert = require('assert'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    uncache = require('../index');


var snippets = [
    {
        name: 'simple tag',
        src: '<!--uncache-->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style.css?123"/>',
        config: {
            append: '123'
        }
    },
    {
        name: 'hash',
        src: '<!--uncache-->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style.css?bdcd878309"/>',
        config: {
            append: 'hash',
            srcDir: 'src',
            distDir: 'dist'
        }
    },
    {
        name: 'rename',
        src: '<!--uncache-->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style_123.css"/>',
        config: {
            append: '123',
            rename: true,
            srcDir: 'src',
            distDir: 'dist'
        }
    },
    {
        name: 'custom template',
        src: '<!--uncache-->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style-123.css"/>',
        config: {
            append: '123',
            rename: true,
            srcDir: 'src',
            distDir: 'dist',
            template: '{{path}}{{name}}-{{append}}.{{extension}}'
        }
    },
    {
        name: 'css link tag with inline options',
        src: '<!-- uncache(append:4) -->' +
            '<link rel="stylesheet" href="style.css"/>' +
            '<!--enduncache-->',
        dist: '<link rel="stylesheet" href="style.css?4"/>',
        config: {
            append: '123'
        }
    },
    {
        name: 'script tag',
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
            '<script src="app.js"></script>\n' +
            '<script src="app2.js"></script>\n' +
            '<script src="app3.js"></script>' +
            '<!--enduncache-->',
        dist: '' +
            '<script src="app.js?123"></script>\n' +
            '<script src="app2.js?123"></script>\n' +
            '<script src="app3.js?123"></script>' +
            '',
        config: {
            append: '123'
        }
    },
    {
        name: 'complex configuration',
        src: ' <!-- uncache --> ' +
            '<link rel="stylesheet" href="style.css"/>' +
            ' <!-- enduncache --> ',
        dist: '<link rel="stylesheet" href="style-bdcd878309.uncached.css"/>',
        config: {
            append: 'hash',
            rename: true,
            srcDir: 'src',
            distDir: 'dist',
            template: '{{path}}{{name}}-{{append}}.uncached.{{extension}}'
        }
    },
    {
        name: 'complex inline',
        src: ' <!-- uncache(append:hash, rename:true, srcDir:src, distDir:dist, template:{{path}}{{name}}---{{append}}.{{extension}}) --> ' +
            '<link rel="stylesheet" href="style.css"/>' +
            ' <!-- enduncache --> ',
        dist: '<link rel="stylesheet" href="style---bdcd878309.css"/>',
        config: {
            append: 'time',
            rename: false,
            srcDir: './',
            distDir: './',
            template: '{{path}}{{name}}_{{append}}.{{extension}}'
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

after(function (done) {
    fs.readdir('dist', function(err, files) {
        if(!err) {
            files.forEach(function(file){
                fs.unlinkSync('dist' + path.sep + file);
            });
        }
        done();
    });

});