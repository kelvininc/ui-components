import type { Meta, StoryObj } from '@storybook/react';
import { KvWizard, EStepState } from '@kelvininc/react-ui-components';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

const meta = {
	title: 'Navigation/Wizard',
	component: KvWizard,
	render: function Renderer(args) {
		const [currentStep, setCurrentStep] = useState(args.currentStep);

		const handleGoToStep = (event: CustomEvent<number>) => {
			setCurrentStep(event.detail);
			action('goToStep')(event);
		};

		const styles = {
			height: '600px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white'
		};

		return (
			<div style={{ height: '500px' }}>
				<KvWizard style={{ '--wizard-stepper-width': '160px' }} {...args} currentStep={currentStep} onGoToStep={handleGoToStep}>
					<div slot="step-content" style={{ height: '100%', overflow: 'scroll' }}>
						{currentStep === 0 && <div style={{ backgroundColor: 'gray', ...styles }}>Step 1 Content</div>}
						{currentStep === 1 && <div style={{ backgroundColor: 'black', ...styles }}>Step 2 Content</div>}
					</div>
				</KvWizard>
			</div>
		);
	},
	argTypes: {
		onGoToStep: {
			action: 'goToStep'
		},
		onCompleteClick: {
			action: 'completeClick'
		},
		onCancelClick: {
			action: 'cancelClick'
		},
		currentStepState: {
			control: 'select',
			options: ['', ...Object.values(EStepState)]
		}
	}
} satisfies Meta<typeof KvWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEFAULT_ARGS = {
	steps: [
		{
			title: 'Info',
			cancelable: true
		},
		{
			title: 'Configuration',
			allowGoBack: true,
			tip: 'Add·your·custom·configurations·here.'
		},
		{
			title: 'Confirmation',
			allowGoBack: true
		}
	],
	currentStep: 1,
	showStepBar: true,
	completeBtnLabel: 'Deploy',
	currentStepState: EStepState.Success
};

export const SuccessState: Story = {
	args: {
		...DEFAULT_ARGS
	}
}

export const ErrorState: Story = {
	args: {
		...DEFAULT_ARGS,
		currentStepState: EStepState.Error
	}
}

export const WithoutHeader: Story = {
	args: {
		...DEFAULT_ARGS,
		showHeader: false
	}
}

export const WithoutStepBar: Story = {
	args: {
		...DEFAULT_ARGS,
		showStepBar: false
	}
}

export const WithoutGoBack: Story = {
	args: {
		...DEFAULT_ARGS,
		steps: [
			{
				title: 'Info',
				allowGoBack: false
			},
			{
				title: 'Configuration',
				allowGoBack: false
			},
			{
				title: 'Confirmation',
				allowGoBack: false
			}
		]
	}
}
