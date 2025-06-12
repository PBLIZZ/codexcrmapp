import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemedCard, ThemedCardHeader, ThemedCardTitle, ThemedCardDescription, ThemedCardContent, ThemedCardFooter } from '../components/ui/themed-card';
import { ThemeProvider } from '../components/core/ThemeProvider';
const meta = {
    title: 'UI/ThemedCard',
    component: ThemedCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { width: '350px' }, children: _jsx(Story, {}) }) })),
    ],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'primary', 'accent', 'outline']
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg']
        },
        withHover: { control: 'boolean' },
        withShadow: { control: 'boolean' },
    },
};
export default meta;
// Basic card
export const Basic = {
    render: () => (_jsxs(ThemedCard, { children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Card Title" }), _jsx(ThemedCardDescription, { children: "Card Description" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "This is the main content of the card. It can contain any elements." }) }), _jsx(ThemedCardFooter, { children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Footer content" }) })] })),
};
// Card with different title levels
export const TitleLevels = {
    render: () => (_jsxs("div", { className: "space-y-4", children: [_jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 1, children: "H1 Title" }), _jsx(ThemedCardDescription, { children: "Level 1 heading" })] }) }), _jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 2, children: "H2 Title" }), _jsx(ThemedCardDescription, { children: "Level 2 heading" })] }) }), _jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 3, children: "H3 Title" }), _jsx(ThemedCardDescription, { children: "Level 3 heading (default)" })] }) }), _jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 4, children: "H4 Title" }), _jsx(ThemedCardDescription, { children: "Level 4 heading" })] }) }), _jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 5, children: "H5 Title" }), _jsx(ThemedCardDescription, { children: "Level 5 heading" })] }) }), _jsx(ThemedCard, { children: _jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { level: 6, children: "H6 Title" }), _jsx(ThemedCardDescription, { children: "Level 6 heading" })] }) })] })),
};
// Size variants
export const Small = {
    render: () => (_jsxs(ThemedCard, { size: "sm", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Small Card" }), _jsx(ThemedCardDescription, { children: "This is a small card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with small padding" }) })] })),
};
export const Medium = {
    render: () => (_jsxs(ThemedCard, { size: "md", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Medium Card" }), _jsx(ThemedCardDescription, { children: "This is a medium card (default)" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with medium padding" }) })] })),
};
export const Large = {
    render: () => (_jsxs(ThemedCard, { size: "lg", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Large Card" }), _jsx(ThemedCardDescription, { children: "This is a large card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with large padding" }) })] })),
};
// Color variants
export const Default = {
    render: () => (_jsxs(ThemedCard, { variant: "default", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Default Card" }), _jsx(ThemedCardDescription, { children: "This is a default card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with default styling" }) })] })),
};
export const Primary = {
    render: () => (_jsxs(ThemedCard, { variant: "primary", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Primary Card" }), _jsx(ThemedCardDescription, { children: "This is a primary card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with primary styling" }) })] })),
};
export const Accent = {
    render: () => (_jsxs(ThemedCard, { variant: "accent", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Accent Card" }), _jsx(ThemedCardDescription, { children: "This is an accent card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with accent styling" }) })] })),
};
export const Outline = {
    render: () => (_jsxs(ThemedCard, { variant: "outline", children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Outline Card" }), _jsx(ThemedCardDescription, { children: "This is an outline card" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with outline styling" }) })] })),
};
// With hover and shadow
export const WithHoverAndShadow = {
    render: () => (_jsxs(ThemedCard, { withHover: true, withShadow: true, children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Interactive Card" }), _jsx(ThemedCardDescription, { children: "This card has hover and shadow effects" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Hover over this card to see the effect" }) })] })),
};
// Card with footer actions
export const WithFooterActions = {
    render: () => (_jsxs(ThemedCard, { children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Card with Actions" }), _jsx(ThemedCardDescription, { children: "This card has action buttons in the footer" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with some information that requires action" }) }), _jsxs(ThemedCardFooter, { className: "justify-end space-x-2", children: [_jsx("button", { className: "px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm", children: "Cancel" }), _jsx("button", { className: "px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm", children: "Save" })] })] })),
};
// Dark theme card
export const DarkTheme = {
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "dark", children: _jsx("div", { style: { width: '350px' }, children: _jsx(Story, {}) }) })),
    ],
    render: () => (_jsxs(ThemedCard, { withShadow: true, children: [_jsxs(ThemedCardHeader, { children: [_jsx(ThemedCardTitle, { children: "Dark Theme Card" }), _jsx(ThemedCardDescription, { children: "This card is shown in dark theme" })] }), _jsx(ThemedCardContent, { children: _jsx("p", { children: "Content with dark theme styling" }) })] })),
};
