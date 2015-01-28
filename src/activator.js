var path = require('path');

var workbenches = {};
module.exports = function(ctx) {		
	return {
		create: function(id) {
			if( workbenches[id] ) return console.error('already exists workbench id', id);			
			return workbenches[id] = new Workbench();
		},
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
};
