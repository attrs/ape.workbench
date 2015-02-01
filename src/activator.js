var path = require('path');
var Workbench = require('./Workbench.js');

var workbenches = {};
var docbase = path.resolve(__dirname, '../www');

module.exports = {
	start: function(ctx) {
		var http = ctx.require('plexi.http');
		
		return {
			Workbench: Workbench,
			create: function(id, options) {
				if( !id || typeof id !== 'string' ) return console.error('workbench id must be a string', id);
				if( workbenches[id] ) return console.error('already exists workbench id', id);
			
				var workbench = new Workbench(options);
			
				var bucket = http.create(id).mount('/' + id);
				bucket.static('/', docbase);
				bucket.get('/workbench.json', Workbench.router(workbench));
				
				workbench.bucket = bucket;
				
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
