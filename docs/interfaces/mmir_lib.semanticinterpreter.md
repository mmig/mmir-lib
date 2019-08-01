> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [SemanticInterpreter](mmir_lib.semanticinterpreter.md) /

# Interface: SemanticInterpreter

## Hierarchy

* **SemanticInterpreter**

## Index

### Properties

* [addGrammar](mmir_lib.semanticinterpreter.md#addgrammar)
* [createGrammar](mmir_lib.semanticinterpreter.md#creategrammar)
* [getCurrentGrammar](mmir_lib.semanticinterpreter.md#getcurrentgrammar)
* [getFileVersion](mmir_lib.semanticinterpreter.md#getfileversion)
* [getGrammarConverter](mmir_lib.semanticinterpreter.md#getgrammarconverter)
* [getGrammarDefinitionText](mmir_lib.semanticinterpreter.md#getgrammardefinitiontext)
* [getGrammarEngine](mmir_lib.semanticinterpreter.md#getgrammarengine)
* [getGrammarParserText](mmir_lib.semanticinterpreter.md#getgrammarparsertext)
* [get_json_grammar_url](mmir_lib.semanticinterpreter.md#get_json_grammar_url)
* [hasGrammar](mmir_lib.semanticinterpreter.md#hasgrammar)
* [interpret](mmir_lib.semanticinterpreter.md#interpret)
* [isEnabled](mmir_lib.semanticinterpreter.md#isenabled)
* [removeGrammar](mmir_lib.semanticinterpreter.md#removegrammar)
* [removeStopwords](mmir_lib.semanticinterpreter.md#removestopwords)
* [setCurrentGrammar](mmir_lib.semanticinterpreter.md#setcurrentgrammar)
* [setEnabled](mmir_lib.semanticinterpreter.md#setenabled)
* [setEngineCompileMode](mmir_lib.semanticinterpreter.md#setenginecompilemode)
* [setGrammarEngine](mmir_lib.semanticinterpreter.md#setgrammarengine)
* [setStopwords](mmir_lib.semanticinterpreter.md#setstopwords)

## Properties

###  addGrammar

• **addGrammar**: *function*

*Defined in [mmir.d.ts:184](../../mmir.d.ts#L184)*

#### Type declaration:

▸ (`id`: string, `grammarImpl`: function, `fileFormatNo?`: number): *void*

**Parameters:**

▪ **id**: *string*

▪ **grammarImpl**: *function*

▸ (`text`: string, `callback?`: function): *void | [GrammarConverter](mmir_lib.grammarconverter.md)*

**Parameters:**

▪ **text**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: `__type`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | `__type` |

▪`Optional`  **fileFormatNo**: *number*

___

###  createGrammar

• **createGrammar**: *function*

*Defined in [mmir.d.ts:183](../../mmir.d.ts#L183)*

#### Type declaration:

▸ (`rawGrammarSrc`: string | `__type`, `id`: string, `callback?`: function): *[SemanticInterpreter](mmir_lib.semanticinterpreter.md)*

**Parameters:**

▪ **rawGrammarSrc**: *string | `__type`*

▪ **id**: *string*

▪`Optional`  **callback**: *function*

▸ (`created?`: [GrammarConverter](mmir_lib.grammarconverter.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`created?` | [GrammarConverter](mmir_lib.grammarconverter.md) |

___

###  getCurrentGrammar

• **getCurrentGrammar**: *function*

*Defined in [mmir.d.ts:189](../../mmir.d.ts#L189)*

#### Type declaration:

▸ (): *string*

___

###  getFileVersion

• **getFileVersion**: *function*

*Defined in [mmir.d.ts:195](../../mmir.d.ts#L195)*

#### Type declaration:

▸ (): *number*

___

###  getGrammarConverter

• **getGrammarConverter**: *function*

*Defined in [mmir.d.ts:182](../../mmir.d.ts#L182)*

#### Type declaration:

▸ (`id`: string): *[GrammarConverter](mmir_lib.grammarconverter.md)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  getGrammarDefinitionText

• **getGrammarDefinitionText**: *function*

*Defined in [mmir.d.ts:180](../../mmir.d.ts#L180)*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  getGrammarEngine

• **getGrammarEngine**: *function*

*Defined in [mmir.d.ts:192](../../mmir.d.ts#L192)*

#### Type declaration:

▸ (): *[GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)*

___

###  getGrammarParserText

• **getGrammarParserText**: *function*

*Defined in [mmir.d.ts:181](../../mmir.d.ts#L181)*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  get_json_grammar_url

• **get_json_grammar_url**: *function*

*Defined in [mmir.d.ts:197](../../mmir.d.ts#L197)*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  hasGrammar

• **hasGrammar**: *function*

*Defined in [mmir.d.ts:186](../../mmir.d.ts#L186)*

#### Type declaration:

▸ (`id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  interpret

• **interpret**: *function*

*Defined in [mmir.d.ts:178](../../mmir.d.ts#L178)*

#### Type declaration:

▸ (`phrase`: string, `langCode?`: string, `callback?`: function): *[GrammarResult](mmir_lib.grammarresult.md) | void*

**Parameters:**

▪ **phrase**: *string*

▪`Optional`  **langCode**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: [GrammarResult](mmir_lib.grammarresult.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | [GrammarResult](mmir_lib.grammarresult.md) |

___

###  isEnabled

• **isEnabled**: *function*

*Defined in [mmir.d.ts:191](../../mmir.d.ts#L191)*

#### Type declaration:

▸ (): *boolean*

___

###  removeGrammar

• **removeGrammar**: *function*

*Defined in [mmir.d.ts:187](../../mmir.d.ts#L187)*

#### Type declaration:

▸ (`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  removeStopwords

• **removeStopwords**: *function*

*Defined in [mmir.d.ts:179](../../mmir.d.ts#L179)*

#### Type declaration:

▸ (`thePhrase`: string, `lang?`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`thePhrase` | string |
`lang?` | string |

___

###  setCurrentGrammar

• **setCurrentGrammar**: *function*

*Defined in [mmir.d.ts:188](../../mmir.d.ts#L188)*

#### Type declaration:

▸ (`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  setEnabled

• **setEnabled**: *function*

*Defined in [mmir.d.ts:190](../../mmir.d.ts#L190)*

#### Type declaration:

▸ (`isEnabled`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`isEnabled` | boolean |

___

###  setEngineCompileMode

• **setEngineCompileMode**: *function*

*Defined in [mmir.d.ts:194](../../mmir.d.ts#L194)*

#### Type declaration:

▸ (`asyncCompileMode`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`asyncCompileMode` | boolean |

___

###  setGrammarEngine

• **setGrammarEngine**: *function*

*Defined in [mmir.d.ts:193](../../mmir.d.ts#L193)*

#### Type declaration:

▸ (`engineId`: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype), `asyncCompileMode?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`engineId` | [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype) |
`asyncCompileMode?` | boolean |

___

###  setStopwords

• **setStopwords**: *function*

*Defined in [mmir.d.ts:185](../../mmir.d.ts#L185)*

#### Type declaration:

▸ (`id`: string, `stopwordArray`: `Array<string>`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`stopwordArray` | `Array<string>` |