/**
 * the `mmir-lib` package provides the mmir core library
 * for lightweight, client-centric, multimodal interaction development.
 *
 * See also the [HTML API docs](https://mmig.github.io/mmir/api-ts/).
 *
 * __NOTE__ The API documentation for `mmir-lib` has not been fully migrated to
 *          TypeScript yet.
 *          For more detailed descriptions see generated JSDoc-based API at
 *          [mmig.github.io/mmir/api](https://mmig.github.io/mmir/api/)
 *
 * @see [[MmirModule]]
 * @module mmir-lib
 */

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
export const mmirName: "mmir" | string;//DEFAULT: "mmir"
//NOTE changing exported var_s only has effect, if done before initialization
export var startModule: string;//DEFAULT: 'mmirf/main';
export var startModules: undefined | string[];//DEFAULT: undefined
export var viewEngine: string;//DEFAULT: "mmirf/simpleViewEngine";
export var debug: boolean;//DEFAULT: true;
export var logLevel: LogLevelNum | LogLevel | LogLevelOptions;//DEFAULT: 'debug';
export var logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
export var libMode: undefined | "min";//DEFAULT: undefined
export var jquery: undefined | any;//DEFAULT: undefined

//semi-public members: use with caution
export const _define: null | RequireJsDefine;
export var _mmirLibPath: string;//DEFAULT: "mmirf/"

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
	readonly mmirName: "mmir" | string;//DEFAULT: "mmir"
	startModule: string;//DEFAULT: 'mmirf/main';
	startModules: undefined | string[];//DEFAULT: undefined
	viewEngine: string;//DEFAULT: "mmirf/simpleViewEngine";
	debug: boolean;//DEFAULT: true;
	logLevel: LogLevelNum | LogLevel | LogLevelOptions;//DEFAULT: 'debug';
	logTrace: boolean | { trace: boolean, depth: 'full' | any };//DEFAULT: true
	libMode: undefined | "min";//DEFAULT: undefined
	jquery: undefined | any;//DEFAULT: undefined

	//semi-public members: use with caution
	readonly _define: null | RequireJsDefine;
	_mmirLibPath: string;//DEFAULT: "mmirf/"
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

//exported main module in node environment:
export interface NodeMmirModule extends MmirModule {
	_config: {[field: string]: any};
	readonly _requirejs: RequireJs;
	init: (preConfigure?: (mmirCore: MmirCore) => (&MmirModule | void)) => &NodeMmirModule;
}

export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled';
export type LogLevelNum =   0    |    1    |   2    |   3    |   4     |      5     |     6;
export type LogLevelNumField ='0'|   '1'   |  '2'   |  '3'   |  '4'    |     '5'    |    '6';

export interface LogLevelOptions {
	level?: LogLevel | LogLevelNum;
	levels?: {[logLevel in LogLevel]?: string[]} & {[logLevelNum in LogLevelNumField]?: string[]};
	modules?: {[moduleId: string]: LogLevel | LogLevelNum};
}

export type Comparator = '>=' | '<=' | '>' | '<' | '!=' | '!==' | '=' | '==' | '===';

/**
 * interface definition for JSON grammar
 */
export interface Grammar {

	/** @deprecated use field [[example_phrases]] instead */
	example_phrase?: string;
	example_phrases?: string | string[];

	stopwords: string[];
	/** @deprecated use field [[stopwords]] instead */
	stop_word?: string[];

	tokens: { [id: string]: string[] };

	utterances: { [id: string]: { 'phrases': string[], 'semantic': any } };

}

export interface Positions {
	text: string;
	pos: Pos[];
}

export interface ProcessingOrderInfo {
	_order?: string[];
}

export interface PositionsInfo {
	[processingName: string]: Pos[];
}

export type ProcessingPositionsInfo = ProcessingOrderInfo & PositionsInfo;

export interface GrammarConverter {

	new(): GrammarConverter;

	procList: ProcessingStep[];

	loadGrammar: (successCallback: ()=> any, errorCallback: ()=> any, grammarUrl: string, doLoadSynchronously?: boolean) => void;
	loadResource: (successCallback: ()=> any, errorCallback: ()=> any, resourceUrl: string, doLoadSynchronously?: boolean) => void;
	setStopWords: (stopWordArray: string[]) => void;
	getStopWords: () => string[];
	getEncodedStopwords: () => string[];
	parseStopWords: () => void;
	getStopWordsRegExpr: () => RegExp;
	getStopWordsEncRegExpr: () => RegExp;
	getGrammarDef: () => string;
	setGrammarDef: (rawGrammarSyntax: string) => void;
	getGrammarSource: () => string;
	setGrammarSource: (src_code: string) => void;

	setGrammarFunction: (execGrammarFunc: (text: string, callback?: (semanticResult: {}) => void) => void, isAsync?: boolean) => void;

	isAsyncExec: () => boolean;

	preproc: (thePhrase: string, pos?: ProcessingPositionsInfo, processingSteps?: ProcessingStep[]) => string;
	postproc: (procResult: any, pos: ProcessingPositionsInfo, processingSteps?: ProcessingStep[]) => any;

	addProc: (proc: ProcessingStep, indexOrIsPrepend?: number|boolean) => void;
	removeProc: (proc: number|string) => ProcessingStep | undefined;
	getProcIndex: (procName: string, startIndex?: number) => number;

	removeStopwords: (inputStr : string, isCalcPosition?: boolean) => string | Positions;

	executeGrammar: (text: string, callback?: (semanticResult: {}) => void) => void;

	maskString:  (str: string, computePositions?: boolean, prefix?: string, postfix?: string) => string | Positions;
	maskAsUnicode:  (str: string, computePositions?: boolean) => string;
	unmaskString:  (str: string, computePositions?: boolean, detector?: RegExp) => string | Positions;

	unmaskJSON:  (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any;
	recodeJSON: (json: any, recodeFunc:(str:string)=>string, isMaskValues?: boolean, isMaskNames?: boolean) => any;

	//semi-private fields
	grammar_definition: string;
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
	/** index */
	i: number;
	/** original word length (i.e. before modification) */
	len: number;
	/** modified word legnth (i.e. after modification) */
	mlen?: number;
}

export interface SemanticInterpreter {

	interpret: (phrase: string, langCode?: string, callback?: (semanticResult: GrammarResult) => void) => GrammarResult | void;
	/** @deprecated use [[applyPreProcessing]] instead */
	removeStopwords: (thePhrase: string, lang?: string) => string;
	applyPreProcessing: (thePhrase: string, lang?: string, processingSteps?: ProcessingStep[]) => string;
	getGrammarDefinitionText: (id: string) => string;
	getGrammarParserText: (id: string) => string;
	getGrammarConverter: (id: string) => GrammarConverter;
	createGrammar: (rawGrammarSrc: string | {}, id: string, callback?: (created?: GrammarConverter) => void) => SemanticInterpreter;
	addGrammar: (id: string, grammarImpl: (text: string, callback?: (semanticResult: {}) => void) => void | GrammarConverter, fileFormatNo?: number) => void;
	setStopwords: (id: string, stopwordArray: string[]) => void;
	hasGrammar: (id: string) => boolean;
	removeGrammar: (id: string) => void;
	addProcessing: (id: string, processingStep: ProcessingStep, indexOrIsPrepend?: number|boolean, callback?: Function) => void;
	setCurrentGrammar: (id: string) => void;
	getCurrentGrammar: () => string;
	setEnabled: (isEnabled: boolean) => void;
	isEnabled: () => boolean;
	getGrammarEngine: () => GrammarEngineType;//DEFAULT: "jscc"
	setGrammarEngine: (engineId: GrammarEngineType, asyncCompileMode?: boolean, disableStrictCompileMode?: boolean) => void;
	setEngineCompileMode: (asyncCompileMode: boolean, disableStrictCompileMode?: boolean) => void;//DEFAULT: false
	getEngineCompileMode: () => boolean;
	getEngineCompileStrictMode: () => boolean;
	getFileVersion: () => number;
	isPreProcessPositionsEnabled: () => boolean;
	setPreProcessPositionsEnabled: (enabled: boolean) => void;

	get_json_grammar_url: (id: string) => string;//NOTE may get removed/renamed
}

export type GrammarEngineType = "jscc" | "jison" | "pegjs";

export interface GrammarResult {
	engine: GrammarEngineType;
	phrase: string;
	preproc: {[preprocName: string]: Pos[]};

	phrases?: PhraseInfo[];
	utterance?: string;
	semantic?: any;

	error?: any;
}

export interface PhraseInfo {
	/** the index with the phrase */
	i: number;
	/** the token type or utterance type */
	type: string;
	/** the matched token(s) */
	tok: string | PhraseInfo[];
}

export interface ProcessingStep {
	name: string;
	pre?: ProcessingFunction;
	post?: ProcessingFunction;
}

export type ProcessingFunction = (input: string | Positions, isProcessPositions?: boolean) => string | Positions;

//////////////////////////////////////////////////////////// TODO //////////////////////////////////////////////////////

export interface CommonUtils {
	readonly regexHTMLComment: RegExp;
	readonly requireProtocol: string;
	checkNetworkConnection: () => any;
	concatArray: (array: any) => any;
	getCompiledGrammarPath: (generatedGrammarsPath: string, grammarId: string, isFileNameOnly?: boolean) => string;
	getCompiledResourcesIds: (compiledResourcesPath: string) => string[];
	getDirectoryStructure: () => any;
	getLocalScript: (scriptUrl: any, success: any, fail: any, ...args: any[]) => void;
	getPartialsPrefix: () => any;
	init: (onsuccess: any, onerror: any) => any;
	isArray: (object: any) => any;
	isRunningOnAndroid: () => any;
	isRunningOnSmartphone: () => any;
	loadCompiledGrammars: (generatedGrammarsPath: string, cbFunction: Function, ignoreGrammarIds?: string[]) => any;
	loadDirectoryStructure: (success: any, errorFunc: any) => any;
	listDir: (pathname: string, filter: RegExp|((entry: string)=>boolean)) => string[];
	loadImpl: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any;
	loadScript: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any;
	parseParamsToDictionary: (urlParamsPartStrings: any) => any;
	stripPathName: (pathname: any) => any;
}
declare interface ConfigurationManager {
	get(propertyName: string | string[], defaultValue?: any, setAsDefaultIfUnset?: boolean): any;
	get<T>(propertyName: string | string[], defaultValue?: T, setAsDefaultIfUnset?: boolean): T;
	getBoolean(propertyName: string | string[], defaultValue?: any, setAsDefaultIfUnset?: boolean): boolean;
	getString(propertyName: string | string[], defaultValue?: any, setAsDefaultIfUnset?: boolean): string;
	getNumber(propertyName: string | string[], defaultValue?: any, setAsDefaultIfUnset?: boolean): number;
	set(propertyName: string | string[], value: any): any;
	set<T>(propertyName: string | string[], value: T): T;

	on(propertyName: string, listener: ConfigurationChangeListener, emitOnAdding?: boolean): void;
	on(propertyNamePath:  string[], listener: ConfigurationChangeListener, emitOnAdding?: boolean): void;
	on(allChangesListener: ConfigurationChangeListener): void;
	addListener(propertyName: string, listener: ConfigurationChangeListener, emitOnAdding?: boolean): void;
	addListener(propertyNamePath:  string[], listener: ConfigurationChangeListener, emitOnAdding?: boolean): void;
	addListener(allChangesListener: ConfigurationChangeListener): void;

	off(propertyName: string, listener: ConfigurationChangeListener): void;
	off(propertyNamePath: string[], listener: ConfigurationChangeListener): void;
	off(allChangesListener: ConfigurationChangeListener): void;
	removeListener(propertyName: string, listener: ConfigurationChangeListener): void;
	removeListener(propertyNamePath: string[], listener: ConfigurationChangeListener): void;
	removeListener(allChangesListener: ConfigurationChangeListener): void;

	toPath(pathStringOrList: string | string[]): string[];
}
export type ConfigurationChangeListener = (newValue: any, oldValue?: any, propertyName?: string[]) => void;
export interface Resources {
	getBasePath: () => string;
	getBeepUrl: () => string;
	getCompiledLayoutPath: () => string;
	getCompiledViewPath: () => string;
	getConfigurationFileUrl: () => string;
	getControllerPath: () => string;
	getDictionaryFileUrl: (langCode?: string) => string;
	getDirectoriesFileUrl: () => string;
	getEnv: () => EnvType | "default" | string;
	getEnvPlatform: () => PlatfromType | "default";
	getExtensionsPath: () => string;
	getGeneratedGrammarsPath: () => string;
	getGrammarFileUrl: (langCode?: string) => string;
	getGrammarPluginPath: () => string;
	getGeneratedStateModelsPath: () => string;
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
	init: (theForBrowserParameter?: EnvType|EnvInfo&{isAbsolutePath?: true|((path: string)=>boolean)}|string|boolean, isReset?: boolean) => any;
	isBrowserEnv: () => boolean;
	isCordovaEnv: () => boolean;
	isCapacitorEnv: () => boolean;
}
export type PlatfromType = "browser" | "android" | "ios" | "node" | "electron";
export type EnvType = PlatfromType | "cordova";
export interface EnvInfo {
	isBrowserEnv: boolean,
	isCordovaEnv: boolean,
	isCapacitorEnv: boolean,
	isNodeEnv: boolean,
	platform: PlatfromType | "default",
	envSetting: EnvType | "default" | string
}
export interface ControllerManager {
	create: () => any;
	get: (ctrlName: string) => Controller | undefined;
	getNames: () => string[];
	init: (callback: any, ctx: any) => any;
	perform: (ctrlName: string, actionName: string, data?: any) => any;
	performHelper: (ctrlName: string, actionName: string, data?: any) => any;
}
export interface StateEngine {
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
	raise: (event: string | {name: string, data?: any}, eventData?: any) => void;
	start: () => void;
}
export interface StateManager {
	raise: (eventName: string, data?: any) => void;
	_init: (moduleId: string, config: StateManagerConfig, isRegisterEngine?: boolean) => Promise<{manager: StateManager, engine: any}>;
	_log: Logger;
}
export interface StateManagerConfig {
	modelUri: string;
	mode?: 'simple' | 'extended';
	engineId?: string;
	logLevel?: number | string;
}
export interface DialogEngine extends StateEngine {}
export interface DialogManager extends StateManager {}
export interface InputEngine extends StateEngine {}
export interface InputManager extends StateManager {}
export type GrammarType = 'source' | 'bin';
export interface LanguageManager {
	determineLanguage: (lang: string) => string;
	existsDictionary: (lang: string) => boolean;
	existsGrammar: (lang: string, grammarType?: GrammarType) => boolean;
	existsSpeechConfig: (lang: string) => boolean;
	fixLang: (providerName: string, langCode: string) => string;
	getDefaultLanguage: () => string;
	getDictionary: () => {[id:string]: string};
	getSpeechConfig: () => {[config:string]: any};
	getLanguage: () => string;
	getLanguageConfig: (pluginId: string, feature: string, separator?: string) => any;
	getLanguages: () => string[];
	getText: (textVarName: string) => string;
	init: (lang: string) => any;
	setLanguage: (lang: string, doNotLoadResources?: boolean) => string;
}
export type MediaEventHandler = Function;
export type MediaEventType = string;
export type ListVoicesFunction = (options?: VoiceListOptions, successCallBack?: (voices: string | VoiceDetails[]) => void, failureCallBack?: Function) => void;
export type ListLanguagesFunction = (successCallBack?: (languages: string[]) => void, failureCallBack?: Function) => void;
export interface MediaManager {
	ctx: {[ctxId: string]: any};
	plugins: Array<MediaManagerPluginEntry & {disabled?: true | DisabledPluginInfo}> | null,
	waitReadyImpl: IWaitReadyImpl;

	init: (successCallback?: Function, failureCallback?: Function, listenerList?: {name: string, listener: Function}[]) => any;
	loadFile: (filePath: string, successCallback?: Function, failureCallback?: Function, execId?: string, config?: any) => void;

	addListener: (eventName: MediaEventType, eventHandler: MediaEventHandler) => void;
	hasListeners: (eventName: MediaEventType) => boolean;
	getListeners: (eventName: MediaEventType) => MediaEventHandler | void;
	removeListener: (eventName: MediaEventType, eventHandler: MediaEventHandler) => boolean;
	off: (eventName: MediaEventType, eventHandler: MediaEventHandler) => boolean;
	on: (eventName: MediaEventType, eventHandler: MediaEventHandler) => void;

	createEmptyAudio: () => IAudio;
	getURLAsAudio: (url: string, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, successCallback?: Function, audioObj?: IAudio, ...args: any[]) => IAudio;
	getWAVAsAudio: (blob: Blob, onCreate: Function, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onInit?: Function, emptyAudioObj?: IAudio) => IAudio;
	getAudio: (urlOrData: string | Blob, callback: any, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onInit?: Function, emptyAudioObj?: IAudio) => IAudio;
	playURL: (url: string, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;
	playWAV: (blob: Blob, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;
	play: (urlOrData: string | Blob, onEnd?: TTSOnComplete, failureCallback?: TTSOnError, onReady?: Function) => void;

	getFunc: (ctx: string, funcName: string) => any;
	perform: (ctx: string, funcName: string, args?: any[]) => any;
	setDefaultCtx: (ctxId: string) => void;

	recognize: (options?: ASROptions, statusCallback?: ASROnStatus, failureCallback?: ASROnError, isIntermediateResults?: boolean) => void;
	startRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError, intermediateResults?: boolean) => void;
	stopRecord: (options?: ASROptions, successCallback?: ASROnStatus, failureCallback?: ASROnError) => void;
	cancelRecognition: (successCallback?: Function, failureCallback?: Function) => void;
	getRecognitionLanguages: ListLanguagesFunction;
	destroyRecognition: (successCallback?: (didDestroy: boolean) => void,failureCallback?: Function) => void;
	initializeRecognition: (successCallback?: (didInitialize: boolean) => void,failureCallback?: Function) => void;

	tts: (options: string | string[] | TTSOptions, successCallback?: TTSOnComplete, failureCallback?: TTSOnError, onInit?: TTSOnReady, ...args: any[]) => void;
	setTextToSpeechVolume: (newValue: number) => void;
	cancelSpeech: (successCallBack?: Function, failureCallBack?: Function) => void;
	getSpeechLanguages: ListLanguagesFunction;
	getVoices: ListVoicesFunction;
	destroySpeech: (successCallback?: (didDestroy: boolean) => void,failureCallback?: Function) => void;
	initializeSpeech: (successCallback?: (didInitialize: boolean) => void,failureCallback?: Function) => void;


	// internal / "half public" functions (for use in plugin implementations)
	_emitEvent: (eventName: MediaEventType, ...args: any[]) => void;
	/** @deprecated use [[_emitEvent]] instead */
	_fireEvent: (eventName: MediaEventType, args: any[]) => void;

	_addListenerObserver: (eventName: MediaEventType, observerCallback: (actionType: "added" | "removed", eventHandler: MediaEventHandler) => void) => void;
	_removeListenerObserver: (eventName: MediaEventType, observerCallback: (actionType: "added" | "removed", eventHandler: MediaEventHandler) => void) => void;
	_notifyObservers: (eventName: MediaEventType, actionType: "added" | "removed", eventHandler: MediaEventHandler) => void;

	_preparing: (moduleName: string) => void;
	_ready: (moduleName: string) => void;
}

/** MediaManager.loadPlugin: return value / info when loading media plugins in case they are not functional (e.g. for auto-created stub functions that invoke appropriate error-callback) */
export interface DisabledPluginInfo {
	/** name / ID of the (media) plugin */
	mod: string;
	/**
	 * if list of (disabled/non-functional) function names:
	 * stub functions will be created (which try to invoke an error-callback from the arguments or log an error)
	 *
	 * if dictionary of functions:
	 * function implementations will be used as plugin implementation
	 */
	disabled?: string[] | {[field: string]: any};
	/** a message to append to the error message for created stub-functions (see `disabled`) */
	message?: string;
	/**
	 * option-name for error-callbacks when supplied via options-argument
	 * (used created stub-functions, see `disabled`)
	 * @default "error"
	 */
	errorCallbackName?: string;
}

export interface Logger {

	verbose(msg: string, reverseCallStack?: number): void;
	verbose(className: string, msg: string, reverseCallStack?: number): void;
	verbose(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	v(msg: string, reverseCallStack?: number): void;
	v(className: string, msg: string, reverseCallStack?: number): void;
	v(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	debug(msg: string, reverseCallStack?: number): void;
	debug(className: string, msg: string, reverseCallStack?: number): void;
	debug(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	d(msg: string, reverseCallStack?: number): void;
	d(className: string, msg: string, reverseCallStack?: number): void;
	d(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	log(msg: string, reverseCallStack?: number): void;
	log(msg: string, reverseCallStack?: number): void;
	logl(msg: string, error?: any, reverseCallStack?: number): void;
	log(className: string, msg: string, reverseCallStack?: number): void;
	log(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	log(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	log(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;
	l(msg: string, reverseCallStack?: number): void;
	l(msg: string, error?: any, reverseCallStack?: number): void;
	l(className: string, msg: string, reverseCallStack?: number): void;
	l(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	l(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	l(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;

	info(msg: string, reverseCallStack?: number): void;
	info(className: string, msg: string, reverseCallStack?: number): void;
	info(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	i(msg: string, reverseCallStack?: number): void;
	i(className: string, msg: string, reverseCallStack?: number): void;
	i(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	warn(msg: string, reverseCallStack?: number): void;
	warn(className: string, msg: string, reverseCallStack?: number): void;
	warn(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	w(msg: string, reverseCallStack?: number): void;
	w(className: string, msg: string, reverseCallStack?: number): void;
	w(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	error(msg: string, reverseCallStack?: number): void;
	error(msg: string, error?: any, reverseCallStack?: number): void;
	error(className: string, msg: string, reverseCallStack?: number): void;
	error(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	error(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	error(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;
	e(msg: string, reverseCallStack?: number): void;
	e(msg: string, error?: any, reverseCallStack?: number): void;
	e(className: string, msg: string, reverseCallStack?: number): void;
	e(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	e(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	e(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;

	critical(msg: string, reverseCallStack?: number): void;
	critical(msg: string, error?: any, reverseCallStack?: number): void;
	critical(className: string, msg: string, reverseCallStack?: number): void;
	critical(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	critical(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	critical(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;
	c(msg: string, reverseCallStack?: number): void;
	c(msg: string, error?: any, reverseCallStack?: number): void;
	c(className: string, msg: string, reverseCallStack?: number): void;
	c(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	c(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	c(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;

	getLevel(): LogLevelNum;
	setLevel(loggingLevel: LogLevel | LogLevelNum): void;

	isCritical(): boolean;
	isDebug(): boolean;
	isDisabled(): boolean;
	isError(): boolean;
	isInfo(): boolean;
	isVerbose(): boolean;
	isWarn(): boolean;
	isc(): boolean;
	isd(): boolean;
	ise(): boolean;
	isi(): boolean;
	isv(): boolean;
	isw(): boolean;
}
/**
 * @example
 * var Logger = mmir.require('mmirf/logger');
 * var logger = Logger.create('MyClass');
 */
export interface LoggerModule {

	create(loggerName: string, logLevel?: LogLevel | LogLevelNum): Logger;
	create(loggerConfig: {id: string, config(): &{logLevel: LogLevel | LogLevelNum}}): Logger;
	create(loggerName: string | {id: string, config(): &{logLevel: LogLevel | LogLevelNum}}, logLevel?: LogLevel | LogLevelNum): Logger;

	getDefaultLogLevel(): LogLevelNum;
	setDefaultLogLevel(loggingLevel: LogLevel | LogLevelNum): void;

	verbose(msg: string, reverseCallStack?: number): void;
	verbose(className: string, msg: string, reverseCallStack?: number): void;
	verbose(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	debug(msg: string, reverseCallStack?: number): void;
	debug(className: string, msg: string, reverseCallStack?: number): void;
	debug(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	log(msg: string, reverseCallStack?: number): void;
	log(msg: string, reverseCallStack?: number): void;
	logl(msg: string, error?: any, reverseCallStack?: number): void;
	log(className: string, msg: string, reverseCallStack?: number): void;
	log(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	log(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	log(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;

	info(msg: string, reverseCallStack?: number): void;
	info(className: string, msg: string, reverseCallStack?: number): void;
	info(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	warn(msg: string, reverseCallStack?: number): void;
	warn(className: string, msg: string, reverseCallStack?: number): void;
	warn(className: string, funcName: string, msg: string, reverseCallStack?: number): void;

	error(msg: string, reverseCallStack?: number): void;
	error(msg: string, error?: any, reverseCallStack?: number): void;
	error(className: string, msg: string, reverseCallStack?: number): void;
	error(className: string, msg: string, error?: any, reverseCallStack?: number): void;
	error(className: string, funcName: string, msg: string, reverseCallStack?: number): void;
	error(className: string, funcName: string, msg: string, error?: any, reverseCallStack?: number): void;
}

/**
 * Module configuration for the [[LoggerModule]]
 *
 * @example
 *
 * var loggerModuleConfig = {
 * 	level: 'info',
 * 	levels: {
 * 		warn: ['mmirf/mediaManager', 'mmirf/inputEngine']
 * 	},
 * 	modules: {
 * 		'mmirf/dialogEngine': 'critical'
 * 	}
 * };
 * // set to global `mmir` before initialing `mmir`:
 * mmir.logLevel = loggerModuleConfig;
 *
 * // or use as mmir application configuration with mmir-tooling configuration:
 * var mmirAppConfig = {
 * 	config: {
 * 		'mmirf/logger': {
 * 			logLevel: loggerModuleConfig
 * 		}
 * 	}
 * };
 * //...
 * require('mmir-webpack')(webpack, webpackConfig, mmirAppConfig);
 *
 */
export interface LoggerModuleConfig {
	/** OPTIONAL the default log level as integer or string, DEFAULT: "debug" */
	level?: LogLevel | LogLevelNum;
	/** OPTIONAL list of modules for per log level (unspecified modules will have default log level) */
	levels?: {
		/**
		 * list of modules for the LogLevel
		 * NOTE: the field name must be a valid LogLevel (e.g. "warn"), otherwise it will be ignored
		 */
		[logLevel: string]: string[]
	},
	/** OPTIONAL log level per module (unspecified modules will have default log level) */
	modules?: {
		/**
		 * log level for the module
		 * NOTE: the field name needs to correspond to the module ID
		 */
		[moduleId: string]: LogLevel | LogLevelNum
	}
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
	/** if voice is locally available or requires network/internet access
	 * @default false
	 */
	local?: boolean;
}

export type TTSOnComplete = () => void;
export type TTSOnError = (error: string | Error) => void;
export type TTSOnReady = (isReady?: Boolean, audio?: IAudio) => void;

export type ASROnStatus = (text: string | "", confidence: number | undefined, status: ASRStatus, alternatives?: {result: string, score: number}[], unstable?: string, custom?: any) => void;
export type ASRStatus = "FINAL" | "INTERIM" | "INTERMEDIATE" | "RECORDING_BEGIN" | "RECORDING_DONE";
export type ASROnError = (error: string | Error) => void;

export type ASRMode = "search" | "dictation";
export type EOSPause = "short" | "long";

export interface PlayError {
	audio: IAudio | HTMLAudioElement;
	error: DOMException;
}

export type PluginType = 'custom' | MediaPluginType | string;
export type MediaPluginType = 'audio' | 'asr' | 'tts' | 'prep' | string;

export type MediaPluginEnvType = 'browser' | 'cordova' | 'android' | 'ios';

export interface MediaManagerPluginEntry {
	mod?: string;
	env?:  MediaPluginEnvType | string [] | MediaPluginEnvType | string;
	ctx?: string;
	config?: string | {mod: string, config: any} | any;
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
	new: (url: string, onPlayedCallback: TTSOnComplete, failureCallBack: TTSOnError, onLoadedCallBack: TTSOnReady) => IAudio;
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
	getNames: () => string[];
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
	callRenderEngine: (funcName: string, args: any[]) => any;
	getLayout: (layoutName: string, doUseDefaultIfMissing: boolean) => any;
	getPartial: (controllerName: string, partialName: string) => any;
	getView: (controllerName: string, viewName: string) => any;
	hideCurrentDialog: (...args: any[]) => void;
	hideWaitDialog: (...args: any[]) => void;
	render: (ctrlName: string, viewName: string, data?: any) => void;
	setRenderEngine: (theRenderEngine: RenderEngine) => void;
	showDialog: (ctrlName: string, dialogId: string, data?: any, ...args: any[]) => any;
	showWaitDialog: (text: string, data: any, ...args: any[]) => void;

		/** NOTE view-dependent events are named: "<event name>_<view name>" */
		_fireRenderEvent: (ctrl: Controller, eventName: 'before_page_prepare' | 'before_page_load' | 'on_page_load' | string, eventData: any, pageOptions: any) => any | false;

	/** NOTE view-dependent event handler can be set via: on_before_page_prepare_<view name> */
	on_before_page_prepare?: (ctrlName: string, eventName: 'before_page_prepare', eventData: any, pageOptions: any) => any | false;
	/** NOTE view-dependent event handler can be set via: on_before_page_load_<view name> */
	on_before_page_load?: (ctrlName: string, eventName: 'before_page_load', eventData: any, pageOptions: any) => any | false;
	/** NOTE view-dependent event handler can be set via: on_page_load_<view name> */
	on_page_load?: (ctrlName: string, eventName: 'on_page_load', eventData: any, pageOptions: any) => any | false;
}
export interface RequireJs extends Function {
	isBrowser: boolean;
	defined: (id: any) => any;
	specified: (id: any) => any;
	toUrl: (moduleNamePlusExt: any) => any;
	undef: (id: any) => void;
	config: (configuration: any) => void;
}
export interface RequireJsDefine extends Function {}

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
	getYields(): YieldDeclaration[];
	stringify(disableStrictMode?: boolean): string;

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
	stringify(disableStrictMode?: boolean): string;
}

export declare class View {
	constructor(ctrl: any, name: string, definition: string);

	getContentElement(name: string): ContentElement;
	getController(): Controller;
	getDefinition(): string;
	getName(): string;
	stringify(disableStrictMode?: boolean): string;
}

export declare class Partial {
	constructor(ctrl: Controller, name: string, definition: string);

	getContentElement(): ContentElement;
	getController(): Controller;
	getDefinition(): string;
	getName(): string;
	stringify(disableStrictMode?: boolean): string;
}

export declare class ContentElement {
	constructor(group: ParsingResult|string[]|{name: string, content: string, offset?: number, parent?: ContentElement}, view: View, parser: any, renderer: any, ...args: any[]);

	getController(): Controller;

	getDefinition(): string;

	getEnd(): number;

	getName(): string;

	getOffset(): number;

	getRawText(): string;

	getStart(): number;

	getView(): View;

	hasDynamicContent(): boolean;

	stringify(disableStrictMode?: boolean): string;

	toHtml(): string;

	toStrings(renderingBuffer?: string[], data?: any): any;

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

	stringify(disableStrictMode?: boolean): string;

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
	getPartialNames(): string[];
	getViewNames(): string[];

	perform(actionName: string, data: any, ...args: any[]): any;
	performHelper(actionName: string, data: any, ...args: any[]): any;
	performIfPresent(actionName: string, data: any, ...args: any[]): any;

	getPartials(): FileInfo[];
	getViews(): FileInfo[];
	getLayout(): FileInfo;
	parsePartials(partialDefs: FileInfo[]): void;
	parseViews(viewDefs: FileInfo[]): void;
	loadHelper(name: string, helperPath: string, ctx: any): void;

}

export interface DialogManager4Compatibility extends DialogManager {
	getOnPageRenderedHandler: () => Function | undefined;
	hideCurrentDialog: () => void;
	hideWaitDialog: () => void;
	perform: (ctrlName: any, actionName: any, data?: any) => any;
	performHelper: (ctrlName: any, helper_method_name: any, data?: any) => any;
	render: (ctrlName: any, viewName: any, data?: any) => void;
	setOnPageRenderedHandler: (onPageRenderedHook: Function) => void;
	showDialog: (ctrlName: any, dialogId: any, data?: any) => void;
	showWaitDialog: (text: any, theme: any) => void;
}


export type CryptoImpl = {MD5(str: string): string};
export type ChecksumInfo = {
	size: number;
	hash: string;
	info?: string;
};

/**
 * @example
 * var checksumUtils = require('mmirf/checksumUtils').init();
 */
export interface ChecksumUtils {
	/**
	 * Must be called before using checksum-generation:
	 * sets/initializes the object/function for checksum generation.
	 *
	 * After first call, following calls to this function will have no effect.
	 *
	 * @param {CryptoImpl} [cryptoImpl] OPTIONAL
	 * 				if omitted, the (global!) variable <code>CryptoJS</code> is used by default.
	 * 				This argument should be the CryptoJS object containing the MD5 function/algorithm, i.e. CryptoJS.MD5() must be a function!
	 */
	init(cryptoImpl?: CryptoImpl): void;
	/**
	 * Creates the content for a checksum file, containing information about
	 * the size and hash-value for the supplied String argument.
	 *
	 * The result can be "written as is" to a file.
	 *
	 * @param {String} originalText
	 * 						the "raw" text for which to generate the checksum information
	 * @param {String} [additionalInfo] OPTIONAL
	 * 						additional information to include in the checksum information (must not contain whitespaces)
	 *
	 * @returns {String} the checksum information as a String (formatted as content of a checksum file)
	 */
	createContent(originalText: string, additionalInfo?: string): string;
	/**
	 * Parses the raw text-content of a checksum file and returns an object
	 * with properties:
	 *
	 * @param {String} rawTextContent
	 * 					the raw conent of a checksum file
	 *
	 * @returns {ChecksumInfo} an object with the extracted properties from the checksum-data:
	 * 												<pre>{ size: INTEGER, hash: STRING, info?: STRING }</pre>
	 */
	parseContent(rawTextContent: string): ChecksumInfo;
	/**
	 * Check if the length / checksum for a raw text is the same as the checksum-information.
	 *
	 * NOTE: The actual checksum for the raw text is only generated & checked, if the size is equal.
	 *
	 * @function
	 * @param {String} rawTextContent
	 * 					the (raw) text/content which should be checked
	 * @param {String|ChecksumInfo} referenceHash
	 * 					the checksum information to check against: either the
	 * 					raw content (String) of a checksum file, or the parsed
	 * 					contents of a checksum file, which is a PlainObject with
	 * 					properties:
	 * 					<pre>{ size: INTEGER, hash: STRING, info?: STRING }</pre>
	 * @param {String} [additionalInfo] OPTIONAL
	 * 					if referenceHash is a PlainObject with info property and
	 * 					additionalInfo must match the info property, otherwise the
	 * 					verification return FALSE
	 *
	 * @returns {Boolean}
	 * 					<code>true</code> if the raw content matches the hash
	 */
	isSame(rawTextContent: string, referenceHash: string | ChecksumInfo, additionalInfo?: string): boolean;
	/**
	 * Returns the file extension for checksum-files.
	 *
	 * @returns {String} the default file extension for checksum files
	 * 						(including the separating dot, eg. ".checksum.txt")
	 */
	getFileExt(): string,
	/**
	 * The Char used for separating fields within checksum files.
	 *
	 * @returns {String} the separator char (TAB)
	 */
	getConentSeparator(): string;
}
