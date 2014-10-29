Class.define('Appbus.workbench.Workbench', {
	$extends: Appbus.Container,

	Workbench: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;
		
		this.toolbar = new Appbus.Bar();
		this.statusbar = new Appbus.Box({
			skin: {
				'': {
					'background-color': '#181818',
					'border': '1px solid rgba(15,15,15,0.65)'
				}
			},
			style: {
				'max-height': 24
			}
		});
		this.cards = new Appbus.View({
			layout: 'card',
			style: {
				'padding-bottom': 3
			}
		});

		this.attach(this.toolbar);
		this.attach(new Appbus.Space({h:3}));
		this.attach(this.cards);
		this.attach(this.statusbar);

		this.pages = new Map();

		this.on('container.add', function(e) {
			if( !e.item instanceof Appbus.workbench.Page ) {
				console.warn('add item can only Appbus.workbench.Page type. ignored', e.item);
				return false;
			}
		});

		this.on('container.added', function(e) {
			var page = e.item;
			self.pages.set(page.getPageId(), page);
			self.cards.add(page);
		});

		this.$super();
	},
	
	getPageIds: function() {
		return this.pages.keys();
	},
	getCurrentPageId: function() {
		return this.pages.getKeyByValue(this.getSelected());
	},
	getCurrentPage: function() {
		return this.getSelected();
	},
	getPages: function() {
		return this.pages.values();
	},
	getPage: function(pageId) {
		return this.pages.get(pageId);
	},
	switchPage: function(pageId) {
		this.select(this.pages.get(pageId));
	}
});

Appbus.workbench.Workbench.style = {
	namespace: 'workbench',
	inherit: Appbus.View
};

Appbus.UIComponent.addType(Appbus.workbench.Workbench);
