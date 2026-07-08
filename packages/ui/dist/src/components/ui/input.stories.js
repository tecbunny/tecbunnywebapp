import { Input } from './input';
const meta = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number'],
        },
        disabled: {
            control: 'boolean',
        },
        placeholder: {
            control: 'text',
        },
    },
};
export default meta;
export const Default = {
    args: {
        type: 'text',
        placeholder: 'Enter text here...',
    },
};
export const Disabled = {
    args: {
        type: 'text',
        disabled: true,
        placeholder: 'Disabled input',
    },
};
export const File = {
    args: {
        type: 'file',
    },
};
