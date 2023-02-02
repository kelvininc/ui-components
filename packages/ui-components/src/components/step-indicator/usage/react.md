```tsx
import React from 'react';

import { KvStepIndicator } from '@kelvininc/react-ui-components';

export const StepIndicatorExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvStepIndicator></KvStepIndicator>
		{/*-- Enabled --*/}
		<KvStepIndicator enabled></KvStepIndicator>
		{/*-- Active --*/}
		<KvStepIndicator active></KvStepIndicator>
		{/*-- With Error --*/}
		<KvStepIndicator hasError></KvStepIndicator>
	</>
);
```
