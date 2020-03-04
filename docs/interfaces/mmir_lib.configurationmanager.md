[mmir-lib 6.1.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [ConfigurationManager](mmir_lib.configurationmanager.md)

# Interface: ConfigurationManager

## Hierarchy

* **ConfigurationManager**

## Index

### Properties

* [addListener](mmir_lib.configurationmanager.md#addlistener)
* [get](mmir_lib.configurationmanager.md#get)
* [getBoolean](mmir_lib.configurationmanager.md#getboolean)
* [getString](mmir_lib.configurationmanager.md#getstring)
* [off](mmir_lib.configurationmanager.md#off)
* [on](mmir_lib.configurationmanager.md#on)
* [removeListener](mmir_lib.configurationmanager.md#removelistener)
* [set](mmir_lib.configurationmanager.md#set)

## Properties

###  addListener

• **addListener**: *function*

#### Type declaration:

▸ (`listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `propertyName?`: string | string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`propertyName?` | string &#124; string[] |

___

###  get

• **get**: *function*

#### Type declaration:

▸ (`propertyName`: string | string[], `defaultValue?`: any, `useSafeAccess?`: boolean): *any*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string &#124; string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

___

###  getBoolean

• **getBoolean**: *function*

#### Type declaration:

▸ (`propertyName`: string | string[], `defaultValue?`: any, `useSafeAccess?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string &#124; string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

___

###  getString

• **getString**: *function*

#### Type declaration:

▸ (`propertyName`: string | string[], `defaultValue?`: any, `useSafeAccess?`: boolean): *string*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string &#124; string[] |
`defaultValue?` | any |
`useSafeAccess?` | boolean |

___

###  off

• **off**: *function*

#### Type declaration:

▸ (`listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `propertyName?`: string | string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`propertyName?` | string &#124; string[] |

___

###  on

• **on**: *function*

#### Type declaration:

▸ (`listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `propertyName?`: string | string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`propertyName?` | string &#124; string[] |

___

###  removeListener

• **removeListener**: *function*

#### Type declaration:

▸ (`listener`: [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener), `propertyName?`: string | string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`listener` | [ConfigurationChangeListener](../modules/mmir_lib.md#configurationchangelistener) |
`propertyName?` | string &#124; string[] |

___

###  set

• **set**: *function*

#### Type declaration:

▸ (`propertyName`: string | string[], `value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`propertyName` | string &#124; string[] |
`value` | any |
