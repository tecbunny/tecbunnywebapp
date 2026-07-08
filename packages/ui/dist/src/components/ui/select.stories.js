import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from './select';
const meta = {
    title: 'UI/Select',
    component: Select,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Select, { children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Select a fruit" }) }), _jsx(SelectContent, { children: _jsxs(SelectGroup, { children: [_jsx(SelectLabel, { children: "Fruits" }), _jsx(SelectItem, { value: "apple", children: "Apple" }), _jsx(SelectItem, { value: "banana", children: "Banana" }), _jsx(SelectItem, { value: "blueberry", children: "Blueberry" }), _jsx(SelectItem, { value: "grapes", children: "Grapes" }), _jsx(SelectItem, { value: "pineapple", children: "Pineapple" })] }) })] })),
};
