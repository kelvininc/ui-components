# kv-labels-dropdown



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                 | Description                                                                      | Type                                   | Default     |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `clearSelectionLabel`  | `clear-selection-label`   | (optional) The clear selection action text                                       | `string`                               | `undefined` |
| `counter`              | `counter`                 | (optional) If `true` a selection counter is displayed                            | `boolean`                              | `true`      |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered                         | `{ [x: string]: ISelectMultiOption; }` | `undefined` |
| `isOpen`               | `is-open`                 | (Optional) Allows outside implementation to open/close dropdown on demand        | `boolean`                              | `false`     |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                                             | `string`                               | `undefined` |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                                             | `string`                               | `undefined` |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options                         | `string`                               | `undefined` |
| `options`              | --                        | (optional) The object with the dropdown options                                  | `{ [x: string]: ISelectMultiOption; }` | `{}`        |
| `searchValue`          | `search-value`            | (optional) The search value to display                                           | `string`                               | `undefined` |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable                                  | `boolean`                              | `true`      |
| `selectAllLabel`       | `select-all-label`        | (optional) The selection all action text                                         | `string`                               | `undefined` |
| `selectedOptions`      | --                        | (optional) The object with indexed by the dropdown labels and its selected value | `{ [x: string]: boolean; }`            | `{}`        |
| `selectionAll`         | `selection-all`           | (optional) If `true` the list has an action to select all items                  | `boolean`                              | `true`      |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared                               | `boolean`                              | `true`      |


## Events

| Event             | Description                                                | Type                                     |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `clearSelection`  | Emitted when the user clears the selected items            | `CustomEvent<void>`                      |
| `optionsSelected` | Emitted when the selected options change                   | `CustomEvent<{ [x: string]: boolean; }>` |
| `searchChange`    | Emitted when the user interacts with the search text field | `CustomEvent<string>`                    |
| `selectAll`       | Emitted when the user clicks on the all items              | `CustomEvent<void>`                      |


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
  kv-select-multi-options --> kv-select-option
  kv-select-multi-options --> kv-select
  kv-select-option --> kv-checkbox
  kv-select-option --> kv-select-option
  kv-checkbox --> kv-icon
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  style kv-labels-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

