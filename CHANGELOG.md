# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.4](https://github.com/nativescript-community/perms/compare/v3.0.3...v3.0.4) (2025-03-27)

### Bug Fixes

* add missing case statement for limited contact access ([53c46e4](https://github.com/nativescript-community/perms/commit/53c46e40db089cb41f1f5f09dec90ac5cabb56e8)), closes [#33](https://github.com/nativescript-community/perms/issues/33)

## [3.0.3](https://github.com/nativescript-community/perms/compare/v3.0.2...v3.0.3) (2025-01-27)

### Bug Fixes

* another typings fix ([0883a67](https://github.com/nativescript-community/perms/commit/0883a6742f6920647c3cd57c097ac542745e0ea1))

## [3.0.2](https://github.com/nativescript-community/perms/compare/v3.0.1...v3.0.2) (2025-01-23)

### Bug Fixes

* typings fix ([e081bd1](https://github.com/nativescript-community/perms/commit/e081bd17aec50e4793b6dbbd1218e510242019a0))

## [3.0.1](https://github.com/nativescript-community/perms/compare/v3.0.0...v3.0.1) (2025-01-17)

### Bug Fixes

* `isPermResultAuthorized` fix ([33a02cd](https://github.com/nativescript-community/perms/commit/33a02cd4f67c96e65ff3b78d1a6eb0da82856a1c))

## [3.0.0](https://github.com/nativescript-community/perms/compare/v2.3.6...v3.0.0) (2025-01-17)

### ⚠ BREAKING CHANGES

* check/request will now return a `Status` result instead of of an array

### Bug Fixes

* check/request will now return a `Status` result instead of of an array ([e3651e5](https://github.com/nativescript-community/perms/commit/e3651e579a0ba38b7b0bac5f4665ef2d62d982e7))

## [2.3.6](https://github.com/nativescript-community/perms/compare/v2.3.5...v2.3.6) (2024-11-27)

### Reverts

* Revert "fix!: check/request will now return a `Status` result instead of of an array" ([48fc65e](https://github.com/nativescript-community/perms/commit/48fc65e4fec9d0ee714756de1c5b2b16608208ce))

## [2.3.5](https://github.com/nativescript-community/perms/compare/v2.3.4...v2.3.5) (2024-11-18)

### ⚠ BREAKING CHANGES

* check/request will now return a `Status` result instead of of an array

### Features

* `openNotificationSettings` ([1f315e6](https://github.com/nativescript-community/perms/commit/1f315e63c3068f804630526f3249012fdda5d44c))

### Bug Fixes

* check/request will now return a `Status` result instead of of an array ([c4da3f1](https://github.com/nativescript-community/perms/commit/c4da3f1df958cc89d41c51f6502ae634b4e6790c))
* **ios:** openSettings not working in iOS 18 ([9d5cf40](https://github.com/nativescript-community/perms/commit/9d5cf40d54ea67822d93139fd9e9cad206a6f3eb))

## [2.3.4](https://github.com/nativescript-community/perms/compare/v2.3.3...v2.3.4) (2024-10-23)

### Bug Fixes

* **ios:** prevent error in `openSettings` ([f6536f2](https://github.com/nativescript-community/perms/commit/f6536f28f458b37ec5eaab02ef06d0f0d032f9ad))

## [2.3.3](https://github.com/nativescript-community/perms/compare/v2.3.2...v2.3.3) (2024-04-09)

### Features

* `isPermResultAuthorized` method ([18b53c4](https://github.com/nativescript-community/perms/commit/18b53c44ca86e3a5f20b2fbd09f952be8564e127))

## [2.3.2](https://github.com/nativescript-community/perms/compare/v2.3.1...v2.3.2) (2024-03-08)

### Bug Fixes

* **ios:** location request would not resolve ([2fe1edd](https://github.com/nativescript-community/perms/commit/2fe1eddb9f31dfb088a3c74a75b8288116eebf0b))

## [2.3.1](https://github.com/nativescript-community/perms/compare/v2.3.0...v2.3.1) (2024-01-11)

### Bug Fixes

* **ios:** more `notification` options ([13266ab](https://github.com/nativescript-community/perms/commit/13266ab6251d4788f746de9fb012d3c9167430b8))
* **ios:** Support Limited as a status for photo permissions ([57a07ec](https://github.com/nativescript-community/perms/commit/57a07ec37381ff92be8bd67ef015d54e104c58ac))

# [2.3.0](https://github.com/nativescript-community/perms/compare/v2.2.25...v2.3.0) (2023-03-02)

### Bug Fixes

* **android:** removed unwanted log ([c6e154e](https://github.com/nativescript-community/perms/commit/c6e154e081706b837db943ed2cc83ad21259f364))

### Features

* **android:** add granular permissions for accessing photo, video, and audio ([747f6c8](https://github.com/nativescript-community/perms/commit/747f6c85e9b94eb9cf29a144f85f35fa8ea24195))

## [2.2.25](https://github.com/nativescript-community/perms/compare/v2.2.24...v2.2.25) (2023-01-23)

### Bug Fixes

* improved native-api-usage ([107750d](https://github.com/nativescript-community/perms/commit/107750df8f3f991bbc665ea8d782f90e41762ca1))

## [2.2.24](https://github.com/nativescript-community/perms/compare/v2.2.23...v2.2.24) (2023-01-19)

### Bug Fixes

* **ios:** check for multiple permissions fix ([fd3c774](https://github.com/nativescript-community/perms/commit/fd3c774cff46ff788b9bc36059097f95c2765627))

## [2.2.23](https://github.com/nativescript-community/perms/compare/v2.2.22...v2.2.23) (2023-01-17)

### Bug Fixes

* **ios:** correctly handle check/request for location with always type ([a2bc977](https://github.com/nativescript-community/perms/commit/a2bc9773a77b32948b3f11e95ef2cb19f0642beb))

## [2.2.22](https://github.com/nativescript-community/perms/compare/v2.2.21...v2.2.22) (2023-01-16)

### Bug Fixes

* `checkMultiple` fix ([db18227](https://github.com/nativescript-community/perms/commit/db1822759015b3a4992b875618b61075989ffebc))

## [2.2.21](https://github.com/nativescript-community/perms/compare/v2.2.20...v2.2.21) (2022-12-09)

### Bug Fixes

* **android:** cleanup logs ([8534636](https://github.com/nativescript-community/perms/commit/853463662ae7f95cac3ade34b997d75d91be6752))

## [2.2.20](https://github.com/nativescript-community/perms/compare/v2.2.19...v2.2.20) (2022-11-29)

### Bug Fixes

* rollback the issue was in the app ([a9c636c](https://github.com/nativescript-community/perms/commit/a9c636c1985a06da50ea00bfef3d643d59351770))

## [2.2.19](https://github.com/nativescript-community/perms/compare/v2.2.18...v2.2.19) (2022-11-29)

### Bug Fixes

* **android:** notifications permission on android 13 ([a66e627](https://github.com/nativescript-community/perms/commit/a66e627a2df3c61feef99a360b09fb725926c676))

## [2.2.18](https://github.com/nativescript-community/perms/compare/v2.2.17...v2.2.18) (2022-11-29)

### Bug Fixes

* **ios:** anoher motion fix … ([b8a8c1c](https://github.com/nativescript-community/perms/commit/b8a8c1ca673e3530718e67882557dfc5f68f2327))

## [2.2.17](https://github.com/nativescript-community/perms/compare/v2.2.16...v2.2.17) (2022-11-29)

### Bug Fixes

* **ios:** motion permission fix ([714ca67](https://github.com/nativescript-community/perms/commit/714ca67816970cc1dc79a03a8945e5304310378f))

## [2.2.16](https://github.com/nativescript-community/perms/compare/v2.2.15...v2.2.16) (2022-11-29)

### Bug Fixes

* another build fix … ([747ab85](https://github.com/nativescript-community/perms/commit/747ab85b88f17c892ab1556d5085e111504161d1))

## [2.2.15](https://github.com/nativescript-community/perms/compare/v2.2.14...v2.2.15) (2022-11-29)

### Bug Fixes

* build fix ([9b39b11](https://github.com/nativescript-community/perms/commit/9b39b1181e76f313864d94de06b11dfd4a8b18e4))

## [2.2.14](https://github.com/nativescript-community/perms/compare/v2.2.13...v2.2.14) (2022-11-25)

**Note:** Version bump only for package @nativescript-community/perms

## [2.2.13](https://github.com/nativescript-community/perms/compare/v2.2.12...v2.2.13) (2022-09-27)

### Features

* **android:** added notification(android13) and support for passing native permissions directly ([00fb89e](https://github.com/nativescript-community/perms/commit/00fb89e0d506c80924393252be033f9e7470d34c))

## [2.2.12](https://github.com/nativescript-community/perms/compare/v2.2.11...v2.2.12) (2022-08-15)

**Note:** Version bump only for package @nativescript-community/perms

## [2.2.11](https://github.com/nativescript-community/perms/compare/v2.2.9...v2.2.11) (2022-07-11)

### Bug Fixes

* **ios:** notifications ui thread handling ([1b5abba](https://github.com/nativescript-community/perms/commit/1b5abbaf012192c3b66296ebaa3fd452a60e67cd))

## [2.2.10](https://github.com/nativescript-community/perms/compare/v2.2.9...v2.2.10) (2022-07-11)

### Bug Fixes

* **ios:** notifications ui thread handling ([1b5abba](https://github.com/nativescript-community/perms/commit/1b5abbaf012192c3b66296ebaa3fd452a60e67cd))

## [2.2.9](https://github.com/nativescript-community/perms/compare/v2.2.8...v2.2.9) (2022-07-01)

### Bug Fixes

* **ios:** perms fix ([46c2a70](https://github.com/nativescript-community/perms/commit/46c2a70212a9dc6e2e5b48bef47132a1d7463ee3))

## [2.2.8](https://github.com/nativescript-community/perms/compare/v2.2.7...v2.2.8) (2022-06-30)

### Bug Fixes

* **ios:** notification perm status fix ([0a082c6](https://github.com/nativescript-community/perms/commit/0a082c616543e9419a87cd1a91f48b5c6ee3a0a7))

## [2.2.7](https://github.com/nativescript-community/perms/compare/v2.2.6...v2.2.7) (2022-03-08)

### Bug Fixes

* android location precise option ([3bdf6b8](https://github.com/nativescript-community/perms/commit/3bdf6b8489c78aaa8e9281ee5af1a4cd4415b74f))

## [2.2.6](https://github.com/nativescript-community/perms/compare/v2.2.5...v2.2.6) (2022-03-08)

### Bug Fixes

* allow to disable read/write for storage or coarse for location ([461d499](https://github.com/nativescript-community/perms/commit/461d4998c4236088f962c1b45acfcc5cf7683fc4))

## [2.2.5](https://github.com/nativescript-community/perms/compare/v2.2.4...v2.2.5) (2022-02-18)

### Features

* support requesting multiple perms on both platforms ([a0bf946](https://github.com/nativescript-community/perms/commit/a0bf946c9621fe83a63f4b0a9f924b40898d8e56))

## [2.2.4](https://github.com/nativescript-community/perms/compare/v2.2.3...v2.2.4) (2022-02-17)

### Bug Fixes

* **android:** fix for non know perms ([08326d5](https://github.com/nativescript-community/perms/commit/08326d5c3f49446cf0c51b17001fe4e36ca663f0))

## [2.2.3](https://github.com/nativescript-community/perms/compare/v2.2.2...v2.2.3) (2022-02-17)

### Features

* **android:** allow to pass android permission(s) directly ([1554882](https://github.com/nativescript-community/perms/commit/155488273f84de4354f5920907025c3c271703cb))
* **android:** android 12 support: bluetooth(adv), bluetoothScan, bluetoothConnect, mediaLocation ([08245c1](https://github.com/nativescript-community/perms/commit/08245c1b20631d72c4eefee34d88665ea21a4d8f))

## [2.2.2](https://github.com/nativescript-community/perms/compare/v2.2.1...v2.2.2) (2022-01-10)

### Bug Fixes

* **android:** working `openSettings` ([ccafa5c](https://github.com/nativescript-community/perms/commit/ccafa5cf627bb147a341292d441a6d6f29c4f5bf))

## [2.2.1](https://github.com/nativescript-community/perms/compare/v2.2.0...v2.2.1) (2022-01-10)

### Bug Fixes

* **androi:** allow to open app settings ([6b3dd9b](https://github.com/nativescript-community/perms/commit/6b3dd9b0c8a0e1bfcf8d059c4d91a65a25b784ec))

# [2.2.0](https://github.com/nativescript-community/perms/compare/v2.1.8...v2.2.0) (2021-10-21)

### Bug Fixes

* **ios:** handle new way of registering for notifcations on iOS >= 10 ([f66ed95](https://github.com/nativescript-community/perms/commit/f66ed956441a396b7dcfe9ceed105d05ac5d9967))

### Features

* **android:** native-api-usage ([8ff8972](https://github.com/nativescript-community/perms/commit/8ff897237dc5715d34aefd66a38da895ddf77965))
* **ios:** add ios12 notification providesAppNotificationSettings ([551b225](https://github.com/nativescript-community/perms/commit/551b225d93cb63578301b11ec19635eae33bcb30))

## [2.1.8](https://github.com/nativescript-community/perms/compare/v2.1.7...v2.1.8) (2021-08-09)

**Note:** Version bump only for package @nativescript-community/perms

## [2.1.7](https://github.com/nativescript-community/perms/compare/v2.1.6...v2.1.7) (2021-08-09)

### Features

* **ios:** add ios14 limited photo access permission status ([83c0637](https://github.com/nativescript-community/perms/commit/83c063732342f0437e84c904ec026a5b9e87939d))

## [2.1.6](https://github.com/nativescript-community/perms/compare/v2.1.5...v2.1.6) (2021-04-27)

### Bug Fixes

* **android:** shouldShowRequestPermissionRationale fix for location ([a402474](https://github.com/nativescript-community/perms/commit/a402474))

## [2.1.5](https://github.com/nativescript-community/perms/compare/v2.1.4...v2.1.5) (2021-01-13)

### Bug Fixes

* **android:** reject permission request on “cancel” ([2f7661f](https://github.com/nativescript-community/perms/commit/2f7661f))

## [2.1.4](https://github.com/nativescript-community/perms/compare/v2.1.3...v2.1.4) (2020-11-23)

**Note:** Version bump only for package @nativescript-community/perms

## [2.1.3](https://github.com/nativescript-community/perms/compare/v2.1.2...v2.1.3) (2020-11-22)

**Note:** Version bump only for package @nativescript-community/perms

## [2.1.2](https://github.com/nativescript-community/perms/compare/v2.1.1...v2.1.2) (2020-11-17)

### Bug Fixes

* android always type support for location ([4f1f521](https://github.com/nativescript-community/perms/commit/4f1f521))

## [2.1.1](https://github.com/nativescript-community/perms/compare/v2.1.0...v2.1.1) (2020-09-17)

### Bug Fixes

* **ios:** native class extend ([b06738b](https://github.com/nativescript-community/perms/commit/b06738b))

# [2.1.0](https://github.com/nativescript-community/perms/compare/v2.0.11...v2.1.0) (2020-09-06)

### Features

* n7 and new plugin name ([ecb83dc](https://github.com/nativescript-community/perms/commit/ecb83dc))

## [2.0.11](https://github.com/nativescript-community/perms/compare/v2.0.10...v2.0.11) (2020-05-29)

**Note:** Version bump only for package @nativescript-community/perms

## [2.0.10](https://github.com/nativescript-community/perms/compare/v2.0.9...v2.0.10) (2020-05-21)

**Note:** Version bump only for package @nativescript-community/perms

## [2.0.9](https://github.com/nativescript-community/perms/compare/v2.0.8...v2.0.9) (2020-05-21)

### Bug Fixes

* sideEffects for tree shacking ([fb5ba26](https://github.com/nativescript-community/perms/commit/fb5ba26))

## [2.0.8](https://github.com/nativescript-community/perms/compare/v2.0.7...v2.0.8) (2020-05-21)

### Bug Fixes

* esm using import for tree shaking ([c0c1e7b](https://github.com/nativescript-community/perms/commit/c0c1e7b))

## [2.0.7](https://github.com/nativescript-community/perms/compare/v2.0.6...v2.0.7) (2020-05-21)

**Note:** Version bump only for package @nativescript-community/perms

## [2.0.6](https://github.com/nativescript-community/perms/compare/v2.0.5...v2.0.6) (2020-04-05)

### Bug Fixes

* **ios:** improving fix ([5903b46](https://github.com/nativescript-community/perms/commit/5903b46))
* **ios:** trying to fix a crash with location permissions ([e6eb678](https://github.com/nativescript-community/perms/commit/e6eb678))

## [2.0.5](https://github.com/nativescript-community/perms/compare/v2.0.4...v2.0.5) (2020-03-30)

### Bug Fixes

* removed logs ([2579d49](https://github.com/nativescript-community/perms/commit/2579d49))

## [2.0.4](https://github.com/nativescript-community/perms/compare/v2.0.3...v2.0.4) (2020-03-24)

### Bug Fixes

* **ios:** video permission fix ([9aa933f](https://github.com/nativescript-community/perms/commit/9aa933f))

## [2.0.3](https://github.com/nativescript-community/perms/compare/v2.0.2...v2.0.3) (2020-01-29)

### Bug Fixes

* **android:** return authorized like iOS ([67a0015](https://github.com/nativescript-community/perms/commit/67a0015))

## [2.0.2](https://github.com/nativescript-community/perms/compare/v2.0.1...v2.0.2) (2019-12-17)

### Bug Fixes

* some ios status fixes ([5b9c7ef](https://github.com/nativescript-community/perms/commit/5b9c7ef))

## [2.0.1](https://github.com/nativescript-community/perms/compare/v2.0.0...v2.0.1) (2019-12-16)

**Note:** Version bump only for package @nativescript-community/perms

# [2.0.0](https://github.com/nativescript-community/perms/compare/v1.0.10...v2.0.0) (2019-12-16)

### Bug Fixes

* return always status ([3ebfd5c](https://github.com/nativescript-community/perms/commit/3ebfd5c))

### BREAKING CHANGES

* return always in promises

## [1.0.10](https://github.com/nativescript-community/perms/compare/v1.0.9...v1.0.10) (2019-10-22)

### Bug Fixes

* include maps in npm ([30154cd](https://github.com/nativescript-community/perms/commit/30154cd))

## [1.0.9](https://github.com/nativescript-community/perms/compare/v1.0.8...v1.0.9) (2019-09-17)

### Bug Fixes

* logs only in debug ([c0987cd](https://github.com/nativescript-community/perms/commit/c0987cd))

## [1.0.8](https://github.com/nativescript-community/perms/compare/v1.0.7...v1.0.8) (2019-08-15)

### Bug Fixes

* fixed motion permission ([10a3ede](https://github.com/nativescript-community/perms/commit/10a3ede))

## [1.0.7](https://github.com/nativescript-community/perms/compare/v1.0.6...v1.0.7) (2019-05-17)

### Bug Fixes

* better logs ([4610cfa](https://github.com/nativescript-community/perms/commit/4610cfa))
* keep a reference to the listener as long as we use it ([c85e4f9](https://github.com/nativescript-community/perms/commit/c85e4f9))

## [1.0.6](https://github.com/nativescript-community/perms/compare/v1.0.5...v1.0.6) (2019-05-16)

### Bug Fixes

* trying to fix crash on iOS. Not fully understood though ([6aec74b](https://github.com/nativescript-community/perms/commit/6aec74b))

## 1.0.5 (2019-05-04)

### Bug Fixes

* unhandled permissions should resolve not the break app ([14f760a](https://github.com/nativescript-community/perms/commit/14f760a))
