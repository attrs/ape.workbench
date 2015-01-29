var seq = 1;

function Page(workbench, options) {
	options.id = options.id || 'page-' + (seq++);
	this.workbench = workbench;
	this.options = options;
}

Page.prototype = {	
	toJSON: function() {
		return this.options;
	}
};

module.exports = Page;