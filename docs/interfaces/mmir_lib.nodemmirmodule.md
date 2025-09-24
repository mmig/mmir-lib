**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / NodeMmirModule

# Interface: NodeMmirModule

## Hierarchy

* [MmirModule](mmir_lib.mmirmodule.md)

  ↳ **NodeMmirModule**

## Index

### Properties

* [\_config](mmir_lib.nodemmirmodule.md#_config)
* [\_define](mmir_lib.nodemmirmodule.md#_define)
* [\_mmirLibPath](mmir_lib.nodemmirmodule.md#_mmirlibpath)
* [\_requirejs](mmir_lib.nodemmirmodule.md#_requirejs)
* [conf](mmir_lib.nodemmirmodule.md#conf)
* [config](mmir_lib.nodemmirmodule.md#config)
* [ctrl](mmir_lib.nodemmirmodule.md#ctrl)
* [debug](mmir_lib.nodemmirmodule.md#debug)
* [dialog](mmir_lib.nodemmirmodule.md#dialog)
* [dialogEngine](mmir_lib.nodemmirmodule.md#dialogengine)
* [init](mmir_lib.nodemmirmodule.md#init)
* [input](mmir_lib.nodemmirmodule.md#input)
* [inputEngine](mmir_lib.nodemmirmodule.md#inputengine)
* [jquery](mmir_lib.nodemmirmodule.md#jquery)
* [lang](mmir_lib.nodemmirmodule.md#lang)
* [libMode](mmir_lib.nodemmirmodule.md#libmode)
* [logLevel](mmir_lib.nodemmirmodule.md#loglevel)
* [logTrace](mmir_lib.nodemmirmodule.md#logtrace)
* [media](mmir_lib.nodemmirmodule.md#media)
* [mmirName](mmir_lib.nodemmirmodule.md#mmirname)
* [model](mmir_lib.nodemmirmodule.md#model)
* [notifier](mmir_lib.nodemmirmodule.md#notifier)
* [present](mmir_lib.nodemmirmodule.md#present)
* [ready](mmir_lib.nodemmirmodule.md#ready)
* [require](mmir_lib.nodemmirmodule.md#require)
* [res](mmir_lib.nodemmirmodule.md#res)
* [semantic](mmir_lib.nodemmirmodule.md#semantic)
* [startModule](mmir_lib.nodemmirmodule.md#startmodule)
* [startModules](mmir_lib.nodemmirmodule.md#startmodules)
* [util](mmir_lib.nodemmirmodule.md#util)
* [version](mmir_lib.nodemmirmodule.md#version)
* [viewEngine](mmir_lib.nodemmirmodule.md#viewengine)

### Methods

* [isVersion](mmir_lib.nodemmirmodule.md#isversion)

## Properties

### \_config

•  **\_config**: { [field:string]: any;  }

___

### \_define

• `Readonly` **\_define**: null \| [RequireJsDefine](mmir_lib.requirejsdefine.md)

*Inherited from [MmirCore](mmir_lib.mmircore.md).[_define](mmir_lib.mmircore.md#_define)*

___

### \_mmirLibPath

•  **\_mmirLibPath**: string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[_mmirLibPath](mmir_lib.mmircore.md#_mmirlibpath)*

___

### \_requirejs

• `Readonly` **\_requirejs**: [RequireJs](mmir_lib.requirejs.md)

___

### conf

• `Readonly` **conf**: [ConfigurationManager](mmir_lib.configurationmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[conf](mmir_lib.mmirmodule.md#conf)*

___

### config

•  **config**: (requirejsConfig: {}) => void

*Inherited from [MmirCore](mmir_lib.mmircore.md).[config](mmir_lib.mmircore.md#config)*

___

### ctrl

• `Readonly` **ctrl**: [ControllerManager](mmir_lib.controllermanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[ctrl](mmir_lib.mmirmodule.md#ctrl)*

___

### debug

•  **debug**: boolean

*Inherited from [MmirCore](mmir_lib.mmircore.md).[debug](mmir_lib.mmircore.md#debug)*

___

### dialog

• `Readonly` **dialog**: [DialogManager](mmir_lib.dialogmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[dialog](mmir_lib.mmirmodule.md#dialog)*

___

### dialogEngine

• `Readonly` **dialogEngine**: [DialogEngine](mmir_lib.dialogengine.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[dialogEngine](mmir_lib.mmirmodule.md#dialogengine)*

___

### init

•  **init**: (preConfigure?: (mmirCore: [MmirCore](mmir_lib.mmircore.md)) => [MmirModule](mmir_lib.mmirmodule.md) \| void) => [NodeMmirModule](mmir_lib.nodemmirmodule.md)

___

### input

• `Readonly` **input**: [InputManager](mmir_lib.inputmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[input](mmir_lib.mmirmodule.md#input)*

___

### inputEngine

• `Readonly` **inputEngine**: [InputEngine](mmir_lib.inputengine.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[inputEngine](mmir_lib.mmirmodule.md#inputengine)*

___

### jquery

•  **jquery**: undefined \| any

*Inherited from [MmirCore](mmir_lib.mmircore.md).[jquery](mmir_lib.mmircore.md#jquery)*

___

### lang

• `Readonly` **lang**: [LanguageManager](mmir_lib.languagemanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[lang](mmir_lib.mmirmodule.md#lang)*

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

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[media](mmir_lib.mmirmodule.md#media)*

___

### mmirName

• `Readonly` **mmirName**: \"mmir\" \| string

*Inherited from [MmirCore](mmir_lib.mmircore.md).[mmirName](mmir_lib.mmircore.md#mmirname)*

___

### model

• `Readonly` **model**: [ModelManager](mmir_lib.modelmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[model](mmir_lib.mmirmodule.md#model)*

___

### notifier

• `Readonly` **notifier**: [NotificationManager](mmir_lib.notificationmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[notifier](mmir_lib.mmirmodule.md#notifier)*

___

### present

• `Readonly` **present**: [PresentationManager](mmir_lib.presentationmanager.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[present](mmir_lib.mmirmodule.md#present)*

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

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[res](mmir_lib.mmirmodule.md#res)*

___

### semantic

• `Readonly` **semantic**: [SemanticInterpreter](mmir_lib.semanticinterpreter.md)

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[semantic](mmir_lib.mmirmodule.md#semantic)*

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

*Inherited from [MmirModule](mmir_lib.mmirmodule.md).[util](mmir_lib.mmirmodule.md#util)*

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
