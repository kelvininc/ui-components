# _<kv-toggle-button-group>_

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                 | Type                                           | Default                |
| ----------------- | ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------- |
| `disabled`        | `disabled`         | (optional) If `true` all toggle buttons will be disabled                    | `boolean`                                      | `false`                |
| `disabledButtons` | `disabled-buttons` | (optional) A record with the button's key and its individual disabled state | `{ [x: string]: boolean; }`                    | `{}`                   |
| `options`         | `options`          | (optional) List of toggle switch options                                    | `IToggleSwitchOption[]`                        | `[]`                   |
| `selectedOption`  | `selected-option`  | (optional) Toggle switch selected option key                                | `string`                                       | `''`                   |
| `size`            | `size`             | (optional) Sets the size for all toggle buttons                             | `EComponentSize.Large \| EComponentSize.Small` | `EComponentSize.Small` |


## Events

| Event           | Description                                                        | Type                  |
| --------------- | ------------------------------------------------------------------ | --------------------- |
| `checkedChange` | When the toggle switch selection changes, emit the requested value | `CustomEvent<string>` |


## Shadow Parts

| Part                               | Description                  |
| ---------------------------------- | ---------------------------- |
| `"toggle-switch-option-container"` | Container of toggle options. |


## Dependencies

### Depends on

- [kv-toggle-button](../toggle-button)

### Graph
```mermaid
graph TD;
  kv-toggle-switch --> kv-toggle-button
  kv-toggle-button --> kv-tooltip
  kv-toggle-button --> kv-radio
  kv-toggle-button --> kv-icon
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  style kv-toggle-switch fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


