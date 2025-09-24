**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / Grammar

# Interface: Grammar

interface definition for JSON grammar

## Hierarchy

* **Grammar**

## Index

### Properties

* [example\_phrase](mmir_lib.grammar.md#example_phrase)
* [example\_phrases](mmir_lib.grammar.md#example_phrases)
* [stop\_word](mmir_lib.grammar.md#stop_word)
* [stopwords](mmir_lib.grammar.md#stopwords)
* [tokens](mmir_lib.grammar.md#tokens)
* [utterances](mmir_lib.grammar.md#utterances)

## Properties

### example\_phrase

• `Optional` **example\_phrase**: string

**`deprecated`** use field [example_phrases](mmir_lib.grammar.md#example_phrases) instead

___

### example\_phrases

• `Optional` **example\_phrases**: string \| string[]

___

### stop\_word

• `Optional` **stop\_word**: string[]

**`deprecated`** use field [stopwords](mmir_lib.grammar.md#stopwords) instead

___

### stopwords

•  **stopwords**: string[]

___

### tokens

•  **tokens**: { [id:string]: string[];  }

___

### utterances

•  **utterances**: { [id:string]: { phrases: string[] ; semantic: any  };  }
