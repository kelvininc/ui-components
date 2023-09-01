# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.21.0](https://github.com/kelvininc/ui-components/compare/v0.20.0...v0.21.0) (2023-07-13)


### Bug Fixes

* **select-multi-options:** emit only selected options in map ([96c2349](https://github.com/kelvininc/ui-components/commit/96c2349fd06f78b06bc95746a653b352dda6469c))
* **typography:** add 1.5px letter-spacing on uppercase fonts ([8b7c085](https://github.com/kelvininc/ui-components/commit/8b7c08531f5879e43cd8147f02ebff159201bb83))


* fix(dropdown)!: update `kv-select-group` component style ([06d0b96](https://github.com/kelvininc/ui-components/commit/06d0b966e3f42aaf02ac081a5419e2e0240a4d9b))
* feat(labels-dropdown)!: add component ([aa3c48c](https://github.com/kelvininc/ui-components/commit/aa3c48c901696f2dce6685cd1cc2ac97718bf4a1))
* refactor(toggle-tip, dropdown)!: use portal to show floating content ([644ca7b](https://github.com/kelvininc/ui-components/commit/644ca7bd90c296c13b13588c8fc1faa762c56d90))


### Features

* **icons:** add kelvin-ai usage icons ([6822605](https://github.com/kelvininc/ui-components/commit/68226050e5ad22e034bd1c8fe2339c3c73a8f82e))
* **relative-time-picker:** reorder items in relative time picker default config ([992dbd3](https://github.com/kelvininc/ui-components/commit/992dbd3a3e590e553f32c09dab28479c89eb013c))
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

* **action-button:** remove ghost button flickering on hover ([d6c40fd](https://github.com/kelvininc/ui-components/commit/d6c40fde21a304b1c39d0b00f74abd6e75ec9eb4))
* **action-button:** remove padding around button due to loading animation ([1f62678](https://github.com/kelvininc/ui-components/commit/1f626784134243d3b98201ac8f71ebead67392d1))
* **icons:** replace entity-asset and entity-area icons ([5a53e22](https://github.com/kelvininc/ui-components/commit/5a53e22b4295d47ad4ba0b49ee6bc663f9b31608))
* **time-picker:** allow empty timezone state in props ([30b8884](https://github.com/kelvininc/ui-components/commit/30b8884b289290baa3952c37900f3831b9ca46b4))
* **time-picker:** show calendar state sync ([4ce2a5c](https://github.com/kelvininc/ui-components/commit/4ce2a5c4907e8604dc0d8dafecf29f81486c5468))
* **tooltip:** add tooltip floating content in body context ([437fb9e](https://github.com/kelvininc/ui-components/commit/437fb9ee1a8e7eb438669fe48461464a0b1b7166))


### Features

* **button:** add loading state ([ac6c73f](https://github.com/kelvininc/ui-components/commit/ac6c73fb348b372a3d6dc69d67a0e030fb7d0eab))
* **icons:** add data explorer and applications icons ([c392f89](https://github.com/kelvininc/ui-components/commit/c392f8964a2222e8b838543e177278ff439730c6))
* **text-area:** add component ([11b1e5a](https://github.com/kelvininc/ui-components/commit/11b1e5a679dc0602a4c84142c13a8cc8bf73311f))





# [0.19.0](https://github.com/kelvininc/ui-components/compare/v0.18.0...v0.19.0) (2023-05-05)


### Bug Fixes

* **relative-time-picker:** add default timezone to prevent firefox errors on relative time options list ([c48a15e](https://github.com/kelvininc/ui-components/commit/c48a15e5fcfc27cf096d37b9515c4a52d2033de3))
* **time-picker:** sync initial view with show calendar toggle state ([d74f6e5](https://github.com/kelvininc/ui-components/commit/d74f6e5cc1a80c26c506471626013112ab52475c))


### Features

* **icons:**  add log and telemetry icons ([152315b](https://github.com/kelvininc/ui-components/commit/152315b410c655dfcb0c37b313948465e5f61580))
* **range:** add optional min and max labels and fix some styles ([1d8ed6b](https://github.com/kelvininc/ui-components/commit/1d8ed6b75e8970d7a26f9d38d5070ceb35fa12f2))
* **wizard:** allow configure the header and footer height ([a43ff2f](https://github.com/kelvininc/ui-components/commit/a43ff2f7be1674b9fe0543e18db97a3719bd0e83))





# [0.18.0](https://github.com/kelvininc/ui-components/compare/v0.17.0...v0.18.0) (2023-04-21)


### Bug Fixes

* **action-button:** remove unwanted right border [KMAPS-884] ([#270](https://github.com/kelvininc/ui-components/issues/270)) ([e23814c](https://github.com/kelvininc/ui-components/commit/e23814c5123a9bbb243c2e9b68f3f426c6319a72))
* **copy-to-clipboard:** change component behavior on hover and minor updates ([763fac4](https://github.com/kelvininc/ui-components/commit/763fac4f9eeee14eb92d932dc6f9c67bbdce730c))
* **help-text:** change help-text label color to match DS ([36a44bf](https://github.com/kelvininc/ui-components/commit/36a44bffaecf19737d6cef9793d1f271fc3fd2c9))
* **modal:** enable style customization on modal component ([cf49632](https://github.com/kelvininc/ui-components/commit/cf4963253e87ba3681fc694ab6a206591beca5ea))
* **modal:** set correct topbar height ([b5723d6](https://github.com/kelvininc/ui-components/commit/b5723d6aee65f609f9ff6a5d40c40fa96f140efb))
* **single-select-dropdown:** update icon size [KMAPS-910] ([#276](https://github.com/kelvininc/ui-components/issues/276)) ([24e9293](https://github.com/kelvininc/ui-components/commit/24e9293b1707115bdddf5fac2a89fce657065339))
* **tag-status:** update tag status style ([d7ad25b](https://github.com/kelvininc/ui-components/commit/d7ad25b7a63bd9a5b8013e348fa8e19047528168))
* **toggletip:** stop click event propagation ([404c668](https://github.com/kelvininc/ui-components/commit/404c6686878c6d80e154407865e7e95b47ac3a29))
* **tooltip:** fix tooltip action width calculation when text is ellipsis ([#273](https://github.com/kelvininc/ui-components/issues/273)) ([3ca743c](https://github.com/kelvininc/ui-components/commit/3ca743c009af7a86e8242610f1def4a60eac7adf))


* fix(typography)!: update typography mixins according to DS ([25080af](https://github.com/kelvininc/ui-components/commit/25080af8fc458feba3055fa33e946ac23b81b2f5))


### Features

* **absolute-time-picker:** add new absolute time picker component ([5e51363](https://github.com/kelvininc/ui-components/commit/5e513639ffbabe52a7c0b2afd5733bf3411f1411))
* **action-button:** update design ([#249](https://github.com/kelvininc/ui-components/issues/249)) ([f66cfa3](https://github.com/kelvininc/ui-components/commit/f66cfa3d13fb507206002e7fa0c044551c43d713))
* **copy-to-clipboard:** add component ([3684505](https://github.com/kelvininc/ui-components/commit/36845053165093f19d4add294ea28a8df1c0ec06))
* **description-list:** add component ([054df2d](https://github.com/kelvininc/ui-components/commit/054df2df6284d4c9421afadf15bfe7fbdaaf3916))
* **description-list:** support toggletip container styling from outside ([bdbf655](https://github.com/kelvininc/ui-components/commit/bdbf6553521aef4d60f478464bfdf900f4ae4227))
* **dropdown:** add input size configuration ([a251610](https://github.com/kelvininc/ui-components/commit/a251610bc35448b67c105940d1146c8d031a3799))
* expose utils ([f2a4885](https://github.com/kelvininc/ui-components/commit/f2a4885975aeaeba7dd44e1473d2d71a85a05b18))
* **icon:** add new icons ([#264](https://github.com/kelvininc/ui-components/issues/264)) ([cd94c32](https://github.com/kelvininc/ui-components/commit/cd94c3243a153d7e87bc4add71a8645e6fbfa16f))
* **icons:** add settings and pin icons ([1e45036](https://github.com/kelvininc/ui-components/commit/1e450364e712fade08e433a3001ca75983231d9c))
* **radio-list:** add component ([9d465b6](https://github.com/kelvininc/ui-components/commit/9d465b67e5cc89b919d4d1386c8ce594967a5da2))
* **relative-time-picker:** new relative time picker component ([9bacb89](https://github.com/kelvininc/ui-components/commit/9bacb898155ab861c9a4fb152f1472fd7670d6e0))
* **tag-status:** add custom css properties to tag status style ([221862d](https://github.com/kelvininc/ui-components/commit/221862df86242859865532eb46efd469c99ac88b))
* **time-range:** add new time range picker component ([a6042ca](https://github.com/kelvininc/ui-components/commit/a6042ca8c92ecad81b6838e5160f8dee6cd0db36))


### BREAKING CHANGES

* 'kv-font-h3-regular' and 'kv-font-label-medium-light' mixins were removed





# [0.17.0](https://github.com/kelvininc/ui-components/compare/v0.16.0...v0.17.0) (2023-03-10)


### Bug Fixes

* **action-button-text:** fix text font ([cecf730](https://github.com/kelvininc/ui-components/commit/cecf730ef8d8a3f33dbf13f77cd0d6c6f36db1d8))
* add storybook build to CI ([711fa3e](https://github.com/kelvininc/ui-components/commit/711fa3ea7e1026f1e2c17d40ea4eafef449f979a))
* **calendar:** split dropdowns open state changes into multiple events ([4f64475](https://github.com/kelvininc/ui-components/commit/4f64475f1230a08cb9feec9aa27be19e1f26652b))
* **colors:** fix light/dark color codes ([53d8b0a](https://github.com/kelvininc/ui-components/commit/53d8b0a677431356375021dff20fb407aa03f8be))
* **dropdown:** add missing flip middleware ([1e1509e](https://github.com/kelvininc/ui-components/commit/1e1509e5761597c78412510e5f54cce52590c748))
* **dropdown:** Change dropdown list default width to be the same as its action ([#240](https://github.com/kelvininc/ui-components/issues/240)) ([725ce66](https://github.com/kelvininc/ui-components/commit/725ce667a37c0c33e69fe17af9e403287dc0062b))
* **dropdown:** fix position where the dropdown-list is open ([#255](https://github.com/kelvininc/ui-components/issues/255)) ([1f0b0ef](https://github.com/kelvininc/ui-components/commit/1f0b0efdb3a45b155a0e1acc57028c0fa6e28382))
* **search:** fix clean search ([b14ab79](https://github.com/kelvininc/ui-components/commit/b14ab79f8798686c45650babc22b54ba0f9bdbd6))
* **switch-button:** align svg inside toggle button ([42fdd8e](https://github.com/kelvininc/ui-components/commit/42fdd8eeaa93005d46731faa386bf54f591672ca))
* **switch-button:** replace label with slots ([c63ce86](https://github.com/kelvininc/ui-components/commit/c63ce8626bdea144a4164c6518504d266b62ffd5))
* **tag-status, toaster, tree-item:** add white background to icon when state is success error or info ([7b74fbf](https://github.com/kelvininc/ui-components/commit/7b74fbfde18b6fdf89cec7c1a0b955f102f276c1))
* **toaster:** fix toaster aspect and position ([6879585](https://github.com/kelvininc/ui-components/commit/68795856cf9068f558868211b5e55b0b58eb0ba2))
* **tooltip:** protect code when tooltip text is empty ([a75c2b0](https://github.com/kelvininc/ui-components/commit/a75c2b07390e5a28df446057f4c1eb21b002c1fb))
* **wizard-header:** change text and separator color ([fd535aa](https://github.com/kelvininc/ui-components/commit/fd535aac09c974c6dd47d22fa59d64f6060368c4))


* fix(modal)!: click outside behavior can now be customized ([55d2a29](https://github.com/kelvininc/ui-components/commit/55d2a2982c57cc79fa0696403a551f4480e74e60))


### Features

* **alert:** add component ([355f046](https://github.com/kelvininc/ui-components/commit/355f04612787fb794cf5975f0a2a70aa34704f0a))
* **dropdown-base:** add top and bottom spacing ([#250](https://github.com/kelvininc/ui-components/issues/250)) ([57ff14a](https://github.com/kelvininc/ui-components/commit/57ff14a8236e70d0bdb15557105ce4baecab0d81))
* **dropdown:** add `disabled` prop ([8828615](https://github.com/kelvininc/ui-components/commit/88286153ca09451d976971a5b362b5b820ac45a2))
* **icon:** add close circle ([a3cc70d](https://github.com/kelvininc/ui-components/commit/a3cc70d992cbb8c8cdb6e15ef85d3f2cb1b45942))
* **icon:** add do not disturb on circle and update add cross circle ([#244](https://github.com/kelvininc/ui-components/issues/244)) ([16b47c5](https://github.com/kelvininc/ui-components/commit/16b47c5fa26ee81ebb6093b85e99b8b0add9148a))
* **icon:** add download bucket icon ([0cefd0d](https://github.com/kelvininc/ui-components/commit/0cefd0daff1dfae5ed2a2206b34e14c02671bad0))
* **single-select-dropdown:** allow clear selected item in single-select-dropdown ([#252](https://github.com/kelvininc/ui-components/issues/252)) ([faad5e5](https://github.com/kelvininc/ui-components/commit/faad5e5da988a59b328bb628aa39ee9644611203))
* **tooltip:** add white space variable to tooltip configurable css properties ([06b899b](https://github.com/kelvininc/ui-components/commit/06b899b3ab90650a2004052d9ca473725fc386f6))
* **wizard-footer:** add component ([c782eb6](https://github.com/kelvininc/ui-components/commit/c782eb6eaa6ffc1c462b01f7f87d5f80ab872867))
* **wizard-header:** add component ([7c7daa2](https://github.com/kelvininc/ui-components/commit/7c7daa289588505665a7745c5970656438ef27bc))
* **wizard:** add wizard component ([6c1421f](https://github.com/kelvininc/ui-components/commit/6c1421fb9edf6be9235354190fa61445f2771067))


### BREAKING CHANGES

* `closable` was removed, to replicate the previous behavior set `closeOnOverlayClick` and `showCloseButton` to false.





# [0.16.0](https://github.com/kelvininc/ui-components/compare/v0.15.0...v0.16.0) (2023-01-27)


### Bug Fixes

* **multi-select-dropdown:** ensure options are neither nil nor empty ([f7d551e](https://github.com/kelvininc/ui-components/commit/f7d551ee854f922377d639b95b8b37895ad95cb5))


### Features

* add view column icons ([a0fcb23](https://github.com/kelvininc/ui-components/commit/a0fcb236ce23b0826053232e6ca3f702e97b9913))
* **checkbox:** add `kv-checkbox` component ([359687f](https://github.com/kelvininc/ui-components/commit/359687f8aafc04aad2e07e0690d32b55d5b90d2a))
* **icon:** add connection icon ([1b968a0](https://github.com/kelvininc/ui-components/commit/1b968a07b6d63e64ab6226188f8c85083087d385))





# [0.15.0](https://github.com/kelvininc/ui-components/compare/v0.14.0...v0.15.0) (2023-01-24)


### Bug Fixes

* **action-button-icon:** remove height offset ([da025fa](https://github.com/kelvininc/ui-components/commit/da025fa6b84c4184f40e11959e0d1aeffb10db77))
* **illustration:** change size to max size ([#203](https://github.com/kelvininc/ui-components/issues/203)) ([91f4df9](https://github.com/kelvininc/ui-components/commit/91f4df981e2b731e7f4ae04783c5211f0959a934))
* **multi-select-dropdown:** add empty check to options ([0f24d64](https://github.com/kelvininc/ui-components/commit/0f24d64643304e2995573ebf55fd39dcd9e3c472))


* fix(tag-status)!: replace tag status props to expand functionallity ([beec9c8](https://github.com/kelvininc/ui-components/commit/beec9c8368d9db0f242b23ea4708a9578d3ae711))


### Features

* **icon:** add new icons ([f6d379a](https://github.com/kelvininc/ui-components/commit/f6d379a75f46829a74e5d0c495349d7fb4d0a36c))
* **tag-alarm:** add new tag alarm component ([62d2b41](https://github.com/kelvininc/ui-components/commit/62d2b419d9c853198ee6197ee94e5cac6c784906))


### BREAKING CHANGES

* replaces the previous prop 'type' by 'state' to specify the color of the icon, 'icon' to specify the icon to be displayed and 'label' (optional) to define the text.





# [0.14.0](https://github.com/kelvininc/ui-components/compare/v0.13.0...v0.14.0) (2023-01-05)


### Bug Fixes

* **dropdown:** add `filteredOptions` to select dropdowns ([e986322](https://github.com/kelvininc/ui-components/commit/e9863224a0390aa17d1f07efeec93ce64c5ed82e))
* **kv-icon:** remove height offset from icon and add new tag component ([b618cbf](https://github.com/kelvininc/ui-components/commit/b618cbf5e2660ed19428c7e3e7ade3b2f6c86907))
* **textfield:** allow 0 as default numeric type input ([729d4b2](https://github.com/kelvininc/ui-components/commit/729d4b23ede9381f9788a00d86669c713149e89e))
* **textfield:** remove placeholder from inputmask configuration ([397ec9c](https://github.com/kelvininc/ui-components/commit/397ec9ca41e482279042bd20af03cc3c8a7d6b88))


* feat(schema-form)!: updates rjsf dependency to allow validating dependencies in dates and times. ([4c30faf](https://github.com/kelvininc/ui-components/commit/4c30faf9abd3d74f6c50dce5b783c087c0744d6d))
* feat(radio-button)!: add icon to radio button ([5fdfdf8](https://github.com/kelvininc/ui-components/commit/5fdfdf896ab74edcaee314755ee1fb949fd5f7d4))


### Features

* enable customize dropdowns height with props ([a19ddd9](https://github.com/kelvininc/ui-components/commit/a19ddd91f4ad84edd449ab96a4ecf3ed5f05bd28))
* **icons:** add more icons to svg-symbols ([b006039](https://github.com/kelvininc/ui-components/commit/b0060399576c8b80ea6e76bafb4b7b2639756831))
* **icons:** add order hover icon ([0cba530](https://github.com/kelvininc/ui-components/commit/0cba530359b8c427011e3bb99aaf26e10f96c989))
* **schema-form:** add date and email input widgets ([3398f88](https://github.com/kelvininc/ui-components/commit/3398f88ea7f18f688b366988abe60f839b12e105))
* **schema-form:** add scroll style on form ([ec90a63](https://github.com/kelvininc/ui-components/commit/ec90a63c88a2ac5989c63baa01048305ce7fc15a))
* **schema-form:** add searchable behaviour to select widget ([5e113f1](https://github.com/kelvininc/ui-components/commit/5e113f141d6116c1992db22abdad6aa3105b5bb0))
* **status:** add new status tag component ([#199](https://github.com/kelvininc/ui-components/issues/199)) ([c8e71ab](https://github.com/kelvininc/ui-components/commit/c8e71ab7df24808ae986c36bb1aadd49608c0245))
* **tooltip:** add default delay to tooltip ([#193](https://github.com/kelvininc/ui-components/issues/193)) ([f8b9128](https://github.com/kelvininc/ui-components/commit/f8b9128481c3d55c698752878a9acf3f577a7895))
* **tooltip:** add fade in/out animation to tooltip ([#197](https://github.com/kelvininc/ui-components/issues/197)) ([eb57522](https://github.com/kelvininc/ui-components/commit/eb5752218eed5d5e7c3f03734aec8f4e269cdd6d))
* **tooltip:** add white space normal ([efc7df3](https://github.com/kelvininc/ui-components/commit/efc7df3fbad1f14c24e86a2e1245482efed945b5))
* **tooltip:** only display tooltip when string is ellipsed ([#189](https://github.com/kelvininc/ui-components/issues/189)) ([fe7764e](https://github.com/kelvininc/ui-components/commit/fe7764ed1695fba29d9e1e8697ebfbf7db9e41e7))


### Performance Improvements

* **illustrations:** generate illustrations in build time ([#148](https://github.com/kelvininc/ui-components/issues/148)) ([87808f6](https://github.com/kelvininc/ui-components/commit/87808f69c942348e2537e7c94a2e25edd1989bcc))


### BREAKING CHANGES

* showErrorList now accepts 'top' 'bottom' or false only.
* label property is now optional and value is required





# [0.13.0](https://github.com/kelvininc/ui-components/compare/v0.12.0...v0.13.0) (2022-10-06)


### Bug Fixes

* **action-button:** add missing active property ([0d0011d](https://github.com/kelvininc/ui-components/commit/0d0011d62fb5a77b2d14c2df1b692ecfdfaa1590))
* add custom scroll to timezone select [KMAPS-454] ([d4a0bd7](https://github.com/kelvininc/ui-components/commit/d4a0bd722f1d215eb2bb8769fd8b6d35bee8fc48))
* correct default timezone search placeholder [KMAPS-455] ([#158](https://github.com/kelvininc/ui-components/issues/158)) ([f837f3f](https://github.com/kelvininc/ui-components/commit/f837f3f9a996bd356c6c351e6d8dbcb290b2e230))
* correct packages' author name ([20ea3a3](https://github.com/kelvininc/ui-components/commit/20ea3a3bb0449fe5739b6e7ff93255d846a6eeb1))
* **dropdown-base:** Remove positions of dropdown-base ([37e389b](https://github.com/kelvininc/ui-components/commit/37e389b63e50532251a8ef3e9b42b2eb41745d41))
* move tab items tab navigation [KMAPS-493] ([31c308f](https://github.com/kelvininc/ui-components/commit/31c308f749cfe84f40e65c026244541821afd77f))
* **range:** add offset to the input value ([7b19f10](https://github.com/kelvininc/ui-components/commit/7b19f109e114195ace4bba2e9944bb39e2819531))
* remove state manipulations inside dropdown element ([00e84cb](https://github.com/kelvininc/ui-components/commit/00e84cb85c21d1b8b5ad1ba887592b96534d8571))
* **single-select-dropdown:** stop opening options when is disabled ([6135c44](https://github.com/kelvininc/ui-components/commit/6135c44c314f19445c6a64ee547edd32d7088ffa))
* **text-field:** remove 0 default value on numeric inputs [KMAPS-516] ([e0f9d32](https://github.com/kelvininc/ui-components/commit/e0f9d32c7e95be542ba75a5cae2fc50e374bc21b))
* **text-field:** remove placeholder 0 on type numeric on hover or focus ([12c72d4](https://github.com/kelvininc/ui-components/commit/12c72d4b65537ebb22195f756b9c9915fca9f640))
* **tooltip:** check if child is null before removeEventListners [KMAPS-532] ([b3255ec](https://github.com/kelvininc/ui-components/commit/b3255ecd2e0ee008ab524f6d4d3cd066884b4622))
* **tree-dropdown:** align child icons [KMAPS-426] ([9538259](https://github.com/kelvininc/ui-components/commit/953825958cdfe69128c2bd468fb7428502522e52))


### Features

* add dropdown tree component [KMAPS-423] ([bfa8540](https://github.com/kelvininc/ui-components/commit/bfa8540986961d174f3bd4561eddd5914393a150))
* **illustrations:** add kelvin logotype in light and night versions [KMAPS-426] ([bf7e872](https://github.com/kelvininc/ui-components/commit/bf7e872083c98242c3e5bf23eb5a0c179af80293))
* **tooltip:** add delay before show text [KMAPS-523] ([f4c3496](https://github.com/kelvininc/ui-components/commit/f4c3496ac0dd636ea2e8a2c903b9d8459a60d791))
* **tooltip:** add disable behaviour ([869141a](https://github.com/kelvininc/ui-components/commit/869141a119daad7f1ca7a7629010ab9379da4315))
* **tree-dropdown:** add bold to dropdown when child is selected [KMAPS-426] ([72016b6](https://github.com/kelvininc/ui-components/commit/72016b6d7738ced5c5b5ad05dfb5cf342c1ac221))
* **tree-dropdown:** add border to improve UI ([b019fbd](https://github.com/kelvininc/ui-components/commit/b019fbde7babedd3232826729f5025ba14883ff0))
* **tree-dropdown:** add tooltip to label [KMAPS-522,KMAPS-523] ([04f3d82](https://github.com/kelvininc/ui-components/commit/04f3d822ed45145e4f8700d765cc655d83339e74))
* **tree-dropdown:** change arrow icon to collapse arrow [KMAPS-426] ([32593d1](https://github.com/kelvininc/ui-components/commit/32593d1747394919eeac8463f1047802eca28a36))
* **tree-dropdown:** make font size 14px [KMAPS-426] ([e1b4866](https://github.com/kelvininc/ui-components/commit/e1b486611e0cac37de467fff4257733083d64e59))
* **tree-dropdown:** make icons 20x20px [KMAPS-426] ([100be4c](https://github.com/kelvininc/ui-components/commit/100be4c8a91ac6b4538924a560a5e0daa99775ad))





# [0.12.0](https://github.com/kelvininc/ui-components/compare/v0.11.0...v0.12.0) (2022-09-13)


### Bug Fixes

* **advanced-date-select:** return relative time by timezone ([370ac03](https://github.com/kelvininc/ui-components/commit/370ac0362200448c95dcc828a5c8c7e488bb5296))


### Features

* **advanced calendar:** add start/end date format config [KMAPS-437] ([c1da23c](https://github.com/kelvininc/ui-components/commit/c1da23cfe5d49871f869bc9e1c58d9c27fa1217b))





# [0.11.0](https://github.com/kelvininc/ui-components/compare/v0.10.0...v0.11.0) (2022-09-05)


### Bug Fixes

* **radio-button:** correct ellipses on radio button [KMAPS-384] ([#141](https://github.com/kelvininc/ui-components/issues/141)) ([231cba8](https://github.com/kelvininc/ui-components/commit/231cba8b6ecdb26786366f46a42d461965ee0cef))


### Features

* **textfield:** add left slot to enable currency text ([b6c4096](https://github.com/kelvininc/ui-components/commit/b6c40967edac641495cb13add8b19b6be8ddd355))





# [0.10.0](https://github.com/kelvininc/ui-components/compare/v0.9.0...v0.10.0) (2022-08-30)


### Bug Fixes

* **action button:** remove focus height & width 100% ([a483aa8](https://github.com/kelvininc/ui-components/commit/a483aa8864f8d8f4746cd84995851be213a89be8))
* **action-button:** change box-sizing to border-box to include the border size in the defined height ([4c1a4b1](https://github.com/kelvininc/ui-components/commit/4c1a4b1ef3bdd4de5aa546733f2765dd506a14fe))
* calculate tab selection animation ([f3b4824](https://github.com/kelvininc/ui-components/commit/f3b4824061995797d25ffeebaf7df8e16fc553fa))
* **dropdown:** Add fallbackPlacements ([0f145c5](https://github.com/kelvininc/ui-components/commit/0f145c5b5cec6253ba8b227e940d6a74eac6e3ab))
* **dropdown:** fix check for click outside fuction ([0b37eb1](https://github.com/kelvininc/ui-components/commit/0b37eb1e817087ad6131a1d7f5bd48a8c9195491))
* **kv-dropdown:** allows to open dropdown list at the top if  there is no space available at the bottom ([a3f1386](https://github.com/kelvininc/ui-components/commit/a3f13863d788cacdd8b9c0d601512b624947ea93))
* **kv-tab-list:** add bottom divider ([0e0b62e](https://github.com/kelvininc/ui-components/commit/0e0b62e325755145c64b6b904a0662fe92225b91))
* move prevent defaults to outside throttler ([9629325](https://github.com/kelvininc/ui-components/commit/9629325506bb9a01167ea4fa079e2a2b2fe074c1))
* **multi-select-dropdown:** emit new object with new selected options ([3a1613a](https://github.com/kelvininc/ui-components/commit/3a1613a053aa0f1f5a0b50847a0537c15dcf38bc))
* **radio-button:** remove pointer-events when disabled ([f878d05](https://github.com/kelvininc/ui-components/commit/f878d055a01fc550c7e2b78b2aa9758e78420664))
* **range-date-select-dropdown:** change `selectedRangeDates` state type ([f7a1fae](https://github.com/kelvininc/ui-components/commit/f7a1faec542f431855808ed154c6c102866462bb))
* remove lint warnings ([#137](https://github.com/kelvininc/ui-components/issues/137)) ([a469238](https://github.com/kelvininc/ui-components/commit/a46923805222b8e565fd8761b443ef8291fc4890))
* remove overflow from tab navigation ([39806f4](https://github.com/kelvininc/ui-components/commit/39806f411693747c2cacfd58ff04e66b57daf409))
* **text-field:** add numeric input mask ([f8cde22](https://github.com/kelvininc/ui-components/commit/f8cde2282f266eae2d28d043bf7ebb972cfb3f3d))
* **text-field:** add string type to min and max attributes ([00ce264](https://github.com/kelvininc/ui-components/commit/00ce2646117b4a9abbf9ed0b7709d883606b06dc))
* **text-field:** change  event to be emitted only on keyboard input ([1170e22](https://github.com/kelvininc/ui-components/commit/1170e229f4eca5d26b3b8736c3f826f4c37b0656))
* **tree-item:** export parts to enable icon css customization ([139318f](https://github.com/kelvininc/ui-components/commit/139318f94b3f2e19097ab225586eb6ade0f88017))
* **ui-components:** fix action button border ([fd5c42d](https://github.com/kelvininc/ui-components/commit/fd5c42d31b584ae90068b7ab27b3174aa3604700))


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
* **radio-button:** add anchor attributes to radio button ([48ff38e](https://github.com/kelvininc/ui-components/commit/48ff38ef2c3e545d3ad112ec13bcdd03ce378e1b))
* **range:** add new range component ([95de2a7](https://github.com/kelvininc/ui-components/commit/95de2a7d064b696272241f61d113f82464588f15))
* **select-option:** add bottom slot for content ([3b83b1e](https://github.com/kelvininc/ui-components/commit/3b83b1e912f631655ef59ce62e230ea77a821ba7))
* **toggle-tip:** toggle tip component ([52a7a23](https://github.com/kelvininc/ui-components/commit/52a7a23960c527a76bef34636a08b144cf70f24d))
* **tree-item:** change tree-item to be an anchor element ([986b473](https://github.com/kelvininc/ui-components/commit/986b47318927307c7351b2d068a075ab67eb8401))
* **tree:** add metadata property to type ITreeNodeItem and fixed hover styles ([7d73367](https://github.com/kelvininc/ui-components/commit/7d733675639c575646acf4042b92a6053d99270b))


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