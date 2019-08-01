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

*Defined in [mmir.d.ts:333](../../mmir.d.ts#L333)*

#### Type declaration:

▸ (`lang`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  existsDictionary

• **existsDictionary**: *function*

*Defined in [mmir.d.ts:334](../../mmir.d.ts#L334)*

#### Type declaration:

▸ (`lang`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  existsGrammar

• **existsGrammar**: *function*

*Defined in [mmir.d.ts:335](../../mmir.d.ts#L335)*

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

*Defined in [mmir.d.ts:336](../../mmir.d.ts#L336)*

#### Type declaration:

▸ (`lang`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  fixLang

• **fixLang**: *function*

*Defined in [mmir.d.ts:337](../../mmir.d.ts#L337)*

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

*Defined in [mmir.d.ts:338](../../mmir.d.ts#L338)*

#### Type declaration:

▸ (): *string*

___

###  getDictionary

• **getDictionary**: *function*

*Defined in [mmir.d.ts:339](../../mmir.d.ts#L339)*

#### Type declaration:

▸ (): *object*

● \[▪ **id**: *string*\]: string

___

###  getLanguage

• **getLanguage**: *function*

*Defined in [mmir.d.ts:340](../../mmir.d.ts#L340)*

#### Type declaration:

▸ (): *string*

___

###  getLanguageConfig

• **getLanguageConfig**: *function*

*Defined in [mmir.d.ts:341](../../mmir.d.ts#L341)*

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

*Defined in [mmir.d.ts:342](../../mmir.d.ts#L342)*

#### Type declaration:

▸ (): *`Array<string>`*

___

###  getText

• **getText**: *function*

*Defined in [mmir.d.ts:343](../../mmir.d.ts#L343)*

#### Type declaration:

▸ (`textVarName`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`textVarName` | string |

___

###  init

• **init**: *function*

*Defined in [mmir.d.ts:344](../../mmir.d.ts#L344)*

#### Type declaration:

▸ (`lang`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |

___

###  setLanguage

• **setLanguage**: *function*

*Defined in [mmir.d.ts:345](../../mmir.d.ts#L345)*

#### Type declaration:

▸ (`lang`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`lang` | string |