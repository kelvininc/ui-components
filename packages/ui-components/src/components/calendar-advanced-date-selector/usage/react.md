```tsx
import React from 'react';

import { KvCalendarAdvancedDateSelector, ECalendarAdvanceTimeType } from '@kelvininc/react-ui-components';

export const KvCalendarAdvancedDateExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendarAdvancedDateSelector />

		{/*-- With selected relative time --*/}
		<KvCalendarAdvancedDateSelector
			selectedTime={{
				type: ECalendarAdvanceTimeType.Relative,
				payload: {
					key: 'last-24-h',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected absolute time --*/}
		<KvCalendarAdvancedDateSelector
			selectedTime={{
				type: ECalendarAdvanceTimeType.Absolute,
				payload: {
					key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected timezone --*/}
		<KvCalendarAdvancedDateSelector selectedTimezone="Europe/Lisbon" />
	</>
);
```
