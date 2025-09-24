**[mmir-lib 7.1.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / LoggerModule

# Interface: LoggerModule

**`example`** 
var Logger = mmir.require('mmirf/logger');
var logger = Logger.create('MyClass');

## Hierarchy

* **LoggerModule**

## Index

### Methods

* [create](mmir_lib.loggermodule.md#create)
* [debug](mmir_lib.loggermodule.md#debug)
* [error](mmir_lib.loggermodule.md#error)
* [getDefaultLogLevel](mmir_lib.loggermodule.md#getdefaultloglevel)
* [info](mmir_lib.loggermodule.md#info)
* [log](mmir_lib.loggermodule.md#log)
* [logl](mmir_lib.loggermodule.md#logl)
* [setDefaultLogLevel](mmir_lib.loggermodule.md#setdefaultloglevel)
* [verbose](mmir_lib.loggermodule.md#verbose)
* [warn](mmir_lib.loggermodule.md#warn)

## Methods

### create

▸ **create**(`loggerName`: string, `logLevel?`: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)): [Logger](mmir_lib.logger.md)

#### Parameters:

Name | Type |
------ | ------ |
`loggerName` | string |
`logLevel?` | [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum) |

**Returns:** [Logger](mmir_lib.logger.md)

▸ **create**(`loggerConfig`: { id: string ; config: () => { logLevel: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)  }  }): [Logger](mmir_lib.logger.md)

#### Parameters:

Name | Type |
------ | ------ |
`loggerConfig` | { id: string ; config: () => { logLevel: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)  }  } |

**Returns:** [Logger](mmir_lib.logger.md)

▸ **create**(`loggerName`: string \| { id: string ; config: () => { logLevel: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)  }  }, `logLevel?`: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)): [Logger](mmir_lib.logger.md)

#### Parameters:

Name | Type |
------ | ------ |
`loggerName` | string \| { id: string ; config: () => { logLevel: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)  }  } |
`logLevel?` | [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum) |

**Returns:** [Logger](mmir_lib.logger.md)

___

### debug

▸ **debug**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **debug**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **debug**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

___

### error

▸ **error**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **error**(`msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

▸ **error**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **error**(`className`: string, `msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

▸ **error**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **error**(`className`: string, `funcName`: string, `msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

___

### getDefaultLogLevel

▸ **getDefaultLogLevel**(): [LogLevelNum](../modules/mmir_lib.md#loglevelnum)

**Returns:** [LogLevelNum](../modules/mmir_lib.md#loglevelnum)

___

### info

▸ **info**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **info**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **info**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

___

### log

▸ **log**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **log**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **log**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **log**(`className`: string, `msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

▸ **log**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **log**(`className`: string, `funcName`: string, `msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

___

### logl

▸ **logl**(`msg`: string, `error?`: any, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`error?` | any |
`reverseCallStack?` | number |

**Returns:** void

___

### setDefaultLogLevel

▸ **setDefaultLogLevel**(`loggingLevel`: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)): void

#### Parameters:

Name | Type |
------ | ------ |
`loggingLevel` | [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum) |

**Returns:** void

___

### verbose

▸ **verbose**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **verbose**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **verbose**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

___

### warn

▸ **warn**(`msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **warn**(`className`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void

▸ **warn**(`className`: string, `funcName`: string, `msg`: string, `reverseCallStack?`: number): void

#### Parameters:

Name | Type |
------ | ------ |
`className` | string |
`funcName` | string |
`msg` | string |
`reverseCallStack?` | number |

**Returns:** void
