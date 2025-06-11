import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "./chunk-JGVXN6QQ.mjs";
import {
  cn
} from "./chunk-V7CNWJT3.mjs";

// src/components/ui/themed-card.tsx
import { forwardRef } from "react";

// src/components/core/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";

// src/lib/theme.ts
var themeConfig = {
  colors: {
    primary: {
      50: "var(--primary-50)",
      100: "var(--primary-100)",
      200: "var(--primary-200)",
      300: "var(--primary-300)",
      400: "var(--primary-400)",
      500: "var(--primary-500)",
      600: "var(--primary-600)",
      700: "var(--primary-700)",
      800: "var(--primary-800)",
      900: "var(--primary-900)",
      950: "var(--primary-950)",
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)"
    },
    accent: {
      50: "var(--accent-50)",
      100: "var(--accent-100)",
      200: "var(--accent-200)",
      300: "var(--accent-300)",
      400: "var(--accent-400)",
      500: "var(--accent-500)",
      600: "var(--accent-600)",
      700: "var(--accent-700)",
      800: "var(--accent-800)",
      900: "var(--accent-900)",
      950: "var(--accent-950)",
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)"
    },
    wellness: {
      teal: {
        50: "#e6f7f7",
        100: "#ccefef",
        200: "#99dfdf",
        300: "#66cfcf",
        400: "#33bfbf",
        500: "#00afaf",
        600: "#008c8c",
        700: "#006969",
        800: "#004646",
        900: "#002323",
        950: "#001111"
      },
      orange: {
        50: "#fff7e6",
        100: "#ffefcc",
        200: "#ffdf99",
        300: "#ffcf66",
        400: "#ffbf33",
        500: "#ffaf00",
        600: "#cc8c00",
        700: "#996900",
        800: "#664600",
        900: "#332300",
        950: "#1a1100"
      }
    }
  },
  borderRadius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)"
  },
  spacing: {
    content: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem"
    }
  },
  typography: {
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)"
    }
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
  }
};
function getThemeColor(path) {
  const parts = path.split(".");
  let current = themeConfig.colors;
  for (const part of parts) {
    if (current[part] === void 0) {
      return "";
    }
    current = current[part];
  }
  return current;
}
function isDarkMode() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}
function toggleDarkMode(isDark) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const newDarkMode = isDark !== void 0 ? isDark : !root.classList.contains("dark");
  if (newDarkMode) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}
function initializeTheme() {
  if (typeof window === "undefined") return;
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || !savedTheme && prefersDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// src/components/core/ThemeProvider.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var initialState = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: false
};
var ThemeContext = createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = "system"
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    initializeTheme();
    setDarkMode(isDarkMode());
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("system");
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        toggleDarkMode(mediaQuery.matches);
        setDarkMode(mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);
  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      if (newTheme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        toggleDarkMode(prefersDark);
        setDarkMode(prefersDark);
        localStorage.removeItem("theme");
      } else {
        toggleDarkMode(newTheme === "dark");
        setDarkMode(newTheme === "dark");
        localStorage.setItem("theme", newTheme);
      }
    },
    isDarkMode: darkMode
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
var useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
      className: "p-2 rounded-md bg-background hover:bg-accent/10 transition-colors",
      "aria-label": "Toggle theme",
      children: theme === "dark" ? /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "text-accent",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "5" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
            /* @__PURE__ */ jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
            /* @__PURE__ */ jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
            /* @__PURE__ */ jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
            /* @__PURE__ */ jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
            /* @__PURE__ */ jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
            /* @__PURE__ */ jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
          ]
        }
      ) : /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "text-primary",
          children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
        }
      )
    }
  );
}

// src/components/ui/themed-card.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var ThemedCard = forwardRef(
  ({
    className,
    variant = "default",
    size = "md",
    withHover = false,
    withShadow = false,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const sizeClasses = {
      sm: "p-3",
      md: "p-4",
      lg: "p-6"
    };
    const variantClasses = {
      default: "bg-card text-card-foreground",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      outline: "border border-border bg-transparent"
    };
    const shadowClass = withShadow ? isDarkMode2 ? "shadow-md shadow-black/20" : "shadow-md shadow-black/10" : "";
    const hoverClass = withHover ? variant === "default" ? "hover:bg-muted/50 transition-colors" : variant === "primary" ? "hover:bg-primary/90 transition-colors" : variant === "accent" ? "hover:bg-accent/90 transition-colors" : "hover:bg-muted/10 transition-colors" : "";
    return /* @__PURE__ */ jsx2(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg",
          variantClasses[variant],
          sizeClasses[size],
          shadowClass,
          hoverClass,
          className
        ),
        ...props
      }
    );
  }
);
ThemedCard.displayName = "ThemedCard";
var ThemedCardHeader = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
    "div",
    {
      ref,
      className: cn("flex flex-col space-y-1.5", className),
      ...props
    }
  )
);
ThemedCardHeader.displayName = "ThemedCardHeader";
var ThemedCardTitle = forwardRef(
  ({ className, level = 3, ...props }, ref) => {
    const titleClasses = cn(
      "font-semibold leading-none tracking-tight",
      level === 1 && "text-2xl",
      level === 2 && "text-xl",
      level === 3 && "text-lg",
      level === 4 && "text-base",
      level === 5 && "text-sm",
      level === 6 && "text-xs",
      className
    );
    switch (level) {
      case 1:
        return /* @__PURE__ */ jsx2("h1", { ref, className: titleClasses, ...props });
      case 2:
        return /* @__PURE__ */ jsx2("h2", { ref, className: titleClasses, ...props });
      case 3:
        return /* @__PURE__ */ jsx2("h3", { ref, className: titleClasses, ...props });
      case 4:
        return /* @__PURE__ */ jsx2("h4", { ref, className: titleClasses, ...props });
      case 5:
        return /* @__PURE__ */ jsx2("h5", { ref, className: titleClasses, ...props });
      case 6:
        return /* @__PURE__ */ jsx2("h6", { ref, className: titleClasses, ...props });
      default:
        return /* @__PURE__ */ jsx2("h3", { ref, className: titleClasses, ...props });
    }
  }
);
ThemedCardTitle.displayName = "ThemedCardTitle";
var ThemedCardDescription = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
    "p",
    {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  )
);
ThemedCardDescription.displayName = "ThemedCardDescription";
var ThemedCardContent = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2("div", { ref, className: cn("pt-0", className), ...props })
);
ThemedCardContent.displayName = "ThemedCardContent";
var ThemedCardFooter = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
    "div",
    {
      ref,
      className: cn("flex items-center pt-4", className),
      ...props
    }
  )
);
ThemedCardFooter.displayName = "ThemedCardFooter";

// src/components/ui/metric-card.tsx
import { forwardRef as forwardRef2 } from "react";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var TrendUpIcon = () => /* @__PURE__ */ jsx3(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-green-500",
    children: /* @__PURE__ */ jsx3("path", { d: "m18 15-6-6-6 6" })
  }
);
var TrendDownIcon = () => /* @__PURE__ */ jsx3(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-red-500",
    children: /* @__PURE__ */ jsx3("path", { d: "m6 9 6 6 6-6" })
  }
);
var TrendNeutralIcon = () => /* @__PURE__ */ jsx3(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-gray-500",
    children: /* @__PURE__ */ jsx3("path", { d: "M5 12h14" })
  }
);
var MetricCardSkeleton = ({ className }) => /* @__PURE__ */ jsxs2("div", { className: cn("animate-pulse space-y-3", className), children: [
  /* @__PURE__ */ jsx3("div", { className: "h-4 w-1/3 rounded bg-muted" }),
  /* @__PURE__ */ jsx3("div", { className: "h-8 w-2/3 rounded bg-muted" }),
  /* @__PURE__ */ jsx3("div", { className: "h-4 w-1/4 rounded bg-muted" })
] });
var MetricCard = forwardRef2(
  ({
    className,
    title,
    value,
    trend = "neutral",
    trendValue,
    trendLabel,
    icon,
    chart,
    loading = false,
    size = "md",
    variant = "default",
    withHover = false,
    withShadow = false,
    footer,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const sizeClasses = {
      sm: "p-3 space-y-1",
      md: "p-4 space-y-2",
      lg: "p-6 space-y-3"
    };
    const variantClasses = {
      default: "bg-card text-card-foreground",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      outline: "border border-border bg-transparent"
    };
    const shadowClass = withShadow ? isDarkMode2 ? "shadow-md shadow-black/20" : "shadow-md shadow-black/10" : "";
    const hoverClass = withHover ? variant === "default" ? "hover:bg-muted/50 transition-colors" : variant === "primary" ? "hover:bg-primary/90 transition-colors" : variant === "accent" ? "hover:bg-accent/90 transition-colors" : "hover:bg-muted/10 transition-colors" : "";
    const valueSize = {
      sm: "text-xl",
      md: "text-2xl",
      lg: "text-3xl"
    };
    const trendIcon = trend === "up" ? /* @__PURE__ */ jsx3(TrendUpIcon, {}) : trend === "down" ? /* @__PURE__ */ jsx3(TrendDownIcon, {}) : /* @__PURE__ */ jsx3(TrendNeutralIcon, {});
    const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg",
          variantClasses[variant],
          sizeClasses[size],
          shadowClass,
          hoverClass,
          className
        ),
        ...props,
        children: loading ? /* @__PURE__ */ jsx3(MetricCardSkeleton, {}) : /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx3("h3", { className: "text-sm font-medium text-muted-foreground", children: title }),
            icon && /* @__PURE__ */ jsx3("div", { className: "h-5 w-5", children: icon })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "flex items-end justify-between", children: [
            /* @__PURE__ */ jsx3("div", { className: cn("font-bold", valueSize[size]), children: value }),
            trend && /* @__PURE__ */ jsxs2("div", { className: "flex items-center space-x-1", children: [
              trendIcon,
              trendValue && /* @__PURE__ */ jsx3("span", { className: cn("text-sm font-medium", trendColor), children: trendValue })
            ] })
          ] }),
          trendLabel && /* @__PURE__ */ jsx3("p", { className: "text-xs text-muted-foreground", children: trendLabel }),
          chart && /* @__PURE__ */ jsx3("div", { className: "mt-2", children: chart }),
          footer && /* @__PURE__ */ jsx3("div", { className: "mt-2 pt-2 border-t border-border/50", children: footer })
        ] })
      }
    );
  }
);
MetricCard.displayName = "MetricCard";
var SimpleLineChart = ({
  data,
  height = 40,
  color = "var(--primary)",
  className
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = index / (data.length - 1) * 100;
    const y = 100 - (value - min) / range * 100;
    return `${x},${y}`;
  }).join(" ");
  return /* @__PURE__ */ jsx3("div", { className: cn("w-full", className), style: { height }, children: /* @__PURE__ */ jsx3("svg", { width: "100%", height: "100%", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: /* @__PURE__ */ jsx3(
    "polyline",
    {
      points,
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ) }) });
};
var ProgressIndicator = ({
  value,
  max = 100,
  color = "var(--primary)",
  backgroundColor = "var(--muted)",
  size = "md",
  showValue = false,
  className
}) => {
  const percentage = Math.min(100, Math.max(0, value / max * 100));
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };
  return /* @__PURE__ */ jsxs2("div", { className: cn("w-full space-y-1", className), children: [
    /* @__PURE__ */ jsx3("div", { className: cn("w-full rounded-full overflow-hidden", sizeClasses[size]), style: { backgroundColor }, children: /* @__PURE__ */ jsx3(
      "div",
      {
        className: "h-full rounded-full transition-all duration-300 ease-in-out",
        style: { width: `${percentage}%`, backgroundColor: color }
      }
    ) }),
    showValue && /* @__PURE__ */ jsxs2("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx3("span", { children: value }),
      /* @__PURE__ */ jsx3("span", { children: max })
    ] })
  ] });
};
var CircularProgress = ({
  value,
  max = 100,
  size = 40,
  strokeWidth = 4,
  color = "var(--primary)",
  backgroundColor = "var(--muted)",
  showValue = false,
  className
}) => {
  const percentage = Math.min(100, Math.max(0, value / max * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = percentage * circumference / 100;
  return /* @__PURE__ */ jsxs2("div", { className: cn("relative inline-flex items-center justify-center", className), children: [
    /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: [
      /* @__PURE__ */ jsx3(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: backgroundColor,
          strokeWidth
        }
      ),
      /* @__PURE__ */ jsx3(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: color,
          strokeWidth,
          strokeDasharray: circumference,
          strokeDashoffset: circumference - dash,
          transform: `rotate(-90 ${size / 2} ${size / 2})`,
          strokeLinecap: "round",
          style: { transition: "stroke-dashoffset 0.5s ease-in-out" }
        }
      )
    ] }),
    showValue && /* @__PURE__ */ jsx3("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs2("span", { className: "text-xs font-medium", children: [
      Math.round(percentage),
      "%"
    ] }) })
  ] });
};

// src/components/ui/contact-card.tsx
import { forwardRef as forwardRef3 } from "react";
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var StatusIndicator = ({
  status,
  customColor,
  className
}) => {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    custom: ""
  };
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: cn(
        "h-3 w-3 rounded-full",
        status !== "custom" && statusColors[status],
        className
      ),
      style: status === "custom" && customColor ? { backgroundColor: customColor } : {}
    }
  );
};
var ContactAvatar = forwardRef3(
  ({
    className,
    src,
    alt = "Avatar",
    initials,
    size = "md",
    status,
    statusColor,
    bordered = false,
    borderColor,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-12 w-12 text-sm",
      lg: "h-16 w-16 text-base",
      xl: "h-24 w-24 text-lg"
    };
    const borderClass = bordered ? borderColor ? `border-2 border-solid` : `border-2 border-solid ${isDarkMode2 ? "border-gray-700" : "border-gray-200"}` : "";
    return /* @__PURE__ */ jsxs3(
      "div",
      {
        ref,
        className: cn("relative rounded-full overflow-hidden", sizeClasses[size], borderClass, className),
        style: borderColor ? { borderColor } : {},
        ...props,
        children: [
          src ? /* @__PURE__ */ jsx4(
            "img",
            {
              src,
              alt,
              className: "h-full w-full object-cover"
            }
          ) : /* @__PURE__ */ jsx4("div", { className: "h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium", children: initials || alt.charAt(0).toUpperCase() }),
          status && /* @__PURE__ */ jsx4("div", { className: "absolute bottom-0 right-0 translate-y-[20%] translate-x-[20%]", children: /* @__PURE__ */ jsx4(StatusIndicator, { status, customColor: statusColor }) })
        ]
      }
    );
  }
);
ContactAvatar.displayName = "ContactAvatar";
var ContactInfoItem = forwardRef3(
  ({ className, icon, label, value, href, copyable = false, ...props }, ref) => {
    const handleCopy = () => {
      if (copyable) {
        navigator.clipboard.writeText(value);
      }
    };
    const content = /* @__PURE__ */ jsxs3(
      "div",
      {
        ref,
        className: cn("flex items-start space-x-2", className),
        ...props,
        children: [
          icon && /* @__PURE__ */ jsx4("div", { className: "mt-0.5 text-muted-foreground", children: icon }),
          /* @__PURE__ */ jsxs3("div", { className: "flex-1 min-w-0", children: [
            label && /* @__PURE__ */ jsx4("div", { className: "text-xs text-muted-foreground", children: label }),
            /* @__PURE__ */ jsx4("div", { className: "text-sm truncate", children: value })
          ] }),
          copyable && /* @__PURE__ */ jsx4(
            "button",
            {
              onClick: handleCopy,
              className: "p-1 text-muted-foreground hover:text-foreground",
              "aria-label": "Copy to clipboard",
              children: /* @__PURE__ */ jsxs3(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx4("rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }),
                    /* @__PURE__ */ jsx4("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })
                  ]
                }
              )
            }
          )
        ]
      }
    );
    if (href) {
      return /* @__PURE__ */ jsx4(
        "a",
        {
          href,
          className: "hover:underline",
          target: href.startsWith("http") ? "_blank" : void 0,
          rel: href.startsWith("http") ? "noopener noreferrer" : void 0,
          children: content
        }
      );
    }
    return content;
  }
);
ContactInfoItem.displayName = "ContactInfoItem";
var ContactActionButton = forwardRef3(
  ({ className, icon, label, variant = "outline", ...props }, ref) => {
    const variantClasses = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      outline: "border border-border bg-transparent hover:bg-muted/50"
    };
    return /* @__PURE__ */ jsxs3(
      "button",
      {
        ref,
        className: cn(
          "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
          variantClasses[variant],
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx4("div", { className: "mb-1", children: icon }),
          /* @__PURE__ */ jsx4("span", { className: "text-xs", children: label })
        ]
      }
    );
  }
);
ContactActionButton.displayName = "ContactActionButton";
var ContactCard = forwardRef3(
  ({
    className,
    avatar,
    name,
    title,
    company,
    contactInfo,
    actions,
    tags,
    layout = "vertical",
    size = "md",
    variant = "default",
    withHover = false,
    withShadow = false,
    footer,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const sizeClasses = {
      sm: "p-3 space-y-2",
      md: "p-4 space-y-3",
      lg: "p-6 space-y-4"
    };
    const avatarSize = {
      sm: "sm",
      md: "md",
      lg: "lg"
    };
    const variantClasses = {
      default: "bg-card text-card-foreground",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      outline: "border border-border bg-transparent"
    };
    const shadowClass = withShadow ? isDarkMode2 ? "shadow-md shadow-black/20" : "shadow-md shadow-black/10" : "";
    const hoverClass = withHover ? variant === "default" ? "hover:bg-muted/50 transition-colors" : variant === "primary" ? "hover:bg-primary/90 transition-colors" : variant === "accent" ? "hover:bg-accent/90 transition-colors" : "hover:bg-muted/10 transition-colors" : "";
    const emailIcon = /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
          /* @__PURE__ */ jsx4("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
        ]
      }
    );
    const phoneIcon = /* @__PURE__ */ jsx4(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /* @__PURE__ */ jsx4("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
      }
    );
    const mobileIcon = /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }),
          /* @__PURE__ */ jsx4("path", { d: "M12 18h.01" })
        ]
      }
    );
    const addressIcon = /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }),
          /* @__PURE__ */ jsx4("circle", { cx: "12", cy: "10", r: "3" })
        ]
      }
    );
    const websiteIcon = /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx4("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }),
          /* @__PURE__ */ jsx4("path", { d: "M2 12h20" })
        ]
      }
    );
    const companyIcon = /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("path", { d: "M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" }),
          /* @__PURE__ */ jsx4("path", { d: "M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" }),
          /* @__PURE__ */ jsx4("path", { d: "M9 22V12" }),
          /* @__PURE__ */ jsx4("path", { d: "M15 22V12" })
        ]
      }
    );
    return /* @__PURE__ */ jsx4(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg",
          variantClasses[variant],
          shadowClass,
          hoverClass,
          layout === "vertical" ? sizeClasses[size] : "p-0",
          className
        ),
        ...props,
        children: layout === "horizontal" ? /* @__PURE__ */ jsxs3("div", { className: "flex", children: [
          /* @__PURE__ */ jsx4("div", { className: cn("flex-shrink-0 p-4", sizeClasses[size]), children: avatar && /* @__PURE__ */ jsx4(
            ContactAvatar,
            {
              src: avatar.src,
              alt: avatar.alt || name,
              initials: avatar.initials || name.charAt(0),
              status: avatar.status,
              statusColor: avatar.statusColor,
              size: avatarSize[size]
            }
          ) }),
          /* @__PURE__ */ jsxs3("div", { className: "flex-1 p-4 min-w-0", children: [
            /* @__PURE__ */ jsxs3("div", { className: "space-y-1 mb-2", children: [
              /* @__PURE__ */ jsx4("h3", { className: "font-medium truncate", children: name }),
              title && /* @__PURE__ */ jsx4("p", { className: "text-sm text-muted-foreground truncate", children: title }),
              company && /* @__PURE__ */ jsxs3("div", { className: "flex items-center text-sm text-muted-foreground", children: [
                companyIcon,
                /* @__PURE__ */ jsx4("span", { className: "ml-1 truncate", children: company })
              ] })
            ] }),
            contactInfo && /* @__PURE__ */ jsxs3("div", { className: "space-y-1 mb-3", children: [
              contactInfo.email && /* @__PURE__ */ jsx4(
                ContactInfoItem,
                {
                  icon: emailIcon,
                  value: contactInfo.email,
                  href: `mailto:${contactInfo.email}`,
                  copyable: true
                }
              ),
              contactInfo.phone && /* @__PURE__ */ jsx4(
                ContactInfoItem,
                {
                  icon: phoneIcon,
                  value: contactInfo.phone,
                  href: `tel:${contactInfo.phone}`
                }
              ),
              contactInfo.mobile && /* @__PURE__ */ jsx4(
                ContactInfoItem,
                {
                  icon: mobileIcon,
                  value: contactInfo.mobile,
                  href: `tel:${contactInfo.mobile}`
                }
              )
            ] }),
            tags && tags.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-1 mt-2", children: tags.map((tag, index) => /* @__PURE__ */ jsx4(
              "span",
              {
                className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",
                children: tag
              },
              index
            )) })
          ] }),
          actions && /* @__PURE__ */ jsx4("div", { className: "flex items-center p-4 border-l border-border", children: actions })
        ] }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center space-x-3", children: [
            avatar && /* @__PURE__ */ jsx4(
              ContactAvatar,
              {
                src: avatar.src,
                alt: avatar.alt || name,
                initials: avatar.initials || name.charAt(0),
                status: avatar.status,
                statusColor: avatar.statusColor,
                size: avatarSize[size]
              }
            ),
            /* @__PURE__ */ jsxs3("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx4("h3", { className: "font-medium truncate", children: name }),
              title && /* @__PURE__ */ jsx4("p", { className: "text-sm text-muted-foreground truncate", children: title }),
              company && /* @__PURE__ */ jsx4("div", { className: "flex items-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsx4("span", { className: "truncate", children: company }) })
            ] })
          ] }),
          contactInfo && /* @__PURE__ */ jsxs3("div", { className: "space-y-1", children: [
            contactInfo.email && /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                icon: emailIcon,
                value: contactInfo.email,
                href: `mailto:${contactInfo.email}`,
                copyable: true
              }
            ),
            contactInfo.phone && /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                icon: phoneIcon,
                value: contactInfo.phone,
                href: `tel:${contactInfo.phone}`
              }
            ),
            contactInfo.mobile && /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                icon: mobileIcon,
                value: contactInfo.mobile,
                href: `tel:${contactInfo.mobile}`
              }
            ),
            contactInfo.address && /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                icon: addressIcon,
                value: contactInfo.address,
                copyable: true
              }
            ),
            contactInfo.website && /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                icon: websiteIcon,
                value: contactInfo.website,
                href: contactInfo.website.startsWith("http") ? contactInfo.website : `https://${contactInfo.website}`
              }
            ),
            Object.entries(contactInfo).filter(([key]) => !["email", "phone", "mobile", "address", "website"].includes(key)).map(([key, value]) => /* @__PURE__ */ jsx4(
              ContactInfoItem,
              {
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: value || ""
              },
              key
            ))
          ] }),
          tags && tags.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-1", children: tags.map((tag, index) => /* @__PURE__ */ jsx4(
            "span",
            {
              className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",
              children: tag
            },
            index
          )) }),
          actions && /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2", children: actions }),
          footer && /* @__PURE__ */ jsx4("div", { className: "pt-2 border-t border-border/50", children: footer })
        ] })
      }
    );
  }
);
ContactCard.displayName = "ContactCard";
var ContactCallButton = (props) => /* @__PURE__ */ jsx4(
  ContactActionButton,
  {
    icon: /* @__PURE__ */ jsx4(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /* @__PURE__ */ jsx4("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
      }
    ),
    label: "Call",
    ...props
  }
);
var ContactEmailButton = (props) => /* @__PURE__ */ jsx4(
  ContactActionButton,
  {
    icon: /* @__PURE__ */ jsxs3(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsx4("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
          /* @__PURE__ */ jsx4("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
        ]
      }
    ),
    label: "Email",
    ...props
  }
);
var ContactMessageButton = (props) => /* @__PURE__ */ jsx4(
  ContactActionButton,
  {
    icon: /* @__PURE__ */ jsx4(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /* @__PURE__ */ jsx4("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
      }
    ),
    label: "Message",
    ...props
  }
);

// src/components/ui/timeline.tsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var Timeline = forwardRef4(
  ({ className, orientation = "vertical", compact = false, reverse = false, children, ...props }, ref) => {
    const orientationClasses = {
      vertical: "flex flex-col",
      horizontal: "flex flex-row"
    };
    const spacingClasses = compact ? "space-y-2" : "space-y-6";
    const horizontalSpacingClasses = compact ? "space-x-4" : "space-x-12";
    return /* @__PURE__ */ jsx5(
      "div",
      {
        ref,
        className: cn(
          orientationClasses[orientation],
          orientation === "vertical" ? spacingClasses : horizontalSpacingClasses,
          reverse && orientation === "vertical" && "flex-col-reverse",
          reverse && orientation === "horizontal" && "flex-row-reverse",
          className
        ),
        ...props,
        children
      }
    );
  }
);
Timeline.displayName = "Timeline";
var TimelineItem = forwardRef4(
  ({
    className,
    icon,
    iconBackground,
    connector = true,
    connectorColor,
    connectorStyle = "solid",
    active = false,
    orientation = "vertical",
    position = "left",
    children,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const defaultConnectorColor = isDarkMode2 ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
    const activeConnectorColor = "var(--primary)";
    const connectorStyleClasses = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted"
    };
    if (orientation === "vertical") {
      return /* @__PURE__ */ jsxs4(
        "div",
        {
          ref,
          className: cn("relative flex", className),
          ...props,
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center mr-4", children: [
              /* @__PURE__ */ jsx5(
                "div",
                {
                  className: cn(
                    "z-10 flex items-center justify-center w-8 h-8 rounded-full",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  ),
                  style: iconBackground ? { backgroundColor: iconBackground } : {},
                  children: icon || /* @__PURE__ */ jsxs4(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        /* @__PURE__ */ jsx5("circle", { cx: "12", cy: "12", r: "10" }),
                        /* @__PURE__ */ jsx5("path", { d: "m12 8 4 4-4 4" }),
                        /* @__PURE__ */ jsx5("path", { d: "m8 12h8" })
                      ]
                    }
                  )
                }
              ),
              connector && /* @__PURE__ */ jsx5(
                "div",
                {
                  className: cn(
                    "w-0 h-full border-l-2 mt-1",
                    connectorStyleClasses[connectorStyle]
                  ),
                  style: {
                    borderColor: active ? connectorColor || activeConnectorColor : connectorColor || defaultConnectorColor
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsx5("div", { className: "flex-1 pb-6", children })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        ref,
        className: cn("relative flex flex-col", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center mb-2", children: [
            /* @__PURE__ */ jsx5(
              "div",
              {
                className: cn(
                  "z-10 flex items-center justify-center w-8 h-8 rounded-full",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                ),
                style: iconBackground ? { backgroundColor: iconBackground } : {},
                children: icon || /* @__PURE__ */ jsxs4(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsx5("circle", { cx: "12", cy: "12", r: "10" }),
                      /* @__PURE__ */ jsx5("path", { d: "m12 8 4 4-4 4" }),
                      /* @__PURE__ */ jsx5("path", { d: "m8 12h8" })
                    ]
                  }
                )
              }
            ),
            connector && /* @__PURE__ */ jsx5(
              "div",
              {
                className: cn(
                  "h-0 flex-1 border-t-2 ml-1",
                  connectorStyleClasses[connectorStyle]
                ),
                style: {
                  borderColor: active ? connectorColor || activeConnectorColor : connectorColor || defaultConnectorColor
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsx5("div", { className: "ml-8", children })
        ]
      }
    );
  }
);
TimelineItem.displayName = "TimelineItem";
var TimelineContent = forwardRef4(
  ({ className, title, subtitle, date, children, ...props }, ref) => {
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        ref,
        className: cn("space-y-1", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-start justify-between", children: [
            title && /* @__PURE__ */ jsx5("h4", { className: "font-medium", children: title }),
            date && /* @__PURE__ */ jsx5("span", { className: "text-sm text-muted-foreground", children: date })
          ] }),
          subtitle && /* @__PURE__ */ jsx5("p", { className: "text-sm text-muted-foreground", children: subtitle }),
          children && /* @__PURE__ */ jsx5("div", { className: "mt-2", children })
        ]
      }
    );
  }
);
TimelineContent.displayName = "TimelineContent";
var TimelineSeparator = forwardRef4(
  ({ className, label, ...props }, ref) => {
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        ref,
        className: cn("relative flex items-center py-4", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx5("div", { className: "flex-grow border-t border-border" }),
          label && /* @__PURE__ */ jsx5("span", { className: "flex-shrink mx-4 text-sm font-medium text-muted-foreground", children: label }),
          /* @__PURE__ */ jsx5("div", { className: "flex-grow border-t border-border" })
        ]
      }
    );
  }
);
TimelineSeparator.displayName = "TimelineSeparator";
var TimelineDot = forwardRef4(
  ({ className, size = "md", color, variant = "filled", active = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4"
    };
    return /* @__PURE__ */ jsx5(
      "div",
      {
        ref,
        className: cn(
          "rounded-full",
          sizeClasses[size],
          variant === "outlined" ? "border-2" : "",
          active ? "bg-primary border-primary" : "bg-muted border-muted",
          className
        ),
        style: color ? { backgroundColor: variant === "filled" ? color : "transparent", borderColor: color } : {},
        ...props
      }
    );
  }
);
TimelineDot.displayName = "TimelineDot";

// src/components/ui/task-card.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var PriorityBadge = forwardRef5(
  ({ className, priority, customColor, size = "md", ...props }, ref) => {
    const priorityColors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      custom: ""
    };
    const priorityLabels = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
      custom: "Custom"
    };
    const sizeClasses = {
      sm: "text-xs px-1.5 py-0.5",
      md: "text-xs px-2 py-1",
      lg: "text-sm px-2.5 py-1.5"
    };
    return /* @__PURE__ */ jsx6(
      "div",
      {
        ref,
        className: cn(
          "inline-flex items-center rounded-full font-medium",
          priorityColors[priority],
          sizeClasses[size],
          className
        ),
        style: priority === "custom" && customColor ? { backgroundColor: customColor } : {},
        ...props,
        children: priorityLabels[priority]
      }
    );
  }
);
PriorityBadge.displayName = "PriorityBadge";
var StatusBadge = forwardRef5(
  ({ className, status, customColor, size = "md", ...props }, ref) => {
    const statusColors = {
      todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      review: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      blocked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      custom: ""
    };
    const statusLabels = {
      todo: "To Do",
      "in-progress": "In Progress",
      review: "Review",
      done: "Done",
      blocked: "Blocked",
      custom: "Custom"
    };
    const sizeClasses = {
      sm: "text-xs px-1.5 py-0.5",
      md: "text-xs px-2 py-1",
      lg: "text-sm px-2.5 py-1.5"
    };
    return /* @__PURE__ */ jsx6(
      "div",
      {
        ref,
        className: cn(
          "inline-flex items-center rounded-full font-medium",
          statusColors[status],
          sizeClasses[size],
          className
        ),
        style: status === "custom" && customColor ? { backgroundColor: customColor } : {},
        ...props,
        children: statusLabels[status]
      }
    );
  }
);
StatusBadge.displayName = "StatusBadge";
var TaskProgress = forwardRef5(
  ({ className, value, max = 100, showLabel = false, size = "md", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, value / max * 100));
    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3"
    };
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        ref,
        className: cn("space-y-1", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx6("div", { className: cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size]), children: /* @__PURE__ */ jsx6(
            "div",
            {
              className: "bg-primary h-full rounded-full transition-all duration-300 ease-in-out",
              style: { width: `${percentage}%` }
            }
          ) }),
          showLabel && /* @__PURE__ */ jsxs5("div", { className: "flex justify-between items-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx6("span", { children: "Progress" }),
            /* @__PURE__ */ jsxs5("span", { children: [
              Math.round(percentage),
              "%"
            ] })
          ] })
        ]
      }
    );
  }
);
TaskProgress.displayName = "TaskProgress";
var DueDate = forwardRef5(
  ({ className, date, showIcon = true, isPastDue, ...props }, ref) => {
    const formatDate = (date2) => {
      const d = typeof date2 === "string" ? new Date(date2) : date2;
      return d.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
    };
    const checkPastDue = (date2) => {
      if (isPastDue !== void 0) return isPastDue;
      const d = typeof date2 === "string" ? new Date(date2) : date2;
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return d < today;
    };
    const pastDue = checkPastDue(date);
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        ref,
        className: cn(
          "flex items-center text-sm",
          pastDue ? "text-red-500" : "text-muted-foreground",
          className
        ),
        ...props,
        children: [
          showIcon && /* @__PURE__ */ jsxs5(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "mr-1",
              children: [
                /* @__PURE__ */ jsx6("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", ry: "2" }),
                /* @__PURE__ */ jsx6("line", { x1: "16", x2: "16", y1: "2", y2: "6" }),
                /* @__PURE__ */ jsx6("line", { x1: "8", x2: "8", y1: "2", y2: "6" }),
                /* @__PURE__ */ jsx6("line", { x1: "3", x2: "21", y1: "10", y2: "10" })
              ]
            }
          ),
          /* @__PURE__ */ jsx6("span", { children: formatDate(date) })
        ]
      }
    );
  }
);
DueDate.displayName = "DueDate";
var Assignee = forwardRef5(
  ({ className, name, avatar, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base"
    };
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        ref,
        className: cn("flex items-center space-x-2", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx6(
            "div",
            {
              className: cn(
                "rounded-full flex items-center justify-center bg-primary/10 text-primary",
                sizeClasses[size]
              ),
              children: avatar ? /* @__PURE__ */ jsx6("img", { src: avatar, alt: name, className: "h-full w-full rounded-full object-cover" }) : /* @__PURE__ */ jsx6("span", { children: initials })
            }
          ),
          /* @__PURE__ */ jsx6("span", { className: "text-sm", children: name })
        ]
      }
    );
  }
);
Assignee.displayName = "Assignee";
var TaskCard = forwardRef5(
  ({
    className,
    title,
    description,
    priority = "medium",
    status = "todo",
    progress,
    dueDate,
    assignee,
    tags,
    size = "md",
    variant = "default",
    withHover = false,
    withShadow = false,
    footer,
    children,
    ...props
  }, ref) => {
    const { isDarkMode: isDarkMode2 } = useTheme();
    const sizeClasses = {
      sm: "p-3 space-y-2",
      md: "p-4 space-y-3",
      lg: "p-6 space-y-4"
    };
    const variantClasses = {
      default: "bg-card text-card-foreground",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      outline: "border border-border bg-transparent"
    };
    const shadowClass = withShadow ? isDarkMode2 ? "shadow-md shadow-black/20" : "shadow-md shadow-black/10" : "";
    const hoverClass = withHover ? variant === "default" ? "hover:bg-muted/50 transition-colors" : variant === "primary" ? "hover:bg-primary/90 transition-colors" : variant === "accent" ? "hover:bg-accent/90 transition-colors" : "hover:bg-muted/10 transition-colors" : "";
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg",
          variantClasses[variant],
          sizeClasses[size],
          shadowClass,
          hoverClass,
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsx6("h3", { className: "font-medium", children: title }),
            /* @__PURE__ */ jsxs5("div", { className: "flex space-x-2", children: [
              priority && /* @__PURE__ */ jsx6(PriorityBadge, { priority, size: "sm" }),
              status && /* @__PURE__ */ jsx6(StatusBadge, { status, size: "sm" })
            ] })
          ] }),
          description && /* @__PURE__ */ jsx6("p", { className: "text-sm text-muted-foreground", children: description }),
          progress !== void 0 && /* @__PURE__ */ jsx6(TaskProgress, { value: progress, showLabel: true, size: "sm" }),
          (assignee || dueDate) && /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between text-sm", children: [
            assignee && /* @__PURE__ */ jsx6(Assignee, { name: assignee.name, avatar: assignee.avatar, size: "sm" }),
            dueDate && /* @__PURE__ */ jsx6(DueDate, { date: dueDate })
          ] }),
          tags && tags.length > 0 && /* @__PURE__ */ jsx6("div", { className: "flex flex-wrap gap-1", children: tags.map((tag, index) => /* @__PURE__ */ jsx6(
            "span",
            {
              className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary",
              children: tag
            },
            index
          )) }),
          children && /* @__PURE__ */ jsx6("div", { children }),
          footer && /* @__PURE__ */ jsx6("div", { className: "pt-2 border-t border-border/50", children: footer })
        ]
      }
    );
  }
);
TaskCard.displayName = "TaskCard";
var TaskList = forwardRef5(
  ({ className, tasks, layout = "grid", columns = 1, gap = "md", ...props }, ref) => {
    const layoutClasses = {
      grid: "grid",
      list: "flex flex-col"
    };
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    };
    const gapClasses = {
      sm: layout === "grid" ? "gap-2" : "space-y-2",
      md: layout === "grid" ? "gap-4" : "space-y-4",
      lg: layout === "grid" ? "gap-6" : "space-y-6"
    };
    return /* @__PURE__ */ jsx6(
      "div",
      {
        ref,
        className: cn(
          layoutClasses[layout],
          layout === "grid" && columnClasses[columns],
          gapClasses[gap],
          className
        ),
        ...props,
        children: tasks.map((task, index) => /* @__PURE__ */ jsx6(TaskCard, { ...task }, index))
      }
    );
  }
);
TaskList.displayName = "TaskList";

// src/components/core/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { jsx as jsx7 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx7(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/components/core/ThemeDemo.tsx
import { useState as useState2 } from "react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function ThemeDemo({ className }) {
  const { theme, setTheme, isDarkMode: isDarkMode2 } = useTheme();
  const [activeTab, setActiveTab] = useState2("colors");
  return /* @__PURE__ */ jsxs6("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx8("h2", { className: "text-2xl font-bold", children: "Theme Demonstration" }),
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx8(
          "button",
          {
            onClick: () => setTheme("light"),
            className: cn(
              "px-3 py-1 rounded-md",
              theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Light"
          }
        ),
        /* @__PURE__ */ jsx8(
          "button",
          {
            onClick: () => setTheme("dark"),
            className: cn(
              "px-3 py-1 rounded-md",
              theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Dark"
          }
        ),
        /* @__PURE__ */ jsx8(
          "button",
          {
            onClick: () => setTheme("system"),
            className: cn(
              "px-3 py-1 rounded-md",
              theme === "system" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "System"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "flex space-x-2 border-b", children: [
      /* @__PURE__ */ jsx8(
        "button",
        {
          onClick: () => setActiveTab("colors"),
          className: cn(
            "px-4 py-2",
            activeTab === "colors" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
          ),
          children: "Color Palette"
        }
      ),
      /* @__PURE__ */ jsx8(
        "button",
        {
          onClick: () => setActiveTab("components"),
          className: cn(
            "px-4 py-2",
            activeTab === "components" ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
          ),
          children: "Components"
        }
      )
    ] }),
    activeTab === "colors" && /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "Primary Colors (Teal)" }),
        /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-5 gap-2", children: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx8(
            "div",
            {
              className: `h-10 w-full rounded-md`,
              style: { backgroundColor: `var(--primary-${shade})` }
            }
          ),
          /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsxs6("div", { className: "font-medium", children: [
            "Primary ",
            shade
          ] }) })
        ] }, `primary-${shade}`)) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "Accent Colors (Orange)" }),
        /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-5 gap-2", children: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx8(
            "div",
            {
              className: `h-10 w-full rounded-md`,
              style: { backgroundColor: `var(--accent-${shade})` }
            }
          ),
          /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsxs6("div", { className: "font-medium", children: [
            "Accent ",
            shade
          ] }) })
        ] }, `accent-${shade}`)) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "UI Colors" }),
        /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--background)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Background" }) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--foreground)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Foreground" }) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--card)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Card" }) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--card-foreground)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Card Foreground" }) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--muted)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Muted" }) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx8(
              "div",
              {
                className: `h-10 w-full rounded-md`,
                style: { backgroundColor: `var(--muted-foreground)` }
              }
            ),
            /* @__PURE__ */ jsx8("div", { className: "text-xs", children: /* @__PURE__ */ jsx8("div", { className: "font-medium", children: "Muted Foreground" }) })
          ] })
        ] })
      ] })
    ] }),
    activeTab === "components" && /* @__PURE__ */ jsxs6("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "Card Variants" }),
        /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs6(ThemedCard, { children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Default Card" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This is a default card with no special styling" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Card content goes here" }) }),
            /* @__PURE__ */ jsx8(ThemedCardFooter, { children: /* @__PURE__ */ jsx8("p", { className: "text-sm text-muted-foreground", children: "Last updated: Today" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { variant: "primary", children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Primary Card" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This card uses the primary color" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Card content goes here" }) }),
            /* @__PURE__ */ jsx8(ThemedCardFooter, { children: /* @__PURE__ */ jsx8("p", { className: "text-sm opacity-80", children: "Last updated: Today" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { variant: "accent", children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Accent Card" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This card uses the accent color" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Card content goes here" }) }),
            /* @__PURE__ */ jsx8(ThemedCardFooter, { children: /* @__PURE__ */ jsx8("p", { className: "text-sm opacity-80", children: "Last updated: Today" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { variant: "outline", withShadow: true, children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Outline Card with Shadow" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This card has an outline and shadow" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Card content goes here" }) }),
            /* @__PURE__ */ jsx8(ThemedCardFooter, { children: /* @__PURE__ */ jsx8("p", { className: "text-sm text-muted-foreground", children: "Last updated: Today" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "Card Sizes" }),
        /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs6(ThemedCard, { size: "sm", children: [
            /* @__PURE__ */ jsx8(ThemedCardHeader, { children: /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Small Card" }) }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Compact content" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { size: "md", children: [
            /* @__PURE__ */ jsx8(ThemedCardHeader, { children: /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Medium Card" }) }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Standard content" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { size: "lg", children: [
            /* @__PURE__ */ jsx8(ThemedCardHeader, { children: /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Large Card" }) }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Spacious content" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-lg font-medium", children: "Interactive Cards" }),
        /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs6(ThemedCard, { withHover: true, children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Hover Effect" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This card has a hover effect" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Hover over me" }) })
          ] }),
          /* @__PURE__ */ jsxs6(ThemedCard, { withHover: true, withShadow: true, children: [
            /* @__PURE__ */ jsxs6(ThemedCardHeader, { children: [
              /* @__PURE__ */ jsx8(ThemedCardTitle, { children: "Hover + Shadow" }),
              /* @__PURE__ */ jsx8(ThemedCardDescription, { children: "This card has hover and shadow effects" })
            ] }),
            /* @__PURE__ */ jsx8(ThemedCardContent, { children: /* @__PURE__ */ jsx8("p", { children: "Hover over me" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/components/core/MetricCardDemo.tsx
import { useState as useState3 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
function MetricCardDemo({ className }) {
  const [loading, setLoading] = useState3(false);
  const toggleLoading = () => {
    setLoading((prev) => !prev);
  };
  const lineData1 = [10, 15, 8, 12, 18, 15, 20, 25, 22, 30];
  const lineData2 = [20, 15, 25, 18, 15, 20, 18, 15, 20, 18];
  const lineData3 = [5, 10, 8, 15, 12, 15, 18, 20, 18, 25];
  return /* @__PURE__ */ jsxs7("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx9("h2", { className: "text-2xl font-bold", children: "Metric Cards" }),
      /* @__PURE__ */ jsx9(
        "button",
        {
          onClick: toggleLoading,
          className: "px-3 py-1 rounded-md bg-primary text-primary-foreground",
          children: loading ? "Show Data" : "Show Loading"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Basic Metric Cards" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Total Users",
              value: "1,234",
              trend: "up",
              trendValue: "+12%",
              trendLabel: "vs last month",
              loading,
              icon: /* @__PURE__ */ jsxs7(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx9("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                    /* @__PURE__ */ jsx9("circle", { cx: "9", cy: "7", r: "4" }),
                    /* @__PURE__ */ jsx9("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
                    /* @__PURE__ */ jsx9("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Revenue",
              value: "$45,678",
              trend: "up",
              trendValue: "+8.3%",
              trendLabel: "vs last month",
              loading,
              icon: /* @__PURE__ */ jsx9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: /* @__PURE__ */ jsx9("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Conversion Rate",
              value: "3.2%",
              trend: "down",
              trendValue: "-0.5%",
              trendLabel: "vs last month",
              loading,
              icon: /* @__PURE__ */ jsxs7(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx9("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                    /* @__PURE__ */ jsx9("circle", { cx: "9", cy: "7", r: "4" }),
                    /* @__PURE__ */ jsx9("polyline", { points: "16 11 18 13 22 9" })
                  ]
                }
              )
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Metric Cards with Charts" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Website Traffic",
              value: "12,345",
              trend: "up",
              trendValue: "+15%",
              loading,
              chart: /* @__PURE__ */ jsx9(SimpleLineChart, { data: lineData1, color: "var(--primary)" })
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Bounce Rate",
              value: "42%",
              trend: "down",
              trendValue: "-3%",
              loading,
              chart: /* @__PURE__ */ jsx9(SimpleLineChart, { data: lineData2, color: "var(--accent)" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Metric Cards with Progress" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Storage Used",
              value: "45 GB",
              trend: "neutral",
              trendLabel: "of 100 GB",
              loading,
              chart: /* @__PURE__ */ jsx9(ProgressIndicator, { value: 45, max: 100, showValue: true, size: "md" })
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Task Completion",
              value: "75%",
              trend: "up",
              trendValue: "+5%",
              loading,
              chart: /* @__PURE__ */ jsx9(ProgressIndicator, { value: 75, max: 100, color: "var(--accent)", size: "md" })
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "CPU Usage",
              value: "28%",
              trend: "down",
              trendValue: "-12%",
              loading,
              footer: /* @__PURE__ */ jsx9("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx9(CircularProgress, { value: 28, showValue: true, size: 60 }) })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Metric Card Variants" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Default",
              value: "1,234",
              variant: "default",
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Primary",
              value: "1,234",
              variant: "primary",
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Accent",
              value: "1,234",
              variant: "accent",
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Outline",
              value: "1,234",
              variant: "outline",
              loading
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Metric Card Sizes" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Small",
              value: "1,234",
              size: "sm",
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Medium",
              value: "1,234",
              size: "md",
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "Large",
              value: "1,234",
              size: "lg",
              loading
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx9("h3", { className: "text-lg font-medium", children: "Interactive Metric Cards" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "With Hover Effect",
              value: "1,234",
              trend: "up",
              trendValue: "+12%",
              withHover: true,
              loading
            }
          ),
          /* @__PURE__ */ jsx9(
            MetricCard,
            {
              title: "With Shadow",
              value: "1,234",
              trend: "up",
              trendValue: "+12%",
              withShadow: true,
              loading
            }
          )
        ] })
      ] })
    ] })
  ] });
}

// src/components/core/ContactCardDemo.tsx
import { useState as useState4 } from "react";
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function ContactCardDemo({ className }) {
  const [layout, setLayout] = useState4("vertical");
  const contacts = [
    {
      name: "Jane Smith",
      title: "Marketing Director",
      company: "Acme Corporation",
      avatar: {
        src: "https://randomuser.me/api/portraits/women/32.jpg",
        status: "online"
      },
      contactInfo: {
        email: "jane.smith@acme.com",
        phone: "(555) 123-4567",
        mobile: "(555) 987-6543",
        address: "123 Business Ave, Suite 400, San Francisco, CA 94107",
        website: "www.acmecorp.com"
      },
      tags: ["Marketing", "VIP", "Enterprise"]
    },
    {
      name: "John Doe",
      title: "Software Engineer",
      company: "Tech Innovations",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/44.jpg",
        status: "busy"
      },
      contactInfo: {
        email: "john.doe@techinnovations.com",
        phone: "(555) 234-5678",
        mobile: "(555) 876-5432"
      },
      tags: ["Engineering", "Developer"]
    },
    {
      name: "Sarah Johnson",
      title: "Financial Advisor",
      company: "Wealth Management Inc.",
      avatar: {
        initials: "SJ",
        status: "away"
      },
      contactInfo: {
        email: "sarah.j@wealthmanagement.com",
        phone: "(555) 345-6789"
      },
      tags: ["Finance", "Advisor"]
    },
    {
      name: "Michael Chen",
      title: "Product Manager",
      company: "Innovative Solutions",
      avatar: {
        src: "https://randomuser.me/api/portraits/men/67.jpg",
        status: "offline"
      },
      contactInfo: {
        email: "michael.chen@innovative.com",
        phone: "(555) 456-7890"
      },
      tags: ["Product", "Management"]
    }
  ];
  return /* @__PURE__ */ jsxs8("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx10("h2", { className: "text-2xl font-bold", children: "Contact Cards" }),
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx10(
          "button",
          {
            onClick: () => setLayout("vertical"),
            className: cn(
              "px-3 py-1 rounded-md",
              layout === "vertical" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Vertical"
          }
        ),
        /* @__PURE__ */ jsx10(
          "button",
          {
            onClick: () => setLayout("horizontal"),
            className: cn(
              "px-3 py-1 rounded-md",
              layout === "horizontal" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Horizontal"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium", children: "Basic Contact Cards" }),
        /* @__PURE__ */ jsx10("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: contacts.map((contact, index) => /* @__PURE__ */ jsx10(
          ContactCard,
          {
            name: contact.name,
            title: contact.title,
            company: contact.company,
            avatar: contact.avatar,
            contactInfo: contact.contactInfo,
            tags: contact.tags,
            layout,
            actions: /* @__PURE__ */ jsxs8(Fragment3, { children: [
              /* @__PURE__ */ jsx10(ContactCallButton, { onClick: () => alert(`Calling ${contact.name}`) }),
              /* @__PURE__ */ jsx10(ContactEmailButton, { onClick: () => alert(`Emailing ${contact.name}`) }),
              /* @__PURE__ */ jsx10(ContactMessageButton, { onClick: () => alert(`Messaging ${contact.name}`) })
            ] })
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium", children: "Contact Card Variants" }),
        /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Default Variant",
              title: "Software Engineer",
              avatar: { initials: "DV", status: "online" },
              contactInfo: { email: "default@example.com" },
              variant: "default",
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Primary Variant",
              title: "Product Manager",
              avatar: { initials: "PV", status: "online" },
              contactInfo: { email: "primary@example.com" },
              variant: "primary",
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Accent Variant",
              title: "Designer",
              avatar: { initials: "AV", status: "online" },
              contactInfo: { email: "accent@example.com" },
              variant: "accent",
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Outline Variant",
              title: "Marketing",
              avatar: { initials: "OV", status: "online" },
              contactInfo: { email: "outline@example.com" },
              variant: "outline",
              layout
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium", children: "Contact Card Sizes" }),
        /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Small Size",
              title: "Developer",
              avatar: { initials: "SS" },
              contactInfo: { email: "small@example.com" },
              size: "sm",
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Medium Size",
              title: "Designer",
              avatar: { initials: "MS" },
              contactInfo: { email: "medium@example.com" },
              size: "md",
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Large Size",
              title: "Manager",
              avatar: { initials: "LS" },
              contactInfo: { email: "large@example.com" },
              size: "lg",
              layout
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium", children: "Interactive Contact Cards" }),
        /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "Hover Effect",
              title: "Software Engineer",
              avatar: { initials: "HE", status: "online" },
              contactInfo: { email: "hover@example.com" },
              withHover: true,
              layout
            }
          ),
          /* @__PURE__ */ jsx10(
            ContactCard,
            {
              name: "With Shadow",
              title: "Product Manager",
              avatar: { initials: "WS", status: "online" },
              contactInfo: { email: "shadow@example.com" },
              withShadow: true,
              layout
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium", children: "Contact Card Components" }),
        /* @__PURE__ */ jsxs8("div", { className: "p-4 border border-border rounded-lg space-y-4", children: [
          /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx10("h4", { className: "font-medium", children: "Contact Avatars" }),
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsx10(ContactAvatar, { src: "https://randomuser.me/api/portraits/women/32.jpg", alt: "Jane Smith", size: "sm" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { src: "https://randomuser.me/api/portraits/men/44.jpg", alt: "John Doe", size: "md" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { initials: "SJ", size: "lg" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { initials: "MC", size: "xl" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { src: "https://randomuser.me/api/portraits/women/32.jpg", alt: "Jane Smith", status: "online", size: "md" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { src: "https://randomuser.me/api/portraits/men/44.jpg", alt: "John Doe", status: "busy", size: "md" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { initials: "SJ", status: "away", size: "md" }),
              /* @__PURE__ */ jsx10(ContactAvatar, { initials: "MC", status: "offline", size: "md" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx10("h4", { className: "font-medium", children: "Contact Info Items" }),
            /* @__PURE__ */ jsxs8("div", { className: "space-y-2 max-w-md", children: [
              /* @__PURE__ */ jsx10(
                ContactInfoItem,
                {
                  icon: /* @__PURE__ */ jsxs8(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        /* @__PURE__ */ jsx10("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
                        /* @__PURE__ */ jsx10("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
                      ]
                    }
                  ),
                  label: "Email",
                  value: "example@email.com",
                  href: "mailto:example@email.com",
                  copyable: true
                }
              ),
              /* @__PURE__ */ jsx10(
                ContactInfoItem,
                {
                  icon: /* @__PURE__ */ jsx10(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx10("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
                    }
                  ),
                  label: "Phone",
                  value: "(555) 123-4567",
                  href: "tel:(555) 123-4567"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx10("h4", { className: "font-medium", children: "Contact Action Buttons" }),
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx10(ContactCallButton, {}),
              /* @__PURE__ */ jsx10(ContactEmailButton, {}),
              /* @__PURE__ */ jsx10(ContactMessageButton, {}),
              /* @__PURE__ */ jsx10(
                ContactActionButton,
                {
                  icon: /* @__PURE__ */ jsxs8(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        /* @__PURE__ */ jsx10("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }),
                        /* @__PURE__ */ jsx10("circle", { cx: "12", cy: "10", r: "3" })
                      ]
                    }
                  ),
                  label: "Map",
                  variant: "primary"
                }
              ),
              /* @__PURE__ */ jsx10(
                ContactActionButton,
                {
                  icon: /* @__PURE__ */ jsx10(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx10("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                    }
                  ),
                  label: "Chat",
                  variant: "secondary"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/components/core/TimelineDemo.tsx
import { useState as useState5 } from "react";
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
function TimelineDemo({ className }) {
  const [orientation, setOrientation] = useState5("vertical");
  return /* @__PURE__ */ jsxs9("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx11("h2", { className: "text-2xl font-bold", children: "Timeline Components" }),
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx11(
          "button",
          {
            onClick: () => setOrientation("vertical"),
            className: cn(
              "px-3 py-1 rounded-md",
              orientation === "vertical" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Vertical"
          }
        ),
        /* @__PURE__ */ jsx11(
          "button",
          {
            onClick: () => setOrientation("horizontal"),
            className: cn(
              "px-3 py-1 rounded-md",
              orientation === "horizontal" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: "Horizontal"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs9("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx11("h3", { className: "text-lg font-medium", children: "Basic Timeline" }),
        /* @__PURE__ */ jsx11("div", { className: "p-4 border border-border rounded-lg", children: /* @__PURE__ */ jsxs9(Timeline, { orientation, children: [
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Project Created",
              subtitle: "Initial project setup and configuration",
              date: "June 1, 2025",
              children: /* @__PURE__ */ jsx11("p", { className: "text-sm", children: "Created the project repository and set up the initial development environment." })
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Design Phase",
              subtitle: "UI/UX design and prototyping",
              date: "June 5, 2025",
              children: /* @__PURE__ */ jsx11("p", { className: "text-sm", children: "Completed the design mockups and user flow diagrams." })
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Development Started",
              subtitle: "Frontend and backend implementation",
              date: "June 10, 2025",
              children: /* @__PURE__ */ jsx11("p", { className: "text-sm", children: "Started implementing the core features and functionality." })
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Testing Phase",
              subtitle: "QA and user testing",
              date: "June 20, 2025",
              children: /* @__PURE__ */ jsx11("p", { className: "text-sm", children: "Conducting comprehensive testing to ensure quality and reliability." })
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { orientation, connector: false, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Deployment",
              subtitle: "Production release",
              date: "June 30, 2025",
              children: /* @__PURE__ */ jsx11("p", { className: "text-sm", children: "Deploying the application to production environment." })
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx11("h3", { className: "text-lg font-medium", children: "Timeline with Custom Icons" }),
        /* @__PURE__ */ jsx11("div", { className: "p-4 border border-border rounded-lg", children: /* @__PURE__ */ jsxs9(Timeline, { orientation, children: [
          /* @__PURE__ */ jsx11(
            TimelineItem,
            {
              orientation,
              active: true,
              icon: /* @__PURE__ */ jsxs9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx11("path", { d: "M12 5v14" }),
                    /* @__PURE__ */ jsx11("path", { d: "M5 12h14" })
                  ]
                }
              ),
              children: /* @__PURE__ */ jsx11(
                TimelineContent,
                {
                  title: "Project Created",
                  date: "June 1, 2025"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx11(
            TimelineItem,
            {
              orientation,
              active: true,
              icon: /* @__PURE__ */ jsxs9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx11("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
                    /* @__PURE__ */ jsx11("polyline", { points: "14 2 14 8 20 8" })
                  ]
                }
              ),
              children: /* @__PURE__ */ jsx11(
                TimelineContent,
                {
                  title: "Documentation",
                  date: "June 5, 2025"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx11(
            TimelineItem,
            {
              orientation,
              active: true,
              icon: /* @__PURE__ */ jsxs9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx11("path", { d: "m18 16 4-4-4-4" }),
                    /* @__PURE__ */ jsx11("path", { d: "m6 8-4 4 4 4" }),
                    /* @__PURE__ */ jsx11("path", { d: "m14.5 4-5 16" })
                  ]
                }
              ),
              children: /* @__PURE__ */ jsx11(
                TimelineContent,
                {
                  title: "Development",
                  date: "June 10, 2025"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx11(
            TimelineItem,
            {
              orientation,
              icon: /* @__PURE__ */ jsxs9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx11("path", { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" }),
                    /* @__PURE__ */ jsx11("path", { d: "m9 12 2 2 4-4" })
                  ]
                }
              ),
              children: /* @__PURE__ */ jsx11(
                TimelineContent,
                {
                  title: "Testing",
                  date: "June 20, 2025"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx11(
            TimelineItem,
            {
              orientation,
              connector: false,
              icon: /* @__PURE__ */ jsxs9(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx11("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
                    /* @__PURE__ */ jsx11("polyline", { points: "22 4 12 14.01 9 11.01" })
                  ]
                }
              ),
              children: /* @__PURE__ */ jsx11(
                TimelineContent,
                {
                  title: "Deployment",
                  date: "June 30, 2025"
                }
              )
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx11("h3", { className: "text-lg font-medium", children: "Timeline with Separators" }),
        /* @__PURE__ */ jsx11("div", { className: "p-4 border border-border rounded-lg", children: /* @__PURE__ */ jsxs9(Timeline, { orientation, children: [
          /* @__PURE__ */ jsx11(TimelineSeparator, { label: "Planning Phase" }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Requirements Gathering",
              date: "May 15, 2025"
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Project Scoping",
              date: "May 20, 2025"
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineSeparator, { label: "Design Phase" }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "UI/UX Design",
              date: "June 1, 2025"
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Prototype Review",
              date: "June 10, 2025"
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineSeparator, { label: "Implementation Phase" }),
          /* @__PURE__ */ jsx11(TimelineItem, { orientation, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Development",
              date: "June 15, 2025"
            }
          ) }),
          /* @__PURE__ */ jsx11(TimelineItem, { orientation, connector: false, children: /* @__PURE__ */ jsx11(
            TimelineContent,
            {
              title: "Testing & Deployment",
              date: "June 30, 2025"
            }
          ) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx11("h3", { className: "text-lg font-medium", children: "Timeline Variants" }),
        /* @__PURE__ */ jsxs9("div", { className: "p-4 border border-border rounded-lg", children: [
          /* @__PURE__ */ jsx11("h4", { className: "font-medium mb-3", children: "Compact Timeline" }),
          /* @__PURE__ */ jsxs9(Timeline, { orientation, compact: true, children: [
            /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Step 1", date: "9:00 AM" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Step 2", date: "10:30 AM" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Step 3", date: "12:00 PM" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { orientation, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Step 4", date: "2:30 PM" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { orientation, connector: false, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Step 5", date: "4:00 PM" }) })
          ] }),
          /* @__PURE__ */ jsx11("h4", { className: "font-medium mt-6 mb-3", children: "Dashed Connector" }),
          /* @__PURE__ */ jsxs9(Timeline, { orientation, children: [
            /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, connectorStyle: "dashed", children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Task 1", date: "Monday" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { active: true, orientation, connectorStyle: "dashed", children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Task 2", date: "Tuesday" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { orientation, connectorStyle: "dashed", children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Task 3", date: "Wednesday" }) }),
            /* @__PURE__ */ jsx11(TimelineItem, { orientation, connectorStyle: "dashed", connector: false, children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Task 4", date: "Thursday" }) })
          ] }),
          /* @__PURE__ */ jsx11("h4", { className: "font-medium mt-6 mb-3", children: "Colored Timeline" }),
          /* @__PURE__ */ jsxs9(Timeline, { orientation, children: [
            /* @__PURE__ */ jsx11(
              TimelineItem,
              {
                active: true,
                orientation,
                iconBackground: "#4CAF50",
                connectorColor: "#4CAF50",
                children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Success", date: "Completed" })
              }
            ),
            /* @__PURE__ */ jsx11(
              TimelineItem,
              {
                active: true,
                orientation,
                iconBackground: "#2196F3",
                connectorColor: "#2196F3",
                children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Info", date: "In Progress" })
              }
            ),
            /* @__PURE__ */ jsx11(
              TimelineItem,
              {
                orientation,
                iconBackground: "#FFC107",
                connectorColor: "#FFC107",
                children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Warning", date: "Pending" })
              }
            ),
            /* @__PURE__ */ jsx11(
              TimelineItem,
              {
                orientation,
                iconBackground: "#F44336",
                connectorColor: "#F44336",
                connector: false,
                children: /* @__PURE__ */ jsx11(TimelineContent, { title: "Error", date: "Failed" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx11("h3", { className: "text-lg font-medium", children: "Timeline Components" }),
        /* @__PURE__ */ jsxs9("div", { className: "p-4 border border-border rounded-lg space-y-4", children: [
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx11("h4", { className: "font-medium mb-2", children: "Timeline Dots" }),
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx11(TimelineDot, { size: "sm" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "lg" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", active: true }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", variant: "outlined" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", variant: "outlined", active: true }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", color: "#4CAF50" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", color: "#F44336" }),
              /* @__PURE__ */ jsx11(TimelineDot, { size: "md", variant: "outlined", color: "#2196F3" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx11("h4", { className: "font-medium mb-2", children: "Timeline Separators" }),
            /* @__PURE__ */ jsx11(TimelineSeparator, { label: "Phase 1" }),
            /* @__PURE__ */ jsx11(TimelineSeparator, {})
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/components/core/TaskCardDemo.tsx
import { useState as useState6 } from "react";
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function TaskCardDemo({ className }) {
  const [layout, setLayout] = useState6("grid");
  const [columns, setColumns] = useState6(2);
  const tasks = [
    {
      title: "Implement Authentication",
      description: "Set up user authentication with JWT and secure routes",
      priority: "high",
      status: "in-progress",
      progress: 60,
      dueDate: "2025-06-15",
      assignee: {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg"
      },
      tags: ["Backend", "Security"]
    },
    {
      title: "Design Dashboard UI",
      description: "Create wireframes and mockups for the main dashboard",
      priority: "medium",
      status: "todo",
      progress: 20,
      dueDate: "2025-06-20",
      assignee: {
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
      tags: ["UI/UX", "Design"]
    },
    {
      title: "API Integration",
      description: "Connect frontend with backend API endpoints",
      priority: "high",
      status: "review",
      progress: 90,
      dueDate: "2025-06-10",
      assignee: {
        name: "Michael Chen"
      },
      tags: ["Frontend", "API"]
    },
    {
      title: "Database Optimization",
      description: "Improve query performance and add indexes",
      priority: "low",
      status: "done",
      progress: 100,
      dueDate: "2025-06-05",
      assignee: {
        name: "Sarah Johnson"
      },
      tags: ["Database", "Performance"]
    },
    {
      title: "Fix Responsive Layout",
      description: "Address mobile layout issues on small screens",
      priority: "urgent",
      status: "blocked",
      progress: 30,
      dueDate: "2025-06-08",
      assignee: {
        name: "Alex Wong"
      },
      tags: ["Frontend", "Responsive"]
    },
    {
      title: "Write Documentation",
      description: "Create user and developer documentation",
      priority: "medium",
      status: "todo",
      progress: 10,
      dueDate: "2025-06-25",
      assignee: {
        name: "Emily Davis"
      },
      tags: ["Documentation"]
    }
  ];
  return /* @__PURE__ */ jsxs10("div", { className: cn("space-y-6", className), children: [
    /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx12("h2", { className: "text-2xl font-bold", children: "Task Cards" }),
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center space-x-1 mr-4", children: [
          /* @__PURE__ */ jsx12(
            "button",
            {
              onClick: () => setLayout("grid"),
              className: cn(
                "p-1 rounded-md",
                layout === "grid" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              ),
              children: /* @__PURE__ */ jsxs10(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx12("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }),
                    /* @__PURE__ */ jsx12("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }),
                    /* @__PURE__ */ jsx12("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }),
                    /* @__PURE__ */ jsx12("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx12(
            "button",
            {
              onClick: () => setLayout("list"),
              className: cn(
                "p-1 rounded-md",
                layout === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              ),
              children: /* @__PURE__ */ jsxs10(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx12("line", { x1: "8", x2: "21", y1: "6", y2: "6" }),
                    /* @__PURE__ */ jsx12("line", { x1: "8", x2: "21", y1: "12", y2: "12" }),
                    /* @__PURE__ */ jsx12("line", { x1: "8", x2: "21", y1: "18", y2: "18" }),
                    /* @__PURE__ */ jsx12("line", { x1: "3", x2: "3.01", y1: "6", y2: "6" }),
                    /* @__PURE__ */ jsx12("line", { x1: "3", x2: "3.01", y1: "12", y2: "12" }),
                    /* @__PURE__ */ jsx12("line", { x1: "3", x2: "3.01", y1: "18", y2: "18" })
                  ]
                }
              )
            }
          )
        ] }),
        layout === "grid" && /* @__PURE__ */ jsx12("div", { className: "flex items-center space-x-1", children: [1, 2, 3, 4].map((col) => /* @__PURE__ */ jsx12(
          "button",
          {
            onClick: () => setColumns(col),
            className: cn(
              "px-2 py-1 rounded-md text-sm",
              columns === col ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: col
          },
          col
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx12("h3", { className: "text-lg font-medium", children: "Task List" }),
        /* @__PURE__ */ jsx12(
          TaskList,
          {
            tasks,
            layout,
            columns,
            gap: "md"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx12("h3", { className: "text-lg font-medium", children: "Task Card Variants" }),
        /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Default Variant",
              description: "Default styling",
              priority: "medium",
              status: "todo",
              progress: 50,
              variant: "default"
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Primary Variant",
              description: "Primary styling",
              priority: "medium",
              status: "in-progress",
              progress: 50,
              variant: "primary"
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Accent Variant",
              description: "Accent styling",
              priority: "medium",
              status: "review",
              progress: 50,
              variant: "accent"
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Outline Variant",
              description: "Outline styling",
              priority: "medium",
              status: "done",
              progress: 50,
              variant: "outline"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx12("h3", { className: "text-lg font-medium", children: "Task Card Sizes" }),
        /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Small Size",
              description: "Compact layout",
              priority: "medium",
              status: "todo",
              size: "sm"
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Medium Size",
              description: "Standard layout",
              priority: "medium",
              status: "in-progress",
              size: "md"
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "Large Size",
              description: "Spacious layout with more details and information",
              priority: "medium",
              status: "done",
              size: "lg"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx12("h3", { className: "text-lg font-medium", children: "Interactive Task Cards" }),
        /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "With Hover Effect",
              description: "Hover over me to see the effect",
              priority: "medium",
              status: "todo",
              withHover: true
            }
          ),
          /* @__PURE__ */ jsx12(
            TaskCard,
            {
              title: "With Shadow",
              description: "Card with shadow effect",
              priority: "medium",
              status: "todo",
              withShadow: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx12("h3", { className: "text-lg font-medium", children: "Task Card Components" }),
        /* @__PURE__ */ jsxs10("div", { className: "p-4 border border-border rounded-lg space-y-4", children: [
          /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx12("h4", { className: "font-medium", children: "Priority Badges" }),
            /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx12(PriorityBadge, { priority: "low" }),
              /* @__PURE__ */ jsx12(PriorityBadge, { priority: "medium" }),
              /* @__PURE__ */ jsx12(PriorityBadge, { priority: "high" }),
              /* @__PURE__ */ jsx12(PriorityBadge, { priority: "urgent" }),
              /* @__PURE__ */ jsx12(PriorityBadge, { priority: "custom", customColor: "#9c27b0" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx12("h4", { className: "font-medium", children: "Status Badges" }),
            /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx12(StatusBadge, { status: "todo" }),
              /* @__PURE__ */ jsx12(StatusBadge, { status: "in-progress" }),
              /* @__PURE__ */ jsx12(StatusBadge, { status: "review" }),
              /* @__PURE__ */ jsx12(StatusBadge, { status: "done" }),
              /* @__PURE__ */ jsx12(StatusBadge, { status: "blocked" }),
              /* @__PURE__ */ jsx12(StatusBadge, { status: "custom", customColor: "#ff9800" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx12("h4", { className: "font-medium", children: "Task Progress" }),
            /* @__PURE__ */ jsxs10("div", { className: "space-y-2 max-w-md", children: [
              /* @__PURE__ */ jsx12(TaskProgress, { value: 25, showLabel: true }),
              /* @__PURE__ */ jsx12(TaskProgress, { value: 50, showLabel: true }),
              /* @__PURE__ */ jsx12(TaskProgress, { value: 75, showLabel: true }),
              /* @__PURE__ */ jsx12(TaskProgress, { value: 100, showLabel: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx12("h4", { className: "font-medium", children: "Due Dates" }),
            /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsx12(DueDate, { date: "2025-06-30" }),
              /* @__PURE__ */ jsx12(DueDate, { date: "2025-05-15", isPastDue: true }),
              /* @__PURE__ */ jsx12(DueDate, { date: "2025-06-30", showIcon: false })
            ] })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx12("h4", { className: "font-medium", children: "Assignees" }),
            /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsx12(Assignee, { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/44.jpg" }),
              /* @__PURE__ */ jsx12(Assignee, { name: "Jane Smith" }),
              /* @__PURE__ */ jsx12(Assignee, { name: "Michael Chen", size: "sm" }),
              /* @__PURE__ */ jsx12(Assignee, { name: "Sarah Johnson", size: "lg" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Assignee,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CircularProgress,
  ContactActionButton,
  ContactAvatar,
  ContactCallButton,
  ContactCard,
  ContactCardDemo,
  ContactEmailButton,
  ContactInfoItem,
  ContactMessageButton,
  DueDate,
  MetricCard,
  MetricCardDemo,
  PriorityBadge,
  ProgressIndicator,
  SimpleLineChart,
  StatusBadge,
  StatusIndicator,
  TaskCard,
  TaskCardDemo,
  TaskList,
  TaskProgress,
  ThemeDemo,
  ThemeProvider,
  ThemeToggle,
  ThemedCard,
  ThemedCardContent,
  ThemedCardDescription,
  ThemedCardFooter,
  ThemedCardHeader,
  ThemedCardTitle,
  Timeline,
  TimelineContent,
  TimelineDemo,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  buttonVariants,
  cn,
  getThemeColor,
  initializeTheme,
  isDarkMode,
  themeConfig,
  toggleDarkMode,
  useTheme
};
