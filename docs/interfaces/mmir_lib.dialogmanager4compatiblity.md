> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [DialogManager4Compatiblity](mmir_lib.dialogmanager4compatiblity.md) /

# Interface: DialogManager4Compatiblity

## Hierarchy

* [DialogManager](mmir_lib.dialogmanager.md)

  * **DialogManager4Compatiblity**

## Index

### Properties

* [getOnPageRenderedHandler](mmir_lib.dialogmanager4compatiblity.md#getonpagerenderedhandler)
* [hideCurrentDialog](mmir_lib.dialogmanager4compatiblity.md#hidecurrentdialog)
* [hideWaitDialog](mmir_lib.dialogmanager4compatiblity.md#hidewaitdialog)
* [perform](mmir_lib.dialogmanager4compatiblity.md#perform)
* [performHelper](mmir_lib.dialogmanager4compatiblity.md#performhelper)
* [raise](mmir_lib.dialogmanager4compatiblity.md#raise)
* [render](mmir_lib.dialogmanager4compatiblity.md#render)
* [setOnPageRenderedHandler](mmir_lib.dialogmanager4compatiblity.md#setonpagerenderedhandler)
* [showDialog](mmir_lib.dialogmanager4compatiblity.md#showdialog)
* [showWaitDialog](mmir_lib.dialogmanager4compatiblity.md#showwaitdialog)

## Properties

###  getOnPageRenderedHandler

• **getOnPageRenderedHandler**: *function*

#### Type declaration:

▸ (): *`Function` | undefined*

___

###  hideCurrentDialog

• **hideCurrentDialog**: *function*

#### Type declaration:

▸ (): *void*

___

###  hideWaitDialog

• **hideWaitDialog**: *function*

#### Type declaration:

▸ (): *void*

___

###  perform

• **perform**: *function*

#### Type declaration:

▸ (`ctrlName`: any, `actionName`: any, `data?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | any |
`actionName` | any |
`data?` | any |

___

###  performHelper

• **performHelper**: *function*

#### Type declaration:

▸ (`ctrlName`: any, `helper_method_name`: any, `data?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | any |
`helper_method_name` | any |
`data?` | any |

___

###  raise

• **raise**: *function*

*Inherited from [DialogManager](mmir_lib.dialogmanager.md).[raise](mmir_lib.dialogmanager.md#raise)*

#### Type declaration:

▸ (`eventName`: string, `data?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |
`data?` | any |

___

###  render

• **render**: *function*

#### Type declaration:

▸ (`ctrlName`: any, `viewName`: any, `data?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | any |
`viewName` | any |
`data?` | any |

___

###  setOnPageRenderedHandler

• **setOnPageRenderedHandler**: *function*

#### Type declaration:

▸ (`onPageRenderedHook`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`onPageRenderedHook` | `Function` |

___

###  showDialog

• **showDialog**: *function*

#### Type declaration:

▸ (`ctrlName`: any, `dialogId`: any, `data?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | any |
`dialogId` | any |
`data?` | any |

___

###  showWaitDialog

• **showWaitDialog**: *function*

#### Type declaration:

▸ (`text`: any, `theme`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | any |
`theme` | any |