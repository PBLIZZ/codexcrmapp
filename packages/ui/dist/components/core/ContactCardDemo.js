'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { ContactCard, ContactAvatar, ContactInfoItem, ContactActionButton, ContactCallButton, ContactEmailButton, ContactMessageButton, } from '../ui/contact-card';
export function ContactCardDemo({ className }) {
    const [layout, setLayout] = useState('vertical');
    // Sample contact data
    const contacts = [
        {
            name: 'Jane Smith',
            title: 'Marketing Director',
            company: 'Acme Corporation',
            avatar: {
                src: 'https://randomuser.me/api/portraits/women/32.jpg',
                status: 'online',
            },
            contactInfo: {
                email: 'jane.smith@acme.com',
                phone: '(555) 123-4567',
                mobile: '(555) 987-6543',
                address: '123 Business Ave, Suite 400, San Francisco, CA 94107',
                website: 'www.acmecorp.com',
            },
            tags: ['Marketing', 'VIP', 'Enterprise'],
        },
        {
            name: 'John Doe',
            title: 'Software Engineer',
            company: 'Tech Innovations',
            avatar: {
                src: 'https://randomuser.me/api/portraits/men/44.jpg',
                status: 'busy',
            },
            contactInfo: {
                email: 'john.doe@techinnovations.com',
                phone: '(555) 234-5678',
                mobile: '(555) 876-5432',
            },
            tags: ['Engineering', 'Developer'],
        },
        {
            name: 'Sarah Johnson',
            title: 'Financial Advisor',
            company: 'Wealth Management Inc.',
            avatar: {
                initials: 'SJ',
                status: 'away',
            },
            contactInfo: {
                email: 'sarah.j@wealthmanagement.com',
                phone: '(555) 345-6789',
            },
            tags: ['Finance', 'Advisor'],
        },
        {
            name: 'Michael Chen',
            title: 'Product Manager',
            company: 'Innovative Solutions',
            avatar: {
                src: 'https://randomuser.me/api/portraits/men/67.jpg',
                status: 'offline',
            },
            contactInfo: {
                email: 'michael.chen@innovative.com',
                phone: '(555) 456-7890',
            },
            tags: ['Product', 'Management'],
        },
    ];
    return (_jsxs("div", { className: cn('space-y-6', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Contact Cards" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setLayout('vertical'), className: cn('px-3 py-1 rounded-md', layout === 'vertical'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'), children: "Vertical" }), _jsx("button", { onClick: () => setLayout('horizontal'), className: cn('px-3 py-1 rounded-md', layout === 'horizontal'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'), children: "Horizontal" })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Basic Contact Cards" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: contacts.map((contact, index) => (_jsx(ContactCard, { name: contact.name, title: contact.title, company: contact.company, avatar: contact.avatar, contactInfo: contact.contactInfo, tags: contact.tags, layout: layout, actions: _jsxs(_Fragment, { children: [_jsx(ContactCallButton, { onClick: () => alert(`Calling ${contact.name}`) }), _jsx(ContactEmailButton, { onClick: () => alert(`Emailing ${contact.name}`) }), _jsx(ContactMessageButton, { onClick: () => alert(`Messaging ${contact.name}`) })] }) }, index))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Contact Card Variants" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(ContactCard, { name: "Default Variant", title: "Software Engineer", avatar: { initials: 'DV', status: 'online' }, contactInfo: { email: 'default@example.com' }, variant: "default", layout: layout }), _jsx(ContactCard, { name: "Primary Variant", title: "Product Manager", avatar: { initials: 'PV', status: 'online' }, contactInfo: { email: 'primary@example.com' }, variant: "primary", layout: layout }), _jsx(ContactCard, { name: "Accent Variant", title: "Designer", avatar: { initials: 'AV', status: 'online' }, contactInfo: { email: 'accent@example.com' }, variant: "accent", layout: layout }), _jsx(ContactCard, { name: "Outline Variant", title: "Marketing", avatar: { initials: 'OV', status: 'online' }, contactInfo: { email: 'outline@example.com' }, variant: "outline", layout: layout })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Contact Card Sizes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(ContactCard, { name: "Small Size", title: "Developer", avatar: { initials: 'SS' }, contactInfo: { email: 'small@example.com' }, size: "sm", layout: layout }), _jsx(ContactCard, { name: "Medium Size", title: "Designer", avatar: { initials: 'MS' }, contactInfo: { email: 'medium@example.com' }, size: "md", layout: layout }), _jsx(ContactCard, { name: "Large Size", title: "Manager", avatar: { initials: 'LS' }, contactInfo: { email: 'large@example.com' }, size: "lg", layout: layout })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Interactive Contact Cards" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(ContactCard, { name: "Hover Effect", title: "Software Engineer", avatar: { initials: 'HE', status: 'online' }, contactInfo: { email: 'hover@example.com' }, withHover: true, layout: layout }), _jsx(ContactCard, { name: "With Shadow", title: "Product Manager", avatar: { initials: 'WS', status: 'online' }, contactInfo: { email: 'shadow@example.com' }, withShadow: true, layout: layout })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-medium", children: "Contact Card Components" }), _jsxs("div", { className: "p-4 border border-border rounded-lg space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Contact Avatars" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(ContactAvatar, { src: "https://randomuser.me/api/portraits/women/32.jpg", alt: "Jane Smith", size: "sm" }), _jsx(ContactAvatar, { src: "https://randomuser.me/api/portraits/men/44.jpg", alt: "John Doe", size: "md" }), _jsx(ContactAvatar, { initials: "SJ", size: "lg" }), _jsx(ContactAvatar, { initials: "MC", size: "xl" }), _jsx(ContactAvatar, { src: "https://randomuser.me/api/portraits/women/32.jpg", alt: "Jane Smith", status: "online", size: "md" }), _jsx(ContactAvatar, { src: "https://randomuser.me/api/portraits/men/44.jpg", alt: "John Doe", status: "busy", size: "md" }), _jsx(ContactAvatar, { initials: "SJ", status: "away", size: "md" }), _jsx(ContactAvatar, { initials: "MC", status: "offline", size: "md" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Contact Info Items" }), _jsxs("div", { className: "space-y-2 max-w-md", children: [_jsx(ContactInfoItem, { icon: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] }), label: "Email", value: "example@email.com", href: "mailto:example@email.com", copyable: true }), _jsx(ContactInfoItem, { icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }) }), label: "Phone", value: "(555) 123-4567", href: "tel:(555) 123-4567" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Contact Action Buttons" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(ContactCallButton, {}), _jsx(ContactEmailButton, {}), _jsx(ContactMessageButton, {}), _jsx(ContactActionButton, { icon: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }), _jsx("circle", { cx: "12", cy: "10", r: "3" })] }), label: "Map", variant: "primary" }), _jsx(ContactActionButton, { icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), label: "Chat", variant: "secondary" })] })] })] })] })] })] }));
}
//# sourceMappingURL=ContactCardDemo.js.map