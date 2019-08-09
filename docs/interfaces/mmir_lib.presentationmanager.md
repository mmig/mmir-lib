> **[mmir-lib 5.1.0](../README.md)**

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

#### Type declaration:

▸ (`layout`: [Layout](../classes/mmir_lib.layout.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`layout` | [Layout](../classes/mmir_lib.layout.md) |

___

###  addPartial

• **addPartial**: *function*

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

#### Type declaration:

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

###  hideWaitDialog

• **hideWaitDialog**: *function*

#### Type declaration:

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

### `Optional` on_before_page_load

• **on_before_page_load**? : *function*

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

___

###  render

• **render**: *function*

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

#### Type declaration:

▸ (`theRenderEngine`: [RenderEngine](mmir_lib.renderengine.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`theRenderEngine` | [RenderEngine](mmir_lib.renderengine.md) |

___

###  showDialog

• **showDialog**: *function*

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

#### Type declaration:

▸ (`text`: string, `data`: any, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`data` | any |
`...args` | any[] |