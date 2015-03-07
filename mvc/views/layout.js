/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


define (['commonUtils', 'viewConstants', 'yield', 'storageUtils' ],
	/**
	 * @name Layout
	 * @class
	 */
	function(
		commonUtils, ViewConstants, YieldDeclaration, storageUtils
) {
	

/** @scope Layout.prototype */
/**
 * #@+
 * @memberOf Layout.prototype
 */
	
/**
 * The Layout class 
 * The constructor parses the layout and divides them into containers (headerContents, bodyContents, dialogsContents).
 * 
 * @constructs Layout
 * @param {String} name
 * 			Name of the Layout (usually the same name as the Layout's controller).
 * @param {String} definition
 * 			Layout description, i.e. the raw template code that will be processed.
 * 			May be empty: in this case the processed contents must be
 * 						  added manually (cf. parser.StorageUtils)
 * 
 * @requires if param definition is NOT empty: parser.RenderUtils (must be loaded beforehand via <code>require(["renderUtils"]...</code>)
 * 			
 * @requires if param definition is NOT empty: parser.ParseUtils (must be loaded beforehand via <code>require(["parseUtils"]...</code>)
 * 
 * @category core
 */
function Layout(name, definition, remote, ignoreMissingBody){
//		console.log("[Layout] initialize '"+name+"'.");

		//FIXME MODIFICATIONS for "remote content layout object":
		this.remoteaccess = false;
		if ((typeof remote !== "undefined") && (remote == true)){
			this.remoteaccess = true;
		}
		
		
		/**
	     * The definition string of the layout (ehtml-format, taken from assets/www/views/layout/*.ehtml)
	     * 
	     * @property def
	     * @type Object
	     * @public
	     */
		this.def = definition? definition.replace(commonUtils.regexHTMLComment, '') : definition;//remove HTML comments!

		/**
	     * The name of the layout. 
	     * 
	     * @property name
	     * @type String
	     * @public
	     */
	    this.name = name;

		/**
	     * This variable holds the contents of the header part of the layout.
	     * 
	     * @property headerContents
	     * @type String
	     * @public
	     * @deprecated unused
	     */
	    this.headerContents = "";

		/**
	     * This variable holds the contents of the body part of the layout.
	     * 
	     * @property bodyContents
	     * @type String
	     * @public
	     * @deprecated unused
	     */
	    this.bodyContents = "";

		/**
	     * This variable holds the contents of the dialogs part of the layout.
	     * 
	     * @property dialogsContents
	     * @type String
	     * @public
	     */
	    this.dialogsContents = "";

		/**
	     * An associative array holding the contents of the different containers: header, body, footer and dialogs
	     * 
	     * @property yields
	     * @type Array
	     * @public
	     */
	    this.yields = new Array();
	    
	    if(this.def){
		    
		    //console.debug('Layout<constructor>: start rendering layout for "'+this.name+'"'+(remote?' (REMOTE)':'')+', RAW: '+this.def);
		    var parser = require('parseUtils');
	    	var parseResult = parser.parse(this.def, this);
	    	
	    	var renderer = require('renderUtils');
	    	var renderedLayout = renderer.renderLayout(parseResult, null/*FIXME?*/);

	    	//DISABLED: parsing a string as HTML via jQuery etc. does not work (removes head, body,... tags):
//	    	var doc = new DOMParser().parseFromString(renderedLayout, "text/html");
//	    	if(!doc){
//	    		doc = document.implementation.createHTMLDocument('LAYOUT');
//	    	}
//	    	var $layout = $(doc);//$.parseHTML(renderedLayout, doc);
//
//	    	var headerElements = $('head', $layout);
//	    	for(var i=0, size = headerElements.length; i < size; ++i){
//	    		this.headerContents += headerElements[i].outerHTML;
//	    	}
//
//	    	var bodyElement = $('body', $layout);
//	    	this.bodyContents = bodyElement.html();
//	    	var dialogElement = $('dialogs', $layout);
//	    	this.dialogsContents = dialogElement.html();
		    
		    
		    //TODO remove this (replace with real HTML parser?)
	
		    var self = this;
		    
		    //TODO these should be constants (remove to constants.js?): 
		    this.markerAttributeName = ViewConstants.REMOTE_RESOURCES_ATTR_NAME;
		    this.markerAttributeValue = ViewConstants.REMOTE_RESOURCES_ATTR_VALUE;
		    this.markerUseSingleQuotes = false;//<- set value enclosed in single-quotes (true) or double-quotes (false)
		    
		    //appends the marker attribute for "signaling"/marking that a
		    //		  script/style/link-TAG was parsed&evaluated by this layout object
		    var addMarkerAttribute = function(strStartOfTag){
		    	return strStartOfTag + ' ' 
		    			+ self.markerAttributeName + '='
		    			+ (self.markerUseSingleQuotes? '\'': '"')
		    			+ self.markerAttributeValue
		    			+ (self.markerUseSingleQuotes? '\'': '"')
		    			;
		    };
		    
		    //pure HTML:
		    // (1) removed all HTML comments (via RegExpr)
		    // (2) removed template comments (via parser/renderer)
		    var pureHtml = renderedLayout;
		    
		    var regExprTagContent = //match one of the following (as groups):
		    						 '(('+ 		//match as groups
		    							'('+		//(1) CDATA: this may contain anything, even a closing script-statement
		    								'<!\\[CDATA\\['+		//CDATA open: <![CDATA[
		    									'(.|[\\r\\n])*?'+ //allow anything within CDATA, but match non-greedily...
		    								'\\]\\]>'+			//...for the CDATA-closing statement: ]]>
		    													//   (i.e. the first time we encounter this, we stop)
		    							')'+				//close group for CDATA-matching
		    							
		    							'|[\\r\\n]'+	//(2) OR line breaks \r and \n (in any combination)
		//DISABLED (using . instead!):	'|[^<]'+	//(3) OR any symbol that is NOT <
		    							'|.'+		//(4) OR any symbol (REQUIRED for allowing <-symbol within script!
		    						 ')'+			//close group
		    						 '*'+			//match this any number of times (or even none)
		    						 '?'+			//do matching non-greedy (i.e. until the next pattern in the RegExpr can be matched the first time)
	
			 						 ')';			//close outer group (i.e. one group for ALL content that is matched)
		    
		    //_non-greedy_ RegExpr for
		    //	* any line-break: \r or \n or a combination of them
		    //	* any other character but < (less-symbol); note that this itself does not include line breaks
		    var regExprTagInternal = '('+			//open group: match as a group (i.e. give access to the matched content via an index in the RegExpr object)
		    							'[\\r\\n]'+	//line breaks \r and \n
		    						   '|'+			//OR
		    						    '[^<]'+		//any symbol that is NOT <
		    						 ')'+			//close group
		    						 '*'+			//match this any number of times (or even none)
		    						 '?';			//do matching non-greedy (i.e. until the next pattern in the RegExpr can be matched the first time)
		    
		    
		    //matching: <script some attributes...> some content and '<!CDATA[' with any content allowed  </script>
		    //      or: <script some attributes... />
	//	    var regExpScriptTag = /((<script([\r\n]|[^<])*?>)(((<!\[CDATA\[(.|[\r\n])*?\]\]>)|[\r\n]|.)*?)(<\/script>))|(<script([\r\n]|[^<])*?\/>)/igm;// /((<script([\r\n]|[^<])*?>)((<!\[CDATA|[\r\n]|[^<])*?)(<\/script>))|(<script([\r\n]|[^<])*?\/>)/igm;
		    var strRegExpScriptTag = '((<script'+regExprTagInternal+'>)'+regExprTagContent+'(</script>))'+ //DETECT    "normal" script-TAG with optional content
		    						 '|(<script'+regExprTagInternal+'/>)';								   //OR DETECT "self-closing" script TAG
		    var regExpScriptTag = new RegExp(strRegExpScriptTag,'igm');
		    
		    //change to the following RegExpr (change the ones for link/style etc too)
		    // from
		    //		/((<script([\r\n]|[^<])*?>)(([\r\n]|[^<])*?)(<\/script>))|(<script([\r\n]|[^<])*?\/>)/igm;
		    // to
		    //		/((<script([\r\n]|[^<])*?>)(((<!\[CDATA\[(.|[\r\n])*?\]\]>)|[\r\n]|.)*?)(<\/script>))|(<script([\r\n]|[^<])*?\/>)/igm
		    //
		    // -> this RegExpr additionally 
		    //		* respects CDATA (<![CDTATA[ ... ]]>), with any content within its boundaries, even a "closing" </script>-TAG
		    //		* allows opening < within the script-TAGs
		    // LIMITATIONS: both this and the current one do not allow a < within the script-TAGS attributes, e.g. 
		    //				NOT: <script data-condition=" i < 5">
		    //				WORKAROUND: encode the <-symbol, i.e. instead use <script data-condition=" i &lt; 5"> 
		    //							==> use "&lt;" or "&#60;" instead of "<" in TAG attributes!
		    
		    // regExpScriptTag[0]: complete match
		    // regExpScriptTag[1]: script with start and end tag (if matched)
		    // regExpScriptTag[4]: TEXT content of script-tag (if present/matched)
		    // regExpScriptTag[9]: self-closing script (if matched)
		    var matchScriptTag = null;
		    
		    self.headerContents = '';
		    
		    var removedScriptAndLinkHmtl = new Array();
	//	    var matchIndex;
		    while(matchScriptTag = regExpScriptTag.exec(pureHtml)){
	//	    	matchIndex = matchScriptTag[1] ? 1 : (matchScriptTag[9]? 9 : -1);
		    	
		    	if(matchScriptTag[0]){//matchIndex != -1){
	//	    		console.warn("Remote: " + self.remoteaccess);
		    		if (self.remoteaccess) {
	//	    			self.headerContents += matchScriptTag[0].replace("<script", "<script loc=\"remote\"");//[matchIndex];
		    			self.headerContents += addMarkerAttribute('<script') + matchScriptTag[0].substring('<script'.length);
		    		} else {
		        		self.headerContents += matchScriptTag[0];
		    		}
		    		//remove script tag, and continue search
	//	    		pureHtml = pureHtml.substring(0,matchScriptTag.index) + pureHtml.substring(matchScriptTag.index + matchScriptTag[0].length);// pureHtml.replace(matchScriptTag[matchIndex], '');
	
		    	    removedScriptAndLinkHmtl.push({start: matchScriptTag.index, end: matchScriptTag.index + matchScriptTag[0].length});
		    	}
		    }
		    
		    //matching: <link some attributes...> some content and '<!CDATA[' with any content allowed </link>
		    //      or: <link some attributes... />
	//	    var regExpLinkTag = /((<link([\r\n]|[^<])*?>)(((<!\[CDATA\[(.|[\r\n])*?\]\]>)|[\r\n]|.)*?)(<\/link>))|(<link([\r\n]|[^<])*?\/>)/igm;
		    var strRegExpLinkTag = '((<link'+regExprTagInternal+'>)'+regExprTagContent+'(</link>))'+ //DETECT    "normal" script-TAG with optional content
			 					   '|(<link'+regExprTagInternal+'/>)';								 //OR DETECT "self-closing" script TAG
		    var regExpLinkTag = new RegExp(strRegExpLinkTag,'igm');
		    // regExpLinkTag[0]: complete match
		    // regExpLinkTag[1]: link with start and end tag (if matched)
		    // regExpLinkTag[4]: TEXT content of link-tag (if present/matched)
		    // regExpLinkTag[9]: self-closing link (if matched)
		    var matchLinkTag = null;
		    
		    while(matchLinkTag = regExpLinkTag.exec(pureHtml)){
	//	    	console.warn("Matchlinktag: " + matchLinkTag[0]);
		    	if(matchLinkTag[0]){
	//	    		console.warn("Remote: " + self.remoteaccess);
		    		if (self.remoteaccess) {
	//	    			self.headerContents += matchLinkTag[0].replace("<link", "<link loc=\"remote\"");
		    			self.headerContents += addMarkerAttribute('<link') + matchLinkTag[0].substring('<link'.length);
		    		} else {
		        		self.headerContents += matchLinkTag[0];
		    		}
		    	    removedScriptAndLinkHmtl.push({start: matchLinkTag.index, end: matchLinkTag.index + matchLinkTag[0].length});
		    	}
		    }
		    
		    
		    //matching: <style type="text/css" some attributes...> some content and '<!CDATA[' with any content allowed </style>
	//	    var regExpStyleTag = /((<style([\r\n]|[^<])*?type="text\/css"([\r\n]|[^<])*?>)(((<!\[CDATA\[(.|[\r\n])*?\]\]>)|[\r\n]|.)*?)(<\/style>))/igm;
		    var strRegExpStyleTag = '((<style'+regExprTagInternal+'>)'+regExprTagContent+'(</style>))'; //DETECT only "normal" style-TAG with content
		    var regExpStyleTag = new RegExp(strRegExpStyleTag,'igm');
		    // regExpStyleTag[0]: complete match
		    // regExpStyleTag[1]: script with start and end tag (if matched)
		    // regExpStyleTag[4]: TEXT content of style-tag (if present/matched)
		    var matchStyleTag = null;
		    
		    while(matchStyleTag = regExpStyleTag.exec(pureHtml)){
	//	    	matchIndex = matchStyleTag[1] ? 1 : -1;
		    	
		    	if(matchStyleTag[0]){//matchIndex != -1){
	//	    		console.warn("Remote: " + self.remoteaccess);
		    		if (self.remoteaccess) {
	//	    			self.headerContents += matchStyleTag[0].replace("<style", "<style loc=\"remote\"");//[matchIndex];
		    			self.headerContents += addMarkerAttribute('<style') + matchStyleTag[0].substring('<style'.length);
		    		} else {
		        		self.headerContents += matchStyleTag[0];
		    		}
		    		//remove script tag, and continue search
	//	    		pureHtml = pureHtml.substring(0,matchStyleTag.index) + pureHtml.substring(matchStyleTag.index + matchStyleTag[0].length);// pureHtml.replace(matchStyleTag[matchIndex], '');
	
		    	    removedScriptAndLinkHmtl.push({start: matchStyleTag.index, end: matchStyleTag.index + matchStyleTag[0].length});
		    	}
		    }
		    
		    //only need to "process" removed script/link tags, if some were found:
		    if(removedScriptAndLinkHmtl.length > 0){
		    	
		    	removedScriptAndLinkHmtl.sort(function(a,b){
		    		return a.start - b.start;
		    	});
		    	
		    	var cleanedHtml = new Array();
		    	var remPos = 0;
		    	var removalElement = removedScriptAndLinkHmtl[0];
				
		    	for(var i=0, size = removedScriptAndLinkHmtl.length; i < size; ++i){
		    		removalElement = removedScriptAndLinkHmtl[i];
		    		
		    		var text = pureHtml.substring(remPos, removalElement.start);
		    		cleanedHtml.push(text);
		    		
		    		remPos = removalElement.end;
		    	}
		    	//add rest of the HTML if necessary
			    if(removalElement.end < pureHtml.length){
			    	cleanedHtml.push(pureHtml.substring(removalElement.end));
			    }
			    //replace HTML with the removed/clean version:
			    pureHtml = cleanedHtml.join('');
		    }
		    
			//TODO this is needed my be of interest for further processing 
			// (for processing partial HTML responses) 
			//-> should this be part of the framework? (i.e. "public" property for Layout; TODO add to stringify()?)
	    	this._processedDef = pureHtml;
	    
		    //FIXME reg-expr does not detect body-TAG, if body has no content (i.e. body="<body></body>")
		    var regExpBodyTag = /(<body([\r\n]|.)*?>)(([\r\n]|.)*?)(<\/body>)/igm;
		    // matchBodyTag[0]: complete match
		    // matchBodyTag[1]: body start tag
		    // matchBodyTag[2]: last CHAR within body start tag, before closing, e.g. "...lskdjf>" -> "f"
		    // matchBodyTag[3]: body text content
		    // matchBodyTag[4]: last CHAR within body text content, before closing, e.g. "...lsk</body>" -> "k"
		    // matchBodyTag[5]: body end tag
		    var matchBodyTag = regExpBodyTag.exec(pureHtml);
		    
		    self.bodyContents = '';
		    
		    if(matchBodyTag && matchBodyTag[3]){
			    self.bodyContents += matchBodyTag[3];
		    }
		    else if(!ignoreMissingBody) {
		    	//TODO throw error?
		    	console.error('Layout.<constructor>: Layout template does not contain a <body> element!');
		    }
		    
		    
		    //TEST: experimental -> "remember" attributes of body tag
		    //NOTE this assumes that matchBodyTag-RegExpr starts with: /(<body([\r\n]|.)*?>) ... 
		    if(matchBodyTag && matchBodyTag[1] && matchBodyTag[1].length > '<body>'.length){
		    	
		//    	//NOTE: 1st case should really never occur.
		//    	var bodyAttrEnd = matchBodyTag[1].endsWith('/>')? matchBodyTag[1].length-2 : matchBodyTag[1].length-1;
		//    	var bodyAttr = '<div ' + matchBodyTag[1].substring('<body'.length, bodyAttrEnd) + '</div>';
		//    	bodyAttr = jQuery(bodyAttr);
		    	
		    	//extracts TAG attributes into an JSON-object
		    	// e.g. <body onload="on_load();" class='biggestFont'>
		    	// ->
		    	// {onload: "on_load()", class: "biggestFont"}
		    	var getTagAttr = function(str){
		    		
		    		var regExpr = /(\s+([^=]*?)\s*=\s*"([^"]*?)")|(\s+([^=]*?)\s*=\s*'([^']*)')/igm;
		    		var result = {};
		    		var match;
		    	    
		    	    while(match = regExpr.exec(str)){
		    	    	
		    	    	if(match[2]){
		    				result[match[2]] = match[3].trim();
		    			}
		    			else if(match[5]){
		    				result[match[5]] = match[6].trim();
		    			}
		    		}
		    		return result;
		    	};
		    	
		    	self.bodyAttributes = getTagAttr(matchBodyTag[1]);
		    }
		    
		    
		    var regExpDialogsTag = /(<dialogs([\r\n]|.)*?>)(([\r\n]|.)*?)(<\/dialogs>)/igm;
		    // matchDialogsTag[0]: complete match
		    // matchDialogsTag[1]: dialogs start tag
		    // matchDialogsTag[2]: last CHAR within dialogs start tag, before closing, e.g. "...lskdjf>" -> "f"
		    // matchDialogsTag[3]: dialogs text content
		    // matchDialogsTag[4]: last CHAR within dialogs text content, before closing, e.g. "...lsk</dialogs>" -> "k"
		    // matchDialogsTag[5]: dialogs end tag
		    var matchDialogsTag = regExpDialogsTag.exec(pureHtml);
		    
		    self.dialogsContents = '';
		    if(matchDialogsTag && matchDialogsTag[3]){
			    self.dialogsContents += matchDialogsTag[3];
		    }
		    
		    var parseBodyResult = parser.parse(this.bodyContents, this);
		    for(var i=0, size = parseBodyResult.yields.length; i < size ; ++i){
		    	this.yields.push(new YieldDeclaration(parseBodyResult.yields[i], ViewConstants.CONTENT_AREA_BODY));
		    }
		    
		    var parseDialogResult = parser.parse(this.dialogsContents, this);
		    for(var i=0, size = parseDialogResult.yields.length; i < size ; ++i){
		    	this.yields.push(new YieldDeclaration(parseDialogResult.yields[i], ViewConstants.CONTENT_AREA_DIALOGS));
		    }
	    
	    }//END: if(this.def)
	    
	}//END: Layout()

	/**
	 * This methods returns an associative array holding the contents of the different containers: header, body, footer and dialogs.
	 * 
	 * @function getYields
	 * @returns {Array} An associative array holding the contents of the different containers: header, body, footer and dialogs
	 * @public
	 */
	Layout.prototype.getYields = function(){
		return this.yields;
	};

	/**
	 * This methods returns the contents of the header part of the layout.
	 * 
	 * @function getHeaderContents
	 * @returns {String} The contents of the header part of the layout
	 * @public
	 */
	Layout.prototype.getHeaderContents = function(){
	    return this.headerContents;
	};

	/**
	 * This methods returns the contents of the dialog part of the layout.
	 * 
	 * @function getDialogsContents
	 * @returns {String} The contents of the dialog part of the layout
	 * @public
	 */
	Layout.prototype.getDialogsContents = function(){
		return this.dialogsContents;
	};

	/**
	 * This methods returns the contents of the body part of the layout.
	 * 
	 * @function getBodyContents
	 * @returns {String} The contents of the body part of the layout
	 * @public
	 */
	Layout.prototype.getBodyContents = function(){
	    return this.bodyContents;
	};

	/**
	 * Gets the name of the layout.
	 * 
	 * @function getName
	 * @returns {String} The name of the layout.
	 * @public
	 */
	Layout.prototype.getName = function(){
	    return this.name;
	};

Layout.prototype.stringify = function(){

	// "plain properties" list
	var propList = [
	     'name', 
	     'remoteaccess',
	     'def',
	     'headerContents',
	     'bodyContents',
	     'dialogsContents',
	     'markerAttributeName',
	     'markerAttributeValue',
	     'markerUseSingleQuotes',
	     'bodyAttributes'
	];

	//complex Array-properties
	var arrayPropList = [
   	     'yields' //element type: YieldDeclaration (stringify-able)
   	];

	//function for iterating over the property-list and generating JSON-like entries in the string-buffer
	var appendStringified = storageUtils.appendStringified;
	
	var moduleNameString = '"'+this.name+'Layout"';

	//TODO use requirejs mechanism? (NOTE there may occur timing problems for loading/registering the JS file, and querying the PresentationManager for it ...)
//	var sb = ['define('+moduleNameString+', ["storageUtils"], function(parser){ return parser.restoreObject({ classConstructor: "layout"', ','];
	
	var sb = ['require("storageUtils").restoreObject({ classConstructor: "layout"', ','];
		
	appendStringified(this, propList, sb);
	
	sb.push( 'initPublish: function(){ require("presentationManager").addLayout(this); }');
	sb.push(',');
	
	//non-primitives array-properties with stringify() function:
	appendStringified(this, arrayPropList, sb, null, function arrayValueExtractor(name, arrayValue){
		
		var buf =['['];
		for(var i=0, size = arrayValue.length; i < size; ++i){
			buf.push(arrayValue[i].stringify());
			buf.push(',');
		}
		//remove last comma
		if(arrayValue.length > 0){
			buf.splice( buf.length - 1, 1);
		}
		buf.push(']');
		
		return buf.join('');
	});
	
	
	//if last element is a comma, remove it
	if(sb[sb.length - 1] === ','){
		sb.splice( sb.length - 1, 1);
	}
	
	//TODO use requirejs mechanism? (see remark above)
//	sb.push(' }, true); });\n require(['//<- add require-call, so that this JS-file adds itself to the loaded dependencies in requirejs
//			+ moduleNameString + ']);');
	
	sb.push(' }, true, '+storageUtils.STORAGE_FILE_FORMAT_NUMBER+');');
	
	return sb.join('');
};

//	/**
//	 * Create the header of the layout.
//	 * 
//	 * TODO check this implementation -> is it conform with code for handling eHTML templates?
//	 * 
//	 * @function parseHead
//	 * @param {Object} jsonDef definition of the header
//	 * @returns {String} The header
//	 * @deprecated unused
//	 * @public
//	 */
//	Layout.prototype.parseHead = function(jsonDef){
//	    var head = "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
//	    
//	    if (jsonDef != null) {
//	    
//	    
//	        var stylesheetPaths = jsonDef.query('/stylesheets/path');
//        var jsPaths = jsonDef.query('/mmirf/path');
//	        
//	        $.each(stylesheetPaths, function(index, stPath){
//	            head += "<link rel=\"stylesheet\" href=\"content/stylesheets/" + stPath + ".css\"/>";
//	        });
//	        
//	        $.each(jsPaths, function(index, jsPath){
//	            head += "<script  type=\"text/javascript\" charset=\"utf-8\"  src=\"" + jsPath + ".js\"></script>";
//	        });
//	    }
//	    
//	    head += "</head>";
//	    
//	    return head;
//	};

//	/**
//	 * Create the body of the layout.
//	 * 
//	 * TODO check this implementation -> is it conform with code for handling eHTML templates?
//	 * 
//	 * @function parseBody
//	 * @param {Object} jsonDef definition of the body
//	 * @returns {String} The body
//	 * @deprecated this function refers to the outdated/unsed JSON-format for defining layout/views
//	 * @public
//	 * 
//	 * @requires jpath.js (JPath)
//	 */
//	Layout.prototype.parseBody = function(jsonDef){
//		var body = "<body><div id=\"pageContainer\" data-role=\"page\" class=\"type-interior\">";
//	    if (jsonDef != null) {
//	        var header = new JPath(jsonDef.query('header'));
//	        var content = new JPath(jsonDef.query('content'));
//	        var footer = new JPath(jsonDef.query('footer'));
//	        
//	        if (header) {
//	            var headerYield = header.query('yield');
//	            body += " <div id=\"pageHeader\" data-role=\"header\" data-position=\"fixed\">";
//	            if (headerYield) {
//	                body += "\"yield\":\"" + headerYield + "\"";
//	                this.yields['header'] = headerYield;
//	            }
//	            body += "</div>";
//	        }
//	        
//	        if (content) {
//	            var contentYield = content.query('yield');
//	            body += " <div id=\"pageContent\">";
//	            if (contentYield) {
//	                body += "\"yield\":\"" + contentYield + "\"";
//	                this.yields['content'] = contentYield;
//	            }
//	            body += "</div>";
//	        }
//	        
//	        if (footer) {
//	            var footerYield = footer.query('yield');
//	            body += " <div id=\"pageFooter\" data-role=\"footer\" data-position=\"fixed\">";
//	            if (footerYield) {
//	                body += "\"yield\":\"" + footerYield + "\"";
//	                this.yields['footer'] = footerYield;
//	            }
//	            body += "</div>";
//	        }
//	        //currently all body components (header, content, and footer could only contains "yield"
//	    
//	    }
//	    
//	    body += "</div></body>";
//	    
//	    if(logger.isv()) logger.v("body : " + body);//debug
//	    
//	    return body;
//	};

	return Layout;
	
	/**  #@- */
});
