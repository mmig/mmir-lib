> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [MmirCore](mmir_lib.mmircore.md) /

# Interface: MmirCore

## Hierarchy

* **MmirCore**

  * [MmirModule](mmir_lib.mmirmodule.md)

## Index

### Properties

* [config](mmir_lib.mmircore.md#config)
* [debug](mmir_lib.mmircore.md#debug)
* [logLevel](mmir_lib.mmircore.md#loglevel)
* [logTrace](mmir_lib.mmircore.md#logtrace)
* [ready](mmir_lib.mmircore.md#ready)
* [require](mmir_lib.mmircore.md#require)
* [startModule](mmir_lib.mmircore.md#startmodule)
* [version](mmir_lib.mmircore.md#version)
* [viewEngine](mmir_lib.mmircore.md#viewengine)

### Methods

* [isVersion](mmir_lib.mmircore.md#isversion)

## Properties

###  config

• **config**: *function*

#### Type declaration:

▸ (`requirejsConfig`: `__type`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`requirejsConfig` | `__type` |

___

###  debug

• **debug**: *boolean*

___

###  logLevel

• **logLevel**: *[LogLevelNum](../modules/mmir_lib.md#loglevelnum) | [LogLevel](../modules/mmir_lib.md#loglevel)*

___

###  logTrace

• **logTrace**: *boolean | object*

___

###  ready

• **ready**: *function*

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

___

###  startModule

• **startModule**: *string*

___

###  version

• **version**: *string*

___

###  viewEngine

• **viewEngine**: *string*

## Methods

###  isVersion

▸ **isVersion**(`verion`: string, `comparator`: [Comparator](../modules/mmir_lib.md#comparator)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`verion` | string |
`comparator` | [Comparator](../modules/mmir_lib.md#comparator) |

**Returns:** *boolean*