> **[mmir-lib 5.0.0](../README.md)**

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

*Defined in [mmir.d.ts:159](../../mmir.d.ts#L159)*

___

###  enc_regexp_str

• **enc_regexp_str**: *string*

*Defined in [mmir.d.ts:150](../../mmir.d.ts#L150)*

___

###  entry_index_field

• **entry_index_field**: *string*

*Defined in [mmir.d.ts:149](../../mmir.d.ts#L149)*

___

###  entry_token_field

• **entry_token_field**: *string*

*Defined in [mmir.d.ts:148](../../mmir.d.ts#L148)*

___

###  executeGrammar

• **executeGrammar**: *function*

*Defined in [mmir.d.ts:135](../../mmir.d.ts#L135)*

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

*Defined in [mmir.d.ts:119](../../mmir.d.ts#L119)*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  getGrammarDef

• **getGrammarDef**: *function*

*Defined in [mmir.d.ts:123](../../mmir.d.ts#L123)*

#### Type declaration:

▸ (): *string*

___

###  getGrammarSource

• **getGrammarSource**: *function*

*Defined in [mmir.d.ts:125](../../mmir.d.ts#L125)*

#### Type declaration:

▸ (): *string*

___

###  getStopWords

• **getStopWords**: *function*

*Defined in [mmir.d.ts:118](../../mmir.d.ts#L118)*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  getStopWordsEncRegExpr

• **getStopWordsEncRegExpr**: *function*

*Defined in [mmir.d.ts:122](../../mmir.d.ts#L122)*

#### Type declaration:

▸ (): *`RegExp`*

___

###  getStopWordsRegExpr

• **getStopWordsRegExpr**: *function*

*Defined in [mmir.d.ts:121](../../mmir.d.ts#L121)*

#### Type declaration:

▸ (): *`RegExp`*

___

###  isAsyncExec

• **isAsyncExec**: *function*

*Defined in [mmir.d.ts:130](../../mmir.d.ts#L130)*

#### Type declaration:

▸ (): *boolean*

___

###  js_grammar_definition

• **js_grammar_definition**: *string*

*Defined in [mmir.d.ts:153](../../mmir.d.ts#L153)*

___

###  jscc_grammar_definition

• **jscc_grammar_definition**: *string*

*Defined in [mmir.d.ts:152](../../mmir.d.ts#L152)*

___

###  json_grammar_definition

• **json_grammar_definition**: *[Grammar](mmir_lib.grammar.md)*

*Defined in [mmir.d.ts:154](../../mmir.d.ts#L154)*

___

###  loadGrammar

• **loadGrammar**: *function*

*Defined in [mmir.d.ts:115](../../mmir.d.ts#L115)*

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

*Defined in [mmir.d.ts:116](../../mmir.d.ts#L116)*

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

*Defined in [mmir.d.ts:138](../../mmir.d.ts#L138)*

#### Type declaration:

▸ (`str`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

___

###  maskNames

• **maskNames**: *boolean*

*Defined in [mmir.d.ts:158](../../mmir.d.ts#L158)*

___

###  maskString

• **maskString**: *function*

*Defined in [mmir.d.ts:137](../../mmir.d.ts#L137)*

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

*Defined in [mmir.d.ts:157](../../mmir.d.ts#L157)*

___

###  parseStopWords

• **parseStopWords**: *function*

*Defined in [mmir.d.ts:120](../../mmir.d.ts#L120)*

#### Type declaration:

▸ (): *void*

___

###  recodeJSON

• **recodeJSON**: *function*

*Defined in [mmir.d.ts:142](../../mmir.d.ts#L142)*

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

*Defined in [mmir.d.ts:124](../../mmir.d.ts#L124)*

#### Type declaration:

▸ (`rawGrammarSyntax`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`rawGrammarSyntax` | string |

___

###  setGrammarFunction

• **setGrammarFunction**: *function*

*Defined in [mmir.d.ts:128](../../mmir.d.ts#L128)*

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

*Defined in [mmir.d.ts:126](../../mmir.d.ts#L126)*

#### Type declaration:

▸ (`src_code`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`src_code` | string |

___

###  setStopWords

• **setStopWords**: *function*

*Defined in [mmir.d.ts:117](../../mmir.d.ts#L117)*

#### Type declaration:

▸ (`stopWordArray`: `Array<string>`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`stopWordArray` | `Array<string>` |

___

###  stop_words_regexp

• **stop_words_regexp**: *`RegExp`*

*Defined in [mmir.d.ts:155](../../mmir.d.ts#L155)*

___

###  unmaskJSON

• **unmaskJSON**: *function*

*Defined in [mmir.d.ts:141](../../mmir.d.ts#L141)*

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

*Defined in [mmir.d.ts:139](../../mmir.d.ts#L139)*

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

*Defined in [mmir.d.ts:145](../../mmir.d.ts#L145)*

___

###  variable_regexp

• **variable_regexp**: *`RegExp`*

*Defined in [mmir.d.ts:146](../../mmir.d.ts#L146)*

## Methods

###  postproc

▸ **postproc**(`procResult`: any, `recodeFunc?`: function): *any*

*Defined in [mmir.d.ts:133](../../mmir.d.ts#L133)*

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

*Defined in [mmir.d.ts:132](../../mmir.d.ts#L132)*

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