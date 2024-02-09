```tsx
import React from 'react';

import { KvAbsoluteTimePicker } from '@kelvininc/react-ui-components';

export const KvAbsoluteTimePicker: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvAbsoluteTimePicker />

		{/*-- With selected date --*/}
		<KvAbsoluteTimePicker selectedDates={['2022-08-04', '2022-09-01']} />

		{/*-- With initial date --*/}
		<KvAbsoluteTimePicker initialDate="2021-12-03" />

		{/*-- With disabled dates --*/}
		<KvAbsoluteTimePicker disabledDates={['2021-12-01', '2021-12-04', '2021-12-05']} />

		{/*-- With min and max --*/}
		<KvAbsoluteTimePicker minDate="2021-12-04" maxDate="2023-02-12" />
	</>
);
```
