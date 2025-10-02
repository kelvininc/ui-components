```tsx
import React from 'react';

import { KvCalendarDay } from '@kelvininc/react-ui-components/client';

export const KvCalendarDayExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCalendarDay day={12} />

		{/*-- Active --*/}
		<KvCalendarDay day={12} active={true} />

		{/*-- Disabled --*/}
		<KvCalendarDay day={12} disabled={true} />

		{/*-- In Range --*/}
		<KvCalendarDay day={12} inHoverRange={true} />
	</>
);
```
