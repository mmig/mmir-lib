> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [ParsingResult](mmir_lib.parsingresult.md) /

# Class: ParsingResult

## Hierarchy

* **ParsingResult**

## Index

### Constructors

* [constructor](mmir_lib.parsingresult.md#constructor)

### Methods

* [getCallDataEnd](mmir_lib.parsingresult.md#getcalldataend)
* [getCallDataStart](mmir_lib.parsingresult.md#getcalldatastart)
* [getCallDataType](mmir_lib.parsingresult.md#getcalldatatype)
* [getEnd](mmir_lib.parsingresult.md#getend)
* [getStart](mmir_lib.parsingresult.md#getstart)
* [getType](mmir_lib.parsingresult.md#gettype)
* [getTypeName](mmir_lib.parsingresult.md#gettypename)
* [getValue](mmir_lib.parsingresult.md#getvalue)
* [hasCallData](mmir_lib.parsingresult.md#hascalldata)
* [hasElse](mmir_lib.parsingresult.md#haselse)
* [hasVarReferences](mmir_lib.parsingresult.md#hasvarreferences)
* [isElse](mmir_lib.parsingresult.md#iselse)
* [isEscape](mmir_lib.parsingresult.md#isescape)
* [isEscapeEnter](mmir_lib.parsingresult.md#isescapeenter)
* [isEscapeExit](mmir_lib.parsingresult.md#isescapeexit)
* [isFor](mmir_lib.parsingresult.md#isfor)
* [isHelper](mmir_lib.parsingresult.md#ishelper)
* [isIf](mmir_lib.parsingresult.md#isif)
* [isLocalize](mmir_lib.parsingresult.md#islocalize)
* [isRender](mmir_lib.parsingresult.md#isrender)
* [isScriptBlock](mmir_lib.parsingresult.md#isscriptblock)
* [isScriptStatement](mmir_lib.parsingresult.md#isscriptstatement)
* [isScriptTag](mmir_lib.parsingresult.md#isscripttag)
* [isStyleTag](mmir_lib.parsingresult.md#isstyletag)
* [isYield](mmir_lib.parsingresult.md#isyield)
* [isYieldContent](mmir_lib.parsingresult.md#isyieldcontent)
* [setEndFrom](mmir_lib.parsingresult.md#setendfrom)
* [setStartFrom](mmir_lib.parsingresult.md#setstartfrom)
* [stringify](mmir_lib.parsingresult.md#stringify)

## Constructors

###  constructor

\+ **new ParsingResult**(`thetokens`: any): *[ParsingResult](mmir_lib.parsingresult.md)*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *[ParsingResult](mmir_lib.parsingresult.md)*

## Methods

###  getCallDataEnd

▸ **getCallDataEnd**(): *number*

**Returns:** *number*

___

###  getCallDataStart

▸ **getCallDataStart**(): *number*

**Returns:** *number*

___

###  getCallDataType

▸ **getCallDataType**(): *string*

**Returns:** *string*

___

###  getEnd

▸ **getEnd**(): *number*

**Returns:** *number*

___

###  getStart

▸ **getStart**(): *number*

**Returns:** *number*

___

###  getType

▸ **getType**(): *number*

**Returns:** *number*

___

###  getTypeName

▸ **getTypeName**(): *string*

**Returns:** *string*

___

###  getValue

▸ **getValue**(`rawPropertyValue`: any, `proptertyType`: any, `data`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`rawPropertyValue` | any |
`proptertyType` | any |
`data` | any |

**Returns:** *any*

___

###  hasCallData

▸ **hasCallData**(): *boolean*

**Returns:** *boolean*

___

###  hasElse

▸ **hasElse**(): *boolean*

**Returns:** *boolean*

___

###  hasVarReferences

▸ **hasVarReferences**(): *boolean*

**Returns:** *boolean*

___

###  isElse

▸ **isElse**(): *boolean*

**Returns:** *boolean*

___

###  isEscape

▸ **isEscape**(): *boolean*

**Returns:** *boolean*

___

###  isEscapeEnter

▸ **isEscapeEnter**(): *boolean*

**Returns:** *boolean*

___

###  isEscapeExit

▸ **isEscapeExit**(): *boolean*

**Returns:** *boolean*

___

###  isFor

▸ **isFor**(): *boolean*

**Returns:** *boolean*

___

###  isHelper

▸ **isHelper**(): *boolean*

**Returns:** *boolean*

___

###  isIf

▸ **isIf**(): *boolean*

**Returns:** *boolean*

___

###  isLocalize

▸ **isLocalize**(): *boolean*

**Returns:** *boolean*

___

###  isRender

▸ **isRender**(): *boolean*

**Returns:** *boolean*

___

###  isScriptBlock

▸ **isScriptBlock**(): *boolean*

**Returns:** *boolean*

___

###  isScriptStatement

▸ **isScriptStatement**(): *boolean*

**Returns:** *boolean*

___

###  isScriptTag

▸ **isScriptTag**(): *boolean*

**Returns:** *boolean*

___

###  isStyleTag

▸ **isStyleTag**(): *boolean*

**Returns:** *boolean*

___

###  isYield

▸ **isYield**(): *boolean*

**Returns:** *boolean*

___

###  isYieldContent

▸ **isYieldContent**(): *boolean*

**Returns:** *boolean*

___

###  setEndFrom

▸ **setEndFrom**(`thetokens`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *void*

___

###  setStartFrom

▸ **setStartFrom**(`thetokens`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *void*

___

###  stringify

▸ **stringify**(): *string*

**Returns:** *string*