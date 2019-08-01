> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md) /

# Interface: SimpleSpeechConfig

## Hierarchy

* **SimpleSpeechConfig**

  * [SpeechConfig](mmir_lib.speechconfig.md)

  * [SpeechConfigPluginEntry](mmir_lib.speechconfigpluginentry.md)

## Index

### Properties

* [language](mmir_lib.simplespeechconfig.md#optional-language)
* [long](mmir_lib.simplespeechconfig.md#optional-long)
* [voice](mmir_lib.simplespeechconfig.md#optional-voice)

## Properties

### `Optional` language

• **language**? : *string*

*Defined in [mmir.d.ts:478](../../mmir.d.ts#L478)*

local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US"

___

### `Optional` long

• **long**? : *string*

*Defined in [mmir.d.ts:480](../../mmir.d.ts#L480)*

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

### `Optional` voice

• **voice**? : *"male" | "female" | string*

*Defined in [mmir.d.ts:482](../../mmir.d.ts#L482)*

voice name or feature (may not be supported by selected TTS plugin)