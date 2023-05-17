# _kv-advanced-date-select-dropdown_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-advanced-date-select-dropdown></kv-advanced-date-select-dropdown>

<!-- With selected absolute time -->
<kv-advanced-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Relative,
		payload: {
			key: 'last-24-h',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advanced-date-select-dropdown>

<!-- With selected relative time -->
<kv-advanced-date-select-dropdown
	[selectedTime]="{
		type: ECalendarAdvanceTimeType.Absolute,
		payload: {
			key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
			range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
		}
	}"
></kv-advanced-date-select-dropdown>

<!-- With selected timezone time -->
<kv-advanced-date-select-dropdown selectedTimezone="Europe/Lisbon"></kv-advanced-date-select-dropdown>
```


### React

```tsx
import React from 'react';

import { KvAdvancedDateSelectDropdown, ECalendarAdvanceTimeType } from '@kelvininc/react-ui-components';

export const KvAdvancedDateExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvAdvancedDateSelectDropdown />

		{/*-- With selected relative time --*/}
		<KvAdvancedDateSelectDropdown
			selectedTime={{
				type: ECalendarAdvanceTimeType.Relative,
				payload: {
					key: 'last-24-h',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected absolute time --*/}
		<KvAdvancedDateSelectDropdown
			selectedTime={{
				type: ECalendarAdvanceTimeType.Absolute,
				payload: {
					key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected timezone --*/}
		<KvAdvancedDateSelectDropdown selectedTimezone="Europe/Lisbon" />
	</>
);
```



## Properties

| Property                  | Attribute           | Description                                                                                    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Default                             |
| ------------------------- | ------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `absoluteTimeConfig`      | --                  | (optional) The absolute time custom configurations                                             | `ICalendarAdvanceAbsoluteTimeConfig`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `undefined`                         |
| `dateMask`                | `date-mask`         | (optional) The text field date format mask in ISO 8601 format                                  | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`                         |
| `disabled`                | `disabled`          | (optional) If `true` clicking on the input will not open the calendar dropdown. Default: false | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                             |
| `dropdownPositionOptions` | --                  | (optional) The dropdown position options                                                       | `{ placement?: Placement; strategy?: Strategy; middleware?: (false \| { name: string; options?: any; fn: (state: { platform: Platform; placement: Placement; strategy: Strategy; x: number; y: number; initialPlacement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }`                                                                                                                                                                                                               | `DEFAULT_DROPDOWN_POSITION_OPTIONS` |
| `inputConfig`             | --                  | (optional) The text field dropdown custom configurations                                       | `{ type?: EInputFieldType; label?: string; icon?: EIconName \| EOtherIconName; inputName?: string; examples?: string[]; placeholder?: string; maxLength?: number; minLength?: number; max?: string \| number; min?: string \| number; step?: string \| number; size?: EComponentSize; disabled?: boolean; required?: boolean; loading?: boolean; state?: EValidationState; helpText?: string \| string[]; value?: string \| number; readonly?: boolean; forcedFocus?: boolean; highlighted?: boolean; tooltipConfig?: Partial<ITooltip>; useInputMask?: boolean; inputMaskRegex?: string; }` | `{}`                                |
| `relativeTimeConfig`      | --                  | (optional) The absolute time custom configurations                                             | `ICalendarAdvanceRelativeTimeConfig`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `undefined`                         |
| `selectedTime`            | --                  | (optional) The selected time range                                                             | `ICalendarAdvanceSelectedTime`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `undefined`                         |
| `selectedTimezone`        | `selected-timezone` | (optional) Currently selected timezone name                                                    | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `getDefaultTimezone()`              |
| `timezones`               | --                  | (optional) List with all selectable timezones                                                  | `string[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `getTimezonesNames()`               |


## Events

| Event                         | Description                                                 | Type                       |
| ----------------------------- | ----------------------------------------------------------- | -------------------------- |
| `dropdownStateChange`         | Emitted when the calendar dropdown open state changes       | `CustomEvent<boolean>`     |
| `rangeDropdownStateChange`    | Emitted when the range calendar dropdown open state changes | `CustomEvent<boolean>`     |
| `timeApplied`                 | Emitted when a time selector is applied                     | `CustomEvent<ITimeChange>` |
| `timezoneDropdownStateChange` | Emitted when the timezone dropdown open state changes       | `CustomEvent<boolean>`     |


## CSS Custom Properties

| Name                     | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `--dropdown-input-width` | The dropdown's input width when an absolute time is picked. |


## Dependencies

### Depends on

- [kv-dropdown](../dropdown)
- [kv-calendar-advanced-date-selector](../calendar-advanced-date-selector)
- [kv-action-button-text](../action-button-text)

### Graph
```mermaid
graph TD;
  kv-advanced-date-select-dropdown --> kv-dropdown
  kv-advanced-date-select-dropdown --> kv-calendar-advanced-date-selector
  kv-advanced-date-select-dropdown --> kv-action-button-text
  kv-dropdown --> kv-dropdown-base
  kv-dropdown --> kv-text-field
  kv-dropdown --> kv-icon
  kv-text-field --> kv-tooltip
  kv-text-field --> kv-form-label
  kv-text-field --> kv-icon
  kv-text-field --> kv-form-help-text
  kv-tooltip --> kv-tooltip-text
  kv-form-help-text --> kv-icon
  kv-calendar-advanced-date-selector --> kv-range-dates-select-dropdown
  kv-calendar-advanced-date-selector --> kv-select
  kv-calendar-advanced-date-selector --> kv-select-option
  kv-calendar-advanced-date-selector --> kv-single-select-dropdown
  kv-range-dates-select-dropdown --> kv-dropdown-base
  kv-range-dates-select-dropdown --> kv-text-field
  kv-range-dates-select-dropdown --> kv-icon
  kv-range-dates-select-dropdown --> kv-calendar-range-dates-selector
  kv-calendar-range-dates-selector --> kv-calendar
  kv-calendar --> kv-action-button-icon
  kv-calendar --> kv-calendar-day
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-icon
  kv-action-button-icon --> kv-badge
  kv-select --> kv-search
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-select-option --> kv-checkbox
  kv-checkbox --> kv-icon
  kv-single-select-dropdown --> kv-select-group
  kv-single-select-dropdown --> kv-select-option
  kv-single-select-dropdown --> kv-dropdown
  kv-single-select-dropdown --> kv-select
  kv-action-button-text --> kv-action-button
  kv-action-button-text --> kv-icon
  style kv-advanced-date-select-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


