import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/utils'; // Assumes cn utility from shadcn/ui setup
/**
 * A reusable, centered loading spinner component.
 *
 * It is accessible via the `role="status"` attribute and a visually hidden
 * "Loading..." text for screen readers. It can be customized with a className.
 */
export const LoadingSpinner = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, 
        // ARIA role to indicate this is a live region presenting a status.
        role: "status", className: cn('flex items-center justify-center', className), ...props, children: [_jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" }), _jsx("span", { className: "sr-only", children: "Loading..." })] }));
});
LoadingSpinner.displayName = 'LoadingSpinner';
//# sourceMappingURL=loading-spinner.js.map