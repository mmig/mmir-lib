> **[mmir-lib 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [Grammar](mmir_lib.grammar.md) /

# Interface: Grammar

interface definition for JSON grammar

## Hierarchy

* **Grammar**

## Index

### Properties

* [example_phrase](mmir_lib.grammar.md#optional-example_phrase)
* [stop_word](mmir_lib.grammar.md#stop_word)
* [tokens](mmir_lib.grammar.md#tokens)
* [utterances](mmir_lib.grammar.md#utterances)

## Properties

### `Optional` example_phrase

• **example_phrase**? : *string*

___

###  stop_word

• **stop_word**: *`Array<string>`*

___

###  tokens

• **tokens**: *object*

#### Type declaration:

* \[ **id**: *string*\]: `Array<string>`

___

###  utterances

• **utterances**: *object*

#### Type declaration:

* \[ **id**: *string*\]: object

* **phrases**: *`Array<string>`*

* **semantic**: *any*