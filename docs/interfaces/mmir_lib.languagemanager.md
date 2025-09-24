**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / LanguageManager

# Interface: LanguageManager

## Hierarchy

* **LanguageManager**

## Index

### Properties

* [determineLanguage](mmir_lib.languagemanager.md#determinelanguage)
* [existsDictionary](mmir_lib.languagemanager.md#existsdictionary)
* [existsGrammar](mmir_lib.languagemanager.md#existsgrammar)
* [existsSpeechConfig](mmir_lib.languagemanager.md#existsspeechconfig)
* [fixLang](mmir_lib.languagemanager.md#fixlang)
* [getDefaultLanguage](mmir_lib.languagemanager.md#getdefaultlanguage)
* [getDictionary](mmir_lib.languagemanager.md#getdictionary)
* [getLanguage](mmir_lib.languagemanager.md#getlanguage)
* [getLanguageConfig](mmir_lib.languagemanager.md#getlanguageconfig)
* [getLanguages](mmir_lib.languagemanager.md#getlanguages)
* [getSpeechConfig](mmir_lib.languagemanager.md#getspeechconfig)
* [getText](mmir_lib.languagemanager.md#gettext)
* [init](mmir_lib.languagemanager.md#init)
* [setLanguage](mmir_lib.languagemanager.md#setlanguage)

## Properties

### determineLanguage

•  **determineLanguage**: (lang: string) => string

___

### existsDictionary

•  **existsDictionary**: (lang: string) => boolean

___

### existsGrammar

•  **existsGrammar**: (lang: string, grammarType?: [GrammarType](../modules/mmir_lib.md#grammartype)) => boolean

___

### existsSpeechConfig

•  **existsSpeechConfig**: (lang: string) => boolean

___

### fixLang

•  **fixLang**: (providerName: string, langCode: string) => string

___

### getDefaultLanguage

•  **getDefaultLanguage**: () => string

___

### getDictionary

•  **getDictionary**: () => { [id:string]: string;  }

___

### getLanguage

•  **getLanguage**: () => string

___

### getLanguageConfig

•  **getLanguageConfig**: (pluginId: string, feature: string, separator?: string) => any

___

### getLanguages

•  **getLanguages**: () => string[]

___

### getSpeechConfig

•  **getSpeechConfig**: () => { [config:string]: any;  }

___

### getText

•  **getText**: (textVarName: string) => string

___

### init

•  **init**: (lang: string) => any

___

### setLanguage

•  **setLanguage**: (lang: string, doNotLoadResources?: boolean) => string
