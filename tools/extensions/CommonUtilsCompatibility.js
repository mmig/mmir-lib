define(['jsonUtils', 'resizeToFit'],
	/**
     * Set to "backwards compatibility mode" (for pre version 2.0) for CommonUtils.
     * NOTE: needs {@link mmir.Core.setToCompatibilityModeExtension} to be set first!
     *
     * This function re-adds deprecated and removed functions and
     * properties to the CommonUtils instance.
     *
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     * 
     * <p>
     * In addition, the following functions of CommonUtils are made accessible
     * on the <code>mmir.CommonUtils</code> instance with these additional names
     * <ul>
     * 	<li> {@link mmir.CommonUtils#regexHTMLComment} as
     *          <b><u>html_comment_regex : RegExpr</u></b>
     *  </li><li>
     *  	 {@link mmir.CommonUtils#resizeFitToSourroundingBox} as
     *          <b><u>html_resize_font_to_fit_surrounding_box()</u></b>
     * </li><li>
     * 		 {@link mmir.CommonUtils#toJSONStringValue} as
     *          <b><u>to_json_string_value(String: theObjectValue) : String</u></b>
     * </li><li>
     * 		 {@link mmir.CommonUtils#convertJSONStringValueToHTML} as
     *          <b><u>convert_to_json_value_HTML_string(String: str) : String</u></b>
     * </li><li>
     * 		 {@link mmir.CommonUtils#convertJSONStringToHTML} as
     *          <b><u>convert_json_to_HTML_string(String: str) : String</u></b>
     * </li><li>
     * 		 {@link mmir.CommonUtils#parseParamsToDictionary} as
     *          <b><u>get_params_as_dict(String: str) : Object</u></b>
     * </li>
     * </ul>
     *
     * Also, the functions of {@link mmir.extensions.JsonUtils} will be made available.
     *
     * @requires document (DOM element)
     *
     * @param {mmir.CommonUtils} compatibilitySelf
     * 			the instance of mmir.CommonUtils to which the compatibility functions etc.
     * 			will be attached
     *
	 * @class
	 * @name mmir.CommonUtils.setToCompatibilityModeExtension
	 * @static
	 *
	 * @example
	 * require(['core3Compatibility', 'commonUtilsCompatibility'], function(setCoreCompatibility, setCompatibility){
	 * 		setCoreCompatibility(mmir);
	 * 		setCompatibility(mmir.CommonUtils);
	 * });
	 *
     * @requires document (DOM element)
	 *
	 * @public
	 */
	function(jsonUtils, resizeToFit
) {

	/**
     * Set to "backwards compatibility mode" (for pre version 2.0).
     *
     * This function re-adds deprecated and removed functions and
     * properties to the CommonUtils instance.
     *
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     *
     * @requires document (DOM element)
     *
     * @param {mmir.CommonUtils} compatibilitySelf
     * 			the instance of mmir.CommonUtils to which the compatibility functions etc.
     * 			will be attached
     *
     * @constructs mmir.CommonUtils.setToCompatibilityModeExtension
     *
     * @borrows mmir.CommonUtils#regexHTMLComment as
     *          html_comment_regex
     * @borrows mmir.CommonUtils#resizeFitToSourroundingBox as
     *          this.html_resize_font_to_fit_surrounding_box
     * @borrows mmir.CommonUtils#toJSONStringValue as
     *          this.to_json_string_value
     * @borrows mmir.CommonUtils#convertJSONStringValueToHTML as
     *          this.convert_to_json_value_HTML_string
     * @borrows mmir.CommonUtils#convertJSONStringToHTML as
     *          this.convert_json_to_HTML_string
     * @borrows mmir.CommonUtils#parseParamsToDictionary as
     *          this.get_params_as_dict
     * @borrows mmir.ExtendedCommonUtils#resizeFitToSourroundingBox as
     *          this.resizeFitToSourroundingBox
     */
    return setToCompatibilityMode = function(compatibilitySelf) {

    	/** @scope mmir.CommonUtils.setToCompatibilityModeExtension.prototype *///for jsdoc2

    	//add functions from jsonUtils
    	for(var p in jsonUtils){
    		if(jsonUtils.hasOwnProperty(p)){
    			compatibilitySelf[p] = jsonUtils[p];
    		}
    	}

			//add function from resizeToFit:
			compatibilitySelf.resizeFitToSourroundingBox = resizeToFit;

		/**
		 * Array of strings for the conversion of month represented by integers
		 * to strings Default Language for months is english, 'en'
		 *
		 * @type Object
		 * @private
		 */
    	compatibilitySelf.months = {
			'01': 'January',
			'02': 'February',
			'03': 'March',
			'04': 'April',
			'05': 'May',
			'06': 'June',
			'07': 'July',
			'08': 'August',
			'09': 'September',
			'10': 'October',
			'11': 'November',
			'12': 'December'
    	};
    	/**
    	 * @private
    	 */
    	compatibilitySelf.months.de = {
			'01': 'Januar',
			'02': 'Februar',
			'03': 'M\u00E4rz',//'M&auml;rz',
			'04': 'April',
			'05': 'Mai',
			'06': 'Juni',
			'07': 'Juli',
			'08': 'August',
			'09': 'September',
			'10': 'Oktober',
			'11': 'November',
			'12': 'Dezember'
    	};

//		/**
//		 * The instance that holds the extensions for compatibility
//		 * mode, which really is the CommonUtils instance.
//		 *
//		 * @type
//		 * @private
//		 */
//		var compatibilitySelf = this;

		/**
		 * HTML-Dom-Element for logging directly on the main HTML-Page
		 * as of now there is no element with the id "log" in the
		 * index.html
		 *
		 * @type Element
		 * @private
		 * @deprecated unused
		 */
		var debugNode = document.getElementById("log");

		/**
		 * Regular Expression to identify a styleSheet-tag for the
		 * transformation of ehtml to html
		 *
		 * @type String|RegExp
		 * @private
		 * @deprecated unused
		 */
		var styleSheetRegExp = /<(%=\s*stylesheet_link_tag)\s* (\"(.*)\" %)>/;

		/**
		 * Regular Expression to identify a javascript for the
		 * transformation of ehtml to html
		 *
		 * @type String|RegExp
		 * @private
		 * @deprecated unused
		 */
		var javaScriptRegExp = /<(%=\s*javascript_include_tag)\s* (\"(.*)\" %)>/;

		/**
		 * Regular Expression to identify content for a view-element:<br>
		 * either _header_, _footer_, _dialogs_ or _content_
		 *
		 * @deprecated old template syntax format
		 *
		 * @type String|RegExp
		 * @private
		 */
		var contentForRegExp = /<%\s*content_for\s*:([^\s]*)\s*do\s*%>(([\s|\n]*.*[\s|\n]*)*)<%\s*end\s*%>/i;

		/**
		 * Regular Expression to identify if a partial should be
		 * rendered inside a view (ehtml-String)
		 *
		 * @deprecated old template syntax format
		 *
		 * @type String|RegExp
		 * @private
		 */
		var renderPartialRegExp = /<%\s*render\s*([^\s]*)\s*\{\}\s*%>/i;

		/**
		 * Regular Expression for matching a translation-tag for the
		 * localization of view content (ehtml-String)
		 *
		 * @deprecated old template syntax format
		 *
		 * @type String|RegExp
		 * @private
		 */
		var translationRegExpString = '<%t\\s*:([^\\s]*)\\s*%>';

		// /**
		// * The Prefix for the names of view-files - currently unused
		// and deprecated.
		// *
		// * @type String
		// * @private
		// * @deprecated has no further value
		// */
		// var viewsPrefix = '#';

		/**
		 * See Property:
		 * {@link #setToCompatibilityModeExtension-render_partial_regex}
		 * <br>
		 * This regular expression is an extension for the parsing of
		 * the parameters of the partial (for customization) to get the
		 * name of the corresponding controller of the partial.<br>
		 *
		 * Regular Expression to identify if a partial is to be inserted
		 * in a view. <br>
		 * Partials are in principle customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example   <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mmir.ControllerManager.getInstance().getController("googlemap").impl['current_poi_meta_data'])} %>
		 * @type String|RegExp
		 * @public
		 */
		var partial_name_regex = /^([^\/]+)\/(.+)$/i;
		compatibilitySelf.partial_name_regex = partial_name_regex;

		/**
		 * Regular expression for the parsing of partial-files.<br>
		 * This expression detects all variables and data-instructions
		 * for the customization of the partial. There are 3 types of
		 * variables or instructions:
		 *  + <b>if-else-statement</b>, controls which part of the
		 * partial will be displayed - depending on the condition +
		 * <b>data-instruction</b>, which is evaluated, but not
		 * displayed + <b>variable</b> or <b>javascript-code</b>,
		 * which are evaluated and displayed in the view
		 *
		 * Partials are principally customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example   {::address = address + " " + {:curr_poi_data}.query('addressBean/housenumber')}
		 * @type String|RegExp
		 * @public
		 */
		var partial_var_pattern_regex = /(\{[^\}\{]+\})|(\{[^\{]*(\{(?=[^\}]*\}).*)\})/gmi;
		compatibilitySelf.partial_var_pattern_regex = partial_var_pattern_regex;

		/**
		 * Regular expression for the parsing of partial-files.<br>
		 * This expression detects all simple variables for the
		 * customization of the partial in the form of
		 * <b>{:curr_poi_data}</b>.<br>
		 * Form of <b>simple object</b>: <b>{:SIMPLE_OBJECT}</b><br>
		 *
		 * Partials are principally customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 *
		 * @deprecated old template syntax format
		 *
		 * @example {:curr_poi_data}
		 * @type String|RegExp
		 * @public
		 */
		var partial_var_pattern_simpleobject_regex = /\{:([^\}]+)\}/;
		compatibilitySelf.partial_var_pattern_simpleobject_regex = partial_var_pattern_simpleobject_regex;

		/**
		 * Regular expression for the parsing of partial-files.<br>
		 * This expression detects all <b>data objects</b> for the
		 * customization of the partial in the form of
		 * <b>{::curr_poi_data={:curr_poi_data_jpath}}</b>.<br>
		 * Form of <b>data object</b>: <b>{::DATA_OBJECT}</b><br>
		 *
		 * Partials are principally customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 *
		 * @deprecated old template syntax format
		 *
		 * @example {::address = address + "&lt;br/&gt;"}
		 * @type String|RegExp
		 * @public
		 */
		var partial_var_pattern_dataobject_regex = /\{::([^\}\{]+)\}|\{::([^\{]*(?:\{(?:[^\}]*\}).*))\}/ig;
		compatibilitySelf.partial_var_pattern_dataobject_regex = partial_var_pattern_dataobject_regex;

		/**
		 * Regular expression for detecting an assignment expression in
		 * templates, e.g. <code>{::theVariable=... }</code>.
		 *
		 *
		 * @deprecated old template syntax format
		 *
		 * @example {::address = address + "&lt;br/&gt;"}
		 *          or
		 *          <code>{::address = {:anotherVariable} + "&lt;br/&gt;"}</code>
		 * @type String|RegExp
		 * @public
		 */
		var partial_var_pattern_assignment_regex = /\{::([^\}\{=]+)=([^\}\{]+)\}|\{::([^\}\{=]+)=([^\{]*(?:\{(?:[^\}]*\}).*))\}/ig;
		compatibilitySelf.partial_var_pattern_assignment_regex = partial_var_pattern_assignment_regex;

		// /**
		// * Deprecated regular expression for partials.
		// * @type String|RegExp
		// * @public
		// * @deprecated unused
		// */
		// var partial_var_pattern_object_with_function_regex =
		// /\{?([^\.]+)([\.\[])([^\s\}]+)()/ig
		// compatibilitySelf.partial_var_pattern_object_with_function_regex
		// = partial_var_pattern_object_with_function_regex;

		/**
		 * Regular Expression to identify content in a view that will be
		 * inserted.<br>
		 * The content is generated by a helper function of the
		 * controller and usually saved as a JSON-Object with a _helper_
		 * and _content_ part.<br>
		 * If the string is escaped and must be unescaped a second
		 * parameter can be given to ensure that the string will be
		 * unescaped before the insertion in the view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example  <%= value_of(languageMenu::header, true) %>
		 * @type String|RegExp
		 * @public
		 */
		var value_of_regex = /<%=\s*value_of\s*\(([^\)]*)\)\s*%>/igm;
		compatibilitySelf.value_of_regex = value_of_regex;

		/**
		 * See Property:
		 * {@link #setToCompatibilityModeExtension-value_of_regex}
		 * <br>
		 * This regular expression is an extension to parse the
		 * parameters of the <b>value_of</b>-function.<br>
		 *
		 * Regular Expression to identify content in a view that will be
		 * inserted.<br>
		 * The content is generated by a helper function of the
		 * controller and usually saved as a JSON-Object with a _helper_
		 * and _content_ part.<br>
		 * If the string is escaped and must be unescaped a second
		 * parameter can be given to ensure that the string will be
		 * unescaped before the insertion in the view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example  <%= value_of(languageMenu::header, true) %>
		 * @type String|RegExp
		 * @public
		 */
		var value_of_path_regex = /\(\s*([^\),]*),?\s*([^\)]*)\s*\)/i;
		compatibilitySelf.value_of_path_regex = value_of_path_regex;

		/**
		 * Regular Expression to identify if a partial is to be inserted
		 * in a view. <br>
		 * Partials are in principle customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example   <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mmir.ControllerManager.getInstance().getController("googlemap").impl['current_poi_meta_data'])} %>
		 * @type String|RegExp
		 * @public
		 */
		var render_partial_regex = /<%\s*render\s*([^\s]*)\s*\{([^\}]*)\}\s*%>/igm;
		compatibilitySelf.render_partial_regex = render_partial_regex;

		/**
		 * See Property:
		 * {@link #setToCompatibilityModeExtension-render_partial_regex}
		 * <br>
		 * This regular expression is an extension for the parsing of
		 * the parameters of the partial (for customization).<br>
		 *
		 * Regular Expression to identify if a partial is to be inserted
		 * in a view. <br>
		 * Partials are in principle customizable views, which can be
		 * used independently from a controller and furthermore accept
		 * parameters to customize the partial.<br>
		 * A partial is first processed and then integrated into the
		 * view.
		 *
		 * @deprecated old template syntax format
		 *
		 * @example   <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mmir.ControllerManager.getInstance().getController("googlemap").impl['current_poi_meta_data'])} %>
		 * @type String|RegExp
		 * @public
		 */
		var partial_parameter_regex = /\s*:(\S*)\s*=>\s*(("([\S ]+)")|([^,]+))/i;
		compatibilitySelf.partial_parameter_regex = partial_parameter_regex;

		/**
		 * Appends a log-message to the main document (index.html) and
		 * prints it in the console
		 *
		 * @function
		 * @param {String}
		 *            clazz A prefix for the output of the log message
		 *            in the console
		 * @param {String}
		 *            logMessage The log message which should be printed
		 * @public
		 * @deprecated
		 */
		var log = function(clazz, logMessage) {
			debugNode = document.getElementById("log");
			if (debugNode) {
				debugNode.innerHTML += "<pre>\n" + logMessage + "\n</pre>\n";
			}
			console.log(clazz + ":" + logMessage);
		};
		compatibilitySelf.log = log;

		/**
		 * Function which transforms a ehtml string (while parsing
		 * views) into html by replacing stylesheet-, javascript- and
		 * content_for-tags with corresponding contents.
		 *
		 *
		 * @deprecated used for parsing/rendering old template syntax
		 *             format
		 *
		 * @function
		 * @param {String}
		 *            eHtmlTag A string that should be transformed from
		 *            ehtml to html
		 * @public
		 * @returns {String} From ehtml into html transformed string
		 */
		var ehtml2Html = function(eHtmlTag) {

			var result;
			if (eHtmlTag.match(styleSheetRegExp)) {
				var group = eHtmlTag.match(styleSheetRegExp);
				result = eHtmlTag.replace(group[1], "link rel=\"stylesheet\" ").replace(group[2], "href=\"content/stylesheets/" + group[3] + ".css\"/");
			}else if (eHtmlTag.match(javaScriptRegExp)) {
				var group = eHtmlTag.match(javaScriptRegExp);
				result = eHtmlTag.replace(group[1], "script  type=\"text/javascript\" charset=\"utf-8\" ").replace(group[2], "src=\"" + group[3] + ".js\"></script");
			}else if (eHtmlTag.match(contentForRegExp)) {
				var group = eHtmlTag.match(contentForRegExp);
				return group;
			}
			else {
				return eHtmlTag;
			}

			return result;
		};
		compatibilitySelf.ehtml2Html = ehtml2Html;

		/**
		 * Similar to the jQuery.getScript() function - appending a url
		 * of a javascript-source to the header of the main document.
		 *
		 * @function
		 * @param {String}
		 *            scriptSrc source of javascript-file
		 * @public
		 * @deprecated superseded by getLocalScript
		 */
		var appendJsSrcToHeader = function(scriptSrc) {
			// appends '<script src=scriptSrc type =
			// "text/javascript"></script>' to header
			// thus loading it dynamically
			var newScript = document.createElement('script');
			newScript.type = "text/javascript";
			newScript.src = scriptSrc;
			document.head.appendChild(newScript);
		};
		compatibilitySelf.appendJsSrcToHeader = appendJsSrcToHeader;

		// /**
		// * Get the prefix for views.
		// * @function
		// * @public
		// * @returns {String} The Prefix for the file names of views
		// * @deprecated This function is unused and superfluous
		// */
		// var compatibilitySelf.getViewsPrefix= function(){
		// return viewsPrefix;
		// };
		// compatibilitySelf.getViewsPrefix = getViewsPrefix;

		/**
		 * Gets the Regular Expression for translation tags.
		 *
		 * @function
		 * @public
		 * @returns {String} The regular expression for matching a
		 *          translation-tag - used inside a ehtml-String
		 */
		var getTranslationRegExp = function() {
			return new RegExp(translationRegExpString, 'gi');
		};
		compatibilitySelf.getTranslationRegExp = getTranslationRegExp;

		/**
		 * Reformat the String representation of a date.
		 *
		 * @example converts <code>2012-07-23 16:37:33.0</code> into
		 *          &rarr; <code>23. July 2012</code>
		 *
		 * @function
		 * @param {String}
		 *            the date String in format
		 *            <code>yyyy-mm-dd HH:mm:ss.S</code>
		 * @param {String}
		 *            <em>[Optional]</em> the language code (currently
		 *            used to format the name of the month). Currently
		 *            supported languages: <code>en, de</code>. If
		 *            unkown or omitted, default <code>en</code> is
		 *            used.
		 * @return {String} a new String representation for the date
		 * @public
		 */
		var get_date_as_string = function(date, languageCode) {
			var self = this;
			var day, month, year;
			var date_time = date.split(" ");
			var splited_date = date_time[0].split("-");
			year = splited_date[0];
			month = splited_date[1];

			// add leading zero if necessary
			if (month.length == 1) {
				month = '0' + month;
			}
			day = splited_date[2];

			var theLanguage = typeof languageCode === 'string'? languageCode.toLowerCase() : null;
			var monthName;
			if(theLanguage !== null && languageCode !== 'en' && self.months[theLanguage]){
				//get language specific name for month, if possible
				monthName = self.months[theLanguage][month];
			}
			else {
				//get default name for month
				monthName = self.months[month];
			}
			return day +". "+monthName+" "+year;
		};
		compatibilitySelf.get_date_as_string = get_date_as_string;

		/**
		 * Convert a duration (in seconds) into a String representation.
		 *
		 * @example
		 * 	2:09:19 h
		 *  12:05 min
		 *
		 * @function
		 * @param {Integer}
		 *            the duration in seconds
		 * @return {String} a String representation for the duration
		 * @public
		 */
		var get_duration_as_string = function(duration) {
			var sec = duration % 60;
			var min = (duration - sec) / 60;

			var hour = 0;
			if (min > 59) {
				min = min % 60;
				hour = ((duration - (min * 60)) - sec) / 3600;
			}
			if (sec < 10) {
				sec = "0" + sec;
			}
			if (min < 10) {
				min = "0" + min;
			}

			if (hour > 0) {
				return hour + ":" + min + ":" + sec + " h";
			}
			else {
				return min + ":" + sec + " min";
			}

		};
		compatibilitySelf.get_duration_as_string = get_duration_as_string;

		// ////////////////////////////////////////////////////////////////////////////
		// comp: make renamed functions available under their old name again:

		compatibilitySelf.html_comment_regex = compatibilitySelf.regexHTMLComment;
		compatibilitySelf.html_resize_font_to_fit_surrounding_box = compatibilitySelf.resizeFitToSourroundingBox;
		compatibilitySelf.to_json_string_value = compatibilitySelf.toJSONStringValue;
		compatibilitySelf.convert_to_json_value_HTML_string = compatibilitySelf.convertJSONStringValueToHTML;
		compatibilitySelf.convert_json_to_HTML_string = compatibilitySelf.convertJSONStringToHTML;
		compatibilitySelf.get_params_as_dict = compatibilitySelf.parseParamsToDictionary;

    };// END: setToCompatibilityModeExtension

});
