> **[mmir-lib 5.0.0](../README.md)**

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

*Defined in [mmir.d.ts:673](../../mmir.d.ts#L673)*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *[ParsingResult](mmir_lib.parsingresult.md)*

## Methods

###  getCallDataEnd

▸ **getCallDataEnd**(): *number*

*Defined in [mmir.d.ts:676](../../mmir.d.ts#L676)*

**Returns:** *number*

___

###  getCallDataStart

▸ **getCallDataStart**(): *number*

*Defined in [mmir.d.ts:678](../../mmir.d.ts#L678)*

**Returns:** *number*

___

###  getCallDataType

▸ **getCallDataType**(): *string*

*Defined in [mmir.d.ts:680](../../mmir.d.ts#L680)*

**Returns:** *string*

___

###  getEnd

▸ **getEnd**(): *number*

*Defined in [mmir.d.ts:682](../../mmir.d.ts#L682)*

**Returns:** *number*

___

###  getStart

▸ **getStart**(): *number*

*Defined in [mmir.d.ts:684](../../mmir.d.ts#L684)*

**Returns:** *number*

___

###  getType

▸ **getType**(): *number*

*Defined in [mmir.d.ts:686](../../mmir.d.ts#L686)*

**Returns:** *number*

___

###  getTypeName

▸ **getTypeName**(): *string*

*Defined in [mmir.d.ts:688](../../mmir.d.ts#L688)*

**Returns:** *string*

___

###  getValue

▸ **getValue**(`rawPropertyValue`: any, `proptertyType`: any, `data`: any): *any*

*Defined in [mmir.d.ts:690](../../mmir.d.ts#L690)*

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

*Defined in [mmir.d.ts:692](../../mmir.d.ts#L692)*

**Returns:** *boolean*

___

###  hasElse

▸ **hasElse**(): *boolean*

*Defined in [mmir.d.ts:694](../../mmir.d.ts#L694)*

**Returns:** *boolean*

___

###  hasVarReferences

▸ **hasVarReferences**(): *boolean*

*Defined in [mmir.d.ts:696](../../mmir.d.ts#L696)*

**Returns:** *boolean*

___

###  isElse

▸ **isElse**(): *boolean*

*Defined in [mmir.d.ts:698](../../mmir.d.ts#L698)*

**Returns:** *boolean*

___

###  isEscape

▸ **isEscape**(): *boolean*

*Defined in [mmir.d.ts:700](../../mmir.d.ts#L700)*

**Returns:** *boolean*

___

###  isEscapeEnter

▸ **isEscapeEnter**(): *boolean*

*Defined in [mmir.d.ts:702](../../mmir.d.ts#L702)*

**Returns:** *boolean*

___

###  isEscapeExit

▸ **isEscapeExit**(): *boolean*

*Defined in [mmir.d.ts:704](../../mmir.d.ts#L704)*

**Returns:** *boolean*

___

###  isFor

▸ **isFor**(): *boolean*

*Defined in [mmir.d.ts:706](../../mmir.d.ts#L706)*

**Returns:** *boolean*

___

###  isHelper

▸ **isHelper**(): *boolean*

*Defined in [mmir.d.ts:708](../../mmir.d.ts#L708)*

**Returns:** *boolean*

___

###  isIf

▸ **isIf**(): *boolean*

*Defined in [mmir.d.ts:710](../../mmir.d.ts#L710)*

**Returns:** *boolean*

___

###  isLocalize

▸ **isLocalize**(): *boolean*

*Defined in [mmir.d.ts:712](../../mmir.d.ts#L712)*

**Returns:** *boolean*

___

###  isRender

▸ **isRender**(): *boolean*

*Defined in [mmir.d.ts:714](../../mmir.d.ts#L714)*

**Returns:** *boolean*

___

###  isScriptBlock

▸ **isScriptBlock**(): *boolean*

*Defined in [mmir.d.ts:716](../../mmir.d.ts#L716)*

**Returns:** *boolean*

___

###  isScriptStatement

▸ **isScriptStatement**(): *boolean*

*Defined in [mmir.d.ts:718](../../mmir.d.ts#L718)*

**Returns:** *boolean*

___

###  isScriptTag

▸ **isScriptTag**(): *boolean*

*Defined in [mmir.d.ts:720](../../mmir.d.ts#L720)*

**Returns:** *boolean*

___

###  isStyleTag

▸ **isStyleTag**(): *boolean*

*Defined in [mmir.d.ts:722](../../mmir.d.ts#L722)*

**Returns:** *boolean*

___

###  isYield

▸ **isYield**(): *boolean*

*Defined in [mmir.d.ts:724](../../mmir.d.ts#L724)*

**Returns:** *boolean*

___

###  isYieldContent

▸ **isYieldContent**(): *boolean*

*Defined in [mmir.d.ts:726](../../mmir.d.ts#L726)*

**Returns:** *boolean*

___

###  setEndFrom

▸ **setEndFrom**(`thetokens`: any): *void*

*Defined in [mmir.d.ts:728](../../mmir.d.ts#L728)*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *void*

___

###  setStartFrom

▸ **setStartFrom**(`thetokens`: any): *void*

*Defined in [mmir.d.ts:730](../../mmir.d.ts#L730)*

**Parameters:**

Name | Type |
------ | ------ |
`thetokens` | any |

**Returns:** *void*

___

###  stringify

▸ **stringify**(): *string*

*Defined in [mmir.d.ts:732](../../mmir.d.ts#L732)*

**Returns:** *string*