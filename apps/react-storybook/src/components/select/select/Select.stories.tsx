import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ComponentProps, FunctionComponent } from 'react';
import { EActionButtonType, EComponentSize, KvActionButtonText, KvSelect, KvSelectOption } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Select/Select',
	component: KvSelect
} satisfies Meta<typeof KvSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const Options: FunctionComponent = () => (
	<>
		<KvSelectOption label="First label here" value="value-01" togglable={true}></KvSelectOption>
		<KvSelectOption label="Second label here" value="value-02" togglable={true}></KvSelectOption>
		<KvSelectOption label="Third label here" value="value-03" togglable={true}></KvSelectOption>
		<KvSelectOption label="Fourth label here" value="value-04" togglable={true}></KvSelectOption>
		<KvSelectOption label="Fifth label here" value="value-05" togglable={true}></KvSelectOption>
		<KvSelectOption label="Sixth label here" value="value-06" togglable={true}></KvSelectOption>
		<KvSelectOption label="Seventh label here" value="value-07" togglable={true}></KvSelectOption>
		<KvSelectOption label="Eigth label here" value="value-08" togglable={true}></KvSelectOption>
	</>
);

const SelectTemplate: StoryFn<ComponentProps<typeof KvSelect>> = args => (
	<KvSelect {...args}>
		<Options />
	</KvSelect>
);

const HeaderActionsTemplate: StoryFn<ComponentProps<typeof KvSelect>> = args => (
	<KvSelect {...args}>
		<div slot="select-header-actions">{args.children}</div>
		<Options />
	</KvSelect>
);

export const Default: Story = {
	render: SelectTemplate,
	args: {
		searchable: true,
		searchPlaceholder: 'Search Assets',
		selectionClearable: true,
		selectionClearEnabled: true
	}
};

export const WithHeaderActions: Story = {
	render: HeaderActionsTemplate,
	children: <KvActionButtonText text="Add new" type={EActionButtonType.Primary} size={EComponentSize.Small} />
}
