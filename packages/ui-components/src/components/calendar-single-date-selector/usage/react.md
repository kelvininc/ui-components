```tsx
import React from 'react';

import { KvCalendarSingleDateSelector } from '@kelvininc/react-ui-components';

export const KvCalendarSingleDateSelectorExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendarSingleDateSelector />

		{/*-- With selected date --*/}
		<KvCalendarSingleDateSelector selectedDate="2022-08-04" />

		{/*-- With initial date --*/}
		<KvCalendarSingleDateSelector initialDate="2021-12-03" />

		{/*-- With disabled dates --*/}
		<KvCalendarSingleDateSelector disabledDates={['2021-12-01', '2021-12-04', '2021-12-05']} />

		{/*-- With min and max --*/}
		<KvCalendarSingleDateSelector minDate="2021-12-04" maxDate="2023-02-12" />
	</>
);
```
