> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [RenderEngine](mmir_lib.renderengine.md) /

# Interface: RenderEngine

## Hierarchy

* **RenderEngine**

## Index

### Methods

* [hideCurrentDialog](mmir_lib.renderengine.md#hidecurrentdialog)
* [hideWaitDialog](mmir_lib.renderengine.md#hidewaitdialog)
* [render](mmir_lib.renderengine.md#render)
* [showDialog](mmir_lib.renderengine.md#showdialog)
* [showWaitDialog](mmir_lib.renderengine.md#showwaitdialog)

## Methods

###  hideCurrentDialog

▸ **hideCurrentDialog**(): *void*

*Defined in [mmir.d.ts:588](../../mmir.d.ts#L588)*

**Returns:** *void*

___

###  hideWaitDialog

▸ **hideWaitDialog**(): *void*

*Defined in [mmir.d.ts:589](../../mmir.d.ts#L589)*

**Returns:** *void*

___

###  render

▸ **render**(`ctrlName`: string, `viewName`: string, `view`: [View](../classes/mmir_lib.view.md), `ctrl`: [Controller](../classes/mmir_lib.controller.md), `data?`: any): *void*

*Defined in [mmir.d.ts:590](../../mmir.d.ts#L590)*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`viewName` | string |
`view` | [View](../classes/mmir_lib.view.md) |
`ctrl` | [Controller](../classes/mmir_lib.controller.md) |
`data?` | any |

**Returns:** *void*

___

###  showDialog

▸ **showDialog**(`ctrlName`: string, `dialogId?`: string, `data?`: any): *void*

*Defined in [mmir.d.ts:591](../../mmir.d.ts#L591)*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`dialogId?` | string |
`data?` | any |

**Returns:** *void*

___

###  showWaitDialog

▸ **showWaitDialog**(`text?`: string, `theme?`: string): *void*

*Defined in [mmir.d.ts:592](../../mmir.d.ts#L592)*

**Parameters:**

Name | Type |
------ | ------ |
`text?` | string |
`theme?` | string |

**Returns:** *void*