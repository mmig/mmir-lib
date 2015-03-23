/*
 * Standalone Wait Dialog (extracted from jQuery Mobile 1.4.3)
 * 
 * stdlne-wait-dlg
 *
 * <div class="stdlne-wait-dlg stdlne-style-b stdlne-wait-dlg-verbose"><span class="stdlne-icon"></span><h1>title</h1></div>
 * 
 * version 0.2
 * Copyright (C) 2015 russa, DFKI GmbH
 * MIT license
 * 
 * Dependencies:
 *   * document (DOM): body, head
 *     * createElement: div, span, h1
 *     * appendChild
 *     * classList
 *     * className
 *     * childNodes
 */

//(function(module){
define(['module'], function(module){

//configurable via requirejs' module:
// * activeClass: (String) the CSS for setting the dialog to 'active' state
//                DEFAULT: "stdlne-active"
// * fileName: (String) the name of the CSS styles file
//                DEFAULT: "stdlne-wait-dlg.css"
// * defaultType: (String) default type for the wait-dialog: ["small" | "verbose"]
//                DEFAULT: "verbose"
// * defaultTheme: (String) default theme for the wait-dialog: ["a" | "b"]
//                DEFAULT: "a"
// * defaultTitle: (String) default title / caption for the wait-dialog
//                DEFAULT: ""

/** 
 * Temporary variable for retrieving configuration values.
 * 
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var tmpConfig = module.config().activeClass;

/** 
 * @type String
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var activatorClass = tmpConfig? tmpConfig : 'stdlne-active';

tmpConfig = module.config().fileName;
/** 
 * @type String
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var defaultStyleUrl = tmpConfig? tmpConfig : 'stdlne-wait-dlg.css';



/** 
 * @constant
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var types = {
		'small':   'stdlne-wait-dlg-small',
		'verbose': 'stdlne-wait-dlg-verbose'
};

//set default type
tmpConfig = module.config().defaultType;
if(!tmpConfig){
	tmpConfig = 'stdlne-wait-dlg-verbose';
} else {
	tmpConfig = types[tmpConfig];
}
types['default'] = tmpConfig;



/** 
 * @constant
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var themes = {
		'a': 'stdlne-style-a',
		'b': 'stdlne-style-b'
};

//set default theme
tmpConfig = module.config().defaultTheme;
if(!tmpConfig){
	tmpConfig = 'stdlne-style-a';
} else {
	tmpConfig = themes[tmpConfig];
}
themes['default'] = tmpConfig;


//setting up the default title (used in StandaloneWaitDialog class)
/** 
 * @private
 * @type String
 * @memberOf StandaloneWaitDialog.prototype
 */
var tmpDefaultTitle = module.config().defaultTitle;

if(!tmpDefaultTitle){
	tmpDefaultTitle = '';
}



tmpConfig = module.config().defaultId;
/** 
 * ID for default wait dialog (i.e. when show() is used without ID argument).
 * 
 * @type String
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var defaultDialogId = tmpConfig? tmpConfig : 'default-stdlne-wait-dlg';


/**
 * HELPER set type, theme classes to a wait-dialog DOM element
 *  
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
function _applyClasses(domEl, typeCl, themeCl, isActivate){

	if(typeCl){
		
		if(typeCl !== types['small']){
			domEl.classList.remove(types['small']);
		} else if(typeCl !== types['verbose']){
			domEl.classList.remove(types['verbose']);
		}
		domEl.classList.add(typeCl);
	}
	
	if(themeCl){
		
		if(themeCl !== themes['a']){
			domEl.classList.remove(themes['a']);
		} else if(themeCl !== themes['b']){
			domEl.classList.remove(themes['b']);
		}
		
		domEl.classList.add(themeCl);
	}

	//apply 'active' class
	if(isActivate){
		domEl.classList.add(activatorClass);
	}
}

/**
 * Default options for wait dialog.
 * 
 * <p>
 * Different wait dialogs are managed 
 * in the <code>defaultOptions</code> map
 * (map-key is their ID).
 * 
 * @class
 * @see StandaloneWaitDialog#defaultOptions
 */
function Options(options, owner){
	this.set(options, owner);
}

Options.prototype = {
	
	set: function(options, owner){
		
		if(owner){
			this._owner = owner;
		}
		
		if(options.theme){
			this._theme = themes[options.theme];
		}
		if(options.type){
			this._type = types[options.type];
		}
		
		if(options.style){
			this._style = options.style;
		}
		if(options.classes){
			var cl = options.classes;
			if(typeof cl === 'string'){
				cl = cl.split(' ');
			}
			this._classes = cl;
		}
	},
	getTheme: function(){
		if(typeof this._theme !== 'undefined'){
			return this._theme;
		}
		return this._owner.defaultTheme;
	},
	getType: function(){
		if(typeof this._type !== 'undefined'){
			return this._type;
		}
		return this._owner.defaultType;
	},
	getTitle: function(){
		if(typeof this._title !== 'undefined'){
			return this._title;
		}
		return this._owner.defaultTitle;
	},
	getClasses: function(){
		if(typeof this._classes !== 'undefined'){
			return this._classes;
		}
		return;
	},
	getStyle: function(){
		if(typeof this._style !== 'undefined'){
			return this._style;
		}
		return;
	}
};

/**
 * The Wait Dialog interface.
 * 
 * <p>
 * Allows to create multiple wait dialogs.
 * 
 * @class
 * @singleton
 */
function StandaloneWaitDialog(){
	if(typeof window !== 'undefined' && this === window){
		return new StandaloneWaitDialog();
	}
	return this;
};

StandaloneWaitDialog.prototype = {
		defaultTitle: tmpDefaultTitle,
		defaultTheme: themes['default'],
		defaultType:  types['default'],
		styleUrl:     defaultStyleUrl,
		_isCssLoaded: false,
		_getDom: function(id){//returns: Array
			
			if(id){//if id: only return one element (in an array)
				var element = document.getElementById(id);
				return element? [element] : [];
			}
			return document.getElementsByClassName('stdlne-wait-dlg');
			
		},
		_loadStyle: function(url, isForceReloading){
			
			if(typeof url === 'boolean'){
				isForceReloading = url;
				url = void(0);
			}
			
			if(this._isCssLoaded && !isForceReloading){
				return;
			}

			//NOTE do not use onload for LINK:
			//     not supported by all browsers, so no
			//     reliable detection via onload possible.
			//     -> just use simple FLAG
			//     (application must deal with possible loading-problems)
			this._isCssLoaded = true;
			
			if(!url){
				url = this.styleUrl;
			}
			
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel  = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
			
		},
		_getDefaults: function(id){
			return defaultOptions.get(id);
		},
		setDefaults: function(id, options){//NOTE not allowed for default-wait-dialog (-> set properties on StandaloneWaitDialog instance itself!)
			
			if(!id || !options){
				throw new Error('Invalid argument(s): '+(!id? 'missing ID (got: '+id+')':'')+(!options? 'missing options (got: '+options+')':''));
			}
			
			var defs = defaultOptions.get(id);
			if(!defs){
				defs = new Options(options, this);
				defaultOptions.set(id, defs);
			}
			else {
				defs.set(options);
			}
		},
		create: function(id, options){
			
			var _id = id;
			
			var container = document.createElement("div");
			container.classList.add('stdlne-wait-dlg');
			
			if(_id){
				
				container.id = _id;
				
				if(options){
					this.setDefaults(_id, options);
				}
			}
			
			var icon = document.createElement("span");
			icon.className = 'stdlne-icon';
			
			var caption = document.createElement("h1");
//			caption.className = 'stdlne-caption';
			
			container.appendChild(icon);
			container.appendChild(caption);
			
			return container;
		},
		/**
		 * 
		 * @param {String|Object} [title] OPTIONAL
		 * 			if String: the tile to show in the dialog (NOTE: only visible, if dialog-style is "verbose")
		 * 			if Object: an options object with (OPTIONAL) properties:
		 * 				* option.title {String} the title<br>
		 *				* option.id {String} the ID attribute of the dialog to show<br>
		 *				* option.type  {String} the type for the dialog to show: ["small" | "verbose"], default: "verbose"<br>
		 *				* option.theme {String} the theme (style) for the dialog to show: ["a" | "b"], default: "a"<br>
		 * @param {String} [id] OPTIONAL
		 * 				an ID for the dialog to show (if omitted the default dialog will be shown)
		 */
		show: function(title, id, options){
			
			var _title, _id, _type, _theme, _defaults;
			
			var _style, _classes, _elStyle;
			
			//re-map argument: is 2nd argument the options object?
			if(!options && id !== null && typeof id === 'object'){
				options = id;
				id = void(0);
			}

			if(id){
				_id = id;
			}
			
			if(title){
				
				if(typeof title === 'string'){
					_title = title;
				}
				else {
					_title = title.title;
					//NOTE if there is also an options object (3rd argument),
					//     it will be overwritten by the first-argument's options!
					_type  = typeof title.type  !== 'undefined'? types[title.type]   : _type;
					_theme = typeof title.theme !== 'undefined'? themes[title.theme] : _theme;
					_id    = typeof title.id    !== 'undefined'? title.id            : id;
				}
				
			} else {
				
				_title = this.defaultTitle;
			}
			
			if(_id){
				
				if(options){
					this.setDefaults(_id, options);
				}
				
				_defaults = this._getDefaults(_id);
				if(_defaults){
					if(_defaults.getType() && typeof _type === 'undefined'){
						_type = _defaults.getType();
					}
					if(_defaults.getTheme() && typeof _theme === 'undefined'){
						_theme = _defaults.getTheme();
					}
					if(_defaults.getTitle() && typeof _title === 'undefined'){
						_title = _defaults.getTitle();
					}

					if(_defaults.getStyle() && typeof _style === 'undefined'){
						_style = _defaults.getStyle();
					}
					if(_defaults.getClasses() && typeof _classes === 'undefined'){
						_classes = _defaults.getClasses();
					}
				}
			}
			
			if(typeof _type === 'undefined'){
				_type = this.defaultType;
			}
			if(typeof _theme === 'undefined'){
				_theme = this.defaultTheme;
			}
			if(typeof _title === 'undefined'){
				_title = this.defaultTitle;
			}
			
			if(typeof _id === 'undefined'){
				_id = defaultDialogId;
			}
			
			var list = this._getDom(_id);
			var size = list.length;
			if(size < 1){
				list = [this.create(_id, options)];
				size = 1;
				document.body.appendChild(list[0]);
			}
			
			var curr;
			for(var i=0; i < size; ++i){
				curr = list[i];
				_applyClasses(curr, _type, _theme, true);
				curr.childNodes.item(1).textContent = _title;
				
				if(typeof _style !== 'undefined'){
					//TODO should this just overwrite the complete style-attribute?
					//     ...because now, the removal (see hide()) is somewhat hacked 
					//        and also may "overlook" added semicolon...
					_elStyle = curr.getAttribute('style');
					if(!_elStyle){
						_elStyle = _style;
					}
					else  {
						_elStyle +=';' + _style;
					}
					curr.setAttribute('style', _elStyle);
				}
				if(typeof _classes !== 'undefined'){
					curr.classList.add.apply(curr.classList, _classes);
				}
			}
		},
		/**
		 * 
		 * @param {String} [id] OPTIONAL
		 * 			the ID for the dialog element (if omitted all dialogs will be hidden)
		 */
		hide: function(id){
			var list = this._getDom(id), curr, defs, currStyle;
			for(var i=0,size = list.length; i < size; ++i){
				curr = list[i];
				curr.classList.remove(activatorClass);
				
				if(curr.id){
					
					defs = this._getDefaults(curr.id);
					
					//remove style and classes from defaults
					if(defs){
						currStyle = curr.getAttribute('style');
						if(defs.getStyle() && currStyle){
							curr.setAttribute('style', currStyle.replace(defs.getStyle(), '') );
						}
						if(defs.getClasses()){
							curr.classList.removeapply(curr.classList, defs.getClasses());
						}
					}
				}
			}
		}
};
//module.waitDialog = dlg;

/** 
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var dlg = new StandaloneWaitDialog();
//dlg.newInstance = StandaloneWaitDialog;

/** 
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
var defaultOptions = {
	get: function(id){
		if(id){
			return this[_getKey(id)];
		}
		return this['$'];
	},
	set: function(id, options){
		if(!id){
			id = '$';
		}
		this[_getKey(id)] = options;
	},
	'$': new Options({}, dlg)
};

/** 
 * @private
 * @memberOf StandaloneWaitDialog.prototype
 */
function _getKey(id){
	return '$$'+id;
}

return dlg;
});

//})(window);
