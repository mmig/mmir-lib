> **[mmir-lib 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [RequireJsDefine](mmir_lib.requirejsdefine.md) /

# Interface: RequireJsDefine

## Hierarchy

* `Function`

  * **RequireJsDefine**

## Index

### Properties

* [Function](mmir_lib.requirejsdefine.md#function)
* [arguments](mmir_lib.requirejsdefine.md#arguments)
* [caller](mmir_lib.requirejsdefine.md#caller)
* [length](mmir_lib.requirejsdefine.md#length)
* [name](mmir_lib.requirejsdefine.md#name)
* [prototype](mmir_lib.requirejsdefine.md#prototype)

### Methods

* [__@hasInstance](mmir_lib.requirejsdefine.md#__@hasinstance)
* [apply](mmir_lib.requirejsdefine.md#apply)
* [bind](mmir_lib.requirejsdefine.md#bind)
* [call](mmir_lib.requirejsdefine.md#call)
* [toString](mmir_lib.requirejsdefine.md#tostring)

## Properties

###  Function

• **Function**: *`FunctionConstructor`*

___

###  arguments

• **arguments**: *any*

*Inherited from void*

___

###  caller

• **caller**: *`Function`*

*Inherited from void*

___

###  length

• **length**: *number*

*Inherited from void*

___

###  name

• **name**: *string*

*Inherited from void*

Returns the name of the function. Function names are read-only and can not be changed.

___

###  prototype

• **prototype**: *any*

*Inherited from void*

## Methods

###  __@hasInstance

▸ **__@hasInstance**(`value`: any): *boolean*

*Inherited from void*

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

###  apply

▸ **apply**(`this`: `Function`, `thisArg`: any, `argArray?`: any): *any*

*Inherited from void*

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | `Function` | - |
`thisArg` | any | The object to be used as the this object. |
`argArray?` | any | A set of arguments to be passed to the function.  |

**Returns:** *any*

___

###  bind

▸ **bind**(`this`: `Function`, `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from void*

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | `Function` | - |
`thisArg` | any | An object to which the this keyword can refer inside the new function. |
`...argArray` | any[] | A list of arguments to be passed to the new function.  |

**Returns:** *any*

___

###  call

▸ **call**(`this`: `Function`, `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from void*

Calls a method of an object, substituting another object for the current object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | `Function` | - |
`thisArg` | any | The object to be used as the current object. |
`...argArray` | any[] | A list of arguments to be passed to the method.  |

**Returns:** *any*

___

###  toString

▸ **toString**(): *string*

*Inherited from void*

Returns a string representation of a function.

**Returns:** *string*