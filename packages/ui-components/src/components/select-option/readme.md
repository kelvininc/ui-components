# _<kv-select-option>_

<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';
import { KvSelectOption } from '@kelvininc/react-ui-components';
export const KvSelectOptionExample: React.FC = () => (
  <>
	{/*-- With all properties (only label and value are mandatory) --*/}
	<KvSelectOption
		label="Option 1"
		link="option1"
		selected={false}
		togglable={true}
		>
	</KvSelectOption>
  </>
);
```



## Properties

| Property               | Attribute                 | Description                                                                                | Type                                                                       | Default     |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------- |
| `action`               | `action`                  | (optional) Action to display on the right side of the item                                 | `ISelectOptionAction`                                                      | `undefined` |
| `customAttributes`     | `custom-attributes`       | (optional) Custom attributes to be applied to the option container element                 | `{ [x: string]: string; }`                                                 | `undefined` |
| `customClass`          | `custom-class`            | (optional) Custom class to apply for custom styling.                                       | `CssClassMap \| string \| string[]`                                        | `''`        |
| `customStyle`          | `custom-style`            | (optional) Additional style to apply for custom CSS.                                       | `{ [key: string]: string; }`                                               | `undefined` |
| `description`          | `description`             | (optional) Description of the item displayed on the right                                  | `string`                                                                   | `undefined` |
| `disabled`             | `disabled`                | (optional) If `true` the item is disabled                                                  | `boolean`                                                                  | `false`     |
| `heading`              | `heading`                 | (optional) If `true` the item is presented as a list heading. Default: `false`             | `boolean`                                                                  | `false`     |
| `highlighted`          | `highlighted`             | (optional) If `true` the item is highlighted                                               | `boolean`                                                                  | `false`     |
| `icon`                 | `icon`                    | (optional) Icon of the item displayed on the left                                          | `EIconName`                                                                | `undefined` |
| `iconTooltipText`      | `icon-tooltip-text`       | (optional) Tooltip text to be displayed on icon hover                                      | `string`                                                                   | `undefined` |
| `isDirty`              | `is-dirty`                | (optional) If true, a dirty dot indicator will be added to left side of the option's text. | `boolean`                                                                  | `false`     |
| `label` _(required)_   | `label`                   | (required) The text to display on the item                                                 | `string`                                                                   | `undefined` |
| `level`                | `level`                   | (optional) The level depth at which the option is rendered                                 | `number`                                                                   | `0`         |
| `rightIcon`            | `right-icon`              | (optional) Icon of the item displayed on the right                                         | `EIconName`                                                                | `undefined` |
| `rightIconTooltipText` | `right-icon-tooltip-text` | (optional) Tooltip text to be displayed on right icon hover                                | `string`                                                                   | `undefined` |
| `selectable`           | `selectable`              | (optional) If `false` the item is only for presenting and cannot be selected.              | `boolean`                                                                  | `true`      |
| `selected`             | `selected`                | (optional) If `true` the item is selected                                                  | `boolean`                                                                  | `false`     |
| `state`                | `state`                   | (optional) The toggle button state                                                         | `EToggleState.Indeterminate \| EToggleState.None \| EToggleState.Selected` | `undefined` |
| `togglable`            | `togglable`               | (optional) If `true` the item is togglable                                                 | `boolean`                                                                  | `false`     |
| `value` _(required)_   | `value`                   | (required) The item value                                                                  | `string`                                                                   | `undefined` |


## Events

| Event          | Description                              | Type                  |
| -------------- | ---------------------------------------- | --------------------- |
| `itemSelected` | Emitted when the user clicks on the item | `CustomEvent<string>` |


## Shadow Parts

| Part                      | Description                    |
| ------------------------- | ------------------------------ |
| `"checkbox"`              | The option's checkbox          |
| `"icon"`                  | The option's icon              |
| `"label"`                 | The option's label             |
| `"option-container"`      | The option's container         |
| `"select-option-content"` | The option's content container |


## CSS Custom Properties

| Name                                            | Description                                       |
| ----------------------------------------------- | ------------------------------------------------- |
| `--select-option-background-color`              | Select option background color.                   |
| `--select-option-background-color-highlighted`  | Select option background color when highlighted.  |
| `--select-option-background-color-hover`        | Select option background color when hovered.      |
| `--select-option-background-color-selected`     | Select option background color when selected.     |
| `--select-option-description-color`             | Select option description color.                  |
| `--select-option-description-color-highlighted` | Select option description color when highlighted. |
| `--select-option-description-color-hover`       | Select option description color when hover.       |
| `--select-option-description-color-selected`    | Select option description color when selected.    |
| `--select-option-height`                        | Select option height.                             |
| `--select-option-icon-size`                     | Select option icon size in pixels.                |
| `--select-option-label-color`                   | Select option label color.                        |
| `--select-option-label-color-highlighted`       | Select option label color when highlighted.       |
| `--select-option-label-color-hover`             | Select option label color when hover.             |
| `--select-option-label-color-selected`          | Select option label color when selected.          |
| `--select-option-transition-duration`           | Select option transition time.                    |


## Dependencies

### Used by

 - [kv-relative-time-picker](../relative-time-picker)
 - [kv-select-multi-options](../select-multi-options)

### Depends on

- [kv-checkbox](../checkbox)
- [kv-tooltip](../tooltip)
- [kv-icon](../icon)
- [kv-dirty-dot](../dirty-dot)
- [kv-action-button-icon](../action-button-icon)

### Graph
```mermaid
graph TD;
  kv-select-option --> kv-checkbox
  kv-select-option --> kv-tooltip
  kv-select-option --> kv-icon
  kv-select-option --> kv-dirty-dot
  kv-select-option --> kv-action-button-icon
  kv-checkbox --> kv-icon
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-dirty-dot --> kv-icon
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-icon
  kv-action-button-icon --> kv-badge
  kv-relative-time-picker --> kv-select-option
  kv-select-multi-options --> kv-select-option
  style kv-select-option fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


