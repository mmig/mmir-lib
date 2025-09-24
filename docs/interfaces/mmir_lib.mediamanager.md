**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / MediaManager

# Interface: MediaManager

## Hierarchy

* **MediaManager**

## Index

### Properties

* [\_addListenerObserver](mmir_lib.mediamanager.md#_addlistenerobserver)
* [\_emitEvent](mmir_lib.mediamanager.md#_emitevent)
* [\_fireEvent](mmir_lib.mediamanager.md#_fireevent)
* [\_notifyObservers](mmir_lib.mediamanager.md#_notifyobservers)
* [\_preparing](mmir_lib.mediamanager.md#_preparing)
* [\_ready](mmir_lib.mediamanager.md#_ready)
* [\_removeListenerObserver](mmir_lib.mediamanager.md#_removelistenerobserver)
* [addListener](mmir_lib.mediamanager.md#addlistener)
* [cancelRecognition](mmir_lib.mediamanager.md#cancelrecognition)
* [cancelSpeech](mmir_lib.mediamanager.md#cancelspeech)
* [createEmptyAudio](mmir_lib.mediamanager.md#createemptyaudio)
* [ctx](mmir_lib.mediamanager.md#ctx)
* [destroyRecognition](mmir_lib.mediamanager.md#destroyrecognition)
* [destroySpeech](mmir_lib.mediamanager.md#destroyspeech)
* [getAudio](mmir_lib.mediamanager.md#getaudio)
* [getFunc](mmir_lib.mediamanager.md#getfunc)
* [getListeners](mmir_lib.mediamanager.md#getlisteners)
* [getRecognitionLanguages](mmir_lib.mediamanager.md#getrecognitionlanguages)
* [getSpeechLanguages](mmir_lib.mediamanager.md#getspeechlanguages)
* [getURLAsAudio](mmir_lib.mediamanager.md#geturlasaudio)
* [getVoices](mmir_lib.mediamanager.md#getvoices)
* [getWAVAsAudio](mmir_lib.mediamanager.md#getwavasaudio)
* [hasListeners](mmir_lib.mediamanager.md#haslisteners)
* [init](mmir_lib.mediamanager.md#init)
* [initializeRecognition](mmir_lib.mediamanager.md#initializerecognition)
* [initializeSpeech](mmir_lib.mediamanager.md#initializespeech)
* [loadFile](mmir_lib.mediamanager.md#loadfile)
* [off](mmir_lib.mediamanager.md#off)
* [on](mmir_lib.mediamanager.md#on)
* [perform](mmir_lib.mediamanager.md#perform)
* [play](mmir_lib.mediamanager.md#play)
* [playURL](mmir_lib.mediamanager.md#playurl)
* [playWAV](mmir_lib.mediamanager.md#playwav)
* [plugins](mmir_lib.mediamanager.md#plugins)
* [recognize](mmir_lib.mediamanager.md#recognize)
* [removeListener](mmir_lib.mediamanager.md#removelistener)
* [setDefaultCtx](mmir_lib.mediamanager.md#setdefaultctx)
* [setTextToSpeechVolume](mmir_lib.mediamanager.md#settexttospeechvolume)
* [startRecord](mmir_lib.mediamanager.md#startrecord)
* [stopRecord](mmir_lib.mediamanager.md#stoprecord)
* [tts](mmir_lib.mediamanager.md#tts)
* [waitReadyImpl](mmir_lib.mediamanager.md#waitreadyimpl)

## Properties

### \_addListenerObserver

•  **\_addListenerObserver**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), observerCallback: (actionType: \"added\" \| \"removed\", eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => void) => void

___

### \_emitEvent

•  **\_emitEvent**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), ...args: any[]) => void

___

### \_fireEvent

•  **\_fireEvent**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), args: any[]) => void

**`deprecated`** use [_emitEvent](mmir_lib.mediamanager.md#_emitevent) instead

___

### \_notifyObservers

•  **\_notifyObservers**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), actionType: \"added\" \| \"removed\", eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => void

___

### \_preparing

•  **\_preparing**: (moduleName: string) => void

___

### \_ready

•  **\_ready**: (moduleName: string) => void

___

### \_removeListenerObserver

•  **\_removeListenerObserver**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), observerCallback: (actionType: \"added\" \| \"removed\", eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => void) => void

___

### addListener

•  **addListener**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => void

___

### cancelRecognition

•  **cancelRecognition**: (successCallback?: [Function](mmir_lib.requirejs.md#function), failureCallback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### cancelSpeech

•  **cancelSpeech**: (successCallBack?: [Function](mmir_lib.requirejs.md#function), failureCallBack?: [Function](mmir_lib.requirejs.md#function)) => void

___

### createEmptyAudio

•  **createEmptyAudio**: () => [IAudio](mmir_lib.iaudio.md)

___

### ctx

•  **ctx**: { [ctxId:string]: any;  }

___

### destroyRecognition

•  **destroyRecognition**: (successCallback?: (didDestroy: boolean) => void, failureCallback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### destroySpeech

•  **destroySpeech**: (successCallback?: (didDestroy: boolean) => void, failureCallback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### getAudio

•  **getAudio**: (urlOrData: string \| Blob, callback: any, onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onInit?: [Function](mmir_lib.requirejs.md#function), emptyAudioObj?: [IAudio](mmir_lib.iaudio.md)) => [IAudio](mmir_lib.iaudio.md)

___

### getFunc

•  **getFunc**: (ctx: string, funcName: string) => any

___

### getListeners

•  **getListeners**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype)) => [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) \| void

___

### getRecognitionLanguages

•  **getRecognitionLanguages**: [ListLanguagesFunction](../modules/mmir_lib.md#listlanguagesfunction)

___

### getSpeechLanguages

•  **getSpeechLanguages**: [ListLanguagesFunction](../modules/mmir_lib.md#listlanguagesfunction)

___

### getURLAsAudio

•  **getURLAsAudio**: (url: string, onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), successCallback?: [Function](mmir_lib.requirejs.md#function), audioObj?: [IAudio](mmir_lib.iaudio.md), ...args: any[]) => [IAudio](mmir_lib.iaudio.md)

___

### getVoices

•  **getVoices**: [ListVoicesFunction](../modules/mmir_lib.md#listvoicesfunction)

___

### getWAVAsAudio

•  **getWAVAsAudio**: (blob: Blob, onCreate: [Function](mmir_lib.requirejs.md#function), onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onInit?: [Function](mmir_lib.requirejs.md#function), emptyAudioObj?: [IAudio](mmir_lib.iaudio.md)) => [IAudio](mmir_lib.iaudio.md)

___

### hasListeners

•  **hasListeners**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype)) => boolean

___

### init

•  **init**: (successCallback?: [Function](mmir_lib.requirejs.md#function), failureCallback?: [Function](mmir_lib.requirejs.md#function), listenerList?: { listener: [Function](mmir_lib.requirejs.md#function) ; name: string  }[]) => any

___

### initializeRecognition

•  **initializeRecognition**: (successCallback?: (didInitialize: boolean) => void, failureCallback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### initializeSpeech

•  **initializeSpeech**: (successCallback?: (didInitialize: boolean) => void, failureCallback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### loadFile

•  **loadFile**: (filePath: string, successCallback?: [Function](mmir_lib.requirejs.md#function), failureCallback?: [Function](mmir_lib.requirejs.md#function), execId?: string, config?: any) => void

___

### off

•  **off**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => boolean

___

### on

•  **on**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => void

___

### perform

•  **perform**: (ctx: string, funcName: string, args?: any[]) => any

___

### play

•  **play**: (urlOrData: string \| Blob, onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onReady?: [Function](mmir_lib.requirejs.md#function)) => void

___

### playURL

•  **playURL**: (url: string, onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onReady?: [Function](mmir_lib.requirejs.md#function)) => void

___

### playWAV

•  **playWAV**: (blob: Blob, onEnd?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onReady?: [Function](mmir_lib.requirejs.md#function)) => void

___

### plugins

•  **plugins**: Array<[MediaManagerPluginEntry](mmir_lib.mediamanagerpluginentry.md) & { disabled?: true \| [DisabledPluginInfo](mmir_lib.disabledplugininfo.md)  }\> \| null

___

### recognize

•  **recognize**: (options?: [ASROptions](mmir_lib.asroptions.md), statusCallback?: [ASROnStatus](../modules/mmir_lib.md#asronstatus), failureCallback?: [ASROnError](../modules/mmir_lib.md#asronerror), isIntermediateResults?: boolean) => void

___

### removeListener

•  **removeListener**: (eventName: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), eventHandler: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)) => boolean

___

### setDefaultCtx

•  **setDefaultCtx**: (ctxId: string) => void

___

### setTextToSpeechVolume

•  **setTextToSpeechVolume**: (newValue: number) => void

___

### startRecord

•  **startRecord**: (options?: [ASROptions](mmir_lib.asroptions.md), successCallback?: [ASROnStatus](../modules/mmir_lib.md#asronstatus), failureCallback?: [ASROnError](../modules/mmir_lib.md#asronerror), intermediateResults?: boolean) => void

___

### stopRecord

•  **stopRecord**: (options?: [ASROptions](mmir_lib.asroptions.md), successCallback?: [ASROnStatus](../modules/mmir_lib.md#asronstatus), failureCallback?: [ASROnError](../modules/mmir_lib.md#asronerror)) => void

___

### tts

•  **tts**: (options: string \| string[] \| [TTSOptions](mmir_lib.ttsoptions.md), successCallback?: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), failureCallback?: [TTSOnError](../modules/mmir_lib.md#ttsonerror), onInit?: [TTSOnReady](../modules/mmir_lib.md#ttsonready), ...args: any[]) => void

___

### waitReadyImpl

•  **waitReadyImpl**: [IWaitReadyImpl](mmir_lib.iwaitreadyimpl.md)
