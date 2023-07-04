# *<kv-multi-select-dropdown>*



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<kv-multi-select-dropdown
	placeholder="Select an option"
	label="Options"
	[icon]="EIconName.Layer"
	[options]="options"
	[selectedOptions]="selectedOptions"
	searchable=true
	selectionClearable=true>
</kv-multi-select-dropdown>
```


### React

```tsx
import React from 'react';
import { KvMultiSelectDropdown } from '@kelvininc/react-ui-components';

export const KvMultiSelectDropdownExample: React.FC = (props) => (
  <>
    <KvMultiSelectDropdown 
		placeholder="Select an option"
		label="Options"
		icon={EIconName.Layer}
		options={props.options}
		selectedOptions={props.selectedOptions}
		searchable
		selectionClearable>
	</KvMultiSelectDropdown>
  </>
);
```



## Properties

| Property               | Attribute                 | Description                                                                                                                                                                             | Type                                                                          | Default                                   |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| `clearSelectionLabel`  | `clear-selection-label`   | (optional) The clear search action text                                                                                                                                                 | `string`                                                                      | `undefined`                               |
| `customClass`          | `custom-class`            | (optional) Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. It is also valid to provide CssClassMap with boolean logic. | `CssClassMap \| string \| string[]`                                           | `''`                                      |
| `disabled`             | `disabled`                | (optional) If `true` the dropdown is disabled                                                                                                                                           | `boolean`                                                                     | `undefined`                               |
| `displayValue`         | `display-value`           | (optional) The text to display on the dropdown                                                                                                                                          | `string`                                                                      | `undefined`                               |
| `errorState`           | `error-state`             | (required) The error state for the dropdown                                                                                                                                             | `EValidationState.Invalid \| EValidationState.None \| EValidationState.Valid` | `undefined`                               |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered                                                                                                                                | `IMultiSelectDropdownOptions`                                                 | `{}`                                      |
| `helpText`             | `help-text`               | (optional) The text to display as help text                                                                                                                                             | `string \| string[]`                                                          | `[]`                                      |
| `icon`                 | `icon`                    | (optional) The icon to display on the dropdown                                                                                                                                          | `EIconName \| EOtherIconName`                                                 | `undefined`                               |
| `inputSize`            | `input-size`              | (optional) The size of the input                                                                                                                                                        | `EComponentSize.Large \| EComponentSize.Small`                                | `EComponentSize.Large`                    |
| `label`                | `label`                   | (optional) The text to display on the dropdown label                                                                                                                                    | `string`                                                                      | `undefined`                               |
| `loading`              | `loading`                 | (optional) If `true` the dropdown is loading                                                                                                                                            | `boolean`                                                                     | `false`                                   |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                                                                                                                                                    | `string`                                                                      | `undefined`                               |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                                                                                                                                                    | `string`                                                                      | `undefined`                               |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options                                                                                                                                | `string`                                                                      | `MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE` |
| `options`              | --                        | (optional) The object with the dropdown options                                                                                                                                         | `IMultiSelectDropdownOptions`                                                 | `{}`                                      |
| `placeholder`          | `placeholder`             | (required) The text to display as the dropdown placeholder                                                                                                                              | `string`                                                                      | `undefined`                               |
| `required`             | `required`                | (optional) If `true` dropdown requires a value to be selected                                                                                                                           | `boolean`                                                                     | `undefined`                               |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable                                                                                                                                         | `boolean`                                                                     | `undefined`                               |
| `selectedOptions`      | --                        | (optional) The object with indexed by the dropdown labels and its selected value                                                                                                        | `{ [x: string]: boolean; }`                                                   | `{}`                                      |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared                                                                                                                                      | `boolean`                                                                     | `undefined`                               |


## Events

| Event              | Description                                  | Type                                     |
| ------------------ | -------------------------------------------- | ---------------------------------------- |
| `openStateChange`  | Emitted when the dropdown open state changes | `CustomEvent<boolean>`                   |
| `optionsSelected`  | Emitted when the selected options change     | `CustomEvent<{ [x: string]: boolean; }>` |
| `searchChange`     | Emitted when the search term changes         | `CustomEvent<string>`                    |
| `selectionCleared` | Emitted when the selection is cleared        | `CustomEvent<void>`                      |


## CSS Custom Properties

| Name                    | Description                   |
| ----------------------- | ----------------------------- |
| `--dropdown-max-height` | Dropdown list maximum height. |


## Dependencies

### Depends on

- [kv-dropdown](../dropdown)
- [kv-select-multi-options](../select-multi-options)

### Graph
```mermaid
graph TD;
  kv-multi-select-dropdown --> kv-dropdown
  kv-multi-select-dropdown --> kv-select-multi-options
  kv-dropdown --> kv-dropdown-base
  kv-dropdown --> kv-text-field
  kv-dropdown --> kv-icon
  kv-dropdown-base --> kv-portal
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-select-multi-options --> kv-select-group
  kv-select-multi-options --> kv-select-option-multi-level
  kv-select-multi-options --> kv-select
  kv-select-multi-options --> kv-select-option
  kv-select-option-multi-level --> kv-select-option
  kv-select-option-multi-level --> kv-select-option-multi-level
  kv-select-option --> kv-checkbox
  kv-checkbox --> kv-icon
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  style kv-multi-select-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


