> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [ContentElement](mmir_lib.contentelement.md) /

# Class: ContentElement

## Hierarchy

* **ContentElement**

## Index

### Constructors

* [constructor](mmir_lib.contentelement.md#constructor)

### Methods

* [getController](mmir_lib.contentelement.md#getcontroller)
* [getDefinition](mmir_lib.contentelement.md#getdefinition)
* [getEnd](mmir_lib.contentelement.md#getend)
* [getName](mmir_lib.contentelement.md#getname)
* [getOffset](mmir_lib.contentelement.md#getoffset)
* [getRawText](mmir_lib.contentelement.md#getrawtext)
* [getStart](mmir_lib.contentelement.md#getstart)
* [getView](mmir_lib.contentelement.md#getview)
* [hasDynamicContent](mmir_lib.contentelement.md#hasdynamiccontent)
* [stringify](mmir_lib.contentelement.md#stringify)
* [toHtml](mmir_lib.contentelement.md#tohtml)
* [toStrings](mmir_lib.contentelement.md#tostrings)

## Constructors

###  constructor

\+ **new ContentElement**(`group`: [ParsingResult](mmir_lib.parsingresult.md) | `Array<string>` | object, `view`: [View](mmir_lib.view.md), `parser`: any, `renderer`: any, ...`args`: any[]): *[ContentElement](mmir_lib.contentelement.md)*

*Defined in [mmir.d.ts:644](../../mmir.d.ts#L644)*

**Parameters:**

Name | Type |
------ | ------ |
`group` | [ParsingResult](mmir_lib.parsingresult.md) \| `Array<string>` \| object |
`view` | [View](mmir_lib.view.md) |
`parser` | any |
`renderer` | any |
`...args` | any[] |

**Returns:** *[ContentElement](mmir_lib.contentelement.md)*

## Methods

###  getController

▸ **getController**(): *[Controller](mmir_lib.controller.md)*

*Defined in [mmir.d.ts:647](../../mmir.d.ts#L647)*

**Returns:** *[Controller](mmir_lib.controller.md)*

___

###  getDefinition

▸ **getDefinition**(): *string*

*Defined in [mmir.d.ts:649](../../mmir.d.ts#L649)*

**Returns:** *string*

___

###  getEnd

▸ **getEnd**(): *number*

*Defined in [mmir.d.ts:651](../../mmir.d.ts#L651)*

**Returns:** *number*

___

###  getName

▸ **getName**(): *string*

*Defined in [mmir.d.ts:653](../../mmir.d.ts#L653)*

**Returns:** *string*

___

###  getOffset

▸ **getOffset**(): *number*

*Defined in [mmir.d.ts:655](../../mmir.d.ts#L655)*

**Returns:** *number*

___

###  getRawText

▸ **getRawText**(): *string*

*Defined in [mmir.d.ts:657](../../mmir.d.ts#L657)*

**Returns:** *string*

___

###  getStart

▸ **getStart**(): *number*

*Defined in [mmir.d.ts:659](../../mmir.d.ts#L659)*

**Returns:** *number*

___

###  getView

▸ **getView**(): *[View](mmir_lib.view.md)*

*Defined in [mmir.d.ts:661](../../mmir.d.ts#L661)*

**Returns:** *[View](mmir_lib.view.md)*

___

###  hasDynamicContent

▸ **hasDynamicContent**(): *boolean*

*Defined in [mmir.d.ts:663](../../mmir.d.ts#L663)*

**Returns:** *boolean*

___

###  stringify

▸ **stringify**(): *string*

*Defined in [mmir.d.ts:665](../../mmir.d.ts#L665)*

**Returns:** *string*

___

###  toHtml

▸ **toHtml**(): *string*

*Defined in [mmir.d.ts:667](../../mmir.d.ts#L667)*

**Returns:** *string*

___

###  toStrings

▸ **toStrings**(`renderingBuffer?`: `Array<string>`, `data?`: any): *any*

*Defined in [mmir.d.ts:669](../../mmir.d.ts#L669)*

**Parameters:**

Name | Type |
------ | ------ |
`renderingBuffer?` | `Array<string>` |
`data?` | any |

**Returns:** *any*