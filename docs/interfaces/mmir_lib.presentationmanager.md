> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [PresentationManager](mmir_lib.presentationmanager.md) /

# Interface: PresentationManager

## Hierarchy

* **PresentationManager**

## Index

### Properties

* [_fireRenderEvent](mmir_lib.presentationmanager.md#_firerenderevent)
* [addLayout](mmir_lib.presentationmanager.md#addlayout)
* [addPartial](mmir_lib.presentationmanager.md#addpartial)
* [addView](mmir_lib.presentationmanager.md#addview)
* [callRenderEngine](mmir_lib.presentationmanager.md#callrenderengine)
* [getLayout](mmir_lib.presentationmanager.md#getlayout)
* [getPartial](mmir_lib.presentationmanager.md#getpartial)
* [getView](mmir_lib.presentationmanager.md#getview)
* [hideCurrentDialog](mmir_lib.presentationmanager.md#hidecurrentdialog)
* [hideWaitDialog](mmir_lib.presentationmanager.md#hidewaitdialog)
* [on_before_page_load](mmir_lib.presentationmanager.md#optional-on_before_page_load)
* [on_before_page_prepare](mmir_lib.presentationmanager.md#optional-on_before_page_prepare)
* [on_page_load](mmir_lib.presentationmanager.md#optional-on_page_load)
* [pageIndex](mmir_lib.presentationmanager.md#pageindex)
* [render](mmir_lib.presentationmanager.md#render)
* [setRenderEngine](mmir_lib.presentationmanager.md#setrenderengine)
* [showDialog](mmir_lib.presentationmanager.md#showdialog)
* [showWaitDialog](mmir_lib.presentationmanager.md#showwaitdialog)

## Properties

###  _fireRenderEvent

• **_fireRenderEvent**: *function*

*Defined in [mmir.d.ts:567](../../mmir.d.ts#L567)*

NOTE view-dependent events are named: "<event name>_<view name>"

#### Type declaration:

▸ (`ctrl`: [Controller](../classes/mmir_lib.controller.md), `eventName`: "before_page_prepare" | "before_page_load" | "on_page_load" | string, `eventData`: any, `pageOptions`: any): *any | false*

**Parameters:**

Name | Type |
------ | ------ |
`ctrl` | [Controller](../classes/mmir_lib.controller.md) |
`eventName` | "before_page_prepare" \| "before_page_load" \| "on_page_load" \| string |
`eventData` | any |
`pageOptions` | any |

___

###  addLayout

• **addLayout**: *function*

*Defined in [mmir.d.ts:552](../../mmir.d.ts#L552)*

#### Type declaration:

▸ (`layout`: [Layout](../classes/mmir_lib.layout.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`layout` | [Layout](../classes/mmir_lib.layout.md) |

___

###  addPartial

• **addPartial**: *function*

*Defined in [mmir.d.ts:553](../../mmir.d.ts#L553)*

#### Type declaration:

▸ (`ctrlName`: string, `partial`: [Partial](../classes/mmir_lib.partial.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`partial` | [Partial](../classes/mmir_lib.partial.md) |

___

###  addView

• **addView**: *function*

*Defined in [mmir.d.ts:554](../../mmir.d.ts#L554)*

#### Type declaration:

▸ (`ctrlName`: string, `view`: [View](../classes/mmir_lib.view.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`view` | [View](../classes/mmir_lib.view.md) |

___

###  callRenderEngine

• **callRenderEngine**: *function*

*Defined in [mmir.d.ts:555](../../mmir.d.ts#L555)*

#### Type declaration:

▸ (`funcName`: string, `args`: `Array<any>`): *any*

**Parameters:**

Name | Type |
------ | ------ |
`funcName` | string |
`args` | `Array<any>` |

___

###  getLayout

• **getLayout**: *function*

*Defined in [mmir.d.ts:556](../../mmir.d.ts#L556)*

#### Type declaration:

▸ (`layoutName`: string, `doUseDefaultIfMissing`: boolean): *any*

**Parameters:**

Name | Type |
------ | ------ |
`layoutName` | string |
`doUseDefaultIfMissing` | boolean |

___

###  getPartial

• **getPartial**: *function*

*Defined in [mmir.d.ts:557](../../mmir.d.ts#L557)*

#### Type declaration:

▸ (`controllerName`: string, `partialName`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`controllerName` | string |
`partialName` | string |

___

###  getView

• **getView**: *function*

*Defined in [mmir.d.ts:558](../../mmir.d.ts#L558)*

#### Type declaration:

▸ (`controllerName`: string, `viewName`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`controllerName` | string |
`viewName` | string |

___

###  hideCurrentDialog

• **hideCurrentDialog**: *function*

*Defined in [mmir.d.ts:559](../../mmir.d.ts#L559)*

#### Type declaration:

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

###  hideWaitDialog

• **hideWaitDialog**: *function*

*Defined in [mmir.d.ts:560](../../mmir.d.ts#L560)*

#### Type declaration:

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

### `Optional` on_before_page_load

• **on_before_page_load**? : *function*

*Defined in [mmir.d.ts:572](../../mmir.d.ts#L572)*

NOTE view-dependent event handler can be set via: on_before_page_load_<view name>

#### Type declaration:

▸ (`ctrlName`: string, `eventName`: "before_page_load", `eventData`: any, `pageOptions`: any): *any | false*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`eventName` | "before_page_load" |
`eventData` | any |
`pageOptions` | any |

___

### `Optional` on_before_page_prepare

• **on_before_page_prepare**? : *function*

*Defined in [mmir.d.ts:570](../../mmir.d.ts#L570)*

NOTE view-dependent event handler can be set via: on_before_page_prepare_<view name>

#### Type declaration:

▸ (`ctrlName`: string, `eventName`: "before_page_prepare", `eventData`: any, `pageOptions`: any): *any | false*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`eventName` | "before_page_prepare" |
`eventData` | any |
`pageOptions` | any |

___

### `Optional` on_page_load

• **on_page_load**? : *function*

*Defined in [mmir.d.ts:574](../../mmir.d.ts#L574)*

NOTE view-dependent event handler can be set via: on_page_load_<view name>

#### Type declaration:

▸ (`ctrlName`: string, `eventName`: "on_page_load", `eventData`: any, `pageOptions`: any): *any | false*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`eventName` | "on_page_load" |
`eventData` | any |
`pageOptions` | any |

___

###  pageIndex

• **pageIndex**: *number*

*Defined in [mmir.d.ts:551](../../mmir.d.ts#L551)*

___

###  render

• **render**: *function*

*Defined in [mmir.d.ts:561](../../mmir.d.ts#L561)*

#### Type declaration:

▸ (`ctrlName`: string, `viewName`: string, `data?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`viewName` | string |
`data?` | any |

___

###  setRenderEngine

• **setRenderEngine**: *function*

*Defined in [mmir.d.ts:562](../../mmir.d.ts#L562)*

#### Type declaration:

▸ (`theRenderEngine`: [RenderEngine](mmir_lib.renderengine.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`theRenderEngine` | [RenderEngine](mmir_lib.renderengine.md) |

___

###  showDialog

• **showDialog**: *function*

*Defined in [mmir.d.ts:563](../../mmir.d.ts#L563)*

#### Type declaration:

▸ (`ctrlName`: string, `dialogId`: string, `data?`: any, ...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`ctrlName` | string |
`dialogId` | string |
`data?` | any |
`...args` | any[] |

___

###  showWaitDialog

• **showWaitDialog**: *function*

*Defined in [mmir.d.ts:564](../../mmir.d.ts#L564)*

#### Type declaration:

▸ (`text`: string, `data`: any, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`data` | any |
`...args` | any[] |