function Page() {}

var HTMLPage = (function() {
	var seq = 1;
	function HTMLPage(workbench, options) {
		this.workbench = workbench;
		this.options = options;
		this.id = options.id || 'html-' + (seq++);
		this.title = options.title || 'untitled';
		this.icon = options.icon;		
		this.src = options.src;
	}
	
	HTMLPage.prototype = new Page();

	HTMLPage.prototype.toJSON = function() {
		return {
			id: this.id,
			type: 'html',
			title: this.title,
			icon: this.icon,
			src: this.src
		};
	}
	
	return HTMLPage;
})();

var Views = (function() {
	var seq = 1;
	function Views(workbench, options) {
		this.workbench = workbench;
		this.options = options;
		this.id = options.id || 'views-' + (seq++);
		this.title = options.title || 'untitled';
		this.icon = options.icon;

		var views = this.views = [];
		(options.views || []).forEach(function(config) {
			var PageType = Page.getType(config.type);
			if( !PageType ) return console.error('unknown page type', config.type);
			views.push(new PageType(workbench, config));
		});
	}

	Views.prototype = new Page();
	
	Views.prototype.toJSON = function() {
		return {
			id: this.id,
			type: 'views',
			title: this.title,
			icon: this.icon,
			views: this.views
		};
	}
	
	return Views;
})();

var Types = {
	html: HTMLPage,
	views: Views
};

Page.getType = function(type) {
	if( !type ) return HTMLPage;
	return Types[type];
};

module.exports = Page;