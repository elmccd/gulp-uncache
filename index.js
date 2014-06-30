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
    g_uncache = require('g-uncache').init;

// Plugin level function(dealing with files)
function unCache(params) {

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            // Do nothing if no contents
        }
        if (file.isBuffer()) {
            file.contents = new Buffer(g_uncache(file.contents.toString(), params));
        }

        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, "Streams not supported");
        }

        this.push(file);

        return callback();
    });
}

// Exporting the plugin main function
module.exports = unCache;