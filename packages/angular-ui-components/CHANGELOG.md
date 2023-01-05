# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.14.0](https://github.com/kelvininc/ui-components/compare/v0.13.0...v0.14.0) (2023-01-05)


### Bug Fixes

* **kv-icon:** remove height offset from icon and add new tag component ([b618cbf](https://github.com/kelvininc/ui-components/commit/b618cbf5e2660ed19428c7e3e7ade3b2f6c86907))


### Performance Improvements

* **illustrations:** generate illustrations in build time ([#148](https://github.com/kelvininc/ui-components/issues/148)) ([87808f6](https://github.com/kelvininc/ui-components/commit/87808f69c942348e2537e7c94a2e25edd1989bcc))





# [0.13.0](https://github.com/kelvininc/ui-components/compare/v0.12.0...v0.13.0) (2022-10-06)


### Bug Fixes

* correct packages' author name ([20ea3a3](https://github.com/kelvininc/ui-components/commit/20ea3a3bb0449fe5739b6e7ff93255d846a6eeb1))
* move tab items tab navigation [KMAPS-493] ([31c308f](https://github.com/kelvininc/ui-components/commit/31c308f749cfe84f40e65c026244541821afd77f))





# [0.12.0](https://github.com/kelvininc/ui-components/compare/v0.11.0...v0.12.0) (2022-09-13)

**Note:** Version bump only for package @kelvininc/angular-ui-components





# [0.11.0](https://github.com/kelvininc/ui-components/compare/v0.10.0...v0.11.0) (2022-09-05)


### Bug Fixes

* **icon:** remove timestamp from copied SVG of symbols [KMAPS-385] ([1019078](https://github.com/kelvininc/ui-components/commit/1019078da0399e3a95d153d6faf21d4faecfc413))





# [0.10.0](https://github.com/kelvininc/ui-components/compare/v0.9.0...v0.10.0) (2022-08-30)


* refactor(dropdown)!: rename `dropdown-list` to `select` ([42dd45b](https://github.com/kelvininc/ui-components/commit/42dd45b88b183550a39dd46f3c894a65acbc5297))


### Features

* add file checksum to file name for caching purposes [KMAPS-385] ([393a5d6](https://github.com/kelvininc/ui-components/commit/393a5d6ac839fd526728237a31a08fe5405511d4))
* **advanced-date-input:** add advanced date input components ([2396f20](https://github.com/kelvininc/ui-components/commit/2396f200e10f080dbc91aa95e593682d5222aff1))
* **badge:** add `kv-badge` component ([994b077](https://github.com/kelvininc/ui-components/commit/994b07719b51cf65885644ff1dc621808fe83605))
* **calendar:** add calendar base, selector and dropdown components ([29b4428](https://github.com/kelvininc/ui-components/commit/29b4428ba715988422f906f5a75529aef7c30c7e))
* **kv-schema-form:** add and integrate the react-jsonschema-form lib ([51e6044](https://github.com/kelvininc/ui-components/commit/51e60440f6b5cb95662ea8772203fdbd5e51aee1))
* **modal:** add modal component ([c0cabe9](https://github.com/kelvininc/ui-components/commit/c0cabe9eb48296606fad5353b1590cefaf3f9ddb))
* **range:** add new range component ([95de2a7](https://github.com/kelvininc/ui-components/commit/95de2a7d064b696272241f61d113f82464588f15))
* **toggle-tip:** toggle tip component ([52a7a23](https://github.com/kelvininc/ui-components/commit/52a7a23960c527a76bef34636a08b144cf70f24d))


### BREAKING CHANGES

* **advanced-date-input:** - `kv-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-single-select-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-multi-select-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-tooltip`: the `allowed-positions` prop was removed and all position config are now passed though a `options` prop.
* `dropdown-list` was renamed to `select` and `dropdown-list-item` was renamed to `select-option`





# [0.9.0](https://github.com/kelvininc/ui-components/compare/v0.8.0...v0.9.0) (2022-06-28)


### Features

* **dropdown:** add single and multi select dropdown ([#73](https://github.com/kelvininc/ui-components/issues/73)) ([27ad7dd](https://github.com/kelvininc/ui-components/commit/27ad7dd9439bd2871d9356b011832f0be006a266))
* **tree-item:** add tree item component ([ea9bec9](https://github.com/kelvininc/ui-components/commit/ea9bec9cf7b771d53f805ddf16e6c0d72dfe2194))
* **tree:** add tree component ([88bf9f9](https://github.com/kelvininc/ui-components/commit/88bf9f9baba364ee370f8a78960b0ebec7088b1d))





# [0.8.0](https://github.com/kelvininc/ui-components/compare/v0.7.0...v0.8.0) (2022-04-27)


### Features

* **illustration:** add component ([9224eca](https://github.com/kelvininc/ui-components/commit/9224eca42eb7a485e8bd6063711d537ad7e89698))
* **kv-info-label:** add component kv-info-label ([2a56422](https://github.com/kelvininc/ui-components/commit/2a56422af944743b838cc46b0a51852e4b2e413c))
* **kv-radio-button-group:** rename compoment kv-radio-button to kv-radio and create new components kv-radio-button and kv-radio-button-group ([9b7357d](https://github.com/kelvininc/ui-components/commit/9b7357de8102937d67b0e92dd71ce8af1f1edf97))
* **radio-buttons:** add manual state control ([885612d](https://github.com/kelvininc/ui-components/commit/885612dcf36ffb9aeec754f0d5bbef8b6745e7cc))
* Search component ([2912db0](https://github.com/kelvininc/ui-components/commit/2912db0459dfa2e5f3eaf1fbec160969742ed0e9))
* **summary-card:** add summary card component ([348670c](https://github.com/kelvininc/ui-components/commit/348670caaf50e588418991f441d506eb5c6d5723))
* toaster component ([2311b62](https://github.com/kelvininc/ui-components/commit/2311b629f6ee8aaed31312808389d4b8d0bb0e12))





# [0.7.0](https://github.com/kelvininc/ui-components/compare/v0.6.0...v0.7.0) (2022-03-16)


### Bug Fixes

* add missing components to angular module ([a83a0fa](https://github.com/kelvininc/ui-components/commit/a83a0fa748cee0ed13f864ba21fc9f0265ff781d))


### Features

* add text-field into new structure ([84639ee](https://github.com/kelvininc/ui-components/commit/84639ee62b5e3f9912e3e8fdd06bc5647305fc27))
* **config:** add env configuration ([e29ebf2](https://github.com/kelvininc/ui-components/commit/e29ebf2c7ae0a67c38e5e2178211559317e9c2ec))
* create tooltip component ([8023fd6](https://github.com/kelvininc/ui-components/commit/8023fd64ce419ec19d16b32e58933cb9f13e3f10))
* **tab-navigation:** add tab navigation component ([42be592](https://github.com/kelvininc/ui-components/commit/42be592ce4252d337d43b8561cd5fcdba981f2d1))
* **text-field:** add dark style mode ([f7c6e09](https://github.com/kelvininc/ui-components/commit/f7c6e094e2168d0214f12ac40eeea9a6a87e253a))





# [0.6.0](https://github.com/kelvininc/ui-components/compare/v0.5.3...v0.6.0) (2022-03-07)


### Features

* add icons and illustrations ([e67903e](https://github.com/kelvininc/ui-components/commit/e67903e2877dd7a822ec5171f838ba64f6e5ae2a))
* **kv-tag-letter:** migrate tag letter component ([d04d565](https://github.com/kelvininc/ui-components/commit/d04d565d8d57832856e625f68a4c93ec9d770a17))
* **radio-button:** add radio button component ([f82cac8](https://github.com/kelvininc/ui-components/commit/f82cac80df334952de26a8364084738bc7109678))





## [0.5.3](https://github.com/kelvininc/ui-components/compare/v0.5.2...v0.5.3) (2022-02-25)

**Note:** Version bump only for package @kelvininc/angular-ui-components





## [0.5.2](https://github.com/kelvininc/ui-components/compare/v0.5.1...v0.5.2) (2022-02-25)

**Note:** Version bump only for package @kelvininc/angular-ui-components





## [0.5.1](https://github.com/kelvininc/ui-components/compare/v0.5.0...v0.5.1) (2022-02-25)


### Bug Fixes

* add missing components to angular build ([73756f6](https://github.com/kelvininc/ui-components/commit/73756f6bfcca43064dabc0bd229ec00f81ca94de))





# 0.5.0 (2022-02-24)


### Features

* **kv-breadcrumb-trail:** add kv-breadcrumb-trail component ([f32229d](https://github.com/kelvininc/ui-components/commit/f32229d147a2c6a3b04500d5fffb86d6c77744a4))
* **kv-link:** add kv-link component ([3a038bc](https://github.com/kelvininc/ui-components/commit/3a038bc0a245c47ff61b7aaa7b4da2835ce3717c))
* **switch-button:** add component ([d29575f](https://github.com/kelvininc/ui-components/commit/d29575f86566077636af601f4f51482dcc7d7be7))
