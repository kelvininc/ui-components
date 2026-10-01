# *<kv-dropdown-base>*



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description                                                                                                                                                                                                               | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Default                    |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `actionElement`     | `action-element`      | (optional) A reference to the dropdown action element                                                                                                                                                                     | `HTMLElement`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `null`                     |
| `clickOutsideClose` | `click-outside-close` | (optional) If `false` clicking outside the dropdown will not trigger state change. A click in a portal anchored inside the dropdown, as the list of a dropdown or a tooltip opened from it, is not outside. Default: true | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `true`                     |
| `escapeClose`       | `escape-close`        | (optional) If `false` pressing Escape will not trigger state change. Escape only closes the most recently opened dropdown, so one with `escapeClose` off also keeps those opened before it open. Default: true            | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `true`                     |
| `isOpen`            | `is-open`             | (optional) If `true` the list is opened                                                                                                                                                                                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `false`                    |
| `listElement`       | `list-element`        | (optional) A reference to the dropdown list element                                                                                                                                                                       | `HTMLElement`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `null`                     |
| `options`           | `options`             | (optional) The dropdown position config options                                                                                                                                                                           | `{ strategy?: Strategy; placement?: Placement; middleware?: (false \| { name: string; options?: any; fn: (state: { x: number; y: number; initialPlacement: Placement; strategy: Strategy; platform: { detectOverflow: (state: MiddlewareState, options?: DetectOverflowOptions \| Derivable<DetectOverflowOptions>) => Promise<SideObject>; } & Platform; placement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }` | `DEFAULT_POSITION_CONFIG`  |
| `zIndex`            | `z-index`             | (optional) the dropdown list z-index (default: 9004)                                                                                                                                                                      | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `DEFAULT_DROPDOWN_Z_INDEX` |


## Events

| Event             | Description                                                                                                                                                                                                        | Type                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| `clickOutside`    | Emitted when there's a click outside the dropdown's boundaries. A click in a portal anchored inside the dropdown, as the list of a dropdown or a tooltip opened from it, is not outside.                           | `CustomEvent<MouseEvent>` |
| `openStateChange` | Emitted when the dropdown requests a change of its open state, which its consumer applies through `isOpen`. It requests `false` on a click outside it (see `clickOutsideClose`) and on Escape (see `escapeClose`). | `CustomEvent<boolean>`    |


## Dependencies

### Used by

 - [kv-absolute-time-picker-dropdown-input](../absolute-time-picker-dropdown-input)
 - [kv-dropdown](../dropdown)

### Depends on

- [kv-portal](../portal)

### Graph
```mermaid
graph TD;
  kv-dropdown-base --> kv-portal
  kv-absolute-time-picker-dropdown-input --> kv-dropdown-base
  kv-dropdown --> kv-dropdown-base
  style kv-dropdown-base fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


