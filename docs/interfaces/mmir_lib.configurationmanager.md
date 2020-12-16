**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / ConfigurationManager

# Interface: ConfigurationManager

## Hierarchy

* **ConfigurationManager**

## Index

### Methods

* [addListener](mmir_lib.configurationmanager.md#addlistener)
* [get](mmir_lib.configurationmanager.md#get)
* [getBoolean](mmir_lib.configurationmanager.md#getboolean)
* [getString](mmir_lib.configurationmanager.md#getstring)
* [off](mmir_lib.configurationmanager.md#off)
* [on](mmir_lib.configurationmanager.md#on)
* [removeListener](mmir_lib.configurationmanager.md#removelistener)
* [set](mmir_lib.configurationmanager.md#set)

## Methods

### addListener

▸ **addListener**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **addListener**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **addListener**(`allChangesListener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`allChangesListener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

___

### get

▸ **get**(`propertyName`: string \| string[], `defaultValue?`: any, `useSafeAccess?`: boolean): any

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

**Returns:** any

___

### getBoolean

▸ **getBoolean**(`propertyName`: string \| string[], `defaultValue?`: any, `useSafeAccess?`: boolean): boolean

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

**Returns:** boolean

___

### getString

▸ **getString**(`propertyName`: string \| string[], `defaultValue?`: any, `useSafeAccess?`: boolean): string

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

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

▸ **on**(`propertyName`: string, `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

**Returns:** void

▸ **on**(`propertyNamePath`: string[], `listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener)): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyNamePath` | string[] |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |

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

▸ **set**(`propertyName`: string \| string[], `value`: any): void

#### Parameters:

Name | Type |
------ | ------ |
`propertyName` | string \| string[] |
`value` | any |

**Returns:** void
