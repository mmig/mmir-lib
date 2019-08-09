> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [DialogEngine](mmir_lib.dialogengine.md) /

# Interface: DialogEngine

## Hierarchy

* **DialogEngine**

## Index

### Properties

* [doc](mmir_lib.dialogengine.md#doc)
* [getActiveEvents](mmir_lib.dialogengine.md#getactiveevents)
* [getActiveStates](mmir_lib.dialogengine.md#getactivestates)
* [getActiveTransitions](mmir_lib.dialogengine.md#getactivetransitions)
* [getEvents](mmir_lib.dialogengine.md#getevents)
* [getStates](mmir_lib.dialogengine.md#getstates)
* [getTransitions](mmir_lib.dialogengine.md#gettransitions)
* [ignoreScript](mmir_lib.dialogengine.md#ignorescript)
* [load](mmir_lib.dialogengine.md#load)
* [name](mmir_lib.dialogengine.md#name)
* [onload](mmir_lib.dialogengine.md#onload)
* [onraise](mmir_lib.dialogengine.md#onraise)
* [raise](mmir_lib.dialogengine.md#raise)
* [start](mmir_lib.dialogengine.md#start)
* [url](mmir_lib.dialogengine.md#url)

## Properties

###  doc

• **doc**: *string*

___

###  getActiveEvents

• **getActiveEvents**: *function*

#### Type declaration:

▸ (): *any*

___

###  getActiveStates

• **getActiveStates**: *function*

#### Type declaration:

▸ (): *any*

___

###  getActiveTransitions

• **getActiveTransitions**: *function*

#### Type declaration:

▸ (): *any*

___

###  getEvents

• **getEvents**: *function*

#### Type declaration:

▸ (): *any*

___

###  getStates

• **getStates**: *function*

#### Type declaration:

▸ (): *any*

___

###  getTransitions

• **getTransitions**: *function*

#### Type declaration:

▸ (): *any*

___

###  ignoreScript

• **ignoreScript**: *function*

#### Type declaration:

▸ (): *void*

___

###  load

• **load**: *function*

#### Type declaration:

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

###  name

• **name**: *string*

___

###  onload

• **onload**: *function*

#### Type declaration:

▸ (`scion`: any, `deferred`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`scion` | any |
`deferred` | any |

___

###  onraise

• **onraise**: *function*

#### Type declaration:

▸ (): *void*

___

###  raise

• **raise**: *function*

#### Type declaration:

▸ (`event`: any, `eventData`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`eventData` | any |

___

###  start

• **start**: *function*

#### Type declaration:

▸ (): *void*

___

###  url

• **url**: *string*