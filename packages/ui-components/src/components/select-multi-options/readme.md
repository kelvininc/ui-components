# kv-select-multi-options



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                 | Description                                                                      | Type                                   | Default                           |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------- |
| `clearSelectionLabel`  | `clear-selection-label`   | (optional) The clear selection action text                                       | `string`                               | `undefined`                       |
| `counter`              | `counter`                 | (optional) If `true` a selection counter is displayed                            | `boolean`                              | `undefined`                       |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered                         | `{ [x: string]: ISelectMultiOption; }` | `undefined`                       |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                                             | `string`                               | `undefined`                       |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                                             | `string`                               | `undefined`                       |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options                         | `string`                               | `DEFAULT_NO_DATA_AVAILABLE_LABEL` |
| `options`              | --                        | (optional) The object with the dropdown options                                  | `{ [x: string]: ISelectMultiOption; }` | `{}`                              |
| `searchPlaceholder`    | `search-placeholder`      | (optional) The list search text field placeholder                                | `string`                               | `undefined`                       |
| `searchValue`          | `search-value`            | (optional) The search value to display                                           | `string`                               | `undefined`                       |
| `searchable`           | `searchable`              | (optional) If `true` the dropdown is searchable                                  | `boolean`                              | `undefined`                       |
| `selectAllLabel`       | `select-all-label`        | (optional) The selection all action text                                         | `string`                               | `undefined`                       |
| `selectedOptions`      | --                        | (optional) The object with indexed by the dropdown labels and its selected value | `{ [x: string]: boolean; }`            | `{}`                              |
| `selectionAll`         | `selection-all`           | (optional) If `true` the list has an action to select all items                  | `boolean`                              | `undefined`                       |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared                               | `boolean`                              | `undefined`                       |


## Events

| Event             | Description                                                | Type                                     |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `clearSelection`  | Emitted when the user clears the selected items            | `CustomEvent<void>`                      |
| `optionsSelected` | Emitted when the selected options change                   | `CustomEvent<{ [x: string]: boolean; }>` |
| `searchChange`    | Emitted when the user interacts with the search text field | `CustomEvent<string>`                    |
| `selectAll`       | Emitted when the user clicks on the all items              | `CustomEvent<void>`                      |


## CSS Custom Properties

| Name                       | Description                 |
| -------------------------- | --------------------------- |
| `--select-list-max-height` | Select list maximum height. |


## Dependencies

### Used by

 - [kv-labels-dropdown](../labels-dropdown)
 - [kv-multi-select-dropdown](../multi-select-dropdown)

### Depends on

- [kv-select-group](../select-group)
- [kv-select-option-multi-level](../select-option-multi-level)
- [kv-select](../select)
- [kv-select-option](../select-option)

### Graph
```mermaid
graph TD;
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
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-labels-dropdown --> kv-select-multi-options
  kv-multi-select-dropdown --> kv-select-multi-options
  style kv-select-multi-options fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


