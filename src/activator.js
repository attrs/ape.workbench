var path = require('path');
var fs = require('fs');
var wrench = require('wrench');
var Workbench = require('./Workbench.js');
var util = require('attrs.util');
var pkg = require('../package.json');

module.exports = {
	start: function(ctx) {
		var app = ctx.application;
		var pref = ctx.preference;
		
		// describe to default pref to plexi.json
		if( !pref ) {
			var docbase = path.resolve(process.cwd(), 'www.admin');
			if( !fs.existsSync(docbase) ) {
				fs.mkdirSync(docbase);
				wrench.copyDirSyncRecursive(path.resolve(__dirname, '../www.admin'), docbase, {
					forceDelete: true,
					preserveFiles: true
				});
			}
			
			pref = ctx.application.preferences.set('plexi.workbench', {
				workbenches: {
					admin: {
						docbase: 'www.admin',
						mount: {
							path: '/admin'
						}
					}
				}
			});
			ctx.application.preferences.save();
		}
		
		
		var http = ctx.require('plexi.http');
		Workbench.httpService = http;
				
		for(var k in pref.workbenches) {
			new Workbench(util.mix(pref.workbenches[k], {
				id: k
			}));
		}
		
		return {
			Workbench: Workbench,
			create: function(options) {
				return new Workbench(options);
			},
			get: function(id) {
				return Workbench.get(id);
			},
			all: function() {
				return Workbench.all();
			}
		}
	},
	stop: function(ctx) {
		Workbench.clear();
	}
};
