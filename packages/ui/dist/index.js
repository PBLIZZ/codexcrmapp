"use client";

// src/index.ts
import { cva as cva6 } from "class-variance-authority";

// src/components/ui/avatar.tsx
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/avatar.tsx
import { jsx } from "react/jsx-runtime";
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// src/components/ui/loading-spinner.tsx
import * as React2 from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var LoadingSpinner = React2.forwardRef(({ className, ...props }, ref) => {
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
import * as React3 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
var Button = React3.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx3(
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

// src/components/ui/badge.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var badgeVariants = cva2(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx4("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/ui/input.tsx
import * as React4 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Input = React4.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx5(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

// src/components/ui/separator.tsx
import * as React5 from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx as jsx6 } from "react/jsx-runtime";
var Separator = React5.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx6(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// src/components/ui/tooltip.tsx
import * as React6 from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx7 } from "react/jsx-runtime";
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React6.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx7(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// src/components/ui/alert.tsx
import * as React7 from "react";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
var alertVariants = cva3(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React7.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx8(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
var AlertTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx8(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";

// src/components/ui/table.tsx
import * as React8 from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
var Table = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx9(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
var TableHeader = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
var TableBody = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableFooter = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
var TableRow = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableHead = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
var TableCaption = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx9(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";

// src/components/ui/dropdown-menu.tsx
import * as React9 from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs2 } from "react/jsx-runtime";
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React9.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs2(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx10(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React9.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx10(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React9.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx10(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx10(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React9.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx10(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React9.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs2(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx10("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx10(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx10(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React9.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs2(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx10("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx10(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx10(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React9.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx10(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React9.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx10(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx10(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// src/components/ui/select.tsx
import * as React10 from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check as Check2, ChevronDown, ChevronUp } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs3 } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React10.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs3(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx11(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx11(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React10.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx11(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx11(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React10.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx11(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx11(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React10.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx11(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs3(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx11(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React10.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx11(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React10.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs3(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx11("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx11(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx11(Check2, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx11(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React10.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx11(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// src/components/ui/checkbox.tsx
import * as React11 from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check as Check3 } from "lucide-react";
import { jsx as jsx12 } from "react/jsx-runtime";
var Checkbox = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx12(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx12(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx12(Check3, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// src/components/ui/card.tsx
import * as React12 from "react";
import { jsx as jsx13 } from "react/jsx-runtime";
var Card = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React12.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx13(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/components/ui/dialog.tsx
import * as React13 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs4 } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React13.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React13.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs4(DialogPortal, { children: [
  /* @__PURE__ */ jsx14(DialogOverlay, {}),
  /* @__PURE__ */ jsxs4(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs4(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx14(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx14(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx14(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React13.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React13.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/ui/tabs.tsx
import * as React14 from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx15 } from "react/jsx-runtime";
var Tabs = TabsPrimitive.Root;
var TabsList = React14.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx15(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React14.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx15(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React14.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx15(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// src/components/ui/textarea.tsx
import * as React15 from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
var Textarea = React15.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx16(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/components/ui/label.tsx
import * as React16 from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx17 } from "react/jsx-runtime";
var labelVariants = cva4(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label3 = React16.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx17(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label3.displayName = LabelPrimitive.Root.displayName;

// src/components/ui/carousel.tsx
import * as React17 from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs5 } from "react/jsx-runtime";
var CarouselContext = React17.createContext(null);
function useCarousel() {
  const context = React17.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
var Carousel = React17.forwardRef(
  ({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y"
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React17.useState(false);
    const [canScrollNext, setCanScrollNext] = React17.useState(false);
    const onSelect = React17.useCallback((api2) => {
      if (!api2) {
        return;
      }
      setCanScrollPrev(api2.canScrollPrev());
      setCanScrollNext(api2.canScrollNext());
    }, []);
    const scrollPrev = React17.useCallback(() => {
      api?.scrollPrev();
    }, [api]);
    const scrollNext = React17.useCallback(() => {
      api?.scrollNext();
    }, [api]);
    const handleKeyDown = React17.useCallback(
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
    React17.useEffect(() => {
      if (!api || !setApi) {
        return;
      }
      setApi(api);
    }, [api, setApi]);
    React17.useEffect(() => {
      if (!api) {
        return;
      }
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
            ref,
            onKeyDownCapture: handleKeyDown,
            className: cn("relative", className),
            role: "region",
            "aria-roledescription": "carousel",
            ...props,
            children
          }
        )
      }
    );
  }
);
Carousel.displayName = "Carousel";
var CarouselContent = React17.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return /* @__PURE__ */ jsx18("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsx18(
    "div",
    {
      ref,
      className: cn(
        "flex",
        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
        className
      ),
      ...props
    }
  ) });
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = React17.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return /* @__PURE__ */ jsx18(
    "div",
    {
      ref,
      role: "group",
      "aria-roledescription": "slide",
      className: cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      ),
      ...props
    }
  );
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = React17.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return /* @__PURE__ */ jsxs5(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollPrev,
      onClick: scrollPrev,
      ...props,
      children: [
        /* @__PURE__ */ jsx18(ArrowLeft, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx18("span", { className: "sr-only", children: "Previous slide" })
      ]
    }
  );
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = React17.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return /* @__PURE__ */ jsxs5(
    Button,
    {
      ref,
      variant,
      size,
      className: cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      ),
      disabled: !canScrollNext,
      onClick: scrollNext,
      ...props,
      children: [
        /* @__PURE__ */ jsx18(ArrowRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx18("span", { className: "sr-only", children: "Next slide" })
      ]
    }
  );
});
CarouselNext.displayName = "CarouselNext";

// src/components/ui/csv-upload.tsx
import { UploadCloud, AlertTriangle, Loader2 } from "lucide-react";
import { useCallback as useCallback2, useState as useState2 } from "react";
import { useDropzone } from "react-dropzone";
import { jsx as jsx19, jsxs as jsxs6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs6(
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
        /* @__PURE__ */ jsxs6("div", { className: "flex flex-col items-center justify-center space-y-2", children: [
          isError ? /* @__PURE__ */ jsx19(AlertTriangle, { className: "w-12 h-12 mb-2 text-destructive" }) : isProcessing ? /* @__PURE__ */ jsx19(Loader2, { className: "w-12 h-12 mb-2 text-primary animate-spin" }) : /* @__PURE__ */ jsx19(
            UploadCloud,
            {
              className: `w-12 h-12 mb-2 ${isDragActive || isHovering ? "text-primary" : "text-muted-foreground"}`
            }
          ),
          isError ? /* @__PURE__ */ jsx19("p", { className: "text-destructive font-semibold", children: rejectionError }) : isProcessing ? /* @__PURE__ */ jsx19("p", { className: "text-lg font-semibold text-primary", children: "Processing file..." }) : isDragActive ? /* @__PURE__ */ jsx19("p", { className: "text-lg font-semibold text-primary", children: "Drop the CSV file here ..." }) : /* @__PURE__ */ jsx19("p", { className: "text-muted-foreground", children: "Drag 'n' drop a CSV file here, or click to select file" }),
          selectedFile && !isDragActive && !isError && !isProcessing && /* @__PURE__ */ jsxs6("div", { className: "mt-3 text-sm text-muted-foreground", children: [
            "Selected file: ",
            selectedFile.name
          ] }),
          !isError && !isProcessing && /* @__PURE__ */ jsxs6("p", { className: "text-xs text-muted-foreground mt-2", children: [
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
import * as React18 from "react";
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { ChevronRight as ChevronRight2, MoreHorizontal } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs7 } from "react/jsx-runtime";
var Breadcrumb = React18.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx20("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = React18.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = React18.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = React18.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot2 : "a";
  return /* @__PURE__ */ jsx20(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = React18.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx20(
  "span",
  {
    ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn("font-normal text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx20(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:size-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx20(ChevronRight2, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxs7(
  "span",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("flex h-9 w-9 items-center justify-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx20(MoreHorizontal, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx20("span", { className: "sr-only", children: "More" })
    ]
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

// src/components/ui/sheet.tsx
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva as cva5 } from "class-variance-authority";
import { X as X2 } from "lucide-react";
import * as React19 from "react";
import { jsx as jsx21, jsxs as jsxs8 } from "react/jsx-runtime";
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetClose = SheetPrimitive.Close;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React19.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx21(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva5(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
var SheetContent = React19.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs8(SheetPortal, { children: [
  /* @__PURE__ */ jsx21(SheetOverlay, {}),
  /* @__PURE__ */ jsxs8(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs8(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx21(X2, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx21("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx21(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx21(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React19.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx21(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React19.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx21(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

// src/components/ui/collapsible.tsx
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
var Collapsible = CollapsiblePrimitive.Root;
var CollapsibleTrigger2 = CollapsiblePrimitive.CollapsibleTrigger;
var CollapsibleContent2 = CollapsiblePrimitive.CollapsibleContent;

// src/components/ui/popover.tsx
import * as React20 from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { jsx as jsx22 } from "react/jsx-runtime";
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React20.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx22(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx22(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// src/components/ui/calendar.tsx
import { ChevronLeft, ChevronRight as ChevronRight3 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { jsx as jsx23 } from "react/jsx-runtime";
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return /* @__PURE__ */ jsx23(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        Chevron: ({ ...props2 }) => {
          return props2.orientation === "left" ? /* @__PURE__ */ jsx23(ChevronLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx23(ChevronRight3, { className: "h-4 w-4" });
        }
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";

// src/components/ui/form.tsx
import * as React21 from "react";
import { Slot as Slot3 } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext
} from "react-hook-form";
import { jsx as jsx24 } from "react/jsx-runtime";
var Form = FormProvider;
var FormFieldContext = React21.createContext(
  {}
);
var FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx24(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx24(Controller, { ...props }) });
};
var useFormField = () => {
  const fieldContext = React21.useContext(FormFieldContext);
  const itemContext = React21.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
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
var FormItemContext = React21.createContext(
  {}
);
var FormItem = React21.forwardRef(({ className, ...props }, ref) => {
  const id = React21.useId();
  return /* @__PURE__ */ jsx24(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx24("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
var FormLabel = React21.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx24(
    Label3,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
var FormControl = React21.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx24(
    Slot3,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
var FormDescription = React21.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx24(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
var FormMessage = React21.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx24(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-sm font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";

// src/components/ui/hover-card.tsx
import * as React22 from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { jsx as jsx25 } from "react/jsx-runtime";
var HoverCard = HoverCardPrimitive.Root;
var HoverCardTrigger = HoverCardPrimitive.Trigger;
var HoverCardContent = React22.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx25(
  HoverCardPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

// src/components/ui/command.tsx
import * as React23 from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { jsx as jsx26, jsxs as jsxs9 } from "react/jsx-runtime";
var Command = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  CommandPrimitive,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = CommandPrimitive.displayName;
var CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsx26(Dialog, { ...props, children: /* @__PURE__ */ jsx26(DialogContent, { className: "overflow-hidden p-0 shadow-lg", children: /* @__PURE__ */ jsx26(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
var CommandInput = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs9("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsx26(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsx26(
    CommandPrimitive.Input,
    {
      ref,
      className: cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = CommandPrimitive.Input.displayName;
var CommandList = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  CommandPrimitive.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = CommandPrimitive.List.displayName;
var CommandEmpty = React23.forwardRef((props, ref) => /* @__PURE__ */ jsx26(CommandPrimitive.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
var CommandGroup = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  CommandPrimitive.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
var CommandSeparator = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  CommandPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
var CommandItem = React23.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  CommandPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className
    ),
    ...props
  }
));
CommandItem.displayName = CommandPrimitive.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
  return /* @__PURE__ */ jsx26(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
      ...props
    }
  );
};
CommandShortcut.displayName = "CommandShortcut";

// src/components/ui/drawer.tsx
import * as React24 from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { jsx as jsx27, jsxs as jsxs10 } from "react/jsx-runtime";
var Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /* @__PURE__ */ jsx27(
  DrawerPrimitive.Root,
  {
    shouldScaleBackground,
    ...props
  }
);
Drawer.displayName = "Drawer";
var DrawerTrigger = DrawerPrimitive.Trigger;
var DrawerPortal = DrawerPrimitive.Portal;
var DrawerClose = DrawerPrimitive.Close;
var DrawerOverlay = React24.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx27(
  DrawerPrimitive.Overlay,
  {
    ref,
    className: cn("fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
var DrawerContent = React24.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs10(DrawerPortal, { children: [
  /* @__PURE__ */ jsx27(DrawerOverlay, {}),
  /* @__PURE__ */ jsxs10(
    DrawerPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx27("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
        children
      ]
    }
  )
] }));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx27(
  "div",
  {
    className: cn("grid gap-1.5 p-4 text-center sm:text-left", className),
    ...props
  }
);
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx27(
  "div",
  {
    className: cn("mt-auto flex flex-col gap-2 p-4", className),
    ...props
  }
);
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = React24.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx27(
  DrawerPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
var DrawerDescription = React24.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx27(
  DrawerPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// src/components/ui/alert-dialog.tsx
import * as React25 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx28, jsxs as jsxs11 } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx28(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs11(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx28(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx28(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx28(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx28(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx28(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx28(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx28(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React25.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx28(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/components/ui/skeleton.tsx
import { jsx as jsx29 } from "react/jsx-runtime";
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx29(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}

// src/components/ui/slot.tsx
import { Slot as RadixSlot } from "@radix-ui/react-slot";
var Slot4 = RadixSlot;

// src/components/ui/timeline.tsx
import * as React26 from "react";
import { jsx as jsx30, jsxs as jsxs12 } from "react/jsx-runtime";
var Timeline = React26.forwardRef(
  function Timeline2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs12("div", { ref, className: cn("relative flex flex-col gap-4 pl-4", className), ...props, children: [
      /* @__PURE__ */ jsx30("span", { className: "absolute left-0 top-0 h-full w-px bg-border" }),
      children
    ] });
  }
);
var TimelineItem = React26.forwardRef(
  function TimelineItem2({ className, icon, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs12("div", { ref, className: cn("relative flex items-start gap-3", className), ...props, children: [
      /* @__PURE__ */ jsx30(TimelineSeparator, { children: icon }),
      /* @__PURE__ */ jsx30(TimelineContent, { children })
    ] });
  }
);
var TimelineSeparator = React26.forwardRef(
  function TimelineSeparator2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsx30(
      "div",
      {
        ref,
        className: cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-background border border-border text-foreground shrink-0",
          className
        ),
        ...props,
        children: children ?? /* @__PURE__ */ jsx30("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" })
      }
    );
  }
);
var TimelineContent = React26.forwardRef(
  function TimelineContent2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsx30("div", { ref, className: cn("flex flex-col gap-1", className), ...props, children });
  }
);

// src/components/ui/sonner.tsx
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { jsx as jsx31 } from "react/jsx-runtime";
var Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx31(
    Sonner,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};

// src/components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { jsx as jsx32 } from "react/jsx-runtime";
function ThemeProvider({ children, ...props }) {
  return /* @__PURE__ */ jsx32(NextThemesProvider, { ...props, children });
}

// src/components/theme-toggle.tsx
import { useTheme as useTheme2 } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { jsx as jsx33, jsxs as jsxs13 } from "react/jsx-runtime";
function ThemeToggle() {
  const { setTheme, theme } = useTheme2();
  return /* @__PURE__ */ jsxs13(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      className: "text-foreground hover:bg-accent hover:text-accent-foreground border border-border/50 hover:border-border",
      "data-theme-toggle": true,
      title: `Switch to ${theme === "light" ? "dark" : "light"} mode`,
      children: [
        /* @__PURE__ */ jsx33(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx33(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx33("span", { className: "sr-only", children: "Toggle theme" })
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
  Card,
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
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slot4 as Slot,
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
  cva6 as cva,
  getThemeColor,
  themeConfig,
  toast,
  useFormField
};
//# sourceMappingURL=index.js.map