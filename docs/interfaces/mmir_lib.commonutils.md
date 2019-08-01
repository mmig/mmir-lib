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

*Defined in [mmir.d.ts:227](../../mmir.d.ts#L227)*

#### Type declaration:

▸ (): *any*

___

###  concatArray

• **concatArray**: *function*

*Defined in [mmir.d.ts:228](../../mmir.d.ts#L228)*

#### Type declaration:

▸ (`array`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`array` | any |

___

###  getCompiledGrammarPath

• **getCompiledGrammarPath**: *function*

*Defined in [mmir.d.ts:229](../../mmir.d.ts#L229)*

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

*Defined in [mmir.d.ts:230](../../mmir.d.ts#L230)*

#### Type declaration:

▸ (`pathname`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pathname` | any |

___

###  getDirectoryContentsWithFilter

• **getDirectoryContentsWithFilter**: *function*

*Defined in [mmir.d.ts:231](../../mmir.d.ts#L231)*

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

*Defined in [mmir.d.ts:232](../../mmir.d.ts#L232)*

#### Type declaration:

▸ (): *any*

___

###  getLocalScript

• **getLocalScript**: *function*

*Defined in [mmir.d.ts:233](../../mmir.d.ts#L233)*

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

*Defined in [mmir.d.ts:234](../../mmir.d.ts#L234)*

#### Type declaration:

▸ (): *any*

___

###  init

• **init**: *function*

*Defined in [mmir.d.ts:235](../../mmir.d.ts#L235)*

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

*Defined in [mmir.d.ts:236](../../mmir.d.ts#L236)*

#### Type declaration:

▸ (`object`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`object` | any |

___

###  isRunningOnAndroid

• **isRunningOnAndroid**: *function*

*Defined in [mmir.d.ts:237](../../mmir.d.ts#L237)*

#### Type declaration:

▸ (): *any*

___

###  isRunningOnSmartphone

• **isRunningOnSmartphone**: *function*

*Defined in [mmir.d.ts:238](../../mmir.d.ts#L238)*

#### Type declaration:

▸ (): *any*

___

###  loadCompiledGrammars

• **loadCompiledGrammars**: *function*

*Defined in [mmir.d.ts:239](../../mmir.d.ts#L239)*

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

*Defined in [mmir.d.ts:240](../../mmir.d.ts#L240)*

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

*Defined in [mmir.d.ts:241](../../mmir.d.ts#L241)*

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

*Defined in [mmir.d.ts:242](../../mmir.d.ts#L242)*

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

*Defined in [mmir.d.ts:243](../../mmir.d.ts#L243)*

#### Type declaration:

▸ (`urlParamsPartStrings`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`urlParamsPartStrings` | any |

___

###  regexHTMLComment

• **regexHTMLComment**: *`RegExp`*

*Defined in [mmir.d.ts:226](../../mmir.d.ts#L226)*

___

###  resizeFitToSourroundingBox

• **resizeFitToSourroundingBox**: *function*

*Defined in [mmir.d.ts:244](../../mmir.d.ts#L244)*

#### Type declaration:

▸ (`class_name`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`class_name` | any |

___

###  stripPathName

• **stripPathName**: *function*

*Defined in [mmir.d.ts:245](../../mmir.d.ts#L245)*

#### Type declaration:

▸ (`pathname`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pathname` | any |