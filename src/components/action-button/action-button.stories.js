import { action } from '@storybook/addon-actions';

export default {
    text: 'Components/ActionButton',
    argTypes: {
        text: { control: 'text' },
        type: { control: 'text' },
        enabled: { control: 'boolean' }
    },
};

const Template = ({ text, type, enabled }) => {
    return `
        <action-button
            type="${type}"
            text="${text}"
            enabled="${enabled}">
        </action-button>
    `;
};

export const Primary = Template.bind();
Primary.args = {
    text: 'Primary Button',
    type: 'primary-button',
    enabled: true
};

export const Secondary = Template.bind();
Secondary.args = {
    text: 'Secondary Button',
    type: 'secondary-button',
    enabled: true
};

export const Tertiary = Template.bind();
Tertiary.args = {
    text: 'Tertiary Button',
    type: 'tertiary-button',
    enabled: true
};
