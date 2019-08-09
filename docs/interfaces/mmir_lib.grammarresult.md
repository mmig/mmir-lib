> **[mmir-lib 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [GrammarResult](mmir_lib.grammarresult.md) /

# Interface: GrammarResult

## Hierarchy

* **GrammarResult**

## Index

### Properties

* [engine](mmir_lib.grammarresult.md#engine)
* [error](mmir_lib.grammarresult.md#optional-error)
* [phrase](mmir_lib.grammarresult.md#phrase)
* [phrases](mmir_lib.grammarresult.md#optional-phrases)
* [preproc](mmir_lib.grammarresult.md#preproc)
* [semantic](mmir_lib.grammarresult.md#optional-semantic)
* [utterance](mmir_lib.grammarresult.md#optional-utterance)

## Properties

###  engine

• **engine**: *[GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)*

___

### `Optional` error

• **error**? : *any*

___

###  phrase

• **phrase**: *string*

___

### `Optional` phrases

• **phrases**? : *`Array<PhraseInfo>`*

___

###  preproc

• **preproc**: *object*

#### Type declaration:

* \[ **preprocName**: *string*\]: `Array<Pos>`

___

### `Optional` semantic

• **semantic**? : *any*

___

### `Optional` utterance

• **utterance**? : *string*