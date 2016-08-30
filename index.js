"use strict";

var path = require('path');
var fs = require('fs');
var crypto = require('crypto');


var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-version-rev';

var VERSION_REG = {
    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
    "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig,
    "IMAGE": /(<img[^>]+src=)['"]([^'"]+)["']/ig,
    "BACKGROUND": /(url\()(?!data:|about:)([^)]*)/ig
};
 

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {

        options = options || {};

        var hashStr= crypto.createHash('md5').substr(0, options.hashLen || 7);

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();

        var filePath = path.dirname(file.path);

        for (var type in VERSION_REG) {
            if (type === "BACKGROUND" && !/\.(css|scss|less)$/.test(file.path)) {

            } else {
                content = content.replace(VERSION_REG[type], function (str, tag, src) {
                    src = src.replace(/(^['"]|['"]$)/g, '');

                    if (!/\.[^\.]+$/.test(src)) {
                        return str;
                    }
                    if (options.verStr) {
                        src += (options.verStr || '?v=')+hashStr;
                        return tag + '"' + src + '"';
                    }

                    // remote resource
                    if (/^https?:\/\//.test(src)) {
                        return str;
                    }

                    return tag + '"' + src + '"';
                });
            }
        }

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
};




