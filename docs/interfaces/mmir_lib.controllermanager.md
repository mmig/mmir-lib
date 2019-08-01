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

*Defined in [mmir.d.ts:284](../../mmir.d.ts#L284)*

#### Type declaration:

▸ (): *any*

___

###  get

• **get**: *function*

*Defined in [mmir.d.ts:285](../../mmir.d.ts#L285)*

#### Type declaration:

▸ (`ctrlName`: string): *[Controller](../classes/mmir_lib.controller.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |

___

###  getNames

• **getNames**: *function*

*Defined in [mmir.d.ts:286](../../mmir.d.ts#L286)*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  init

• **init**: *function*

*Defined in [mmir.d.ts:287](../../mmir.d.ts#L287)*

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

*Defined in [mmir.d.ts:288](../../mmir.d.ts#L288)*

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

*Defined in [mmir.d.ts:289](../../mmir.d.ts#L289)*

#### Type declaration:

▸ (`ctrlName`: string, `actionName`: string, `data?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`actionName` | string |
`data?` | any |