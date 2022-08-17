```tsx
import React from 'react';

import { KvAvanceDateSelectDropdown, ECalendarAdvanceTimeType } from '@kelvininc/react-ui-components';

export const KvAvanceDateExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvAvanceDateSelectDropdown />

		{/*-- With selected relative time --*/}
		<KvAvanceDateSelectDropdown
			selectedTime={{
				type: ECalendarAdvanceTimeType.Relative,
				payload: {
					key: 'last-24-h',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected absolute time --*/}
		<KvAvanceDateSelectDropdown
			selectedTime={{
				type: ECalendarAdvanceTimeType.Absolute,
				payload: {
					key: '2021-12-01T00:00:00Z#2021-12-05T23:59:59Z',
					range: ['2021-12-01T00:00:00', '2021-12-05T23:59:59Z']
				}
			}}
		/>

		{/*-- With selected timezone --*/}
		<KvAvanceDateSelectDropdown selectedTimezone="Europe/Lisbon" />
	</>
);
```
