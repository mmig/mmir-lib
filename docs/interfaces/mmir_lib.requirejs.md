> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [RequireJs](mmir_lib.requirejs.md) /

# Interface: RequireJs

## Hierarchy

* `Function`

  * **RequireJs**

## Index

### Properties

* [Function](mmir_lib.requirejs.md#function)
* [arguments](mmir_lib.requirejs.md#arguments)
* [caller](mmir_lib.requirejs.md#caller)
* [config](mmir_lib.requirejs.md#config)
* [defined](mmir_lib.requirejs.md#defined)
* [isBrowser](mmir_lib.requirejs.md#isbrowser)
* [length](mmir_lib.requirejs.md#length)
* [prototype](mmir_lib.requirejs.md#prototype)
* [specified](mmir_lib.requirejs.md#specified)
* [toUrl](mmir_lib.requirejs.md#tourl)
* [undef](mmir_lib.requirejs.md#undef)

### Methods

* [apply](mmir_lib.requirejs.md#apply)
* [bind](mmir_lib.requirejs.md#bind)
* [call](mmir_lib.requirejs.md#call)
* [toString](mmir_lib.requirejs.md#tostring)

## Properties

###  Function

• **Function**: *`FunctionConstructor`*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:316](../../node_modules/typescript/lib/lib.es5.d.ts#L316)*

___

###  arguments

• **arguments**: *any*

*Inherited from void*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:302](../../node_modules/typescript/lib/lib.es5.d.ts#L302)*

___

###  caller

• **caller**: *`Function`*

*Inherited from void*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:303](../../node_modules/typescript/lib/lib.es5.d.ts#L303)*

___

###  config

• **config**: *function*

*Defined in [mmir.d.ts:582](../../mmir.d.ts#L582)*

#### Type declaration:

▸ (`configuration`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`configuration` | any |

___

###  defined

• **defined**: *function*

*Defined in [mmir.d.ts:578](../../mmir.d.ts#L578)*

#### Type declaration:

▸ (`id`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

___

###  isBrowser

• **isBrowser**: *boolean*

*Defined in [mmir.d.ts:577](../../mmir.d.ts#L577)*

___

###  length

• **length**: *number*

*Inherited from void*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:299](../../node_modules/typescript/lib/lib.es5.d.ts#L299)*

___

###  prototype

• **prototype**: *any*

*Inherited from void*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:298](../../node_modules/typescript/lib/lib.es5.d.ts#L298)*

___

###  specified

• **specified**: *function*

*Defined in [mmir.d.ts:579](../../mmir.d.ts#L579)*

#### Type declaration:

▸ (`id`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

___

###  toUrl

• **toUrl**: *function*

*Defined in [mmir.d.ts:580](../../mmir.d.ts#L580)*

#### Type declaration:

▸ (`moduleNamePlusExt`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`moduleNamePlusExt` | any |

___

###  undef

• **undef**: *function*

*Defined in [mmir.d.ts:581](../../mmir.d.ts#L581)*

#### Type declaration:

▸ (`id`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

## Methods

###  apply

▸ **apply**(`this`: `Function`, `thisArg`: any, `argArray?`: any): *any*

*Inherited from void*

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:278](../../node_modules/typescript/lib/lib.es5.d.ts#L278)*

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

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:293](../../node_modules/typescript/lib/lib.es5.d.ts#L293)*

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

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:285](../../node_modules/typescript/lib/lib.es5.d.ts#L285)*

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

*Defined in [node_modules/typescript/lib/lib.es5.d.ts:296](../../node_modules/typescript/lib/lib.es5.d.ts#L296)*

Returns a string representation of a function.

**Returns:** *string*