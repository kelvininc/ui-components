# kv-single-date-select-dropdown

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-single-date-select-dropdown></kv-single-date-select-dropdown>

<!-- With input config -->
<kv-single-date-select-dropdown [dropdownConfig]="{ label: 'Birthday', placeholder: 'Select a date' }"></kv-single-date-select-dropdown>
```


### React

```tsx
import React from 'react';

import { KvSingleDateSelectDropdown } from '@kelvininc/react-ui-components';

export const KvSingleDateSelectDropdownExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSingleDateSelectDropdown />

		{/*-- With input config --*/}
		<KvSingleDateSelectDropdown dropdownConfig={{ label: 'Birthday', placeholder: 'Select a date' }} />
	</>
);
```



## Properties

| Property        | Attribute       | Description                                                                                    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default     |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `dateMask`      | `date-mask`     | (optional) The text field date format mask in ISO 8601 format                                  | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `disabled`      | `disabled`      | (optional) If `true` clicking on the input will not open the calendar dropdown. Default: false | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `false`     |
| `disabledDates` | --              | (options) The disabled dates array                                                             | `string[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `[]`        |
| `initialDate`   | `initial-date`  | (optional) Initial date                                                                        | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `inputConfig`   | --              | (optional) The text field dropdown custom configurations                                       | `{ type?: EInputFieldType; label?: string; icon?: EIconName \| EOtherIconName; actionIcon?: EIconName \| EOtherIconName; inputName?: string; examples?: string[]; placeholder?: string; maxLength?: number; minLength?: number; max?: string \| number; min?: string \| number; step?: string \| number; size?: EComponentSize; inputDisabled?: boolean; inputRequired?: boolean; loading?: boolean; state?: EValidationState; helpText?: string \| string[]; value?: string \| number; valuePrefix?: string; badge?: string; inputReadonly?: boolean; forcedFocus?: boolean; tooltipConfig?: Partial<ITooltip>; useInputMask?: boolean; inputMaskRegex?: string; fitContent?: boolean; customStyle?: { [key: string]: string; }; }` | `{}`        |
| `maxDate`       | `max-date`      | (optional) Maximum accepted date                                                               | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `minDate`       | `min-date`      | (optional) Minimum accepted date                                                               | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `selectedDate`  | `selected-date` | (optional) Currently selected date                                                             | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `undefined` |


## Events

| Event             | Description                                            | Type                       |
| ----------------- | ------------------------------------------------------ | -------------------------- |
| `openStateChange` | Emitted when the calendar selector opens state changes | `CustomEvent<boolean>`     |
| `selectDate`      | Emitted when day is selected                           | `CustomEvent<ISelectDate>` |


## Dependencies

### Depends on

- [kv-dropdown](../dropdown)
- [kv-calendar-single-date-selector](../calendar-single-date-selector)

### Graph
```mermaid
graph TD;
  kv-single-date-select-dropdown --> kv-dropdown
  kv-single-date-select-dropdown --> kv-calendar-single-date-selector
  kv-dropdown --> kv-dropdown-base
  kv-dropdown --> kv-text-field
  kv-dropdown-base --> kv-portal
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-badge
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-calendar-single-date-selector --> kv-calendar
  kv-calendar --> kv-action-button-icon
  kv-calendar --> kv-calendar-day
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-icon
  kv-action-button-icon --> kv-badge
  style kv-single-date-select-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


