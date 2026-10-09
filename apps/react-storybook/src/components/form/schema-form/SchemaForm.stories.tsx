/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj, StoryFn } from "@storybook/react";
import {
	EApplyDefaults,
	KvSchemaForm,
	EComponentSize,
	EIconName,
	ETooltipPosition,
	ISelectMultiOptions,
	ISelectSingleOptions
} from "@kelvininc/react-ui-components/client";
import { IChangeEvent } from "@rjsf/core";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { action } from "storybook/actions";
import { FormValidation } from "@rjsf/utils";

import { getDropdownDisplayValue } from "../../../helpers/dropdown.helper";

import * as styles from "./SchemaForm.module.scss";
import {
	CONFIGURATION_SCHEMA,
	CONFIGURATION_UI_SCHEMA,
	inlineSchema,
	inlineUiSchema,
	PARAMETERS_SCHEMA
} from "./config";
import { SYSTEM_SCHEMA, SYSTEM_UI_SCHEMA, SYSTEM_FORM_DATA } from "./system";
import {
	TOPICS_SCHEMA,
	TOPICS_FORM_DATA,
	TOPIC_OBJECTS_SCHEMA,
	TOPIC_OBJECTS_FORM_DATA,
	VARIABLES_SCHEMA,
	VARIABLES_FORM_DATA,
	FALSE_AND_ZERO_SCHEMA,
	FILE_PREVIEW_SCHEMA,
	FILE_PREVIEW_FORM_DATA,
	NESTED_HIERARCHY_EXAMPLE,
	DEEP_SECTION_HIERARCHY_EXAMPLE
} from "./examples";

enum EShowErrorListType {
	Top = "top",
	Bottom = "bottom",
	None = "none"
}

const FormTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = (args) => (
	<div style={{ height: "500px" }}>
		<KvSchemaForm<any>
			{...args}
			onSubmit={(e: IChangeEvent<any>) => {
				action("submit")(e);
			}}
		/>
	</div>
);

const CoreUiForm = (args: ComponentProps<typeof KvSchemaForm>) => (
	<div className={styles.CoreUiCard}>
		<KvSchemaForm<any> {...args} customClass={styles.CoreUiForm} />
	</div>
);

const CoreUiFormTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = (
	args
) => <CoreUiForm {...args} />;

const SavedFilesTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = (
	args
) => {
	const [formData, setFormData] = useState(args.formData);
	useEffect(() => setFormData(args.formData), [args.formData]);
	const onChange = useCallback<NonNullable<typeof args.onChange>>(
		(event, id) => {
			setFormData(event.formData);
			args.onChange?.(event, id);
		},
		[args.onChange]
	);
	return <CoreUiForm {...args} formData={formData} onChange={onChange} />;
};

const meta = {
	title: "Form/SchemaForm",
	component: KvSchemaForm,
	render: FormTemplate,
	argTypes: {
		onChange: {
			action: "change"
		},
		onError: {
			action: "error"
		},
		onSubmit: {
			action: "submit"
		},
		showErrorList: {
			control: { type: "inline-radio" },
			options: Object.values(EShowErrorListType)
		},
		applyDefaults: {
			control: { type: "inline-radio" },
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
			"number-example": 2.3,
			"integer-example": 0.34,
			"boolean-example": true,
			"enum-example": "foo",
			"string-example": "value",
			"multipleChoicesList-example": ["fuzz", "qux"]
		},
		schema: {
			type: "object",
			properties: {
				"number-example": {
					title: "Number",
					type: "number",
					minimum: -10.0,
					maximum: 10,
					description: "Number description"
				},
				"integer-example": {
					title: "Integer",
					type: "integer",
					minimum: 1,
					maximum: 40
				},
				"boolean-example": {
					title: "Boolean",
					type: "boolean"
				},
				"enum-example": {
					title: "Enum",
					type: "string",
					enum: ["foo", "bar"]
				},
				"string-example": {
					title: "String",
					type: "string",
					minLength: 5,
					maxLength: 10,
					pattern: "^[a-zA-Z0-9]*$"
				},
				"basic-example": {
					title: "Examples",
					description: "A input with example values",
					type: "string",
					examples: [
						"Firefox",
						"Chrome",
						"Opera",
						"Vivaldi",
						"Safari"
					]
				},
				"multipleChoicesList-example": {
					type: "array",
					title: "A multiple choices list",
					items: {
						type: "string",
						enum: [
							"bar",
							"fuzz",
							"qux",
							"bar1",
							"fuzz1",
							"qux1",
							"bar2",
							"fuzz2",
							"qux2"
						]
					},
					uniqueItems: true
				}
			}
		},
		uiSchema: {
			"integer-example": {
				useInputMask: true
			},
			"multipleChoicesList-example": {
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
			type: "object",
			properties: {
				multiple_files: {
					type: "array",
					maxItems: 2,
					items: {
						type: "string",
						format: "data-url"
					}
				},
				single_file: {
					title: "Single File (with download)",
					type: "string",
					format: "data-url"
				}
			},
			required: ["single_file", "multiple_files"]
		},
		uiSchema: {
			single_file: {
				"ui:filePreview": true
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
			type: "object",
			properties: {
				animal: {
					enum: ["Cat", "Fish"]
				}
			},
			allOf: [
				{
					if: {
						properties: {
							animal: {
								const: "Cat"
							}
						}
					},
					then: {
						properties: {
							food: {
								type: "string",
								enum: ["meat", "grass", "fish"]
							}
						},
						required: ["food"]
					}
				},
				{
					if: {
						properties: {
							animal: {
								const: "Fish"
							}
						}
					},
					then: {
						properties: {
							food: {
								type: "string",
								enum: ["insect", "worms"]
							},
							water: {
								type: "string",
								enum: ["lake", "sea"]
							}
						},
						required: ["food", "water"]
					}
				},
				{
					required: ["animal"]
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
			firstName: "Chuck",
			active: "wrong",
			multipleChoicesList: ["foo"]
		},
		uiSchema: {
			"ui:submitButtonOptions": {
				props: {
					disabled: false,
					tooltipText: "Test to button tooltip",
					tooltipPosition: ETooltipPosition.Top
				},
				norender: false,
				submitText: "Save Button"
			},
			multipleChoicesList: {
				"ui:enumDisabled": ["bar"]
			}
		},
		schema: {
			title: "Contextualized errors",
			type: "object",
			properties: {
				firstName: {
					type: "string",
					title: "First name",
					minLength: 8,
					pattern: "\\d+"
				},
				active: {
					type: "boolean",
					title: "Active"
				},
				multipleChoicesList: {
					type: "array",
					title: "Pick max two items",
					uniqueItems: true,
					maxItems: 2,
					items: {
						type: "string",
						enum: ["foo", "bar", "fuzz"]
					}
				}
			}
		}
	}
};

export const WithErrorList: Story = {
	args: {
		showErrorList: "top",
		liveValidate: true,
		disabled: false,
		formData: {
			firstName: "Chuck",
			active: "wrong",
			multipleChoicesList: ["foo", "bar", "fuzz"]
		},
		schema: {
			title: "Contextualized errors",
			type: "object",
			properties: {
				firstName: {
					type: "string",
					title: "First name",
					minLength: 8,
					pattern: "\\d+"
				},
				active: {
					type: "boolean",
					title: "Active"
				},
				multipleChoicesList: {
					type: "array",
					title: "Pick max two items",
					uniqueItems: true,
					maxItems: 2,
					items: {
						type: "string",
						enum: ["foo", "bar", "fuzz"]
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
			title: "Additional Properties form",
			description: "A simple form with additional properties example.",
			type: "object",
			required: ["firstName", "lastName"],
			additionalProperties: {
				type: "number"
			},
			properties: {
				firstName: {
					type: "string",
					title: "First name"
				},
				lastName: {
					type: "string",
					title: "Last name"
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
					"ui:title": " ",
					"ui:emptyValue": ""
				}
			},
			minItemsList: {
				items: {
					"ui:title": " "
				}
			},
			nestedList: {
				items: {
					items: {
						"ui:title": " "
					}
				}
			},
			unorderable: {
				items: {
					"ui:title": " "
				},
				"ui:options": {
					orderable: false
				}
			},
			unremovable: {
				items: {
					"ui:title": " "
				},
				"ui:options": {
					removable: false
				}
			},
			noToolbar: {
				"ui:options": {
					addable: false,
					orderable: false,
					removable: false
				}
			},
			fixedNoToolbar: {
				"ui:options": {
					addable: false,
					orderable: false,
					removable: false
				}
			}
		},
		schema: {
			definitions: {
				Thing: {
					type: "object",
					properties: {
						name: {
							type: "string",
							default: "Default name"
						}
					}
				}
			},
			type: "object",
			properties: {
				listOfStrings: {
					type: "array",
					title: "A list of strings",
					items: {
						type: "string",
						default: "bazinga"
					}
				},
				multipleChoicesList: {
					type: "array",
					title: "A multiple choices list",
					items: {
						type: "string",
						enum: ["foo", "bar", "fuzz", "qux"]
					},
					uniqueItems: true
				},
				fixedItemsList: {
					type: "array",
					title: "A list of fixed items",
					items: [
						{
							title: "A string value",
							type: "string",
							default: "lorem ipsum"
						},
						{
							title: "a boolean value",
							type: "boolean"
						}
					],
					additionalItems: {
						title: "Additional item",
						type: "number"
					}
				},
				minItemsList: {
					type: "array",
					title: "A list with a minimal number of items",
					minItems: 3,
					items: {
						$ref: "#/definitions/Thing"
					}
				},
				defaultsAndMinItems: {
					type: "array",
					title: "List and item level defaults",
					minItems: 5,
					default: ["carp", "trout", "bream"],
					items: {
						type: "string"
					}
				},
				nestedList: {
					type: "array",
					title: "Nested list",
					items: {
						type: "array",
						title: "Inner list",
						items: {
							type: "string",
							default: "lorem ipsum"
						}
					}
				},
				unorderable: {
					title: "Unorderable items",
					type: "array",
					items: {
						type: "string",
						default: "lorem ipsum"
					}
				},
				unremovable: {
					title: "Unremovable items",
					type: "array",
					items: {
						type: "string",
						default: "lorem ipsum"
					}
				},
				noToolbar: {
					title: "No add, remove and order buttons",
					type: "array",
					items: {
						type: "string",
						default: "lorem ipsum"
					}
				},
				fixedNoToolbar: {
					title: "Fixed array without buttons",
					type: "array",
					items: [
						{
							title: "A number",
							type: "number",
							default: 42
						},
						{
							title: "A boolean",
							type: "boolean",
							default: false
						}
					],
					additionalItems: {
						title: "A string",
						type: "string",
						default: "lorem ipsum"
					}
				}
			}
		}
	}
};

const DiscardChangesTemplate: StoryFn<ComponentProps<typeof KvSchemaForm>> = (
	args
) => {
	const [submittedData, setSubmittedData] = useState({});
	return (
		<KvSchemaForm<any>
			{...args}
			submittedData={submittedData}
			onSubmit={(data: IChangeEvent<any>) => {
				action("submit")(data);
				setSubmittedData(data.formData);
			}}
			customValidate={(data: any, errors: FormValidation<any>) => {
				console.log("customValidate", data);
				return errors;
			}}
		/>
	);
};

export const AllowDiscardChanges: Story = {
	render: DiscardChangesTemplate,
	args: {
		allowDiscardChanges: true,
		showErrorList: "top",
		liveValidate: true,
		disabled: false,
		formData: {},
		schema: {
			title: "Discard changes form",
			description:
				"!!! The form is always reset to the values provided in the submittedData property. \nYou need update the submittedData property after a success submit.",
			type: "object",
			required: ["firstName", "lastName"],
			properties: {
				firstName: {
					type: "string",
					title: "First name",
					default: "Chuck"
				},
				lastName: {
					type: "string",
					title: "Last name"
				},
				telephone: {
					type: "string",
					title: "Telephone",
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
			type: "object",
			properties: {
				alarm_severities: {
					type: "array",
					title: "Severity",
					uniqueItems: true,
					items: {
						type: "number",
						oneOf: [
							{
								title: "Critical",
								const: 1
							},
							{
								title: "Urgent",
								const: 2
							},
							{
								title: "Advisory",
								const: 3
							},
							{
								title: "Medium",
								const: 4
							},
							{
								title: "Low",
								const: 5
							}
						]
					}
				},
				alarm_statuses: {
					type: "array",
					title: "Status",
					uniqueItems: true,
					items: {
						type: "string",
						oneOf: [
							{
								title: "Acknowledged",
								const: "acknowledged"
							},
							{
								title: "Active",
								const: "active"
							},
							{
								title: "Resolved",
								const: "resolved"
							}
						]
					}
				}
			}
		},
		uiSchema: {
			alarm_severities: {
				displayValue(
					selectedOptions: string[],
					options: ISelectSingleOptions | ISelectMultiOptions
				) {
					return getDropdownDisplayValue(
						selectedOptions,
						options,
						"status"
					);
				}
			},
			alarm_statuses: {
				searchable: true,
				selectionClearable: true
			}
		}
	}
};

export const ToggleButtonGroupWidget: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		allowDiscardChanges: true,
		formData: { alarm_statuses: ["resolved"] },
		schema: {
			type: "object",
			properties: {
				alarm_statuses: {
					type: "array",
					title: "Status",
					uniqueItems: true,
					minItems: 1,
					items: {
						type: "string",
						oneOf: [
							{
								title: "Active",
								const: "active"
							},
							{
								title: "Acknowledged",
								const: "acknowledged"
							},
							{
								title: "Resolved",
								const: "resolved"
							}
						]
					}
				}
			}
		},
		uiSchema: {
			alarm_statuses: {
				"ui:widget": "toggleButtonGroup",
				"ui:allButton": true
			}
		}
	}
};

export const CheckboxWidget: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		allowDiscardChanges: true,
		formData: { active: true },
		schema: {
			type: "object",
			properties: {
				active: {
					type: "boolean",
					title: "Active"
				}
			}
		},
		uiSchema: {
			active: {
				"ui:widget": "checkbox"
			}
		}
	}
};

export const TextareaWidget: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "The first field shows a description and a schema-based live limit. The handover starts above its schema limit, so Show all errors displays its validation message. Clearing commits the configured empty string."
			}
		}
	},
	args: {
		liveValidate: true,
		showErrorList: false,
		showErrorsSwitch: true,
		formData: {
			description:
				"Check the cooling loop pressure before restarting the line. Record the outlet reading.",
			handover:
				"Inspect the cooling loop and record the outlet pressure before starting the next shift."
		},
		schema: {
			type: "object",
			properties: {
				description: {
					type: "string",
					title: "Operating instructions",
					description:
						"Explain the checks the operator should complete before restarting.",
					maxLength: 120
				},
				handover: {
					type: "string",
					title: "Maintenance handover",
					description: "Leave a short note for the next shift.",
					maxLength: 60
				}
			},
			required: ["description"]
		},
		uiSchema: {
			description: {
				"ui:widget": "textarea",
				"ui:emptyValue": "",
				iconName: EIconName.Notes,
				"ui:placeholder": "Add operating instructions"
			},
			handover: {
				"ui:widget": "textarea",
				"ui:emptyValue": ""
			},
			"ui:submitButtonOptions": {
				norender: true
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
				start_at: "2022-11-16T00:00:00Z",
				end_at: "2022-11-17T00:00:00Z"
			},
			team_info: [{}],
			assets_oee: [
				{ asset_name: "asset-name-3" },
				{ asset_name: "asset-name-2" }
			]
		},
		schema: inlineSchema,
		uiSchema: inlineUiSchema
	}
};

export const NotApplyDefaultsWidget: Story = {
	args: {
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		formContext: {
			showDefaultValueHelper: true,
			defaultValueHelperPrefix: "Falls back to: "
		},
		schema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: "Title:",
					default: "lorem ipsum"
				},
				description: {
					type: "string",
					title: "Description:",
					default: "lorem ipsum lorem ipsum lorem ipsum"
				}
			},
			required: ["title"]
		},
		uiSchema: {
			description: {
				"ui:options": {
					placeholder: "Add description",
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
		formContext: {
			showDefaultValueHelper: true,
			defaultValueHelperPrefix: "Reset value: "
		},
		schema: {
			type: "object",
			properties: {
				title: {
					type: "string",
					title: "Title:",
					default: "lorem ipsum"
				},
				description: {
					type: "string",
					title: "Description:",
					default: "lorem ipsum lorem ipsum lorem ipsum"
				}
			},
			required: ["title"]
		},
		uiSchema: {
			description: {
				"ui:options": {
					placeholder: "Add description",
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
			"number-example": 2.3,
			"integer-example": 1,
			"boolean-example": true,
			"enum-example": "foo",
			"string-example": "value",
			"multipleChoicesList-example": ["fuzz", "qux"]
		},
		schema: {
			type: "object",
			properties: {
				"number-example": {
					title: "Number",
					type: "number",
					minimum: -10.0,
					maximum: 10,
					description: "Number description"
				},
				"integer-example": {
					title: "Integer",
					type: "integer",
					minimum: -10,
					maximum: 10
				},
				"boolean-example": {
					title: "Boolean",
					type: "boolean"
				},
				"enum-example": {
					title: "Enum",
					type: "string",
					enum: ["foo", "bar"]
				},
				"string-example": {
					title: "String",
					type: "string",
					minLength: 5,
					maxLength: 10,
					pattern: "^[a-zA-Z0-9]*$"
				},
				"basic-example": {
					title: "Examples",
					description: "A input with example values",
					type: "string",
					examples: [
						"Firefox",
						"Chrome",
						"Opera",
						"Vivaldi",
						"Safari"
					]
				},
				"multipleChoicesList-example": {
					type: "array",
					title: "A multiple choices list",
					items: {
						type: "string",
						enum: [
							"bar",
							"fuzz",
							"qux",
							"bar1",
							"fuzz1",
							"qux1",
							"bar2",
							"fuzz2",
							"qux2"
						]
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
			"ui:componentSize": EComponentSize.Small,
			"ui:dropdownConfig": {
				zIndex: 200
			},
			"multipleChoicesList-example": {
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
			type: "object",
			properties: {
				value: {
					type: "boolean",
					oneOf: [
						{
							title: "Truthy",
							const: true
						},
						{
							title: "Falsy",
							const: false
						}
					]
				}
			},
			required: ["value"]
		},
		uiSchema: {
			value: {
				"ui:widget": "select"
			}
		}
	}
};

export const DropdownStressTest: Story = {
	args: {
		schema: {
			type: "object",
			properties: {
				single: {
					type: "string",
					title: "",
					oneOf: Array.from({ length: 3000 }, (_, i) => ({
						const: `option-${i + 1}`,
						title: `Option ${i + 1}`
					}))
				},
				multiple: {
					type: "array",
					title: "",
					uniqueItems: true,
					items: {
						type: "string",
						oneOf: Array.from({ length: 3000 }, (_, i) => ({
							const: `option-${i + 1}`,
							title: `Option ${i + 1}`
						}))
					}
				}
			}
		},
		uiSchema: {
			single: {
				searchable: true,
				selectionClearable: true
			},
			multiple: {
				searchable: true,
				selectionClearable: true
			}
		}
	}
};

export const PasswordFields: Story = {
	args: {
		showErrorList: false,
		liveValidate: true,
		disabled: false,
		formData: {
			password: "",
			apiKey: "",
			confirmPassword: ""
		},
		schema: {
			type: "object",
			properties: {
				password: {
					type: "string",
					title: "Password",
					minLength: 8,
					description: "Must be at least 8 characters"
				},
				confirmPassword: {
					type: "string",
					title: "Confirm Password",
					minLength: 8
				},
				apiKey: {
					type: "string",
					title: "API Key",
					description: "Your secret API key"
				},
				token: {
					type: "string",
					title: "Access Token"
				}
			},
			required: ["password", "confirmPassword"]
		},
		uiSchema: {
			password: {
				"ui:widget": "password",
				"ui:placeholder": "Enter your password"
			},
			confirmPassword: {
				"ui:widget": "password",
				"ui:placeholder": "Confirm your password"
			},
			apiKey: {
				"ui:widget": "password",
				"ui:placeholder": "Enter your API key"
			},
			token: {
				"ui:widget": "password",
				"ui:placeholder": "Enter your access token"
			}
		}
	}
};

/**
 * Starts with one invalid value of each kind: a pattern mismatch, an
 * out-of-range integer, a missing file and a missing section behind a chosen
 * option, an empty required string and enum, a too-short string and min-value
 * violations. Errors also sit at the deepest levels: a client key missing from
 * Mutual TLS (four sections down) and a bad second item in the Topics array,
 * including its nested Retention section, and an environment variable with an
 * invalid name and an empty value.
 */
export const Configuration: Story = {
	render: CoreUiFormTemplate,
	parameters: { themeSideBySide: false },
	args: {
		schema: CONFIGURATION_SCHEMA,
		uiSchema: CONFIGURATION_UI_SCHEMA,
		formData: {
			connection: {
				endpoint_url: "http://plc-line-1",
				discovery_url: "not-a-url",
				port: 70000,
				verify_ssl: true,
				security_policy: "none"
			},
			authentication: { type: "credentials" },
			kafka: {
				bootstrap_servers: "",
				security: {
					protocol: "SASL_SSL",
					sasl: {},
					tls: {
						mtls: { client_cert: "-----BEGIN CERTIFICATE-----" }
					}
				},
				topics: [
					{ name: "line-1.telemetry", partitions: 3 },
					{ name: "", partitions: 0, retention: { hours: 0 } }
				]
			},
			upload: { interval: 0, retry: { attempts: 0, max_delay: -1 } },
			environment_vars: [
				{ name: "LOG_LEVEL", value: "info" },
				{ name: "1_BROKER_URL" }
			],
			session_name: "l1"
		},
		formContext: { showDefaultValueHelper: true },
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		showErrorList: false,
		showErrorsSwitch: true
	}
};

export const Parameters: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "The sample starts with three field errors: the number exceeds 1000, the integer is below 1 and the required string is empty. Toggle Show all errors to reveal them. Default helpers show each schema default without replacing the supplied values."
			}
		}
	},
	args: {
		schema: PARAMETERS_SCHEMA,
		uiSchema: { "ui:submitButtonOptions": { norender: true } },
		formData: {
			param_number: 1500,
			param_integer: 0,
			param_string: "",
			param_boolean: false
		},
		formContext: { showDefaultValueHelper: true },
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		showErrorList: false,
		showErrorsSwitch: true
	}
};

export const System: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Kelvin app schema 5.0.0 deployment settings. The sample contains six field errors across variables, ports, volumes and metrics. Toggle Show all errors to reveal them. Port, volume and probe types show the selected branch's fields."
			}
		}
	},
	args: {
		schema: SYSTEM_SCHEMA,
		uiSchema: SYSTEM_UI_SCHEMA,
		formData: SYSTEM_FORM_DATA,
		formContext: { showDefaultValueHelper: true },
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		showErrorList: false,
		showErrorsSwitch: true
	}
};

export const SingleValueList: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "The grip opens Move up and Move down. Each row has a separate Remove button. Moves at the first and last row are disabled. Add disappears at five topics, and an empty list fails the schema's minimum-item validation."
			}
		}
	},
	args: {
		schema: TOPICS_SCHEMA,
		uiSchema: {
			"ui:itemPrefix": "Topic",
			"ui:submitButtonOptions": { norender: true }
		},
		formData: TOPICS_FORM_DATA,
		liveValidate: true,
		showErrorList: false
	}
};

export const SingleValueListUnordered: Story = {
	...SingleValueList,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Set ui:options.orderable to false to keep Add and Remove without the reorder grip."
			}
		}
	},
	args: {
		...SingleValueList.args,
		uiSchema: {
			...SingleValueList.args!.uiSchema,
			"ui:options": { orderable: false }
		}
	}
};

export const ObjectList: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Objects with nested retention settings render numbered sections. Each topic has one action menu for moves and removal."
			}
		}
	},
	args: {
		schema: TOPIC_OBJECTS_SCHEMA,
		uiSchema: {
			"ui:itemPrefix": "Topic",
			"ui:submitButtonOptions": { norender: true }
		},
		formData: TOPIC_OBJECTS_FORM_DATA,
		liveValidate: true,
		showErrorList: false
	}
};

export const ObjectTable: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Flat objects become a table automatically. The second variable has an invalid name and a missing value; Show all errors reveals both cell errors. Rows stack when the form column is narrower than 480px."
			}
		}
	},
	args: {
		schema: VARIABLES_SCHEMA,
		uiSchema: {
			"ui:itemPrefix": "Variable",
			"ui:options": { orderable: false },
			"ui:submitButtonOptions": { norender: true }
		},
		formData: VARIABLES_FORM_DATA,
		liveValidate: true,
		showErrorList: false,
		showErrorsSwitch: true
	}
};

export const OrderableObjectTable: Story = {
	...ObjectTable,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Orderable table rows add a grip with the same keyboard actions as a single-value list."
			}
		}
	},
	args: {
		...ObjectTable.args,
		uiSchema: {
			...ObjectTable.args!.uiSchema,
			"ui:options": { orderable: true }
		}
	}
};

export const ObjectTableAsSections: Story = {
	...ObjectTable,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Set ui:options.layout to sections to opt out of the automatic table layout."
			}
		}
	},
	args: {
		...ObjectTable.args,
		uiSchema: {
			...ObjectTable.args!.uiSchema,
			"ui:options": {
				...ObjectTable.args!.uiSchema?.["ui:options"],
				layout: "sections"
			}
		}
	}
};

export const FalseAndZeroChoices: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "False and zero remain selected values. Use Clear selection for the optional boolean and Clear retry policy for the zero retry value. The required region accepts null through its Not set option."
			}
		}
	},
	args: {
		schema: FALSE_AND_ZERO_SCHEMA,
		uiSchema: {
			retries: {
				clearSelectionLabel: "Clear retry policy",
				"ui:options": { allowClearInputs: true }
			},
			region: { "ui:enumNames": ["Not set", "Lisbon", "Berlin"] },
			"ui:submitButtonOptions": { norender: true }
		},
		formData: { enabled: false, retries: 0, region: null },
		showErrorList: false
	}
};

export const FilePreviewsAndSecrets: Story = {
	render: SavedFilesTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Enable ui:options.filePreview for downloads of uploaded data URLs. Secret references appear as removable text. Empty single-file fields use Choose file, populated fields use Replace file, and multi-file fields use Add files."
			}
		}
	},
	args: {
		schema: FILE_PREVIEW_SCHEMA,
		uiSchema: {
			certificate: { "ui:filePreview": true },
			secret: { "ui:filePreview": true },
			attachments: { "ui:filePreview": true },
			"ui:submitButtonOptions": { norender: true }
		},
		formData: FILE_PREVIEW_FORM_DATA,
		submittedData: FILE_PREVIEW_FORM_DATA,
		liveValidate: true,
		showErrorList: false,
		allowDiscardChanges: true
	}
};

export const NestedObjectLists: Story = {
	render: CoreUiFormTemplate,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Each connector contains connection, security and TLS settings, plus its own list of client identities. Change Security protocol to Plaintext to hide the TLS fields. The invalid server hostname shows how feedback aligns inside the nested section."
			}
		}
	},
	args: {
		...NESTED_HIERARCHY_EXAMPLE,
		submittedData: NESTED_HIERARCHY_EXAMPLE.formData,
		formContext: { showDefaultValueHelper: true },
		applyDefaults: EApplyDefaults.Never,
		liveValidate: true,
		displayErrors: true,
		showErrorList: false
	}
};

export const DeepSectionHierarchy: Story = {
	...NestedObjectLists,
	parameters: {
		themeSideBySide: false,
		docs: {
			description: {
				story: "Rotation profiles reach nine frames and guides from the form root. Below 480px of form width, boundaries beyond six keep their outline and vertical spacing while adding no further inline padding. Untitled groups still count, and inner lists keep their own actions."
			}
		}
	},
	args: {
		...NestedObjectLists.args,
		...DEEP_SECTION_HIERARCHY_EXAMPLE,
		submittedData: DEEP_SECTION_HIERARCHY_EXAMPLE.formData
	}
};
