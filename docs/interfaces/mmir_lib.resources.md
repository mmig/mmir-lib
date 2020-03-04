[mmir-lib 6.1.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [Resources](mmir_lib.resources.md)

# Interface: Resources

## Hierarchy

* **Resources**

## Index

### Properties

* [getBasePath](mmir_lib.resources.md#getbasepath)
* [getBeepUrl](mmir_lib.resources.md#getbeepurl)
* [getCompiledLayoutPath](mmir_lib.resources.md#getcompiledlayoutpath)
* [getCompiledViewPath](mmir_lib.resources.md#getcompiledviewpath)
* [getConfigurationFileUrl](mmir_lib.resources.md#getconfigurationfileurl)
* [getControllerPath](mmir_lib.resources.md#getcontrollerpath)
* [getDictionaryFileUrl](mmir_lib.resources.md#getdictionaryfileurl)
* [getDirectoriesFileUrl](mmir_lib.resources.md#getdirectoriesfileurl)
* [getEnv](mmir_lib.resources.md#getenv)
* [getEnvPlatform](mmir_lib.resources.md#getenvplatform)
* [getExtensionsPath](mmir_lib.resources.md#getextensionspath)
* [getGeneratedGrammarsPath](mmir_lib.resources.md#getgeneratedgrammarspath)
* [getGeneratedStateModelsPath](mmir_lib.resources.md#getgeneratedstatemodelspath)
* [getGrammarFileUrl](mmir_lib.resources.md#getgrammarfileurl)
* [getGrammarPluginPath](mmir_lib.resources.md#getgrammarpluginpath)
* [getHelperPath](mmir_lib.resources.md#gethelperpath)
* [getHelperSuffix](mmir_lib.resources.md#gethelpersuffix)
* [getLanguage](mmir_lib.resources.md#getlanguage)
* [getLanguagePath](mmir_lib.resources.md#getlanguagepath)
* [getLayoutPath](mmir_lib.resources.md#getlayoutpath)
* [getMediaPluginPath](mmir_lib.resources.md#getmediapluginpath)
* [getModelPath](mmir_lib.resources.md#getmodelpath)
* [getPartialsPrefix](mmir_lib.resources.md#getpartialsprefix)
* [getSpeechConfigFileUrl](mmir_lib.resources.md#getspeechconfigfileurl)
* [getViewPath](mmir_lib.resources.md#getviewpath)
* [getWorkerPath](mmir_lib.resources.md#getworkerpath)
* [init](mmir_lib.resources.md#init)
* [isBrowserEnv](mmir_lib.resources.md#isbrowserenv)
* [isCordovaEnv](mmir_lib.resources.md#iscordovaenv)

## Properties

###  getBasePath

• **getBasePath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getBeepUrl

• **getBeepUrl**: *function*

#### Type declaration:

▸ (): *string*

___

###  getCompiledLayoutPath

• **getCompiledLayoutPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getCompiledViewPath

• **getCompiledViewPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getConfigurationFileUrl

• **getConfigurationFileUrl**: *function*

#### Type declaration:

▸ (): *string*

___

###  getControllerPath

• **getControllerPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getDictionaryFileUrl

• **getDictionaryFileUrl**: *function*

#### Type declaration:

▸ (`langCode?`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`langCode?` | string |

___

###  getDirectoriesFileUrl

• **getDirectoriesFileUrl**: *function*

#### Type declaration:

▸ (): *string*

___

###  getEnv

• **getEnv**: *function*

#### Type declaration:

▸ (): *[EnvType](../modules/mmir_lib.md#envtype) | "default" | string*

___

###  getEnvPlatform

• **getEnvPlatform**: *function*

#### Type declaration:

▸ (): *[PlatfromType](../modules/mmir_lib.md#platfromtype) | "default"*

___

###  getExtensionsPath

• **getExtensionsPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getGeneratedGrammarsPath

• **getGeneratedGrammarsPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getGeneratedStateModelsPath

• **getGeneratedStateModelsPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getGrammarFileUrl

• **getGrammarFileUrl**: *function*

#### Type declaration:

▸ (`langCode?`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`langCode?` | string |

___

###  getGrammarPluginPath

• **getGrammarPluginPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getHelperPath

• **getHelperPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getHelperSuffix

• **getHelperSuffix**: *function*

#### Type declaration:

▸ (): *string*

___

###  getLanguage

• **getLanguage**: *function*

#### Type declaration:

▸ (): *string*

___

###  getLanguagePath

• **getLanguagePath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getLayoutPath

• **getLayoutPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getMediaPluginPath

• **getMediaPluginPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getModelPath

• **getModelPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getPartialsPrefix

• **getPartialsPrefix**: *function*

#### Type declaration:

▸ (): *string*

___

###  getSpeechConfigFileUrl

• **getSpeechConfigFileUrl**: *function*

#### Type declaration:

▸ (`langCode?`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`langCode?` | string |

___

###  getViewPath

• **getViewPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  getWorkerPath

• **getWorkerPath**: *function*

#### Type declaration:

▸ (): *string*

___

###  init

• **init**: *function*

#### Type declaration:

▸ (`theForBrowserParameter?`: [EnvType](../modules/mmir_lib.md#envtype) | [EnvInfo](mmir_lib.envinfo.md) & object | string | boolean, `isReset?`: boolean): *any*

**Parameters:**

Name | Type |
------ | ------ |
`theForBrowserParameter?` | [EnvType](../modules/mmir_lib.md#envtype) &#124; [EnvInfo](mmir_lib.envinfo.md) & object &#124; string &#124; boolean |
`isReset?` | boolean |

___

###  isBrowserEnv

• **isBrowserEnv**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  isCordovaEnv

• **isCordovaEnv**: *function*

#### Type declaration:

▸ (): *boolean*
