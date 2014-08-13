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


newMediaPlugin = {
		initialize: function(callBack){
			
			var _pluginName = 'nuanceAudioInput';
			
			var languageManager = require('languageManager');
			
			var id = 0;
			var currentSuccessCallback;
			var currentFailureCallback;
			var callbackWrapper = function callbackWrapper (cb){
				return (function (res){
					console.log(res);
					var asr_result = res;
					if (res == 'repeat') {
						window.plugins.nuancePlugin.recognizeNoEOS(
								languageManager.getLanguageConfig(_pluginName),
								callbackWrapper(currentSuccessCallback), 
								currentFailureCallback, 
								true
						);
					} else if(res && res['result'] && res['result']!==''){
						asr_result = res['result'];
						cb(asr_result);			
					}
				});
			};
			
			callBack ({
				startRecord: function(successCallback, failureCallback){
					currentFailureCallback = failureCallback;
					currentSuccessCallback = successCallback;
					window.plugins.nuancePlugin.recognizeNoEOS(
							languageManager.getLanguageConfig(_pluginName),
							callbackWrapper(successCallback), 
							failureCallback, 
							true
					);
				},
				stopRecord: function(successCallback,failureCallback){
					window.plugins.nuancePlugin.stopRecord(
							callbackWrapper(successCallback),
							failureCallback
					);
				},
				recognize: function(successCallback,failureCallback){
					window.plugins.nuancePlugin.recognize(
							languageManager.getLanguageConfig(_pluginName),
							callbackWrapper(successCallback),
							failureCallback
					);
				},
    			cancelRecognition: function(successCallBack,failureCallBack){
    				//FIXME currently, NuancePlugin returns failure on successful cancel-performance, so we call the function with switched failure, success arguments...
    				//			-> switch back, when NuancePlugin returns PluginResults correctly... 
    				window.plugins.nuancePlugin.cancel(failureCallBack, successCallBack);
    			}
			});
		    		
		    		
		}
		
};