/*
 * gulp-uncache
 * https://github.com/elmccd/gulp-uncache
 *
 * Copyright (c) 2014 Maciej Dudziński
 * Licensed under the MIT license.
 */
/* global require */
'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-uncache'

function replaceFileName(line, append) {
    var parts,
        parts2,
        output = [],
        type;
    if(line.indexOf('src') > 0) {
        type = 'src';
    } else if(line.indexOf('href') > 0) {
        type = 'href';
    } else {
        return line;
    }

    parts = line.split(type + '="');
    output.push(parts[0], type + '="');
    parts2 = parts[1].split('"');
    output.push(parts2[0], '?', append, '"', parts2[1]);
    console.log(line);
    console.log(output.join(''));
    return output.join('');
}

function proceed(content) {
    var parts = content.split('<!--uncache-->');
    var output = [];
    output.push(parts[0]);
    parts.shift();
    parts.forEach(function(element) {
        var parts2 = element.split('<!--enduncache-->');
        output.push(replaceFileName(parts2[0], new Date().getTime()));
        output.push(parts2[1]);
    });
    return output.join('');
}



// Plugin level function(dealing with files)
function unCache() {
//    if (!params) {
//        throw new PluginError(PLUGIN_NAME, "Missing prefix text!");
//    }

    // Creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, callback) {
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
        return callback();

    });

    // returning the file stream
    return stream;
}

// Exporting the plugin main function
module.exports = unCache;