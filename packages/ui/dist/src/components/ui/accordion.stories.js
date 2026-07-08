import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
const meta = {
    title: 'UI/Accordion',
    component: Accordion,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: { type: 'single' },
    render: () => (_jsxs(Accordion, { type: "single", collapsible: true, className: "w-[400px]", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Is it accessible?" }), _jsx(AccordionContent, { children: "Yes. It adheres to the WAI-ARIA design pattern." })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Is it styled?" }), _jsx(AccordionContent, { children: "Yes. It comes with default styles that matches the other components' aesthetic." })] }), _jsxs(AccordionItem, { value: "item-3", children: [_jsx(AccordionTrigger, { children: "Is it animated?" }), _jsx(AccordionContent, { children: "Yes. It's animated by default, but you can disable it if you prefer." })] })] })),
};
export const Multiple = {
    args: { type: 'multiple' },
    render: () => (_jsxs(Accordion, { type: "multiple", className: "w-[400px]", children: [_jsxs(AccordionItem, { value: "item-1", children: [_jsx(AccordionTrigger, { children: "Can I open multiple?" }), _jsx(AccordionContent, { children: "Yes. By setting type=\"multiple\"." })] }), _jsxs(AccordionItem, { value: "item-2", children: [_jsx(AccordionTrigger, { children: "Is it styled?" }), _jsx(AccordionContent, { children: "Yes. It comes with default styles that matches the other components' aesthetic." })] })] })),
};
