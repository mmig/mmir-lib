**[mmir-lib 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / DialogManager4Compatibility

# Interface: DialogManager4Compatibility

## Hierarchy

* [DialogManager](mmir_lib.dialogmanager.md)

  ↳ **DialogManager4Compatibility**

## Index

### Properties

* [\_init](mmir_lib.dialogmanager4compatibility.md#_init)
* [\_log](mmir_lib.dialogmanager4compatibility.md#_log)
* [getOnPageRenderedHandler](mmir_lib.dialogmanager4compatibility.md#getonpagerenderedhandler)
* [hideCurrentDialog](mmir_lib.dialogmanager4compatibility.md#hidecurrentdialog)
* [hideWaitDialog](mmir_lib.dialogmanager4compatibility.md#hidewaitdialog)
* [perform](mmir_lib.dialogmanager4compatibility.md#perform)
* [performHelper](mmir_lib.dialogmanager4compatibility.md#performhelper)
* [raise](mmir_lib.dialogmanager4compatibility.md#raise)
* [render](mmir_lib.dialogmanager4compatibility.md#render)
* [setOnPageRenderedHandler](mmir_lib.dialogmanager4compatibility.md#setonpagerenderedhandler)
* [showDialog](mmir_lib.dialogmanager4compatibility.md#showdialog)
* [showWaitDialog](mmir_lib.dialogmanager4compatibility.md#showwaitdialog)

## Properties

### \_init

•  **\_init**: (moduleId: string, config: [StateManagerConfig](mmir_lib.statemanagerconfig.md), isRegisterEngine?: boolean) => Promise<{ engine: any ; manager: [StateManager](mmir_lib.statemanager.md)  }\>

*Inherited from [StateManager](mmir_lib.statemanager.md).[_init](mmir_lib.statemanager.md#_init)*

___

### \_log

•  **\_log**: [Logger](mmir_lib.logger.md)

*Inherited from [StateManager](mmir_lib.statemanager.md).[_log](mmir_lib.statemanager.md#_log)*

___

### getOnPageRenderedHandler

•  **getOnPageRenderedHandler**: () => [Function](mmir_lib.requirejs.md#function) \| undefined

___

### hideCurrentDialog

•  **hideCurrentDialog**: () => void

___

### hideWaitDialog

•  **hideWaitDialog**: () => void

___

### perform

•  **perform**: (ctrlName: any, actionName: any, data?: any) => any

___

### performHelper

•  **performHelper**: (ctrlName: any, helper\_method\_name: any, data?: any) => any

___

### raise

•  **raise**: (eventName: string, data?: any) => void

*Inherited from [StateManager](mmir_lib.statemanager.md).[raise](mmir_lib.statemanager.md#raise)*

___

### render

•  **render**: (ctrlName: any, viewName: any, data?: any) => void

___

### setOnPageRenderedHandler

•  **setOnPageRenderedHandler**: (onPageRenderedHook: [Function](mmir_lib.requirejs.md#function)) => void

___

### showDialog

•  **showDialog**: (ctrlName: any, dialogId: any, data?: any) => void

___

### showWaitDialog

•  **showWaitDialog**: (text: any, theme: any) => void
