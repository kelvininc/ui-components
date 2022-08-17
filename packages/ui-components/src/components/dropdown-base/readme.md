# *<kv-dropdown-base>*



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute | Description                                           | Type                                                                                              | Default                   |
| --------------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------- |
| `actionElement` | --        | (optional) A reference to the dropdown action element | `HTMLElement`                                                                                     | `null`                    |
| `isOpen`        | `is-open` | (optional) If `true` the list is opened               | `boolean`                                                                                         | `false`                   |
| `listElement`   | --        | (optional) A reference to the dropdown list element   | `HTMLElement`                                                                                     | `null`                    |
| `options`       | --        | (optional) The dropdown position config options       | `{ platform?: Platform; placement?: Placement; strategy?: Strategy; middleware?: Middleware[]; }` | `DEFAULT_POSITION_CONFIG` |


## Events

| Event             | Description                                   | Type                   |
| ----------------- | --------------------------------------------- | ---------------------- |
| `openStateChange` | Emitted when the dropdown opens state changes | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [kv-dropdown](../dropdown)
 - [kv-range-dates-select-dropdown](../range-dates-select-dropdown)

### Graph
```mermaid
graph TD;
  kv-dropdown --> kv-dropdown-base
  kv-range-dates-select-dropdown --> kv-dropdown-base
  style kv-dropdown-base fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


