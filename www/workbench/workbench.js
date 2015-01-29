var Workbench = (function() {
	"use strict";
	
	var Ajax = attrs.ajax;
	
	function Workbench(options) {
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
			var page = config; //new Page(this, config);
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
		}
	};
	
	Workbench.load = function(fn) {
		fn = fn || function() {};
		
		Ajax.json('workbench.json').done(function(err, data) {
			if( err ) return fn(err);
			fn(null, data);
		});
	};
	
	return Workbench;
})();
