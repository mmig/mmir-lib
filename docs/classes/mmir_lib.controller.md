[mmir-lib 6.1.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [Controller](mmir_lib.controller.md)

# Class: Controller

## Hierarchy

* **Controller**

## Index

### Constructors

* [constructor](mmir_lib.controller.md#constructor)

### Methods

* [getHelper](mmir_lib.controller.md#gethelper)
* [getLayout](mmir_lib.controller.md#getlayout)
* [getLayoutName](mmir_lib.controller.md#getlayoutname)
* [getName](mmir_lib.controller.md#getname)
* [getPartialNames](mmir_lib.controller.md#getpartialnames)
* [getPartials](mmir_lib.controller.md#getpartials)
* [getViewNames](mmir_lib.controller.md#getviewnames)
* [getViews](mmir_lib.controller.md#getviews)
* [loadHelper](mmir_lib.controller.md#loadhelper)
* [parsePartials](mmir_lib.controller.md#parsepartials)
* [parseViews](mmir_lib.controller.md#parseviews)
* [perform](mmir_lib.controller.md#perform)
* [performHelper](mmir_lib.controller.md#performhelper)
* [performIfPresent](mmir_lib.controller.md#performifpresent)

## Constructors

###  constructor

\+ **new Controller**(`name`: any, `jsonDef`: any, `instanceConstr`: [Function](../interfaces/mmir_lib.requirejs.md#function)): *[Controller](mmir_lib.controller.md)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`jsonDef` | any |
`instanceConstr` | [Function](../interfaces/mmir_lib.requirejs.md#function) |

**Returns:** *[Controller](mmir_lib.controller.md)*

## Methods

###  getHelper

▸ **getHelper**(): *[Helper](mmir_lib.helper.md)*

**Returns:** *[Helper](mmir_lib.helper.md)*

___

###  getLayout

▸ **getLayout**(): *[FileInfo](../modules/mmir_lib.md#fileinfo)*

**Returns:** *[FileInfo](../modules/mmir_lib.md#fileinfo)*

___

###  getLayoutName

▸ **getLayoutName**(): *string*

**Returns:** *string*

___

###  getName

▸ **getName**(): *string*

**Returns:** *string*

___

###  getPartialNames

▸ **getPartialNames**(): *Array‹string›*

**Returns:** *Array‹string›*

___

###  getPartials

▸ **getPartials**(): *Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›*

**Returns:** *Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›*

___

###  getViewNames

▸ **getViewNames**(): *Array‹string›*

**Returns:** *Array‹string›*

___

###  getViews

▸ **getViews**(): *Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›*

**Returns:** *Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›*

___

###  loadHelper

▸ **loadHelper**(`name`: string, `helperPath`: string, `ctx`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`helperPath` | string |
`ctx` | any |

**Returns:** *void*

___

###  parsePartials

▸ **parsePartials**(`partialDefs`: Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`partialDefs` | Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)› |

**Returns:** *void*

___

###  parseViews

▸ **parseViews**(`viewDefs`: Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`viewDefs` | Array‹[FileInfo](../modules/mmir_lib.md#fileinfo)› |

**Returns:** *void*

___

###  perform

▸ **perform**(`actionName`: string, `data`: any, ...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`data` | any |
`...args` | any[] |

**Returns:** *any*

___

###  performHelper

▸ **performHelper**(`actionName`: string, `data`: any, ...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`data` | any |
`...args` | any[] |

**Returns:** *any*

___

###  performIfPresent

▸ **performIfPresent**(`actionName`: string, `data`: any, ...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`data` | any |
`...args` | any[] |

**Returns:** *any*
