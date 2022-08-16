```tsx
import React from 'react';

import { KvCalendarRangeDatesSelector } from '@kelvininc/react-ui-components';

export const KvCalendarRangeDatesExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendarRangeDatesSelector />

		{/*-- With selected date --*/}
		<KvCalendarRangeDatesSelector selectedDateRange={['2022-08-04', '2022-09-01']} />

		{/*-- With initial date --*/}
		<KvCalendarRangeDatesSelector initialDate="2021-12-03" />

		{/*-- With disabled dates --*/}
		<KvCalendarRangeDatesSelector disabledDates={['2021-12-01', '2021-12-04', '2021-12-05']} />

		{/*-- With min and max --*/}
		<KvCalendarRangeDatesSelector minDate="2021-12-04" maxDate="2023-02-12" />
	</>
);
```
