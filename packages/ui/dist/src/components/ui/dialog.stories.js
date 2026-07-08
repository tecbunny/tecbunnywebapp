import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
const meta = {
    title: 'UI/Dialog',
    component: Dialog,
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Open Dialog" }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Edit profile" }), _jsx(DialogDescription, { children: "Make changes to your profile here. Click save when you're done." })] }), _jsx("div", { className: "py-4", children: _jsx("p", { children: "Dialog content goes here." }) })] })] })),
};
