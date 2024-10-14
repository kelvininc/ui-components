/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { EApplyDefaults, KvSchemaForm, SchemaFormProps, EComponentSize, EIconName, ETooltipPosition, ISelectMultiOptions, ISelectSingleOptions } from '@kelvininc/react-ui-components';
import { IChangeEvent } from '@rjsf/core';
import { ComponentProps, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { FormValidation } from '@rjsf/utils';

import { getDropdownDisplayValue } from '../../../helpers/dropdown.helper';

enum EShowErrorListType {
	Top = 'top',
	Bottom = 'bottom',
	None = 'none'
}

const FormTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = args => (
	<div style={{ height: '500px' }}>
		<KvSchemaForm<any>
			{...args}
			onSubmit={(e: IChangeEvent<any>) => {
				action('submit')(e);
			}}
			customValidate={(data: any, errors: FormValidation<any>) => {
				console.log('customValidate', data);
				return errors;
			}}
		/>
	</div>
);

const meta = {
	title: 'Form/SchemaForm',
	component: KvSchemaForm,
	render: FormTemplate,
	argTypes: {
		onChange: {
			action: 'change'
		},
		onError: {
			action: 'error'
		},
		onSubmit: {
			action: 'submit'
		},
		showErrorList: {
			control: { type: 'inline-radio' },
			options: Object.values(EShowErrorListType)
		},
		applyDefaults: {
			control: { type: 'inline-radio' },
			options: Object.values(EApplyDefaults)
		}
	}
} satisfies Meta<typeof KvSchemaForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {
			'number-example': 2.3,
			'integer-example': 1,
			'boolean-example': true,
			'enum-example': 'foo',
			'string-example': 'value',
			'multipleChoicesList-example': ['fuzz', 'qux']
		},
		schema: {
			type: 'object',
			properties: {
				'number-example': {
					title: 'Number',
					type: 'number',
					minimum: -10.0,
					maximum: 10,
					description: 'Number description'
				},
				'integer-example': {
					title: 'Integer',
					type: 'integer',
					minimum: -10,
					maximum: 10
				},
				'boolean-example': {
					title: 'Boolean',
					type: 'boolean'
				},
				'enum-example': {
					title: 'Enum',
					type: 'string',
					enum: ['foo', 'bar']
				},
				'string-example': {
					title: 'String',
					type: 'string',
					minLength: 5,
					maxLength: 10,
					pattern: '^[a-zA-Z0-9]*$'
				},
				'basic-example': {
					title: 'Examples',
					description: 'A input with example values',
					type: 'string',
					examples: ['Firefox', 'Chrome', 'Opera', 'Vivaldi', 'Safari']
				},
				'multipleChoicesList-example': {
					type: 'array',
					title: 'A multiple choices list',
					items: {
						type: 'string',
						enum: ['bar', 'fuzz', 'qux', 'bar1', 'fuzz1', 'qux1', 'bar2', 'fuzz2', 'qux2']
					},
					uniqueItems: true
				}
			}
		},
		uiSchema: {
			'multipleChoicesList-example': {
				searchable: true,
				selectionClearable: true
			}
		}
	}
};

export const FilesUpload: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {},
		schema: {
			type: 'object',
			properties: {
				multiple_files: {
					type: 'array',
					maxItems: 2,
					items: {
						type: 'string',
						format: 'data-url'
					}
				},
				single_file: {
					title: 'Single File (with download)',
					type: 'string',
					format: 'data-url'
				}
			},
			required: ['single_file', 'multiple_files']
		},
		uiSchema: {
			single_file: {
				'ui:filePreview': true
			}
		}
	}
};

export const IfThenElseForm: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {},
		schema: {
			type: 'object',
			properties: {
				animal: {
					enum: ['Cat', 'Fish']
				}
			},
			allOf: [
				{
					if: {
						properties: {
							animal: {
								const: 'Cat'
							}
						}
					},
					then: {
						properties: {
							food: {
								type: 'string',
								enum: ['meat', 'grass', 'fish']
							}
						},
						required: ['food']
					}
				},
				{
					if: {
						properties: {
							animal: {
								const: 'Fish'
							}
						}
					},
					then: {
						properties: {
							food: {
								type: 'string',
								enum: ['insect', 'worms']
							},
							water: {
								type: 'string',
								enum: ['lake', 'sea']
							}
						},
						required: ['food', 'water']
					}
				},
				{
					required: ['animal']
				}
			]
		}
	}
};

export const WithSubmitButtonOptions: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {
			firstName: 'Chuck',
			active: 'wrong',
			multipleChoicesList: ['foo']
		},
		uiSchema: {
			'ui:submitButtonOptions': {
				props: { disabled: false, tooltipText: 'Test to button tooltip', tooltipPosition: ETooltipPosition.Top },
				norender: false,
				submitText: 'Save Button'
			},
			'multipleChoicesList': {
				'ui:enumDisabled': ['bar']
			}
		},
		schema: {
			title: 'Contextualized errors',
			type: 'object',
			properties: {
				firstName: {
					type: 'string',
					title: 'First name',
					minLength: 8,
					pattern: '\\d+'
				},
				active: {
					type: 'boolean',
					title: 'Active'
				},
				multipleChoicesList: {
					type: 'array',
					title: 'Pick max two items',
					uniqueItems: true,
					maxItems: 2,
					items: {
						type: 'string',
						enum: ['foo', 'bar', 'fuzz']
					}
				}
			}
		}
	}
};

export const WithErrorList: Story = {
	args: {
		showErrorList: 'top',
		liveValidate: true,
		disabled: false,
		formData: {
			firstName: 'Chuck',
			active: 'wrong',
			multipleChoicesList: ['foo', 'bar', 'fuzz']
		},
		schema: {
			title: 'Contextualized errors',
			type: 'object',
			properties: {
				firstName: {
					type: 'string',
					title: 'First name',
					minLength: 8,
					pattern: '\\d+'
				},
				active: {
					type: 'boolean',
					title: 'Active'
				},
				multipleChoicesList: {
					type: 'array',
					title: 'Pick max two items',
					uniqueItems: true,
					maxItems: 2,
					items: {
						type: 'string',
						enum: ['foo', 'bar', 'fuzz']
					}
				}
			}
		}
	}
};

export const WithAdditionalProperties: Story = {
	args: {
		liveValidate: true,
		disabled: false,
		formData: {},
		schema: {
			title: 'Additional Properties form',
			description: 'A simple form with additional properties example.',
			type: 'object',
			required: ['firstName', 'lastName'],
			additionalProperties: {
				type: 'number'
			},
			properties: {
				firstName: {
					type: 'string',
					title: 'First name'
				},
				lastName: {
					type: 'string',
					title: 'Last name'
				}
			}
		}
	}
};

export const WithArrayFields: Story = {
	args: {
		liveValidate: true,
		disabled: false,
		uiSchema: {
			listOfStrings: {
				items: {
					'ui:title': ' ',
					'ui:emptyValue': ''
				}
			},
			minItemsList: {
				items: {
					'ui:title': ' '
				}
			},
			nestedList: {
				items: {
					items: {
						'ui:title': ' '
					}
				}
			},
			unorderable: {
				'items': {
					'ui:title': ' '
				},
				'ui:options': {
					orderable: false
				}
			},
			unremovable: {
				'items': {
					'ui:title': ' '
				},
				'ui:options': {
					removable: false
				}
			},
			noToolbar: {
				'ui:options': {
					addable: false,
					orderable: false,
					removable: false
				}
			},
			fixedNoToolbar: {
				'ui:options': {
					addable: false,
					orderable: false,
					removable: false
				}
			}
		},
		schema: {
			definitions: {
				Thing: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							default: 'Default name'
						}
					}
				}
			},
			type: 'object',
			properties: {
				listOfStrings: {
					type: 'array',
					title: 'A list of strings',
					items: {
						type: 'string',
						default: 'bazinga'
					}
				},
				multipleChoicesList: {
					type: 'array',
					title: 'A multiple choices list',
					items: {
						type: 'string',
						enum: ['foo', 'bar', 'fuzz', 'qux']
					},
					uniqueItems: true
				},
				fixedItemsList: {
					type: 'array',
					title: 'A list of fixed items',
					items: [
						{
							title: 'A string value',
							type: 'string',
							default: 'lorem ipsum'
						},
						{
							title: 'a boolean value',
							type: 'boolean'
						}
					],
					additionalItems: {
						title: 'Additional item',
						type: 'number'
					}
				},
				minItemsList: {
					type: 'array',
					title: 'A list with a minimal number of items',
					minItems: 3,
					items: {
						$ref: '#/definitions/Thing'
					}
				},
				defaultsAndMinItems: {
					type: 'array',
					title: 'List and item level defaults',
					minItems: 5,
					default: ['carp', 'trout', 'bream'],
					items: {
						type: 'string'
					}
				},
				nestedList: {
					type: 'array',
					title: 'Nested list',
					items: {
						type: 'array',
						title: 'Inner list',
						items: {
							type: 'string',
							default: 'lorem ipsum'
						}
					}
				},
				unorderable: {
					title: 'Unorderable items',
					type: 'array',
					items: {
						type: 'string',
						default: 'lorem ipsum'
					}
				},
				unremovable: {
					title: 'Unremovable items',
					type: 'array',
					items: {
						type: 'string',
						default: 'lorem ipsum'
					}
				},
				noToolbar: {
					title: 'No add, remove and order buttons',
					type: 'array',
					items: {
						type: 'string',
						default: 'lorem ipsum'
					}
				},
				fixedNoToolbar: {
					title: 'Fixed array without buttons',
					type: 'array',
					items: [
						{
							title: 'A number',
							type: 'number',
							default: 42
						},
						{
							title: 'A boolean',
							type: 'boolean',
							default: false
						}
					],
					additionalItems: {
						title: 'A string',
						type: 'string',
						default: 'lorem ipsum'
					}
				}
			}
		}
	}
};

const DiscardChangesTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = args => {
	const [submittedData, setSubmittedData] = useState({});
	return (
		<KvSchemaForm<any>
			{...args}
			submittedData={submittedData}
			onSubmit={(data: IChangeEvent<any>) => {
				action('submit')(data);
				setSubmittedData(data.formData);
			}}
			customValidate={(data: any, errors: FormValidation<any>) => {
				console.log('customValidate', data);
				return errors;
			}}
		/>
	);
};

export const AllowDiscardChanges: Story = {
	render: DiscardChangesTemplate,
	args: {
		allowDiscardChanges: true,
		showErrorList: 'top',
		liveValidate: true,
		disabled: false,
		formData: {},
		schema: {
			title: 'Discard changes form',
			description: '!!! The form is always reset to the values provided in the submittedData property. \nYou need update the submittedData property after a success submit.',
			type: 'object',
			required: ['firstName', 'lastName'],
			properties: {
				firstName: {
					type: 'string',
					title: 'First name',
					default: 'Chuck'
				},
				lastName: {
					type: 'string',
					title: 'Last name'
				},
				telephone: {
					type: 'string',
					title: 'Telephone',
					minLength: 10
				}
			}
		}
	}
};

export const CustomSelectWidgetConfigs: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		allowDiscardChanges: true,
		formData: {},
		schema: {
			type: 'object',
			properties: {
				alarm_severities: {
					type: 'array',
					title: 'Severity',
					uniqueItems: true,
					items: {
						type: 'number',
						oneOf: [
							{
								title: 'Critical',
								const: 1
							},
							{
								title: 'Urgent',
								const: 2
							},
							{
								title: 'Advisory',
								const: 3
							},
							{
								title: 'Medium',
								const: 4
							},
							{
								title: 'Low',
								const: 5
							}
						]
					}
				},
				alarm_statuses: {
					type: 'array',
					title: 'Status',
					uniqueItems: true,
					items: {
						type: 'string',
						oneOf: [
							{
								title: 'Acknowledged',
								const: 'acknowledged'
							},
							{
								title: 'Active',
								const: 'active'
							},
							{
								title: 'Resolved',
								const: 'resolved'
							}
						]
					}
				}
			}
		},
		uiSchema: {
			alarm_severities: {
				displayValue(selectedOptions: string[], options: ISelectSingleOptions | ISelectMultiOptions) {
					return getDropdownDisplayValue(selectedOptions, options, 'status');
				}
			},
			alarm_statuses: {
				searchable: true,
				selectionClearable: true
			}
		}
	}
};

export const CheckboxesWidget: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		allowDiscardChanges: true,
		formData: { alarm_statuses: ['resolved'] },
		schema: {
			type: 'object',
			properties: {
				alarm_statuses: {
					type: 'array',
					title: 'Status',
					uniqueItems: true,
					minItems: 1,
					items: {
						type: 'string',
						oneOf: [
							{
								title: 'Active',
								const: 'active'
							},
							{
								title: 'Acknowledged',
								const: 'acknowledged'
							},
							{
								title: 'Resolved',
								const: 'resolved'
							}
						]
					}
				}
			}
		},
		uiSchema: {
			alarm_statuses: {
				'ui:widget': 'checkboxes',
				'ui:allButton': true
			}
		}
	}
};

export const TextareaWidget: Story = {
	args: {
		schema: {
			type: 'object',
			properties: {
				description: {
					type: 'string',
					title: 'Description'
				}
			},
			required: ['description']
		},
		uiSchema: {
			'description': {
				'ui:widget': 'textarea',
				'maxCharLength': 200,
				'iconName': EIconName.Notes,
				'ui:placeholder': 'Add description'
			},
			'ui:submitButtonOptions': {
				norender: true
			}
		}
	}
};

const inlineSchema: SchemaFormProps<any>['schema'] = {
	type: 'object',
	properties: {
		shift_info: {
			title: 'Shift info',
			type: 'object',
			properties: {
				name: {
					title: 'Shift name',
					type: 'string'
				},
				start_at: {
					title: 'Starts at',
					type: 'string',
					format: 'date-time'
				},
				end_at: {
					title: 'Ends at',
					type: 'string',
					format: 'date-time',
					formatExclusiveMinimum: { $data: '1/start_at' }
				}
			},
			required: ['name', 'start_at', 'end_at']
		},
		production_info: {
			title: 'Production info',
			type: 'object',
			properties: {
				sku: {
					title: 'SKU',
					type: 'string'
				},
				expected_start_at: {
					title: 'Expected to start at',
					type: 'string',
					format: 'date-time'
				},
				expected_end_at: {
					title: 'Expected to end at',
					type: 'string',
					format: 'date-time',
					formatExclusiveMinimum: { $data: '1/expected_start_at' }
				}
			},
			required: ['sku', 'expected_start_at', 'expected_end_at']
		},
		team_info: {
			title: 'Team info',
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						title: 'Name',
						type: 'string'
					},
					email: {
						title: 'Email',
						type: 'string',
						format: 'email'
					},
					phone_country_code: {
						title: 'Phone country code',
						type: 'string'
					},
					phone_number: {
						title: 'Phone number',
						type: 'number'
					},
					role: {
						title: 'Role',
						type: 'string'
					},
					responsible_for: {
						title: 'Asset responsible for',
						type: 'string',
						oneOf: [
							{
								title: 'Asset 3',
								const: 'asset-name-3'
							},
							{
								title: 'Asset 2',
								const: 'asset-name-2'
							},
							{
								title: 'Asset 1',
								const: 'asset-name-1'
							}
						]
					}
				},
				required: ['name', 'email', 'phone_country_code', 'phone_number', 'role', 'responsible_for']
			}
		},
		assets_oee: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					asset_name: {
						type: 'string',
						oneOf: [
							{
								title: 'Asset 3',
								const: 'asset-name-3'
							},
							{
								title: 'Asset 2',
								const: 'asset-name-2'
							},
							{
								title: 'Asset 1',
								const: 'asset-name-1'
							}
						]
					},
					oee_thresholds: {
						title: 'OEE - Thresholds',
						type: 'object',
						properties: {
							target: {
								title: 'OEE Target',
								type: 'number',
								exclusiveMinimum: 0
							},
							critical_alarm: {
								title: 'OEE Critical',
								type: 'number',
								exclusiveMinimum: 0
							},
							warning_alarm: {
								title: 'OEE Urgent',
								type: 'number',
								exclusiveMinimum: 0
							}
						},
						required: ['target', 'critical_alarm', 'warning_alarm']
					},
					oee_calculation: {
						title: 'OEE - Calculation',
						type: 'object',
						properties: {
							ideal_cycle_time: {
								title: 'Ideal cycle time',
								type: 'number',
								exclusiveMinimum: 0
							},
							total_units: {
								title: 'Total units',
								type: 'number',
								exclusiveMinimum: 0
							},
							good_units: {
								title: 'Good units',
								type: 'number',
								exclusiveMinimum: 0,
								maximum: {
									$data: '1/total_units'
								} as any
							},
							run_time: {
								title: 'Run time',
								type: 'number',
								exclusiveMinimum: 0,
								maximum: {
									$data: '1/planned_production_time'
								} as any // Type conflict occurs because JSONSchema7 don't support (yet) dynamic values but AJV Validate allow it. https://ajv.js.org/guide/combining-schemas.html#data-reference
							},
							planned_production_time: {
								title: 'Planned production time',
								type: 'number',
								minimum: 0
							}
						},
						required: ['ideal_cycle_time', 'total_units', 'good_units', 'run_time', 'planned_production_time']
					}
				}
			}
		}
	}
};

const inlineUiSchema: SchemaFormProps<any>['uiSchema'] = {
	'ui:inputConfig': {
		width: 'fit-content',
		minWidth: '132px',
		maxWidth: 'unset'
	},
	'shift_info': {
		'ui:inline': true,
		'ui:inputWidth': 'fit-content'
	},
	'production_info': {
		'ui:inline': true,
		'ui:inputWidth': '200px'
	},
	'team_info': {
		'ui:itemPrefix': 'Collaborator',
		'ui:options': {
			addable: true,
			orderable: false,
			removable: true
		},
		'items': {
			'ui:title': '',
			'ui:itemPrefix': 'Collaborator',
			'ui:inline': true,
			'ui:inputWidth': 'fit-content',
			'responsible_for': {
				'searchable': true,
				'ui:placeholder': ''
			}
		}
	},
	'assets_oee': {
		'ui:title': '',
		'ui:options': {
			addable: false,
			orderable: false,
			removable: false
		},
		'ui:inputWidth': 'fit-content',
		'items': {
			'ui:title': '',
			'ui:fieldset': true,
			'asset_name': {
				'ui:widget': 'readOnlyValue',
				'ui:readonly': true,
				'ui:options': {
					label: false
				}
			},
			'oee_thresholds': {
				'ui:inline': true,
				'ui:inputWidth': 'fit-content'
			},
			'oee_calculation': {
				'ui:inline': true,
				'ui:inputWidth': '400px'
			}
		}
	}
};

export const InlineForm: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		allowDiscardChanges: true,
		formData: {
			shift_info: {
				start_at: '2022-11-16T00:00:00Z',
				end_at: '2022-11-17T00:00:00Z'
			},
			team_info: [{}],
			assets_oee: [{ asset_name: 'asset-name-3' }, { asset_name: 'asset-name-2' }]
		},
		schema: inlineSchema,
		uiSchema: inlineUiSchema
	}
};

export const NotApplyDefaultsWidget: Story = {
	args: {
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		formContext: { showDefaultValueHelper: true, defaultValueHelperPrefix: 'Default: ' },
		schema: {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					title: 'Title:',
					default: 'lorem ipsum'
				},
				description: {
					type: 'string',
					title: 'Description:',
					default: 'lorem ipsum lorem ipsum lorem ipsum'
				}
			},
			required: ['title']
		},
		uiSchema: {
			description: {
				'ui:options': {
					placeholder: 'Add description',
					showDefaultValueHelper: false
				}
			}
		}
	}
};

export const AlowResetToDefaultsWidget: Story = {
	args: {
		applyDefaults: EApplyDefaults.Never,
		allowDiscardChanges: true,
		allowResetToDefaults: true,
		liveValidate: true,
		formContext: { showDefaultValueHelper: true, defaultValueHelperPrefix: 'Default: ' },
		schema: {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					title: 'Title:',
					default: 'lorem ipsum'
				},
				description: {
					type: 'string',
					title: 'Description:',
					default: 'lorem ipsum lorem ipsum lorem ipsum'
				}
			},
			required: ['title']
		},
		uiSchema: {
			description: {
				'ui:options': {
					placeholder: 'Add description',
					showDefaultValueHelper: true
				}
			}
		}
	}
};

export const UiSchemaOptions: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {
			'number-example': 2.3,
			'integer-example': 1,
			'boolean-example': true,
			'enum-example': 'foo',
			'string-example': 'value',
			'multipleChoicesList-example': ['fuzz', 'qux']
		},
		schema: {
			type: 'object',
			properties: {
				'number-example': {
					title: 'Number',
					type: 'number',
					minimum: -10.0,
					maximum: 10,
					description: 'Number description'
				},
				'integer-example': {
					title: 'Integer',
					type: 'integer',
					minimum: -10,
					maximum: 10
				},
				'boolean-example': {
					title: 'Boolean',
					type: 'boolean'
				},
				'enum-example': {
					title: 'Enum',
					type: 'string',
					enum: ['foo', 'bar']
				},
				'string-example': {
					title: 'String',
					type: 'string',
					minLength: 5,
					maxLength: 10,
					pattern: '^[a-zA-Z0-9]*$'
				},
				'basic-example': {
					title: 'Examples',
					description: 'A input with example values',
					type: 'string',
					examples: ['Firefox', 'Chrome', 'Opera', 'Vivaldi', 'Safari']
				},
				'multipleChoicesList-example': {
					type: 'array',
					title: 'A multiple choices list',
					items: {
						type: 'string',
						enum: ['bar', 'fuzz', 'qux', 'bar1', 'fuzz1', 'qux1', 'bar2', 'fuzz2', 'qux2']
					},
					uniqueItems: true
				}
			}
		},
		/**
		 *  Here we are passing the ui defaults for the inputs to have a component large size
		 * However, the values applied to the multipleChoicesList-example will be the values inside the property key.
		 * Therefore, when we have default values, it is possible to override if needed.
		 *  */
		uiSchema: {
			'ui:componentSize': EComponentSize.Small,
			'ui:dropdownConfig': {
				zIndex: 200
			},
			'multipleChoicesList-example': {
				zIndex: 10,
				componentSize: EComponentSize.Large,
				searchable: true,
				selectionClearable: true
			}
		}
	}
};

export const SelectBooleanField: Story = {
	args: {
		schema: {
			type: 'object',
			properties: {
				value: {
					type: 'boolean',
					oneOf: [
						{
							title: 'Truthy',
							const: true
						},
						{
							title: 'Falsy',
							const: false
						}
					]
				}
			},
			required: ['value']
		},
		uiSchema: {
			value: {
				'ui:widget': 'select'
			}
		}
	}
};
