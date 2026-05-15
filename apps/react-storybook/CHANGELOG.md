# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/kelvininc/ui-components/compare/v2.0.0...v2.0.1) (2026-05-15)

**Note:** Version bump only for package @kelvininc/react-storybook





# [2.0.0](https://github.com/kelvininc/ui-components/compare/v0.55.0...v2.0.0) (2026-05-14)


### Bug Fixes

* **sass:** resolve deprecated [@import](https://github.com/import) and typographies in scss files ([2d26703](https://github.com/kelvininc/ui-components/commit/2d267031c2838def552b65f40c0d15765eaa1a4c))
* **select:** preserve options order with numeric-like keys ([d6c47ce](https://github.com/kelvininc/ui-components/commit/d6c47ce78a1a3720b072e20edefe87724cff6652))


* feat(illustrations)!: migrate illustrations to design tokens and remove deprecated assets ([2135132](https://github.com/kelvininc/ui-components/commit/2135132f5f93a7510f3b8125c694aefb53a589cf))
* feat(modal, icon, dirty-dot, state-indicator, virtualized-list)!: migrate modal to design tokens and remove tree/summary-card components ([83efadd](https://github.com/kelvininc/ui-components/commit/83efadd0c6f587f79c636d913525fe2c2a3bb001))
* feat(tag)!: redesign kv-tag with color variants, icon and badge support ([43bb921](https://github.com/kelvininc/ui-components/commit/43bb921dddff2d73389335933878485f3a50fa7f))
* feat!: migrate badge, tab-item and tab-navigation to design tokens ([1f3edc1](https://github.com/kelvininc/ui-components/commit/1f3edc1475f293a309d169d51632ed84ebbe31d3))
* feat!: migrate to design token system ([3cb94a5](https://github.com/kelvininc/ui-components/commit/3cb94a561aed2e396e56004a78d6eb3c742c0a89))


### Features

* **action-buttons:** migrate to new design tokens ([02974f3](https://github.com/kelvininc/ui-components/commit/02974f36a183e9b91b966a0493716c392c6eaa73))
* **alert:** migrate alert component to design tokens ([9217745](https://github.com/kelvininc/ui-components/commit/92177455c8a7f720c8708e410e31dafa9e0b3d31))
* **breadcrumb-item, link, text-area:** refactor breadcrumb to use kv-link and migrate text-area to design tokens ([37c1e8a](https://github.com/kelvininc/ui-components/commit/37c1e8ad29ace98b2f97053ad0dd6ba68af6ba25))
* **copy-to-clipboard, description-list, inline-editable-field:** migrate to design token system ([20d4532](https://github.com/kelvininc/ui-components/commit/20d4532823177cd4ed4a6359758cc73a24c78497))
* **design-tokens:** update tags design tokens ([3090a62](https://github.com/kelvininc/ui-components/commit/3090a62db0dc3195d4932a314bd6edc9c0331d91))
* **icons:** remove deprecated icons from the icon library ([886ff1b](https://github.com/kelvininc/ui-components/commit/886ff1b54e804cc16821c87bd6ddeead0e58adf3))
* **info-label:** migrate to design token system ([52c4f38](https://github.com/kelvininc/ui-components/commit/52c4f38e87a14cb745799ce43c0d465763931c00))
* **inline-editable-field:** add placeholder for empty values ([95cd890](https://github.com/kelvininc/ui-components/commit/95cd890ccc39c1b8c8f073c47f306893fbec0e71))
* **link:** migrate to design token system ([96a2beb](https://github.com/kelvininc/ui-components/commit/96a2beb8cff2a95afab23e4cac93ae69fdcf6ccf))
* **radio, checkbox:** migrate to design token system ([cfd506c](https://github.com/kelvininc/ui-components/commit/cfd506c4a0bf52c8481552048fb1a5095f37aab4))
* **react-storybook:** add support to toggle themes dark and light ([98c720a](https://github.com/kelvininc/ui-components/commit/98c720a5288ba8ec25386eb28f16f9d48fdc4dc9))
* **schema-form:** migrate schema-form to design tokens ([7108d6b](https://github.com/kelvininc/ui-components/commit/7108d6b45da813a5ddbaaf9b9775d2db48890324))
* **storybook:** add side-by-side light/night theme preview in docs ([5e4b390](https://github.com/kelvininc/ui-components/commit/5e4b390f79e5fdadc08837e2e905b865306a4f44))
* **tab-item:** add icon support to secondary tab items ([9886259](https://github.com/kelvininc/ui-components/commit/9886259ec0832d8bd9a892c71e08b6614160c5b6))
* **time-picker:** migrate time pickers to  design tokens ([2cc7acb](https://github.com/kelvininc/ui-components/commit/2cc7acb15162b376881ce49342d5560a3874436e))
* **toaster:** migrate to design token system ([1dd027a](https://github.com/kelvininc/ui-components/commit/1dd027a6ee1b3287dd49ba3212b48eeea4f1d717))
* **toggle-button, toggle-switch:** migrate to design token system ([655c85c](https://github.com/kelvininc/ui-components/commit/655c85c7d5d092679a1387c3fb02f663dc488ba7))


### BREAKING CHANGES

* several EIllustration values have been removed (agree, disagree, soft-agree, box-build, color-circle, impact, party-dance, table-build, feedback-form, es-* illustrations, no-results-found-dark, no-results-found-light). Use the consolidated no-results-found or remaining illustrations instead.
* **copy-to-clipboard, description-list, inline-editable-field:** copy-to-clipboard hover background is now transparent
by default instead of neutral-6.
* kv-tree, kv-tree-item, kv-tree-dropdown and kv-summary-card components have been removed
* `size` prop removed — the tag no longer supports size
variants. Remove any `size` attribute usage from kv-tag.
* CSS custom property `--tag-border-color` removed. The
tag no longer renders a border; adjust any overrides that relied on this
variable.
* CSS custom property `--tag-content-padding` replaced
by `--tag-content-padding-x` and `--tag-content-padding-y`. Update any
custom padding overrides accordingly.

New props: `color` (ETagColor, default: neutral), `icon` (EIconName),
`badgeLabel` (string).
New CSS custom properties: `--tag-badge-color`, `--tag-badge-background-color`,
`--tag-icon-color`, `--tag-content-padding-x`, `--tag-content-padding-y`.
Color variants: neutral, brand, purple, green, yellow, red, blue.
* `EBadgeState` was removed and replaced with `EBadgeType`
(Primary, Secondary). The `state` prop on `kv-badge` is now `type`, and
`disabled` is a new explicit prop instead of a state variant.
* `kv-action-button-icon` removed `badgeLabel` and
`badgeState` props. The badge is no longer part of the action button icon.
* `kv-tab-item` removed props `size`, `hasNotification`,
`notificationColor`, `icon`, and `state`. The tab type is now controlled
via `type` (ETabItemType.Primary | Secondary) and slot-based content
(`right-slot`) replaces inline icon and notification dot rendering.
* `kv-tab-navigation` removed `notifications` and `size`
props. Use `type` (ETabItemType.Primary | Secondary) to control the visual
variant. Badge and tag-status content is now passed via `ITabNavigationItem`
fields `badge`, `badgeType`, `tagIcon`, and `tagState`.
* action button types renamed (Ghost → Text, Tertiary → Secondary), deprecated kv-font-* mixins replaced with new design token typography, @import replaced with @use





# [0.55.0](https://github.com/kelvininc/ui-components/compare/v0.51.0...v0.55.0) (2026-02-05)


### Features

* add support for visibility toggle on schema passwords ([e81551e](https://github.com/kelvininc/ui-components/commit/e81551e6062fbcbda9e3328c39d907ceec8ffea9))
* **alert:** adds new content slot ([884e8ed](https://github.com/kelvininc/ui-components/commit/884e8edc94233cca0f4e6672325780830564042c))
* **tooltip:** allow slot for tooltip text ([d667879](https://github.com/kelvininc/ui-components/commit/d6678791372b6d108df1f45a8330e3cadd5a559d))





# [0.51.0](https://github.com/kelvininc/ui-components/compare/v0.50.0...v0.51.0) (2025-10-10)

**Note:** Version bump only for package @kelvininc/react-storybook





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
