> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [ASROptions](mmir_lib.asroptions.md) /

# Interface: ASROptions

## Hierarchy

* **ASROptions**

## Index

### Properties

* [disableImprovedFeedback](mmir_lib.asroptions.md#optional-disableimprovedfeedback)
* [eosPause](mmir_lib.asroptions.md#optional-eospause)
* [error](mmir_lib.asroptions.md#optional-error)
* [intermediate](mmir_lib.asroptions.md#optional-intermediate)
* [language](mmir_lib.asroptions.md#optional-language)
* [mode](mmir_lib.asroptions.md#optional-mode)
* [results](mmir_lib.asroptions.md#optional-results)
* [success](mmir_lib.asroptions.md#optional-success)

## Properties

### `Optional` disableImprovedFeedback

• **disableImprovedFeedback**? : *boolean*

disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)

___

### `Optional` eosPause

• **eosPause**? : *[EOSPause](../modules/mmir_lib.md#eospause)*

length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)

___

### `Optional` error

• **error**? : *[ASROnError](../modules/mmir_lib.md#asronerror)*

the error callback (see arg failureCallback)

___

### `Optional` intermediate

• **intermediate**? : *boolean*

set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)

___

### `Optional` language

• **language**? : *string*

the language for recognition (if omitted, the current language setting is used)

___

### `Optional` mode

• **mode**? : *[ASRMode](../modules/mmir_lib.md#asrmode)*

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### `Optional` results

• **results**? : *number*

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### `Optional` success

• **success**? : *[ASROnStatus](../modules/mmir_lib.md#asronstatus)*

the status-callback (see arg statusCallback)