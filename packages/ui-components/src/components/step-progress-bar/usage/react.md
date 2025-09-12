```tsx
import React from 'react';

import { KvStepProgressBar } from '@kelvininc/react-ui-components/client';

export const StepProgressBarExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvStepProgressBar progressPercentage={50}>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
		{/*-- Has errors --*/}
		<KvStepProgressBar progressPercentage={50} hasError>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
	</>
);
```
