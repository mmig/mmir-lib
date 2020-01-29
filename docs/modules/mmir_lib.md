[mmir-lib 6.0.0](../README.md) › [mmir-lib](mmir_lib.md)

# External module: mmir-lib

the `mmir-lib` package provides the mmir core library
for lightweight, client-centric, multimodal interaction development.

See also the [HTML API docs](https://mmig.github.io/mmir/api-ts/).

__NOTE__ The API documentation for `mmir-lib` has not been fully migrated to
         TypeScript yet.
         For more detailed descriptions see generated JSDoc-based API at
         [mmig.github.io/mmir/api](https://mmig.github.io/mmir/api/)

**`see`** [MmirModule](../interfaces/mmir_lib.mmirmodule.md)

## Index

### Classes

* [ContentElement](../classes/mmir_lib.contentelement.md)
* [Controller](../classes/mmir_lib.controller.md)
* [Helper](../classes/mmir_lib.helper.md)
* [Layout](../classes/mmir_lib.layout.md)
* [ParsingResult](../classes/mmir_lib.parsingresult.md)
* [Partial](../classes/mmir_lib.partial.md)
* [View](../classes/mmir_lib.view.md)
* [YieldDeclaration](../classes/mmir_lib.yielddeclaration.md)

### Interfaces

* [ASROptions](../interfaces/mmir_lib.asroptions.md)
* [CommonUtils](../interfaces/mmir_lib.commonutils.md)
* [ConfigurationManager](../interfaces/mmir_lib.configurationmanager.md)
* [ControllerManager](../interfaces/mmir_lib.controllermanager.md)
* [DialogEngine](../interfaces/mmir_lib.dialogengine.md)
* [DialogManager](../interfaces/mmir_lib.dialogmanager.md)
* [DialogManager4Compatibility](../interfaces/mmir_lib.dialogmanager4compatibility.md)
* [EncodeUtils](../interfaces/mmir_lib.encodeutils.md)
* [Grammar](../interfaces/mmir_lib.grammar.md)
* [GrammarConverter](../interfaces/mmir_lib.grammarconverter.md)
* [GrammarResult](../interfaces/mmir_lib.grammarresult.md)
* [IAudio](../interfaces/mmir_lib.iaudio.md)
* [IWaitReadyImpl](../interfaces/mmir_lib.iwaitreadyimpl.md)
* [InputEngine](../interfaces/mmir_lib.inputengine.md)
* [InputManager](../interfaces/mmir_lib.inputmanager.md)
* [LanguageManager](../interfaces/mmir_lib.languagemanager.md)
* [LogLevelOptions](../interfaces/mmir_lib.logleveloptions.md)
* [MediaManager](../interfaces/mmir_lib.mediamanager.md)
* [MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)
* [MicLevelsAnalysis](../interfaces/mmir_lib.miclevelsanalysis.md)
* [MmirCore](../interfaces/mmir_lib.mmircore.md)
* [MmirModule](../interfaces/mmir_lib.mmirmodule.md)
* [ModelManager](../interfaces/mmir_lib.modelmanager.md)
* [NodeMmirModule](../interfaces/mmir_lib.nodemmirmodule.md)
* [NotificationManager](../interfaces/mmir_lib.notificationmanager.md)
* [PhraseInfo](../interfaces/mmir_lib.phraseinfo.md)
* [PlayError](../interfaces/mmir_lib.playerror.md)
* [Pos](../interfaces/mmir_lib.pos.md)
* [Positions](../interfaces/mmir_lib.positions.md)
* [PositionsInfo](../interfaces/mmir_lib.positionsinfo.md)
* [PresentationManager](../interfaces/mmir_lib.presentationmanager.md)
* [ProcessingOrderInfo](../interfaces/mmir_lib.processingorderinfo.md)
* [ProcessingStep](../interfaces/mmir_lib.processingstep.md)
* [RenderEngine](../interfaces/mmir_lib.renderengine.md)
* [RequireJs](../interfaces/mmir_lib.requirejs.md)
* [RequireJsDefine](../interfaces/mmir_lib.requirejsdefine.md)
* [Resources](../interfaces/mmir_lib.resources.md)
* [SemanticInterpreter](../interfaces/mmir_lib.semanticinterpreter.md)
* [SimpleSpeechConfig](../interfaces/mmir_lib.simplespeechconfig.md)
* [SpeechConfig](../interfaces/mmir_lib.speechconfig.md)
* [SpeechConfigPluginEntry](../interfaces/mmir_lib.speechconfigpluginentry.md)
* [TTSOptions](../interfaces/mmir_lib.ttsoptions.md)
* [VoiceDetails](../interfaces/mmir_lib.voicedetails.md)
* [VoiceListOptions](../interfaces/mmir_lib.voicelistoptions.md)

### Type aliases

* [ASRMode](mmir_lib.md#asrmode)
* [ASROnError](mmir_lib.md#asronerror)
* [ASROnStatus](mmir_lib.md#asronstatus)
* [ASRStatus](mmir_lib.md#asrstatus)
* [Comparator](mmir_lib.md#comparator)
* [ConfigurationChangeListener](mmir_lib.md#configurationchangelistener)
* [EOSPause](mmir_lib.md#eospause)
* [FileInfo](mmir_lib.md#fileinfo)
* [GrammarEngineType](mmir_lib.md#grammarenginetype)
* [GrammarType](mmir_lib.md#grammartype)
* [LogLevel](mmir_lib.md#loglevel)
* [LogLevelNum](mmir_lib.md#loglevelnum)
* [MediaEventHandler](mmir_lib.md#mediaeventhandler)
* [MediaEventType](mmir_lib.md#mediaeventtype)
* [MediaPluginEnvType](mmir_lib.md#mediapluginenvtype)
* [MediaPluginType](mmir_lib.md#mediaplugintype)
* [PluginType](mmir_lib.md#plugintype)
* [ProcessingFunction](mmir_lib.md#processingfunction)
* [ProcessingPositionsInfo](mmir_lib.md#processingpositionsinfo)
* [TTSOnComplete](mmir_lib.md#ttsoncomplete)
* [TTSOnError](mmir_lib.md#ttsonerror)
* [TTSOnReady](mmir_lib.md#ttsonready)

### Variables

* [_define](mmir_lib.md#const-_define)
* [_mmirLibPath](mmir_lib.md#_mmirlibpath)
* [conf](mmir_lib.md#const-conf)
* [ctrl](mmir_lib.md#const-ctrl)
* [debug](mmir_lib.md#debug)
* [dialog](mmir_lib.md#const-dialog)
* [dialogEngine](mmir_lib.md#const-dialogengine)
* [input](mmir_lib.md#const-input)
* [inputEngine](mmir_lib.md#const-inputengine)
* [jquery](mmir_lib.md#jquery)
* [lang](mmir_lib.md#const-lang)
* [libMode](mmir_lib.md#libmode)
* [logLevel](mmir_lib.md#loglevel)
* [logTrace](mmir_lib.md#logtrace)
* [media](mmir_lib.md#const-media)
* [mmirName](mmir_lib.md#const-mmirname)
* [model](mmir_lib.md#const-model)
* [notifier](mmir_lib.md#const-notifier)
* [present](mmir_lib.md#const-present)
* [require](mmir_lib.md#const-require)
* [res](mmir_lib.md#const-res)
* [semantic](mmir_lib.md#const-semantic)
* [startModule](mmir_lib.md#startmodule)
* [startModules](mmir_lib.md#startmodules)
* [util](mmir_lib.md#const-util)
* [version](mmir_lib.md#const-version)
* [viewEngine](mmir_lib.md#viewengine)

### Functions

* [config](mmir_lib.md#config)
* [isVersion](mmir_lib.md#isversion)
* [ready](mmir_lib.md#ready)

## Type aliases

###  ASRMode

Ƭ **ASRMode**: *"search" | "dictation"*

___

###  ASROnError

Ƭ **ASROnError**: *function*

#### Type declaration:

▸ (`error`: string | Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | string &#124; Error |

___

###  ASROnStatus

Ƭ **ASROnStatus**: *function*

#### Type declaration:

▸ (`text`: string | "", `confidence`: number | undefined, `status`: [ASRStatus](mmir_lib.md#asrstatus), `alternatives?`: Array‹object›, `unstable?`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string &#124; "" |
`confidence` | number &#124; undefined |
`status` | [ASRStatus](mmir_lib.md#asrstatus) |
`alternatives?` | Array‹object› |
`unstable?` | string |

___

###  ASRStatus

Ƭ **ASRStatus**: *"FINAL" | "INTERIM" | "INTERMEDIATE" | "RECORDING_BEGIN" | "RECORDING_DONE"*

___

###  Comparator

Ƭ **Comparator**: *">=" | "<=" | ">" | "<" | "!=" | "!==" | "=" | "==" | "==="*

___

###  ConfigurationChangeListener

Ƭ **ConfigurationChangeListener**: *function*

#### Type declaration:

▸ (`newValue`: any, `oldValue?`: any, `propertyName?`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`newValue` | any |
`oldValue?` | any |
`propertyName?` | string |

___

###  EOSPause

Ƭ **EOSPause**: *"short" | "long"*

___

###  FileInfo

Ƭ **FileInfo**: *object*

#### Type declaration:

* **genPath**: *string*

* **name**: *string*

* **path**: *string*

___

###  GrammarEngineType

Ƭ **GrammarEngineType**: *"jscc" | "jison" | "pegjs"*

___

###  GrammarType

Ƭ **GrammarType**: *"source" | "bin"*

___

###  LogLevel

Ƭ **LogLevel**: *"verbose" | "debug" | "info" | "warn" | "error" | "critical" | "disabled"*

___

###  LogLevelNum

Ƭ **LogLevelNum**: *0 | 1 | 2 | 3 | 4 | 5 | 6*

___

###  MediaEventHandler

Ƭ **MediaEventHandler**: *[Function](../interfaces/mmir_lib.requirejs.md#function)*

___

###  MediaEventType

Ƭ **MediaEventType**: *string*

___

###  MediaPluginEnvType

Ƭ **MediaPluginEnvType**: *"browser" | "cordova" | "android" | "ios"*

___

###  MediaPluginType

Ƭ **MediaPluginType**: *"audio" | "asr" | "tts" | "prep" | string*

___

###  PluginType

Ƭ **PluginType**: *"custom" | [MediaPluginType](mmir_lib.md#mediaplugintype) | string*

___

###  ProcessingFunction

Ƭ **ProcessingFunction**: *function*

#### Type declaration:

▸ (`input`: string | [Positions](../interfaces/mmir_lib.positions.md), `isProcessPositions?`: boolean): *string | [Positions](../interfaces/mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | string &#124; [Positions](../interfaces/mmir_lib.positions.md) |
`isProcessPositions?` | boolean |

___

###  ProcessingPositionsInfo

Ƭ **ProcessingPositionsInfo**: *[ProcessingOrderInfo](../interfaces/mmir_lib.processingorderinfo.md) & [PositionsInfo](../interfaces/mmir_lib.positionsinfo.md)*

___

###  TTSOnComplete

Ƭ **TTSOnComplete**: *function*

#### Type declaration:

▸ (): *void*

___

###  TTSOnError

Ƭ **TTSOnError**: *function*

#### Type declaration:

▸ (`error`: string | Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | string &#124; Error |

___

###  TTSOnReady

Ƭ **TTSOnReady**: *function*

#### Type declaration:

▸ (`isReady?`: Boolean, `audio?`: [IAudio](../interfaces/mmir_lib.iaudio.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`isReady?` | Boolean |
`audio?` | [IAudio](../interfaces/mmir_lib.iaudio.md) |

## Variables

### `Const` _define

• **_define**: *null | [RequireJsDefine](../interfaces/mmir_lib.requirejsdefine.md)*

___

###  _mmirLibPath

• **_mmirLibPath**: *string*

___

### `Const` conf

• **conf**: *[ConfigurationManager](../interfaces/mmir_lib.configurationmanager.md)*

___

### `Const` ctrl

• **ctrl**: *[ControllerManager](../interfaces/mmir_lib.controllermanager.md)*

___

###  debug

• **debug**: *boolean*

___

### `Const` dialog

• **dialog**: *[DialogManager](../interfaces/mmir_lib.dialogmanager.md)*

___

### `Const` dialogEngine

• **dialogEngine**: *[DialogEngine](../interfaces/mmir_lib.dialogengine.md)*

___

### `Const` input

• **input**: *[InputManager](../interfaces/mmir_lib.inputmanager.md)*

___

### `Const` inputEngine

• **inputEngine**: *[InputEngine](../interfaces/mmir_lib.inputengine.md)*

___

###  jquery

• **jquery**: *undefined | any*

___

### `Const` lang

• **lang**: *[LanguageManager](../interfaces/mmir_lib.languagemanager.md)*

___

###  libMode

• **libMode**: *undefined | "min"*

___

###  logLevel

• **logLevel**: *[LogLevelNum](mmir_lib.md#loglevelnum) | [LogLevel](mmir_lib.md#loglevel) | [LogLevelOptions](../interfaces/mmir_lib.logleveloptions.md)*

___

###  logTrace

• **logTrace**: *boolean | object*

___

### `Const` media

• **media**: *[MediaManager](../interfaces/mmir_lib.mediamanager.md)*

___

### `Const` mmirName

• **mmirName**: *"mmir" | string*

___

### `Const` model

• **model**: *[ModelManager](../interfaces/mmir_lib.modelmanager.md)*

___

### `Const` notifier

• **notifier**: *[NotificationManager](../interfaces/mmir_lib.notificationmanager.md)*

___

### `Const` present

• **present**: *[PresentationManager](../interfaces/mmir_lib.presentationmanager.md)*

___

### `Const` require

• **require**: *[RequireJs](../interfaces/mmir_lib.requirejs.md)*

___

### `Const` res

• **res**: *[Resources](../interfaces/mmir_lib.resources.md)*

___

### `Const` semantic

• **semantic**: *[SemanticInterpreter](../interfaces/mmir_lib.semanticinterpreter.md)*

___

###  startModule

• **startModule**: *string*

___

###  startModules

• **startModules**: *undefined | Array‹string›*

___

### `Const` util

• **util**: *[CommonUtils](../interfaces/mmir_lib.commonutils.md)*

___

### `Const` version

• **version**: *string*

___

###  viewEngine

• **viewEngine**: *string*

## Functions

###  config

▸ **config**(`requirejsConfig`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`requirejsConfig` | object |

**Returns:** *void*

___

###  isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](mmir_lib.md#comparator)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](mmir_lib.md#comparator) |

**Returns:** *boolean*

___

###  ready

▸ **ready**(`onFrameworkReady`: function): *any*

**Parameters:**

▪ **onFrameworkReady**: *function*

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *any*
