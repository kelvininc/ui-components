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
