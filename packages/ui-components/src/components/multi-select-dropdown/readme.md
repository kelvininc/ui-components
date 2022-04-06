# *<kv-breadcrumb-list>*



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<kv-breadcrumb-list separator='/'>
	<kv-breadcrumb-item
		label="First item"
		link="Your link here"
		[target]="EBreadcrumbItemTarget.NewTab">
	</kv-breadcrumb-item>
	...
	<kv-breadcrumb-item
		label="Last item"
		link="Your link here"
		[target]="EBreadcrumbItemTarget.NewTab"
		active>
	</kv-breadcrumb-item>
</kv-breadcrumb-list>
```


### Javascript

```html
<kv-breadcrumb-list separator='/'>
	<kv-breadcrumb-item
		label="First item"
		link="Your link here"
		target="_blank">
	</kv-breadcrumb-item>
	...
	<kv-breadcrumb-item
		label="Last item"
		link="Your link here"
		target="_blank"
		active>
	</kv-breadcrumb-item>
</kv-breadcrumb-list>
```


### React

```tsx
import React from 'react';
import { KvBreadcrumbList } from '@kelvininc/react-ui-components';

export const KvBreadcrumbListExample: React.FC = () => (
  <>
    <KvBreadcrumbList separator='/'>
		<KvBreadcrumbItem
			label="Your label here"
			link="Your link here"
			target={EBreadcrumbItemTarget.NewTab}
			active>
		</KvBreadcrumbItem>
	</KvBreadcrumbList>
  </>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-link-example',
  styleUrl: 'kv-link-example.css',
  shadow: true,
})
export class SwichButtonExample {
  render() {
    return (
		<kv-breadcrumb-list separator='/'>
			<kv-breadcrumb-item
				label="First item"
				link="Your link here"
				target={EBreadcrumbItemTarget.NewTab}
				active>
			</kv-breadcrumb-item>
			...
			<kv-breadcrumb-item
				label="Last item"
				link="Your link here"
				target={EBreadcrumbItemTarget.NewTab}
				active>
			</kv-breadcrumb-item>
		</kv-breadcrumb-list>
	)
  }
}
```



## Properties

| Property               | Attribute                 | Description                                                   | Type                                                                          | Default                                   |
| ---------------------- | ------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| `disabled`             | `disabled`                | (optional) If `true` the dropdown is disabled                 | `boolean`                                                                     | `undefined`                               |
| `errorState`           | `error-state`             | (required) The error state for the dropdown                   | `EValidationState.Invalid \| EValidationState.None \| EValidationState.Valid` | `undefined`                               |
| `helpText`             | `help-text`               | (optional) The text to display as help text                   | `string`                                                                      | `undefined`                               |
| `icon`                 | `icon`                    | (optional) The icon to display on the dropdown                | `EIconName \| EOtherIconName`                                                 | `undefined`                               |
| `isOpen`               | `is-open`                 | (optional) If `true` the dropdown is opened                   | `boolean`                                                                     | `undefined`                               |
| `label`                | `label`                   | (optional) The text to display on the dropdown label          | `string`                                                                      | `undefined`                               |
| `loading`              | `loading`                 | (optional) If `true` the dropdown is loading                  | `boolean`                                                                     | `false`                                   |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options      | `string`                                                                      | `MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE` |
| `options`              | --                        | (optional) The object with the dropdown options               | `{ [key: string]: IMultiSelectDropdownOption; }`                              | `undefined`                               |
| `placeholder`          | `placeholder`             | (required) The text to display as the dropdown placeholder    | `string`                                                                      | `undefined`                               |
| `required`             | `required`                | (optional) If `true` dropdown requires a value to be selected | `boolean`                                                                     | `undefined`                               |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable               | `boolean`                                                                     | `undefined`                               |
| `selectedOptions`      | --                        | (optional) The array of selected options                      | `string[]`                                                                    | `[]`                                      |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared            | `boolean`                                                                     | `undefined`                               |
| `value`                | `value`                   | (optional) The text to display on the dropdown                | `string`                                                                      | `undefined`                               |


## Events

| Event             | Description                              | Type                    |
| ----------------- | ---------------------------------------- | ----------------------- |
| `optionsSelected` | Emitted when the selected options change | `CustomEvent<string[]>` |
| `searchChange`    | Emitted when the search term changes     | `CustomEvent<string>`   |


## Dependencies

### Depends on

- [kv-dropdown](../dropdown)
- [kv-dropdown-list](../dropdown-list)
- [kv-dropdown-list-item](../dropdown-list-item)

### Graph
```mermaid
graph TD;
  kv-multi-select-dropdown --> kv-dropdown
  kv-multi-select-dropdown --> kv-dropdown-list
  kv-multi-select-dropdown --> kv-dropdown-list-item
  kv-dropdown --> kv-text-field
  kv-dropdown --> kv-icon
  kv-text-field --> kv-icon
  kv-dropdown-list --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-dropdown-list-item --> kv-icon
  style kv-multi-select-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


