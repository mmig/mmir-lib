[mmir-lib 6.1.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [TTSOptions](mmir_lib.ttsoptions.md)

# Interface: TTSOptions

## Hierarchy

* **TTSOptions**

## Index

### Properties

* [error](mmir_lib.ttsoptions.md#optional-error)
* [language](mmir_lib.ttsoptions.md#optional-language)
* [pauseDuration](mmir_lib.ttsoptions.md#optional-pauseduration)
* [ready](mmir_lib.ttsoptions.md#optional-ready)
* [success](mmir_lib.ttsoptions.md#optional-success)
* [text](mmir_lib.ttsoptions.md#text)
* [voice](mmir_lib.ttsoptions.md#optional-voice)

## Properties

### `Optional` error

• **error**? : *[TTSOnError](../modules/mmir_lib.md#ttsonerror)*

the error callback (see arg failureCallback)

___

### `Optional` language

• **language**? : *string*

the language for synthesis (if omitted, the current language setting is used)

___

### `Optional` pauseDuration

• **pauseDuration**? : *number*

the length of the pauses between sentences (i.e. for String Arrays) in milliseconds

___

### `Optional` ready

• **ready**? : *[TTSOnReady](../modules/mmir_lib.md#ttsonready)*

the audio-ready callback (see arg onReadyCallback)

___

### `Optional` success

• **success**? : *[TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete)*

the on-playing-completed callback (see arg onPlayedCallback)

___

###  text

• **text**: *string | string[]*

text that should be read aloud

___

### `Optional` voice

• **voice**? : *string*

the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine
