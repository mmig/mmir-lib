**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / SemanticInterpreter

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
* [getEngineCompileMode](mmir_lib.semanticinterpreter.md#getenginecompilemode)
* [getEngineCompileStrictMode](mmir_lib.semanticinterpreter.md#getenginecompilestrictmode)
* [getFileVersion](mmir_lib.semanticinterpreter.md#getfileversion)
* [getGrammarConverter](mmir_lib.semanticinterpreter.md#getgrammarconverter)
* [getGrammarDefinitionText](mmir_lib.semanticinterpreter.md#getgrammardefinitiontext)
* [getGrammarEngine](mmir_lib.semanticinterpreter.md#getgrammarengine)
* [getGrammarParserText](mmir_lib.semanticinterpreter.md#getgrammarparsertext)
* [get\_json\_grammar\_url](mmir_lib.semanticinterpreter.md#get_json_grammar_url)
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

### addGrammar

•  **addGrammar**: (id: string, grammarImpl: (text: string, callback?: (semanticResult: {}) => void) => void \| [GrammarConverter](mmir_lib.grammarconverter.md), fileFormatNo?: number) => void

___

### addProcessing

•  **addProcessing**: (id: string, processingStep: [ProcessingStep](mmir_lib.processingstep.md), indexOrIsPrepend?: number \| boolean, callback?: [Function](mmir_lib.requirejs.md#function)) => void

___

### applyPreProcessing

•  **applyPreProcessing**: (thePhrase: string, lang?: string, processingSteps?: [ProcessingStep](mmir_lib.processingstep.md)[]) => string

___

### createGrammar

•  **createGrammar**: (rawGrammarSrc: string \| {}, id: string, callback?: (created?: [GrammarConverter](mmir_lib.grammarconverter.md)) => void) => [SemanticInterpreter](mmir_lib.semanticinterpreter.md)

___

### getCurrentGrammar

•  **getCurrentGrammar**: () => string

___

### getEngineCompileMode

•  **getEngineCompileMode**: () => boolean

___

### getEngineCompileStrictMode

•  **getEngineCompileStrictMode**: () => boolean

___

### getFileVersion

•  **getFileVersion**: () => number

___

### getGrammarConverter

•  **getGrammarConverter**: (id: string) => [GrammarConverter](mmir_lib.grammarconverter.md)

___

### getGrammarDefinitionText

•  **getGrammarDefinitionText**: (id: string) => string

___

### getGrammarEngine

•  **getGrammarEngine**: () => [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)

___

### getGrammarParserText

•  **getGrammarParserText**: (id: string) => string

___

### get\_json\_grammar\_url

•  **get\_json\_grammar\_url**: (id: string) => string

___

### hasGrammar

•  **hasGrammar**: (id: string) => boolean

___

### interpret

•  **interpret**: (phrase: string, langCode?: string, callback?: (semanticResult: [GrammarResult](mmir_lib.grammarresult.md)) => void) => [GrammarResult](mmir_lib.grammarresult.md) \| void

___

### isEnabled

•  **isEnabled**: () => boolean

___

### isPreProcessPositionsEnabled

•  **isPreProcessPositionsEnabled**: () => boolean

___

### removeGrammar

•  **removeGrammar**: (id: string) => void

___

### removeStopwords

•  **removeStopwords**: (thePhrase: string, lang?: string) => string

**`deprecated`** use [applyPreProcessing](mmir_lib.semanticinterpreter.md#applypreprocessing) instead

___

### setCurrentGrammar

•  **setCurrentGrammar**: (id: string) => void

___

### setEnabled

•  **setEnabled**: (isEnabled: boolean) => void

___

### setEngineCompileMode

•  **setEngineCompileMode**: (asyncCompileMode: boolean, disableStrictCompileMode?: boolean) => void

___

### setGrammarEngine

•  **setGrammarEngine**: (engineId: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype), asyncCompileMode?: boolean, disableStrictCompileMode?: boolean) => void

___

### setPreProcessPositionsEnabled

•  **setPreProcessPositionsEnabled**: (enabled: boolean) => void

___

### setStopwords

•  **setStopwords**: (id: string, stopwordArray: string[]) => void
