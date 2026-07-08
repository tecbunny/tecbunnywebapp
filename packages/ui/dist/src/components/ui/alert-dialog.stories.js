import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from './alert-dialog';
import { Button } from './button';
const meta = {
    title: 'UI/AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(AlertDialog, { children: [_jsx(AlertDialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Show Dialog" }) }), _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Are you absolutely sure?" }), _jsx(AlertDialogDescription, { children: "This action cannot be undone. This will permanently delete your account and remove your data from our servers." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Cancel" }), _jsx(AlertDialogAction, { children: "Continue" })] })] })] })),
};
