var path = require('path');
var uuid = require('uuid');

var Page = require('./Page.js');

function Workbench(options) {
	options = options || {};
	
	this.uuid = uuid.v4();
	this.docbase = options.docbase || process.cwd;
	this.title = options.title || 'Untitled';
	this.pages = [];
	this.pagemap = {};
	
	var self = this;
	(options.pages || []).forEach(function(page) {
		self.createPage(page);
	});
}

Workbench.prototype = {
	createPage: function(config) {
		var page = new Page(this, config);
		this.pages.push(page);
		this.pagemap[page.id] = page;
		return page;
	},
	getPage: function(pageId) {
		return this.pagemap[pageId];
	},
	getPages: function() {
		return this.pages.slice();
	},
	removePage: function(pageId) {
		var page = this.pagemap[pageId];
		if( page ) {
			this.pages.splice(this.pages.indexOf(page), 1);
			this.pagemap[pageId] = null;
			delete this.pagemap[pageId];
		}
		return this;
	},
	connector: function(connector) {
		this.connector = connector;
		
		connector.on('create', function(msg){
			console.log('connector: ' + msg);
			
			connector.broadcast('refresh');
		});
		return this;
	},
	refresh: function() {
		var connector = this.connector;
		if( !connector ) return console.error('not assigned connecter', this.uuid);
		connector.emit('refresh');		
		return this;
	},
	navigate: function(pageId, hash) {
		var connector = this.connector;
		if( !connector ) return console.error('not assigned connecter', this.uuid);
		connector.emit('navigate', {
			pageId: pageId,
			hash: hash
		});
		return this;
	},
	toJSON: function() {
		return {
			uuid: this.uuid,
			title: this.title,
			icon: this.icon,
			pages: this.pages
		}
	}
};

Workbench.router = function(workbench) {
	return function(req, res, next) {
		res.send(workbench);
	};
};

module.exports = Workbench;