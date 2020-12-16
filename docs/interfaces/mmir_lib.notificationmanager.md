**[mmir-lib 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / NotificationManager

# Interface: NotificationManager

## Hierarchy

* **NotificationManager**

## Index

### Properties

* [alert](mmir_lib.notificationmanager.md#alert)
* [beep](mmir_lib.notificationmanager.md#beep)
* [confirm](mmir_lib.notificationmanager.md#confirm)
* [createSound](mmir_lib.notificationmanager.md#createsound)
* [getVolume](mmir_lib.notificationmanager.md#getvolume)
* [init](mmir_lib.notificationmanager.md#init)
* [initBeep](mmir_lib.notificationmanager.md#initbeep)
* [initSound](mmir_lib.notificationmanager.md#initsound)
* [isVibrateAvailable](mmir_lib.notificationmanager.md#isvibrateavailable)
* [isVibrateEnabled](mmir_lib.notificationmanager.md#isvibrateenabled)
* [playSound](mmir_lib.notificationmanager.md#playsound)
* [setVibrateEnabled](mmir_lib.notificationmanager.md#setvibrateenabled)
* [setVolume](mmir_lib.notificationmanager.md#setvolume)
* [stopSound](mmir_lib.notificationmanager.md#stopsound)
* [vibrate](mmir_lib.notificationmanager.md#vibrate)

## Properties

### alert

•  **alert**: (message: string, alertCallback: [Function](mmir_lib.requirejs.md#function), title: string, buttonName: string) => void

___

### beep

•  **beep**: (times: number) => void

___

### confirm

•  **confirm**: (message: string, confirmCallback: [Function](mmir_lib.requirejs.md#function), title: string, buttonLabels: string[]) => void

___

### createSound

•  **createSound**: (name: string, url: string, isKeepOnPause: boolean) => void

___

### getVolume

•  **getVolume**: () => number

___

### init

•  **init**: () => any

___

### initBeep

•  **initBeep**: () => void

___

### initSound

•  **initSound**: (name: string) => void

___

### isVibrateAvailable

•  **isVibrateAvailable**: () => boolean

___

### isVibrateEnabled

•  **isVibrateEnabled**: () => boolean

___

### playSound

•  **playSound**: (name: string, times: number, onFinished: [Function](mmir_lib.requirejs.md#function), onError: [Function](mmir_lib.requirejs.md#function)) => void

___

### setVibrateEnabled

•  **setVibrateEnabled**: (enabled: boolean) => void

___

### setVolume

•  **setVolume**: (vol: number) => void

___

### stopSound

•  **stopSound**: (name: string) => void

___

### vibrate

•  **vibrate**: (milliseconds: number) => void
