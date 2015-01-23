

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
 * @depends document
 * @depends document.head
 * @depends document.createElement( link )
 */
define(function loadJqmCss() {
	
	function loadLink(href, rel, callback){
		
		if(typeof rel === 'function'){
			callback = rel;
			rel = void(0);
		}
		
		var link = document.createElement('link');
		link.rel = rel? rel : 'stylesheet';
		link.href = href;
	
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
