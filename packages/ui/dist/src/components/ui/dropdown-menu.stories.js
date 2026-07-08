import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './dropdown-menu';
import { Button } from './button';
const meta = {
    title: 'UI/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Open Menu" }) }), _jsxs(DropdownMenuContent, { className: "w-56", children: [_jsx(DropdownMenuLabel, { children: "My Account" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: "Profile" }), _jsx(DropdownMenuItem, { children: "Billing" }), _jsx(DropdownMenuItem, { children: "Team" }), _jsx(DropdownMenuItem, { children: "Subscription" })] })] })),
};
