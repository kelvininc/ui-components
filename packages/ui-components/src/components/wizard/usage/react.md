```tsx
import React from 'react';

import { IWizardStep, KvWizard } from '@kelvininc/react-ui-components';

export const KvWizardExample: React.FC = () => {
	const steps: IWizardStep[]  = [
		{
			title: 'Info' ,
			allowGoBack: true
		},
		{
			enabled: 'Configuration',
			allowGoBack: true
		}
	];

	const onGoToStep = ({ detail }: CustomEvent<number>) => {};
	const onSubmitClick = (ev: CustomEvent<void>) => {};
	const onCancelClick = (ev: CustomEvent<void>) => {};

	return (
		<KvWizardFooter
			steps={steps}
			currentStep={0}
			hasError={false}
			showStepBar={true}
			showHeader={true}
			submitBtnLabel="Deploy"
			onGoToStep={onGoToStep}
			onSubmitClick={onSubmitClick}
			onCancelClick={onCancelClick} />
	);
};
```
