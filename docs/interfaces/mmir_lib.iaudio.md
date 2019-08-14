> **[mmir-lib 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-lib](../modules/mmir_lib.md) / [IAudio](mmir_lib.iaudio.md) /

# Interface: IAudio

## Hierarchy

* **IAudio**

## Index

### Properties

* [_constructor](mmir_lib.iaudio.md#_constructor)
* [disable](mmir_lib.iaudio.md#disable)
* [enable](mmir_lib.iaudio.md#enable)
* [getDuration](mmir_lib.iaudio.md#getduration)
* [isEnabled](mmir_lib.iaudio.md#isenabled)
* [isPaused](mmir_lib.iaudio.md#ispaused)
* [play](mmir_lib.iaudio.md#play)
* [release](mmir_lib.iaudio.md#release)
* [setVolume](mmir_lib.iaudio.md#setvolume)
* [stop](mmir_lib.iaudio.md#stop)

## Properties

###  _constructor

• **_constructor**: *function*

#### Type declaration:

▸ (`url`: string, `onPlayedCallback`: [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete), `failureCallBack`: [TTSOnError](../modules/mmir_lib.md#ttsonerror), `onLoadedCallBack`: [TTSOnReady](../modules/mmir_lib.md#ttsonready)): *[IAudio](mmir_lib.iaudio.md)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`onPlayedCallback` | [TTSOnComplete](../modules/mmir_lib.md#ttsoncomplete) |
`failureCallBack` | [TTSOnError](../modules/mmir_lib.md#ttsonerror) |
`onLoadedCallBack` | [TTSOnReady](../modules/mmir_lib.md#ttsonready) |

___

###  disable

• **disable**: *function*

#### Type declaration:

▸ (): *void*

___

###  enable

• **enable**: *function*

#### Type declaration:

▸ (): *void*

___

###  getDuration

• **getDuration**: *function*

#### Type declaration:

▸ (): *number*

___

###  isEnabled

• **isEnabled**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  isPaused

• **isPaused**: *function*

#### Type declaration:

▸ (): *boolean*

___

###  play

• **play**: *function*

#### Type declaration:

▸ (): *void*

___

###  release

• **release**: *function*

#### Type declaration:

▸ (): *void*

___

###  setVolume

• **setVolume**: *function*

#### Type declaration:

▸ (`volume`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`volume` | number |

___

###  stop

• **stop**: *function*

#### Type declaration:

▸ (): *void*