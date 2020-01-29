[mmir-lib 6.0.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [GrammarConverter](mmir_lib.grammarconverter.md)

# Interface: GrammarConverter

## Hierarchy

* **GrammarConverter**

## Index

### Properties

* [addProc](mmir_lib.grammarconverter.md#addproc)
* [convertOldFormat](mmir_lib.grammarconverter.md#convertoldformat)
* [executeGrammar](mmir_lib.grammarconverter.md#executegrammar)
* [getEncodedStopwords](mmir_lib.grammarconverter.md#getencodedstopwords)
* [getGrammarDef](mmir_lib.grammarconverter.md#getgrammardef)
* [getGrammarSource](mmir_lib.grammarconverter.md#getgrammarsource)
* [getProcIndex](mmir_lib.grammarconverter.md#getprocindex)
* [getStopWords](mmir_lib.grammarconverter.md#getstopwords)
* [getStopWordsEncRegExpr](mmir_lib.grammarconverter.md#getstopwordsencregexpr)
* [getStopWordsRegExpr](mmir_lib.grammarconverter.md#getstopwordsregexpr)
* [grammar_definition](mmir_lib.grammarconverter.md#grammar_definition)
* [isAsyncExec](mmir_lib.grammarconverter.md#isasyncexec)
* [js_grammar_definition](mmir_lib.grammarconverter.md#js_grammar_definition)
* [json_grammar_definition](mmir_lib.grammarconverter.md#json_grammar_definition)
* [loadGrammar](mmir_lib.grammarconverter.md#loadgrammar)
* [loadResource](mmir_lib.grammarconverter.md#loadresource)
* [maskAsUnicode](mmir_lib.grammarconverter.md#maskasunicode)
* [maskNames](mmir_lib.grammarconverter.md#masknames)
* [maskString](mmir_lib.grammarconverter.md#maskstring)
* [maskValues](mmir_lib.grammarconverter.md#maskvalues)
* [parseStopWords](mmir_lib.grammarconverter.md#parsestopwords)
* [postproc](mmir_lib.grammarconverter.md#postproc)
* [preproc](mmir_lib.grammarconverter.md#preproc)
* [procList](mmir_lib.grammarconverter.md#proclist)
* [recodeJSON](mmir_lib.grammarconverter.md#recodejson)
* [removeProc](mmir_lib.grammarconverter.md#removeproc)
* [removeStopwords](mmir_lib.grammarconverter.md#removestopwords)
* [setGrammarDef](mmir_lib.grammarconverter.md#setgrammardef)
* [setGrammarFunction](mmir_lib.grammarconverter.md#setgrammarfunction)
* [setGrammarSource](mmir_lib.grammarconverter.md#setgrammarsource)
* [setStopWords](mmir_lib.grammarconverter.md#setstopwords)
* [stop_words_regexp](mmir_lib.grammarconverter.md#stop_words_regexp)
* [unmaskJSON](mmir_lib.grammarconverter.md#unmaskjson)
* [unmaskString](mmir_lib.grammarconverter.md#unmaskstring)

## Properties

###  addProc

• **addProc**: *function*

#### Type declaration:

▸ (`proc`: [ProcessingStep](mmir_lib.processingstep.md), `indexOrIsPrepend?`: number | boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`proc` | [ProcessingStep](mmir_lib.processingstep.md) |
`indexOrIsPrepend?` | number &#124; boolean |

___

###  convertOldFormat

• **convertOldFormat**: *boolean*

___

###  executeGrammar

• **executeGrammar**: *function*

#### Type declaration:

▸ (`text`: string, `callback?`: function): *void*

**Parameters:**

▪ **text**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | object |

___

###  getEncodedStopwords

• **getEncodedStopwords**: *function*

#### Type declaration:

▸ (): *Array‹string›*

___

###  getGrammarDef

• **getGrammarDef**: *function*

#### Type declaration:

▸ (): *string*

___

###  getGrammarSource

• **getGrammarSource**: *function*

#### Type declaration:

▸ (): *string*

___

###  getProcIndex

• **getProcIndex**: *function*

#### Type declaration:

▸ (`procName`: string, `startIndex?`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`procName` | string |
`startIndex?` | number |

___

###  getStopWords

• **getStopWords**: *function*

#### Type declaration:

▸ (): *Array‹string›*

___

###  getStopWordsEncRegExpr

• **getStopWordsEncRegExpr**: *function*

#### Type declaration:

▸ (): *RegExp*

___

###  getStopWordsRegExpr

• **getStopWordsRegExpr**: *function*

#### Type declaration:

▸ (): *RegExp*

___

###  grammar_definition

• **grammar_definition**: *string*

___

###  isAsyncExec

• **isAsyncExec**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  js_grammar_definition

• **js_grammar_definition**: *string*

___

###  json_grammar_definition

• **json_grammar_definition**: *[Grammar](mmir_lib.grammar.md)*

___

###  loadGrammar

• **loadGrammar**: *function*

#### Type declaration:

▸ (`successCallback`: function, `errorCallback`: function, `grammarUrl`: string, `doLoadSynchronously?`: boolean): *void*

**Parameters:**

▪ **successCallback**: *function*

▸ (): *any*

▪ **errorCallback**: *function*

▸ (): *any*

▪ **grammarUrl**: *string*

▪`Optional`  **doLoadSynchronously**: *boolean*

___

###  loadResource

• **loadResource**: *function*

#### Type declaration:

▸ (`successCallback`: function, `errorCallback`: function, `resourceUrl`: string, `doLoadSynchronously?`: boolean): *void*

**Parameters:**

▪ **successCallback**: *function*

▸ (): *any*

▪ **errorCallback**: *function*

▸ (): *any*

▪ **resourceUrl**: *string*

▪`Optional`  **doLoadSynchronously**: *boolean*

___

###  maskAsUnicode

• **maskAsUnicode**: *function*

#### Type declaration:

▸ (`str`: string, `computePositions?`: boolean): *string*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |
`computePositions?` | boolean |

___

###  maskNames

• **maskNames**: *boolean*

___

###  maskString

• **maskString**: *function*

#### Type declaration:

▸ (`str`: string, `computePositions?`: boolean, `prefix?`: string, `postfix?`: string): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |
`computePositions?` | boolean |
`prefix?` | string |
`postfix?` | string |

___

###  maskValues

• **maskValues**: *boolean*

___

###  parseStopWords

• **parseStopWords**: *function*

#### Type declaration:

▸ (): *void*

___

###  postproc

• **postproc**: *function*

#### Type declaration:

▸ (`procResult`: any, `pos`: [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo), `processingSteps?`: Array‹[ProcessingStep](mmir_lib.processingstep.md)›): *any*

**Parameters:**

Name | Type |
------ | ------ |
`procResult` | any |
`pos` | [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo) |
`processingSteps?` | Array‹[ProcessingStep](mmir_lib.processingstep.md)› |

___

###  preproc

• **preproc**: *function*

#### Type declaration:

▸ (`thePhrase`: string, `pos?`: [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo), `processingSteps?`: Array‹[ProcessingStep](mmir_lib.processingstep.md)›): *string*

**Parameters:**

Name | Type |
------ | ------ |
`thePhrase` | string |
`pos?` | [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo) |
`processingSteps?` | Array‹[ProcessingStep](mmir_lib.processingstep.md)› |

___

###  procList

• **procList**: *Array‹[ProcessingStep](mmir_lib.processingstep.md)›*

___

###  recodeJSON

• **recodeJSON**: *function*

#### Type declaration:

▸ (`json`: any, `recodeFunc`: function, `isMaskValues?`: boolean, `isMaskNames?`: boolean): *any*

**Parameters:**

▪ **json**: *any*

▪ **recodeFunc**: *function*

▸ (`str`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

▪`Optional`  **isMaskValues**: *boolean*

▪`Optional`  **isMaskNames**: *boolean*

___

###  removeProc

• **removeProc**: *function*

#### Type declaration:

▸ (`proc`: number | string): *[ProcessingStep](mmir_lib.processingstep.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`proc` | number &#124; string |

___

###  removeStopwords

• **removeStopwords**: *function*

#### Type declaration:

▸ (`inputStr`: string, `isCalcPosition?`: boolean): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`inputStr` | string |
`isCalcPosition?` | boolean |

___

###  setGrammarDef

• **setGrammarDef**: *function*

#### Type declaration:

▸ (`rawGrammarSyntax`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`rawGrammarSyntax` | string |

___

###  setGrammarFunction

• **setGrammarFunction**: *function*

#### Type declaration:

▸ (`execGrammarFunc`: function, `isAsync?`: boolean): *void*

**Parameters:**

▪ **execGrammarFunc**: *function*

▸ (`text`: string, `callback?`: function): *void*

**Parameters:**

▪ **text**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | object |

▪`Optional`  **isAsync**: *boolean*

___

###  setGrammarSource

• **setGrammarSource**: *function*

#### Type declaration:

▸ (`src_code`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`src_code` | string |

___

###  setStopWords

• **setStopWords**: *function*

#### Type declaration:

▸ (`stopWordArray`: Array‹string›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`stopWordArray` | Array‹string› |

___

###  stop_words_regexp

• **stop_words_regexp**: *RegExp*

___

###  unmaskJSON

• **unmaskJSON**: *function*

#### Type declaration:

▸ (`json`: any, `isMaskValues?`: boolean, `isMaskNames?`: boolean): *any*

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |
`isMaskValues?` | boolean |
`isMaskNames?` | boolean |

___

###  unmaskString

• **unmaskString**: *function*

#### Type declaration:

▸ (`str`: string, `computePositions?`: boolean, `detector?`: RegExp): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |
`computePositions?` | boolean |
`detector?` | RegExp |
