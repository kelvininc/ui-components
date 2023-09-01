# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.21.0](https://github.com/kelvininc/ui-components/compare/v0.20.0...v0.21.0) (2023-07-13)


### Bug Fixes

* **select-multi-options:** emit only selected options in map ([96c2349](https://github.com/kelvininc/ui-components/commit/96c2349fd06f78b06bc95746a653b352dda6469c))


* fix(dropdown)!: update `kv-select-group` component style ([06d0b96](https://github.com/kelvininc/ui-components/commit/06d0b966e3f42aaf02ac081a5419e2e0240a4d9b))
* feat(labels-dropdown)!: add component ([aa3c48c](https://github.com/kelvininc/ui-components/commit/aa3c48c901696f2dce6685cd1cc2ac97718bf4a1))
* refactor(toggle-tip, dropdown)!: use portal to show floating content ([644ca7b](https://github.com/kelvininc/ui-components/commit/644ca7bd90c296c13b13588c8fc1faa762c56d90))


### Features

* **relative-time-picker:** reorder items in relative time picker default config ([992dbd3](https://github.com/kelvininc/ui-components/commit/992dbd3a3e590e553f32c09dab28479c89eb013c))
* **schema-form:** add tooltip props to submit button ([6883d6d](https://github.com/kelvininc/ui-components/commit/6883d6df35b5173bb51819df4582e3917a7f3095))
* **select-option:** add description label on the right ([8b58353](https://github.com/kelvininc/ui-components/commit/8b58353869bec7485a99684bfadc1b5c5ff04f47))
* **select:** add header actions slot ([f8bd0c3](https://github.com/kelvininc/ui-components/commit/f8bd0c34d004fc1772054de0caec6fb3092fea6f))
* **wizard:** add a more imperative approach to footer actions ([d11cfae](https://github.com/kelvininc/ui-components/commit/d11cfaef07a213652d7cda6cc01a2f64c0edf27e))


### BREAKING CHANGES

* - `IMultiSelectDropdownOptions` was relaced by `ISelectMultiOptions`
- `IMultiSelectDropdownOption` was relaced by `ISelectMultiOption`
* renamed kv-text-field CSS prop `--left-slot-padding-left` to `--left-slot-width`
* kv-tooltip:
	- part 'container' should be styled through the customClass property in 'tooltip-container' part.

kv-toggle-tip not in Shadow DOM:
	- part 'toggle-tip-open-element-container' should be accessed through the '.toggle-tip-open-element-container' class
	- parts 'toggle-tip-container' and 'toggle-tip-slot-content' should be styled through the customClass property in 'tooltip-container' and 'tooltip-slot-content' parts respectively.
	- CSS variable '--toggletip-z-index' was removed
	- CSS variables '--toggle-tip-container-width' and '--toggle-tip-container-max-width' should be styled through the customClass property in '--container-width' and '--container-max-width' vars respectively

kv-dropdown not in Shadow DOM:
	- part 'input' should be accessed through the 'kv-text-field' selector

kv-range-dates-select-dropdown not in Shadow DOM:
	- parts 'start-input' and 'end-input' should be styled through the '.start-single-date-select-dropdown kv-text-field' and '.end-single-date-select-dropdown kv-text-field' selectors respectively.

kv-single-select-dropdown and kv-multi-select-dropdown not in Shadow DOM:
	- CSS variable '--dropdown-max-height' still working as before.
	- part 'option' should be styled through the customClass property with 'kv-select-option' selector.
	- part 'input' should be accessed through the 'kv-dropdown kv-text-field' selector.





# [0.20.0](https://github.com/kelvininc/ui-components/compare/v0.19.0...v0.20.0) (2023-06-13)


### Bug Fixes

* **time-picker:** allow empty timezone state in props ([30b8884](https://github.com/kelvininc/ui-components/commit/30b8884b289290baa3952c37900f3831b9ca46b4))


### Features

* **button:** add loading state ([ac6c73f](https://github.com/kelvininc/ui-components/commit/ac6c73fb348b372a3d6dc69d67a0e030fb7d0eab))
* **text-area:** add component ([11b1e5a](https://github.com/kelvininc/ui-components/commit/11b1e5a679dc0602a4c84142c13a8cc8bf73311f))





# [0.19.0](https://github.com/kelvininc/ui-components/compare/v0.18.0...v0.19.0) (2023-05-05)


### Bug Fixes

* **time-picker:** sync initial view with show calendar toggle state ([d74f6e5](https://github.com/kelvininc/ui-components/commit/d74f6e5cc1a80c26c506471626013112ab52475c))





# [0.18.0](https://github.com/kelvininc/ui-components/compare/v0.17.0...v0.18.0) (2023-04-21)


### Bug Fixes

* **copy-to-clipboard:** change component behavior on hover and minor updates ([763fac4](https://github.com/kelvininc/ui-components/commit/763fac4f9eeee14eb92d932dc6f9c67bbdce730c))
* **schema-form-checkbox-widget:** fix toogle selected options ([#274](https://github.com/kelvininc/ui-components/issues/274)) ([84d1762](https://github.com/kelvininc/ui-components/commit/84d1762843e70ce4d397d3c81cc60355e15ec524))
* **tag-status:** update tag status style ([d7ad25b](https://github.com/kelvininc/ui-components/commit/d7ad25b7a63bd9a5b8013e348fa8e19047528168))


* fix(typography)!: update typography mixins according to DS ([25080af](https://github.com/kelvininc/ui-components/commit/25080af8fc458feba3055fa33e946ac23b81b2f5))
* refactor(code-editor)!: separate font loading logic and add kelvin theme ([199c120](https://github.com/kelvininc/ui-components/commit/199c12018742e4c31093c1b0395bd07614e18254))


### Features

* **absolute-time-picker:** add new absolute time picker component ([5e51363](https://github.com/kelvininc/ui-components/commit/5e513639ffbabe52a7c0b2afd5733bf3411f1411))
* **action-button:** update design ([#249](https://github.com/kelvininc/ui-components/issues/249)) ([f66cfa3](https://github.com/kelvininc/ui-components/commit/f66cfa3d13fb507206002e7fa0c044551c43d713))
* **copy-to-clipboard:** add component ([3684505](https://github.com/kelvininc/ui-components/commit/36845053165093f19d4add294ea28a8df1c0ec06))
* **description-list:** add component ([054df2d](https://github.com/kelvininc/ui-components/commit/054df2df6284d4c9421afadf15bfe7fbdaaf3916))
* **dropdown:** add input size configuration ([a251610](https://github.com/kelvininc/ui-components/commit/a251610bc35448b67c105940d1146c8d031a3799))
* expose utils ([f2a4885](https://github.com/kelvininc/ui-components/commit/f2a4885975aeaeba7dd44e1473d2d71a85a05b18))
* **radio-list:** add component ([9d465b6](https://github.com/kelvininc/ui-components/commit/9d465b67e5cc89b919d4d1386c8ce594967a5da2))
* **relative-time-picker:** new relative time picker component ([9bacb89](https://github.com/kelvininc/ui-components/commit/9bacb898155ab861c9a4fb152f1472fd7670d6e0))
* **tag-status:** add custom css properties to tag status style ([221862d](https://github.com/kelvininc/ui-components/commit/221862df86242859865532eb46efd469c99ac88b))
* **time-range:** add new time range picker component ([a6042ca](https://github.com/kelvininc/ui-components/commit/a6042ca8c92ecad81b6838e5160f8dee6cd0db36))


### BREAKING CHANGES

* 'kv-font-h3-regular' and 'kv-font-label-medium-light' mixins were removed
* `readOnly` and `paddingTop` properties were moved to the `customOptions` object





# [0.17.0](https://github.com/kelvininc/ui-components/compare/v0.16.0...v0.17.0) (2023-03-10)


### Bug Fixes

* add storybook build to CI ([711fa3e](https://github.com/kelvininc/ui-components/commit/711fa3ea7e1026f1e2c17d40ea4eafef449f979a))
* **code-editor:** wait until font is loaded and use initial props ([58aa6fe](https://github.com/kelvininc/ui-components/commit/58aa6fe44b7a5ba8ed9f313ab246be457a5bdf6f))
* **dropdown:** Change dropdown list default width to be the same as its action ([#240](https://github.com/kelvininc/ui-components/issues/240)) ([725ce66](https://github.com/kelvininc/ui-components/commit/725ce667a37c0c33e69fe17af9e403287dc0062b))
* **modal:** export modal overlay types ([2135507](https://github.com/kelvininc/ui-components/commit/213550722fd79cea152f97f23d1ab540f52b7d99))


* fix(code-editor)!: remove memoization and debounce time from onChange ([b28efa8](https://github.com/kelvininc/ui-components/commit/b28efa8ee12ff9f7a4a25340ff0c5c56e96b2698))
* fix(modal)!: click outside behavior can now be customized ([55d2a29](https://github.com/kelvininc/ui-components/commit/55d2a2982c57cc79fa0696403a551f4480e74e60))


### Features

* **alert:** add component ([355f046](https://github.com/kelvininc/ui-components/commit/355f04612787fb794cf5975f0a2a70aa34704f0a))
* **code-editor:** add component ([2ffe8c7](https://github.com/kelvininc/ui-components/commit/2ffe8c760129c08404a778c7c630cd27ae60308a))
* **code-editor:** add padding top option ([e0c2389](https://github.com/kelvininc/ui-components/commit/e0c2389f1968c2d1cf08c67c4c37add11ff5d46f))
* **dropdown:** add `disabled` prop ([8828615](https://github.com/kelvininc/ui-components/commit/88286153ca09451d976971a5b362b5b820ac45a2))
* **single-select-dropdown:** allow clear selected item in single-select-dropdown ([#252](https://github.com/kelvininc/ui-components/issues/252)) ([faad5e5](https://github.com/kelvininc/ui-components/commit/faad5e5da988a59b328bb628aa39ee9644611203))
* **wizard-footer:** add component ([c782eb6](https://github.com/kelvininc/ui-components/commit/c782eb6eaa6ffc1c462b01f7f87d5f80ab872867))
* **wizard-header:** add component ([7c7daa2](https://github.com/kelvininc/ui-components/commit/7c7daa289588505665a7745c5970656438ef27bc))
* **wizard:** add wizard component ([6c1421f](https://github.com/kelvininc/ui-components/commit/6c1421fb9edf6be9235354190fa61445f2771067))


### BREAKING CHANGES

* This commit removes the `debounceTime` property from the component, therefore removing the default 200ms wait before firing a change event.
* `closable` was removed, to replicate the previous behavior set `closeOnOverlayClick` and `showCloseButton` to false.





# [0.16.0](https://github.com/kelvininc/ui-components/compare/v0.15.0...v0.16.0) (2023-01-27)


### Features

* **checkbox:** add `kv-checkbox` component ([359687f](https://github.com/kelvininc/ui-components/commit/359687f8aafc04aad2e07e0690d32b55d5b90d2a))





# [0.15.0](https://github.com/kelvininc/ui-components/compare/v0.14.0...v0.15.0) (2023-01-24)


### Bug Fixes

* **action-button-icon:** remove height offset ([da025fa](https://github.com/kelvininc/ui-components/commit/da025fa6b84c4184f40e11959e0d1aeffb10db77))
* **multi-select-dropdown:** add empty check to options ([0f24d64](https://github.com/kelvininc/ui-components/commit/0f24d64643304e2995573ebf55fd39dcd9e3c472))
* **react-ui-components:** change build config to organize correctly the lodash dependency ([9976a7c](https://github.com/kelvininc/ui-components/commit/9976a7c55428654def41efd981b5369c3daec296))


* fix(tag-status)!: replace tag status props to expand functionallity ([beec9c8](https://github.com/kelvininc/ui-components/commit/beec9c8368d9db0f242b23ea4708a9578d3ae711))


### Features

* **tag-alarm:** add new tag alarm component ([62d2b41](https://github.com/kelvininc/ui-components/commit/62d2b419d9c853198ee6197ee94e5cac6c784906))


### BREAKING CHANGES

* replaces the previous prop 'type' by 'state' to specify the color of the icon, 'icon' to specify the icon to be displayed and 'label' (optional) to define the text.





# [0.14.0](https://github.com/kelvininc/ui-components/compare/v0.13.0...v0.14.0) (2023-01-05)


### Bug Fixes

* correct props variable name ([90f7f23](https://github.com/kelvininc/ui-components/commit/90f7f23037f248b7a2a87a5a55fbf043129ddcca))
* **dropdown:** add `filteredOptions` to select dropdowns ([e986322](https://github.com/kelvininc/ui-components/commit/e9863224a0390aa17d1f07efeec93ce64c5ed82e))
* **kv-icon:** remove height offset from icon and add new tag component ([b618cbf](https://github.com/kelvininc/ui-components/commit/b618cbf5e2660ed19428c7e3e7ade3b2f6c86907))
* **textfield:** allow 0 as default numeric type input ([729d4b2](https://github.com/kelvininc/ui-components/commit/729d4b23ede9381f9788a00d86669c713149e89e))


* feat(schema-form)!: updates rjsf dependency to allow validating dependencies in dates and times. ([4c30faf](https://github.com/kelvininc/ui-components/commit/4c30faf9abd3d74f6c50dce5b783c087c0744d6d))
* feat(radio-button)!: add icon to radio button ([5fdfdf8](https://github.com/kelvininc/ui-components/commit/5fdfdf896ab74edcaee314755ee1fb949fd5f7d4))


### Features

* enable customize dropdowns height with props ([a19ddd9](https://github.com/kelvininc/ui-components/commit/a19ddd91f4ad84edd449ab96a4ecf3ed5f05bd28))
* **schema-form:** add checkboxes widget ([2d970fd](https://github.com/kelvininc/ui-components/commit/2d970fd4736d4e9ba66c273869a95e7a83a4386d))
* **schema-form:** add date and email input widgets ([3398f88](https://github.com/kelvininc/ui-components/commit/3398f88ea7f18f688b366988abe60f839b12e105))
* **schema-form:** add scroll style on form ([ec90a63](https://github.com/kelvininc/ui-components/commit/ec90a63c88a2ac5989c63baa01048305ce7fc15a))
* **schema-form:** add searchable behaviour to select widget ([5e113f1](https://github.com/kelvininc/ui-components/commit/5e113f141d6116c1992db22abdad6aa3105b5bb0))
* **schema-form:** allow inline form ([a9ca2b8](https://github.com/kelvininc/ui-components/commit/a9ca2b853669407c1da1945b29e6a829aa9f253f))
* **status:** add new status tag component ([#199](https://github.com/kelvininc/ui-components/issues/199)) ([c8e71ab](https://github.com/kelvininc/ui-components/commit/c8e71ab7df24808ae986c36bb1aadd49608c0245))
* **tooltip:** only display tooltip when string is ellipsed ([#189](https://github.com/kelvininc/ui-components/issues/189)) ([fe7764e](https://github.com/kelvininc/ui-components/commit/fe7764ed1695fba29d9e1e8697ebfbf7db9e41e7))


### Performance Improvements

* **illustrations:** generate illustrations in build time ([#148](https://github.com/kelvininc/ui-components/issues/148)) ([87808f6](https://github.com/kelvininc/ui-components/commit/87808f69c942348e2537e7c94a2e25edd1989bcc))


### BREAKING CHANGES

* showErrorList now accepts 'top' 'bottom' or false only.
* label property is now optional and value is required





# [0.13.0](https://github.com/kelvininc/ui-components/compare/v0.12.0...v0.13.0) (2022-10-06)


### Bug Fixes

* correct packages' author name ([20ea3a3](https://github.com/kelvininc/ui-components/commit/20ea3a3bb0449fe5739b6e7ff93255d846a6eeb1))
* move tab items tab navigation [KMAPS-493] ([31c308f](https://github.com/kelvininc/ui-components/commit/31c308f749cfe84f40e65c026244541821afd77f))
* remove state manipulations inside dropdown element ([00e84cb](https://github.com/kelvininc/ui-components/commit/00e84cb85c21d1b8b5ad1ba887592b96534d8571))
* **text-field:** remove placeholder 0 on type numeric on hover or focus ([12c72d4](https://github.com/kelvininc/ui-components/commit/12c72d4b65537ebb22195f756b9c9915fca9f640))


### Features

* add dropdown tree component [KMAPS-423] ([bfa8540](https://github.com/kelvininc/ui-components/commit/bfa8540986961d174f3bd4561eddd5914393a150))
* **tooltip:** add delay before show text [KMAPS-523] ([f4c3496](https://github.com/kelvininc/ui-components/commit/f4c3496ac0dd636ea2e8a2c903b9d8459a60d791))
* **tooltip:** add disable behaviour ([869141a](https://github.com/kelvininc/ui-components/commit/869141a119daad7f1ca7a7629010ab9379da4315))
* **tree-dropdown:** add tooltip to label [KMAPS-522,KMAPS-523] ([04f3d82](https://github.com/kelvininc/ui-components/commit/04f3d822ed45145e4f8700d765cc655d83339e74))





# [0.12.0](https://github.com/kelvininc/ui-components/compare/v0.11.0...v0.12.0) (2022-09-13)


### Bug Fixes

* **advanced-date-select:** return relative time by timezone ([370ac03](https://github.com/kelvininc/ui-components/commit/370ac0362200448c95dcc828a5c8c7e488bb5296))


### Features

* **advanced calendar:** add start/end date format config [KMAPS-437] ([c1da23c](https://github.com/kelvininc/ui-components/commit/c1da23cfe5d49871f869bc9e1c58d9c27fa1217b))





# [0.11.0](https://github.com/kelvininc/ui-components/compare/v0.10.0...v0.11.0) (2022-09-05)


### Bug Fixes

* **icon:** remove timestamp from copied SVG of symbols [KMAPS-385] ([1019078](https://github.com/kelvininc/ui-components/commit/1019078da0399e3a95d153d6faf21d4faecfc413))


### Features

* **textfield:** add left slot to enable currency text ([b6c4096](https://github.com/kelvininc/ui-components/commit/b6c40967edac641495cb13add8b19b6be8ddd355))





# [0.10.0](https://github.com/kelvininc/ui-components/compare/v0.9.0...v0.10.0) (2022-08-30)


### Bug Fixes

* **range-date-select-dropdown:** change `selectedRangeDates` state type ([f7a1fae](https://github.com/kelvininc/ui-components/commit/f7a1faec542f431855808ed154c6c102866462bb))
* **select-widget:** change `onOptionChange` callback to handle selected options map ([23b4a53](https://github.com/kelvininc/ui-components/commit/23b4a53ef76c7fd9c6b1ec0c7b0fbad8143c7644))
* **select-widget:** transform selected options back to dictionary ([9d759fc](https://github.com/kelvininc/ui-components/commit/9d759fcfef27ba3512df4b5c18b33f824cebce73))


* feat(dropdown-group)!: add options groups to dropdown single and multi select ([f6d1bae](https://github.com/kelvininc/ui-components/commit/f6d1bae8931a5d74424156791c20542361bede8b))
* refactor(dropdown)!: rename `dropdown-list` to `select` ([42dd45b](https://github.com/kelvininc/ui-components/commit/42dd45b88b183550a39dd46f3c894a65acbc5297))
* feat(tooltip)!: add tooltip configs and change strategy to `fixed` ([8d03e3e](https://github.com/kelvininc/ui-components/commit/8d03e3e8571eb6e6e398d6202e976cbf77fa96d4))


### Features

* add file checksum to file name for caching purposes [KMAPS-385] ([393a5d6](https://github.com/kelvininc/ui-components/commit/393a5d6ac839fd526728237a31a08fe5405511d4))
* add slots to toaster component ([1ed0529](https://github.com/kelvininc/ui-components/commit/1ed0529e3904238fd469ef1ae60c887748ab905b))
* **advanced-date-input:** add advanced date input components ([2396f20](https://github.com/kelvininc/ui-components/commit/2396f200e10f080dbc91aa95e593682d5222aff1))
* **badge:** add `kv-badge` component ([994b077](https://github.com/kelvininc/ui-components/commit/994b07719b51cf65885644ff1dc621808fe83605))
* **breadcrumb-item:** enable breadcrumb label customization ([a52834e](https://github.com/kelvininc/ui-components/commit/a52834e665498a3044be32ca9b14d4139fe5f06c))
* **calendar:** add calendar base, selector and dropdown components ([29b4428](https://github.com/kelvininc/ui-components/commit/29b4428ba715988422f906f5a75529aef7c30c7e))
* **kv-schema-form:** add and integrate the react-jsonschema-form lib ([51e6044](https://github.com/kelvininc/ui-components/commit/51e60440f6b5cb95662ea8772203fdbd5e51aee1))
* **modal:** add modal component ([c0cabe9](https://github.com/kelvininc/ui-components/commit/c0cabe9eb48296606fad5353b1590cefaf3f9ddb))
* **range:** add new range component ([95de2a7](https://github.com/kelvininc/ui-components/commit/95de2a7d064b696272241f61d113f82464588f15))
* **select-option:** add bottom slot for content ([3b83b1e](https://github.com/kelvininc/ui-components/commit/3b83b1e912f631655ef59ce62e230ea77a821ba7))
* **toggle-tip:** toggle tip component ([52a7a23](https://github.com/kelvininc/ui-components/commit/52a7a23960c527a76bef34636a08b144cf70f24d))


### BREAKING CHANGES

* **advanced-date-input:** - `kv-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-single-select-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-multi-select-dropdown`: all `kv-text-field` related props are now passed though a `inputConfig` prop.
- `kv-tooltip`: the `allowed-positions` prop was removed and all position config are now passed though a `options` prop.
* In `kv-multi-select-dropdown` the `selectedOptions` props is now an object indexed by the option label.
* `dropdown-list` was renamed to `select` and `dropdown-list-item` was renamed to `select-option`
* `TooltipPosition` enum was renamed to `ETooltipPosition` for consistency reasons.





# [0.9.0](https://github.com/kelvininc/ui-components/compare/v0.8.0...v0.9.0) (2022-06-28)


### Bug Fixes

* **breadcrumb:** change breadcrumb style ([522d208](https://github.com/kelvininc/ui-components/commit/522d2081dbe8b2d1c5cbbda14b1430d2da3e70a0))
* **dropdown:** add proper documentation links and titles ([b6f5d1e](https://github.com/kelvininc/ui-components/commit/b6f5d1ef1bfecaa8901235241ed7f1d2738c4844))
* export toaster controller correctly and add datetime input type ([4f58e9a](https://github.com/kelvininc/ui-components/commit/4f58e9a4191a7609cfe410cc5d9dc69a6bff251c))


* feat(text-field)!: add min, max and step attributes ([507fd78](https://github.com/kelvininc/ui-components/commit/507fd78488ff211af29e7e7a9fc692c1f6da088c))


### Features

* **dropdown:** add single and multi select dropdown ([#73](https://github.com/kelvininc/ui-components/issues/73)) ([27ad7dd](https://github.com/kelvininc/ui-components/commit/27ad7dd9439bd2871d9356b011832f0be006a266))
* **text-field:** add input masking ([24a9407](https://github.com/kelvininc/ui-components/commit/24a94073bef9451bd33ac089f9fe9f05262ff05b))
* **toaster:** add `afterOpen` and `afterClose` callbacks ([b0eac6f](https://github.com/kelvininc/ui-components/commit/b0eac6f217505cd6bb7ea88cc0b904fe95f795ab))
* **tree-item:** add tree item component ([ea9bec9](https://github.com/kelvininc/ui-components/commit/ea9bec9cf7b771d53f805ddf16e6c0d72dfe2194))
* **tree:** add tree component ([88bf9f9](https://github.com/kelvininc/ui-components/commit/88bf9f9baba364ee370f8a78960b0ebec7088b1d))


### BREAKING CHANGES

* property for defining the maximum number of characters is now named `maxLength` instead of the previous `max` which now refers to the input maximum value





# [0.8.0](https://github.com/kelvininc/ui-components/compare/v0.7.0...v0.8.0) (2022-04-27)


### Bug Fixes

* **storybook:** apply changes from [#64](https://github.com/kelvininc/ui-components/issues/64) ([e2c551c](https://github.com/kelvininc/ui-components/commit/e2c551c0a2ce379a945354d7284ea18b954482b0))
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





# [0.7.0](https://github.com/kelvininc/ui-components/compare/v0.6.0...v0.7.0) (2022-03-16)


### Bug Fixes

* **storybook:** fix action button story names ([a6c27d8](https://github.com/kelvininc/ui-components/commit/a6c27d898610c4e90e1d6042ce07d74279d7e794))
* **storybook:** fix stories organization ([cfc85b1](https://github.com/kelvininc/ui-components/commit/cfc85b1d6da0c0ee561464fa42c9431dd9c6221f))


### Features

* **action-button:** add component ([101a020](https://github.com/kelvininc/ui-components/commit/101a0202fbe61b4b01fc6b6cb96b0d6240036f1a))
* add text-field into new structure ([84639ee](https://github.com/kelvininc/ui-components/commit/84639ee62b5e3f9912e3e8fdd06bc5647305fc27))
* **config:** add env configuration ([e29ebf2](https://github.com/kelvininc/ui-components/commit/e29ebf2c7ae0a67c38e5e2178211559317e9c2ec))
* create tooltip component ([8023fd6](https://github.com/kelvininc/ui-components/commit/8023fd64ce419ec19d16b32e58933cb9f13e3f10))
* **svg-icon:** add kv-custom-dashboard and kv-back icons ([1bff70a](https://github.com/kelvininc/ui-components/commit/1bff70a246211f41cd42f5c17d6c680a69ad1aa2))
* **svg-icon:** add svg icons ([4ab8510](https://github.com/kelvininc/ui-components/commit/4ab85109da71ab01b00065142f6f44f3ae3ceff8))
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


### Bug Fixes

* include assets in react build ([64dad8a](https://github.com/kelvininc/ui-components/commit/64dad8a3bcda688ceb6c939c48769bc94ce3632b))





## [0.5.2](https://github.com/kelvininc/ui-components/compare/v0.5.1...v0.5.2) (2022-02-25)

**Note:** Version bump only for package @kelvininc/react-ui-components





# 0.5.0 (2022-02-24)


### Bug Fixes

* **kv-colors:** add support for getting all colors via sass kv-colors function. ([d6bb1fd](https://github.com/kelvininc/ui-components/commit/d6bb1fd74893249a8f723abe17d16eeb4a1f8e51))
* **react-ui-components:** rollback webpack changes with babel core dependecy fix ([6351662](https://github.com/kelvininc/ui-components/commit/63516626118d4bd9980796a60f1c29d742986dc5))


### Features

* **kv-breadcrumb-trail:** add kv-breadcrumb-trail component ([f32229d](https://github.com/kelvininc/ui-components/commit/f32229d147a2c6a3b04500d5fffb86d6c77744a4))
* **kv-link:** add kv-link component ([3a038bc](https://github.com/kelvininc/ui-components/commit/3a038bc0a245c47ff61b7aaa7b4da2835ce3717c))
* **kv-loader:** implement loader component ([17c7ba8](https://github.com/kelvininc/ui-components/commit/17c7ba8bda9b693c1d7332bce3c6d02c090e3661))
* **kv-state-indicator:** implement state indicator component ([1799f1d](https://github.com/kelvininc/ui-components/commit/1799f1d68183fc0428c4521d0fd65ddae88e8a2e))
* **switch-button:** add component ([d29575f](https://github.com/kelvininc/ui-components/commit/d29575f86566077636af601f4f51482dcc7d7be7))