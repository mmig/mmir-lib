**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / GrammarConverter

# Interface: GrammarConverter

## Hierarchy

* **GrammarConverter**

## Index

### Constructors

* [constructor](mmir_lib.grammarconverter.md#constructor)

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
* [grammar\_definition](mmir_lib.grammarconverter.md#grammar_definition)
* [isAsyncExec](mmir_lib.grammarconverter.md#isasyncexec)
* [js\_grammar\_definition](mmir_lib.grammarconverter.md#js_grammar_definition)
* [json\_grammar\_definition](mmir_lib.grammarconverter.md#json_grammar_definition)
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
* [stop\_words\_regexp](mmir_lib.grammarconverter.md#stop_words_regexp)
* [unmaskJSON](mmir_lib.grammarconverter.md#unmaskjson)
* [unmaskString](mmir_lib.grammarconverter.md#unmaskstring)

## Constructors

### constructor

\+ **new GrammarConverter**(): [GrammarConverter](mmir_lib.grammarconverter.md)

**Returns:** [GrammarConverter](mmir_lib.grammarconverter.md)

## Properties

### addProc

•  **addProc**: (proc: [ProcessingStep](mmir_lib.processingstep.md), indexOrIsPrepend?: number \| boolean) => void

___

### convertOldFormat

•  **convertOldFormat**: boolean

___

### executeGrammar

•  **executeGrammar**: (text: string, callback?: (semanticResult: {}) => void) => void

___

### getEncodedStopwords

•  **getEncodedStopwords**: () => string[]

___

### getGrammarDef

•  **getGrammarDef**: () => string

___

### getGrammarSource

•  **getGrammarSource**: () => string

___

### getProcIndex

•  **getProcIndex**: (procName: string, startIndex?: number) => number

___

### getStopWords

•  **getStopWords**: () => string[]

___

### getStopWordsEncRegExpr

•  **getStopWordsEncRegExpr**: () => RegExp

___

### getStopWordsRegExpr

•  **getStopWordsRegExpr**: () => RegExp

___

### grammar\_definition

•  **grammar\_definition**: string

___

### isAsyncExec

•  **isAsyncExec**: () => boolean

___

### js\_grammar\_definition

•  **js\_grammar\_definition**: string

___

### json\_grammar\_definition

•  **json\_grammar\_definition**: [Grammar](mmir_lib.grammar.md)

___

### loadGrammar

•  **loadGrammar**: (successCallback: () => any, errorCallback: () => any, grammarUrl: string, doLoadSynchronously?: boolean) => void

___

### loadResource

•  **loadResource**: (successCallback: () => any, errorCallback: () => any, resourceUrl: string, doLoadSynchronously?: boolean) => void

___

### maskAsUnicode

•  **maskAsUnicode**: (str: string, computePositions?: boolean) => string

___

### maskNames

•  **maskNames**: boolean

___

### maskString

•  **maskString**: (str: string, computePositions?: boolean, prefix?: string, postfix?: string) => string \| [Positions](mmir_lib.positions.md)

___

### maskValues

•  **maskValues**: boolean

___

### parseStopWords

•  **parseStopWords**: () => void

___

### postproc

•  **postproc**: (procResult: any, pos: [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo), processingSteps?: [ProcessingStep](mmir_lib.processingstep.md)[]) => any

___

### preproc

•  **preproc**: (thePhrase: string, pos?: [ProcessingPositionsInfo](../modules/mmir_lib.md#processingpositionsinfo), processingSteps?: [ProcessingStep](mmir_lib.processingstep.md)[]) => string

___

### procList

•  **procList**: [ProcessingStep](mmir_lib.processingstep.md)[]

___

### recodeJSON

•  **recodeJSON**: (json: any, recodeFunc: (str: string) => string, isMaskValues?: boolean, isMaskNames?: boolean) => any

___

### removeProc

•  **removeProc**: (proc: number \| string) => [ProcessingStep](mmir_lib.processingstep.md) \| undefined

___

### removeStopwords

•  **removeStopwords**: (inputStr: string, isCalcPosition?: boolean) => string \| [Positions](mmir_lib.positions.md)

___

### setGrammarDef

•  **setGrammarDef**: (rawGrammarSyntax: string) => void

___

### setGrammarFunction

•  **setGrammarFunction**: (execGrammarFunc: (text: string, callback?: (semanticResult: {}) => void) => void, isAsync?: boolean) => void

___

### setGrammarSource

•  **setGrammarSource**: (src\_code: string) => void

___

### setStopWords

•  **setStopWords**: (stopWordArray: string[]) => void

___

### stop\_words\_regexp

•  **stop\_words\_regexp**: RegExp

___

### unmaskJSON

•  **unmaskJSON**: (json: any, isMaskValues?: boolean, isMaskNames?: boolean) => any

___

### unmaskString

•  **unmaskString**: (str: string, computePositions?: boolean, detector?: RegExp) => string \| [Positions](mmir_lib.positions.md)
