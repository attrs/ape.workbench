var path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var util = require('attrs.util');
var Page = require('./Page.js');

var workbenches = {};

function Workbench(options) {
	if( typeof options === 'string' ) options = {docbase:options};
	if( typeof options.id !== 'string' ) {
		options.id = uuid.v4();
	}	
	
	if( workbenches[options.id] ) return util.error('workbench', 'already exists workbench id', options.id);
		
	this.options = options;
	this.reload();
}

Workbench.prototype = {
	path: function(uri) {
		return this.docbase ? path.resolve(this.docbase, uri) : uri;
	},
	reload: function(options) {
		if( !arguments.length ) options = this.options;
		options = options || {};
		
		var http = Workbench.httpService;
		if( !http ) return util.error(this, 'http service not defined', http);
		
		// drop current workbench
		if( this.id ) delete workbenches[this.id];
		
		var self = this;
		var id = options.id || uuid.v4();
	
		var bucket = http.create(id).docbase(options.docbase);	
		bucket.static('/', path.resolve(__dirname, '../www/'));
		bucket.static('/index.html', path.resolve(__dirname, '../www/index.html'));
		bucket.static('/workbench.html', path.resolve(__dirname, '../www/index.html'));
		bucket.get('/workbench.json', function(req, res, next) {
			res.send(self);
		});
		
		var docbase = options.docbase;
		var datafile;
		if( docbase ) {
			var file = path.resolve(docbase, 'workbench.json');
			if( fs.existsSync(file) ) {
				try {
					eval('datafile = ' + fs.readFileSync(file));
				} catch(err) {
					return util.error(self, 'workbench.json load error', err.message);
				}
			}
		}
		
		this.id = id;
		this.bucket = bucket;
		this.options = options;
		this.docbase = docbase;
		this.unmount();
		if( options.mount ) this.mount(options.mount);
		this.pages = [];
		this.pagemap = {};
		this.title = options.title || 'Untitled';
		
		(options.pages || []).concat(datafile['pages'] || []).forEach(function(page) {
			self.createPage(page);
		});
		
		workbenches[id] = this;
		
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
	mount: function(mount) {		
		var http = Workbench.httpService;
		if( !http ) return util.error(this, 'http service not defined', http);
		
		http.mount(mount, this.bucket);
		return this;
	},
	unmount: function() {
		var http = Workbench.httpService;
		if( !http ) return util.error(this, 'http service not defined', http);
		
		http.unmount(this.router);
		return this;
	},
	toJSON: function() {
		return {
			uuid: this.uuid,
			title: this.title,
			icon: this.icon,
			pages: this.pages
		}
	},
	toString: function() {
		return 'workbench:' + this.id;
	}
};

Workbench.all = function() {
	var arr = [];
	for(var k in workbenches) {
		arr.push(workbenches[k]);
	}
	return arr;
};

Workbench.get = function(id) {
	return workbenches[id];
};

Workbench.clear = function(id) {
	for(var k in workbenches) {
		workbenches[k].unmount();
		delete workbenches[k];
	}
	workbenches = {};
	return this;
};

module.exports = Workbench;