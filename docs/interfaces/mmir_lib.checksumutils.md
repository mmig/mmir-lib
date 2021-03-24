**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / ChecksumUtils

# Interface: ChecksumUtils

**`example`** 
var checksumUtils = require('mmirf/checksumUtils').init();

## Hierarchy

* **ChecksumUtils**

## Index

### Methods

* [createContent](mmir_lib.checksumutils.md#createcontent)
* [getConentSeparator](mmir_lib.checksumutils.md#getconentseparator)
* [getFileExt](mmir_lib.checksumutils.md#getfileext)
* [init](mmir_lib.checksumutils.md#init)
* [isSame](mmir_lib.checksumutils.md#issame)
* [parseContent](mmir_lib.checksumutils.md#parsecontent)

## Methods

### createContent

▸ **createContent**(`originalText`: string, `additionalInfo?`: string): string

Creates the content for a checksum file, containing information about
the size and hash-value for the supplied String argument.

The result can be "written as is" to a file.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`originalText` | string |        the "raw" text for which to generate the checksum information |
`additionalInfo?` | string | - |

**Returns:** string

the checksum information as a String (formatted as content of a checksum file)

___

### getConentSeparator

▸ **getConentSeparator**(): string

The Char used for separating fields within checksum files.

**Returns:** string

the separator char (TAB)

___

### getFileExt

▸ **getFileExt**(): string

Returns the file extension for checksum-files.

**Returns:** string

the default file extension for checksum files
						(including the separating dot, eg. ".checksum.txt")

___

### init

▸ **init**(`cryptoImpl?`: [CryptoImpl](../modules/mmir_lib.md#cryptoimpl)): void

Must be called before using checksum-generation:
sets/initializes the object/function for checksum generation.

After first call, following calls to this function will have no effect.

#### Parameters:

Name | Type |
------ | ------ |
`cryptoImpl?` | [CryptoImpl](../modules/mmir_lib.md#cryptoimpl) |

**Returns:** void

___

### isSame

▸ **isSame**(`rawTextContent`: string, `referenceHash`: string \| [ChecksumInfo](../modules/mmir_lib.md#checksuminfo), `additionalInfo?`: string): boolean

Check if the length / checksum for a raw text is the same as the checksum-information.

NOTE: The actual checksum for the raw text is only generated & checked, if the size is equal.

**`function`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rawTextContent` | string |       the (raw) text/content which should be checked |
`referenceHash` | string \| [ChecksumInfo](../modules/mmir_lib.md#checksuminfo) |       the checksum information to check against: either the      raw content (String) of a checksum file, or the parsed      contents of a checksum file, which is a PlainObject with      properties:      <pre>{ size: INTEGER, hash: STRING, info?: STRING }</pre> |
`additionalInfo?` | string | - |

**Returns:** boolean

					<code>true</code> if the raw content matches the hash

___

### parseContent

▸ **parseContent**(`rawTextContent`: string): [ChecksumInfo](../modules/mmir_lib.md#checksuminfo)

Parses the raw text-content of a checksum file and returns an object
with properties:

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rawTextContent` | string |       the raw conent of a checksum file  |

**Returns:** [ChecksumInfo](../modules/mmir_lib.md#checksuminfo)

an object with the extracted properties from the checksum-data:
												<pre>{ size: INTEGER, hash: STRING, info?: STRING }</pre>
