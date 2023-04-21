import { IMultiSelectDropdownOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';
import { IChangeEvent } from '@rjsf/core';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvSchemaForm, SchemaFormProps } from '../../components';
import { getDropdownDisplayValue } from './helpers/dropdown.helper';
import { action } from '@storybook/addon-actions';
import { FormValidation } from '@rjsf/utils';

enum EShowErrorListType {
	Top = 'top',
	Bottom = 'bottom',
	None = 'none'
}

export default {
	title: 'Form/SchemaForm',
	component: 'KvSchemaForm',
	argTypes: {
		onChange: {
			action: 'change'
		},
		onError: {
			action: 'error'
		},
		showErrorList: {
			control: { type: 'inline-radio' },
			options: Object.values(EShowErrorListType)
		}
	},
	parameters: {
		notes: require('../../components/SchemaForm/readme.md')
	}
};

const FormTemplate: ComponentStory<any> = args => (
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
		></KvSchemaForm>
	</div>
);

export const Default = FormTemplate.bind(this);
Default.args = {
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
					enum: ['bar', 'fuzz', 'qux']
				},
				uniqueItems: true
			}
		}
	}
};

export const IfThenElseForm = FormTemplate.bind(this);
IfThenElseForm.args = {
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
};

export const WithSubmitButtonOptions = FormTemplate.bind(this);
WithSubmitButtonOptions.args = {
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
			props: { disabled: false },
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
};

export const WithErrorList = FormTemplate.bind(this);
WithErrorList.args = {
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
};

export const WithAdditionalProperties = FormTemplate.bind(this);
WithAdditionalProperties.args = {
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
};

export const WithArrayFields = FormTemplate.bind(this);
WithArrayFields.args = {
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
};

const DiscardChangesTemplate: ComponentStory<any> = args => {
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
		></KvSchemaForm>
	);
};

export const AllowDiscardChanges = DiscardChangesTemplate.bind(this);
AllowDiscardChanges.args = {
	allowDiscardChanges: true,
	showErrorList: true,
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
};

export const CustomSelectWidgetConfigs = FormTemplate.bind(this);
CustomSelectWidgetConfigs.args = {
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
			displayValue(selectedOptions: string[], options: ISingleSelectDropdownOptions | IMultiSelectDropdownOptions) {
				return getDropdownDisplayValue(selectedOptions, options, 'status');
			}
		},
		alarm_statuses: {
			searchable: true,
			selectionClearable: true
		}
	}
};

export const CheckboxesWidget = FormTemplate.bind(this);
CheckboxesWidget.args = {
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
};

export const InlineForm = FormTemplate.bind(this);
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
	shift_info: {
		'ui:inline': true,
		'ui:inputWidth': '240px'
	},
	production_info: {
		'ui:inline': true,
		'ui:inputWidth': '240px'
	},
	team_info: {
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
			'ui:inputWidth': '240px',
			'responsible_for': {
				searchable: true
			}
		}
	},
	assets_oee: {
		'ui:title': '',
		'ui:options': {
			addable: false,
			orderable: false,
			removable: false
		},
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
				'ui:inputWidth': '240px'
			},
			'oee_calculation': {
				'ui:inline': true,
				'ui:inputWidth': '240px'
			}
		}
	}
};

InlineForm.args = {
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
};
