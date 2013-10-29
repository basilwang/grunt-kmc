/*
 * grunt-kmc
 * https://github.com/daxingplay/grunt-kmc
 *
 * Copyright (c) 2013 daxingplay
 * Licensed under the MIT license.
 */

'use strict';

var kmc = require('kmc'),
	fs = require('fs'),
    path = require('path');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('kmc', 'Build KISSY modules.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options(),
            depExt = options.depExt,
            depFilePath = options.depFilePath,
            comboOnly = options.comboOnly,
            depFileCharset = options.depFileCharset || options.charset,
            fixModuleName = options.fixModuleName === true,
            traverse = options.traverse;

        kmc.config(options);

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            f.src.forEach(function(src){
                var depFile = '',
                    inputSrc = path.resolve(src),
                    outputSrc = path.resolve(String(f.dest));
                if(depExt || depFilePath){
                    depExt = depExt || '.dep';
                    var outputIsDir = grunt.file.isDir(outputSrc) || !/\.j$/.test(outputSrc);
                    if(depFilePath){
                        depFile = grunt.file.isDir(depFilePath) ? path.resolve(depFilePath, path.basename(outputIsDir ? path.basename(inputSrc, '.js') :outputSrc) + depExt + '.js') : depFilePath;
                    }else{
                        var dir = outputIsDir ? outputSrc : path.dirname(outputSrc);
                        depFile = path.resolve(dir, path.basename(inputSrc, '.js') + depExt + '.js');
                    }
                }
                var result = '';
                if(comboOnly === true){
                    kmc.combo(inputSrc, depFile, depFileCharset, fixModuleName);
                    grunt.log.writeln('Dep File "' + depFile + '" created.');
                }else{
                    result = kmc.build(inputSrc, outputSrc, null, depFile, traverse);
                    grunt.log.writeln('File "' + result.files[0].outputFile + '" created.');
                }

            });


			// added by jayli
			var fullMods = {};
			if(options.comboMap === true){
				var ap = path.normalize(options.packages[0].path);
				if(typeof options.packages[0].name == 'undefined'){
					grunt.log.writeln('packages is not defined!');
					return;
				}
				if(typeof options.depFilePath  == 'undefined'){
					grunt.log.writeln('depFilePath is not defined!');
					return;
				}
				var pkg = options.packages[0].name;
				var depFile = options.depFilePath;
				f.src.forEach(function(src){
					kmc.clean();
					var a = kmc.analyze(path.resolve(src));
					var p = pkg + a.path.replace(ap,'').replace(/\.js$/,'');
					fullMods[p] = a.requires || [];
				});
				var mods = JSON.stringify(fullMods);
				var res = '';
				res += '/*generated by KMC*/\n';
				res += 'KISSY.config("modules",';
				res += mods;
				res += ');';
				fs.writeFileSync(path.resolve(depFile),res,{'encoding':'utf8'});
			}
        });
    });

};
