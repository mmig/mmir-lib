> **[mmir-lib 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [SpeechConfigPluginEntry](mmir_lib.speechconfigpluginentry.md) /

# Interface: SpeechConfigPluginEntry

## Hierarchy

* [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md)

  * **SpeechConfigPluginEntry**

## Index

### Properties

* [language](mmir_lib.speechconfigpluginentry.md#optional-language)
* [long](mmir_lib.speechconfigpluginentry.md#optional-long)
* [voice](mmir_lib.speechconfigpluginentry.md#optional-voice)

## Properties

### `Optional` language

• **language**? : *string*

*Inherited from [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[language](mmir_lib.simplespeechconfig.md#optional-language)*

local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US"

___

### `Optional` long

• **long**? : *string*

*Inherited from [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[long](mmir_lib.simplespeechconfig.md#optional-long)*

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

### `Optional` voice

• **voice**? : *"male" | "female" | string*

*Inherited from [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md).[voice](mmir_lib.simplespeechconfig.md#optional-voice)*

voice name or feature (may not be supported by selected TTS plugin)