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

*Defined in [mmir.d.ts:768](../../mmir.d.ts#L768)*

#### Type declaration:

▸ (): *`Function` | undefined*

___

###  hideCurrentDialog

• **hideCurrentDialog**: *function*

*Defined in [mmir.d.ts:769](../../mmir.d.ts#L769)*

#### Type declaration:

▸ (): *void*

___

###  hideWaitDialog

• **hideWaitDialog**: *function*

*Defined in [mmir.d.ts:770](../../mmir.d.ts#L770)*

#### Type declaration:

▸ (): *void*

___

###  perform

• **perform**: *function*

*Defined in [mmir.d.ts:771](../../mmir.d.ts#L771)*

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

*Defined in [mmir.d.ts:772](../../mmir.d.ts#L772)*

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

*Defined in [mmir.d.ts:309](../../mmir.d.ts#L309)*

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

*Defined in [mmir.d.ts:773](../../mmir.d.ts#L773)*

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

*Defined in [mmir.d.ts:774](../../mmir.d.ts#L774)*

#### Type declaration:

▸ (`onPageRenderedHook`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`onPageRenderedHook` | `Function` |

___

###  showDialog

• **showDialog**: *function*

*Defined in [mmir.d.ts:775](../../mmir.d.ts#L775)*

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

*Defined in [mmir.d.ts:776](../../mmir.d.ts#L776)*

#### Type declaration:

▸ (`text`: any, `theme`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | any |
`theme` | any |