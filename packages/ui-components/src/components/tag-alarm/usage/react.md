```tsx
import React from 'react';

import { KvTagAlarm } from '@kelvininc/react-ui-components';

export const TagLetterExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTagAlarm severity={EAlarmSeverity.One} size={ETagAlarmSize.Normal}/>

	{/*-- Custom Label --*/}
	<KvTagAlarm severity={EAlarmSeverity.One} label="Example" size={ETagAlarmSize.Normal} />

	{/*-- Only with icon --*/}
	<KvTagAlarm severity={EAlarmSeverity.One} hideLabel={true} />
  </>
);

```
