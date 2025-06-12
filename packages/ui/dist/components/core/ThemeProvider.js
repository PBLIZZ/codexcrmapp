'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeTheme, toggleDarkMode, isDarkMode } from '../../lib/theme';
const initialState = {
    theme: 'system',
    setTheme: () => null,
    isDarkMode: false,
};
const ThemeContext = createContext(initialState);
export function ThemeProvider({ children, defaultTheme = 'system', }) {
    const [theme, setTheme] = useState(defaultTheme);
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        // Initialize theme on mount
        initializeTheme();
        setDarkMode(isDarkMode());
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
        else {
            setTheme('system');
        }
        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                toggleDarkMode(mediaQuery.matches);
                setDarkMode(mediaQuery.matches);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
            if (newTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                toggleDarkMode(prefersDark);
                setDarkMode(prefersDark);
                localStorage.removeItem('theme');
            }
            else {
                toggleDarkMode(newTheme === 'dark');
                setDarkMode(newTheme === 'dark');
                localStorage.setItem('theme', newTheme);
            }
        },
        isDarkMode: darkMode,
    };
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
}
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (_jsx("button", { onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'), className: "p-2 rounded-md bg-background hover:bg-accent/10 transition-colors", "aria-label": "Toggle theme", children: theme === 'dark' ? (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-accent", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }), _jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }), _jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }), _jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }), _jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }), _jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }), _jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }), _jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })] })) : (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-primary", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })) }));
}
//# sourceMappingURL=ThemeProvider.js.map