**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / LoggerModuleConfig

# Interface: LoggerModuleConfig

Module configuration for the [LoggerModule](mmir_lib.loggermodule.md)

**`example`** 

var loggerModuleConfig = {
	level: 'info',
	levels: {
		warn: ['mmirf/mediaManager', 'mmirf/inputEngine']
	},
	modules: {
		'mmirf/dialogEngine': 'critical'
	}
};
// set to global `mmir` before initialing `mmir`:
mmir.logLevel = loggerModuleConfig;

// or use as mmir application configuration with mmir-tooling configuration:
var mmirAppConfig = {
	config: {
		'mmirf/logger': {
			logLevel: loggerModuleConfig
		}
	}
};
//...
require('mmir-webpack')(webpack, webpackConfig, mmirAppConfig);

## Hierarchy

* **LoggerModuleConfig**

## Index

### Properties

* [level](mmir_lib.loggermoduleconfig.md#level)
* [levels](mmir_lib.loggermoduleconfig.md#levels)
* [modules](mmir_lib.loggermoduleconfig.md#modules)

## Properties

### level

• `Optional` **level**: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum)

OPTIONAL the default log level as integer or string, DEFAULT: "debug"

___

### levels

• `Optional` **levels**: { [logLevel:string]: string[];  }

OPTIONAL list of modules for per log level (unspecified modules will have default log level)

___

### modules

• `Optional` **modules**: { [moduleId:string]: [LogLevel](../modules/mmir_lib.md#loglevel) \| [LogLevelNum](../modules/mmir_lib.md#loglevelnum);  }

OPTIONAL log level per module (unspecified modules will have default log level)
