import { jsx as _jsx } from "react/jsx-runtime";
import { ResponsiveDemo } from '../components/ui/responsive-demo';
import { ThemeProvider } from '../components/core/ThemeProvider';
const meta = {
    title: 'Demo/ResponsiveDemo',
    component: ResponsiveDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { className: "p-6", children: _jsx(Story, {}) }) })),
    ],
    argTypes: {
        showControls: { control: 'boolean' },
    },
};
export default meta;
// Full demo with controls
export const FullDemo = {
    args: {
        showControls: true,
    },
};
// Demo without controls
export const WithoutControls = {
    args: {
        showControls: false,
    },
};
// Demo with light theme
export const LightTheme = {
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", disableToggle: true, children: _jsx("div", { className: "p-6", children: _jsx(Story, {}) }) })),
    ],
    args: {
        showControls: true,
    },
};
// Demo with dark theme
export const DarkTheme = {
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "dark", disableToggle: true, children: _jsx("div", { className: "p-6", children: _jsx(Story, {}) }) })),
    ],
    args: {
        showControls: true,
    },
};
