# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.50.0](https://github.com/kelvininc/ui-components/compare/v0.49.0...v0.50.0) (2025-10-02)


### Bug Fixes

* ensure every schema property is normalized ([26f4b03](https://github.com/kelvininc/ui-components/commit/26f4b03a28f2ed613495d40dec85044b684a94c7))
* **schema-form:** normalize `oneOf` schemas to avoid exceeding maximum call stack size ([27ba186](https://github.com/kelvininc/ui-components/commit/27ba186393fe87b5a13372611717d386cbe4f553))
* **storybook:** update react-ui-components linking to use client entry ([bbf77d5](https://github.com/kelvininc/ui-components/commit/bbf77d5cb9d9aa1e6c5e29fef0c5564ef0b92a2e))


### Features

* **checkbox:** add label prop ([3fb2b06](https://github.com/kelvininc/ui-components/commit/3fb2b06cd6dcdc67bf50afa9c251a2baef1d4e18))
* **description-list:** enable component to be more customizable ([80a4742](https://github.com/kelvininc/ui-components/commit/80a47429195c18a2c67b7b4ad3ac2c3de49482a5))
* **modal:** emit event on press 'escape' key ([da7af6b](https://github.com/kelvininc/ui-components/commit/da7af6bb3e613d100dcfe8e0a2b9a4438349ea56))
* **toggle-button:** adds support to display tooltip text [KFE-2416] ([aa61ea2](https://github.com/kelvininc/ui-components/commit/aa61ea2cabb449983d94a8ad0c9bcb219a1414d6))





# [0.49.0](https://github.com/kelvininc/ui-components/compare/v0.48.0...v0.49.0) (2025-08-06)

**Note:** Version bump only for package @kelvininc/react-storybook





# [0.48.0](https://github.com/kelvininc/ui-components/compare/v0.47.1...v0.48.0) (2025-07-08)


### Features

* **select-option:** adds a tooltip into icon and export icon part to be stylized outside ([2a9c307](https://github.com/kelvininc/ui-components/commit/2a9c307eb56512ebb24fdddb55e17cd540f56e4f))





## [0.47.1](https://github.com/kelvininc/ui-components/compare/v0.47.0...v0.47.1) (2025-06-05)

**Note:** Version bump only for package @kelvininc/react-storybook





# [0.47.0](https://github.com/kelvininc/ui-components/compare/v0.46.0...v0.47.0) (2025-06-05)


### Bug Fixes

* **kv-toggle-switch:** adds active disabled state ([cf0635e](https://github.com/kelvininc/ui-components/commit/cf0635ebc6e6f3c31ac523715c80e2e82ead961c))


* refactor(icon)!: remove legacy icons ([096eabc](https://github.com/kelvininc/ui-components/commit/096eabc08b305f73dfd64d212a8a3c1292aeccb0))


### BREAKING CHANGES

* - All `EOtherIconName` icons were removed except the following that were
  migrated to `EIconName`:
    - `icon-checkmark` is now `kv-checkmark`
    - `icon-indertimate-state` is now `kv-indeterminate-state`
    - `icon-check-state` is now `kv-check-state`
    - `icon-uncheck-state` is now `kv-uncheck-state`





# [0.46.0](https://github.com/kelvininc/ui-components/compare/v0.45.0...v0.46.0) (2025-05-02)


### Bug Fixes

* **ci:** change storybook builder tool to webpack ([4b93d3d](https://github.com/kelvininc/ui-components/commit/4b93d3dafd1027289fa09ac6b1bebf14e9b25ff1))
* update assets location folder in copy-icons script ([2d7b3e4](https://github.com/kelvininc/ui-components/commit/2d7b3e4f949816ca4cb0a29c68883a24ca34b77f))


### Features

* upgrade stencil version ([69f9552](https://github.com/kelvininc/ui-components/commit/69f9552785fa71aca23dc2a47115698460d36fa3))
