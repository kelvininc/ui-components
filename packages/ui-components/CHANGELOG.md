# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/kelvininc/ui-components/compare/v0.8.0...v0.9.0) (2022-06-28)


### Bug Fixes

* **action-button:** white space wrap ([6dcebef](https://github.com/kelvininc/ui-components/commit/6dcebef2fff76e92665fbd390ec65c1ac48e17f1))
* **breadcrumb:** change breadcrumb style ([522d208](https://github.com/kelvininc/ui-components/commit/522d2081dbe8b2d1c5cbbda14b1430d2da3e70a0))
* **dropdown:** add proper documentation links and titles ([b6f5d1e](https://github.com/kelvininc/ui-components/commit/b6f5d1ef1bfecaa8901235241ed7f1d2738c4844))
* export toaster controller correctly and add datetime input type ([4f58e9a](https://github.com/kelvininc/ui-components/commit/4f58e9a4191a7609cfe410cc5d9dc69a6bff251c))
* **radio-button:** remove blurred effect ([15ed0bf](https://github.com/kelvininc/ui-components/commit/15ed0bf1d1a1851f82962a04c37ad8f69d45578a))


* feat(text-field)!: add min, max and step attributes ([507fd78](https://github.com/kelvininc/ui-components/commit/507fd78488ff211af29e7e7a9fc692c1f6da088c))


### Features

* **dropdown:** add single and multi select dropdown ([#73](https://github.com/kelvininc/ui-components/issues/73)) ([27ad7dd](https://github.com/kelvininc/ui-components/commit/27ad7dd9439bd2871d9356b011832f0be006a266))
* **icons:** adds  icons ([9d016f6](https://github.com/kelvininc/ui-components/commit/9d016f68a696980c43f0358843f97fb7be817f20))
* **icons:** adds entity tree icons ([4718154](https://github.com/kelvininc/ui-components/commit/471815427593c1813e4b74ab66c8e91d02758a32))
* **svg-icon:** add chat icon ([e072154](https://github.com/kelvininc/ui-components/commit/e0721544b96b85ad912959f8b67773f8087ed86e))
* **text-field:** add input masking ([24a9407](https://github.com/kelvininc/ui-components/commit/24a94073bef9451bd33ac089f9fe9f05262ff05b))
* **toaster:** add `afterOpen` and `afterClose` callbacks ([b0eac6f](https://github.com/kelvininc/ui-components/commit/b0eac6f217505cd6bb7ea88cc0b904fe95f795ab))
* **tree-item:** add tree item component ([ea9bec9](https://github.com/kelvininc/ui-components/commit/ea9bec9cf7b771d53f805ddf16e6c0d72dfe2194))
* **tree:** add tree component ([88bf9f9](https://github.com/kelvininc/ui-components/commit/88bf9f9baba364ee370f8a78960b0ebec7088b1d))


### BREAKING CHANGES

* property for defining the maximum number of characters is now named `maxLength` instead of the previous `max` which now refers to the input maximum value





# [0.8.0](https://github.com/kelvininc/ui-components/compare/v0.7.0...v0.8.0) (2022-04-27)


### Bug Fixes

* **action-button:** change background color on tertiary disabled state ([8f57d00](https://github.com/kelvininc/ui-components/commit/8f57d002ab155732b0bac0f3f87dbb2b8d80e0fb))
* **illustration:** fix `kv-es-table-empty-night` ([adc8b86](https://github.com/kelvininc/ui-components/commit/adc8b869800a40607ab0301bb103d087ae84314d))
* **illustration:** fix `kv-es-table-search-night` ([179cbec](https://github.com/kelvininc/ui-components/commit/179cbec44e6798d5e5c092c698a7b4d59c6bb0cd))
* **kv-loader:** fix overlay color and z-index value ([f70e425](https://github.com/kelvininc/ui-components/commit/f70e42589b9f83410f9c5429cb58a8bedbf95130))
* **kv-radio-button-group:** change styling according to design system ([bbbf96d](https://github.com/kelvininc/ui-components/commit/bbbf96d220ed8c1ef949ce2cd01461c9a16cd753))
* **test-field:** add margin top only on labeled inputs ([4f754df](https://github.com/kelvininc/ui-components/commit/4f754df47f0f1e8d3eee02d9191f1af503142ebd))
* **text-field:** fix icon color when input is invalid ([deee7dc](https://github.com/kelvininc/ui-components/commit/deee7dc4b2085f5a50e12fd8f55d3f164e785798))


### Features

* **illustration:** add component ([9224eca](https://github.com/kelvininc/ui-components/commit/9224eca42eb7a485e8bd6063711d537ad7e89698))
* **kv-info-label:** add component kv-info-label ([2a56422](https://github.com/kelvininc/ui-components/commit/2a56422af944743b838cc46b0a51852e4b2e413c))
* **kv-radio-button-group:** rename compoment kv-radio-button to kv-radio and create new components kv-radio-button and kv-radio-button-group ([9b7357d](https://github.com/kelvininc/ui-components/commit/9b7357de8102937d67b0e92dd71ce8af1f1edf97))
* **radio-buttons:** add manual state control ([885612d](https://github.com/kelvininc/ui-components/commit/885612dcf36ffb9aeec754f0d5bbef8b6745e7cc))
* Search component ([2912db0](https://github.com/kelvininc/ui-components/commit/2912db0459dfa2e5f3eaf1fbec160969742ed0e9))
* **summary-card:** add summary card component ([348670c](https://github.com/kelvininc/ui-components/commit/348670caaf50e588418991f441d506eb5c6d5723))
* **text-field:** add prop to set the max length ([9726ca8](https://github.com/kelvininc/ui-components/commit/9726ca80684ed3e10d49a27998c1af71590384b7))
* toaster component ([2311b62](https://github.com/kelvininc/ui-components/commit/2311b629f6ee8aaed31312808389d4b8d0bb0e12))
* **typography:** add `kv-font-label-small-uppercase-regular` mixin ([0111275](https://github.com/kelvininc/ui-components/commit/01112758fff937d035a5050d5b1d2887a8a69e01))





# [0.7.0](https://github.com/kelvininc/ui-components/compare/v0.6.0...v0.7.0) (2022-03-16)


### Bug Fixes

* **storybook:** fix action button story names ([a6c27d8](https://github.com/kelvininc/ui-components/commit/a6c27d898610c4e90e1d6042ce07d74279d7e794))
* **storybook:** fix stories organization ([cfc85b1](https://github.com/kelvininc/ui-components/commit/cfc85b1d6da0c0ee561464fa42c9431dd9c6221f))
* **text-field:** fix invalid icon color ([49dce7d](https://github.com/kelvininc/ui-components/commit/49dce7d2c2b72b09608fa979db96559d25eab7cc))


### Features

* **action-button:** add component ([101a020](https://github.com/kelvininc/ui-components/commit/101a0202fbe61b4b01fc6b6cb96b0d6240036f1a))
* add text-field into new structure ([84639ee](https://github.com/kelvininc/ui-components/commit/84639ee62b5e3f9912e3e8fdd06bc5647305fc27))
* **config:** add env configuration ([e29ebf2](https://github.com/kelvininc/ui-components/commit/e29ebf2c7ae0a67c38e5e2178211559317e9c2ec))
* create tooltip component ([8023fd6](https://github.com/kelvininc/ui-components/commit/8023fd64ce419ec19d16b32e58933cb9f13e3f10))
* **svg-icon:** add kv-custom-dashboard and kv-back icons ([1bff70a](https://github.com/kelvininc/ui-components/commit/1bff70a246211f41cd42f5c17d6c680a69ad1aa2))
* **svg-icon:** add svg icons ([4ab8510](https://github.com/kelvininc/ui-components/commit/4ab85109da71ab01b00065142f6f44f3ae3ceff8))
* **svg-icon:** enable public assets url configuration ([cd23f86](https://github.com/kelvininc/ui-components/commit/cd23f860eab866cf01478f64f0b0619ac7a6b842))
* **tab-navigation:** add tab navigation component ([42be592](https://github.com/kelvininc/ui-components/commit/42be592ce4252d337d43b8561cd5fcdba981f2d1))
* **text-field:** add dark style mode ([f7c6e09](https://github.com/kelvininc/ui-components/commit/f7c6e094e2168d0214f12ac40eeea9a6a87e253a))





# [0.6.0](https://github.com/kelvininc/ui-components/compare/v0.5.3...v0.6.0) (2022-03-07)


### Bug Fixes

* **switch-button:** add night mode style ([d571620](https://github.com/kelvininc/ui-components/commit/d57162030b8b8dd9d55f0a5e0e6d4cb996583656))
* **switch-button:** refactor component props and state ([8a44085](https://github.com/kelvininc/ui-components/commit/8a4408569d9dd8f2ca12fa8194cc84ae75a758bf))


### Features

* add icons and illustrations ([e67903e](https://github.com/kelvininc/ui-components/commit/e67903e2877dd7a822ec5171f838ba64f6e5ae2a))
* change storybook to dark mode ([9b9e9f9](https://github.com/kelvininc/ui-components/commit/9b9e9f944d8bf76184cfac7fd8565a7c3c089050))
* **colors-palette:** add missing neutrals to colors palette ([2c6c923](https://github.com/kelvininc/ui-components/commit/2c6c92338e7fb47943e49409dab377187b192471))
* **kv-tag-letter:** migrate tag letter component ([d04d565](https://github.com/kelvininc/ui-components/commit/d04d565d8d57832856e625f68a4c93ec9d770a17))
* **radio-button:** add radio button component ([f82cac8](https://github.com/kelvininc/ui-components/commit/f82cac80df334952de26a8364084738bc7109678))





## [0.5.3](https://github.com/kelvininc/ui-components/compare/v0.5.2...v0.5.3) (2022-02-25)

**Note:** Version bump only for package @kelvininc/ui-components





## [0.5.2](https://github.com/kelvininc/ui-components/compare/v0.5.1...v0.5.2) (2022-02-25)

**Note:** Version bump only for package @kelvininc/ui-components





# 0.5.0 (2022-02-24)


### Bug Fixes

* **kv-colors:** add support for getting all colors via sass kv-colors function. ([d6bb1fd](https://github.com/kelvininc/ui-components/commit/d6bb1fd74893249a8f723abe17d16eeb4a1f8e51))
* **kv-link:** fix anchor tag styling ([4c45d54](https://github.com/kelvininc/ui-components/commit/4c45d542e4b78ae319df80bc9e1ce35985ce9364))


### Features

* **kv-breadcrumb-trail:** add kv-breadcrumb-trail component ([f32229d](https://github.com/kelvininc/ui-components/commit/f32229d147a2c6a3b04500d5fffb86d6c77744a4))
* **kv-link:** add kv-link component ([3a038bc](https://github.com/kelvininc/ui-components/commit/3a038bc0a245c47ff61b7aaa7b4da2835ce3717c))
* **kv-loader:** implement loader component ([17c7ba8](https://github.com/kelvininc/ui-components/commit/17c7ba8bda9b693c1d7332bce3c6d02c090e3661))
* **kv-state-indicator:** implement state indicator component ([1799f1d](https://github.com/kelvininc/ui-components/commit/1799f1d68183fc0428c4521d0fd65ddae88e8a2e))
* **switch-button:** add component ([d29575f](https://github.com/kelvininc/ui-components/commit/d29575f86566077636af601f4f51482dcc7d7be7))
