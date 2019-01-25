
var requirejs = require('requirejs');

var buildSettings = {
	name: "almond",
	include: ["requirejs-build-main", "mmirf/core"],
  insertRequire: ["requirejs-build-main"],
	out: "dist/main-built.js",
	optimize: 'none'
};

//TODO eval command-line args?
var optionalIncludes = /*include mmir start-module: */ ["mmirf/main"]
									.concat(/*include mmir view-engine: */["mmirf/simpleViewEngine"])
									.concat(/*include if logger is set for tracing: */["mmirf/stacktrace"]);

buildSettings.include = buildSettings.include.concat(optionalIncludes);

console.info('buildSettings.include: ', buildSettings.include);

var rjsConfig = require('./modulesBaseConfig.js');

requirejs.optimize(Object.assign(rjsConfig, buildSettings), function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    var contents = fs.readFileSync(buildSettings.out, 'utf8');
		console.info('REQUIREJS SUCCESSFUL: ', buildSettings.out);
}, function(err) {
    //optimization err callback
		console.error('REQUIREJS FAILED: ', err);
});
