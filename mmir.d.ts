
/**
 * export global variable mmir
 */
export as namespace mmir;

/**
 * interface definition for JSON grammar
 */
export interface Grammar {

  example_phrase?: string;

  stop_word: Array<string>;

  tokens: { [id: string]: Array<string> };

  utterances: { [id: string]: { 'phrases': Array<string>, 'semantic': any } };

}

export interface MmirCore {
  // applyConfig: (mainConfig: {}) => void;//DISABLED: "officially" this function has visibility protected
  // setInitialized: () => void;//DISABLED: "officially" this function has visibility protected
  config: (requirejsConfig: {}) => void;
  ready: (onFrameworkReady: (...args: any[]) => any) => any;
  require: RequireJs;
  startModule: string;//DEFAULT: 'main';
  viewEngine: string;//DEFAULT: "jqViewEngine";
  debug: boolean;//DEFAULT: true;
  logLevel: number | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';//DEFAULT: 'debug';
  logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
}

export interface MmirModule extends MmirCore {
  CommonUtils: CommonUtils;
  ConfigurationManager: ConfigurationManager;
  Constants: Constants;
  ControllerManager: ControllerManager;
  DialogEngine: DialogEngine;
  DialogManager: DialogManager;
  InputEngine: InputEngine;
  InputManager: InputManager;
  LanguageManager: LanguageManager;
  MediaManager: MediaManager;
  ModelManager: ModelManager;
  NotificationManager: NotificationManager;
  PresentationManager: PresentationManager;
  SemanticInterpreter: SemanticInterpreter;
}

//mmir core module:
export function config(requirejsConfig: {}): void;
export function ready(onFrameworkReady: (...args: any[]) => any): any;
export var require: RequireJs;
export var startModule: string;//DEFAULT: 'main';
export var viewEngine: string;//DEFAULT: "jqViewEngine";
export var debug: boolean;//DEFAULT: true;
export var logLevel: number | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';//DEFAULT: 'debug';
export var logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true

//mmir module (extending core module)
export var CommonUtils: CommonUtils;
export var ConfigurationManager: ConfigurationManager;
export var Constants: Constants;
export var ControllerManager: ControllerManager;
export var DialogEngine: DialogEngine;
export var DialogManager: DialogManager;
export var InputEngine: InputEngine;
export var InputManager: InputManager;
export var LanguageManager: LanguageManager;
export var MediaManager: MediaManager;
export var ModelManager: ModelManager;
export var NotificationManager: NotificationManager;
export var PresentationManager: PresentationManager;
export var SemanticInterpreter: SemanticInterpreter;

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

  executeGrammar: (text: string, callback?: (semanticResult: {}) => void) => void;

  maskString:  (str: string, prefix?: string, postfix?: string) => string;
  maskAsUnicode:  (str: string) => string;
  unmaskString:  (str: string, detector?: RegExp) => string;

  unmaskJSON:  (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any;
  recodeJSON: (json: any, recodeFunc:(str:string)=>string, isMaskValues?: boolean, isMaskNames?: boolean) => any;

  encodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};

  decodeUmlauts: (target: string | {}, doAlsoEncodeUpperCase?: boolean) => string | {};

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

export interface SemanticInterpreter {

  getASRSemantic: (phrase: string, langCode?: string, callback?: (semanticResult: any) => void) => any;//TODO typ'ing result
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
   loadAllCordovaPlugins: (pluginsPath: any, cbFunction: any) => any;
   loadCompiledGrammars: (generatedGrammarsPath: any, cbFunction: any, ignoreGrammarIds: any) => any;
   loadDirectoryStructure: (success: any, errorFunc: any) => any;
   loadImpl: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any;
   loadScript: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any;
   parseParamsToDictionary: (urlParamsPartStrings: any) => any;
   resizeFitToSourroundingBox: (class_name: any) => void;
   setToCompatibilityMode: (success: any) => any;
   stripPathName: (pathname: any) => any;
}
export interface ConfigurationManager {
    get: (propertyName: string, useSafeAccess?: boolean, defaultValue?: any) => any;
    getBoolean: (propertyName: string, useSafeAccess?: boolean, defaultValue?: any) => any;
    getLanguage: () => string;
    getString: (propertyName: string, useSafeAccess?: boolean, defaultValue?: any) => any;
    set: (propertyName: string, value: any) => void;
    setLanguage: (lang: string) => void;
}
export interface Constants {
    getBasePath: () => string;
    getBeepUrl: () => string;
    getCompiledLayoutPath: () => string;
    getCompiledViewPath: () => string;
    getConfigurationFileUrl: () => string;
    getControllerPath: () => string;
    getDictionaryFileName: () => string;
    getDirectoriesFileUrl: () => string;
    getEnv: () => any;
    getEnvPlatform: () => any;
    getExtensionsPath: () => string;
    getGeneratedGrammarsPath: () => string;
    getGrammarFileName: () => string;
    getGrammarPluginPath: () => string;
    getHelperPath: () => string;
    getHelperSuffix: () => string;
    getLanguage: () => string;
    getLanguagePath: () => string;
    getLayoutPath: () => string;
    getMediaPluginPath: () => string;
    getModelPath: () => string;
    getPartialsPrefix: () => string;
    getPluginsPath: () => string;
    getSpeechConfigFileName: () => string;
    getViewPath: () => string;
    getWorkerPath: () => string;
    init: (theForBrowserParameter: any) => any;
    isBrowserEnv: () => boolean;
}
export interface ControllerManager {
    create: () => any;
    getController: (ctrlName: string) => any;
    getControllerNames: () => Array<string>;
    init: (callback: any, ctx: any) => any;
    perform: (ctrlName: string, actionName: string, data: any) => any;
    performHelper: (ctrlName: string, actionName: string, data: any, ...args: any[]) => any;
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
    getOnPageRenderedHandler: () => any;
    hideCurrentDialog: (...args: any[]) => void;
    hideWaitDialog: (...args: any[]) => void;
    perform: (ctrlName: any, actionName: any, data: any) => any;
    performHelper: (ctrlName: any, helper_method_name: any, data: any, ...args: any[]) => any;
    raise: (...args: any[]) => void;
    render: (ctrlName: any, viewName: any, data: any) => void;
    setOnPageRenderedHandler: (onPageRenderedHook: any) => void;
    showDialog: (ctrlName: any, dialogId: any, data: any, ...args: any[]) => void;
    showWaitDialog: (text: any, theme: any, ...args: any[]) => void;
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
    raise: (...args: any[]) => void;
}
export interface LanguageManager {
    determineLanguage: (lang: string) => any;
    existsDictionary: (lang: string) => any;
    existsGrammar: (lang: string) => any;
    existsSpeechConfig: (lang: string) => any;
    fixLang: (providerName: any, langCode: any) => any;
    getDefaultLanguage: () => string;
    getDictionary: () => {[id:string]: string};
    getLanguage: () => string;
    getLanguageConfig: (pluginId: string, feature: string, separator?: string) => any;
    getLanguages: () => Array<string>;
    getText: (textVarName: string) => string;
    init: (lang: string) => any;
    setLanguage: (lang: string) => any;
    setNextLanguage: () => string;
    setToCompatibilityMode: (success: Function) => any;
}
export interface MediaManager {
    ctx: any;
    waitReadyImpl: any;
    addListener: (eventName: string, eventHandler: Function) => void;

    cancelRecognition: (successCallback?: Function, failureCallback?: Function) => void;
    cancelSpeech: (successCallBack?: Function, failureCallBack?: Function) => void;
    createEmptyAudio: () => any;

    getFunc: (ctx: any, funcName: any, ...args: any[]) => any;
    getListeners: (eventName: any) => any;
    getURLAsAudio: (url: any, onEnd: any, failureCallback: any, successCallback: any, audioObj: any, ...args: any[]) => any;
    getWAVAsAudio: (blob: any, callback: any, onEnd: any, failureCallback: any, onInit: any, emptyAudioObj: any) => any;
    hasListeners: (eventName: any) => any;
    init: (successCallback?: Function, failureCallback?: Function, listenerList?: any) => any;
    loadFile: (filePath: any, successCallback: Function, failureCallback: Function, execId: any) => void;
    off: (eventName: string, eventHandler: Function) => any;
    on: (eventName: string, eventHandler: Function) => void;
    perform: (ctx: string, funcName: string, args: Array<any>) => any;

    playURL: (url: any, onEnd?: Function, failureCallback?: Function, successCallback?: Function) => void;
    playWAV: (blob: any, onEnd?: Function, failureCallback?: Function, successCallback?: Function) => void;

    recognize: (successCallback?: Function, failureCallback?: Function, isIntermediateResults?: boolean) => void;
    removeListener: (eventName: string, eventHandler: Function) => any;
    setDefaultCtx: (ctxId: string) => void;
    setTextToSpeechVolume: (newValue: number) => void;
    startRecord: (successCallback?: Function, failureCallback?: Function, intermediateResults?: boolean) => void;

    stopRecord: (successCallback?: Function, failureCallback?: Function) => void;
    textToSpeech: (parameter: any, successCallback?: Function, failureCallback?: Function, onInit?: Function, options?: any, ...args: any[]) => void;


}
export interface MicLevelsAnalysis {
    active: (active: any) => any;
    enabled: (enable: any) => any;
    start: (audioInputData: any) => void;
    stop: () => void;
}
export interface ModelManager {
    getModel: (modelName: any) => any;
    getModels: () => any;
    init: () => any;
}
export interface NotificationManager {
    alert: (message: any, alertCallback: any, title: any, buttonName: any) => void;
    beep: (times: number) => void;
    confirm: (message: any, confirmCallback: any, title: any, buttonLabels: any) => void;
    createSound: (name: string, url: string, isKeepOnPause: boolean) => void;
    getVolume: () => number;
    init: () => any;
    initBeep: () => void;
    initSound: (name: string) => void;
    isVibrateAvailable: () => any;
    isVibrateEnabled: () => any;
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
    reRenderView: () => void;
    renderPreviousView: () => void;
    renderView: (ctrlName: string, viewName: string, data: any) => void;
    setRenderEngine: (theRenderEngine: any) => void;
    showDialog: (ctrlName: string, dialogId: string, data: any, ...args: any[]) => any;
    showWaitDialog: (text: string, data: any, ...args: any[]) => void;
}
export interface RequireJs extends Function {
    isBrowser: boolean;
    defined: (id: any) => any;
    specified: (id: any) => any;
    toUrl: (moduleNamePlusExt: any) => any;
    undef: (id: any) => void;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface RenderEngine {
    hideCurrentDialog(): void;
    hideWaitDialog(): void;
    render(ctrlName: string, viewName: string, view: View, ctrl: Controller, data?: any): void;
    showDialog(ctrlName: string, dialogId?: string, data?: any): void;
    showWaitDialog(text?: string, theme?: string): void;
}

export interface Layout {
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

export interface YieldDeclaration {
    constructor(parsingElement: ParsingResult, contentAreaType: any);

    getName(): string;
    getNameType(): number;

    getAreaType(): number;
    getEnd(): number;
    getStart(): number;

    getValue(rawPropertyValue: any, proptertyType: any, data: any): any;
    stringify(): string;
}

export interface View {
    constructor(ctrl: any, name: string, definition: string);

    getContentElement(name: string): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export interface Partial {
    constructor(ctrl: Controller, name: string, definition: string);

    getContentElement(): ContentElement;
    getController(): Controller;
    getDefinition(): string;
    getName(): string;
    stringify(): string;
}

export interface ContentElement {
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

export interface ParsingResult {
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

export type FileInfo = {name: string, path: string, fileName?: string};

export interface Helper {
    constructor(ctrl: string, name: string, ctx: any);
    perform(actionName: string, data: any, ...args: any[]): any;
}

export interface Controller {
    constructor(name: any, jsonDef: any, ctx: any);

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
