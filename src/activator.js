var path = require('path');
var Workbench = require('./Workbench.js');

var workbenches = {};

module.exports = {
	start: function(ctx) {
		var http = ctx.require('plexi.http');
		
		var create = function(id, options) {
			if( !id || typeof id !== 'string' ) return console.error('workbench id must be a string', id);
			if( workbenches[id] ) return console.error('already exists workbench id', id);
			
			if( typeof options === 'string' ) options = {docbase:options};
		
			var workbench = new Workbench(options);
			var router = http.create(id).docbase(options.docbase);
			
			router.static('/', path.resolve(__dirname, '../www/'));
			router.static('/index.html', path.resolve(__dirname, '../www/index.html'));
			router.static('/workbench.html', path.resolve(__dirname, '../www/index.html'));
			router.get('/workbench.json', function(req, res, next) {
				res.send(workbench);
			});
			
			workbench.router = router;
			
			var mount = options.mount;
			if( mount && mount.path ) {
				if( mount.all ) {
					http.mountToAll(mount.path, router);
				} else if( mount.server ) {
					var server = http.server(mount.server);
					if( server ) server.mount(mount.path, router);
					else console.error('[workbench] not found server', mount.server);
				} else {
					http.mount(mount.path, router);
				}
			}
			
			return workbenches[id] = workbench;
		};
		
		var config = ctx.preference;
		for(var k in config.workbenches) {
			create(k, config.workbenches[k]);
		}
		
		return {
			Workbench: Workbench,
			create: create,
			get: function(id) {
				return workbenches[id];
			},
			all: function() {
				var arr = [];
				for(var k in workbenches) {
					arr.push(workbenches[k]);
				}
				return arr;
			}
		}
	},
	stop: function(ctx) {
	}
};
