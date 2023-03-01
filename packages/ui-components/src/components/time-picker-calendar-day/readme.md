# kv-time-picker-calendar-day



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-time-picker-calendar-day [day]="12"></kv-time-picker-calendar-day>

<!-- Active -->
<kv-time-picker-calendar-day [day]="12" active></kv-time-picker-calendar-day>

<!-- Disabled -->
<kv-time-picker-calendar-day [day]="12" [disabled]="true"></kv-time-picker-calendar-day>

<!-- In Range -->
<kv-time-picker-calendar-day [day]="12" [inRange]="true"></kv-time-picker-calendar-day>
```


### React

```tsx
import React from 'react';

import { KvTimePickerCalendarDay } from '@kelvininc/react-ui-components';

export const KvTimePickerCalendarDayExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTimePickerCalendarDay day={12} />

		{/*-- Active --*/}
		<KvTimePickerCalendarDay day={12} active={true} />

		{/*-- Disabled --*/}
		<KvTimePickerCalendarDay day={12} disabled={true} />

		{/*-- In Range --*/}
		<KvTimePickerCalendarDay day={12} inRange={true} />
	</>
);
```



## Properties

| Property                 | Attribute                   | Description                                                                            | Type      | Default     |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`                 | `active`                    | (optional) If `true`, the day is with active                                           | `boolean` | `false`     |
| `day` _(required)_       | `day`                       | (required) Calendar day                                                                | `number`  | `undefined` |
| `disabled`               | `disabled`                  | (optional) If `true`, the day is disabled                                              | `boolean` | `false`     |
| `inRange`                | `in-range`                  | (optional) If `true`, the day is in range from a start date to the current hovered day | `boolean` | `false`     |
| `isBetweenSelectedDates` | `is-between-selected-dates` | (optional) If `true`, the day is between to selected dates                             | `boolean` | `false`     |
| `isRangeEndDate`         | `is-range-end-date`         | (optional) If `true` the day is the end of the range                                   | `boolean` | `false`     |
| `isRangeStartDate`       | `is-range-start-date`       | (optional) If `true` the day is the start of the range                                 | `boolean` | `false`     |
| `isToday`                | `is-today`                  | (optional) If `true`, the day is the day of `today`date                                | `boolean` | `false`     |


## Events

| Event           | Description                            | Type                            |
| --------------- | -------------------------------------- | ------------------------------- |
| `clickDay`      | Emitted when day button is clicked     | `CustomEvent<IClickDayEvent>`   |
| `mouseEnterDay` | Emitted when day button is mouse enter | `CustomEvent<IMouseEnterEvent>` |
| `mouseLeaveDay` | Emitted when day button is mouse leave | `CustomEvent<IMouseLeaveEvent>` |


## Shadow Parts

| Part              | Description               |
| ----------------- | ------------------------- |
| `"day-container"` | The day button container. |


## Dependencies

### Used by

 - [kv-time-picker-calendar](../time-picker-calendar)

### Graph
```mermaid
graph TD;
  kv-time-picker-calendar --> kv-time-picker-calendar-day
  style kv-time-picker-calendar-day fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


