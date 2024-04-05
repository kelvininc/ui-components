# kv-date-time-input



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-date-time-input></kv-date-time-input>

<!-- Labeled -->
<kv-date-time-input label="Text Field"></kv-date-time-input>
```


### React

```tsx
import React from 'react';

import { KvDateTimeInput } from '@kelvininc/react-ui-components';

export const DateTimeInputExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvDateTimeInput />

		{/*-- Labeled --*/}
		<KvDateTimeInput label="Text Field" />
	</>
);
```



## Properties

| Property       | Attribute        | Description                                                                      | Type                                                                          | Default                 |
| -------------- | ---------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------- |
| `disabled`     | `disabled`       | (optional) Date time input disabled                                              | `boolean`                                                                     | `false`                 |
| `forcedFocus`  | `forced-focus`   | (optional) Date time focus state                                                 | `boolean`                                                                     | `false`                 |
| `helpText`     | `help-text`      | (optional) Date time input help text                                             | `string \| string[]`                                                          | `[]`                    |
| `highlighted`  | `highlighted`    | (optional) Similar to forcedFocus but does not emmit events                      | `boolean`                                                                     | `false`                 |
| `inputName`    | `input-name`     | (optional) Date time input name                                                  | `string`                                                                      | `undefined`             |
| `label`        | `label`          | (optional) Date time input label                                                 | `string`                                                                      | `undefined`             |
| `placeholder`  | `placeholder`    | (optional) Date time place holder                                                | `string`                                                                      | `''`                    |
| `required`     | `required`       | (optional) Date time input required                                              | `boolean`                                                                     | `false`                 |
| `size`         | `size`           | (optional) Sets this tab item to a different styling configuration               | `EComponentSize.Large \| EComponentSize.Small`                                | `EComponentSize.Large`  |
| `state`        | `state`          | (optional) Date time input state                                                 | `EValidationState.Invalid \| EValidationState.None \| EValidationState.Valid` | `EValidationState.None` |
| `useInputMask` | `use-input-mask` | (optional) Use a input mask when the Date time type is a Datetime (default true) | `boolean`                                                                     | `false`                 |
| `value`        | `value`          | (optional) Date time value                                                       | `string`                                                                      | `''`                    |


## Events

| Event          | Description                            | Type                      |
| -------------- | -------------------------------------- | ------------------------- |
| `dateTimeBlur` | Emitted when date time lost focus      | `CustomEvent<string>`     |
| `inputFocus`   | Emitted when the input is foccused     | `CustomEvent<FocusEvent>` |
| `textChange`   | Emitted when a keyboard input occurred | `CustomEvent<string>`     |


## Dependencies

### Used by

 - [kv-absolute-time-picker](../absolute-time-picker)

### Depends on

- [kv-form-label](../form-label)
- [kv-form-help-text](../form-help-text)

### Graph
```mermaid
graph TD;
  kv-date-time-input --> kv-form-label
  kv-date-time-input --> kv-form-help-text
  kv-form-help-text --> kv-icon
  kv-absolute-time-picker --> kv-date-time-input
  style kv-date-time-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


