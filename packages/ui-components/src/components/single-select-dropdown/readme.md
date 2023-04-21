# _<kv-single-select-dropdown>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<kv-single-select-dropdown
	placeholder="Select an option"
	label="Options"
	[icon]="EIconName.Layer"
	[options]="options"
	[selectedOption]="selectedOption">
</kv-single-select-dropdown>
```


### React

```tsx
import React from 'react';
import { KvSingleSelectDropdown } from '@kelvininc/react-ui-components';

export const KvSingleSelectDropdownExample: React.FC = (props) => (
  <>
    <KvSingleSelectDropdown 
		placeholder="Select an option"
		label="Options"
		icon={EIconName.Layer}
		options={props.options}
		selectedOption={props.selectedOption}>
	</KvSingleSelectDropdown>
  </>
);
```



## Properties

| Property               | Attribute                 | Description                                                   | Type                                                                          | Default                                    |
| ---------------------- | ------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ |
| `clearSelectionLabel`  | `clear-selection-label`   | (optional) The clear search action text                       | `string`                                                                      | `SINGLE_SELECT_CLEAR_SELECTION_LABEL`      |
| `disabled`             | `disabled`                | (optional) If `true` the dropdown is disabled                 | `boolean`                                                                     | `false`                                    |
| `displayValue`         | `display-value`           | (optional) The text to display on the dropdown                | `string`                                                                      | `undefined`                                |
| `errorState`           | `error-state`             | (required) The error state for the dropdown                   | `EValidationState.Invalid \| EValidationState.None \| EValidationState.Valid` | `EValidationState.None`                    |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered      | `ISingleSelectDropdownOptions`                                                | `undefined`                                |
| `helpText`             | `help-text`               | (optional) The text to display as help text                   | `string \| string[]`                                                          | `[]`                                       |
| `icon`                 | `icon`                    | (optional) The icon to display on the dropdown                | `EIconName \| EOtherIconName`                                                 | `undefined`                                |
| `inputSize`            | `input-size`              | (optional) The size of the input                              | `EComponentSize.Large \| EComponentSize.Small`                                | `EComponentSize.Large`                     |
| `isOpen`               | `is-open`                 | (optional) If `true` the list is opened                       | `boolean`                                                                     | `false`                                    |
| `label`                | `label`                   | (optional) The text to display on the dropdown label          | `string`                                                                      | `undefined`                                |
| `loading`              | `loading`                 | (optional) If `true` the list dropdown is loading             | `boolean`                                                                     | `false`                                    |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                          | `string`                                                                      | `undefined`                                |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                          | `string`                                                                      | `undefined`                                |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options      | `string`                                                                      | `SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE` |
| `options`              | --                        | (optional) The object with the dropdown options               | `ISingleSelectDropdownOptions`                                                | `{}`                                       |
| `placeholder`          | `placeholder`             | (optional) The text to display as the dropdown placeholder    | `string`                                                                      | `undefined`                                |
| `required`             | `required`                | (optional) If `true` dropdown requires a value to be selected | `boolean`                                                                     | `false`                                    |
| `searchPlaceholder`    | `search-placeholder`      | (optional) The list search text field placeholder             | `string`                                                                      | `undefined`                                |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable               | `boolean`                                                                     | `false`                                    |
| `selectedOption`       | `selected-option`         | (optional) The value of the selected option                   | `string`                                                                      | `undefined`                                |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared            | `boolean`                                                                     | `undefined`                                |


## Events

| Event              | Description                                  | Type                   |
| ------------------ | -------------------------------------------- | ---------------------- |
| `openStateChange`  | Emitted when the dropdown open state changes | `CustomEvent<boolean>` |
| `optionSelected`   | Emitted when the selected option change      | `CustomEvent<string>`  |
| `searchChange`     | Emitted when the search term changes         | `CustomEvent<string>`  |
| `selectionCleared` | Emitted when the selection is cleared        | `CustomEvent<void>`    |


## Shadow Parts

| Part       | Description                  |
| ---------- | ---------------------------- |
| `"option"` | The select option container. |


## CSS Custom Properties

| Name                    | Description                   |
| ----------------------- | ----------------------------- |
| `--dropdown-max-height` | Dropdown list maximum height. |


## Dependencies

### Used by

 - [kv-calendar-advanced-date-selector](../calendar-advanced-date-selector)
 - [kv-relative-time-picker](../relative-time-picker)

### Depends on

- [kv-select-group](../select-group)
- [kv-select-option](../select-option)
- [kv-dropdown](../dropdown)
- [kv-select](../select)

### Graph
```mermaid
graph TD;
  kv-single-select-dropdown --> kv-select-group
  kv-single-select-dropdown --> kv-select-option
  kv-single-select-dropdown --> kv-dropdown
  kv-single-select-dropdown --> kv-select
  kv-select-option --> kv-checkbox
  kv-checkbox --> kv-icon
  kv-dropdown --> kv-dropdown-base
  kv-dropdown --> kv-text-field
  kv-dropdown --> kv-icon
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-form-help-text
  kv-form-help-text --> kv-icon
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-calendar-advanced-date-selector --> kv-single-select-dropdown
  kv-relative-time-picker --> kv-single-select-dropdown
  style kv-single-select-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


