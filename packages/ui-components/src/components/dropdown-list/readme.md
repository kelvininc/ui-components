# *<kv-dropdown-list>*



<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<kv-dropdown-list searchable=true selectionClearable=true>
	<kv-dropdown-list-item
		label="Option 1"
		value="option1"
		togglable=true>
	</kv-dropdown-list-item>
	...
	<kv-dropdown-list-item
		label="Option 3"
		value="option3"
		togglable=true>
	</kv-dropdown-list-item>
</kv-dropdown-list>
```


### React

```tsx
import React from 'react';
import { KvDropdownList } from '@kelvininc/react-ui-components';

export const KvDropdownListExample: React.FC = () => (
  <>
    <KvDropdownList searchable={true} selectionClearable={true}>
		<KvDropdownListItem
			label="Option 1"
			value="option1"
			togglable={true}>
		</KvDropdownListItem>
		<KvDropdownListItem
			label="Option 3"
			value="option3"
			togglable={true}>
		</KvDropdownList>
	</KvDropdownList>
  </>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-dropdown-list',
  styleUrl: 'kv-dropdown-list-example.css',
  shadow: true,
})
export class KvDropdownListExample {
  render() {
    return (
		<KvDropdownList searchable={true} selectionClearable={true}>
			<KvDropdownListItem
				label="Option 1"
				value="option1"
				togglable={true}>
			</KvDropdownListItem>
			<KvDropdownListItem
				label="Option 3"
				value="option3"
				togglable={true}>
			</KvDropdownList>
		</KvDropdownList>
	)
  }
}
```



## Properties

| Property                | Attribute                 | Description                                                       | Type      | Default                               |
| ----------------------- | ------------------------- | ----------------------------------------------------------------- | --------- | ------------------------------------- |
| `clearSelectionLabel`   | `clear-selection-label`   | (optional) The clear search action text                           | `string`  | `DROPDOWN_LIST_CLEAR_SELECTION_LABEL` |
| `searchPlaceholder`     | `search-placeholder`      | (optional) The list search text field placeholder                 | `string`  | `undefined`                           |
| `searchValue`           | `search-value`            | (optional) The search value on the list                           | `string`  | `undefined`                           |
| `searchable`            | `searchable`              | (optional) If `true` the list has a search text field             | `boolean` | `false`                               |
| `selectionClearEnabled` | `selection-clear-enabled` | (optional) If `true` the list can be cleared                      | `boolean` | `undefined`                           |
| `selectionClearable`    | `selection-clearable`     | (optional) If `true` the list has an action to unselect all items | `boolean` | `false`                               |


## Events

| Event            | Description                                                | Type                  |
| ---------------- | ---------------------------------------------------------- | --------------------- |
| `clearSelection` | Emitted when the user clears the selected items            | `CustomEvent<void>`   |
| `searchChange`   | Emitted when the user interacts with the search text field | `CustomEvent<string>` |


## CSS Custom Properties

| Name                               | Description                     |
| ---------------------------------- | ------------------------------- |
| `--dropdown-list-background-color` | Dropdown list background color. |
| `--dropdown-list-border-color`     | Dropdown list border color.     |
| `--dropdown-list-max-height`       | Dropdown list maximum height.   |


## Dependencies

### Used by

 - [kv-multi-select-dropdown](../multi-select-dropdown)
 - [kv-single-select-dropdown](../single-select-dropdown)

### Depends on

- [kv-search](../search)

### Graph
```mermaid
graph TD;
  kv-dropdown-list --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-text-field --> kv-icon
  kv-multi-select-dropdown --> kv-dropdown-list
  kv-single-select-dropdown --> kv-dropdown-list
  style kv-dropdown-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


