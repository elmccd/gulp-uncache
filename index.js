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
    PluginError = gutil.PluginError,
    alreadyBeeped,
    changed,
    config = {
        append: 'time'
    };

function replaceFileName(line, append) {
    var parts,
        parts2,
        output = [],
        type;

    if (line.indexOf('src=') > 0) {
        type = 'src';
    } else if (line.indexOf('href=') > 0) {
        type = 'href';
    } else {
        return line;
    }

    if (append === 'time') {
        append = new Date().getTime();
    }


    try {
        parts = line.split(type + '="');
        output.push(parts[0], type + '="');
        parts2 = parts[1].split('"');
        output.push(parts2[0], '?', append, '"', parts2.slice(1).join('"'));
        changed++;
        return output.join('');
    } catch (err) {
        gutil.log(gutil.colors.red("Couldn't parse line: (skipped)"), line);
        if (!alreadyBeeped) {
            alreadyBeeped = true;
            gutil.beep();
        }
        return line;
    }


}

function proceed(content) {

    var parts = content.split('<!--uncache-->'),
        output = [];

    output.push(parts[0]);
    parts.shift();

    //foreach block
    parts.forEach(function (element) {
        var parts2 = element.split('<!--enduncache-->');
        var lines = parts2[0].split('\n');
        lines.forEach(function (element) {
            output.push(replaceFileName(element, config.append));
            output.push('\n');
        });
        output.push(parts2[1]);
    });
    return output.join('');
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