**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / PresentationManager

# Interface: PresentationManager

## Hierarchy

* **PresentationManager**

## Index

### Properties

* [\_fireRenderEvent](mmir_lib.presentationmanager.md#_firerenderevent)
* [addLayout](mmir_lib.presentationmanager.md#addlayout)
* [addPartial](mmir_lib.presentationmanager.md#addpartial)
* [addView](mmir_lib.presentationmanager.md#addview)
* [callRenderEngine](mmir_lib.presentationmanager.md#callrenderengine)
* [getLayout](mmir_lib.presentationmanager.md#getlayout)
* [getPartial](mmir_lib.presentationmanager.md#getpartial)
* [getView](mmir_lib.presentationmanager.md#getview)
* [hideCurrentDialog](mmir_lib.presentationmanager.md#hidecurrentdialog)
* [hideWaitDialog](mmir_lib.presentationmanager.md#hidewaitdialog)
* [on\_before\_page\_load](mmir_lib.presentationmanager.md#on_before_page_load)
* [on\_before\_page\_prepare](mmir_lib.presentationmanager.md#on_before_page_prepare)
* [on\_page\_load](mmir_lib.presentationmanager.md#on_page_load)
* [pageIndex](mmir_lib.presentationmanager.md#pageindex)
* [render](mmir_lib.presentationmanager.md#render)
* [setRenderEngine](mmir_lib.presentationmanager.md#setrenderengine)
* [showDialog](mmir_lib.presentationmanager.md#showdialog)
* [showWaitDialog](mmir_lib.presentationmanager.md#showwaitdialog)

## Properties

### \_fireRenderEvent

•  **\_fireRenderEvent**: (ctrl: [Controller](../classes/mmir_lib.controller.md), eventName: \"before\_page\_prepare\" \| \"before\_page\_load\" \| \"on\_page\_load\" \| string, eventData: any, pageOptions: any) => any \| false

NOTE view-dependent events are named: "<event name>_<view name>"

___

### addLayout

•  **addLayout**: (layout: [Layout](../classes/mmir_lib.layout.md)) => void

___

### addPartial

•  **addPartial**: (ctrlName: string, partial: [Partial](../classes/mmir_lib.partial.md)) => void

___

### addView

•  **addView**: (ctrlName: string, view: [View](../classes/mmir_lib.view.md)) => void

___

### callRenderEngine

•  **callRenderEngine**: (funcName: string, args: any[]) => any

___

### getLayout

•  **getLayout**: (layoutName: string, doUseDefaultIfMissing: boolean) => any

___

### getPartial

•  **getPartial**: (controllerName: string, partialName: string) => any

___

### getView

•  **getView**: (controllerName: string, viewName: string) => any

___

### hideCurrentDialog

•  **hideCurrentDialog**: (...args: any[]) => void

___

### hideWaitDialog

•  **hideWaitDialog**: (...args: any[]) => void

___

### on\_before\_page\_load

• `Optional` **on\_before\_page\_load**: (ctrlName: string, eventName: \"before\_page\_load\", eventData: any, pageOptions: any) => any \| false

NOTE view-dependent event handler can be set via: on_before_page_load_<view name>

___

### on\_before\_page\_prepare

• `Optional` **on\_before\_page\_prepare**: (ctrlName: string, eventName: \"before\_page\_prepare\", eventData: any, pageOptions: any) => any \| false

NOTE view-dependent event handler can be set via: on_before_page_prepare_<view name>

___

### on\_page\_load

• `Optional` **on\_page\_load**: (ctrlName: string, eventName: \"on\_page\_load\", eventData: any, pageOptions: any) => any \| false

NOTE view-dependent event handler can be set via: on_page_load_<view name>

___

### pageIndex

•  **pageIndex**: number

___

### render

•  **render**: (ctrlName: string, viewName: string, data?: any) => void

___

### setRenderEngine

•  **setRenderEngine**: (theRenderEngine: [RenderEngine](mmir_lib.renderengine.md)) => void

___

### showDialog

•  **showDialog**: (ctrlName: string, dialogId: string, data?: any, ...args: any[]) => any

___

### showWaitDialog

•  **showWaitDialog**: (text: string, data: any, ...args: any[]) => void
