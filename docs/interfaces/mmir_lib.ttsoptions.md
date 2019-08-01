> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [TTSOptions](mmir_lib.ttsoptions.md) /

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

*Defined in [mmir.d.ts:409](../../mmir.d.ts#L409)*

the error callback (see arg failureCallback)

___

### `Optional` language

• **language**? : *string*

*Defined in [mmir.d.ts:403](../../mmir.d.ts#L403)*

the language for synthesis (if omitted, the current language setting is used)

___

### `Optional` pauseDuration

• **pauseDuration**? : *number*

*Defined in [mmir.d.ts:401](../../mmir.d.ts#L401)*

the length of the pauses between sentences (i.e. for String Arrays) in milliseconds

___

### `Optional` ready

• **ready**? : *[TTSOnReady](../modules/mmir_lib.md#ttsonready)*

*Defined in [mmir.d.ts:411](../../mmir.d.ts#L411)*

the audio-ready callback (see arg onReadyCallback)

___

### `Optional` success

• **success**? : *[TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete)*

*Defined in [mmir.d.ts:407](../../mmir.d.ts#L407)*

the on-playing-completed callback (see arg onPlayedCallback)

___

###  text

• **text**: *string | string[]*

*Defined in [mmir.d.ts:399](../../mmir.d.ts#L399)*

text that should be read aloud

___

### `Optional` voice

• **voice**? : *string*

*Defined in [mmir.d.ts:405](../../mmir.d.ts#L405)*

the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine