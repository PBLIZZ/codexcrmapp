'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
export const StatusIndicator = ({ status, customColor, className, }) => {
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        custom: '',
    };
    return (_jsx("div", { className: cn('h-3 w-3 rounded-full', status !== 'custom' && statusColors[status], className), style: status === 'custom' && customColor ? { backgroundColor: customColor } : {} }));
};
export const ContactAvatar = forwardRef(({ className, src, alt = 'Avatar', initials, size = 'md', status, statusColor, bordered = false, borderColor, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    // Size classes
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-12 w-12 text-sm',
        lg: 'h-16 w-16 text-base',
        xl: 'h-24 w-24 text-lg',
    };
    // Border classes
    const borderClass = bordered
        ? borderColor
            ? `border-2 border-solid`
            : `border-2 border-solid ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`
        : '';
    return (_jsxs("div", { ref: ref, className: cn('relative rounded-full overflow-hidden', sizeClasses[size], borderClass, className), style: borderColor ? { borderColor } : {}, ...props, children: [src ? (_jsx("img", { src: src, alt: alt, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium", children: initials || alt.charAt(0).toUpperCase() })), status && (_jsx("div", { className: "absolute bottom-0 right-0 translate-y-[20%] translate-x-[20%]", children: _jsx(StatusIndicator, { status: status, customColor: statusColor }) }))] }));
});
ContactAvatar.displayName = 'ContactAvatar';
export const ContactInfoItem = forwardRef(({ className, icon, label, value, href, copyable = false, ...props }, ref) => {
    const handleCopy = () => {
        if (copyable) {
            navigator.clipboard.writeText(value);
            // You could add a toast notification here
        }
    };
    const content = (_jsxs("div", { ref: ref, className: cn('flex items-start space-x-2', className), ...props, children: [icon && _jsx("div", { className: "mt-0.5 text-muted-foreground", children: icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [label && _jsx("div", { className: "text-xs text-muted-foreground", children: label }), _jsx("div", { className: "text-sm truncate", children: value })] }), copyable && (_jsx("button", { onClick: handleCopy, className: "p-1 text-muted-foreground hover:text-foreground", "aria-label": "Copy to clipboard", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }), _jsx("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })] }) }))] }));
    if (href) {
        return (_jsx("a", { href: href, className: "hover:underline", target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined, children: content }));
    }
    return content;
});
ContactInfoItem.displayName = 'ContactInfoItem';
export const ContactActionButton = forwardRef(({ className, icon, label, variant = 'outline', ...props }, ref) => {
    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-border bg-transparent hover:bg-muted/50',
    };
    return (_jsxs("button", { ref: ref, className: cn('flex flex-col items-center justify-center p-2 rounded-md transition-colors', variantClasses[variant], className), ...props, children: [_jsx("div", { className: "mb-1", children: icon }), _jsx("span", { className: "text-xs", children: label })] }));
});
ContactActionButton.displayName = 'ContactActionButton';
export const ContactCard = forwardRef(({ className, avatar, name, title, company, contactInfo, actions, tags, layout = 'vertical', size = 'md', variant = 'default', withHover = false, withShadow = false, footer, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    // Size classes
    const sizeClasses = {
        sm: 'p-3 space-y-2',
        md: 'p-4 space-y-3',
        lg: 'p-6 space-y-4',
    };
    // Avatar size based on card size
    const avatarSize = {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
    };
    // Variant classes based on theme
    const variantClasses = {
        default: 'bg-card text-card-foreground',
        primary: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        outline: 'border border-border bg-transparent',
    };
    // Shadow classes
    const shadowClass = withShadow ? (isDarkMode ? 'shadow-md shadow-black/20' : 'shadow-md shadow-black/10') : '';
    // Hover effect classes
    const hoverClass = withHover
        ? variant === 'default'
            ? 'hover:bg-muted/50 transition-colors'
            : variant === 'primary'
                ? 'hover:bg-primary/90 transition-colors'
                : variant === 'accent'
                    ? 'hover:bg-accent/90 transition-colors'
                    : 'hover:bg-muted/10 transition-colors'
        : '';
    // Email icon
    const emailIcon = (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] }));
    // Phone icon
    const phoneIcon = (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }) }));
    // Mobile icon
    const mobileIcon = (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }), _jsx("path", { d: "M12 18h.01" })] }));
    // Address icon
    const addressIcon = (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }), _jsx("circle", { cx: "12", cy: "10", r: "3" })] }));
    // Website icon
    const websiteIcon = (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }), _jsx("path", { d: "M2 12h20" })] }));
    // Company icon
    const companyIcon = (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" }), _jsx("path", { d: "M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" }), _jsx("path", { d: "M9 22V12" }), _jsx("path", { d: "M15 22V12" })] }));
    return (_jsx("div", { ref: ref, className: cn('rounded-lg', variantClasses[variant], shadowClass, hoverClass, layout === 'vertical' ? sizeClasses[size] : 'p-0', className), ...props, children: layout === 'horizontal' ? (_jsxs("div", { className: "flex", children: [_jsx("div", { className: cn('flex-shrink-0 p-4', sizeClasses[size]), children: avatar && (_jsx(ContactAvatar, { src: avatar.src, alt: avatar.alt || name, initials: avatar.initials || name.charAt(0), status: avatar.status, statusColor: avatar.statusColor, size: avatarSize[size] })) }), _jsxs("div", { className: "flex-1 p-4 min-w-0", children: [_jsxs("div", { className: "space-y-1 mb-2", children: [_jsx("h3", { className: "font-medium truncate", children: name }), title && _jsx("p", { className: "text-sm text-muted-foreground truncate", children: title }), company && (_jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [companyIcon, _jsx("span", { className: "ml-1 truncate", children: company })] }))] }), contactInfo && (_jsxs("div", { className: "space-y-1 mb-3", children: [contactInfo.email && (_jsx(ContactInfoItem, { icon: emailIcon, value: contactInfo.email, href: `mailto:${contactInfo.email}`, copyable: true })), contactInfo.phone && (_jsx(ContactInfoItem, { icon: phoneIcon, value: contactInfo.phone, href: `tel:${contactInfo.phone}` })), contactInfo.mobile && (_jsx(ContactInfoItem, { icon: mobileIcon, value: contactInfo.mobile, href: `tel:${contactInfo.mobile}` }))] })), tags && tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: tags.map((tag, index) => (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary", children: tag }, index))) }))] }), actions && (_jsx("div", { className: "flex items-center p-4 border-l border-border", children: actions }))] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-3", children: [avatar && (_jsx(ContactAvatar, { src: avatar.src, alt: avatar.alt || name, initials: avatar.initials || name.charAt(0), status: avatar.status, statusColor: avatar.statusColor, size: avatarSize[size] })), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "font-medium truncate", children: name }), title && _jsx("p", { className: "text-sm text-muted-foreground truncate", children: title }), company && (_jsx("div", { className: "flex items-center text-sm text-muted-foreground", children: _jsx("span", { className: "truncate", children: company }) }))] })] }), contactInfo && (_jsxs("div", { className: "space-y-1", children: [contactInfo.email && (_jsx(ContactInfoItem, { icon: emailIcon, value: contactInfo.email, href: `mailto:${contactInfo.email}`, copyable: true })), contactInfo.phone && (_jsx(ContactInfoItem, { icon: phoneIcon, value: contactInfo.phone, href: `tel:${contactInfo.phone}` })), contactInfo.mobile && (_jsx(ContactInfoItem, { icon: mobileIcon, value: contactInfo.mobile, href: `tel:${contactInfo.mobile}` })), contactInfo.address && (_jsx(ContactInfoItem, { icon: addressIcon, value: contactInfo.address, copyable: true })), contactInfo.website && (_jsx(ContactInfoItem, { icon: websiteIcon, value: contactInfo.website, href: contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}` })), Object.entries(contactInfo)
                            .filter(([key]) => !['email', 'phone', 'mobile', 'address', 'website'].includes(key))
                            .map(([key, value]) => (_jsx(ContactInfoItem, { label: key.charAt(0).toUpperCase() + key.slice(1), value: value || '' }, key)))] })), tags && tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1", children: tags.map((tag, index) => (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary", children: tag }, index))) })), actions && _jsx("div", { className: "flex flex-wrap gap-2", children: actions }), footer && _jsx("div", { className: "pt-2 border-t border-border/50", children: footer })] })) }));
});
ContactCard.displayName = 'ContactCard';
// Default action buttons
export const ContactCallButton = (props) => (_jsx(ContactActionButton, { icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }) }), label: "Call", ...props }));
export const ContactEmailButton = (props) => (_jsx(ContactActionButton, { icon: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] }), label: "Email", ...props }));
export const ContactMessageButton = (props) => (_jsx(ContactActionButton, { icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), label: "Message", ...props }));
//# sourceMappingURL=contact-card.js.map