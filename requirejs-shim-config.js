;(function (root, factory) {
		if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define(function () {
						return factory();
				});
		} else if (typeof module === 'object' && module.exports) {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like environments that support module.exports,
				// like Node.
				module.exports = factory();
		} else {
				// Browser globals
				root.mmirShimConfig = factory();
		}
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function () {

	return {
		paths: {
			/** @memberOf mmir.require.config.shim */
			  'mmirf/antlr3': 'vendor/sourcelibs/antlr3-all'
			, 'mmirf/ES3Lexer': 'gen/sourceparser/ES3Lexer'
			, 'mmirf/ES3Parser': 'gen/sourceparser/ES3Parser'
			, 'mmirf/scriptLexer': 'gen/sourceparser/MmirScriptLexer'
			, 'mmirf/scriptParser': 'gen/sourceparser/MmirScriptParser'
			, 'mmirf/contentLexer': 'gen/sourceparser/MmirScriptContentLexer'
			, 'mmirf/contentParser': 'gen/sourceparser/MmirScriptContentParser'
			, 'mmirf/templateLexer': 'gen/sourceparser/MmirTemplateLexer'
			, 'mmirf/templateParser': 'gen/sourceparser/MmirTemplateParser'

			, 'mmirf/md5': 'vendor/sourcelibs/md5_umd'
			, 'mmirf/pegjs': 'vendor/sourcelibs/peg-0.9.0_amd'
		},
		shim: {
			/** @memberOf mmir.require.config.shim */
			  'mmirf/antlr3':         {deps: ['mmirf/parsingResult'], exports : 'org'}

			, 'mmirf/md5':            {exports : 'CryptoJS'}

			, 'mmirf/pegjs':          {exports: 'PEG'}

			, 'mmirf/ES3Lexer':       {deps: ['mmirf/antlr3'], init: function(org){ return ES3Lexer;} }
			, 'mmirf/ES3Parser':      {deps: ['mmirf/antlr3'], init: function(org){ return ES3Parser;} }
			, 'mmirf/scriptLexer':    {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptLexer;} }
			, 'mmirf/scriptParser':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptParser;} }
			, 'mmirf/contentLexer':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentLexer;} }
			, 'mmirf/contentParser':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentParser;} }
			, 'mmirf/templateLexer':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateLexer;} }
			, 'mmirf/templateParser': {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateParser;} }
		}
	}

}));
