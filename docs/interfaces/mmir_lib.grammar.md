> **[mmir-lib 5.0.0](../README.md)**

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

*Defined in [mmir.d.ts:98](../../mmir.d.ts#L98)*

___

###  stop_word

• **stop_word**: *`Array<string>`*

*Defined in [mmir.d.ts:100](../../mmir.d.ts#L100)*

___

###  tokens

• **tokens**: *object*

*Defined in [mmir.d.ts:102](../../mmir.d.ts#L102)*

#### Type declaration:

● \[▪ **id**: *string*\]: `Array<string>`

___

###  utterances

• **utterances**: *object*

*Defined in [mmir.d.ts:104](../../mmir.d.ts#L104)*

#### Type declaration:

● \[▪ **id**: *string*\]: object

* **phrases**: *`Array<string>`*

* **semantic**: *any*