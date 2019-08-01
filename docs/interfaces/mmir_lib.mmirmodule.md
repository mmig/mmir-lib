> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [MmirModule](mmir_lib.mmirmodule.md) /

# Interface: MmirModule

## Hierarchy

* [MmirCore](mmir_lib.mmircore.md)

  * **MmirModule**

## Index

### Properties

* [conf](mmir_lib.mmirmodule.md#conf)
* [config](mmir_lib.mmirmodule.md#config)
* [ctrl](mmir_lib.mmirmodule.md#ctrl)
* [debug](mmir_lib.mmirmodule.md#debug)
* [dialog](mmir_lib.mmirmodule.md#dialog)
* [dialogEngine](mmir_lib.mmirmodule.md#dialogengine)
* [input](mmir_lib.mmirmodule.md#input)
* [inputEngine](mmir_lib.mmirmodule.md#inputengine)
* [lang](mmir_lib.mmirmodule.md#lang)
* [logLevel](mmir_lib.mmirmodule.md#loglevel)
* [logTrace](mmir_lib.mmirmodule.md#logtrace)
* [media](mmir_lib.mmirmodule.md#media)
* [model](mmir_lib.mmirmodule.md#model)
* [notifier](mmir_lib.mmirmodule.md#notifier)
* [present](mmir_lib.mmirmodule.md#present)
* [ready](mmir_lib.mmirmodule.md#ready)
* [require](mmir_lib.mmirmodule.md#require)
* [res](mmir_lib.mmirmodule.md#res)
* [semantic](mmir_lib.mmirmodule.md#semantic)
* [startModule](mmir_lib.mmirmodule.md#startmodule)
* [util](mmir_lib.mmirmodule.md#util)
* [version](mmir_lib.mmirmodule.md#version)
* [viewEngine](mmir_lib.mmirmodule.md#viewengine)

### Methods

* [isVersion](mmir_lib.mmirmodule.md#isversion)

## Properties

###  conf

• **conf**: *[ConfigurationManager](mmir_lib.configurationmanager.md)*

*Defined in [mmir.d.ts:73](../../mmir.d.ts#L73)*

___

###  config

• **config**: *function*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[config](mmir_lib.mmircore.md#config)*

*Defined in [mmir.d.ts:59](../../mmir.d.ts#L59)*

#### Type declaration:

▸ (`requirejsConfig`: `__type`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`requirejsConfig` | `__type` |

___

###  ctrl

• **ctrl**: *[ControllerManager](mmir_lib.controllermanager.md)*

*Defined in [mmir.d.ts:75](../../mmir.d.ts#L75)*

___

###  debug

• **debug**: *boolean*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[debug](mmir_lib.mmircore.md#debug)*

*Defined in [mmir.d.ts:66](../../mmir.d.ts#L66)*

___

###  dialog

• **dialog**: *[DialogManager](mmir_lib.dialogmanager.md)*

*Defined in [mmir.d.ts:77](../../mmir.d.ts#L77)*

___

###  dialogEngine

• **dialogEngine**: *[DialogEngine](mmir_lib.dialogengine.md)*

*Defined in [mmir.d.ts:76](../../mmir.d.ts#L76)*

___

###  input

• **input**: *[InputManager](mmir_lib.inputmanager.md)*

*Defined in [mmir.d.ts:79](../../mmir.d.ts#L79)*

___

###  inputEngine

• **inputEngine**: *[InputEngine](mmir_lib.inputengine.md)*

*Defined in [mmir.d.ts:78](../../mmir.d.ts#L78)*

___

###  lang

• **lang**: *[LanguageManager](mmir_lib.languagemanager.md)*

*Defined in [mmir.d.ts:80](../../mmir.d.ts#L80)*

___

###  logLevel

• **logLevel**: *[LogLevelNum](../modules/mmir_lib.md#loglevelnum) | [LogLevel](../modules/mmir_lib.md#loglevel)*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[logLevel](mmir_lib.mmircore.md#loglevel)*

*Defined in [mmir.d.ts:67](../../mmir.d.ts#L67)*

___

###  logTrace

• **logTrace**: *boolean | object*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[logTrace](mmir_lib.mmircore.md#logtrace)*

*Defined in [mmir.d.ts:68](../../mmir.d.ts#L68)*

___

###  media

• **media**: *[MediaManager](mmir_lib.mediamanager.md)*

*Defined in [mmir.d.ts:81](../../mmir.d.ts#L81)*

___

###  model

• **model**: *[ModelManager](mmir_lib.modelmanager.md)*

*Defined in [mmir.d.ts:82](../../mmir.d.ts#L82)*

___

###  notifier

• **notifier**: *[NotificationManager](mmir_lib.notificationmanager.md)*

*Defined in [mmir.d.ts:83](../../mmir.d.ts#L83)*

___

###  present

• **present**: *[PresentationManager](mmir_lib.presentationmanager.md)*

*Defined in [mmir.d.ts:84](../../mmir.d.ts#L84)*

___

###  ready

• **ready**: *function*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[ready](mmir_lib.mmircore.md#ready)*

*Defined in [mmir.d.ts:60](../../mmir.d.ts#L60)*

#### Type declaration:

▸ (`onFrameworkReady`: function): *any*

**Parameters:**

▪ **onFrameworkReady**: *function*

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

###  require

• **require**: *[RequireJs](mmir_lib.requirejs.md)*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[require](mmir_lib.mmircore.md#require)*

*Defined in [mmir.d.ts:62](../../mmir.d.ts#L62)*

___

###  res

• **res**: *[Resources](mmir_lib.resources.md)*

*Defined in [mmir.d.ts:74](../../mmir.d.ts#L74)*

___

###  semantic

• **semantic**: *[SemanticInterpreter](mmir_lib.semanticinterpreter.md)*

*Defined in [mmir.d.ts:85](../../mmir.d.ts#L85)*

___

###  startModule

• **startModule**: *string*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[startModule](mmir_lib.mmircore.md#startmodule)*

*Defined in [mmir.d.ts:64](../../mmir.d.ts#L64)*

___

###  util

• **util**: *[CommonUtils](mmir_lib.commonutils.md)*

*Defined in [mmir.d.ts:72](../../mmir.d.ts#L72)*

___

###  version

• **version**: *string*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[version](mmir_lib.mmircore.md#version)*

*Defined in [mmir.d.ts:63](../../mmir.d.ts#L63)*

___

###  viewEngine

• **viewEngine**: *string*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[viewEngine](mmir_lib.mmircore.md#viewengine)*

*Defined in [mmir.d.ts:65](../../mmir.d.ts#L65)*

## Methods

###  isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](../modules/mmir_lib.md#comparator)): *boolean*

*Inherited from [MmirCore](mmir_lib.mmircore.md).[isVersion](mmir_lib.mmircore.md#isversion)*

*Defined in [mmir.d.ts:61](../../mmir.d.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](../modules/mmir_lib.md#comparator) |

**Returns:** *boolean*