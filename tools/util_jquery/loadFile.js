
/**
 * Simplified jQuery-like AJAX interface for loading text/JSON files.
 *
 * Supported interface:
 * <pre>
 * loadFile(options)
 * </pre>
 *
 * where options:
 * <pre>
 * {
 * 	url: STRING,
 * 	dataType: 'text' | 'json',
 * 	async: true | false,
 * 	success: function(data: STRING | OBJECT),
 * 	error: function(xhr, statusString, error)
 * }
 * </pre>
 *
 * @requires jQuery
 */
define(['jquery'], function(jQuery){
	return jQuery.ajax;
});
