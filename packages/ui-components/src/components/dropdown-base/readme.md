# *<kv-dropdown-base>*



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description                                                                                      | Type                                                                                                                                                                                                                                                                                                                                                                           | Default                    |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `actionElement`     | --                    | (optional) A reference to the dropdown action element                                            | `HTMLElement`                                                                                                                                                                                                                                                                                                                                                                  | `null`                     |
| `clickOutsideClose` | `click-outside-close` | (optional) If `false` clicking outside the dropdown will not trigger state change. Default: true | `boolean`                                                                                                                                                                                                                                                                                                                                                                      | `true`                     |
| `isOpen`            | `is-open`             | (optional) If `true` the list is opened                                                          | `boolean`                                                                                                                                                                                                                                                                                                                                                                      | `false`                    |
| `listElement`       | --                    | (optional) A reference to the dropdown list element                                              | `HTMLElement`                                                                                                                                                                                                                                                                                                                                                                  | `null`                     |
| `options`           | --                    | (optional) The dropdown position config options                                                  | `{ placement?: Placement; strategy?: Strategy; middleware?: (false \| { name: string; options?: any; fn: (state: { x: number; y: number; initialPlacement: Placement; platform: Platform; placement: Placement; strategy: Strategy; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }` | `DEFAULT_POSITION_CONFIG`  |
| `zIndex`            | `z-index`             | (optional) the dropdown list z-index (default: 9004)                                             | `number`                                                                                                                                                                                                                                                                                                                                                                       | `DEFAULT_DROPDOWN_Z_INDEX` |


## Events

| Event             | Description                                   | Type                   |
| ----------------- | --------------------------------------------- | ---------------------- |
| `openStateChange` | Emitted when the dropdown opens state changes | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [kv-dropdown](../dropdown)
 - [kv-range-dates-select-dropdown](../range-dates-select-dropdown)

### Depends on

- [kv-portal](../portal)

### Graph
```mermaid
graph TD;
  kv-dropdown-base --> kv-portal
  kv-dropdown --> kv-dropdown-base
  kv-range-dates-select-dropdown --> kv-dropdown-base
  style kv-dropdown-base fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


