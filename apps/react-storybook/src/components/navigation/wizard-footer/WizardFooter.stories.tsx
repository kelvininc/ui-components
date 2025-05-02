import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { IStepBarStep, KvWizardFooter } from '@kelvininc/react-ui-components';
import { action } from '@storybook/addon-actions';

const meta = {
	title: 'Navigation/Wizard Footer',
	component: KvWizardFooter,
	render: function Renderer(args) {
		const onPrevClick = useMemo(() => action('previous was clicked'), []);
		const onNextClick = useMemo(() => action('next was clicked'), []);
		const onStepClick = useMemo(() => action('step was clicked'), []);

		return <KvWizardFooter {...args} onPrevClick={onPrevClick} onNextClick={onNextClick} onStepClick={onStepClick} style={{ '--stepper-width': '160px' }} />;
	},
	argTypes: {
		label: {
			control: {
				type: 'text'
			}
		},
		steps: {
			control: {
				type: 'object'
			}
		},
		currentStep: {
			control: {
				type: 'number'
			}
		},
		progressPercentage: {
			control: {
				type: 'number'
			}
		},
		hasError: {
			control: {
				type: 'boolean'
			}
		},
		showStepBar: {
			control: {
				type: 'boolean'
			}
		},
		completeBtnLabel: {
			control: {
				type: 'text'
			}
		},
		cancelEnabled: {
			control: {
				type: 'boolean'
			}
		},
		prevEnabled: {
			control: {
				type: 'boolean'
			}
		},
		nextEnabled: {
			control: {
				type: 'boolean'
			}
		},
		completeEnabled: {
			control: {
				type: 'boolean'
			}
		},
		showCancelBtn: {
			control: {
				type: 'boolean'
			}
		},
		showPrevBtn: {
			control: {
				type: 'boolean'
			}
		},
		showNextBtn: {
			control: {
				type: 'boolean'
			}
		},
		showCompleteBtn: {
			control: {
				type: 'boolean'
			}
		}
	}
} satisfies Meta<typeof KvWizardFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS_MOCK_SUCCESS: IStepBarStep[] = [
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

export const Default: Story = {
	args: {
		steps: STEPS_MOCK_SUCCESS,
		currentStep: 1,
		progressPercentage: 50
	}
}

export const WithPrevious: Story = {
	args: {
		steps: STEPS_MOCK_SUCCESS,
		currentStep: 1,
		progressPercentage: 50,
		showPrevBtn: true
	}
}

const STEPS_MOCK_ERROR: IStepBarStep[] = [
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

export const WithError: Story = {
	args: {
		steps: STEPS_MOCK_ERROR,
		currentStep: 1,
		progressPercentage: 50,
		hasError: true
	}
}
