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
