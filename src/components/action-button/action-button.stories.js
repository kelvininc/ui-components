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
        <kv-action-button
            type="${type}"
            text="${text}"
            enabled="${enabled}">
        </kv-action-button>
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

export const Danger = Template.bind();
Danger.args = {
    text: 'Danger Button',
    type: 'primary-danger-button',
    enabled: true
};
