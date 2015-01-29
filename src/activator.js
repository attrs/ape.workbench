var path = require('path');
var Workbench = require('./Workbench.js');

var workbenches = {};
var docbase = path.resolve(__dirname, '../www');

module.exports = {
	start: function(ctx) {
		var http = ctx.require('plexi.http');
				
		var create = function(id, options) {
			if( !id || typeof id !== 'string' ) return console.error('workbench id must be a string', id);
			if( workbenches[id] ) return console.error('already exists workbench id', id);
			
			var workbench = new Workbench(options);
			
			var bucket = http.create(id).mount('/' + id);
			bucket.static('/', docbase);
			bucket.get('/workbench.json', Workbench.router(workbench));
			
			return workbenches[id] = workbench;
		};
		
		create('system', {
			title: 'System Workbench',
			docbase: path.resolve(__dirname, '../www/pages'),
			pages: [
				{
					id: 'welcome',
					type: 'html',
					title: 'Welcome',
					icon: 'book',
					src: 'pages/welcome.html'
				}, {
					id: 'overview',
					type: 'views',
					title: 'System Overview',
					icon: 'dashboard',
					views: [
						{
							region: 'center',
							title: 'Framework',
							icon: 'database',
							src: 'pages/welcome.html'
						}
					]
				}, {
					id: 'plugins',
					type: 'views',
					title: 'Plugins',
					icon: 'git-branch',
					views: [
						{
							region: 'center',
							title: 'Plugins',
							src: 'pages/welcome.html'
						}
					]
				}, {
					id: 'http',
					type: 'views',
					title: 'HTTP Service',
					icon: 'git-branch',
					views: [
						{
							region: 'center',
							title: 'Plugins',
							src: 'pages/welcome.html'
						}
					]
				}
			]
		});
		
		return {
			Workbench: Workbench,
			create: create,
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
