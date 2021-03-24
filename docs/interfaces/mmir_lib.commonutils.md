**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / CommonUtils

# Interface: CommonUtils

## Hierarchy

* **CommonUtils**

## Index

### Properties

* [checkNetworkConnection](mmir_lib.commonutils.md#checknetworkconnection)
* [concatArray](mmir_lib.commonutils.md#concatarray)
* [getCompiledGrammarPath](mmir_lib.commonutils.md#getcompiledgrammarpath)
* [getCompiledResourcesIds](mmir_lib.commonutils.md#getcompiledresourcesids)
* [getDirectoryStructure](mmir_lib.commonutils.md#getdirectorystructure)
* [getLocalScript](mmir_lib.commonutils.md#getlocalscript)
* [getPartialsPrefix](mmir_lib.commonutils.md#getpartialsprefix)
* [init](mmir_lib.commonutils.md#init)
* [isArray](mmir_lib.commonutils.md#isarray)
* [isRunningOnAndroid](mmir_lib.commonutils.md#isrunningonandroid)
* [isRunningOnSmartphone](mmir_lib.commonutils.md#isrunningonsmartphone)
* [listDir](mmir_lib.commonutils.md#listdir)
* [loadCompiledGrammars](mmir_lib.commonutils.md#loadcompiledgrammars)
* [loadDirectoryStructure](mmir_lib.commonutils.md#loaddirectorystructure)
* [loadImpl](mmir_lib.commonutils.md#loadimpl)
* [loadScript](mmir_lib.commonutils.md#loadscript)
* [parseParamsToDictionary](mmir_lib.commonutils.md#parseparamstodictionary)
* [regexHTMLComment](mmir_lib.commonutils.md#regexhtmlcomment)
* [requireProtocol](mmir_lib.commonutils.md#requireprotocol)
* [stripPathName](mmir_lib.commonutils.md#strippathname)

## Properties

### checkNetworkConnection

•  **checkNetworkConnection**: () => any

___

### concatArray

•  **concatArray**: (array: any) => any

___

### getCompiledGrammarPath

•  **getCompiledGrammarPath**: (generatedGrammarsPath: string, grammarId: string, isFileNameOnly?: boolean) => string

___

### getCompiledResourcesIds

•  **getCompiledResourcesIds**: (compiledResourcesPath: string) => string[]

___

### getDirectoryStructure

•  **getDirectoryStructure**: () => any

___

### getLocalScript

•  **getLocalScript**: (scriptUrl: any, success: any, fail: any, ...args: any[]) => void

___

### getPartialsPrefix

•  **getPartialsPrefix**: () => any

___

### init

•  **init**: (onsuccess: any, onerror: any) => any

___

### isArray

•  **isArray**: (object: any) => any

___

### isRunningOnAndroid

•  **isRunningOnAndroid**: () => any

___

### isRunningOnSmartphone

•  **isRunningOnSmartphone**: () => any

___

### listDir

•  **listDir**: (pathname: string, filter: RegExp \| (entry: string) => boolean) => string[]

___

### loadCompiledGrammars

•  **loadCompiledGrammars**: (generatedGrammarsPath: string, cbFunction: [Function](mmir_lib.requirejs.md#function), ignoreGrammarIds?: string[]) => any

___

### loadDirectoryStructure

•  **loadDirectoryStructure**: (success: any, errorFunc: any) => any

___

### loadImpl

•  **loadImpl**: (librariesPath: any, isSerial: any, completedCallback: any, checkIsAlreadyLoadedFunc: any, statusCallback: any) => any

___

### loadScript

•  **loadScript**: (url: any, successCallback: any, errorCallback: any, ...args: any[]) => any

___

### parseParamsToDictionary

•  **parseParamsToDictionary**: (urlParamsPartStrings: any) => any

___

### regexHTMLComment

• `Readonly` **regexHTMLComment**: RegExp

___

### requireProtocol

• `Readonly` **requireProtocol**: string

___

### stripPathName

•  **stripPathName**: (pathname: any) => any
