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
    util = require('util'),
    hogan = require('hogan.js'),
    md5 = require('blueimp-md5').md5,
    fs = require('fs'),
    path = require('path'),
    PluginError = gutil.PluginError,
    alreadyBeeped,
    changed = 0,
    skipped = 0,
    defaultConfig = {
        append: 'time',
        distDir: './',
        srcDir: './',
        rename: false,
        template:'{{filepath}}{{filename}}_{{append}}.{{extension}}'
    },
    config = {};

function swapValue(line, filename, append) {

    if (config.rename) {
        var opt = {};
        opt.filename = filename.split('/').reverse()[0].split('.')[0];
        opt.extension = filename.split('/').reverse()[0].split('.').slice(1).join('.');
        opt.filepath = filename.split('/').slice(0, -1).join('/');
        opt.filepath = (opt.filepath ? opt.filepath + '/' : '');
        opt.append = append;

        var template = hogan.compile(config.template);
        var newFileName = template.render(opt);


        mkdirRecursive(path.dirname((path.normalize(path.join(config.distDir, filename)))));
        fs.createReadStream(path.join(config.srcDir, filename)).pipe(fs.createWriteStream(path.join(config.distDir, newFileName)));


        return line.replace(filename, newFileName);
    } else {
        return line.replace(filename, filename + '?' + append);
    }
}

function replaceFileName(line, append) {
    var parts,
        file,
        filename,
        regexp,
        fileExist,
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
        filename = parts[1];
        changed++;
        if (append === 'hash') {
            filePath = path.join(config.srcDir, filename);
            fileExist = fs.existsSync(filePath);
            if (!fileExist) {
                gutil.log(gutil.colors.red("Couldn't find file:"), filePath);
                skipped++;
                return line;
            }
            file = fs.readFileSync(filePath);
            if (file) {
                return swapValue(line, filename, md5(file).substr(0, 10));
            } else {
                gutil.log(gutil.colors.red("Couldn't read file:"), filePath);
                skipped++;
                return line;
            }

        } else if (append === 'time') {
            return swapValue(line, filename, new Date().getTime());
        }
        return swapValue(line, filename, append);

    } catch (err) {
        gutil.log(gutil.colors.red("Couldn't parse line: (skipped)"), line);
        skipped++;

        if (!alreadyBeeped) {
            alreadyBeeped = true;
            gutil.beep();
        }
        return line;
    }
}

function proceed(content, params) {

    var parts = content.split(/<!--\s*uncache\s*(\(.*\))?\s*-->/),
        output = [],
        newLine,
        element,
        configParts,
        configPart,
        newValue;


    output.push(parts[0]);
    parts.shift();

    //foreach block
    for(var i = 0; i < parts.length; i++){
        element = parts[i];


        if (i % 2 === 0) {

            //extend config
            config = util._extend({}, defaultConfig);

            //extend config from gulpfile
            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    config[param] = params[param];
                }
            }

            //extend config from processing file
            if(!element) {
                continue;
            }
            configParts = element.substr(1, element.length - 2).split(',');

            configParts.forEach(function (el) {
                configPart = el.split(':');
                newValue = configPart[1].trim();
                if (newValue === 'true') {
                    newValue = true;
                }
                if (newValue === 'false') {
                    newValue = false;
                }
                config[configPart[0].trim()] = newValue;
            });
            continue;
        }

        var parts2 = element.split(/<!--\s*enduncache\s*-->/);
        var lines = parts2[0].split('\n');

        lines.forEach(function (element) {
            newLine = replaceFileName(element, config.append);
            output.push(newLine);
            if (newLine !== '') {
                output.push('\n');
            }
        });

        output.push(parts2[1]);
    }
    return output.join('');
}

function mkdirRecursive(dir) {
    var dirs,
        i,
        _path;

    if (fs.existsSync(path.normalize(dir))) {
        return false;
    }

    dirs = path.normalize(dir).split(path.sep);

    for (i = 0; i < dirs.length; i += 1) {
        _path = path.normalize(dirs.slice(0, i + 1).join('/'));
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path);
        }
    }
}

// Plugin level function(dealing with files)
function unCache(params) {

    alreadyBeeped = false;
    changed = 0;


    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {
        var fileName = file.path;
        if (file.isNull()) {
            // Do nothing if no contents
        }
        if (file.isBuffer()) {
            file.contents = new Buffer(proceed(file.contents.toString(), params));
        }

        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, "Streams not supported");
        }

        this.push(file);

        gutil.log(gutil.colors.green(PLUGIN_NAME), fileName + ", Changed lines: ", gutil.colors.cyan(changed));
        if(skipped) {
            gutil.log(gutil.colors.green(PLUGIN_NAME),  fileName + ", Skipped lines: ", gutil.colors.red(skipped));
            gutil.beep();
        }


        return callback();
    });
    // returning the file stream
    return stream;
}

// Exporting the plugin main function
module.exports = unCache;