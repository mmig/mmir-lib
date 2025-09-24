**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / MmirCore

# Interface: MmirCore

## Hierarchy

* **MmirCore**

  ↳ [MmirModule](mmir_lib.mmirmodule.md)

## Index

### Properties

* [\_define](mmir_lib.mmircore.md#_define)
* [\_mmirLibPath](mmir_lib.mmircore.md#_mmirlibpath)
* [config](mmir_lib.mmircore.md#config)
* [debug](mmir_lib.mmircore.md#debug)
* [jquery](mmir_lib.mmircore.md#jquery)
* [libMode](mmir_lib.mmircore.md#libmode)
* [logLevel](mmir_lib.mmircore.md#loglevel)
* [logTrace](mmir_lib.mmircore.md#logtrace)
* [mmirName](mmir_lib.mmircore.md#mmirname)
* [ready](mmir_lib.mmircore.md#ready)
* [require](mmir_lib.mmircore.md#require)
* [startModule](mmir_lib.mmircore.md#startmodule)
* [startModules](mmir_lib.mmircore.md#startmodules)
* [version](mmir_lib.mmircore.md#version)
* [viewEngine](mmir_lib.mmircore.md#viewengine)

### Methods

* [isVersion](mmir_lib.mmircore.md#isversion)

## Properties

### \_define

• `Readonly` **\_define**: null \| [RequireJsDefine](mmir_lib.requirejsdefine.md)

___

### \_mmirLibPath

•  **\_mmirLibPath**: string

___

### config

•  **config**: (requirejsConfig: {}) => void

___

### debug

•  **debug**: boolean

___

### jquery

•  **jquery**: undefined \| any

___

### libMode

•  **libMode**: undefined \| \"min\"

___

### logLevel

•  **logLevel**: [LogLevelNum](../modules/mmir_lib.md#loglevelnum) \| [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelOptions](mmir_lib.logleveloptions.md)

___

### logTrace

•  **logTrace**: boolean \| { depth: \"full\" \| any ; trace: boolean  }

___

### mmirName

• `Readonly` **mmirName**: \"mmir\" \| string

___

### ready

•  **ready**: (onFrameworkReady: (...args: any[]) => any) => any

___

### require

• `Readonly` **require**: [RequireJs](mmir_lib.requirejs.md)

___

### startModule

•  **startModule**: string

___

### startModules

•  **startModules**: undefined \| string[]

___

### version

• `Readonly` **version**: string

___

### viewEngine

•  **viewEngine**: string

## Methods

### isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](../modules/mmir_lib.md#comparator)): boolean

#### Parameters:

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](../modules/mmir_lib.md#comparator) |

**Returns:** boolean
