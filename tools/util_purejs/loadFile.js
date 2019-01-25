/*
 * MIT license
 * Copyright (C) 2017 by DFKI GmbH
 *
 * simplified/modified from (2017, MIT license)
 * https://github.com/ForbesLindesay/ajax
 *
 * Modifications:
 *  * removed dataTypes other than 'text', 'json', 'xml'
 *  * removed exported functions, i.e. .get, .post etc., except for .ajax
 *  * removed global AJAX events
 *  * removed settings.data processing (e.g. serializing, appending to GET URL...)
 *  * removed beforeSend & complete callbacks, and timeout option/setting
 *  * use XHR object as default context for callbacks
 *  * added xhr implementation selection: require("xmlhttprequest") if no global/window object XMLHttpRequest is present (i.e. running in node environment)
 *  * added option-setting localPrefix (string|false) for indicating if 'file:' should be prefixed to local requestes (required by node-module "xmlhttprequest")
 *
 * Additions/Extension (adapted from jQuery.ajax):
 *  * added xhrFields handling (analogous to jQuery.ajax) for ajax options
 *  * correctly read non-text results (w.r.t. xhr.responseType) from response (analogous to jQuery.ajax)
 */

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
 * 	dataType: 'text' | 'json' | 'xml',
 * 	async: true | false,
 * 	success: function(data: STRING | OBJECT),
 * 	error: function(xhr, statusString, error),
 * 	data: SERIALZED_DATA_STRING
 * }
 * </pre>
 *
 * where <code>data</code> must be string in the the <code>SERIALZED_DATA_STRING</code>
 * format, i.e. name-value pairs (with name and value <code>encodeURIComponent()</code>'ed), e.g.
 * <pre>
 * "name1=56&name2=some%20encoded%20value%3F&..."
 * </pre>
 *
 * @requires util/extend
 * @requires window.location
 */
define(['mmirf/util/extend'], function(extend){

var jsonpID = 0,
    key,
    name,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    blankRE = /^\s*$/

var ajax = function(options){
  var settings = extend({}, options || {})
  for (key in ajax.settings) if (settings[key] === undefined) settings[key] = ajax.settings[key]

  if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
    RegExp.$2 != window.location.host

  var dataType = settings.dataType

  if (!settings.url) settings.url = window.location.toString()

  var mime = settings.accepts[dataType],
      baseHeaders = { },
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : typeof window !== 'undefined' && window.location? window.location.protocol : 'file:',
      xhr = ajax.settings.xhr()

  // Apply custom fields if provided (MODIFIED: adapted from jQuery)
  if (settings.xhrFields) for (key in settings.xhrFields) xhr[key] = settings.xhrFields[key];

  if(!settings.context) settings.context = xhr;

  if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
  if (mime) {
    baseHeaders['Accept'] = mime
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
    xhr.overrideMimeType && xhr.overrideMimeType(mime)
  }
  if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
    baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
  settings.headers = extend(baseHeaders, settings.headers || {})

  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      var result, error = false
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
        result = (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? xhr.response : xhr.responseText;// adapted from jQuery: handle non-text (i.e. binary) results

        try {
          if (dataType == 'xml')  result = xhr.responseXML
          else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
        } catch (e) { error = e }

        if (error) ajaxError(error, 'parsererror', xhr, settings)
        else ajaxSuccess(result, xhr, settings)
      } else {
        ajaxError(null, 'error', xhr, settings)
      }
    }
  }

  if (!settings.crossDomain && settings.localPrefix && !/^([\w-]+:)?\/\/([^\/]+)/.test(settings.url)) settings.url = settings.localPrefix + settings.url;//MODIFIED: auto-prefix relative requests

  var async = 'async' in settings ? settings.async : true
  xhr.open(settings.type, settings.url, async)

  for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

  // avoid sending empty string (#319)
  xhr.send(settings.data ? settings.data : null)
  return xhr
}

function ajaxSuccess(data, xhr, settings) {
  var context = settings.context, status = 'success'
  settings.success.call(context, data, status, xhr)
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings) {
  var context = settings.context
  settings.error.call(context, xhr, type, error)
}

// Empty function, used as default callback
function empty() {}

//MODIFIED: detect/load xhr implementation context
var is_xhr_node_impl, xhrImplCtx;
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
	is_xhr_node_impl = false;
	xhrImplCtx = window;
} else {
	is_xhr_node_impl = true;
	xhrImplCtx = require("xmlhttprequest");
}

ajax.settings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // The context for the callbacks
  context: null,
  // Transport
  xhr: function () {
    return new xhrImplCtx.XMLHttpRequest();
  },
  // MIME types mapping
  accepts: {
    json:   jsonType,
    text:   'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  localPrefix: is_xhr_node_impl? 'file:' : false //MODIFIED: auto-prefix relative URLs with 'file:' (needed for node module "xmlhttprequest")
}

function mimeToDataType(mime) {
  return mime && ( mime == jsonType ? 'json' :
    xmlTypeRE.test(mime) && 'xml' ) || 'text'
}

return ajax;

});
