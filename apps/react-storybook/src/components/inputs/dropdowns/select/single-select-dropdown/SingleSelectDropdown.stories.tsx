import { ComponentProps, useCallback, useEffect, useMemo, useRef } from "react";
import { selectHelper } from "@kelvininc/react-ui-components/client";
import { useArgs } from "storybook/preview-api";
import { action } from "storybook/actions";
import {
	ECreateOptionStatus,
	EComponentSize,
	EIconName,
	KvSearch,
	KvSelectCreateOption,
	KvSingleSelectDropdown,
	KvSingleSelectDropdownCustomEvent
} from "@kelvininc/react-ui-components/client";
import { StoryObj, StoryFn, Meta } from "@storybook/react";
import {
	SMALL_SET_DROPDOWN_OPTIONS_MOCK,
	TIMEZONES_DROPDOWN_OPTIONS_MOCK,
	LARGE_SET_DROPDOWN_OPTIONS_MOCK,
	TAGS_DROPDOWN_OPTIONS_MOCK
} from "../../../../../mocks/dropdown.mock";
import {
	CREATE_STORY_DERIVED_ARGS,
	CREATE_TAG_ERROR,
	NEW_TAG_COLORS,
	NEW_TAG_INPUT_CONFIG
} from "./config";
import { buildTagOption, getCreateTagLabel, requestTagCreation } from "./utils";
import * as styles from "./SingleSelectDropdown.module.scss";

type SingleSelectDropdownArgs = ComponentProps<typeof KvSingleSelectDropdown>;

const SingleSelectDropdownTemplate: StoryFn<SingleSelectDropdownArgs> = (
	args
) => {
	const [, updateArgs] = useArgs();

	const onOptionSelected = useCallback(
		({ detail }: CustomEvent<string>) =>
			updateArgs({ selectedOption: detail }),
		[updateArgs]
	);

	return (
		<KvSingleSelectDropdown {...args} onOptionSelected={onOptionSelected} />
	);
};

const meta = {
	title: "Inputs/Dropdown/Select/Single Select Dropdown",
	component: KvSingleSelectDropdown,
	render: SingleSelectDropdownTemplate,
	argTypes: {
		isOpen: {
			control: { type: "boolean" }
		},
		icon: {
			control: { type: "text" }
		},
		placeholder: {
			control: { type: "text" }
		},
		searchable: {
			control: { type: "boolean" }
		},
		required: {
			control: { type: "boolean" }
		},
		disabled: {
			control: { type: "boolean" }
		},
		label: {
			control: { type: "text" }
		},
		helpText: {
			control: { type: "text" }
		},
		errorState: {
			control: { type: "text" }
		},
		selectedOption: {
			control: { type: "text" }
		},
		inputSize: {
			control: { type: "radio" },
			options: Object.values(EComponentSize)
		},
		counter: {
			control: { type: "boolean" }
		},
		shortcuts: {
			control: { type: "boolean" }
		}
	}
} satisfies Meta<typeof KvSingleSelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		options: SMALL_SET_DROPDOWN_OPTIONS_MOCK,
		selectedOption: "option2",
		label: "Options",
		placeholder: "Select an option",
		icon: EIconName.Layer,
		shortcuts: true
	}
};

export const SubOptions: Story = {
	args: {
		options: TIMEZONES_DROPDOWN_OPTIONS_MOCK,
		selectedOption: "UTC-12",
		label: "Timezone",
		placeholder: "Select a timezone",
		icon: EIconName.Time,
		searchable: true,
		shortcuts: true
	}
};

export const Virtualization: Story = {
	args: {
		options: LARGE_SET_DROPDOWN_OPTIONS_MOCK,
		selectedOption: "option2",
		label: "Options",
		placeholder: "Select an option",
		icon: EIconName.Layer,
		shortcuts: true
	}
};

type ExternalSearchArgs = SingleSelectDropdownArgs & {
	/** What is typed in the search outside the dropdown */
	searchTerm?: string;
};

const ExternalSearchTemplate: StoryFn<ExternalSearchArgs> = ({
	searchTerm,
	...args
}) => {
	const [, updateArgs] = useArgs<ExternalSearchArgs>();
	const { options, placeholder, isOpen } = args;
	const searchRef = useRef<HTMLKvSearchElement>(null);

	const filteredOptions = useMemo(
		() =>
			selectHelper.searchDropdownOptions(searchTerm ?? "", options ?? {}),
		[searchTerm, options]
	);

	useEffect(() => {
		if (!searchRef.current) {
			return;
		}

		const element = searchRef.current;
		if (isOpen) {
			element.focus();
		} else {
			element.blur();
		}
	}, [isOpen]);

	return (
		<KvSingleSelectDropdown
			{...args}
			actionElement={searchRef.current as HTMLElement | null}
			filteredOptions={filteredOptions}
			onOptionSelected={({ detail }) =>
				updateArgs({
					searchTerm: detail,
					selectedOption: detail,
					isOpen: false
				})
			}
			onOpenStateChange={({ detail }) => updateArgs({ isOpen: detail })}
		>
			<KvSearch
				ref={searchRef}
				slot="dropdown-action"
				value={searchTerm}
				placeholder={placeholder}
				onFocus={() => updateArgs({ isOpen: true })}
				onTextChange={({ detail }) =>
					updateArgs({ searchTerm: detail })
				}
				onClickResetButton={() => updateArgs({ searchTerm: undefined })}
			/>
		</KvSingleSelectDropdown>
	);
};

export const ExternalSearch: StoryObj<ExternalSearchArgs> = {
	render: ExternalSearchTemplate,
	args: {
		shortcuts: true,
		isOpen: false,
		placeholder: "Write here the option name you're looking for",
		options: SMALL_SET_DROPDOWN_OPTIONS_MOCK
	},
	parameters: {
		controls: { exclude: ["searchTerm"] }
	}
};

type AddOptionArgs = SingleSelectDropdownArgs & {
	/** What is typed in the dropdown's search, which the add option names */
	searchTerm?: string;
};

const AddOptionTemplate: StoryFn<AddOptionArgs> = ({ searchTerm, ...args }) => {
	const [, updateArgs] = useArgs<AddOptionArgs>();

	const addNewOption = (newOption: string) =>
		updateArgs({
			options: {
				...args.options,
				[newOption]: { label: newOption, value: newOption }
			}
		});

	return (
		<KvSingleSelectDropdown
			{...args}
			createOptionPlaceholder={getCreateTagLabel(searchTerm)}
			onSearchChange={({ detail }) => updateArgs({ searchTerm: detail })}
			onOptionSelected={({ detail: newOption }) =>
				updateArgs({ selectedOption: newOption })
			}
			onOptionCreated={({ detail: newOption }) => addNewOption(newOption)}
		/>
	);
};

export const AddOption: StoryObj<AddOptionArgs> = {
	render: AddOptionTemplate,
	args: {
		placeholder: "Please select a tag",
		searchPlaceholder: "Search for Tags",
		options: TAGS_DROPDOWN_OPTIONS_MOCK,
		label: "Tags",
		shortcuts: false,
		minSearchOptions: 0,
		canAddItems: true,
		noResultsFoundConfig: { header: "No tags found" }
	},
	parameters: {
		controls: { exclude: CREATE_STORY_DERIVED_ARGS }
	}
};

type AddOptionAsyncArgs = AddOptionArgs & {
	/** Makes the simulated request creating the tag fail */
	failCreation?: boolean;
};

const AddOptionAsyncTemplate: StoryFn<AddOptionAsyncArgs> = ({
	failCreation,
	searchTerm,
	...args
}) => {
	const [, updateArgs] = useArgs<AddOptionAsyncArgs>();

	const onOptionCreated = async ({
		detail: label
	}: KvSingleSelectDropdownCustomEvent<string>) => {
		updateArgs({
			createOptionState: { status: ECreateOptionStatus.Loading }
		});

		try {
			const value = await requestTagCreation(failCreation);

			// The option is added with the success, which selects it
			updateArgs({
				options: { ...args.options, [value]: { label, value } },
				createOptionState: {
					status: ECreateOptionStatus.Success,
					optionKey: value
				}
			});
		} catch {
			updateArgs({
				createOptionState: {
					status: ECreateOptionStatus.Error,
					error: CREATE_TAG_ERROR
				}
			});
		}
	};

	return (
		<KvSingleSelectDropdown
			{...args}
			createOptionPlaceholder={getCreateTagLabel(searchTerm)}
			onSearchChange={({ detail }) => updateArgs({ searchTerm: detail })}
			onCreateFormToggle={({ detail: isOpen }) =>
				action("createFormToggle")(isOpen)
			}
			onOptionCreated={onOptionCreated}
			onOptionSelected={({ detail }) =>
				updateArgs({ selectedOption: detail })
			}
		/>
	);
};

export const AddOptionAsync: StoryObj<AddOptionAsyncArgs> = {
	render: AddOptionAsyncTemplate,
	args: {
		...AddOption.args,
		createOptionState: { status: ECreateOptionStatus.Idle },
		failCreation: false
	},
	argTypes: {
		failCreation: {
			control: { type: "boolean" },
			description: "Makes the simulated request creating the tag fail"
		}
	},
	parameters: {
		controls: { exclude: CREATE_STORY_DERIVED_ARGS }
	}
};

type AddOptionCustomRowArgs = AddOptionArgs & {
	/**
	 * What is typed in the create row since the create form last opened or
	 * closed. Until then the row holds the search term, as the default form does.
	 */
	typedName?: string;
};

const AddOptionCustomRowTemplate: StoryFn<AddOptionCustomRowArgs> = ({
	searchTerm,
	typedName,
	...args
}) => {
	const [, updateArgs] = useArgs<AddOptionCustomRowArgs>();
	const { options = {}, createOptionState } = args;

	const newTagColor =
		NEW_TAG_COLORS[Object.keys(options).length % NEW_TAG_COLORS.length];

	// The row stays mounted, so it is laid out as soon as the form opens: it
	// starts over on the event instead of remounting
	const onCreateFormToggle = ({
		detail: isOpen
	}: KvSingleSelectDropdownCustomEvent<boolean>) => {
		action("createFormToggle")(isOpen);
		updateArgs({ typedName: undefined });
	};

	const onOptionCreated = async ({
		detail: label
	}: KvSingleSelectDropdownCustomEvent<string>) => {
		updateArgs({
			createOptionState: { status: ECreateOptionStatus.Loading }
		});

		const value = await requestTagCreation();

		updateArgs({
			options: {
				...options,
				[value]: buildTagOption(label, value, newTagColor)
			},
			createOptionState: {
				status: ECreateOptionStatus.Success,
				optionKey: value
			}
		});
	};

	return (
		<KvSingleSelectDropdown
			{...args}
			createOptionPlaceholder={getCreateTagLabel(searchTerm)}
			onSearchChange={({ detail }) => updateArgs({ searchTerm: detail })}
			onCreateFormToggle={onCreateFormToggle}
			onOptionCreated={onOptionCreated}
			onOptionSelected={({ detail }) =>
				updateArgs({ selectedOption: detail })
			}
		>
			{/*
			 * The row is portaled with the list, out of the story's root, where
			 * React's own handlers (onClick, onKeyDown...) never fire: only the
			 * Stencil components' events reach the story, so nothing else in the
			 * row is interactive. The create option's `valueChanged`, `clickCreate`
			 * and `clickCancel` bubble up and drive the form, and `valueChanged`
			 * also keeps the row's value here.
			 */}
			<div slot="create-new-option" className={styles.CreateTagRow}>
				<span
					className={styles.NewTagSwatch}
					style={{ background: newTagColor }}
				/>
				<KvSelectCreateOption
					className={styles.NewTagField}
					value={typedName ?? searchTerm}
					loading={
						createOptionState?.status ===
						ECreateOptionStatus.Loading
					}
					inputConfig={NEW_TAG_INPUT_CONFIG}
					onValueChanged={({ detail }) =>
						updateArgs({ typedName: detail })
					}
				/>
			</div>
		</KvSingleSelectDropdown>
	);
};

export const AddOptionCustomRow: StoryObj<AddOptionCustomRowArgs> = {
	render: AddOptionCustomRowTemplate,
	args: {
		...AddOption.args,
		createOptionState: { status: ECreateOptionStatus.Idle }
	},
	parameters: {
		controls: { exclude: CREATE_STORY_DERIVED_ARGS }
	}
};
