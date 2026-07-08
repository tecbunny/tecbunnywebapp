import type { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import("react").ForwardRefExoticComponent<Omit<import("react").DetailedHTMLProps<import("react").TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref"> & import("react").RefAttributes<HTMLTextAreaElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Disabled: Story;
export declare const WithLabel: Story;
export declare const WithText: Story;
export declare const WithButton: Story;
//# sourceMappingURL=textarea.stories.d.ts.map