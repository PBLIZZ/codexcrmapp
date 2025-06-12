import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ContactCard, ContactCallButton, ContactEmailButton, ContactMessageButton } from '../components/ui/contact-card';
import { ThemeProvider } from '../components/core/ThemeProvider';
const meta = {
    title: 'UI/ContactCard',
    component: ContactCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { width: '400px' }, children: _jsx(Story, {}) }) })),
    ],
    argTypes: {
        name: { control: 'text' },
        title: { control: 'text' },
        company: { control: 'text' },
        layout: {
            control: 'select',
            options: ['horizontal', 'vertical']
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg']
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'accent', 'outline']
        },
        withHover: { control: 'boolean' },
        withShadow: { control: 'boolean' },
    },
};
export default meta;
// Basic contact card
export const Basic = {
    args: {
        name: 'Jane Smith',
        title: 'Product Manager',
        company: 'Acme Inc.',
        size: 'md',
        variant: 'default',
        contactInfo: {
            email: 'jane.smith@example.com',
            phone: '(555) 123-4567',
        },
    },
};
// With avatar
export const WithAvatar = {
    args: {
        ...Basic.args,
        avatar: {
            initials: 'JS',
            status: 'online',
        },
    },
};
// With avatar image
export const WithAvatarImage = {
    args: {
        ...Basic.args,
        avatar: {
            src: 'https://i.pravatar.cc/300?img=28',
            status: 'online',
        },
    },
};
// With all contact info
export const WithAllContactInfo = {
    args: {
        ...Basic.args,
        avatar: {
            src: 'https://i.pravatar.cc/300?img=28',
            status: 'online',
        },
        contactInfo: {
            email: 'jane.smith@example.com',
            phone: '(555) 123-4567',
            mobile: '(555) 987-6543',
            address: '123 Main St, Anytown, CA 94321',
            website: 'www.example.com',
            slack: '@janesmith',
        },
    },
};
// With action buttons
export const WithActions = {
    args: {
        ...WithAvatar.args,
        actions: (_jsxs(_Fragment, { children: [_jsx(ContactCallButton, {}), _jsx(ContactEmailButton, {}), _jsx(ContactMessageButton, {})] })),
    },
};
// With tags
export const WithTags = {
    args: {
        ...WithAvatar.args,
        tags: ['Product', 'Design', 'Marketing'],
    },
};
// Horizontal layout
export const HorizontalLayout = {
    args: {
        ...WithAvatar.args,
        layout: 'horizontal',
        actions: (_jsxs(_Fragment, { children: [_jsx(ContactCallButton, {}), _jsx(ContactEmailButton, {})] })),
    },
};
// Size variants
export const Small = {
    args: {
        ...WithAvatar.args,
        size: 'sm',
    },
};
export const Medium = {
    args: {
        ...WithAvatar.args,
        size: 'md',
    },
};
export const Large = {
    args: {
        ...WithAvatar.args,
        size: 'lg',
    },
};
// Color variants
export const Default = {
    args: {
        ...WithAvatar.args,
        variant: 'default',
    },
};
export const Primary = {
    args: {
        ...WithAvatar.args,
        variant: 'primary',
    },
};
export const Accent = {
    args: {
        ...WithAvatar.args,
        variant: 'accent',
    },
};
export const Outline = {
    args: {
        ...WithAvatar.args,
        variant: 'outline',
    },
};
// With hover and shadow
export const WithHoverAndShadow = {
    args: {
        ...WithAvatar.args,
        withHover: true,
        withShadow: true,
    },
};
// Different status indicators
export const OnlineStatus = {
    args: {
        ...Basic.args,
        avatar: {
            initials: 'JS',
            status: 'online',
        },
    },
};
export const OfflineStatus = {
    args: {
        ...Basic.args,
        avatar: {
            initials: 'JS',
            status: 'offline',
        },
    },
};
export const AwayStatus = {
    args: {
        ...Basic.args,
        avatar: {
            initials: 'JS',
            status: 'away',
        },
    },
};
export const BusyStatus = {
    args: {
        ...Basic.args,
        avatar: {
            initials: 'JS',
            status: 'busy',
        },
    },
};
// With custom footer
export const WithFooter = {
    args: {
        ...WithAvatar.args,
        footer: (_jsx("div", { className: "text-xs text-muted-foreground pt-2", children: "Last contacted: 3 days ago" })),
    },
};
