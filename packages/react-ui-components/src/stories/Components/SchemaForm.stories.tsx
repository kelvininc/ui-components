import { IMultiSelectDropdownOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import KvSchemaForm from '../../components/SchemaForm/SchemaForm';
import { getDropdownDisplayValue } from './helpers/dropdown.helper';

export default {
	title: 'Form/SchemaForm',
	component: 'KvSchemaForm',
	argTypes: {
		onChange: {
			action: 'change'
		},
		onSubmit: {
			action: 'submit'
		},
		onError: {
			action: 'error'
		}
	},
	parameters: {
		notes: require('../../components/SchemaForm/readme.md')
	}
};

const FormTemplate: ComponentStory<any> = args => <KvSchemaForm<any> {...args}></KvSchemaForm>;

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
		'multipleChoicesList-example': ['foo', 'qux']
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
					enum: ['foo', 'bar', 'fuzz', 'qux']
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
	showErrorList: true,
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
				'ui:emptyValue': ''
			}
		},
		unorderable: {
			'ui:options': {
				orderable: false
			}
		},
		unremovable: {
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
			onSubmit={(data: any) => {
				console.log('KvSchemaForm submit', data);
				setSubmittedData(data.formData);
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
