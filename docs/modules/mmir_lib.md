> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](mmir_lib.md) /

# External module: mmir-lib

the `mmir-lib` package provides the mmir core library
for lightweight, client-centric, multimodal interaction development.

__NOTE__ the API documentation for `mmir-lib` has not been fully migrated to
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
* [DialogManager4Compatiblity](../interfaces/mmir_lib.dialogmanager4compatiblity.md)
* [EncodeUtils](../interfaces/mmir_lib.encodeutils.md)
* [Grammar](../interfaces/mmir_lib.grammar.md)
* [GrammarConverter](../interfaces/mmir_lib.grammarconverter.md)
* [GrammarResult](../interfaces/mmir_lib.grammarresult.md)
* [IAudio](../interfaces/mmir_lib.iaudio.md)
* [IWaitReadyImpl](../interfaces/mmir_lib.iwaitreadyimpl.md)
* [InputEngine](../interfaces/mmir_lib.inputengine.md)
* [InputManager](../interfaces/mmir_lib.inputmanager.md)
* [LanguageManager](../interfaces/mmir_lib.languagemanager.md)
* [MediaManager](../interfaces/mmir_lib.mediamanager.md)
* [MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)
* [MicLevelsAnalysis](../interfaces/mmir_lib.miclevelsanalysis.md)
* [MmirCore](../interfaces/mmir_lib.mmircore.md)
* [MmirModule](../interfaces/mmir_lib.mmirmodule.md)
* [ModelManager](../interfaces/mmir_lib.modelmanager.md)
* [NotificationManager](../interfaces/mmir_lib.notificationmanager.md)
* [PhraseInfo](../interfaces/mmir_lib.phraseinfo.md)
* [PlayError](../interfaces/mmir_lib.playerror.md)
* [Pos](../interfaces/mmir_lib.pos.md)
* [Positions](../interfaces/mmir_lib.positions.md)
* [PresentationManager](../interfaces/mmir_lib.presentationmanager.md)
* [RenderEngine](../interfaces/mmir_lib.renderengine.md)
* [RequireJs](../interfaces/mmir_lib.requirejs.md)
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
* [TTSOnComplete](mmir_lib.md#ttsoncomplete)
* [TTSOnError](mmir_lib.md#ttsonerror)
* [TTSOnReady](mmir_lib.md#ttsonready)

### Variables

* [conf](mmir_lib.md#const-conf)
* [ctrl](mmir_lib.md#const-ctrl)
* [debug](mmir_lib.md#debug)
* [dialog](mmir_lib.md#const-dialog)
* [dialogEngine](mmir_lib.md#const-dialogengine)
* [input](mmir_lib.md#const-input)
* [inputEngine](mmir_lib.md#const-inputengine)
* [lang](mmir_lib.md#const-lang)
* [logLevel](mmir_lib.md#loglevel)
* [logTrace](mmir_lib.md#logtrace)
* [media](mmir_lib.md#const-media)
* [model](mmir_lib.md#const-model)
* [notifier](mmir_lib.md#const-notifier)
* [present](mmir_lib.md#const-present)
* [require](mmir_lib.md#const-require)
* [res](mmir_lib.md#const-res)
* [semantic](mmir_lib.md#const-semantic)
* [startModule](mmir_lib.md#startmodule)
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

*Defined in [mmir.d.ts:457](../../mmir.d.ts#L457)*

___

###  ASROnError

Ƭ **ASROnError**: *function*

*Defined in [mmir.d.ts:455](../../mmir.d.ts#L455)*

#### Type declaration:

▸ (`error`: string | `Error`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | string \| `Error` |

___

###  ASROnStatus

Ƭ **ASROnStatus**: *function*

*Defined in [mmir.d.ts:453](../../mmir.d.ts#L453)*

#### Type declaration:

▸ (`text`: string | `""`, `confidence`: number | undefined, `status`: [ASRStatus](mmir_lib.md#asrstatus), `alternatives?`: `Array<object>`, `unstable?`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string \| `""` |
`confidence` | number \| undefined |
`status` | [ASRStatus](mmir_lib.md#asrstatus) |
`alternatives?` | `Array<object>` |
`unstable?` | string |

___

###  ASRStatus

Ƭ **ASRStatus**: *"FINAL" | "INTERIM" | "INTERMEDIATE" | "RECORDING_BEGIN" | "RECORDING_DONE"*

*Defined in [mmir.d.ts:454](../../mmir.d.ts#L454)*

___

###  Comparator

Ƭ **Comparator**: *">=" | "<=" | ">" | "<" | "!=" | "!==" | "=" | "==" | "==="*

*Defined in [mmir.d.ts:91](../../mmir.d.ts#L91)*

___

###  EOSPause

Ƭ **EOSPause**: *"short" | "long"*

*Defined in [mmir.d.ts:458](../../mmir.d.ts#L458)*

___

###  FileInfo

Ƭ **FileInfo**: *object*

*Defined in [mmir.d.ts:736](../../mmir.d.ts#L736)*

#### Type declaration:

* **genPath**: *string*

* **name**: *string*

* **path**: *string*

___

###  GrammarEngineType

Ƭ **GrammarEngineType**: *"jscc" | "jison" | "pegjs"*

*Defined in [mmir.d.ts:200](../../mmir.d.ts#L200)*

___

###  GrammarType

Ƭ **GrammarType**: *"source" | "bin"*

*Defined in [mmir.d.ts:331](../../mmir.d.ts#L331)*

___

###  LogLevel

Ƭ **LogLevel**: *"verbose" | "debug" | "info" | "warn" | "error" | "critical" | "disabled"*

*Defined in [mmir.d.ts:88](../../mmir.d.ts#L88)*

___

###  LogLevelNum

Ƭ **LogLevelNum**: *`0` | `1` | `2` | `3` | `4` | `5` | `6`*

*Defined in [mmir.d.ts:89](../../mmir.d.ts#L89)*

___

###  MediaEventHandler

Ƭ **MediaEventHandler**: *`Function`*

*Defined in [mmir.d.ts:347](../../mmir.d.ts#L347)*

___

###  MediaEventType

Ƭ **MediaEventType**: *string*

*Defined in [mmir.d.ts:348](../../mmir.d.ts#L348)*

___

###  MediaPluginEnvType

Ƭ **MediaPluginEnvType**: *"browser" | "cordova" | "android" | "ios"*

*Defined in [mmir.d.ts:467](../../mmir.d.ts#L467)*

___

###  MediaPluginType

Ƭ **MediaPluginType**: *"audio" | "asr" | "tts" | "prep" | string*

*Defined in [mmir.d.ts:465](../../mmir.d.ts#L465)*

___

###  TTSOnComplete

Ƭ **TTSOnComplete**: *function*

*Defined in [mmir.d.ts:449](../../mmir.d.ts#L449)*

#### Type declaration:

▸ (): *void*

___

###  TTSOnError

Ƭ **TTSOnError**: *function*

*Defined in [mmir.d.ts:450](../../mmir.d.ts#L450)*

#### Type declaration:

▸ (`error`: string | `Error`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error` | string \| `Error` |

___

###  TTSOnReady

Ƭ **TTSOnReady**: *function*

*Defined in [mmir.d.ts:451](../../mmir.d.ts#L451)*

#### Type declaration:

▸ (`isReady?`: `Boolean`, `audio?`: [IAudio](../interfaces/mmir_lib.iaudio.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`isReady?` | `Boolean` |
`audio?` | [IAudio](../interfaces/mmir_lib.iaudio.md) |

## Variables

### `Const` conf

• **conf**: *[ConfigurationManager](../interfaces/mmir_lib.configurationmanager.md)*

*Defined in [mmir.d.ts:40](../../mmir.d.ts#L40)*

___

### `Const` ctrl

• **ctrl**: *[ControllerManager](../interfaces/mmir_lib.controllermanager.md)*

*Defined in [mmir.d.ts:42](../../mmir.d.ts#L42)*

___

###  debug

• **debug**: *boolean*

*Defined in [mmir.d.ts:34](../../mmir.d.ts#L34)*

___

### `Const` dialog

• **dialog**: *[DialogManager](../interfaces/mmir_lib.dialogmanager.md)*

*Defined in [mmir.d.ts:44](../../mmir.d.ts#L44)*

___

### `Const` dialogEngine

• **dialogEngine**: *[DialogEngine](../interfaces/mmir_lib.dialogengine.md)*

*Defined in [mmir.d.ts:43](../../mmir.d.ts#L43)*

___

### `Const` input

• **input**: *[InputManager](../interfaces/mmir_lib.inputmanager.md)*

*Defined in [mmir.d.ts:46](../../mmir.d.ts#L46)*

___

### `Const` inputEngine

• **inputEngine**: *[InputEngine](../interfaces/mmir_lib.inputengine.md)*

*Defined in [mmir.d.ts:45](../../mmir.d.ts#L45)*

___

### `Const` lang

• **lang**: *[LanguageManager](../interfaces/mmir_lib.languagemanager.md)*

*Defined in [mmir.d.ts:47](../../mmir.d.ts#L47)*

___

###  logLevel

• **logLevel**: *[LogLevelNum](mmir_lib.md#loglevelnum) | [LogLevel](mmir_lib.md#loglevel)*

*Defined in [mmir.d.ts:35](../../mmir.d.ts#L35)*

___

###  logTrace

• **logTrace**: *boolean | object*

*Defined in [mmir.d.ts:36](../../mmir.d.ts#L36)*

___

### `Const` media

• **media**: *[MediaManager](../interfaces/mmir_lib.mediamanager.md)*

*Defined in [mmir.d.ts:48](../../mmir.d.ts#L48)*

___

### `Const` model

• **model**: *[ModelManager](../interfaces/mmir_lib.modelmanager.md)*

*Defined in [mmir.d.ts:49](../../mmir.d.ts#L49)*

___

### `Const` notifier

• **notifier**: *[NotificationManager](../interfaces/mmir_lib.notificationmanager.md)*

*Defined in [mmir.d.ts:50](../../mmir.d.ts#L50)*

___

### `Const` present

• **present**: *[PresentationManager](../interfaces/mmir_lib.presentationmanager.md)*

*Defined in [mmir.d.ts:51](../../mmir.d.ts#L51)*

___

### `Const` require

• **require**: *[RequireJs](../interfaces/mmir_lib.requirejs.md)*

*Defined in [mmir.d.ts:29](../../mmir.d.ts#L29)*

___

### `Const` res

• **res**: *[Resources](../interfaces/mmir_lib.resources.md)*

*Defined in [mmir.d.ts:41](../../mmir.d.ts#L41)*

___

### `Const` semantic

• **semantic**: *[SemanticInterpreter](../interfaces/mmir_lib.semanticinterpreter.md)*

*Defined in [mmir.d.ts:52](../../mmir.d.ts#L52)*

___

###  startModule

• **startModule**: *string*

*Defined in [mmir.d.ts:32](../../mmir.d.ts#L32)*

___

### `Const` util

• **util**: *[CommonUtils](../interfaces/mmir_lib.commonutils.md)*

*Defined in [mmir.d.ts:39](../../mmir.d.ts#L39)*

___

### `Const` version

• **version**: *string*

*Defined in [mmir.d.ts:30](../../mmir.d.ts#L30)*

___

###  viewEngine

• **viewEngine**: *string*

*Defined in [mmir.d.ts:33](../../mmir.d.ts#L33)*

## Functions

###  config

▸ **config**(`requirejsConfig`: `__type`): *void*

*Defined in [mmir.d.ts:26](../../mmir.d.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`requirejsConfig` | `__type` |

**Returns:** *void*

___

###  isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](mmir_lib.md#comparator)): *boolean*

*Defined in [mmir.d.ts:28](../../mmir.d.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](mmir_lib.md#comparator) |

**Returns:** *boolean*

___

###  ready

▸ **ready**(`onFrameworkReady`: function): *any*

*Defined in [mmir.d.ts:27](../../mmir.d.ts#L27)*

**Parameters:**

▪ **onFrameworkReady**: *function*

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *any*