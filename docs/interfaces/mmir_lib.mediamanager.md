> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [MediaManager](mmir_lib.mediamanager.md) /

# Interface: MediaManager

## Hierarchy

* **MediaManager**

## Index

### Properties

* [_addListenerObserver](mmir_lib.mediamanager.md#_addlistenerobserver)
* [_fireEvent](mmir_lib.mediamanager.md#_fireevent)
* [_notifyObservers](mmir_lib.mediamanager.md#_notifyobservers)
* [_preparing](mmir_lib.mediamanager.md#_preparing)
* [_ready](mmir_lib.mediamanager.md#_ready)
* [_removeListenerObserver](mmir_lib.mediamanager.md#_removelistenerobserver)
* [addListener](mmir_lib.mediamanager.md#addlistener)
* [cancelRecognition](mmir_lib.mediamanager.md#cancelrecognition)
* [cancelSpeech](mmir_lib.mediamanager.md#cancelspeech)
* [createEmptyAudio](mmir_lib.mediamanager.md#createemptyaudio)
* [ctx](mmir_lib.mediamanager.md#ctx)
* [getFunc](mmir_lib.mediamanager.md#getfunc)
* [getListeners](mmir_lib.mediamanager.md#getlisteners)
* [getRecognitionLanguages](mmir_lib.mediamanager.md#getrecognitionlanguages)
* [getSpeechLanguages](mmir_lib.mediamanager.md#getspeechlanguages)
* [getURLAsAudio](mmir_lib.mediamanager.md#geturlasaudio)
* [getVoices](mmir_lib.mediamanager.md#getvoices)
* [getWAVAsAudio](mmir_lib.mediamanager.md#getwavasaudio)
* [hasListeners](mmir_lib.mediamanager.md#haslisteners)
* [init](mmir_lib.mediamanager.md#init)
* [loadFile](mmir_lib.mediamanager.md#loadfile)
* [off](mmir_lib.mediamanager.md#off)
* [on](mmir_lib.mediamanager.md#on)
* [perform](mmir_lib.mediamanager.md#perform)
* [playURL](mmir_lib.mediamanager.md#playurl)
* [playWAV](mmir_lib.mediamanager.md#playwav)
* [recognize](mmir_lib.mediamanager.md#recognize)
* [removeListener](mmir_lib.mediamanager.md#removelistener)
* [setDefaultCtx](mmir_lib.mediamanager.md#setdefaultctx)
* [setTextToSpeechVolume](mmir_lib.mediamanager.md#settexttospeechvolume)
* [startRecord](mmir_lib.mediamanager.md#startrecord)
* [stopRecord](mmir_lib.mediamanager.md#stoprecord)
* [tts](mmir_lib.mediamanager.md#tts)
* [waitReadyImpl](mmir_lib.mediamanager.md#waitreadyimpl)

## Properties

###  _addListenerObserver

• **_addListenerObserver**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `observerCallback`: function): *void*

**Parameters:**

▪ **eventName**: *[MediaEventType](../modules/mmir_lib.md#mediaeventtype)*

▪ **observerCallback**: *function*

▸ (`actionType`: "added" | "removed", `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionType` | "added" \| "removed" |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  _fireEvent

• **_fireEvent**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`args` | any[] |

___

###  _notifyObservers

• **_notifyObservers**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `actionType`: "added" | "removed", `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`actionType` | "added" \| "removed" |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  _preparing

• **_preparing**: *function*

#### Type declaration:

▸ (`moduleName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |

___

###  _ready

• **_ready**: *function*

#### Type declaration:

▸ (`moduleName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`moduleName` | string |

___

###  _removeListenerObserver

• **_removeListenerObserver**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `observerCallback`: function): *void*

**Parameters:**

▪ **eventName**: *[MediaEventType](../modules/mmir_lib.md#mediaeventtype)*

▪ **observerCallback**: *function*

▸ (`actionType`: "added" | "removed", `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionType` | "added" \| "removed" |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  addListener

• **addListener**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  cancelRecognition

• **cancelRecognition**: *function*

#### Type declaration:

▸ (`successCallback?`: `Function`, `failureCallback?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`successCallback?` | `Function` |
`failureCallback?` | `Function` |

___

###  cancelSpeech

• **cancelSpeech**: *function*

#### Type declaration:

▸ (`successCallBack?`: `Function`, `failureCallBack?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`successCallBack?` | `Function` |
`failureCallBack?` | `Function` |

___

###  createEmptyAudio

• **createEmptyAudio**: *function*

#### Type declaration:

▸ (): *[IAudio](mmir_lib.iaudio.md)*

___

###  ctx

• **ctx**: *object*

#### Type declaration:

* \[ **ctxId**: *string*\]: any

___

###  getFunc

• **getFunc**: *function*

#### Type declaration:

▸ (`ctx`: string, `funcName`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | string |
`funcName` | string |

___

###  getListeners

• **getListeners**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype)): *[MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) | void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |

___

###  getRecognitionLanguages

• **getRecognitionLanguages**: *function*

#### Type declaration:

▸ (`successCallBack?`: `Function`, `failureCallBack?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`successCallBack?` | `Function` |
`failureCallBack?` | `Function` |

___

###  getSpeechLanguages

• **getSpeechLanguages**: *function*

#### Type declaration:

▸ (`successCallBack?`: `Function`, `failureCallBack?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`successCallBack?` | `Function` |
`failureCallBack?` | `Function` |

___

###  getURLAsAudio

• **getURLAsAudio**: *function*

#### Type declaration:

▸ (`url`: string, `onEnd`: any, `failureCallback`: any, `successCallback`: any, `audioObj`: [IAudio](mmir_lib.iaudio.md), ...`args`: any[]): *[IAudio](mmir_lib.iaudio.md)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`onEnd` | any |
`failureCallback` | any |
`successCallback` | any |
`audioObj` | [IAudio](mmir_lib.iaudio.md) |
`...args` | any[] |

___

###  getVoices

• **getVoices**: *function*

#### Type declaration:

▸ (`options?`: [VoiceListOptions](mmir_lib.voicelistoptions.md), `successCallBack?`: function, `failureCallBack?`: `Function`): *void*

**Parameters:**

▪`Optional`  **options**: *[VoiceListOptions](mmir_lib.voicelistoptions.md)*

▪`Optional`  **successCallBack**: *function*

▸ (`voices`: `Array<string | VoiceDetails>`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`voices` | `Array<string \| VoiceDetails>` |

▪`Optional`  **failureCallBack**: *`Function`*

___

###  getWAVAsAudio

• **getWAVAsAudio**: *function*

#### Type declaration:

▸ (`blob`: any, `callback`: any, `onEnd`: any, `failureCallback`: any, `onInit`: any, `emptyAudioObj`: [IAudio](mmir_lib.iaudio.md)): *[IAudio](mmir_lib.iaudio.md)*

**Parameters:**

Name | Type |
------ | ------ |
`blob` | any |
`callback` | any |
`onEnd` | any |
`failureCallback` | any |
`onInit` | any |
`emptyAudioObj` | [IAudio](mmir_lib.iaudio.md) |

___

###  hasListeners

• **hasListeners**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |

___

###  init

• **init**: *function*

#### Type declaration:

▸ (`successCallback?`: `Function`, `failureCallback?`: `Function`, `listenerList?`: `Array<object>`): *any*

**Parameters:**

Name | Type |
------ | ------ |
`successCallback?` | `Function` |
`failureCallback?` | `Function` |
`listenerList?` | `Array<object>` |

___

###  loadFile

• **loadFile**: *function*

#### Type declaration:

▸ (`filePath`: string, `successCallback?`: `Function`, `failureCallback?`: `Function`, `execId?`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`filePath` | string |
`successCallback?` | `Function` |
`failureCallback?` | `Function` |
`execId?` | string |

___

###  off

• **off**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  on

• **on**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  perform

• **perform**: *function*

#### Type declaration:

▸ (`ctx`: string, `funcName`: string, `args?`: `Array<any>`): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | string |
`funcName` | string |
`args?` | `Array<any>` |

___

###  playURL

• **playURL**: *function*

#### Type declaration:

▸ (`url`: string, `onEnd?`: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), `failureCallback?`: [TTSOnError](../modules/mmir_lib.md#ttsonerror), `onReady?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`onEnd?` | [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete) |
`failureCallback?` | [TTSOnError](../modules/mmir_lib.md#ttsonerror) |
`onReady?` | `Function` |

___

###  playWAV

• **playWAV**: *function*

#### Type declaration:

▸ (`blob`: any, `onEnd?`: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), `failureCallback?`: [TTSOnError](../modules/mmir_lib.md#ttsonerror), `onReady?`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`blob` | any |
`onEnd?` | [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete) |
`failureCallback?` | [TTSOnError](../modules/mmir_lib.md#ttsonerror) |
`onReady?` | `Function` |

___

###  recognize

• **recognize**: *function*

#### Type declaration:

▸ (`options?`: [ASROptions](mmir_lib.asroptions.md), `statusCallback?`: [ASROnStatus](../modules/mmir_lib.md#asronstatus), `failureCallback?`: [ASROnError](../modules/mmir_lib.md#asronerror), `isIntermediateResults?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [ASROptions](mmir_lib.asroptions.md) |
`statusCallback?` | [ASROnStatus](../modules/mmir_lib.md#asronstatus) |
`failureCallback?` | [ASROnError](../modules/mmir_lib.md#asronerror) |
`isIntermediateResults?` | boolean |

___

###  removeListener

• **removeListener**: *function*

#### Type declaration:

▸ (`eventName`: [MediaEventType](../modules/mmir_lib.md#mediaeventtype), `eventHandler`: [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [MediaEventType](../modules/mmir_lib.md#mediaeventtype) |
`eventHandler` | [MediaEventHandler](../modules/mmir_lib.md#mediaeventhandler) |

___

###  setDefaultCtx

• **setDefaultCtx**: *function*

#### Type declaration:

▸ (`ctxId`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctxId` | string |

___

###  setTextToSpeechVolume

• **setTextToSpeechVolume**: *function*

#### Type declaration:

▸ (`newValue`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`newValue` | number |

___

###  startRecord

• **startRecord**: *function*

#### Type declaration:

▸ (`options?`: [ASROptions](mmir_lib.asroptions.md), `successCallback?`: [ASROnStatus](../modules/mmir_lib.md#asronstatus), `failureCallback?`: [ASROnError](../modules/mmir_lib.md#asronerror), `intermediateResults?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [ASROptions](mmir_lib.asroptions.md) |
`successCallback?` | [ASROnStatus](../modules/mmir_lib.md#asronstatus) |
`failureCallback?` | [ASROnError](../modules/mmir_lib.md#asronerror) |
`intermediateResults?` | boolean |

___

###  stopRecord

• **stopRecord**: *function*

#### Type declaration:

▸ (`options?`: [ASROptions](mmir_lib.asroptions.md), `successCallback?`: [ASROnStatus](../modules/mmir_lib.md#asronstatus), `failureCallback?`: [ASROnError](../modules/mmir_lib.md#asronerror)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | [ASROptions](mmir_lib.asroptions.md) |
`successCallback?` | [ASROnStatus](../modules/mmir_lib.md#asronstatus) |
`failureCallback?` | [ASROnError](../modules/mmir_lib.md#asronerror) |

___

###  tts

• **tts**: *function*

#### Type declaration:

▸ (`options`: string | string[] | [TTSOptions](mmir_lib.ttsoptions.md), `successCallback?`: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), `failureCallback?`: [TTSOnError](../modules/mmir_lib.md#ttsonerror), `onInit?`: [TTSOnReady](../modules/mmir_lib.md#ttsonready), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`options` | string \| string[] \| [TTSOptions](mmir_lib.ttsoptions.md) |
`successCallback?` | [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete) |
`failureCallback?` | [TTSOnError](../modules/mmir_lib.md#ttsonerror) |
`onInit?` | [TTSOnReady](../modules/mmir_lib.md#ttsonready) |
`...args` | any[] |

___

###  waitReadyImpl

• **waitReadyImpl**: *[IWaitReadyImpl](mmir_lib.iwaitreadyimpl.md)*