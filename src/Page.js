Class.define('Appbus.workbench.Page', {
	$extends: Appbus.Container,

	Page: function(o) {
		this.viewparts = [];
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;

		this.pageId = o.pageId || this.id();
		o.flex = 1;

		o.horizontal = true;
		
		this.regions = new Map();

		var content = new Appbus.Box({
			name: 'content',
			horizontal: true,
			flex: 1,
			style: {
				'overflow': 'visible'
			}
		});
		
		this.regions.set('content', content);		
		this.attach(content);

		this.on('add', function(e) {
			if( !(e.item instanceof Appbus.Box) ) {
				console.warn('Appbus.Box only. ignored', e.item);
				return false;
			}
		});

		this.$super();
	},

	getPageId: function() {
		return this.pageId;
	},
	
	createViewPart: function(config) {
		var cls = (config.type || Appbus.TabView);
		var viewpart = new cls(config.options);
		var partId = config.partId || 'viewpart-' + Appbus.seq();

		this.viewparts[partId] = viewpart;

		this.add(viewpart);

		return viewpart;
	},
	
	getViewPart: function(viewpartId) {
		return this.viewparts[viewpartId];
	},
	
	getViewParts: function() {
		return this.viewparts;
	}
});

Appbus.workbench.Page.style = {
	inherit: Appbus.Box
};

Appbus.UIComponent.addType(Appbus.workbench.Page);
