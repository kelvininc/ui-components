```tsx
import React from 'react';

import { KvWizardFooter } from '@kelvininc/react-ui-components/client';
import { BUTTONS_CONFIG } from './config';

export const KvWizardFooterExample: React.FC = () => {
	const stepsSuccess = [
		{
			stepKey: 'step0',
			enabled: true,
			active: true
		},
		{
			stepKey: 'step1',
			enabled: true,
			active: true
		},
		{
			stepKey: 'step2',
			enabled: false
		}
	];

	const stepsError = [
		{
			stepKey: 'step0',
			enabled: true,
			active: true,
			hasError: true
		},
		{
			stepKey: 'step1',
			enabled: true,
			active: true,
			hasError: true
		},
		{
			stepKey: 'step2',
			enabled: false
		}
	];

	const onStepClick = ({ detail }: CustomEvent<number>) => {};
	const onPrevClick = (ev: CustomEvent<void>) => {};
	const onNextClick = (ev: CustomEvent<void>) => {};

	return (
		<>
			{/*-- Default --*/}
			<KvWizardFooter
				steps={stepsSuccess}
				currentStep={0}
				progressPercentage={50}
				onStepClick={onStepClick}
				onPrevClick={onPrevClick}
				onNextClick={onNextClick} />
			{/*-- Has errors --*/}
			<KvWizardFooter
				steps={stepsError}
				currentStep={0}
				progressPercentage={50}
				onStepClick={onStepClick}
				onPrevClick={onPrevClick}
				onNextClick={onNextClick}
				hasError />
		</>
	);
};
```
