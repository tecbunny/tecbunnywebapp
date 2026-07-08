import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from './switch';
import { Label } from './label';
const meta = {
    title: 'UI/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "airplane-mode" }), _jsx(Label, { htmlFor: "airplane-mode", children: "Airplane Mode" })] })),
};
export const Disabled = {
    render: () => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "airplane-mode-2", disabled: true }), _jsx(Label, { htmlFor: "airplane-mode-2", children: "Airplane Mode" })] })),
};
