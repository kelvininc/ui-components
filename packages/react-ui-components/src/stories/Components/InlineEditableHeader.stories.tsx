import { ComponentStory } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { EComponentSize, EIconName, EInputFieldType, EValidationState, IInlineEditableHeader, KvInlineEditableHeader } from '../../components';
import { action } from '@storybook/addon-actions';

KvInlineEditableHeader.displayName = 'KvInlineEditableHeader';

export default {
	title: 'Inputs/InlineEditableHeader',
	component: 'kv-inline-editable-header',
	argTypes: {
		type: {
			control: {
				type: 'radio'
			},
			options: Object.values(EInputFieldType)
		},
		label: {
			control: {
				type: 'text'
			}
		},
		icon: {
			control: {
				type: 'select'
			},
			options: Object.values(EIconName)
		},
		inputName: {
			control: {
				type: 'text'
			}
		},
		examples: {
			control: {
				type: 'object'
			}
		},
		placeholder: {
			control: {
				type: 'text'
			}
		},
		maxLength: {
			control: {
				type: 'number'
			}
		},
		minLength: {
			control: {
				type: 'number'
			}
		},
		max: {
			control: {
				type: 'number'
			}
		},
		min: {
			control: {
				type: 'number'
			}
		},
		step: {
			control: { type: 'number' }
		},
		size: {
			control: {
				type: 'radio'
			},
			options: Object.values(EComponentSize)
		},
		disabled: {
			control: {
				type: 'boolean'
			}
		},
		required: {
			control: {
				type: 'boolean'
			}
		},
		loading: {
			control: {
				type: 'boolean'
			}
		},
		state: {
			control: {
				type: 'radio'
			},
			options: Object.values(EValidationState)
		},
		helpText: {
			control: {
				type: 'object'
			}
		},
		value: {
			control: {
				type: 'text'
			}
		},
		readonly: {
			control: {
				type: 'boolean'
			}
		},
		forcedFocus: {
			control: {
				type: 'boolean'
			}
		},
		tooltipConfig: {
			control: {
				type: 'object'
			}
		},
		useInputMask: {
			control: {
				type: 'boolean'
			}
		},
		inputMaskRegex: {
			control: {
				type: 'string'
			}
		},
		isEditing: {
			control: {
				type: 'boolean'
			}
		},
		onTextChange: {
			action: 'text changed...'
		},
		onTextFieldBlur: {
			action: 'text field on blur'
		},
		onModeChange: {
			action: 'on mode change'
		},
		onChangeConfirmed: {
			action: 'on change confirmed'
		},
		onChangeDiscarded: {
			action: 'on change discarded'
		}
	},
	parameters: {
		notes: require('@ui-notes/inline-editable-header/readme.md')
	}
};

const KvInlineEditableHeaderTemplate: ComponentStory<typeof KvInlineEditableHeader> = args => <KvInlineEditableHeader {...args} />;
export const Default = KvInlineEditableHeaderTemplate.bind(this);
Default.args = {
	value: 'Node 01'
};

export const Editing = KvInlineEditableHeaderTemplate.bind(this);
Editing.args = {
	value: 'Editing',
	isEditing: true
};

export const WithHelpText = KvInlineEditableHeaderTemplate.bind(this);
WithHelpText.args = {
	isEditing: true,
	value: 'Help Text',
	state: EValidationState.None,
	helpText: 'Use only alphanumerical characters'
};

export const WithErrors = KvInlineEditableHeaderTemplate.bind(this);
WithErrors.args = {
	isEditing: true,
	value: 'With Errors',
	state: EValidationState.Invalid,
	helpText: 'Use only alphanumerical characters'
};

const InteractiveTemplate: ComponentStory<typeof KvInlineEditableHeader> = args => {
	const [config, setConfig] = useState<IInlineEditableHeader>({
		value: 'Node 01',
		state: EValidationState.None,
		isEditing: false
	});

	const prevValue = useRef(config.value);

	const onTextFieldChange = ({ detail }: CustomEvent<string | number>) => {
		action('text field change event').call(this, detail);
	};

	const onTextFieldBlur = ({ detail }: CustomEvent<string | number>) => {
		setConfig({
			...config,
			value: detail
		});
		action('text field blur event').call(this, detail);
	};

	const onConfirm = () => {
		prevValue.current = config.value;
		setConfig({
			...config,
			isEditing: !config.isEditing
		});
		action('confirm button event').call(this);
	};

	const onDiscard = () => {
		setConfig({
			...config,
			isEditing: !config.isEditing,
			value: prevValue.current
		});
		action('discard button event').call(this);
	};

	const onDoubleClick = () => {
		setConfig({
			...config,
			isEditing: !config.isEditing
		});
	};

	return (
		<KvInlineEditableHeader
			{...args}
			{...config}
			onTextFieldChange={onTextFieldChange}
			onTextFieldBlur={onTextFieldBlur}
			onDoubleClick={onDoubleClick}
			onChangeConfirmed={onConfirm}
			onChangeDiscarded={onDiscard}
		/>
	);
};
export const Interactive = InteractiveTemplate.bind(this);
