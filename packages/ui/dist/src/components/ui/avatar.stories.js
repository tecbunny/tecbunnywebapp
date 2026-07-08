import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
const meta = {
    title: 'UI/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: "https://github.com/shadcn.png", alt: "@shadcn" }), _jsx(AvatarFallback, { children: "CN" })] })),
};
export const FallbackOnly = {
    render: () => (_jsx(Avatar, { children: _jsx(AvatarFallback, { children: "TB" }) })),
};
