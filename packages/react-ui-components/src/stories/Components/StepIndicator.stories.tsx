import { ComponentStory } from '@storybook/react';
import React, { useMemo } from 'react';
import { KvStepIndicator } from '../../components';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Data Display/Step Indicator',
	component: 'kv-step-indicator',
	argTypes: {
		enabled: {
			control: {
				type: 'boolean'
			}
		},
		active: {
			control: {
				type: 'boolean'
			}
		},
		hasError: {
			control: {
				type: 'boolean'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/step-indicator/readme.md')
	}
};

KvStepIndicator.displayName = 'KvStepIndicator';

const StepIndicatorTemplate: ComponentStory<typeof KvStepIndicator> = args => {
	const onStepClick = useMemo(() => action('The step has been clicked'), []);
	return <KvStepIndicator {...args} onIndicatorClicked={onStepClick} />;
};

export const Default = StepIndicatorTemplate.bind(this);

export const ClickEnabled = StepIndicatorTemplate.bind(this);
ClickEnabled.args = {
	enabled: true
};

export const Active = StepIndicatorTemplate.bind(this);
Active.args = {
	active: true
};

export const WithError = StepIndicatorTemplate.bind(this);
WithError.args = {
	hasError: true
};
