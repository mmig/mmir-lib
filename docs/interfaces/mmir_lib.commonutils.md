> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [CommonUtils](mmir_lib.commonutils.md) /

# Interface: CommonUtils

## Hierarchy

* **CommonUtils**

## Index

### Properties

* [checkNetworkConnection](mmir_lib.commonutils.md#checknetworkconnection)
* [concatArray](mmir_lib.commonutils.md#concatarray)
* [getCompiledGrammarPath](mmir_lib.commonutils.md#getcompiledgrammarpath)
* [getDirectoryContents](mmir_lib.commonutils.md#getdirectorycontents)
* [getDirectoryContentsWithFilter](mmir_lib.commonutils.md#getdirectorycontentswithfilter)
* [getDirectoryStructure](mmir_lib.commonutils.md#getdirectorystructure)
* [getLocalScript](mmir_lib.commonutils.md#getlocalscript)
* [getPartialsPrefix](mmir_lib.commonutils.md#getpartialsprefix)
* [init](mmir_lib.commonutils.md#init)
* [isArray](mmir_lib.commonutils.md#isarray)
* [isRunningOnAndroid](mmir_lib.commonutils.md#isrunningonandroid)
* [isRunningOnSmartphone](mmir_lib.commonutils.md#isrunningonsmartphone)
* [loadCompiledGrammars](mmir_lib.commonutils.md#loadcompiledgrammars)
* [loadDirectoryStructure](mmir_lib.commonutils.md#loaddirectorystructure)
* [loadImpl](mmir_lib.commonutils.md#loadimpl)
* [loadScript](mmir_lib.commonutils.md#loadscript)
* [parseParamsToDictionary](mmir_lib.commonutils.md#parseparamstodictionary)
* [regexHTMLComment](mmir_lib.commonutils.md#regexhtmlcomment)
* [resizeFitToSourroundingBox](mmir_lib.commonutils.md#resizefittosourroundingbox)
* [stripPathName](mmir_lib.commonutils.md#strippathname)

## Properties

###  checkNetworkConnection

• **checkNetworkConnection**: *function*

#### Type declaration:

▸ (): *any*

___

###  concatArray

• **concatArray**: *function*

#### Type declaration:

▸ (`array`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`array` | any |

___

###  getCompiledGrammarPath

• **getCompiledGrammarPath**: *function*

#### Type declaration:

▸ (`generatedGrammarsPath`: any, `grammarId`: any, `isFileNameOnly`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`generatedGrammarsPath` | any |
`grammarId` | any |
`isFileNameOnly` | any |

___

###  getDirectoryContents

• **getDirectoryContents**: *function*

#### Type declaration:

▸ (`pathname`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pathname` | any |

___

###  getDirectoryContentsWithFilter

• **getDirectoryContentsWithFilter**: *function*

#### Type declaration:

▸ (`pathname`: any, `filter`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pathname` | any |
`filter` | any |

___

###  getDirectoryStructure

• **getDirectoryStructure**: *function*

#### Type declaration:

▸ (): *any*

___

###  getLocalScript

• **getLocalScript**: *function*

#### Type declaration:

▸ (`scriptUrl`: any, `success`: any, `fail`: any, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`scriptUrl` | any |
`success` | any |
`fail` | any |
`...args` | any[] |

___

###  getPartialsPrefix

• **getPartialsPrefix**: *function*

#### Type declaration:

▸ (): *any*

___

###  init

• **init**: *function*

#### Type declaration:

▸ (`onsuccess`: any, `onerror`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`onsuccess` | any |
`onerror` | any |

___

###  isArray

• **isArray**: *function*

#### Type declaration:

▸ (`object`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`object` | any |

___

###  isRunningOnAndroid

• **isRunningOnAndroid**: *function*

#### Type declaration:

▸ (): *any*

___

###  isRunningOnSmartphone

• **isRunningOnSmartphone**: *function*

#### Type declaration:

▸ (): *any*

___

###  loadCompiledGrammars

• **loadCompiledGrammars**: *function*

#### Type declaration:

▸ (`generatedGrammarsPath`: string, `cbFunction`: `Function`, `ignoreGrammarIds?`: `Array<string>`): *any*

**Parameters:**

Name | Type |
------ | ------ |
`generatedGrammarsPath` | string |
`cbFunction` | `Function` |
`ignoreGrammarIds?` | `Array<string>` |

___

###  loadDirectoryStructure

• **loadDirectoryStructure**: *function*

#### Type declaration:

▸ (`success`: any, `errorFunc`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`success` | any |
`errorFunc` | any |

___

###  loadImpl

• **loadImpl**: *function*

#### Type declaration:

▸ (`librariesPath`: any, `isSerial`: any, `completedCallback`: any, `checkIsAlreadyLoadedFunc`: any, `statusCallback`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`librariesPath` | any |
`isSerial` | any |
`completedCallback` | any |
`checkIsAlreadyLoadedFunc` | any |
`statusCallback` | any |

___

###  loadScript

• **loadScript**: *function*

#### Type declaration:

▸ (`url`: any, `successCallback`: any, `errorCallback`: any, ...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`successCallback` | any |
`errorCallback` | any |
`...args` | any[] |

___

###  parseParamsToDictionary

• **parseParamsToDictionary**: *function*

#### Type declaration:

▸ (`urlParamsPartStrings`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`urlParamsPartStrings` | any |

___

###  regexHTMLComment

• **regexHTMLComment**: *`RegExp`*

___

###  resizeFitToSourroundingBox

• **resizeFitToSourroundingBox**: *function*

#### Type declaration:

▸ (`class_name`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`class_name` | any |

___

###  stripPathName

• **stripPathName**: *function*

#### Type declaration:

▸ (`pathname`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pathname` | any |