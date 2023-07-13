import { IWizardStep } from '../wizard.types';

export const MOCK_STEPS: IWizardStep[] = [
	{
		title: 'Info',
		cancelable: true
	},
	{
		title: 'Configuration',
		allowGoBack: true
	},
	{
		title: 'Confirmation',
		allowGoBack: true
	}
];
