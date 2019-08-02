> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [ControllerManager](mmir_lib.controllermanager.md) /

# Interface: ControllerManager

## Hierarchy

* **ControllerManager**

## Index

### Properties

* [create](mmir_lib.controllermanager.md#create)
* [get](mmir_lib.controllermanager.md#get)
* [getNames](mmir_lib.controllermanager.md#getnames)
* [init](mmir_lib.controllermanager.md#init)
* [perform](mmir_lib.controllermanager.md#perform)
* [performHelper](mmir_lib.controllermanager.md#performhelper)

## Properties

###  create

• **create**: *function*

#### Type declaration:

▸ (): *any*

___

###  get

• **get**: *function*

#### Type declaration:

▸ (`ctrlName`: string): *[Controller](../classes/mmir_lib.controller.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |

___

###  getNames

• **getNames**: *function*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  init

• **init**: *function*

#### Type declaration:

▸ (`callback`: any, `ctx`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | any |
`ctx` | any |

___

###  perform

• **perform**: *function*

#### Type declaration:

▸ (`ctrlName`: string, `actionName`: string, `data?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`actionName` | string |
`data?` | any |

___

###  performHelper

• **performHelper**: *function*

#### Type declaration:

▸ (`ctrlName`: string, `actionName`: string, `data?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`actionName` | string |
`data?` | any |