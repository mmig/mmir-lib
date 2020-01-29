[mmir-lib 6.0.0](../README.md) › [mmir-lib](../modules/mmir_lib.md) › [NotificationManager](mmir_lib.notificationmanager.md)

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

###  alert

• **alert**: *function*

#### Type declaration:

▸ (`message`: string, `alertCallback`: [Function](mmir_lib.requirejs.md#function), `title`: string, `buttonName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`alertCallback` | [Function](mmir_lib.requirejs.md#function) |
`title` | string |
`buttonName` | string |

___

###  beep

• **beep**: *function*

#### Type declaration:

▸ (`times`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`times` | number |

___

###  confirm

• **confirm**: *function*

#### Type declaration:

▸ (`message`: string, `confirmCallback`: [Function](mmir_lib.requirejs.md#function), `title`: string, `buttonLabels`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`confirmCallback` | [Function](mmir_lib.requirejs.md#function) |
`title` | string |
`buttonLabels` | string[] |

___

###  createSound

• **createSound**: *function*

#### Type declaration:

▸ (`name`: string, `url`: string, `isKeepOnPause`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`url` | string |
`isKeepOnPause` | boolean |

___

###  getVolume

• **getVolume**: *function*

#### Type declaration:

▸ (): *number*

___

###  init

• **init**: *function*

#### Type declaration:

▸ (): *any*

___

###  initBeep

• **initBeep**: *function*

#### Type declaration:

▸ (): *void*

___

###  initSound

• **initSound**: *function*

#### Type declaration:

▸ (`name`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  isVibrateAvailable

• **isVibrateAvailable**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  isVibrateEnabled

• **isVibrateEnabled**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  playSound

• **playSound**: *function*

#### Type declaration:

▸ (`name`: string, `times`: number, `onFinished`: [Function](mmir_lib.requirejs.md#function), `onError`: [Function](mmir_lib.requirejs.md#function)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`times` | number |
`onFinished` | [Function](mmir_lib.requirejs.md#function) |
`onError` | [Function](mmir_lib.requirejs.md#function) |

___

###  setVibrateEnabled

• **setVibrateEnabled**: *function*

#### Type declaration:

▸ (`enabled`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`enabled` | boolean |

___

###  setVolume

• **setVolume**: *function*

#### Type declaration:

▸ (`vol`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`vol` | number |

___

###  stopSound

• **stopSound**: *function*

#### Type declaration:

▸ (`name`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  vibrate

• **vibrate**: *function*

#### Type declaration:

▸ (`milliseconds`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`milliseconds` | number |
