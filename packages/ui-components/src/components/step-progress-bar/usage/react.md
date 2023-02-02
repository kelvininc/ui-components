```tsx
import React from 'react';

import { KvStepProgressBar } from '@kelvininc/react-ui-components';

export const StepProgressBarExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvStepProgressBar progressPercentage={50}></KvStepProgressBar>
		{/*-- Has errors --*/}
		<KvStepProgressBar progressPercentage={50} hasError></KvStepProgressBar>
	</>
);
```
