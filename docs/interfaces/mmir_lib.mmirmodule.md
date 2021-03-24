**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / MmirModule

# Interface: MmirModule

## Hierarchy

* [MmirCore](mmir_lib.mmircore.md)

  ↳ **MmirModule**

  ↳↳ [NodeMmirModule](mmir_lib.nodemmirmodule.md)

## Index

### Properties

* [\_define](mmir_lib.mmirmodule.md#_define)
* [\_mmirLibPath](mmir_lib.mmirmodule.md#_mmirlibpath)
* [conf](mmir_lib.mmirmodule.md#conf)
* [config](mmir_lib.mmirmodule.md#config)
* [ctrl](mmir_lib.mmirmodule.md#ctrl)
* [debug](mmir_lib.mmirmodule.md#debug)
* [dialog](mmir_lib.mmirmodule.md#dialog)
* [dialogEngine](mmir_lib.mmirmodule.md#dialogengine)
* [input](mmir_lib.mmirmodule.md#input)
* [inputEngine](mmir_lib.mmirmodule.md#inputengine)
* [jquery](mmir_lib.mmirmodule.md#jquery)
* [lang](mmir_lib.mmirmodule.md#lang)
* [libMode](mmir_lib.mmirmodule.md#libmode)
* [logLevel](mmir_lib.mmirmodule.md#loglevel)
* [logTrace](mmir_lib.mmirmodule.md#logtrace)
* [media](mmir_lib.mmirmodule.md#media)
* [mmirName](mmir_lib.mmirmodule.md#mmirname)
* [model](mmir_lib.mmirmodule.md#model)
* [notifier](mmir_lib.mmirmodule.md#notifier)
* [present](mmir_lib.mmirmodule.md#present)
* [ready](mmir_lib.mmirmodule.md#ready)
* [require](mmir_lib.mmirmodule.md#require)
* [res](mmir_lib.mmirmodule.md#res)
* [semantic](mmir_lib.mmirmodule.md#semantic)
* [startModule](mmir_lib.mmirmodule.md#startmodule)
* [startModules](mmir_lib.mmirmodule.md#startmodules)
* [util](mmir_lib.mmirmodule.md#util)
* [version](mmir_lib.mmirmodule.md#version)
* [viewEngine](mmir_lib.mmirmodule.md#viewengine)

### Methods

* [isVersion](mmir_lib.mmirmodule.md#isversion)

## Properties

### \_define

• `Readonly` **\_define**: null \| [RequireJsDefine](mmir_lib.requirejsdefine.md)

*Inherited from [MmirCore](mmir_lib.mmircore.md).[_define](mmir_lib.mmircore.md#_define)*

___

### \_mmirLibPath

•  **\_mmirLibPath**: string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[_mmirLibPath](mmir_lib.mmircore.md#_mmirlibpath)*

___

### conf

• `Readonly` **conf**: [ConfigurationManager](mmir_lib.configurationmanager.md)

___

### config

•  **config**: (requirejsConfig: {}) => void

*Inherited from [MmirCore](mmir_lib.mmircore.md).[config](mmir_lib.mmircore.md#config)*

___

### ctrl

• `Readonly` **ctrl**: [ControllerManager](mmir_lib.controllermanager.md)

___

### debug

•  **debug**: boolean

*Inherited from [MmirCore](mmir_lib.mmircore.md).[debug](mmir_lib.mmircore.md#debug)*

___

### dialog

• `Readonly` **dialog**: [DialogManager](mmir_lib.dialogmanager.md)

___

### dialogEngine

• `Readonly` **dialogEngine**: [DialogEngine](mmir_lib.dialogengine.md)

___

### input

• `Readonly` **input**: [InputManager](mmir_lib.inputmanager.md)

___

### inputEngine

• `Readonly` **inputEngine**: [InputEngine](mmir_lib.inputengine.md)

___

### jquery

•  **jquery**: undefined \| any

*Inherited from [MmirCore](mmir_lib.mmircore.md).[jquery](mmir_lib.mmircore.md#jquery)*

___

### lang

• `Readonly` **lang**: [LanguageManager](mmir_lib.languagemanager.md)

___

### libMode

•  **libMode**: undefined \| \"min\"

*Inherited from [MmirCore](mmir_lib.mmircore.md).[libMode](mmir_lib.mmircore.md#libmode)*

___

### logLevel

•  **logLevel**: [LogLevelNum](../modules/mmir_lib.md#loglevelnum) \| [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelOptions](mmir_lib.logleveloptions.md)

*Inherited from [MmirCore](mmir_lib.mmircore.md).[logLevel](mmir_lib.mmircore.md#loglevel)*

___

### logTrace

•  **logTrace**: boolean \| { depth: \"full\" \| any ; trace: boolean  }

*Inherited from [MmirCore](mmir_lib.mmircore.md).[logTrace](mmir_lib.mmircore.md#logtrace)*

___

### media

• `Readonly` **media**: [MediaManager](mmir_lib.mediamanager.md)

___

### mmirName

• `Readonly` **mmirName**: \"mmir\" \| string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[mmirName](mmir_lib.mmircore.md#mmirname)*

___

### model

• `Readonly` **model**: [ModelManager](mmir_lib.modelmanager.md)

___

### notifier

• `Readonly` **notifier**: [NotificationManager](mmir_lib.notificationmanager.md)

___

### present

• `Readonly` **present**: [PresentationManager](mmir_lib.presentationmanager.md)

___

### ready

•  **ready**: (onFrameworkReady: (...args: any[]) => any) => any

*Inherited from [MmirCore](mmir_lib.mmircore.md).[ready](mmir_lib.mmircore.md#ready)*

___

### require

• `Readonly` **require**: [RequireJs](mmir_lib.requirejs.md)

*Inherited from [MmirCore](mmir_lib.mmircore.md).[require](mmir_lib.mmircore.md#require)*

___

### res

• `Readonly` **res**: [Resources](mmir_lib.resources.md)

___

### semantic

• `Readonly` **semantic**: [SemanticInterpreter](mmir_lib.semanticinterpreter.md)

___

### startModule

•  **startModule**: string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[startModule](mmir_lib.mmircore.md#startmodule)*

___

### startModules

•  **startModules**: undefined \| string[]

*Inherited from [MmirCore](mmir_lib.mmircore.md).[startModules](mmir_lib.mmircore.md#startmodules)*

___

### util

• `Readonly` **util**: [CommonUtils](mmir_lib.commonutils.md)

___

### version

• `Readonly` **version**: string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[version](mmir_lib.mmircore.md#version)*

___

### viewEngine

•  **viewEngine**: string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[viewEngine](mmir_lib.mmircore.md#viewengine)*

## Methods

### isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](../modules/mmir_lib.md#comparator)): boolean

*Inherited from [MmirCore](mmir_lib.mmircore.md).[isVersion](mmir_lib.mmircore.md#isversion)*

#### Parameters:

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](../modules/mmir_lib.md#comparator) |

**Returns:** boolean
