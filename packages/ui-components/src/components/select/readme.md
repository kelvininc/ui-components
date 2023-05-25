# _<kv-select>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<kv-select searchable=true selectionClearable=true>
	<kv-select-option
		label="Option 1"
		value="option1"
		togglable=true>
	</kv-select-option>
	...
	<kv-select-option
		label="Option 3"
		value="option3"
		togglable=true>
	</kv-select-option>
</kv-select>
```


### React

```tsx
import React from 'react';
import { KvSelect } from '@kelvininc/react-ui-components';

export const KvSelectExample: React.FC = () => (
  <>
    <KvSelect searchable={true} selectionClearable={true}>
		<KvSelectOption
			label="Option 1"
			value="option1"
			togglable={true}>
		</KvSelectOption>
		<KvSelectOption
			label="Option 3"
			value="option3"
			togglable={true}>
		</KvSelect>
	</KvSelect>
  </>
);
```



## Properties

| Property                | Attribute                 | Description                                                       | Type      | Default                        |
| ----------------------- | ------------------------- | ----------------------------------------------------------------- | --------- | ------------------------------ |
| `clearSelectionLabel`   | `clear-selection-label`   | (optional) The clear search action text                           | `string`  | `SELECT_CLEAR_SELECTION_LABEL` |
| `maxHeight`             | `max-height`              | (optional) The dropdown's max-height                              | `string`  | `undefined`                    |
| `minHeight`             | `min-height`              | (optional) The dropdown's min-height                              | `string`  | `undefined`                    |
| `searchPlaceholder`     | `search-placeholder`      | (optional) The list search text field placeholder                 | `string`  | `undefined`                    |
| `searchValue`           | `search-value`            | (optional) The search value on the list                           | `string`  | `undefined`                    |
| `searchable`            | `searchable`              | (optional) If `true` the list has a search text field             | `boolean` | `false`                        |
| `selectionClearEnabled` | `selection-clear-enabled` | (optional) If `true` the list can be cleared                      | `boolean` | `undefined`                    |
| `selectionClearable`    | `selection-clearable`     | (optional) If `true` the list has an action to unselect all items | `boolean` | `false`                        |


## Events

| Event            | Description                                                | Type                  |
| ---------------- | ---------------------------------------------------------- | --------------------- |
| `clearSelection` | Emitted when the user clears the selected items            | `CustomEvent<void>`   |
| `searchChange`   | Emitted when the user interacts with the search text field | `CustomEvent<string>` |


## Shadow Parts

| Part       | Description           |
| ---------- | --------------------- |
| `"select"` | The select container. |


## CSS Custom Properties

| Name                        | Description              |
| --------------------------- | ------------------------ |
| `--select-background-color` | Select background color. |
| `--select-border`           | Select border style.     |
| `--select-border-radius`    | Select border radius.    |
| `--select-max-height`       | Select maximum height.   |


## Dependencies

### Used by

 - [kv-calendar-advanced-date-selector](../calendar-advanced-date-selector)
 - [kv-multi-select-dropdown](../multi-select-dropdown)
 - [kv-single-select-dropdown](../single-select-dropdown)

### Depends on

- [kv-search](../search)

### Graph
```mermaid
graph TD;
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-calendar-advanced-date-selector --> kv-select
  kv-multi-select-dropdown --> kv-select
  kv-single-select-dropdown --> kv-select
  style kv-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


