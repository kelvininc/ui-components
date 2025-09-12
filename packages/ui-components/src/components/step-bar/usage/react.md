```tsx
import React from 'react';

import { KvStepBar } from '@kelvininc/react-ui-components/client';

export const StepBarExample: React.FC = () => {
	const stepsSuccess = [
		{
			enabled: true,
			active: true
		},
		{
			enabled: true,
			active: true
		},
		{
			enabled: false
		}
	];

	const stepsError = [
		{
			enabled: true,
			active: true,
			hasError: true
		},
		{
			enabled: true,
			active: true,
			hasError: true
		},
		{
			enabled: false
		}
	];

	return (
		<>
			{/*-- Default --*/}
			<KvStepBar steps={stepsSuccess} currentStep={1} progressPercentage={50}></KvStepBar>
			{/*-- Error state --*/}
			<KvStepBar steps={stepsError} currentStep={1} progressPercentage={50} hasError></KvStepBar>
		</>
	);
};
```
