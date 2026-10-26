```tsx
import React from 'react';

import { KvSwitchButton } from '@kelvininc/react-ui-components/client';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" />

		{/*-- Disabled --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" disabled />

		{/*-- ON/OFF --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" checked />
		<KvSwitchButton accessibleLabel="Enable telemetry" checked={false} />
	</>
);
```
