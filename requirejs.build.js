
var requirejs = require('requirejs');

var buildSettings = {
	name: "main",
	out: "main-built.js",
	optimize: 'none'
};

var rjsConfig = require('./requirejs.build.base-config.js');

requirejs.optimize(Object.assign(rjsConfig, buildSettings), function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    var contents = fs.readFileSync(buildSettings.out, 'utf8');
		console.error('REQUIREJS SUCCESSFUL: ', buildSettings.out);
}, function(err) {
    //optimization err callback
		console.error('REQUIREJS FAILED: ', err);
});
