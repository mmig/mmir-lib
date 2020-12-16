**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / StateManager

# Interface: StateManager

## Hierarchy

* **StateManager**

  ↳ [DialogManager](mmir_lib.dialogmanager.md)

  ↳ [InputManager](mmir_lib.inputmanager.md)

## Index

### Properties

* [\_init](mmir_lib.statemanager.md#_init)
* [\_log](mmir_lib.statemanager.md#_log)
* [raise](mmir_lib.statemanager.md#raise)

## Properties

### \_init

•  **\_init**: (moduleId: string, config: [StateManagerConfig](mmir_lib.statemanagerconfig.md), isRegisterEngine?: boolean) => Promise<{ engine: any ; manager: [StateManager](mmir_lib.statemanager.md)  }\>

___

### \_log

•  **\_log**: [Logger](mmir_lib.logger.md)

___

### raise

•  **raise**: (eventName: string, data?: any) => void
