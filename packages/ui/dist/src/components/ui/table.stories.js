import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './table';
const meta = {
    title: 'UI/Table',
    component: Table,
    tags: ['autodocs'],
};
export default meta;
const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
];
export const Default = {
    render: () => (_jsxs(Table, { children: [_jsx(TableCaption, { children: "A list of your recent invoices." }), _jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[100px]", children: "Invoice" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Method" }), _jsx(TableHead, { className: "text-right", children: "Amount" })] }) }), _jsx(TableBody, { children: invoices.map((invoice) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: invoice.invoice }), _jsx(TableCell, { children: invoice.paymentStatus }), _jsx(TableCell, { children: invoice.paymentMethod }), _jsx(TableCell, { className: "text-right", children: invoice.totalAmount })] }, invoice.invoice))) })] })),
};
