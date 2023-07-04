# kv-labels-dropdown



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                 | Description                                                                      | Type                                   | Default     |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered                         | `{ [x: string]: ISelectMultiOption; }` | `undefined` |
| `isOpen`               | `is-open`                 | (Optional) Allows outside implementation to open/close dropdown on demand        | `boolean`                              | `false`     |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                                             | `string`                               | `undefined` |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                                             | `string`                               | `undefined` |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options                         | `string`                               | `undefined` |
| `options`              | --                        | (optional) The object with the dropdown options                                  | `{ [x: string]: ISelectMultiOption; }` | `{}`        |
| `searchValue`          | `search-value`            | (optional) The search value to display                                           | `string`                               | `undefined` |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable                                  | `boolean`                              | `true`      |
| `selectedOptions`      | --                        | (optional) The object with indexed by the dropdown labels and its selected value | `{ [x: string]: boolean; }`            | `{}`        |


## Events

| Event              | Description                                                | Type                                     |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------- |
| `optionsSelected`  | Emitted when the selected options change                   | `CustomEvent<{ [x: string]: boolean; }>` |
| `searchChange`     | Emitted when the search term changes                       | `CustomEvent<string>`                    |
| `selectAll`        | Emits a signal whenever the 'select all' action is clicked | `CustomEvent<void>`                      |
| `selectionCleared` | Emitted when the selection is cleared                      | `CustomEvent<void>`                      |


## Dependencies

### Depends on

- [kv-labels-dropdown-input-item](../labels-dropdown-input-item)
- [kv-dropdown](../dropdown)
- [kv-select-multi-options](../select-multi-options)

### Graph
```mermaid
graph TD;
  kv-labels-dropdown --> kv-labels-dropdown-input-item
  kv-labels-dropdown --> kv-dropdown
  kv-labels-dropdown --> kv-select-multi-options
  kv-labels-dropdown-input-item --> kv-icon
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
  style kv-labels-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


