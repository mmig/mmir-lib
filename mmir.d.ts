
/**
 * export global variable mmir
 *
 * @type MmirModule
 */
export as namespace mmir;

////////////////////// namespace / module definition (type MmirModule) /////////////////////////////////

// interface MmirCore:
// export function applyConfig (mainConfig: {}) : void;//DISABLED: "officially" this function has visibility protected
// export function setInitialized: () : void;//DISABLED: "officially" this function has visibility protected
export function config(requirejsConfig: {}): void;
export function ready(onFrameworkReady: (...args: any[]) => any): any;
export function isVersion(verion: string, comparator: Comparator): boolean;
export const require: RequireJs;
export const version: string;
//NOTE changing exported var_s only has effect, if done before initialization
export var startModule: string;//DEFAULT: 'main';
export var viewEngine: string;//DEFAULT: "jqViewEngine";
export var debug: boolean;//DEFAULT: true;
export var logLevel: LogLevelNum | LogLevel;//DEFAULT: 'debug';
export var logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true

// interface MmirModule:
export const util: CommonUtils;
export const conf: ConfigurationManager;
export const res: Resources;
export const ctrl: ControllerManager;
export const dialogEngine: DialogEngine;
export const dialog: DialogManager;
export const inputEngine: InputEngine;
export const input: InputManager;
export const lang: LanguageManager;
export const media: MediaManager;
export const model: ModelManager;
export const notifier: NotificationManager;
export const present: PresentationManager;
export const semantic: SemanticInterpreter;

////////////////////// end of namespace / module definition /////////////////////////////////

export interface MmirCore {
  // applyConfig: (mainConfig: {}) => void;//DISABLED: "officially" this function has visibility protected
  // setInitialized: () => void;//DISABLED: "officially" this function has visibility protected
  config: (requirejsConfig: {}) => void;
  ready: (onFrameworkReady: (...args: any[]) => any) => any;
  isVersion(verion: string, comparator: Comparator): boolean;
  readonly require: RequireJs;
  readonly version: string;
  startModule: string;//DEFAULT: 'main';
  viewEngine: string;//DEFAULT: "jqViewEngine";
  debug: boolean;//DEFAULT: true;
  logLevel: LogLevelNum | LogLevel;//DEFAULT: 'debug';
  logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
}

export interface MmirModule extends MmirCore {
  readonly util: CommonUtils;
  readonly conf: ConfigurationManager;
  readonly res: Resources;
  readonly ctrl: ControllerManager;
  readonly dialogEngine: DialogEngine;
  readonly dialog: DialogManager;
  readonly inputEngine: InputEngine;
  readonly input: InputManager;
  readonly lang: LanguageManager;
  readonly media: MediaManager;
  readonly model: ModelManager;
  readonly notifier: NotificationManager;
  readonly present: PresentationManager;
  readonly semantic: SemanticInterpreter;
}

export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';
export type LogLevelNum =   0    |    1    |   2    |   3    |   4     |      5     |     6;

export type Comparator = '>=' | '<=' | '>' | '<' | '!=' | '!==' | '=' | '==' | '===';

/**
 * interface definition for JSON grammar
 */
export interface Grammar {

  example_phrase?: string;

  stop_word: Array<string>;

  tokens: { [id: string]: Array<string> };

  utterances: { [id: string]: { 'phrases': Array<string>, 'semantic': any } };

}

export interface Positions {
  str: string;
  pos: Array<Pos>;
}

export interface GrammarConverter {

  loadGrammar: (successCallback: ()=> any, errorCallback: ()=> any, grammarUrl: string, doLoadSynchronously?: boolean) => void;
  loadResource: (successCallback: ()=> any, errorCallback: ()=> any, resourceUrl: string, doLoadSynchronously?: boolean) => void;
  setStopWords: (stopWordArray: Array<string>) => void;
  getStopWords: () => Array<string>;
  getEncodedStopwords: () => Array<string>;
  parseStopWords: () => void;
  getStopWordsRegExpr: () => RegExp;
  getStopWordsEncRegExpr: () => RegExp;
  getGrammarDef: () => string;
  setGrammarDef: (rawGrammarSyntax: string) => void;
  getGrammarSource: () => string;
  setGrammarSource: (src_code: string) => void;

  setGrammarFunction: (execGrammarFunc: (text: string, callback?: (semanticResult: {}) => void) => void, isAsync?: boolean) => void;

  isAsyncExec: () => boolean;

  preproc(thePhrase: string, pos?: {stopwords: Array<Pos>}, maskFunc?: (inputStr : string, isCalcPosition?: boolean) => string | Positions, stopwordFunc?: (inputStr : string, pos?: Array<Pos>) => string | Positions): string;
  postproc(procResult: any, recodeFunc?: (inputStr : string, ...args: any[]) => string): any;

  executeGrammar: (text: string, callback?: (semanticResult: {}) => void) => void;

  maskString:  (str: string, computePositions?: boolean, prefix?: string, postfix?: string) => string | Positions;
  maskAsUnicode:  (str: string) => string;
  unmaskString:  (str: string, computePositions?: boolean, detector?: RegExp) => string | Positions;

  unmaskJSON:  (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any;
  recodeJSON: (json: any, recodeFunc:(str:string)=>string, isMaskValues?: boolean, isMaskNames?: boolean) => any;

  //semi-private fileds
  variable_prefix: string;
  variable_regexp: RegExp;

  entry_token_field: string;
  entry_index_field: string;
  enc_regexp_str: string;

  jscc_grammar_definition: string;
  js_grammar_definition: string;
  json_grammar_definition: Grammar;
  stop_words_regexp: RegExp;

  maskValues: boolean;
  maskNames: boolean;
  convertOldFormat: boolean;
}

export interface EncodeUtils {
  encodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};
  decodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};
}

export interface Pos {
  //index
  i: number;
  //original word length (i.e. before modification)
  len: number;
  //modified word legnth (i.e. after modification)
  mlen?: number;
}

export interface SemanticInterpreter {

  interpret: (phrase: string, langCode?: string, callback?: (semanticResult: any) => void) => any;//TODO typ'ing result
  removeStopwords: (thePhrase: string, lang?: string) => string;
  getGrammarDefinitionText: (id: string) => string;
  getGrammarParserText: (id: string) => string;
  getGrammarConverter: (id: string) => GrammarConverter;
  createGrammar: (rawGrammarSrc: string | {}, id: string, callback?: (created?: GrammarConverter) => void) => SemanticInterpreter;
  addGrammar: (id: string, grammarImpl: (text: string, callback?: (semanticResult: {}) => void) => void | GrammarConverter, fileFormatNo?: number) => void;
  setStopwords: (id: string, stopwordArray: Array<string>) => void;
  hasGrammar: (id: string) => boolean;
  removeGrammar: (id: string) => void;
  setCurrentGrammar: (id: string) => void;
  getCurrentGrammar: () => string;
  setEnabled: (isEnabled: boolean) => void;
  isEnabled: () => boolean;
  getGrammarEngine: () => "jscc" | "jison" | "pegjs";//DEFAULT: "jscc"
  setGrammarEngine: (engineId: "jscc" | "jison" | "pegjs", asyncCompileMode?: boolean) => void;
  setEngineCompileMode: (asyncCompileMode: boolean) => void;//DEFAULT: false
  getFileVersion: () => number;

  get_json_grammar_url: (id: string) => string;//NOTE may get removed/renamed
}

//////////////////////////////////////////////////////////// TODO //////////////////////////////////////////////////////

export interface CommonUtils {
  regexHTMLComment: RegExp;
   checkNetworkConnection: () => any;
   concatArray: (array: any) => any;
   getCompiledGrammarPath: (generatedGrammarsPath: any, grammarId: any, isFileNameOnly: any) => any;
   getDirectoryContents: (pathname: any) => any;
   getDirectoryContentsWithFilter: (pathname: any, filter: any) => any;
   getDirectoryStructure: () => any;
   getLocalScript: (scriptUrl: any, success: any, fail: any, ...args: any[]) => void;
   getPartialsPrefix: () => any;
   init: (onsuccess: any, onerror: any) => any;
   isArray: (object: any) => any;
   isRunningOnAndroid: () => any;
   isRunningOnSmartphone: () => any;
   loadCompiledGrammars: (generatedGrammarsPath: string, cbFunction: Function, ignoreGrammarIds?: Array<string>) => any;
   loadDirectoryStructure: (success: any, errorFunc: any) => any;
   loadImpl: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any;
   loadScript: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any;
   parseParamsToDictionary: (urlParamsPartStrings: any) => any;
   resizeFitToSourroundingBox: (class_name: any) => void;
   stripPathName: (pathname: any) => any;
}
export interface ConfigurationManager {
    get: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => any;
    getBoolean: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => boolean;
    getString: (propertyName: string, defaultValue?: any, useSafeAccess?: boolean) => string;
    set: (propertyName: string, value: any) => void;
}
export interface Resources {
    getBasePath: () => string;
    getBeepUrl: () => string;
    getCompiledLayoutPath: () => string;
    getCompiledViewPath: () => string;
    getConfigurationFileUrl: () => string;
    getControllerPath: () => string;
    getDictionaryFileUrl: (langCode?: string) => string;
    getDirectoriesFileUrl: () => string;
    getEnv: () => any;
    getEnvPlatform: () => any;
    getExtensionsPath: () => string;
    getGeneratedGrammarsPath: () => string;
    getGrammarFileUrl: (langCode?: string) => string;
    getGrammarPluginPath: () => string;
    getHelperPath: () => string;
    getHelperSuffix: () => string;
    getLanguage: () => string;
    getLanguagePath: () => string;
    getLayoutPath: () => string;
    getMediaPluginPath: () => string;
    getModelPath: () => string;
    getPartialsPrefix: () => string;
    getSpeechConfigFileUrl: (langCode?: string) => string;
    getViewPath: () => string;
    getWorkerPath: () => string;
    init: (theForBrowserParameter: any) => any;
    isBrowserEnv: () => boolean;
    isCordovaEnv: () => boolean;
}
export interface ControllerManager {
    create: () => any;
    get: (ctrlName: string) => Controller | undefined;
    getNames: () => Array<string>;
    init: (callback: any, ctx: any) => any;
    perform: (ctrlName: string, actionName: string, data?: any) => any;
    performHelper: (ctrlName: string, actionName: string, data?: any) => any;
}
export interface DialogEngine {
    doc: string;
    name: string;
    url: string;
    getActiveEvents: () => any;
    getActiveStates: () => any;
    getActiveTransitions: () => any;
    getEvents: () => any;
    getStates: () => any;
    getTransitions: () => any;
    ignoreScript: () => void;
    load: (...args: any[]) => any;
    onload: (scion: any, deferred: any) => void;
    onraise: () => void;
    raise: (event: any, eventData: any) => void;
    start: () => void;
}
export interface DialogManager {
    getOnPageRenderedHandler: () => Function | undefined;
    hideCurrentDialog: () => void;
    hideWaitDialog: () => void;
    perform: (ctrlName: any, actionName: any, data?: any) => any;
    performHelper: (ctrlName: any, helper_method_name: any, data?: any) => any;
    raise: (eventName: string, data?: any) => void;
    render: (ctrlName: any, viewName: any, data?: any) => void;
    setOnPageRenderedHandler: (onPageRenderedHook: Function) => void;
    showDialog: (ctrlName: any, dialogId: any, data?: any) => void;
    showWaitDialog: (text: any, theme: any) => void;
}
export interface InputEngine {
    doc: string;
    name: string;
    url: string;
    getActiveEvents: () => any;
    getActiveStates: () => any;
    getActiveTransitions: () => any;
    getEvents: () => any;
    getStates: () => any;
    getTransitions: () => any;
    ignoreScript: () => void;
    load: (...args: any[]) => any;
    onload: (scion: any, deferred: any) => void;
    onraise: () => void;
    raise: (event: any, eventData: any) => void;
    start: () => void;
}
export interface InputManager {
    raise: (eventName: string, data?: any) => void;
}
export type GrammarType = 'source' | 'bin';
export interface LanguageManager {
    determineLanguage: (lang: string) => string;
    existsDictionary: (lang: string) => boolean;
    existsGrammar: (lang: string, grammarType?: GrammarType) => boolean;
    existsSpeechConfig: (lang: string) => boolean;
    fixLang: (providerName: string, langCode: string) => string;
    getDefaultLanguage: () => string;
    getDictionary: () => {[id:string]: string};
    getLanguage: () => string;
    getLanguageConfig: (pluginId: string, feature: string, separator?: string) => any;
    getLanguages: () => Array<string>;
    getText: (textVarName: string) => string;
    init: (lang: string) => any;
    setLanguage: (lang: string) => any;
}
export type MediaEventHandler = Function;
export type MediaEventType = string;
export interface MediaManager {
    ctx: {[ctxId: string]: any};
    waitReadyImpl: IWaitReadyImpl;

    init: (successCallback?: Function, failureCallback?: Function, listenerList?: Array<{name: string, listener: Function}>) => any;
    loadFile: (filePath: string, successCallback?: Function, failureCallback?: Function, execId?: string) => void;

    addListener: (eventName: MediaEventType, eventHandler: MediaEventHandler) => void;
    hasListeners: (eventName: MediaEventType) => boolean;
    getListeners: (eventName: MediaEventType) => MediaEventHandler | void;
    removeListener: (eventName: MediaEventType, eventHandler: MediaEventHandler) => boolean;
    off: (eventName: MediaEventType, eventHandler: MediaEventHandler) => boolean;
    on: (eventName: MediaEventType, eventHandler: MediaEventHandler) => void;

    createEmptyAudio: () => IAudio;
    getURLAsAudio: (url: string, onEnd: any, failureCallback: any, successCallback: any, audioObj: IAudio, ...args: any[]) => IAudio;
    getWAVAsAudio: (blob: any, callback: any, onEnd: any, failureCallback: any, onInit: any, emptyAudioObj: IAudio) => IAudio;
    playURL: (url: string, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;
    playWAV: (blob: any, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;

    getFunc: (ctx: string, funcName: string) => any;
    perform: (ctx: string, funcName: string, args?: Array<any>) => any;
    setDefaultCtx: (ctxId: string) => void;

    recognize: (options?: ASROptions, statusCallback?: ASROnStatus, failureCallback?: ASROnError, isIntermediateResults?: boolean) => void;
    startRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError, intermediateResults?: boolean) => void;
    stopRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError) => void;
    cancelRecognition: (successCallback?: Function, failureCallback?: Function) => void;
    getRecognitionLanguages: (successCallBack?: Function, failureCallBack?: Function) => void;

    tts: (options: string | string[] | TTSOptions, successCallback?: TTSOnComplete, failureCallback?: TTSOnError, onInit?: TTSOnReady, ...args: any[]) => void;
    setTextToSpeechVolume: (newValue: number) => void;
    cancelSpeech: (successCallBack?: Function, failureCallBack?: Function) => void;
    getSpeechLanguages: (successCallBack?: Function, failureCallBack?: Function) => void;
    getVoices: (options?: VoiceListOptions, successCallBack?: (voices: Array<string | VoiceDetails>) => void, failureCallBack?: Function) => void;


    // internal / "half public" functions (for use in plugin implementations)
    _fireEvent: (eventName: MediaEventType, args: any[]) => void;

    _addListenerObserver: (eventName: MediaEventType, observerCallback: (actionType: "added" | "removed", eventHandler: MediaEventHandler) => void) => void;
    _removeListenerObserver: (eventName: MediaEventType, observerCallback: (actionType: "added" | "removed", eventHandler: MediaEventHandler) => void) => void;
    _notifyObservers: (eventName: MediaEventType, actionType: "added" | "removed", eventHandler: MediaEventHandler) => void;

    _preparing: (moduleName: string) => void;
    _ready: (moduleName: string) => void;
}

export interface TTSOptions {
		/** text that should be read aloud */
    text: string | string[];
		/** the length of the pauses between sentences (i.e. for String Arrays) in milliseconds */
    pauseDuration?: number;
		/** the language for synthesis (if omitted, the current language setting is used) */
    language?: string;
		/** the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine */
    voice?: string;
		/** the on-playing-completed callback (see arg onPlayedCallback) */
    success?: TTSOnComplete;
		/** the error callback (see arg failureCallback) */
    error?: TTSOnError;
		/** the audio-ready callback (see arg onReadyCallback) */
    ready?: TTSOnReady;
}

export interface ASROptions {
		/** the status-callback (see arg statusCallback) */
    success?: ASROnStatus;
		/** the error callback (see arg failureCallback) */
    error?: ASROnError;
		/** the language for recognition (if omitted, the current language setting is used) */
    language?: string;
		/** set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results) */
    intermediate?: boolean;
		/** set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option) */
    results?: number;
		/** set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option) */
    mode?: ASRMode;
		/** length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option) */
    eosPause?: EOSPause;
		/** disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option) */
    disableImprovedFeedback?: boolean;
}

export interface VoiceListOptions {
	/** if set, the returned voice list will be filtered by the specified language (may also include country-code) */
	language?: string;
	/** if TRUE, the returned list will be comprised of VoiceDetails objects instead of strings  */
	details?: boolean;
}

export interface VoiceDetails {
	/** the name of the voice */
	name: string;
	/** the language (code) of the voice */
	language: string;
	/** the gender of the voice */
	gender: "female" | "male" | "unknown";
}

export type TTSOnComplete = () => void;
export type TTSOnError = (error: string | Error) => void;
export type TTSOnReady = (isReady?: Boolean, audio?: IAudio) => void;

export type ASROnStatus = (text: string | "", confidence: number | undefined, status: ASRStatus, alternatives?: Array<{result: string, score: number}>, unstable?: string) => void;
export type ASRStatus = "FINAL" | "INTERIM" | "INTERMEDIATE" | "RECORDING_BEGIN" | "RECORDING_DONE";
export type ASROnError = (error: string | Error) => void;

export type ASRMode = "search" | "dictation";
export type EOSPause = "short" | "long";


export type MediaPluginType = 'audio' | 'asr' | 'tts' | 'prep' | string;

export type MediaPluginEnvType = 'browser' | 'cordova' | 'android' | 'ios';

export interface MediaManagerPluginEntry {
  mod?: string;
  env?: Array< MediaPluginEnvType | string > | MediaPluginEnvType | string;
  ctx?: string;
	type?: MediaPluginType;
}

export interface SimpleSpeechConfig {
	/** local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US" */
	language?: string;
	/** local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA" */
	long?: string;
	/** voice name or feature (may not be supported by selected TTS plugin) */
	voice?: 'male' | 'female' | string;
}

export interface SpeechConfig extends SimpleSpeechConfig {
	language: string;
	/**
	 * voice  feature (may not be supported by selected TTS plugin)
	 *
	 * NOTE the root SpeechConfig should not have a specific voice-name, but
	 *      only a feature specified (since it is very unlikely that all plugins
	 *      support the same voice-name)
	 */
	voice?: 'male' | 'female';
	/**
	 * specific plugin speech-configurations that override the general
	 * configuration settings
	 */
	plugins: {[pluginId: string]: SpeechConfigPluginEntry};
}

export interface SpeechConfigPluginEntry extends SimpleSpeechConfig {}

export interface IAudio {
	_constructor: (url: string, onPlayedCallback: TTSOnComplete, failureCallBack: TTSOnError, onLoadedCallBack: TTSOnReady) => IAudio;
	play:  () => void;
	stop:  () => void;
	enable: () => void;
	disable: () => void;
	release: () => void;
	setVolume:  (volume: number) => void;
	getDuration: () => number;
	isPaused: () => boolean;
	isEnabled: () => boolean;
}

export interface IWaitReadyImpl {
  preparing: (moduleName: string) => void;
  ready: (moduleName: string) => void;
}

export interface MicLevelsAnalysis {
    active: (active: any) => any;
    enabled: (enable: any) => any;
    start: (audioInputData: any) => void;
    stop: () => void;
}
export interface ModelManager {
    get: (modelName: string) => any;
    getNames: () => Array<string>;
    init: () => any;
}
export interface NotificationManager {
    alert: (message: string, alertCallback: Function, title: string, buttonName: string) => void;
    confirm: (message: string, confirmCallback: Function, title: string, buttonLabels: string[]) => void;
    beep: (times: number) => void;
    createSound: (name: string, url: string, isKeepOnPause: boolean) => void;
    getVolume: () => number;
    init: () => any;
    initBeep: () => void;
    initSound: (name: string) => void;
    isVibrateAvailable: () => boolean;
    isVibrateEnabled: () => boolean;
    playSound: (name: string, times: number, onFinished: Function, onError: Function) => void;
    setVibrateEnabled: (enabled: boolean) => void;
    setVolume: (vol: number) => void;
    stopSound: (name: string) => void;
    vibrate: (milliseconds: number) => void;
}
export interface PresentationManager {
    pageIndex: number;
    addLayout: (layout: Layout) => void;
    addPartial: (ctrlName: string, partial: Partial) => void;
    addView: (ctrlName: string, view: View) => void;
    callRenderEngine: (funcName: string, args: Array<any>) => any;
    getLayout: (layoutName: string, doUseDefaultIfMissing: boolean) => any;
    getPartial: (controllerName: string, partialName: string) => any;
    getView: (controllerName: string, viewName: string) => any;
    hideCurrentDialog: (...args: any[]) => void;
    hideWaitDialog: (...args: any[]) => void;
    render: (ctrlName: string, viewName: string, data?: any) => void;
    setRenderEngine: (theRenderEngine: RenderEngine) => void;
    showDialog: (ctrlName: string, dialogId: string, data?: any, ...args: any[]) => any;
    showWaitDialog: (text: string, data: any, ...args: any[]) => void;
}
export interface RequireJs extends Function {
    isBrowser: boolean;
    defined: (id: any) => any;
    specified: (id: any) => any;
    toUrl: (moduleNamePlusExt: any) => any;
    undef: (id: any) => void;
    config: (configuration: any) => void;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface RenderEngine {
    hideCurrentDialog(): void;
    hideWaitDialog(): void;
    render(ctrlName: string, viewName: string, view: View, ctrl: Controller, data?: any): void;
    showDialog(ctrlName: string, dialogId?: string, data?: any): void;
    showWaitDialog(text?: string, theme?: string): void;
}

export declare class Layout {
    constructor(name: string, definition: string, remote?: boolean, ignoreMissingBody?: boolean);

    getBodyContents(): string;
    getDialogsContents(): string;
    getHeaderContents(): string;

    getName(): string;
    getYields(): Array<YieldDeclaration>;
    stringify(): string;

    //static TagElement(tag: any, content: any, tagType: any): any;
    //static getTagAttr(str: any, target: any): any;
}

export declare class YieldDeclaration {
    constructor(parsingElement: ParsingResult, contentAreaType: any);

    getName(): string;
    getNameType(): number;

    getAreaType(): number;
    getEnd(): number;
    getStart(): number;

    getValue(rawPropertyValue: any, proptertyType: any, data: any): any;
    stringify(): string;
}

export declare class View {
    constructor(ctrl: any, name: string, definition: string);

    getContentElement(name: string): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export declare class Partial {
    constructor(ctrl: Controller, name: string, definition: string);

    getContentElement(): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export declare class ContentElement {
    constructor(group: ParsingResult|Array<string>|{name: string, content: string, offset?: number, parent?: ContentElement}, view: View, parser: any, renderer: any, ...args: any[]);

    getController(): Controller;

    getDefinition(): string;

    getEnd(): number;

    getName(): string;

    getOffset(): number;

    getRawText(): string;

    getStart(): number;

    getView(): View;

    hasDynamicContent(): boolean;

    stringify(): string;

    toHtml(): string;

    toStrings(renderingBuffer?: Array<string>, data?: any): any;

}

export declare class ParsingResult {
    constructor(thetokens: any);

    getCallDataEnd(): number;

    getCallDataStart(): number;

    getCallDataType(): string;

    getEnd(): number;

    getStart(): number;

    getType(): number;

    getTypeName(): string;

    getValue(rawPropertyValue: any, proptertyType: any, data: any): any;

    hasCallData(): boolean;

    hasElse(): boolean;

    hasVarReferences(): boolean;

    isElse(): boolean;

    isEscape(): boolean;

    isEscapeEnter(): boolean;

    isEscapeExit(): boolean;

    isFor(): boolean;

    isHelper(): boolean;

    isIf(): boolean;

    isLocalize(): boolean;

    isRender(): boolean;

    isScriptBlock(): boolean;

    isScriptStatement(): boolean;

    isScriptTag(): boolean;

    isStyleTag(): boolean;

    isYield(): boolean;

    isYieldContent(): boolean;

    setEndFrom(thetokens: any): void;

    setStartFrom(thetokens: any): void;

    stringify(): string;

}

export type FileInfo = {name: string, path: string, genPath: string};

export declare class Helper {
    constructor(ctrl: string, name: string, instanceConstr: Function);
    perform(actionName: string, data?: any, ...args: any[]): any;
}

export declare class Controller {
    constructor(name: any, jsonDef: any, instanceConstr: Function);

    getName(): string;

    getHelper(): Helper;

    getLayoutName(): string;
    getPartialNames(): Array<string>;
    getViewNames(): Array<string>;

    perform(actionName: string, data: any, ...args: any[]): any;
    performHelper(actionName: string, data: any, ...args: any[]): any;
    performIfPresent(actionName: string, data: any, ...args: any[]): any;

    getPartials(): Array<FileInfo>;
    getViews(): Array<FileInfo>;
    getLayout(): FileInfo;
    parsePartials(partialDefs: Array<FileInfo>): void;
    parseViews(viewDefs: Array<FileInfo>): void;
    loadHelper(name: string, helperPath: string, ctx: any): void;

}
