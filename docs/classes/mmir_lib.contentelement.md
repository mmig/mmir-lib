**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / ContentElement

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

### constructor

\+ **new ContentElement**(`group`: [ParsingResult](mmir_lib.parsingresult.md) \| string[] \| { content: string ; name: string ; offset?: number ; parent?: [ContentElement](mmir_lib.contentelement.md)  }, `view`: [View](mmir_lib.view.md), `parser`: any, `renderer`: any, ...`args`: any[]): [ContentElement](mmir_lib.contentelement.md)

#### Parameters:

Name | Type |
------ | ------ |
`group` | [ParsingResult](mmir_lib.parsingresult.md) \| string[] \| { content: string ; name: string ; offset?: number ; parent?: [ContentElement](mmir_lib.contentelement.md)  } |
`view` | [View](mmir_lib.view.md) |
`parser` | any |
`renderer` | any |
`...args` | any[] |

**Returns:** [ContentElement](mmir_lib.contentelement.md)

## Methods

### getController

▸ **getController**(): [Controller](mmir_lib.controller.md)

**Returns:** [Controller](mmir_lib.controller.md)

___

### getDefinition

▸ **getDefinition**(): string

**Returns:** string

___

### getEnd

▸ **getEnd**(): number

**Returns:** number

___

### getName

▸ **getName**(): string

**Returns:** string

___

### getOffset

▸ **getOffset**(): number

**Returns:** number

___

### getRawText

▸ **getRawText**(): string

**Returns:** string

___

### getStart

▸ **getStart**(): number

**Returns:** number

___

### getView

▸ **getView**(): [View](mmir_lib.view.md)

**Returns:** [View](mmir_lib.view.md)

___

### hasDynamicContent

▸ **hasDynamicContent**(): boolean

**Returns:** boolean

___

### stringify

▸ **stringify**(`disableStrictMode?`: boolean): string

#### Parameters:

Name | Type |
------ | ------ |
`disableStrictMode?` | boolean |

**Returns:** string

___

### toHtml

▸ **toHtml**(): string

**Returns:** string

___

### toStrings

▸ **toStrings**(`renderingBuffer?`: string[], `data?`: any): any

#### Parameters:

Name | Type |
------ | ------ |
`renderingBuffer?` | string[] |
`data?` | any |

**Returns:** any
