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

	options = options || {};

     var hashStr= crypto.createHash('md5').update(PLUGIN_NAME+(new Date()).getTime()).digest('hex').substr(0, options.hashLen || 7);
 
	var setVersion=function(src,name,value){
		var regex = new RegExp("([\\?&]"+name+"=)([^&#]*)&?",["i"])
			 ,match = regex.exec(src)
			,temp='';

			if(match == null)
			{
				temp=(src.indexOf('?')>-1 ? '&':'?')+name+'='+value;
				return src.indexOf('#')>-1 ? src.replace('#',temp+'#') :src+temp;
			}
			else
			{
			   temp=src.replace(regex,'$1' + value + '&');
			   
			   if(temp.charAt(temp.length-1)=='&'){
				   temp=temp.substring(0,temp.length-1)
			   }
			   
			   return temp;
			}
	}

    return through.obj(function (file, enc, cb) {
 
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

					// 设置版本号
					src =setVersion(src,options.verStr || 'v',hashStr); 
                    return tag + '"' + src + '"';
                    
                    // remote resource
                   /* if (/^https?:\/\//.test(src)) {
                        return str;
                    }else{
						
					}

                    return tag + '"' + src + '"';
					*/
                });
            }
        }
		//  文本添加版本号
        if(options.replaces){ //
            options.replaces.forEach(function (m,i) {  // { text:'aaa',isAppend:true} ==> aaa会替换成aaa?v=f2a1662 
                var reg=new RegExp(m.text,"g"); //创建正则RegExp对象

                content = content.replace(reg, function (str) {
					if(m.isAppend){
						return setVersion(str,options.verStr || 'v',hashStr);
					}else{
						return hashStr;
					}
                });
            });
        }

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
};

