[mmir-lib 6.0.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [Grammar](mmir_lib.grammar.md)

# Interface: Grammar

interface definition for JSON grammar

## Hierarchy

* **Grammar**

## Index

### Properties

* [example_phrase](mmir_lib.grammar.md#optional-example_phrase)
* [example_phrases](mmir_lib.grammar.md#optional-example_phrases)
* [stop_word](mmir_lib.grammar.md#stop_word)
* [stopwords](mmir_lib.grammar.md#stopwords)
* [tokens](mmir_lib.grammar.md#tokens)
* [utterances](mmir_lib.grammar.md#utterances)

## Properties

### `Optional` example_phrase

• **example_phrase**? : *string*

**`deprecated`** use field [example_phrases](mmir_lib.grammar.md#optional-example_phrases) instead

___

### `Optional` example_phrases

• **example_phrases**? : *string | Array‹string›*

___

###  stop_word

• **stop_word**: *Array‹string›*

**`deprecated`** use field [stopwords](mmir_lib.grammar.md#stopwords) instead

___

###  stopwords

• **stopwords**: *Array‹string›*

___

###  tokens

• **tokens**: *object*

#### Type declaration:

* \[ **id**: *string*\]: Array‹string›

___

###  utterances

• **utterances**: *object*

#### Type declaration:

* \[ **id**: *string*\]: object

* **phrases**: *Array‹string›*

* **semantic**: *any*
