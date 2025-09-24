**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / TTSOptions

# Interface: TTSOptions

## Hierarchy

* **TTSOptions**

## Index

### Properties

* [error](mmir_lib.ttsoptions.md#error)
* [language](mmir_lib.ttsoptions.md#language)
* [pauseDuration](mmir_lib.ttsoptions.md#pauseduration)
* [ready](mmir_lib.ttsoptions.md#ready)
* [success](mmir_lib.ttsoptions.md#success)
* [text](mmir_lib.ttsoptions.md#text)
* [voice](mmir_lib.ttsoptions.md#voice)

## Properties

### error

• `Optional` **error**: [TTSOnError](../modules/mmir_lib.md#ttsonerror)

the error callback (see arg failureCallback)

___

### language

• `Optional` **language**: string

the language for synthesis (if omitted, the current language setting is used)

___

### pauseDuration

• `Optional` **pauseDuration**: number

the length of the pauses between sentences (i.e. for String Arrays) in milliseconds

___

### ready

• `Optional` **ready**: [TTSOnReady](../modules/mmir_lib.md#ttsonready)

the audio-ready callback (see arg onReadyCallback)

___

### success

• `Optional` **success**: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete)

the on-playing-completed callback (see arg onPlayedCallback)

___

### text

•  **text**: string \| string[]

text that should be read aloud

___

### voice

• `Optional` **voice**: string

the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine
