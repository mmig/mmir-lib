**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / SpeechConfig

# Interface: SpeechConfig

## Hierarchy

* [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md)

  ↳ **SpeechConfig**

## Index

### Properties

* [language](mmir_lib.speechconfig.md#language)
* [long](mmir_lib.speechconfig.md#long)
* [plugins](mmir_lib.speechconfig.md#plugins)
* [voice](mmir_lib.speechconfig.md#voice)

## Properties

### language

•  **language**: string

*Overrides [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[language](mmir_lib.simplespeechconfig.md#language)*

___

### long

• `Optional` **long**: string

*Inherited from [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[long](mmir_lib.simplespeechconfig.md#long)*

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

### plugins

•  **plugins**: { [pluginId:string]: [SpeechConfigPluginEntry](mmir_lib.speechconfigpluginentry.md);  }

specific plugin speech-configurations that override the general
configuration settings

___

### voice

• `Optional` **voice**: \"male\" \| \"female\"

*Overrides [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[voice](mmir_lib.simplespeechconfig.md#voice)*

voice  feature (may not be supported by selected TTS plugin)

NOTE the root SpeechConfig should not have a specific voice-name, but
     only a feature specified (since it is very unlikely that all plugins
     support the same voice-name)
