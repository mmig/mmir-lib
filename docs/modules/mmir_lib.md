**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / mmir-lib

# Module: mmir-lib

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
* [ChecksumUtils](../interfaces/mmir_lib.checksumutils.md)
* [CommonUtils](../interfaces/mmir_lib.commonutils.md)
* [ConfigurationManager](../interfaces/mmir_lib.configurationmanager.md)
* [ControllerManager](../interfaces/mmir_lib.controllermanager.md)
* [DialogEngine](../interfaces/mmir_lib.dialogengine.md)
* [DialogManager](../interfaces/mmir_lib.dialogmanager.md)
* [DialogManager4Compatibility](../interfaces/mmir_lib.dialogmanager4compatibility.md)
* [EncodeUtils](../interfaces/mmir_lib.encodeutils.md)
* [EnvInfo](../interfaces/mmir_lib.envinfo.md)
* [Grammar](../interfaces/mmir_lib.grammar.md)
* [GrammarConverter](../interfaces/mmir_lib.grammarconverter.md)
* [GrammarResult](../interfaces/mmir_lib.grammarresult.md)
* [IAudio](../interfaces/mmir_lib.iaudio.md)
* [IWaitReadyImpl](../interfaces/mmir_lib.iwaitreadyimpl.md)
* [InputEngine](../interfaces/mmir_lib.inputengine.md)
* [InputManager](../interfaces/mmir_lib.inputmanager.md)
* [LanguageManager](../interfaces/mmir_lib.languagemanager.md)
* [LogLevelOptions](../interfaces/mmir_lib.logleveloptions.md)
* [Logger](../interfaces/mmir_lib.logger.md)
* [LoggerModule](../interfaces/mmir_lib.loggermodule.md)
* [LoggerModuleConfig](../interfaces/mmir_lib.loggermoduleconfig.md)
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
* [StateEngine](../interfaces/mmir_lib.stateengine.md)
* [StateManager](../interfaces/mmir_lib.statemanager.md)
* [StateManagerConfig](../interfaces/mmir_lib.statemanagerconfig.md)
* [TTSOptions](../interfaces/mmir_lib.ttsoptions.md)
* [VoiceDetails](../interfaces/mmir_lib.voicedetails.md)
* [VoiceListOptions](../interfaces/mmir_lib.voicelistoptions.md)

### Type aliases

* [ASRMode](mmir_lib.md#asrmode)
* [ASROnError](mmir_lib.md#asronerror)
* [ASROnStatus](mmir_lib.md#asronstatus)
* [ASRStatus](mmir_lib.md#asrstatus)
* [ChecksumInfo](mmir_lib.md#checksuminfo)
* [Comparator](mmir_lib.md#comparator)
* [ConfigurationChangeListener](mmir_lib.md#configurationchangelistener)
* [CryptoImpl](mmir_lib.md#cryptoimpl)
* [EOSPause](mmir_lib.md#eospause)
* [EnvType](mmir_lib.md#envtype)
* [FileInfo](mmir_lib.md#fileinfo)
* [GrammarEngineType](mmir_lib.md#grammarenginetype)
* [GrammarType](mmir_lib.md#grammartype)
* [LogLevel](mmir_lib.md#loglevel)
* [LogLevelNum](mmir_lib.md#loglevelnum)
* [MediaEventHandler](mmir_lib.md#mediaeventhandler)
* [MediaEventType](mmir_lib.md#mediaeventtype)
* [MediaPluginEnvType](mmir_lib.md#mediapluginenvtype)
* [MediaPluginType](mmir_lib.md#mediaplugintype)
* [PlatfromType](mmir_lib.md#platfromtype)
* [PluginType](mmir_lib.md#plugintype)
* [ProcessingFunction](mmir_lib.md#processingfunction)
* [ProcessingPositionsInfo](mmir_lib.md#processingpositionsinfo)
* [TTSOnComplete](mmir_lib.md#ttsoncomplete)
* [TTSOnError](mmir_lib.md#ttsonerror)
* [TTSOnReady](mmir_lib.md#ttsonready)

### Variables

* [\_define](mmir_lib.md#_define)
* [\_mmirLibPath](mmir_lib.md#_mmirlibpath)
* [conf](mmir_lib.md#conf)
* [ctrl](mmir_lib.md#ctrl)
* [debug](mmir_lib.md#debug)
* [dialog](mmir_lib.md#dialog)
* [dialogEngine](mmir_lib.md#dialogengine)
* [input](mmir_lib.md#input)
* [inputEngine](mmir_lib.md#inputengine)
* [jquery](mmir_lib.md#jquery)
* [lang](mmir_lib.md#lang)
* [libMode](mmir_lib.md#libmode)
* [logLevel](mmir_lib.md#loglevel)
* [logTrace](mmir_lib.md#logtrace)
* [media](mmir_lib.md#media)
* [mmirName](mmir_lib.md#mmirname)
* [model](mmir_lib.md#model)
* [notifier](mmir_lib.md#notifier)
* [present](mmir_lib.md#present)
* [require](mmir_lib.md#require)
* [res](mmir_lib.md#res)
* [semantic](mmir_lib.md#semantic)
* [startModule](mmir_lib.md#startmodule)
* [startModules](mmir_lib.md#startmodules)
* [util](mmir_lib.md#util)
* [version](mmir_lib.md#version)
* [viewEngine](mmir_lib.md#viewengine)

### Functions

* [config](mmir_lib.md#config)
* [isVersion](mmir_lib.md#isversion)
* [ready](mmir_lib.md#ready)

## Type aliases

### ASRMode

Ƭ  **ASRMode**: \"search\" \| \"dictation\"

___

### ASROnError

Ƭ  **ASROnError**: (error: string \| Error) => void

___

### ASROnStatus

Ƭ  **ASROnStatus**: (text: string \| "", confidence: number \| undefined, status: [ASRStatus](mmir_lib.md#asrstatus), alternatives?: { result: string ; score: number  }[], unstable?: string) => void

___

### ASRStatus

Ƭ  **ASRStatus**: \"FINAL\" \| \"INTERIM\" \| \"INTERMEDIATE\" \| \"RECORDING\_BEGIN\" \| \"RECORDING\_DONE\"

___

### ChecksumInfo

Ƭ  **ChecksumInfo**: { hash: string ; info?: string ; size: number  }

#### Type declaration:

Name | Type |
------ | ------ |
`hash` | string |
`info?` | string |
`size` | number |

___

### Comparator

Ƭ  **Comparator**: \"\>=\" \| \"<=\" \| \"\>\" \| \"<\" \| \"!=\" \| \"!==\" \| \"=\" \| \"==\" \| \"===\"

___

### ConfigurationChangeListener

Ƭ  **ConfigurationChangeListener**: (newValue: any, oldValue?: any, propertyName?: string) => void

___

### CryptoImpl

Ƭ  **CryptoImpl**: { MD5: (str: string) => string  }

#### Type declaration:

Name | Type |
------ | ------ |
`MD5` | (str: string) => string |

___

### EOSPause

Ƭ  **EOSPause**: \"short\" \| \"long\"

___

### EnvType

Ƭ  **EnvType**: [PlatfromType](mmir_lib.md#platfromtype) \| \"cordova\"

___

### FileInfo

Ƭ  **FileInfo**: { genPath: string ; name: string ; path: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`genPath` | string |
`name` | string |
`path` | string |

___

### GrammarEngineType

Ƭ  **GrammarEngineType**: \"jscc\" \| \"jison\" \| \"pegjs\"

___

### GrammarType

Ƭ  **GrammarType**: \"source\" \| \"bin\"

___

### LogLevel

Ƭ  **LogLevel**: \"verbose\" \| \"debug\" \| \"info\" \| \"warn\" \| \"error\" \| \"critical\" \| \"disabled\"

___

### LogLevelNum

Ƭ  **LogLevelNum**: 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6

___

### MediaEventHandler

Ƭ  **MediaEventHandler**: [Function](../interfaces/mmir_lib.requirejs.md#function)

___

### MediaEventType

Ƭ  **MediaEventType**: string

___

### MediaPluginEnvType

Ƭ  **MediaPluginEnvType**: \"browser\" \| \"cordova\" \| \"android\" \| \"ios\"

___

### MediaPluginType

Ƭ  **MediaPluginType**: \"audio\" \| \"asr\" \| \"tts\" \| \"prep\" \| string

___

### PlatfromType

Ƭ  **PlatfromType**: \"browser\" \| \"android\" \| \"ios\" \| \"node\" \| \"electron\"

___

### PluginType

Ƭ  **PluginType**: \"custom\" \| [MediaPluginType](mmir_lib.md#mediaplugintype) \| string

___

### ProcessingFunction

Ƭ  **ProcessingFunction**: (input: string \| [Positions](../interfaces/mmir_lib.positions.md), isProcessPositions?: boolean) => string \| [Positions](../interfaces/mmir_lib.positions.md)

___

### ProcessingPositionsInfo

Ƭ  **ProcessingPositionsInfo**: [ProcessingOrderInfo](../interfaces/mmir_lib.processingorderinfo.md) & [PositionsInfo](../interfaces/mmir_lib.positionsinfo.md)

___

### TTSOnComplete

Ƭ  **TTSOnComplete**: () => void

___

### TTSOnError

Ƭ  **TTSOnError**: (error: string \| Error) => void

___

### TTSOnReady

Ƭ  **TTSOnReady**: (isReady?: Boolean, audio?: [IAudio](../interfaces/mmir_lib.iaudio.md)) => void

## Variables

### \_define

• `Const` **\_define**: null \| [RequireJsDefine](../interfaces/mmir_lib.requirejsdefine.md)

___

### \_mmirLibPath

•  **\_mmirLibPath**: string

___

### conf

• `Const` **conf**: [ConfigurationManager](../interfaces/mmir_lib.configurationmanager.md)

___

### ctrl

• `Const` **ctrl**: [ControllerManager](../interfaces/mmir_lib.controllermanager.md)

___

### debug

•  **debug**: boolean

___

### dialog

• `Const` **dialog**: [DialogManager](../interfaces/mmir_lib.dialogmanager.md)

___

### dialogEngine

• `Const` **dialogEngine**: [DialogEngine](../interfaces/mmir_lib.dialogengine.md)

___

### input

• `Const` **input**: [InputManager](../interfaces/mmir_lib.inputmanager.md)

___

### inputEngine

• `Const` **inputEngine**: [InputEngine](../interfaces/mmir_lib.inputengine.md)

___

### jquery

•  **jquery**: undefined \| any

___

### lang

• `Const` **lang**: [LanguageManager](../interfaces/mmir_lib.languagemanager.md)

___

### libMode

•  **libMode**: undefined \| \"min\"

___

### logLevel

•  **logLevel**: [LogLevelNum](mmir_lib.md#loglevelnum) \| [LogLevel](mmir_lib.md#loglevel) \| [LogLevelOptions](../interfaces/mmir_lib.logleveloptions.md)

___

### logTrace

•  **logTrace**: boolean \| { depth: \"full\" \| any ; trace: boolean  }

___

### media

• `Const` **media**: [MediaManager](../interfaces/mmir_lib.mediamanager.md)

___

### mmirName

• `Const` **mmirName**: \"mmir\" \| string

___

### model

• `Const` **model**: [ModelManager](../interfaces/mmir_lib.modelmanager.md)

___

### notifier

• `Const` **notifier**: [NotificationManager](../interfaces/mmir_lib.notificationmanager.md)

___

### present

• `Const` **present**: [PresentationManager](../interfaces/mmir_lib.presentationmanager.md)

___

### require

• `Const` **require**: [RequireJs](../interfaces/mmir_lib.requirejs.md)

___

### res

• `Const` **res**: [Resources](../interfaces/mmir_lib.resources.md)

___

### semantic

• `Const` **semantic**: [SemanticInterpreter](../interfaces/mmir_lib.semanticinterpreter.md)

___

### startModule

•  **startModule**: string

___

### startModules

•  **startModules**: undefined \| string[]

___

### util

• `Const` **util**: [CommonUtils](../interfaces/mmir_lib.commonutils.md)

___

### version

• `Const` **version**: string

___

### viewEngine

•  **viewEngine**: string

## Functions

### config

▸ **config**(`requirejsConfig`: {}): void

#### Parameters:

Name | Type |
------ | ------ |
`requirejsConfig` | {} |

**Returns:** void

___

### isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](mmir_lib.md#comparator)): boolean

#### Parameters:

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](mmir_lib.md#comparator) |

**Returns:** boolean

___

### ready

▸ **ready**(`onFrameworkReady`: (...args: any[]) => any): any

#### Parameters:

Name | Type |
------ | ------ |
`onFrameworkReady` | (...args: any[]) => any |

**Returns:** any
