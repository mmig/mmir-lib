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
			
			var _pluginName = 'androidTextToSpeech';
			
			var languageManager = require('languageManager');
			var commonUtils = require('commonUtils');
			
			var language;
			
			window.plugins.androidTtsPlugin.startup(
				
				function(data){
					
					console.info('AndroidTTS.js.startup: success -> '+JSON.stringify(data));
					
					language = languageManager.getLanguageConfig(_pluginName);
					//TODO get & set voice (API in plugin is missing for that ... currently...)
					//var voice = languageManager.getLanguageConfig(_pluginName, 'voice');
					
					window.plugins.androidTtsPlugin.setLanguage(
							language,
						function(data){
							console.info('AndroidTTS.js.setLanguage('+language+'): success -> '+JSON.stringify(data));
						}, function(e){
							console.info('AndroidTTS.js.setLanguage('+language+'): error -> '+JSON.stringify(e));
							language = void(0);
						}
					);
					
				}, function(e){
					console.info('AndroidTTS.js.startup: error -> '+JSON.stringify(e));
				}
			);
			//TODO destructor: register onpause/exit handler that shuts down the TTS engine
			
			callBack({
				    textToSpeech: function (parameter, successCallBack, failureCallBack, startCallBack){
				    	
				    	var text;
			    		if((typeof parameter !== 'undefined') && commonUtils.isArray(parameter) ){
			    			//TODO implement pausing similar to maryTextToSpeech.js (i.e. in JS code); use XML?
			    			
			    			text = parameter.join('\n');//FIXME may need 2 newlines here: in some cases the Nuance TTS does not make pause, when there is only 1 newline (why?!?...)
			    			
			    		}
			    		else {
			    			//FIXME implement evaluation / handling the parameter similar to treatment in maryTextToSpeech.js
			    			text = parameter;
			    		}
			    		
				    	try{
				    		var currentLanguage = languageManager.getLanguageConfig(_pluginName);
				    		currentLanguage = currentLanguage !== language? currentLanguage : void(0);
				    		
			    			window.plugins.androidTtsPlugin.speak(
					    			text, 
					    			successCallBack, 
					    			failureCallBack,
					    			currentLanguage
					    	);
					    	//TODO implement real start-callback (needs to be done within java-/javascript-plugin)
					    	if(startCallBack){
					    		startCallBack();
					    	}
				    		
				    	} catch(e){
				    		if(failureCallBack){
				    			failureCallBack(e);
				    		}
				    	}
				    	
				    },
	    			cancelSpeech: function(successCallBack,failureCallBack){
	    				
				    	window.plugins.androidTtsPlugin.cancel(
				    			successCallBack, 
				    			failureCallBack
				    	);
				    	
	    			}
				});	
		}
};