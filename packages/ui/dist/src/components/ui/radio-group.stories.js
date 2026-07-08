import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
const meta = {
    title: 'UI/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(RadioGroup, { defaultValue: "comfortable", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: "default", id: "r1" }), _jsx(Label, { htmlFor: "r1", children: "Default" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: "comfortable", id: "r2" }), _jsx(Label, { htmlFor: "r2", children: "Comfortable" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: "compact", id: "r3" }), _jsx(Label, { htmlFor: "r3", children: "Compact" })] })] })),
};
