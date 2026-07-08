import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from './checkbox';
import { Label } from './label';
const meta = {
    title: 'UI/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms" }), _jsx(Label, { htmlFor: "terms", children: "Accept terms and conditions" })] })),
};
export const Disabled = {
    render: () => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms2", disabled: true }), _jsx(Label, { htmlFor: "terms2", children: "Accept terms and conditions" })] })),
};
export const WithDescription = {
    render: () => (_jsxs("div", { className: "items-top flex space-x-2", children: [_jsx(Checkbox, { id: "terms1" }), _jsxs("div", { className: "grid gap-1.5 leading-none", children: [_jsx(Label, { htmlFor: "terms1", children: "Accept terms and conditions" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "You agree to our Terms of Service and Privacy Policy." })] })] })),
};
