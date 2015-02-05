var path = require('path');
var Workbench = require('./Workbench.js');

var workbenches = {};

module.exports = {
	start: function(ctx) {
		var http = ctx.require('plexi.http');
		
		return {
			Workbench: Workbench,
			create: function(id, options) {
				if( !id || typeof id !== 'string' ) return console.error('workbench id must be a string', id);
				if( workbenches[id] ) return console.error('already exists workbench id', id);
				
				if( typeof options === 'string' ) options = {docbase:options};
			
				var workbench = new Workbench(options);
				var bucket = http.create(id).docbase(options.docbase);
				
				if( typeof options.pagename === 'string' && options.pagename !== 'index.html' && !~options.pagename.indexOf('/') ) {
					bucket.static('/' + options.pagename, path.resolve(__dirname, '../www/index.html'));
				} else {
					bucket.static('/', path.resolve(__dirname, '../www/index.html'));
					bucket.static('/index.html', path.resolve(__dirname, '../www/index.html'));
				}
				bucket.static('/workbench.css', path.resolve(__dirname, '../www/workbench.css'));
				bucket.static('/workbench.js', path.resolve(__dirname, '../www/workbench.js'));
				bucket.static('/types/', path.resolve(__dirname, '../www/types'));
				bucket.get('/workbench.json', function(req, res, next) {
					res.send(workbench);
				});
				//bucket.static('/', path.resolve(__dirname, options.docbase));
				
				workbench.bucket = bucket;
				
				var mount = options.mount;
				if( mount && mount.path ) {
					if( mount.server ) {
						var server = http.get(options.server);
						server.mount(mount.path, bucket);
					} else {
						http.mount(mount.path, bucket);
					}
				}
				
				return workbenches[id] = workbench;
			},
			get: function(id) {
				return workbenches[id || 'default'];
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
