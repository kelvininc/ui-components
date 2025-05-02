import type { Meta, StoryObj } from '@storybook/react';

import { KvTabNavigation, EComponentSize } from '@kelvininc/react-ui-components';
import { useArgs } from '@storybook/preview-api';

const meta = {
	title: 'Navigation/Tabs/Tab Navigation',
	component: KvTabNavigation,
	render: function Renderer(args) {
		const [, updateArgs] = useArgs();

		const handleTabChange = (event: CustomEvent<string>) => {
			updateArgs({ selectedTabKey: event.detail });
		};

		return <KvTabNavigation tabs={args.tabs} selectedTabKey={args.selectedTabKey} notifications={args.notifications} size={args.size} onTabChange={handleTabChange} />;
	},
	argTypes: {
		selectedTabKey: {
			control: 'text'
		},
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvTabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tabs: [
			{
				tabKey: 'assets',
				label: 'Assets'
			},
			{
				tabKey: 'components',
				label: 'Components'
			},
			{
				tabKey: 'parts',
				label: 'Parts'
			},
			{
				tabKey: 'sensors',
				label: 'Sensors'
			}
		],
		selectedTabKey: 'assets',
		notifications: {
			components: {
				active: true
			}
		},
		size: EComponentSize.Large
	}
};
