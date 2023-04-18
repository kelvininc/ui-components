# _<kv-toggle-button-group>_

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute    | Description                                                                                          | Type                        | Default |
| ----------------- | ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------- | ------- |
| `buttons`         | --           | (optional) List of toggle buttons                                                                    | `IToggleButton[]`           | `[]`    |
| `disabled`        | `disabled`   | (optional) Sets styling to be disabled and disables click events for all buttons                     | `boolean`                   | `false` |
| `disabledButtons` | --           | (optional) A record with the button's label/value and the if the respective button is disabled       | `{ [x: string]: boolean; }` | `{}`    |
| `radioButtons`    | --           | (optional) A record with the button's label/value and the if the respective button is a radio button | `{ [x: string]: boolean; }` | `{}`    |
| `selectedButtons` | --           | (optional) A record with the button's label/value and with if the selected value                     | `{ [x: string]: boolean; }` | `{}`    |
| `withRadio`       | `with-radio` | (optional) Sets                                                                                      | `boolean`                   | `false` |


## Events

| Event           | Description                                                            | Type                  |
| --------------- | ---------------------------------------------------------------------- | --------------------- |
| `checkedChange` | When the toggle button selection changes, emit the requested tab's key | `CustomEvent<string>` |


## Dependencies

### Depends on

- [kv-toggle-button](../toggle-button)

### Graph
```mermaid
graph TD;
  kv-toggle-button-group --> kv-toggle-button
  kv-toggle-button --> kv-radio
  kv-toggle-button --> kv-icon
  style kv-toggle-button-group fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

