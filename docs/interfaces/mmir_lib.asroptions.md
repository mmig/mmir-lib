> **[mmir-lib 5.0.0](../README.md)**

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

*Defined in [mmir.d.ts:430](../../mmir.d.ts#L430)*

disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)

___

### `Optional` eosPause

• **eosPause**? : *[EOSPause](../modules/mmir_lib.md#eospause)*

*Defined in [mmir.d.ts:428](../../mmir.d.ts#L428)*

length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)

___

### `Optional` error

• **error**? : *[ASROnError](../modules/mmir_lib.md#asronerror)*

*Defined in [mmir.d.ts:418](../../mmir.d.ts#L418)*

the error callback (see arg failureCallback)

___

### `Optional` intermediate

• **intermediate**? : *boolean*

*Defined in [mmir.d.ts:422](../../mmir.d.ts#L422)*

set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)

___

### `Optional` language

• **language**? : *string*

*Defined in [mmir.d.ts:420](../../mmir.d.ts#L420)*

the language for recognition (if omitted, the current language setting is used)

___

### `Optional` mode

• **mode**? : *[ASRMode](../modules/mmir_lib.md#asrmode)*

*Defined in [mmir.d.ts:426](../../mmir.d.ts#L426)*

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### `Optional` results

• **results**? : *number*

*Defined in [mmir.d.ts:424](../../mmir.d.ts#L424)*

set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)

___

### `Optional` success

• **success**? : *[ASROnStatus](../modules/mmir_lib.md#asronstatus)*

*Defined in [mmir.d.ts:416](../../mmir.d.ts#L416)*

the status-callback (see arg statusCallback)