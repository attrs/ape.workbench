var path = require('path');

module.exports = function(ctx) {	
	var http = ctx.require('plexi.http');
	
	var bucket = http.create(this);
	bucket.mount('/workbench');
	
	bucket.static('/', path.join(__dirname, 'webapps'));
	bucket.bucket('/ui-alien', http.bucket('ui-alien'));
	bucket.get('/test', function(req, res, next) {
		res.write('TEST OK!');
		next();
	});
		
	var buckets = http.buckets();
	for(var name in buckets) {
		var bucket = buckets[name];
		var mounts = bucket.mounts();
		for(var uri in mounts) {
			console.log(uri + ' from ' + name);
		}
	}
};
