**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / Resources

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

### getBasePath

•  **getBasePath**: () => string

___

### getBeepUrl

•  **getBeepUrl**: () => string

___

### getCompiledLayoutPath

•  **getCompiledLayoutPath**: () => string

___

### getCompiledViewPath

•  **getCompiledViewPath**: () => string

___

### getConfigurationFileUrl

•  **getConfigurationFileUrl**: () => string

___

### getControllerPath

•  **getControllerPath**: () => string

___

### getDictionaryFileUrl

•  **getDictionaryFileUrl**: (langCode?: string) => string

___

### getDirectoriesFileUrl

•  **getDirectoriesFileUrl**: () => string

___

### getEnv

•  **getEnv**: () => [EnvType](../modules/mmir_lib.md#envtype) \| \"default\" \| string

___

### getEnvPlatform

•  **getEnvPlatform**: () => [PlatfromType](../modules/mmir_lib.md#platfromtype) \| \"default\"

___

### getExtensionsPath

•  **getExtensionsPath**: () => string

___

### getGeneratedGrammarsPath

•  **getGeneratedGrammarsPath**: () => string

___

### getGeneratedStateModelsPath

•  **getGeneratedStateModelsPath**: () => string

___

### getGrammarFileUrl

•  **getGrammarFileUrl**: (langCode?: string) => string

___

### getGrammarPluginPath

•  **getGrammarPluginPath**: () => string

___

### getHelperPath

•  **getHelperPath**: () => string

___

### getHelperSuffix

•  **getHelperSuffix**: () => string

___

### getLanguage

•  **getLanguage**: () => string

___

### getLanguagePath

•  **getLanguagePath**: () => string

___

### getLayoutPath

•  **getLayoutPath**: () => string

___

### getMediaPluginPath

•  **getMediaPluginPath**: () => string

___

### getModelPath

•  **getModelPath**: () => string

___

### getPartialsPrefix

•  **getPartialsPrefix**: () => string

___

### getSpeechConfigFileUrl

•  **getSpeechConfigFileUrl**: (langCode?: string) => string

___

### getViewPath

•  **getViewPath**: () => string

___

### getWorkerPath

•  **getWorkerPath**: () => string

___

### init

•  **init**: (theForBrowserParameter?: [EnvType](../modules/mmir_lib.md#envtype) \| [EnvInfo](mmir_lib.envinfo.md) & { isAbsolutePath?: true \| (path: string) => boolean  } \| string \| boolean, isReset?: boolean) => any

___

### isBrowserEnv

•  **isBrowserEnv**: () => boolean

___

### isCordovaEnv

•  **isCordovaEnv**: () => boolean
