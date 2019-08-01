> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [Controller](mmir_lib.controller.md) /

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

\+ **new Controller**(`name`: any, `jsonDef`: any, `instanceConstr`: `Function`): *[Controller](mmir_lib.controller.md)*

*Defined in [mmir.d.ts:743](../../mmir.d.ts#L743)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`jsonDef` | any |
`instanceConstr` | `Function` |

**Returns:** *[Controller](mmir_lib.controller.md)*

## Methods

###  getHelper

▸ **getHelper**(): *[Helper](mmir_lib.helper.md)*

*Defined in [mmir.d.ts:748](../../mmir.d.ts#L748)*

**Returns:** *[Helper](mmir_lib.helper.md)*

___

###  getLayout

▸ **getLayout**(): *[FileInfo](../modules/mmir_lib.md#fileinfo)*

*Defined in [mmir.d.ts:760](../../mmir.d.ts#L760)*

**Returns:** *[FileInfo](../modules/mmir_lib.md#fileinfo)*

___

###  getLayoutName

▸ **getLayoutName**(): *string*

*Defined in [mmir.d.ts:750](../../mmir.d.ts#L750)*

**Returns:** *string*

___

###  getName

▸ **getName**(): *string*

*Defined in [mmir.d.ts:746](../../mmir.d.ts#L746)*

**Returns:** *string*

___

###  getPartialNames

▸ **getPartialNames**(): *`Array<string>`*

*Defined in [mmir.d.ts:751](../../mmir.d.ts#L751)*

**Returns:** *`Array<string>`*

___

###  getPartials

▸ **getPartials**(): *`Array<FileInfo>`*

*Defined in [mmir.d.ts:758](../../mmir.d.ts#L758)*

**Returns:** *`Array<FileInfo>`*

___

###  getViewNames

▸ **getViewNames**(): *`Array<string>`*

*Defined in [mmir.d.ts:752](../../mmir.d.ts#L752)*

**Returns:** *`Array<string>`*

___

###  getViews

▸ **getViews**(): *`Array<FileInfo>`*

*Defined in [mmir.d.ts:759](../../mmir.d.ts#L759)*

**Returns:** *`Array<FileInfo>`*

___

###  loadHelper

▸ **loadHelper**(`name`: string, `helperPath`: string, `ctx`: any): *void*

*Defined in [mmir.d.ts:763](../../mmir.d.ts#L763)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`helperPath` | string |
`ctx` | any |

**Returns:** *void*

___

###  parsePartials

▸ **parsePartials**(`partialDefs`: `Array<FileInfo>`): *void*

*Defined in [mmir.d.ts:761](../../mmir.d.ts#L761)*

**Parameters:**

Name | Type |
------ | ------ |
`partialDefs` | `Array<FileInfo>` |

**Returns:** *void*

___

###  parseViews

▸ **parseViews**(`viewDefs`: `Array<FileInfo>`): *void*

*Defined in [mmir.d.ts:762](../../mmir.d.ts#L762)*

**Parameters:**

Name | Type |
------ | ------ |
`viewDefs` | `Array<FileInfo>` |

**Returns:** *void*

___

###  perform

▸ **perform**(`actionName`: string, `data`: any, ...`args`: any[]): *any*

*Defined in [mmir.d.ts:754](../../mmir.d.ts#L754)*

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

*Defined in [mmir.d.ts:755](../../mmir.d.ts#L755)*

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

*Defined in [mmir.d.ts:756](../../mmir.d.ts#L756)*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`data` | any |
`...args` | any[] |

**Returns:** *any*