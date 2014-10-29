Class.define('Appbus.workbench.ViewPart', {
	$extends: Appbus.TabView,

	ViewPart: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;

		this.el.ac('boxshadow border');

		this.pageId = o.pageId || this.id();

		this.$super();
	}
});

Appbus.workbench.ViewPart.style = {
	inherit: Appbus.View,
	'': {
		'overflow': 'visible'
	}
};

Appbus.UIComponent.addType(Appbus.workbench.ViewPart);
