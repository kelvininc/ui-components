# kv-time-range-picker



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvTimePicker } from '@kelvininc/react-ui-components/client';

export const KvTimePickerExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTimePicker />
	</>
);
```



## Properties

| Property                    | Attribute                      | Description                                                             | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Default                                        |
| --------------------------- | ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `calendarInputMaxDate`      | `calendar-input-max-date`      | (optional) calendar maximum date to be navigated                        | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `undefined`                                    |
| `calendarInputMinDate`      | `calendar-input-min-date`      | (optional) calendar minimum date to be navigated                        | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `undefined`                                    |
| `disableTimezoneSelection`  | `disable-timezone-selection`   | (optional) Lets the timezone visible but doens't let the user change it | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `false`                                        |
| `disabled`                  | `disabled`                     | (optional) Defines if the dropdown is disabled                          | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `false`                                        |
| `displayCustomizeInterval`  | `display-customize-interval`   | (optional) Determines if the customize interval otion is visible        | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `true`                                         |
| `displayTimezoneDropdown`   | `display-timezone-dropdown`    | (optional) Determines if the timezone dropdown is visible               | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `true`                                         |
| `dropdownPositionOptions`   | `dropdown-position-options`    | (optional) Dropdown possible positions                                  | `{ strategy?: Strategy; placement?: Placement; middleware?: (false \| { name: string; options?: any; fn: (state: { x: number; y: number; initialPlacement: Placement; strategy: Strategy; platform: Platform; placement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }`                                                                                                                                                                                                                                                                                                                                      | `DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS` |
| `inputConfig`               | `input-config`                 | (optional) Configuration of the dropdown input                          | `{ type?: EInputFieldType; label?: string; icon?: EIconName; actionIcon?: EIconName; inputName?: string; examples?: string[]; placeholder?: string; maxLength?: number; minLength?: number; max?: string \| number; min?: string \| number; step?: string \| number; size?: EComponentSize; inputDisabled?: boolean; inputRequired?: boolean; loading?: boolean; state?: EValidationState; helpText?: string \| string[]; value?: string \| number; valuePrefix?: string; badge?: string; inputReadonly?: boolean; forcedFocus?: boolean; tooltipConfig?: Partial<ITooltip>; useInputMask?: boolean; inputMaskRegex?: string; fitContent?: boolean; customStyle?: { [key: string]: string; }; isDirty?: boolean; }` | `{}`                                           |
| `relativeTimePickerOptions` | `relative-time-picker-options` | (optional) Relative time picker options                                 | `IRelativeTimePickerOption[][]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS`         |
| `selectedTimeOption`        | `selected-time-option`         | (optional) Selected time key                                            | `ITimePickerTime \| ITimePickerTimeState`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined`                                    |
| `showCalendar`              | `show-calendar`                | (optional) Determines if the show calendar toggle is enabled            | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `false`                                        |
| `timezones`                 | `timezones`                    | (optional) Timezones                                                    | `ITimezoneOffset[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `buildTimezoneByOffset(getTimezonesNames())`   |
| `tooltipPosition`           | `tooltip-position`             | (optional) Positioning of the tooltip                                   | `ETooltipPosition.Bottom \| ETooltipPosition.BottomEnd \| ETooltipPosition.BottomStart \| ETooltipPosition.Left \| ETooltipPosition.LeftEnd \| ETooltipPosition.LeftStart \| ETooltipPosition.Right \| ETooltipPosition.RightEnd \| ETooltipPosition.RightStart \| ETooltipPosition.Top \| ETooltipPosition.TopEnd \| ETooltipPosition.TopStart`                                                                                                                                                                                                                                                                                                                                                                    | `ETooltipPosition.TopStart`                    |
| `zIndex`                    | `z-index`                      | (optional) The time picker's z-index (default: 9003)                    | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `TIME_PICKER_PORTAL_Z_INDEX`                   |


## Events

| Event                     | Description                                     | Type                                   |
| ------------------------- | ----------------------------------------------- | -------------------------------------- |
| `cancelClicked`           | Emitted when cancel button is clicked           | `CustomEvent<CustomEvent<MouseEvent>>` |
| `dropdownStateChange`     | Emitted when dropdown state changes             | `CustomEvent<boolean>`                 |
| `showCalendarStateChange` | Emitted when show calendar button state changes | `CustomEvent<boolean>`                 |
| `timeRangeChange`         | Emitted when time range changes                 | `CustomEvent<ITimePickerTime>`         |


## Dependencies

### Depends on

- [kv-dropdown](../dropdown)
- [kv-relative-time-picker](../relative-time-picker)
- [kv-absolute-time-picker](../absolute-time-picker)
- [kv-switch-button](../switch-button)
- [kv-action-button-text](../action-button-text)
- [kv-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  kv-time-picker --> kv-dropdown
  kv-time-picker --> kv-relative-time-picker
  kv-time-picker --> kv-absolute-time-picker
  kv-time-picker --> kv-switch-button
  kv-time-picker --> kv-action-button-text
  kv-time-picker --> kv-tooltip
  kv-dropdown --> kv-dropdown-base
  kv-dropdown --> kv-text-field
  kv-dropdown-base --> kv-portal
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-dirty-dot
  kv-text-field --> kv-badge
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  kv-dirty-dot --> kv-icon
  kv-form-help-text --> kv-icon
  kv-relative-time-picker --> kv-time-picker-select-option
  kv-relative-time-picker --> kv-select-option
  kv-relative-time-picker --> kv-input-wrapper
  kv-relative-time-picker --> kv-single-select-dropdown
  kv-select-option --> kv-checkbox
  kv-select-option --> kv-tooltip
  kv-select-option --> kv-icon
  kv-select-option --> kv-dirty-dot
  kv-select-option --> kv-action-button-icon
  kv-checkbox --> kv-icon
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-icon
  kv-action-button-icon --> kv-badge
  kv-input-wrapper --> kv-icon
  kv-single-select-dropdown --> kv-dropdown
  kv-single-select-dropdown --> kv-select-multi-options
  kv-select-multi-options --> kv-virtualized-list
  kv-select-multi-options --> kv-select-option
  kv-select-multi-options --> kv-select
  kv-select-multi-options --> kv-tooltip
  kv-select-multi-options --> kv-illustration-message
  kv-select-multi-options --> kv-select-create-option
  kv-select-multi-options --> kv-select-shortcuts-label
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-illustration-message --> kv-illustration
  kv-select-create-option --> kv-text-field
  kv-select-create-option --> kv-action-button-icon
  kv-select-shortcuts-label --> kv-icon
  kv-absolute-time-picker --> kv-icon
  kv-absolute-time-picker --> kv-date-time-input
  kv-absolute-time-picker --> kv-calendar
  kv-date-time-input --> kv-form-label
  kv-date-time-input --> kv-icon
  kv-date-time-input --> kv-form-help-text
  kv-calendar --> kv-icon
  kv-calendar --> kv-calendar-day
  kv-switch-button --> kv-icon
  kv-action-button-text --> kv-action-button
  kv-action-button-text --> kv-icon
  style kv-time-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


