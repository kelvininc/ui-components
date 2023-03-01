```tsx
import React from 'react';

import { KvTimePickerCalendar } from '@kelvininc/react-ui-components';

export const KvTimePickerCalendarExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTimePickerCalendar />

		{/*-- With initial date --*/}
		<KvTimePickerCalendar initialDate="2022-08-04" />
	</>
);
```
