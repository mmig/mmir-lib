> **[mmir-lib 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [NotificationManager](mmir_lib.notificationmanager.md) /

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

*Defined in [mmir.d.ts:534](../../mmir.d.ts#L534)*

#### Type declaration:

▸ (`message`: string, `alertCallback`: `Function`, `title`: string, `buttonName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`alertCallback` | `Function` |
`title` | string |
`buttonName` | string |

___

###  beep

• **beep**: *function*

*Defined in [mmir.d.ts:536](../../mmir.d.ts#L536)*

#### Type declaration:

▸ (`times`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`times` | number |

___

###  confirm

• **confirm**: *function*

*Defined in [mmir.d.ts:535](../../mmir.d.ts#L535)*

#### Type declaration:

▸ (`message`: string, `confirmCallback`: `Function`, `title`: string, `buttonLabels`: string[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |
`confirmCallback` | `Function` |
`title` | string |
`buttonLabels` | string[] |

___

###  createSound

• **createSound**: *function*

*Defined in [mmir.d.ts:537](../../mmir.d.ts#L537)*

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

*Defined in [mmir.d.ts:538](../../mmir.d.ts#L538)*

#### Type declaration:

▸ (): *number*

___

###  init

• **init**: *function*

*Defined in [mmir.d.ts:539](../../mmir.d.ts#L539)*

#### Type declaration:

▸ (): *any*

___

###  initBeep

• **initBeep**: *function*

*Defined in [mmir.d.ts:540](../../mmir.d.ts#L540)*

#### Type declaration:

▸ (): *void*

___

###  initSound

• **initSound**: *function*

*Defined in [mmir.d.ts:541](../../mmir.d.ts#L541)*

#### Type declaration:

▸ (`name`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  isVibrateAvailable

• **isVibrateAvailable**: *function*

*Defined in [mmir.d.ts:542](../../mmir.d.ts#L542)*

#### Type declaration:

▸ (): *boolean*

___

###  isVibrateEnabled

• **isVibrateEnabled**: *function*

*Defined in [mmir.d.ts:543](../../mmir.d.ts#L543)*

#### Type declaration:

▸ (): *boolean*

___

###  playSound

• **playSound**: *function*

*Defined in [mmir.d.ts:544](../../mmir.d.ts#L544)*

#### Type declaration:

▸ (`name`: string, `times`: number, `onFinished`: `Function`, `onError`: `Function`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`times` | number |
`onFinished` | `Function` |
`onError` | `Function` |

___

###  setVibrateEnabled

• **setVibrateEnabled**: *function*

*Defined in [mmir.d.ts:545](../../mmir.d.ts#L545)*

#### Type declaration:

▸ (`enabled`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`enabled` | boolean |

___

###  setVolume

• **setVolume**: *function*

*Defined in [mmir.d.ts:546](../../mmir.d.ts#L546)*

#### Type declaration:

▸ (`vol`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`vol` | number |

___

###  stopSound

• **stopSound**: *function*

*Defined in [mmir.d.ts:547](../../mmir.d.ts#L547)*

#### Type declaration:

▸ (`name`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  vibrate

• **vibrate**: *function*

*Defined in [mmir.d.ts:548](../../mmir.d.ts#L548)*

#### Type declaration:

▸ (`milliseconds`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`milliseconds` | number |