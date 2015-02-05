var path = require('path');
var fs = require('fs');
var uuid = require('uuid');

var Page = require('./Page.js');

function Workbench(options) {
	this.reload(options);
}

Workbench.prototype = {
	path: function(uri) {
		return this.docbase ? path.resolve(this.docbase, uri) : uri;
	},
	reload: function(options) {
		options = options || {};
		
		var docbase = options.docbase;
		if( docbase ) {
			var file = path.resolve(docbase, 'workbench.json');
			if( fs.existsSync(file) ) {
				try {
					eval('options = ' + fs.readFileSync(file));
					options.docbase = docbase;
				} catch(err) {
					return console.error('[workbench] workbench.json load error', err.message);
				}
			}
		}
		
		var self = this;
		this.docbase = docbase;
		this.pages = [];
		this.pagemap = {};
		this.title = options.title || 'Untitled';
		(options.pages || []).forEach(function(page) {
			self.createPage(page);
		});
		
		return this;
	},
	createPage: function(config) {
		var PageType = Page.getType(config.type);
		if( !PageType ) return console.error('unknown page type', config.type);
		var page = new PageType(this, config);
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

module.exports = Workbench;