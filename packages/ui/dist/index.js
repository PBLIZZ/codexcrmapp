"use client";

// src/index.ts
import { cva as cva4 } from "class-variance-authority";

// src/components/ui/avatar.tsx
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/avatar.tsx
import { jsx } from "react/jsx-runtime";
function Avatar({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className),
      ...props
    }
  );
}
function AvatarImage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn("bg-muted flex size-full items-center justify-center rounded-full", className),
      ...props
    }
  );
}

// src/components/ui/loading-spinner.tsx
import * as React from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var LoadingSpinner = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      role: "status",
      className: cn("flex items-center justify-center", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx2("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" }),
        /* @__PURE__ */ jsx2("span", { className: "sr-only", children: "Loading..." })
      ]
    }
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

// src/lib/theme.ts
var themeConfig = {
  colors: {
    // Raw Color Ramps
    slate: {
      50: "var(--slate-50)",
      100: "var(--slate-100)",
      200: "var(--slate-200)",
      600: "var(--slate-600)",
      900: "var(--slate-900)"
    },
    teal: {
      50: "var(--teal-50)",
      100: "var(--teal-100)",
      200: "var(--teal-200)",
      300: "var(--teal-300)",
      400: "var(--teal-400)",
      500: "var(--teal-500)",
      600: "var(--teal-600)",
      700: "var(--teal-700)",
      800: "var(--teal-800)",
      900: "var(--teal-900)",
      950: "var(--teal-950)"
    },
    violet: {
      50: "var(--violet-50)",
      100: "var(--violet-100)"
    },
    amber: {
      50: "var(--amber-50)",
      100: "var(--amber-100)"
    },
    sky: {
      50: "var(--sky-50)",
      100: "var(--sky-100)"
    },
    // Semantic Colors
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: {
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)"
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      foreground: "var(--secondary-foreground)"
    },
    destructive: {
      DEFAULT: "var(--destructive)",
      foreground: "var(--destructive-foreground)"
    },
    muted: {
      DEFAULT: "var(--muted)",
      foreground: "var(--muted-foreground)"
    },
    accent: {
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)"
    },
    popover: {
      DEFAULT: "var(--popover)",
      foreground: "var(--popover-foreground)"
    },
    card: {
      DEFAULT: "var(--card)",
      foreground: "var(--card-foreground)"
    }
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)"
  }
};
function getThemeColor(path) {
  const parts = path.split(".");
  let current = themeConfig.colors;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      console.warn(`[getThemeColor] Path not found: ${path}`);
      return "";
    }
    current = current[part];
  }
  if (typeof current === "string") {
    return current;
  }
  if (typeof current === "object" && current !== null && "DEFAULT" in current && typeof current.DEFAULT === "string") {
    return current.DEFAULT;
  }
  console.warn(`[getThemeColor] Path did not resolve to a string value: ${path}`);
  return "";
}

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx3(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/badge.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var badgeVariants = cva2(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot2 : "span";
  return /* @__PURE__ */ jsx4(Comp, { "data-slot": "badge", className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/ui/input.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx5(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/separator.tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx6 } from "react/jsx-runtime";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx6(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/tooltip.tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx7(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx7(TooltipProvider, { children: /* @__PURE__ */ jsx7(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx7(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx7(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs2(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[var(--radix-tooltip-content-transform-origin)] rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx7(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}

// src/components/ui/alert.tsx
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
var alertVariants = cva3(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "alert-title",
      className: cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className),
      ...props
    }
  );
}
function AlertDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/table.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx9("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: /* @__PURE__ */ jsx9(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx9("thead", { "data-slot": "table-header", className: cn("[&_tr]:border-b", className), ...props });
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCaption({ className, ...props }) {
  return /* @__PURE__ */ jsx9(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("text-muted-foreground mt-4 text-sm", className),
      ...props
    }
  );
}

// src/components/ui/dropdown-menu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Portal, { "data-slot": "dropdown-menu-portal", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx10(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuGroup({ ...props }) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(
    DropdownMenuPrimitive.CheckboxItem,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked,
      ...props,
      children: [
        /* @__PURE__ */ jsx10("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx10(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx10(CheckIcon, { className: "size-4" }) }) }),
        children
      ]
    }
  );
}
function DropdownMenuRadioGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.RadioGroup, { "data-slot": "dropdown-menu-radio-group", ...props });
}
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(
    DropdownMenuPrimitive.RadioItem,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx10("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx10(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx10(CircleIcon, { className: "size-2 fill-current" }) }) }),
        children
      ]
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function DropdownMenuShortcut({ className, ...props }) {
  return /* @__PURE__ */ jsx10(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: cn("text-muted-foreground ml-auto text-xs tracking-widest", className),
      ...props
    }
  );
}
function DropdownMenuSub({ ...props }) {
  return /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Sub, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(
    DropdownMenuPrimitive.SubTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx10(ChevronRightIcon, { className: "ml-auto size-4" })
      ]
    }
  );
}
function DropdownMenuSubContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx10(
    DropdownMenuPrimitive.SubContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon as CheckIcon2, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
function Select({ ...props }) {
  return /* @__PURE__ */ jsx11(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectGroup({ ...props }) {
  return /* @__PURE__ */ jsx11(SelectPrimitive.Group, { "data-slot": "select-group", ...props });
}
function SelectValue({ ...props }) {
  return /* @__PURE__ */ jsx11(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs4(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx11(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx11(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx11(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs4(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx11(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx11(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx11(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectLabel({ className, ...props }) {
  return /* @__PURE__ */ jsx11(
    SelectPrimitive.Label,
    {
      "data-slot": "select-label",
      className: cn("text-muted-foreground px-2 py-1.5 text-xs", className),
      ...props
    }
  );
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs4(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx11("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx11(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx11(CheckIcon2, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx11(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    SelectPrimitive.Separator,
    {
      "data-slot": "select-separator",
      className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: /* @__PURE__ */ jsx11(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: /* @__PURE__ */ jsx11(ChevronDownIcon, { className: "size-4" })
    }
  );
}

// src/components/ui/checkbox.tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon as CheckIcon3 } from "lucide-react";
import { jsx as jsx12 } from "react/jsx-runtime";
function Checkbox({ className, ...props }) {
  return /* @__PURE__ */ jsx12(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx12(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsx12(CheckIcon3, { className: "size-3.5" })
        }
      )
    }
  );
}

// src/components/ui/card.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card-action",
      className: cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx13("div", { "data-slot": "card-content", className: cn("px-6", className), ...props });
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}

// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
function Dialog({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs5(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx14(DialogOverlay, {}),
    /* @__PURE__ */ jsxs5(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs5(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx14(XIcon, {}),
                /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
      ...props
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// src/components/ui/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx15 } from "react/jsx-runtime";
function Tabs({ className, ...props }) {
  return /* @__PURE__ */ jsx15(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({ className, ...props }) {
  return /* @__PURE__ */ jsx15(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx15(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ jsx15(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}

// src/components/ui/textarea.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx16(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/label.tsx
import * as LabelPrimitive from "@radix-ui/react-label";
import { jsx as jsx17 } from "react/jsx-runtime";
function Label3({ className, ...props }) {
  return /* @__PURE__ */ jsx17(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/carousel.tsx
import * as React2 from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs6 } from "react/jsx-runtime";
var CarouselContext = React2.createContext(null);
function useCarousel() {
  const context = React2.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y"
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React2.useState(false);
  const [canScrollNext, setCanScrollNext] = React2.useState(false);
  const onSelect = React2.useCallback((api2) => {
    if (!api2) return;
    setCanScrollPrev(api2.canScrollPrev());
    setCanScrollNext(api2.canScrollNext());
  }, []);
  const scrollPrev = React2.useCallback(() => {
    api?.scrollPrev();
  }, [api]);
  const scrollNext = React2.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  const handleKeyDown = React2.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );
  React2.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);
  React2.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);
  return /* @__PURE__ */ jsx18(
    CarouselContext.Provider,
    {
      value: {
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      },
      children: /* @__PURE__ */ jsx18(
        "div",
        {
          onKeyDownCapture: handleKeyDown,
          className: cn("relative", className),
          role: "region",
          "aria-roledescription": "carousel",
          "data-slot": "carousel",
          ...props,
          children
        }
      )
    }
  );
}
function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsx18("div", { ref: carouselRef, className: "overflow-hidden", "data-slot": "carousel-content", children: /* @__PURE__ */ jsx18(
    "div",
    {
      className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
      ...props
    }
  ) });
}
function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsx18(
    "div",
    {
      role: "group",
      "aria-roledescription": "slide",
      "data-slot": "carousel-item",
      className: cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      ),
      ...props
    }
  );
}
function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxs6(
    Button,
    {
      "data-slot": "carousel-previous",
      variant,
      size,
      className: cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollPrev,
      onClick: scrollPrev,
      ...props,
      children: [
        /* @__PURE__ */ jsx18(ArrowLeft, {}),
        /* @__PURE__ */ jsx18("span", { className: "sr-only", children: "Previous slide" })
      ]
    }
  );
}
function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxs6(
    Button,
    {
      "data-slot": "carousel-next",
      variant,
      size,
      className: cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollNext,
      onClick: scrollNext,
      ...props,
      children: [
        /* @__PURE__ */ jsx18(ArrowRight, {}),
        /* @__PURE__ */ jsx18("span", { className: "sr-only", children: "Next slide" })
      ]
    }
  );
}

// src/components/ui/csv-upload.tsx
import { UploadCloud, AlertTriangle, Loader2 } from "lucide-react";
import { useCallback as useCallback2, useState as useState2 } from "react";
import { useDropzone } from "react-dropzone";
import { jsx as jsx19, jsxs as jsxs7 } from "react/jsx-runtime";
var TEN_MB_IN_BYTES = 10 * 1024 * 1024;
function CsvUpload({ onFilesAccepted, maxSize = TEN_MB_IN_BYTES }) {
  const [isHovering, setIsHovering] = useState2(false);
  const [rejectionError, setRejectionError] = useState2(null);
  const [isProcessing, setIsProcessing] = useState2(false);
  const onDrop = useCallback2(
    (acceptedUploadFiles, fileRejections) => {
      setIsHovering(false);
      setRejectionError(null);
      setIsProcessing(false);
      if (fileRejections.length > 0) {
        const firstRejection = fileRejections[0];
        if (firstRejection.errors.some((err) => err.code === "file-too-large")) {
          setRejectionError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
        } else if (firstRejection.errors.some((err) => err.code === "file-invalid-type")) {
          setRejectionError("Invalid file type. Only .csv files are accepted.");
        } else {
          setRejectionError("File rejected. Please try another file.");
        }
        onFilesAccepted([]);
        setIsProcessing(false);
        return;
      }
      if (acceptedUploadFiles.length > 0) {
        console.log("Accepted files in CsvUpload:", acceptedUploadFiles);
        setIsProcessing(true);
        setTimeout(() => {
          onFilesAccepted(acceptedUploadFiles);
          setIsProcessing(false);
        }, 1500);
      } else {
        onFilesAccepted([]);
        setIsProcessing(false);
      }
    },
    [onFilesAccepted, maxSize]
  );
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"]
    },
    multiple: false,
    maxSize,
    onDragEnter: () => {
      setIsHovering(true);
      setRejectionError(null);
    },
    onDragLeave: () => setIsHovering(false),
    onDropAccepted: () => setIsHovering(false)
    // Handled in onDrop
    // onDropRejected is not strictly needed as onDrop receives fileRejections
  });
  const selectedFile = acceptedFiles.length > 0 && !rejectionError && !isProcessing ? acceptedFiles[0] : null;
  const isError = !!rejectionError;
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      ...getRootProps(),
      className: `
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isError ? "border-destructive bg-destructive/10" : isDragActive || isHovering ? "border-primary bg-primary/10" : "border-border hover:border-primary/70"}
      `,
      children: [
        /* @__PURE__ */ jsx19("input", { ...getInputProps() }),
        /* @__PURE__ */ jsxs7("div", { className: "flex flex-col items-center justify-center space-y-2", children: [
          isError ? /* @__PURE__ */ jsx19(AlertTriangle, { className: "w-12 h-12 mb-2 text-destructive" }) : isProcessing ? /* @__PURE__ */ jsx19(Loader2, { className: "w-12 h-12 mb-2 text-primary animate-spin" }) : /* @__PURE__ */ jsx19(
            UploadCloud,
            {
              className: `w-12 h-12 mb-2 ${isDragActive || isHovering ? "text-primary" : "text-muted-foreground"}`
            }
          ),
          isError ? /* @__PURE__ */ jsx19("p", { className: "text-destructive font-semibold", children: rejectionError }) : isProcessing ? /* @__PURE__ */ jsx19("p", { className: "text-lg font-semibold text-primary", children: "Processing file..." }) : isDragActive ? /* @__PURE__ */ jsx19("p", { className: "text-lg font-semibold text-primary", children: "Drop the CSV file here ..." }) : /* @__PURE__ */ jsx19("p", { className: "text-muted-foreground", children: "Drag 'n' drop a CSV file here, or click to select file" }),
          selectedFile && !isDragActive && !isError && !isProcessing && /* @__PURE__ */ jsxs7("div", { className: "mt-3 text-sm text-muted-foreground", children: [
            "Selected file: ",
            selectedFile.name
          ] }),
          !isError && !isProcessing && /* @__PURE__ */ jsxs7("p", { className: "text-xs text-muted-foreground mt-2", children: [
            "Maximum file size: ",
            maxSize / (1024 * 1024),
            "MB. Accepted format: .csv"
          ] })
        ] })
      ]
    }
  );
}

// src/components/ui/breadcrumb.tsx
import { Slot as Slot3 } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs8 } from "react/jsx-runtime";
function Breadcrumb({ ...props }) {
  return /* @__PURE__ */ jsx20("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...props });
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsx20(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsx20(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot3 : "a";
  return /* @__PURE__ */ jsx20(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("hover:text-foreground transition-colors", className),
      ...props
    }
  );
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsx20(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground font-normal", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({ children, className, ...props }) {
  return /* @__PURE__ */ jsx20(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsx20(ChevronRight, {})
    }
  );
}
function BreadcrumbEllipsis({ className, ...props }) {
  return /* @__PURE__ */ jsxs8(
    "span",
    {
      "data-slot": "breadcrumb-ellipsis",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("flex size-9 items-center justify-center", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx20(MoreHorizontal, { className: "size-4" }),
        /* @__PURE__ */ jsx20("span", { className: "sr-only", children: "More" })
      ]
    }
  );
}

// src/components/ui/sheet.tsx
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon as XIcon2 } from "lucide-react";
import { jsx as jsx21, jsxs as jsxs9 } from "react/jsx-runtime";
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx21(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({ ...props }) {
  return /* @__PURE__ */ jsx21(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetClose({ ...props }) {
  return /* @__PURE__ */ jsx21(SheetPrimitive.Close, { "data-slot": "sheet-close", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsx21(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx21(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs9(SheetPortal, { children: [
    /* @__PURE__ */ jsx21(SheetOverlay, {}),
    /* @__PURE__ */ jsxs9(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs9(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx21(XIcon2, { className: "size-4" }),
            /* @__PURE__ */ jsx21("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx21(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx21(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx21(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx21(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// src/components/ui/collapsible.tsx
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { jsx as jsx22 } from "react/jsx-runtime";
function Collapsible({ ...props }) {
  return /* @__PURE__ */ jsx22(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger2({
  ...props
}) {
  return /* @__PURE__ */ jsx22(CollapsiblePrimitive.CollapsibleTrigger, { "data-slot": "collapsible-trigger", ...props });
}
function CollapsibleContent2({
  ...props
}) {
  return /* @__PURE__ */ jsx22(CollapsiblePrimitive.CollapsibleContent, { "data-slot": "collapsible-content", ...props });
}

// src/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx23 } from "react/jsx-runtime";
function Popover({ ...props }) {
  return /* @__PURE__ */ jsx23(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({ ...props }) {
  return /* @__PURE__ */ jsx23(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx23(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx23(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function PopoverAnchor({ ...props }) {
  return /* @__PURE__ */ jsx23(PopoverPrimitive.Anchor, { "data-slot": "popover-anchor", ...props });
}

// src/components/ui/calendar.tsx
import * as React3 from "react";
import { ChevronDownIcon as ChevronDownIcon2, ChevronLeftIcon, ChevronRightIcon as ChevronRightIcon2 } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { jsx as jsx24 } from "react/jsx-runtime";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx24(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn("select-none w-(--cell-size)", defaultClassNames.week_number_header),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l-md bg-accent", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx24("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx24(ChevronLeftIcon, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx24(ChevronRightIcon2, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsx24(ChevronDownIcon2, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx24("td", { ...props2, children: /* @__PURE__ */ jsx24("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React3.useRef(null);
  React3.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx24(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}

// src/components/ui/form.tsx
import * as React4 from "react";
import { Slot as Slot4 } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState
} from "react-hook-form";
import { jsx as jsx25 } from "react/jsx-runtime";
var Form = FormProvider;
var FormFieldContext = React4.createContext({});
var FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx25(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx25(Controller, { ...props }) });
};
var useFormField = () => {
  const fieldContext = React4.useContext(FormFieldContext);
  const itemContext = React4.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
var FormItemContext = React4.createContext({});
function FormItem({ className, ...props }) {
  const id = React4.useId();
  return /* @__PURE__ */ jsx25(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx25("div", { "data-slot": "form-item", className: cn("grid gap-2", className), ...props }) });
}
function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx25(
    Label3,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx25(
    Slot4,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx25(
    "p",
    {
      "data-slot": "form-description",
      id: formDescriptionId,
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx25(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}

// src/components/ui/hover-card.tsx
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { jsx as jsx26 } from "react/jsx-runtime";
function HoverCard({ ...props }) {
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Root, { "data-slot": "hover-card", ...props });
}
function HoverCardTrigger({ ...props }) {
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Trigger, { "data-slot": "hover-card-trigger", ...props });
}
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx26(HoverCardPrimitive.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ jsx26(
    HoverCardPrimitive.Content,
    {
      "data-slot": "hover-card-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}

// src/components/ui/command.tsx
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { jsx as jsx27, jsxs as jsxs10 } from "react/jsx-runtime";
function Command({ className, ...props }) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive,
    {
      "data-slot": "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props
    }
  );
}
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs10(Dialog, { ...props, children: [
    /* @__PURE__ */ jsxs10(DialogHeader, { className: "sr-only", children: [
      /* @__PURE__ */ jsx27(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx27(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsx27(
      DialogContent,
      {
        className: cn("overflow-hidden p-0", className),
        showCloseButton,
        children: /* @__PURE__ */ jsx27(Command, { className: "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children })
      }
    )
  ] });
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs10("div", { "data-slot": "command-input-wrapper", className: "flex h-9 items-center gap-2 border-b px-3", children: [
    /* @__PURE__ */ jsx27(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
    /* @__PURE__ */ jsx27(
      CommandPrimitive.Input,
      {
        "data-slot": "command-input",
        className: cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props
      }
    )
  ] });
}
function CommandList({ className, ...props }) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive.List,
    {
      "data-slot": "command-list",
      className: cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className),
      ...props
    }
  );
}
function CommandEmpty({ ...props }) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive.Separator,
    {
      "data-slot": "command-separator",
      className: cn("bg-border -mx-1 h-px", className),
      ...props
    }
  );
}
function CommandItem({ className, ...props }) {
  return /* @__PURE__ */ jsx27(
    CommandPrimitive.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function CommandShortcut({ className, ...props }) {
  return /* @__PURE__ */ jsx27(
    "span",
    {
      "data-slot": "command-shortcut",
      className: cn("text-muted-foreground ml-auto text-xs tracking-widest", className),
      ...props
    }
  );
}

// src/components/ui/drawer.tsx
import { Drawer as DrawerPrimitive } from "vaul";
import { jsx as jsx28, jsxs as jsxs11 } from "react/jsx-runtime";
function Drawer({ ...props }) {
  return /* @__PURE__ */ jsx28(DrawerPrimitive.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({ ...props }) {
  return /* @__PURE__ */ jsx28(DrawerPrimitive.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({ ...props }) {
  return /* @__PURE__ */ jsx28(DrawerPrimitive.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({ ...props }) {
  return /* @__PURE__ */ jsx28(DrawerPrimitive.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx28(
    DrawerPrimitive.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs11(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx28(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs11(
      DrawerPrimitive.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx28("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx28(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      ),
      ...props
    }
  );
}
function DrawerFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx28(
    "div",
    {
      "data-slot": "drawer-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function DrawerTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx28(
    DrawerPrimitive.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function DrawerDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx28(
    DrawerPrimitive.Description,
    {
      "data-slot": "drawer-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// src/components/ui/alert-dialog.tsx
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx29, jsxs as jsxs12 } from "react/jsx-runtime";
function AlertDialog({ ...props }) {
  return /* @__PURE__ */ jsx29(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx29(AlertDialogPrimitive.Trigger, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({ ...props }) {
  return /* @__PURE__ */ jsx29(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    AlertDialogPrimitive.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs12(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx29(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx29(
      AlertDialogPrimitive.Content,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx29(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx29(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    AlertDialogPrimitive.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    AlertDialogPrimitive.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(AlertDialogPrimitive.Action, { className: cn(buttonVariants(), className), ...props });
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    AlertDialogPrimitive.Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}

// src/components/ui/skeleton.tsx
import { jsx as jsx30 } from "react/jsx-runtime";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx30(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}

// src/components/ui/sonner.tsx
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { jsx as jsx31 } from "react/jsx-runtime";
var Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx31(
    Sonner,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};

// src/components/ui/timeline.tsx
import * as React5 from "react";
import { jsx as jsx32, jsxs as jsxs13 } from "react/jsx-runtime";
var Timeline = React5.forwardRef(
  function Timeline2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs13("div", { ref, className: cn("relative flex flex-col gap-4 pl-4", className), ...props, children: [
      /* @__PURE__ */ jsx32("span", { className: "absolute left-0 top-0 h-full w-px bg-border" }),
      children
    ] });
  }
);
var TimelineItem = React5.forwardRef(
  function TimelineItem2({ className, icon, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs13("div", { ref, className: cn("relative flex items-start gap-3", className), ...props, children: [
      /* @__PURE__ */ jsx32(TimelineSeparator, { children: icon }),
      /* @__PURE__ */ jsx32(TimelineContent, { children })
    ] });
  }
);
var TimelineSeparator = React5.forwardRef(
  function TimelineSeparator2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsx32(
      "div",
      {
        ref,
        className: cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border text-foreground shrink-0",
          className
        ),
        ...props,
        children: children ?? /* @__PURE__ */ jsx32("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" })
      }
    );
  }
);
var TimelineContent = React5.forwardRef(
  function TimelineContent2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsx32("div", { ref, className: cn("flex flex-col gap-1", className), ...props, children });
  }
);

// src/components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { jsx as jsx33 } from "react/jsx-runtime";
function ThemeProvider({ children, ...props }) {
  return /* @__PURE__ */ jsx33(NextThemesProvider, { ...props, children });
}

// src/components/theme-toggle.tsx
import { useTheme as useTheme2 } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { jsx as jsx34, jsxs as jsxs14 } from "react/jsx-runtime";
function ThemeToggle() {
  const { setTheme, theme } = useTheme2();
  return /* @__PURE__ */ jsxs14(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      className: "text-foreground hover:bg-accent hover:text-accent-foreground border border-border/50 hover:border-border",
      "data-theme-toggle": true,
      title: `Switch to ${theme === "light" ? "dark" : "light"} mode`,
      children: [
        /* @__PURE__ */ jsx34(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx34(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx34("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}
export {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  CalendarDayButton,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
  Collapsible,
  CollapsibleContent2 as CollapsibleContent,
  CollapsibleTrigger2 as CollapsibleTrigger,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CsvUpload,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label3 as Label,
  LoadingSpinner,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeProvider,
  ThemeToggle,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  badgeVariants,
  buttonVariants,
  cn,
  cva4 as cva,
  getThemeColor,
  themeConfig,
  useFormField
};
//# sourceMappingURL=index.js.map