> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [LanguageManager](mmir_lib.languagemanager.md) /

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
* [getText](mmir_lib.languagemanager.md#gettext)
* [init](mmir_lib.languagemanager.md#init)
* [setLanguage](mmir_lib.languagemanager.md#setlanguage)

## Properties

###  determineLanguage

• **determineLanguage**: *function*

#### Type declaration:

▸ (`lang`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  existsDictionary

• **existsDictionary**: *function*

#### Type declaration:

▸ (`lang`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  existsGrammar

• **existsGrammar**: *function*

#### Type declaration:

▸ (`lang`: string, `grammarType?`: [GrammarType](../modules/mmir_lib.md#grammartype)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |
`grammarType?` | [GrammarType](../modules/mmir_lib.md#grammartype) |

___

###  existsSpeechConfig

• **existsSpeechConfig**: *function*

#### Type declaration:

▸ (`lang`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  fixLang

• **fixLang**: *function*

#### Type declaration:

▸ (`providerName`: string, `langCode`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`providerName` | string |
`langCode` | string |

___

###  getDefaultLanguage

• **getDefaultLanguage**: *function*

#### Type declaration:

▸ (): *string*

___

###  getDictionary

• **getDictionary**: *function*

#### Type declaration:

▸ (): *object*

* \[ **id**: *string*\]: string

___

###  getLanguage

• **getLanguage**: *function*

#### Type declaration:

▸ (): *string*

___

###  getLanguageConfig

• **getLanguageConfig**: *function*

#### Type declaration:

▸ (`pluginId`: string, `feature`: string, `separator?`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`pluginId` | string |
`feature` | string |
`separator?` | string |

___

###  getLanguages

• **getLanguages**: *function*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  getText

• **getText**: *function*

#### Type declaration:

▸ (`textVarName`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`textVarName` | string |

___

###  init

• **init**: *function*

#### Type declaration:

▸ (`lang`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  setLanguage

• **setLanguage**: *function*

#### Type declaration:

▸ (`lang`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |