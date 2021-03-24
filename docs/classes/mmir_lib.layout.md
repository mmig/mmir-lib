**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / Layout

# Class: Layout

## Hierarchy

* **Layout**

## Index

### Constructors

* [constructor](mmir_lib.layout.md#constructor)

### Methods

* [getBodyContents](mmir_lib.layout.md#getbodycontents)
* [getDialogsContents](mmir_lib.layout.md#getdialogscontents)
* [getHeaderContents](mmir_lib.layout.md#getheadercontents)
* [getName](mmir_lib.layout.md#getname)
* [getYields](mmir_lib.layout.md#getyields)
* [stringify](mmir_lib.layout.md#stringify)

## Constructors

### constructor

\+ **new Layout**(`name`: string, `definition`: string, `remote?`: boolean, `ignoreMissingBody?`: boolean): [Layout](mmir_lib.layout.md)

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |
`definition` | string |
`remote?` | boolean |
`ignoreMissingBody?` | boolean |

**Returns:** [Layout](mmir_lib.layout.md)

## Methods

### getBodyContents

▸ **getBodyContents**(): string

**Returns:** string

___

### getDialogsContents

▸ **getDialogsContents**(): string

**Returns:** string

___

### getHeaderContents

▸ **getHeaderContents**(): string

**Returns:** string

___

### getName

▸ **getName**(): string

**Returns:** string

___

### getYields

▸ **getYields**(): [YieldDeclaration](mmir_lib.yielddeclaration.md)[]

**Returns:** [YieldDeclaration](mmir_lib.yielddeclaration.md)[]

___

### stringify

▸ **stringify**(`disableStrictMode?`: boolean): string

#### Parameters:

Name | Type |
------ | ------ |
`disableStrictMode?` | boolean |

**Returns:** string
