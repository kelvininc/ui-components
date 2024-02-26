# kv-select-multi-options

<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                 | Description                                                                                                       | Type                                   | Default                           |
| ---------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------- |
| `clearSelectionLabel`  | `clear-selection-label`   | (optional) The clear selection action text                                                                        | `string`                               | `undefined`                       |
| `counter`              | `counter`                 | (optional) If `true` a selection counter is displayed                                                             | `boolean`                              | `undefined`                       |
| `filteredOptions`      | --                        | (optional) The object with the dropdown options filtered                                                          | `{ [x: string]: ISelectMultiOption; }` | `undefined`                       |
| `maxHeight`            | `max-height`              | (optional) The dropdown's max-height                                                                              | `string`                               | `undefined`                       |
| `maxWidth`             | `max-width`               | (optional) The dropdown's max-width                                                                               | `string`                               | `undefined`                       |
| `minHeight`            | `min-height`              | (optional) The dropdown's min-height                                                                              | `string`                               | `undefined`                       |
| `minSearchOptions`     | `min-search-options`      | (optional) The minimum amount of options required to display the search. Defaults to `15`.                        | `number`                               | `MINIMUM_SEARCHABLE_OPTIONS`      |
| `minWidth`             | `min-width`               | (optional) The dropdown's min-width                                                                               | `string`                               | `undefined`                       |
| `noDataAvailableLabel` | `no-data-available-label` | (required) The text to display when there are no options                                                          | `string`                               | `DEFAULT_NO_DATA_AVAILABLE_LABEL` |
| `options`              | --                        | (optional) The object with the dropdown options                                                                   | `{ [x: string]: ISelectMultiOption; }` | `{}`                              |
| `searchPlaceholder`    | `search-placeholder`      | (optional) The list search text field placeholder                                                                 | `string`                               | `undefined`                       |
| `searchValue`          | `search-value`            | (optional) The search value to display                                                                            | `string`                               | `undefined`                       |
| `searchable`           | `searchable`              | (optional) If `false` the dropdown is not searchable. Default `true`                                              | `boolean`                              | `true`                            |
| `selectAllLabel`       | `select-all-label`        | (optional) The selection all action text                                                                          | `string`                               | `undefined`                       |
| `selectedOptions`      | --                        | (optional) The object with indexed by the dropdown labels and its selected value                                  | `{ [x: string]: boolean; }`            | `{}`                              |
| `selectionAll`         | `selection-all`           | (optional) If `true` the list has an action to select all items                                                   | `boolean`                              | `undefined`                       |
| `selectionClearable`   | `selection-clearable`     | (optional) If `true` dropdown items can be cleared                                                                | `boolean`                              | `undefined`                       |
| `shortcuts`            | `shortcuts`               | (optional) If `true` the keyboard shortcuts can be used to navigate between the dropdown results. Default `false` | `boolean`                              | `true`                            |


## Events

| Event             | Description                                                | Type                                     |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `clearSelection`  | Emitted when the user clears the selected items            | `CustomEvent<void>`                      |
| `dismiss`         | Emitted when the 'esc' key is pressed                      | `CustomEvent<void>`                      |
| `optionSelected`  | Emitted when an option is selected                         | `CustomEvent<string>`                    |
| `optionsSelected` | Emitted when the selected options change                   | `CustomEvent<{ [x: string]: boolean; }>` |
| `searchChange`    | Emitted when the user interacts with the search text field | `CustomEvent<string>`                    |
| `selectAll`       | Emitted when the user clicks on the all items              | `CustomEvent<void>`                      |


## Methods

### `clearHighlightedOption() => Promise<void>`

Clears the highlighted option state

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description           |
| ---------- | --------------------- |
| `"select"` | The select container. |


## CSS Custom Properties

| Name                       | Description                 |
| -------------------------- | --------------------------- |
| `--select-list-max-height` | Select list maximum height. |
| `--select-list-max-width`  | Select list maximum width.  |
| `--select-list-min-height` | Select list minimum height. |
| `--select-list-min-width`  | Select list minimum width.  |


## Dependencies

### Used by

 - [kv-multi-select-dropdown](../multi-select-dropdown)
 - [kv-single-select-dropdown](../single-select-dropdown)

### Depends on

- [kv-virtualized-list](../virtualized-list)
- [kv-select-option](../select-option)
- [kv-select](../select)
- [kv-select-shortcuts-label](../select-shortcuts)

### Graph
```mermaid
graph TD;
  kv-select-multi-options --> kv-virtualized-list
  kv-select-multi-options --> kv-select-option
  kv-select-multi-options --> kv-select
  kv-select-multi-options --> kv-select-shortcuts-label
  kv-select-option --> kv-checkbox
  kv-select-option --> kv-icon
  kv-select-option --> kv-select-option
  kv-checkbox --> kv-icon
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-badge
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-select-shortcuts-label --> kv-icon
  kv-multi-select-dropdown --> kv-select-multi-options
  kv-single-select-dropdown --> kv-select-multi-options
  style kv-select-multi-options fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


