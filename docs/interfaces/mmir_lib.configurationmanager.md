**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / ConfigurationManager

# Interface: ConfigurationManager

## Hierarchy

* **ConfigurationManager**

## Index

### Methods

* [addListener](mmir_lib.configurationmanager.md#addlistener)
* [get](mmir_lib.configurationmanager.md#get)
* [getBoolean](mmir_lib.configurationmanager.md#getboolean)
* [getNumber](mmir_lib.configurationmanager.md#getnumber)
* [getString](mmir_lib.configurationmanager.md#getstring)
* [off](mmir_lib.configurationmanager.md#off)
* [on](mmir_lib.configurationmanager.md#on)
* [removeListener](mmir_lib.configurationmanager.md#removelistener)
* [set](mmir_lib.configurationmanager.md#set)
* [toPath](mmir_lib.configurationmanager.md#topath)

## Methods

### addListener

▸ **addListener**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `emitOnAdding?`: boolean): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`emitOnAdding?` | boolean |

**Returns:** void

▸ **addListener**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `emitOnAdding?`: boolean): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`emitOnAdding?` | boolean |

**Returns:** void

▸ **addListener**(`allChangesListener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`allChangesListener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

___

### get

▸ **get**(`propertyName`: string \| string[], `defaultValue?`: any, `setAsDefaultIfUnset?`: boolean): any

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`setAsDefaultIfUnset?` | boolean |

**Returns:** any

▸ **get**<T\>(`propertyName`: string \| string[], `defaultValue?`: T, `setAsDefaultIfUnset?`: boolean): T

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | T |
`setAsDefaultIfUnset?` | boolean |

**Returns:** T

___

### getBoolean

▸ **getBoolean**(`propertyName`: string \| string[], `defaultValue?`: any, `setAsDefaultIfUnset?`: boolean): boolean

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`setAsDefaultIfUnset?` | boolean |

**Returns:** boolean

___

### getNumber

▸ **getNumber**(`propertyName`: string \| string[], `defaultValue?`: any, `setAsDefaultIfUnset?`: boolean): number

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`setAsDefaultIfUnset?` | boolean |

**Returns:** number

___

### getString

▸ **getString**(`propertyName`: string \| string[], `defaultValue?`: any, `setAsDefaultIfUnset?`: boolean): string

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`setAsDefaultIfUnset?` | boolean |

**Returns:** string

___

### off

▸ **off**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **off**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **off**(`allChangesListener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`allChangesListener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

___

### on

▸ **on**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `emitOnAdding?`: boolean): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`emitOnAdding?` | boolean |

**Returns:** void

▸ **on**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `emitOnAdding?`: boolean): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`emitOnAdding?` | boolean |

**Returns:** void

▸ **on**(`allChangesListener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`allChangesListener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

___

### removeListener

▸ **removeListener**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **removeListener**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **removeListener**(`allChangesListener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`allChangesListener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

___

### set

▸ **set**(`propertyName`: string \| string[], `value`: any): any

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`value` | any |

**Returns:** any

▸ **set**<T\>(`propertyName`: string \| string[], `value`: T): T

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`value` | T |

**Returns:** T

___

### toPath

▸ **toPath**(`pathStringOrList`: string \| string[]): string[]

#### Parameters:

Name | Type |
------ | ------ |
`pathStringOrList` | string \| string[] |

**Returns:** string[]
