# kv-calendar-day



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvCalendarDay } from '@kelvininc/react-ui-components/client';

export const KvCalendarDayExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendarDay day={12} />

		{/*-- Active --*/}
		<KvCalendarDay day={12} active={true} />

		{/*-- Disabled --*/}
		<KvCalendarDay day={12} disabled={true} />

		{/*-- In Range --*/}
		<KvCalendarDay day={12} inHoverRange={true} />
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

| Event           | Description                            | Type                  |
| --------------- | -------------------------------------- | --------------------- |
| `clickDay`      | Emitted when day button is clicked     | `CustomEvent<number>` |
| `mouseEnterDay` | Emitted when day button is mouse enter | `CustomEvent<number>` |
| `mouseLeaveDay` | Emitted when day button is mouse leave | `CustomEvent<number>` |


## Shadow Parts

| Part              | Description               |
| ----------------- | ------------------------- |
| `"day-container"` | The day button container. |


## Dependencies

### Used by

 - [kv-calendar](../calendar)

### Graph
```mermaid
graph TD;
  kv-calendar --> kv-calendar-day
  style kv-calendar-day fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


