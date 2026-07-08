import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Textarea } from './textarea';
import { Label } from './label';
import { Button } from './button';
const meta = {
    title: 'UI/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: {
        placeholder: 'Type your message here.',
    },
};
export const Disabled = {
    args: {
        placeholder: 'Type your message here.',
        disabled: true,
    },
};
export const WithLabel = {
    render: () => (_jsxs("div", { className: "grid w-full gap-1.5", children: [_jsx(Label, { htmlFor: "message", children: "Your message" }), _jsx(Textarea, { placeholder: "Type your message here.", id: "message" })] })),
};
export const WithText = {
    render: () => (_jsxs("div", { className: "grid w-full gap-1.5", children: [_jsx(Label, { htmlFor: "message-2", children: "Your Message" }), _jsx(Textarea, { placeholder: "Type your message here.", id: "message-2" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Your message will be copied to the support team." })] })),
};
export const WithButton = {
    render: () => (_jsxs("div", { className: "grid w-full gap-2", children: [_jsx(Textarea, { placeholder: "Type your message here." }), _jsx(Button, { children: "Send message" })] })),
};
