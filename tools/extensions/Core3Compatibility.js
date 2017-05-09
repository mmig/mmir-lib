define(
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
     *          <b><u>mmir.notif</u></b>
     *  </li><li> {@link mmir.PresentationManager} as
     *          <b><u>mmir.present</u></b>
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
	 * @example
	 * require(['core3Compatibility'], function(setCompatibility){
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * @public
	 */
	function(){

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
    	
    	mmir.ConfigurationManager = mmir.conf;
    	mmir.ControllerManager = mmir.ctrl;
    	mmir.PresentationManager = mmir.present;
    	mmir.DialogManager = mmir.dialog;
    	mmir.DialogEngine = mmir.dialogEngine;
    	mmir.InputManager = mmir.input;
    	mmir.InputEngine = mmir.inputEngine;
    	mmir.CommonUtils = mmir.util;
    	mmir.LanguageManager = mmir.lang;
    	mmir.MediaManager = mmir.media;
    	mmir.PresentationManager = mmir.present;
    	mmir.SemanticInterpreter = mmir.semantic;
    	mmir.ModelManager = mmir.model;
    	mmir.Constants = mmir.const;
    	mmir.NotificationManager = mmir.notify
    	
    	
//    	mmir.media.textToSpech = mmir.media.tts;
//    	mmir.media.setTextToSpeechVolume = mmir.media.ttsVolume;
    	
    	mmir.present.renderView = mmir.present.render;
    	mmir.semantic.getASRSemantic = mmir.semantic.interpret;
    	mmir.ctrl.getController = mmir.ctrl.get;
    	mmir.ctrl.getControllerNames = mmir.ctrl.getNames;
    	mmir.model.getModel = mmir.model.get;
    	mmir.model.getModels = mmir.model.getNames;
    	
    	var getInstance = function(){return this;};
    	mmir.conf.getInstance = getInstance;
    	mmir.ctrl.getInstance = getInstance;
    	mmir.dialog.getInstance = getInstance;
    	mmir.input.getInstance = getInstance;
    	mmir.lang.getInstance = function(lang){
    		if(lang) {
    			setLanguage(lang);
    		}
    		
    		return this;
    	};
    	mmir.media.getInstance = function(){
            return this.init(null, null);
        };
        mmir.model.getInstance = getInstance;
        mmir.notify.getInstance = getInstance;
        mmir.present.getInstance = getInstance;
        mmir.semantic.getInstance = getInstance;
    };
    
});
