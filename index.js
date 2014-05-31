/*
 * gulp-uncache
 * https://github.com/elmccd/gulp-uncache
 *
 * Copyright (c) 2014 Maciej Dudziński
 * Licensed under the MIT license.
 */
'use strict';
var PLUGIN_NAME = 'gulp-uncache',
    through = require('through2'),
    gutil = require('gulp-util'),
    md5 = require('blueimp-md5').md5,
    fs = require('fs'),
    path = require('path'),
    PluginError = gutil.PluginError,
    alreadyBeeped,
    changed,
    config = {
        append: 'time',
        distDir: './',
        srcDir: './',
        rename: false
    };

function swapValue(line, filename, append) {
    if(config.rename) {
        var filebase = filename.split('/').reverse()[0].split('.')[0];
        var extension = filename.split('/').reverse()[0].split('.').slice(1).join('.');
        var dir = filename.split('/').slice(0, -1).join('/');

        var newFileName = (dir ? dir + '/' : '') + filebase + '_' + append + '.' + extension;
        mkdirRecursive(path.dirname((path.normalize(path.join(config.distDir, filename)))));
        fs.createReadStream(path.join(config.srcDir, filename)).pipe(fs.createWriteStream(path.join(config.distDir, newFileName)));
        return line.replace(filename, newFileName);

    } else {
        return line.replace(filename, filename + '?' + append);
    }
}

function replaceFileName(line, append) {
    var parts,
        filename,
        regexp,
        filePath;

    if (line.indexOf('src=') > 0) {
        regexp = /<.*\s+src=['"]([^'"]+)['"].*>/;
    } else if (line.indexOf('href=') > 0) {
        regexp = /<.*\s+href=['"]([^'"]+)['"].*>/;
    } else {
        return line;
    }

    try {
        parts = line.split(regexp);
        console.log(parts);
        filename = parts[1];
        changed++;
        if (append === 'hash') {
            filePath = path.join(config.srcDir, filename);
            var fileExist = fs.existsSync(filePath);
            if(!fileExist) {
                gutil.log(gutil.colors.red("Couldn't find file:"), filePath);
                return line;
            }
            var file = fs.readFileSync(filePath);
            if (file) {
                return swapValue(line, filename, md5(file).substr(0,10));
            } else {
                gutil.log(gutil.colors.red("Couldn't read file:"), filePath);
                return line;
            }

        } else if (append === 'time') {
            return swapValue(line, filename, new Date().getTime());
        }
        return line.replace(filename, filename + '?' + append);

    } catch (err) {
        gutil.log(gutil.colors.red("Couldn't parse line: (skipped)"), line);
        console.error(err);
        if (!alreadyBeeped) {
            alreadyBeeped = true;
            gutil.beep();
        }
        return line;
    }


}

function proceed(content) {

    var parts = content.split(/<!--\s*uncache\s*-->/),
        output = [];
    var newLine;
    output.push(parts[0]);
    parts.shift();

    //foreach block
    parts.forEach(function (element) {
        var parts2 = element.split(/<!--\s*enduncache\s*-->/);
        var lines = parts2[0].split('\n');
        lines.forEach(function (element) {
            newLine = replaceFileName(element, config.append);
            output.push(newLine);
            if(newLine !== '') {
                output.push('\n');
            }
        });
        output.push(parts2[1]);
    });
    return output.join('');
}

function mkdirRecursive(dir) {
    if(fs.existsSync(path.normalize(dir))) {
        return false;
    }
    var dirs = path.normalize(dir).split(path.sep),
        i,
        _path;
    for (i = 0; i < dirs.length; i += 1) {
        _path = path.normalize(dirs.slice(0, i + 1).join('/'));
        if(!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
    }
}

// Plugin level function(dealing with files)
function unCache(params) {

    alreadyBeeped = false;
    changed = 0;

    //extend config
    for (var param in params) {
        if (params.hasOwnProperty(param)) {
            config[param] = params[param];
        }
    }

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            // Do nothing if no contents
        }
        if (file.isBuffer()) {
            file.contents = new Buffer(proceed(file.contents.toString()));
        }

        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, "Streams not supported");
        }

        this.push(file);

        gutil.log(gutil.colors.green("Changed lines: "), changed);

        return callback();
    });
    // returning the file stream
    return stream;
}

// Exporting the plugin main function
module.exports = unCache;