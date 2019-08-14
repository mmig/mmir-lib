> **[mmir-lib 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [SpeechConfig](mmir_lib.speechconfig.md) /

# Interface: SpeechConfig

## Hierarchy

* [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md)

  * **SpeechConfig**

## Index

### Properties

* [language](mmir_lib.speechconfig.md#language)
* [long](mmir_lib.speechconfig.md#optional-long)
* [plugins](mmir_lib.speechconfig.md#plugins)
* [voice](mmir_lib.speechconfig.md#optional-voice)

## Properties

###  language

• **language**: *string*

*Overrides [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[language](mmir_lib.simplespeechconfig.md#optional-language)*

___

### `Optional` long

• **long**? : *string*

*Inherited from [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[long](mmir_lib.simplespeechconfig.md#optional-long)*

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

###  plugins

• **plugins**: *object*

specific plugin speech-configurations that override the general
configuration settings

#### Type declaration:

* \[ **pluginId**: *string*\]: [SpeechConfigPluginEntry](mmir_lib.speechconfigpluginentry.md)

___

### `Optional` voice

• **voice**? : *"male" | "female"*

*Overrides [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[voice](mmir_lib.simplespeechconfig.md#optional-voice)*

voice  feature (may not be supported by selected TTS plugin)

NOTE the root SpeechConfig should not have a specific voice-name, but
     only a feature specified (since it is very unlikely that all plugins
     support the same voice-name)