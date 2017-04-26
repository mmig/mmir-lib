

/**
 * Helper that loads a CSS file (i.e. LINK tag).
 * 
 * @returns {Function} a function for loading LINKs into the current <code>document</code>:
 * 					   <code>loadLink(href : String, rel : String, callback : Function)</code>
 * 
 * where
 * <code>href</code>: (String) the URL for the LINK
 * <code>rel</code>: (String) OPTIONAL the value for the <code>rel</code> attribute of the LINK tag (DEFAULT: <code>stylesheet</code>)
 * <code>callback</code>: (Function) OPTIONAL a callback function for the <code>onload</code> event (NOTE: this is not supported or fully supported by all browsers -- may never be fired!)
 * 
 * or
 * <code>options</code>: (Object) an options object with properties.
 * where the properties should/can be:
 * <code>options.href</code>: (String) the URL for the LINK
 * <code>options.rel</code>: (String) OPTIONAL (see above)
 * <code>options.onload</code>: (Function) OPTIONAL callback for onload event (see above)
 * <code>options.&lt;property&gt;</code>: (any) OPTIONAL any additional properties will be added to the created LINK object "as-is"
 * 
 * @requires document
 * @requires document.head
 * @requires document.createElement( link )
 */
define(function loadJqmCss() {
	
	function loadLink(href, rel, callback){
		
		//normalize arguments:
		var attrs = null;
		if(typeof href === 'object'){
			//handle case: args is options object
			attrs = href;
			
			if(attrs.href){
				href = attrs.href;
				attrs.href = void(0);
			}
			
			if(attrs.rel){
				rel = attrs.rel;
				attrs.rel = void(0);
			}
			
			if(attrs.onload){
				callback = attrs.onload;
				attrs.onload = void(0);
			}
			
		}
		else if(typeof rel === 'function'){
			//handle case: args' 2nd param is callback function
			callback = rel;
			rel = void(0);
		}
		
		//create the link and its properties:
		
		var link = document.createElement('link');
		link.rel = rel? rel : 'stylesheet';
		link.href = href;
		
		if(attrs) for(var prop in attrs){
			if(typeof attrs[prop] !== 'undefined' && attrs.hasOwnProperty(prop)){
				if(prop === 'class'){
					link.classList.add(attrs[prop]);
				} else if(/^data-/.test(prop)){
					link.dataset[prop.substring(5)] = attrs[prop];
				} else {
					link[prop] = attrs[prop];
				}
			}
		}
	
		//NOTE this may not work 
		// (some browser do not support onload for CSS; some only fire onload for remotely loaded CSS files...)
		if (typeof callback === 'function') {
			/** @ignore */
			link.onload = function() {
				callback.apply(this, href, rel);
			};
		}
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	
	return loadLink;
	
});
