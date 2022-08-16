```tsx
import React from 'react';

import { KvCalendar } from '@kelvininc/react-ui-components';

export const KvCalendarExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendar />

		{/*-- With initial date --*/}
		<KvCalendar initialDate="2022-08-04" />
	</>
);
```
