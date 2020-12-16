**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / ASROptions

# Interface: ASROptions

## Hierarchy

* **ASROptions**

## Index

### Properties

* [disableImprovedFeedback](mmir_lib.asroptions.md#disableimprovedfeedback)
* [eosPause](mmir_lib.asroptions.md#eospause)
* [error](mmir_lib.asroptions.md#error)
* [intermediate](mmir_lib.asroptions.md#intermediate)
* [language](mmir_lib.asroptions.md#language)
* [mode](mmir_lib.asroptions.md#mode)
* [results](mmir_lib.asroptions.md#results)
* [success](mmir_lib.asroptions.md#success)

## Properties

### disableImprovedFeedback

• `Optional` **disableImprovedFeedback**: boolean

disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)

___

### eosPause

• `Optional` **eosPause**: [EOSPause](../modules/mmir_lib.md#eospause)

length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)

___

### error

• `Optional` **error**: [ASROnError](../modules/mmir_lib.md#asronerror)

the error callback (see arg failureCallback)

___

### intermediate

• `Optional` **intermediate**: boolean

set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)

___

### language

• `Optional` **language**: string

the language for recognition (if omitted, the current language setting is used)

___

### mode

• `Optional` **mode**: [ASRMode](../modules/mmir_lib.md#asrmode)

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### results

• `Optional` **results**: number

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### success

• `Optional` **success**: [ASROnStatus](../modules/mmir_lib.md#asronstatus)

the status-callback (see arg statusCallback)
