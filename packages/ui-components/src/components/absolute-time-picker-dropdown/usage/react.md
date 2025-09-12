```tsx
import React from 'react';

import { KvAbsoluteTimePickerDropdown } from '@kelvininc/react-ui-components/client';

export const KvAbsoluteTimePicker: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvAbsoluteTimePickerDropdown />

		{/*-- With selected date --*/}
		<KvAbsoluteTimePickerDropdown selectedDates={['2022-08-04', '2022-09-01']} />

		{/*-- With initial date --*/}
		<KvAbsoluteTimePickerDropdown initialDate="2021-12-03" />

		{/*-- With disabled dates --*/}
		<KvAbsoluteTimePickerDropdown disabledDates={['2021-12-01', '2021-12-04', '2021-12-05']} />

		{/*-- With min and max --*/}
		<KvAbsoluteTimePickerDropdown minDate="2021-12-04" maxDate="2023-02-12" />
	</>
);
```
