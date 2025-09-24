**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / DisabledPluginInfo

# Interface: DisabledPluginInfo

MediaManager.loadPlugin: return value / info when loading media plugins in case they are not functional (e.g. for auto-created stub functions that invoke appropriate error-callback)

## Hierarchy

* **DisabledPluginInfo**

## Index

### Properties

* [disabled](mmir_lib.disabledplugininfo.md#disabled)
* [errorCallbackName](mmir_lib.disabledplugininfo.md#errorcallbackname)
* [message](mmir_lib.disabledplugininfo.md#message)
* [mod](mmir_lib.disabledplugininfo.md#mod)

## Properties

### disabled

• `Optional` **disabled**: string[] \| { [field:string]: any;  }

if list of (disabled/non-functional) function names:
stub functions will be created (which try to invoke an error-callback from the arguments or log an error)

if dictionary of functions:
function implementations will be used as plugin implementation

___

### errorCallbackName

• `Optional` **errorCallbackName**: string

option-name for error-callbacks when supplied via options-argument
(used created stub-functions, see `disabled`)

**`default`** "error"

___

### message

• `Optional` **message**: string

a message to append to the error message for created stub-functions (see `disabled`)

___

### mod

•  **mod**: string

name / ID of the (media) plugin
