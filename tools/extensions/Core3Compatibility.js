define(['mmirf/semanticInterpreterCompatibility',
    'mmirf/configurationManager','mmirf/controllerManager','mmirf/presentationManager','mmirf/dialogManager','mmirf/dialogEngine',
    'mmirf/inputManager','mmirf/inputEngine','mmirf/commonUtils','mmirf/languageManager','mmirf/mediaManager','mmirf/presentationManager',
    'mmirf/semanticInterpreter','mmirf/modelManager','mmirf/constants','mmirf/notificationManager','mmirf/grammarConverter'
], 
	/**
     * Set to "backwards compatibility mode" (for pre version 4.0) for module names and method names.
     * 
	 * This function adds old names/synonyms for modules names (on <code>mmir</code> object/namespace):
     * <ul>
     * 	<li> {@link mmir.CommonUtils} as
     *          <b><u>mmir.util</u></b>
     *  </li><li> {@link mmir.ConfigurationManager} as
     *          <b><u>mmir.conf</u></b>
     *  </li><li> {@link mmir.ControllerManager} as
     *          <b><u>mmir.ctrl</u></b>
     *  </li><li> {@link mmir.Constants } as
     *          <b><u>mmir.const</u></b>
     *  </li><li> {@link mmir.DialogManager} as
     *          <b><u>mmir.dialog</u></b>
     *  </li><li> {@link mmir.InputManager } as
     *          <b><u>mmir.input</u></b>
     *  </li><li> {@link mmir.LanguageManager} as
     *          <b><u>mmir.lang</u></b>
     *  </li><li> {@link mmir.MediaManager} as
     *          <b><u>mmir.media</u></b>
     *  </li><li> {@link mmir.ModelManager} as
     *          <b><u>mmir.model</u></b>
     *  </li><li> {@link mmir.NotificationManager} as
     *          <b><u>mmir.notifier</u></b>
     *  </li><li> {@link mmir.PresentationManager} as
     *          <b><u>mmir.presentation</u></b>
     *  </li><li> {@link mmir.SemanticInterpreter} as
     *          <b><u>mmir.semantic</u></b>
     *  </li>
     * </ul>
     * 
     * In addition, old method names will be added as synonyms:
     * <ul>
     * 	 <li> {@link mmir.ConfigurationManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ConfigurationManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ControllerManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ControllerManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ControllerManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ControllerManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.DialogManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.DialogManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.InputManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.InputManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.LanguageManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.LanguageManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ModelManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ModelManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ModelManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ModelManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ModelManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ModelManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ModelManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ModelManager}</li>
     * 		</ul>
     *  </li>
     *  <li> {@link mmir.NotificationManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.NotificationManager}</li>
     * 		</ul>
     *  </li>
     *  <li> {@link mmir.PresentationManager}
     * 		<ul>
     * 			<li><b><u>renderView</u></b> for {@link mmir.PresentationManager#render}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.PresentationManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.SemanticInterpreter}
     * 		<ul>
     * 			<li><b><u>getASRSemantic</u></b> for {@link mmir.SemanticInterpreter#interpret}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.SemanticInterpreter}</li>
     * 		</ul>
     *  </li>
     * </ul>
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
	 * 
	 * @class
	 * @name mmir.Core.setToCompatibilityModeExtension
	 * @static
	 * 
	 * @requires SemanticInterpreterCompatibility
	 * 
	 * @example
	 * require(['mmirf/core3Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * @public
	 */
	function(semanticInterpreterCompatibility,
		configurationManager, controllerManager, presentationManager, dialogManager, dialogEngine,
		inputManager, inputEngine, commonUtils, languageManager, mediaManager, presentationManager,
		semanticInterpreter, modelManager, constants, notificationManager, GrammarConverter){

	/**
     * Set to "backwards compatibility mode" (for pre version 4.0).
     * 
     * This function re-adds deprecated and removed functions and
     * properties to the (core) mmir namespace.
     * 
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     * 
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
     * @constructs mmir.Core.setToCompatibilityModeExtension
     */
    return setToCompatibilityMode = function(mmir) {
    	
    	mmir.ConfigurationManager = configurationManager;
    	mmir.ControllerManager = controllerManager;
    	mmir.PresentationManager = presentationManager;
    	mmir.DialogManager = dialogManager;
    	mmir.DialogEngine = dialogEngine;
    	mmir.InputManager = inputManager;
    	mmir.InputEngine = inputEngine;
    	mmir.CommonUtils = commonUtils;
    	mmir.LanguageManager = languageManager;
    	mmir.MediaManager = mediaManager;
    	mmir.SemanticInterpreter = semanticInterpreter;
    	mmir.ModelManager = modelManager;
    	mmir.Constants = constants;
    	mmir.NotificationManager = notificationManager;
    	
//    	mediaManager.textToSpech = mediaManager.tts;
//    	mediaManager.setTextToSpeechVolume = mediaManager.ttsVolume;
    	
    	presentationManager.renderView = presentationManager.render;
    	semanticInterpreter.getASRSemantic = semanticInterpreter.interpret;
    	controllerManager.getController = controllerManager.get;
    	controllerManager.getControllerNames = controllerManager.getNames;
    	modelManager.getModel = modelManager.get;
    	modelManager.getModels = modelManager.getNames;
    	
    	var getInstance = function(){return this;};
    	controllerManager.getInstance = getInstance;
    	dialogManager.getInstance = getInstance;
    	inputManager.getInstance = getInstance;
    	languageManager.getInstance = function(lang){
    		if(lang) {
    			setLanguage(lang);
    		}
    		
    		return this;
    	};
    	mediaManager.getInstance = function(){
            return this.init(null, null);
        };
        modelManager.getInstance = getInstance;
        notificationManager.getInstance = getInstance;
        presentationManager.getInstance = getInstance;
        
        configurationManager = getLanguage = function(){ return languageManager.getLanguage(); };
        configurationManager.setLanguage = function(lang){ languageManager.setLanguage(lang); };
    };
    
});
