> **[mmir-lib 5.0.0](../README.md)**

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

*Defined in [mmir.d.ts:505](../../mmir.d.ts#L505)*

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

*Defined in [mmir.d.ts:509](../../mmir.d.ts#L509)*

#### Type declaration:

▸ (): *void*

___

###  enable

• **enable**: *function*

*Defined in [mmir.d.ts:508](../../mmir.d.ts#L508)*

#### Type declaration:

▸ (): *void*

___

###  getDuration

• **getDuration**: *function*

*Defined in [mmir.d.ts:512](../../mmir.d.ts#L512)*

#### Type declaration:

▸ (): *number*

___

###  isEnabled

• **isEnabled**: *function*

*Defined in [mmir.d.ts:514](../../mmir.d.ts#L514)*

#### Type declaration:

▸ (): *boolean*

___

###  isPaused

• **isPaused**: *function*

*Defined in [mmir.d.ts:513](../../mmir.d.ts#L513)*

#### Type declaration:

▸ (): *boolean*

___

###  play

• **play**: *function*

*Defined in [mmir.d.ts:506](../../mmir.d.ts#L506)*

#### Type declaration:

▸ (): *void*

___

###  release

• **release**: *function*

*Defined in [mmir.d.ts:510](../../mmir.d.ts#L510)*

#### Type declaration:

▸ (): *void*

___

###  setVolume

• **setVolume**: *function*

*Defined in [mmir.d.ts:511](../../mmir.d.ts#L511)*

#### Type declaration:

▸ (`volume`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`volume` | number |

___

###  stop

• **stop**: *function*

*Defined in [mmir.d.ts:507](../../mmir.d.ts#L507)*

#### Type declaration:

▸ (): *void*