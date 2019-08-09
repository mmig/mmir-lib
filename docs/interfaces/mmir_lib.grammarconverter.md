> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [GrammarConverter](mmir_lib.grammarconverter.md) /

# Interface: GrammarConverter

## Hierarchy

* **GrammarConverter**

## Index

### Properties

* [convertOldFormat](mmir_lib.grammarconverter.md#convertoldformat)
* [enc_regexp_str](mmir_lib.grammarconverter.md#enc_regexp_str)
* [entry_index_field](mmir_lib.grammarconverter.md#entry_index_field)
* [entry_token_field](mmir_lib.grammarconverter.md#entry_token_field)
* [executeGrammar](mmir_lib.grammarconverter.md#executegrammar)
* [getEncodedStopwords](mmir_lib.grammarconverter.md#getencodedstopwords)
* [getGrammarDef](mmir_lib.grammarconverter.md#getgrammardef)
* [getGrammarSource](mmir_lib.grammarconverter.md#getgrammarsource)
* [getStopWords](mmir_lib.grammarconverter.md#getstopwords)
* [getStopWordsEncRegExpr](mmir_lib.grammarconverter.md#getstopwordsencregexpr)
* [getStopWordsRegExpr](mmir_lib.grammarconverter.md#getstopwordsregexpr)
* [isAsyncExec](mmir_lib.grammarconverter.md#isasyncexec)
* [js_grammar_definition](mmir_lib.grammarconverter.md#js_grammar_definition)
* [jscc_grammar_definition](mmir_lib.grammarconverter.md#jscc_grammar_definition)
* [json_grammar_definition](mmir_lib.grammarconverter.md#json_grammar_definition)
* [loadGrammar](mmir_lib.grammarconverter.md#loadgrammar)
* [loadResource](mmir_lib.grammarconverter.md#loadresource)
* [maskAsUnicode](mmir_lib.grammarconverter.md#maskasunicode)
* [maskNames](mmir_lib.grammarconverter.md#masknames)
* [maskString](mmir_lib.grammarconverter.md#maskstring)
* [maskValues](mmir_lib.grammarconverter.md#maskvalues)
* [parseStopWords](mmir_lib.grammarconverter.md#parsestopwords)
* [recodeJSON](mmir_lib.grammarconverter.md#recodejson)
* [setGrammarDef](mmir_lib.grammarconverter.md#setgrammardef)
* [setGrammarFunction](mmir_lib.grammarconverter.md#setgrammarfunction)
* [setGrammarSource](mmir_lib.grammarconverter.md#setgrammarsource)
* [setStopWords](mmir_lib.grammarconverter.md#setstopwords)
* [stop_words_regexp](mmir_lib.grammarconverter.md#stop_words_regexp)
* [unmaskJSON](mmir_lib.grammarconverter.md#unmaskjson)
* [unmaskString](mmir_lib.grammarconverter.md#unmaskstring)
* [variable_prefix](mmir_lib.grammarconverter.md#variable_prefix)
* [variable_regexp](mmir_lib.grammarconverter.md#variable_regexp)

### Methods

* [postproc](mmir_lib.grammarconverter.md#postproc)
* [preproc](mmir_lib.grammarconverter.md#preproc)

## Properties

###  convertOldFormat

• **convertOldFormat**: *boolean*

___

###  enc_regexp_str

• **enc_regexp_str**: *string*

___

###  entry_index_field

• **entry_index_field**: *string*

___

###  entry_token_field

• **entry_token_field**: *string*

___

###  executeGrammar

• **executeGrammar**: *function*

#### Type declaration:

▸ (`text`: string, `callback?`: function): *void*

**Parameters:**

▪ **text**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: `__type`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | `__type` |

___

###  getEncodedStopwords

• **getEncodedStopwords**: *function*

#### Type declaration:

▸ (): *`Array<string>`*

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

###  getStopWords

• **getStopWords**: *function*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  getStopWordsEncRegExpr

• **getStopWordsEncRegExpr**: *function*

#### Type declaration:

▸ (): *`RegExp`*

___

###  getStopWordsRegExpr

• **getStopWordsRegExpr**: *function*

#### Type declaration:

▸ (): *`RegExp`*

___

###  isAsyncExec

• **isAsyncExec**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  js_grammar_definition

• **js_grammar_definition**: *string*

___

###  jscc_grammar_definition

• **jscc_grammar_definition**: *string*

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

▸ (`str`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

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

▸ (`semanticResult`: `__type`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | `__type` |

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

▸ (`stopWordArray`: `Array<string>`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`stopWordArray` | `Array<string>` |

___

###  stop_words_regexp

• **stop_words_regexp**: *`RegExp`*

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

▸ (`str`: string, `computePositions?`: boolean, `detector?`: `RegExp`): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |
`computePositions?` | boolean |
`detector?` | `RegExp` |

___

###  variable_prefix

• **variable_prefix**: *string*

___

###  variable_regexp

• **variable_regexp**: *`RegExp`*

## Methods

###  postproc

▸ **postproc**(`procResult`: any, `recodeFunc?`: function): *any*

**Parameters:**

▪ **procResult**: *any*

▪`Optional`  **recodeFunc**: *function*

▸ (`inputStr`: string, ...`args`: any[]): *string*

**Parameters:**

Name | Type |
------ | ------ |
`inputStr` | string |
`...args` | any[] |

**Returns:** *any*

___

###  preproc

▸ **preproc**(`thePhrase`: string, `pos?`: object, `maskFunc?`: function, `stopwordFunc?`: function): *string*

**Parameters:**

▪ **thePhrase**: *string*

▪`Optional`  **pos**: *object*

Name | Type |
------ | ------ |
`stopwords` | `Array<Pos>` |

▪`Optional`  **maskFunc**: *function*

▸ (`inputStr`: string, `isCalcPosition?`: boolean): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`inputStr` | string |
`isCalcPosition?` | boolean |

▪`Optional`  **stopwordFunc**: *function*

▸ (`inputStr`: string, `pos?`: `Array<Pos>`): *string | [Positions](mmir_lib.positions.md)*

**Parameters:**

Name | Type |
------ | ------ |
`inputStr` | string |
`pos?` | `Array<Pos>` |

**Returns:** *string*