[mmir-lib 6.1.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [SemanticInterpreter](mmir_lib.semanticinterpreter.md)

# Interface: SemanticInterpreter

## Hierarchy

* **SemanticInterpreter**

## Index

### Properties

* [addGrammar](mmir_lib.semanticinterpreter.md#addgrammar)
* [addProcessing](mmir_lib.semanticinterpreter.md#addprocessing)
* [applyPreProcessing](mmir_lib.semanticinterpreter.md#applypreprocessing)
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
* [isPreProcessPositionsEnabled](mmir_lib.semanticinterpreter.md#ispreprocesspositionsenabled)
* [removeGrammar](mmir_lib.semanticinterpreter.md#removegrammar)
* [removeStopwords](mmir_lib.semanticinterpreter.md#removestopwords)
* [setCurrentGrammar](mmir_lib.semanticinterpreter.md#setcurrentgrammar)
* [setEnabled](mmir_lib.semanticinterpreter.md#setenabled)
* [setEngineCompileMode](mmir_lib.semanticinterpreter.md#setenginecompilemode)
* [setGrammarEngine](mmir_lib.semanticinterpreter.md#setgrammarengine)
* [setPreProcessPositionsEnabled](mmir_lib.semanticinterpreter.md#setpreprocesspositionsenabled)
* [setStopwords](mmir_lib.semanticinterpreter.md#setstopwords)

## Properties

###  addGrammar

• **addGrammar**: *function*

#### Type declaration:

▸ (`id`: string, `grammarImpl`: function, `fileFormatNo?`: number): *void*

**Parameters:**

▪ **id**: *string*

▪ **grammarImpl**: *function*

▸ (`text`: string, `callback?`: function): *void | [GrammarConverter](mmir_lib.grammarconverter.md)*

**Parameters:**

▪ **text**: *string*

▪`Optional`  **callback**: *function*

▸ (`semanticResult`: object): *void*

**Parameters:**

Name | Type |
------ | ------ |
`semanticResult` | object |

▪`Optional`  **fileFormatNo**: *number*

___

###  addProcessing

• **addProcessing**: *function*

#### Type declaration:

▸ (`id`: string, `processingStep`: [ProcessingStep](mmir_lib.processingstep.md), `indexOrIsPrepend?`: number | boolean, `callback?`: [Function](mmir_lib.requirejs.md#function)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`processingStep` | [ProcessingStep](mmir_lib.processingstep.md) |
`indexOrIsPrepend?` | number &#124; boolean |
`callback?` | [Function](mmir_lib.requirejs.md#function) |

___

###  applyPreProcessing

• **applyPreProcessing**: *function*

#### Type declaration:

▸ (`thePhrase`: string, `lang?`: string, `processingSteps?`: Array‹[ProcessingStep](mmir_lib.processingstep.md)›): *string*

**Parameters:**

Name | Type |
------ | ------ |
`thePhrase` | string |
`lang?` | string |
`processingSteps?` | Array‹[ProcessingStep](mmir_lib.processingstep.md)› |

___

###  createGrammar

• **createGrammar**: *function*

#### Type declaration:

▸ (`rawGrammarSrc`: string | object, `id`: string, `callback?`: function): *[SemanticInterpreter](mmir_lib.semanticinterpreter.md)*

**Parameters:**

▪ **rawGrammarSrc**: *string | object*

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

#### Type declaration:

▸ (): *string*

___

###  getFileVersion

• **getFileVersion**: *function*

#### Type declaration:

▸ (): *number*

___

###  getGrammarConverter

• **getGrammarConverter**: *function*

#### Type declaration:

▸ (`id`: string): *[GrammarConverter](mmir_lib.grammarconverter.md)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  getGrammarDefinitionText

• **getGrammarDefinitionText**: *function*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  getGrammarEngine

• **getGrammarEngine**: *function*

#### Type declaration:

▸ (): *[GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)*

___

###  getGrammarParserText

• **getGrammarParserText**: *function*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  get_json_grammar_url

• **get_json_grammar_url**: *function*

#### Type declaration:

▸ (`id`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  hasGrammar

• **hasGrammar**: *function*

#### Type declaration:

▸ (`id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  interpret

• **interpret**: *function*

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

#### Type declaration:

▸ (): *boolean*

___

###  isPreProcessPositionsEnabled

• **isPreProcessPositionsEnabled**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  removeGrammar

• **removeGrammar**: *function*

#### Type declaration:

▸ (`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  removeStopwords

• **removeStopwords**: *function*

**`deprecated`** use [applyPreProcessing](mmir_lib.semanticinterpreter.md#applypreprocessing) instead

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

#### Type declaration:

▸ (`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

___

###  setEnabled

• **setEnabled**: *function*

#### Type declaration:

▸ (`isEnabled`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`isEnabled` | boolean |

___

###  setEngineCompileMode

• **setEngineCompileMode**: *function*

#### Type declaration:

▸ (`asyncCompileMode`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`asyncCompileMode` | boolean |

___

###  setGrammarEngine

• **setGrammarEngine**: *function*

#### Type declaration:

▸ (`engineId`: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype), `asyncCompileMode?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`engineId` | [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype) |
`asyncCompileMode?` | boolean |

___

###  setPreProcessPositionsEnabled

• **setPreProcessPositionsEnabled**: *function*

#### Type declaration:

▸ (`enabled`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`enabled` | boolean |

___

###  setStopwords

• **setStopwords**: *function*

#### Type declaration:

▸ (`id`: string, `stopwordArray`: Array‹string›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`stopwordArray` | Array‹string› |
