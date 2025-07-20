import { VariantProps } from 'class-variance-authority';
export { VariantProps, cva } from 'class-variance-authority';
import * as React$1 from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ClassValue } from 'clsx';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogProps } from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as LabelPrimitive from '@radix-ui/react-label';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { FileWithPath } from 'react-dropzone';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import * as _radix_ui_react_slot from '@radix-ui/react-slot';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as vaul from 'vaul';
import { Drawer as Drawer$1 } from 'vaul';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Toaster as Toaster$1 } from 'sonner';
export { toast } from 'sonner';
import { ThemeProvider as ThemeProvider$1 } from 'next-themes';

declare const Avatar: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const AvatarImage: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarImageProps & React$1.RefAttributes<HTMLImageElement>, "ref"> & React$1.RefAttributes<HTMLImageElement>>;
declare const AvatarFallback: React$1.ForwardRefExoticComponent<Omit<AvatarPrimitive.AvatarFallbackProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

/**
 * A reusable, centered loading spinner component.
 *
 * It is accessible via the `role="status"` attribute and a visually hidden
 * "Loading..." text for screen readers. It can be customized with a className.
 */
declare const LoadingSpinner: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare function cn(...inputs: ClassValue[]): string;

/**
 * A JavaScript representation of the CSS theme variables.
 * This is primarily consumed by the tailwind.config.js file.
 */
declare const themeConfig: {
    colors: {
        slate: {
            50: string;
            100: string;
            200: string;
            600: string;
            900: string;
        };
        teal: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
        violet: {
            50: string;
            100: string;
        };
        amber: {
            50: string;
            100: string;
        };
        sky: {
            50: string;
            100: string;
        };
        border: string;
        input: string;
        ring: string;
        background: string;
        foreground: string;
        primary: {
            DEFAULT: string;
            foreground: string;
        };
        secondary: {
            DEFAULT: string;
            foreground: string;
        };
        destructive: {
            DEFAULT: string;
            foreground: string;
        };
        muted: {
            DEFAULT: string;
            foreground: string;
        };
        accent: {
            DEFAULT: string;
            foreground: string;
        };
        popover: {
            DEFAULT: string;
            foreground: string;
        };
        card: {
            DEFAULT: string;
            foreground: string;
        };
    };
    borderRadius: {
        lg: string;
        md: string;
        sm: string;
    };
};
/**
 * THE BUILD FIX IS HERE!
 * This is the corrected, type-safe helper function that will resolve your build error.
 * Get a color value from the theme programmatically.
 * @param path - Path to the color in the theme config (e.g., 'primary.500')
 * @returns CSS variable or direct color value, or an empty string if not found.
 */
declare function getThemeColor(path: string): string;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends React$1.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): react_jsx_runtime.JSX.Element;

declare const Input: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

declare const Separator: React$1.ForwardRefExoticComponent<Omit<SeparatorPrimitive.SeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const TooltipProvider: React$1.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Alert: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & VariantProps<(props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const Table: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableElement> & React$1.RefAttributes<HTMLTableElement>>;
declare const TableHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableBody: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableSectionElement> & React$1.RefAttributes<HTMLTableSectionElement>>;
declare const TableRow: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableRowElement> & React$1.RefAttributes<HTMLTableRowElement>>;
declare const TableHead: React$1.ForwardRefExoticComponent<React$1.ThHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCell: React$1.ForwardRefExoticComponent<React$1.TdHTMLAttributes<HTMLTableCellElement> & React$1.RefAttributes<HTMLTableCellElement>>;
declare const TableCaption: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLTableCaptionElement> & React$1.RefAttributes<HTMLTableCaptionElement>>;

declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Select: React$1.FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<CheckboxPrimitive.CheckboxProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Card: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare const Dialog: React$1.FC<DialogPrimitive.DialogProps>;
declare const DialogTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const DialogClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DialogOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogContent: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DialogTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DialogDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const Tabs: React$1.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsList: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsListProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const TabsTrigger: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const TabsContent: React$1.ForwardRefExoticComponent<Omit<TabsPrimitive.TabsContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface TextareaProps extends React$1.TextareaHTMLAttributes<HTMLTextAreaElement> {
}
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

declare const Label: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & VariantProps<(props?: class_variance_authority_types.ClassProp | undefined) => string> & React$1.RefAttributes<HTMLLabelElement>>;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};
declare const Carousel: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & CarouselProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CarouselPrevious: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const CarouselNext: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

interface CsvUploadProps {
    onFilesAccepted: (files: FileWithPath[]) => void;
    maxSize?: number;
}
declare function CsvUpload({ onFilesAccepted, maxSize }: CsvUploadProps): react_jsx_runtime.JSX.Element;

declare const Breadcrumb: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & {
    separator?: React$1.ReactNode;
} & React$1.RefAttributes<HTMLElement>>;
declare const BreadcrumbList: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> & React$1.RefAttributes<HTMLOListElement>>;
declare const BreadcrumbItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const BreadcrumbLink: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref"> & {
    asChild?: boolean;
} & React$1.RefAttributes<HTMLAnchorElement>>;
declare const BreadcrumbPage: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;
declare const BreadcrumbSeparator: {
    ({ children, className, ...props }: React$1.ComponentProps<"li">): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const BreadcrumbEllipsis: {
    ({ className, ...props }: React$1.ComponentProps<"span">): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Sheet: React$1.FC<DialogPrimitive.DialogProps>;
declare const SheetTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React$1.FC<DialogPrimitive.DialogPortalProps>;
declare const SheetOverlay: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const sheetVariants: (props?: ({
    side?: "top" | "right" | "bottom" | "left" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SheetContentProps extends React$1.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
}
declare const SheetContent: React$1.ForwardRefExoticComponent<SheetContentProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SheetHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const SheetDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const Collapsible: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CollapsibleTrigger: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const CollapsibleContent: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleContentProps & React$1.RefAttributes<HTMLDivElement>>;

declare const Popover: React$1.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type CalendarProps = React$1.ComponentProps<typeof DayPicker>;
declare function Calendar({ className, classNames, showOutsideDays, ...props }: CalendarProps): react_jsx_runtime.JSX.Element;
declare namespace Calendar {
    var displayName: string;
}

declare const Form: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>(props: react_hook_form.FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React$1.JSX.Element;
declare const FormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => react_jsx_runtime.JSX.Element;
declare const useFormField: () => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: react_hook_form.FieldError;
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
};
declare const FormItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const FormLabel: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & React$1.RefAttributes<HTMLLabelElement>>;
declare const FormControl: React$1.ForwardRefExoticComponent<Omit<_radix_ui_react_slot.SlotProps & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const FormDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const FormMessage: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const HoverCard: React$1.FC<HoverCardPrimitive.HoverCardProps>;
declare const HoverCardTrigger: React$1.ForwardRefExoticComponent<HoverCardPrimitive.HoverCardTriggerProps & React$1.RefAttributes<HTMLAnchorElement>>;
declare const HoverCardContent: React$1.ForwardRefExoticComponent<Omit<HoverCardPrimitive.HoverCardContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Command: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    label?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    disablePointerSelection?: boolean;
    vimBindings?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
interface CommandDialogProps extends DialogProps {
}
declare const CommandDialog: ({ children, ...props }: CommandDialogProps) => react_jsx_runtime.JSX.Element;
declare const CommandInput: React$1.ForwardRefExoticComponent<Omit<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React$1.InputHTMLAttributes<HTMLInputElement>> & {
    ref?: React$1.Ref<HTMLInputElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.InputHTMLAttributes<HTMLInputElement>>, "onChange" | "type" | "value"> & {
    value?: string;
    onValueChange?: (search: string) => void;
} & React$1.RefAttributes<HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;
declare const CommandList: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    label?: string;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandEmpty: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandGroup: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>>, "heading" | "value"> & {
    heading?: React$1.ReactNode;
    value?: string;
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandSeparator: React$1.ForwardRefExoticComponent<Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    alwaysRender?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandItem: React$1.ForwardRefExoticComponent<Omit<{
    children?: React$1.ReactNode;
} & Omit<Pick<Pick<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof React$1.HTMLAttributes<HTMLDivElement>> & {
    ref?: React$1.Ref<HTMLDivElement>;
} & {
    asChild?: boolean;
}, "key" | "asChild" | keyof React$1.HTMLAttributes<HTMLDivElement>>, "onSelect" | "disabled" | "value"> & {
    disabled?: boolean;
    onSelect?: (value: string) => void;
    value?: string;
    keywords?: string[];
    forceMount?: boolean;
} & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const CommandShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

declare const Drawer: {
    ({ shouldScaleBackground, ...props }: React$1.ComponentProps<typeof Drawer$1.Root>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DrawerTrigger: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DrawerPortal: typeof vaul.Portal;
declare const DrawerClose: React$1.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DrawerOverlay: React$1.ForwardRefExoticComponent<Omit<Omit<DialogPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DrawerContent: React$1.ForwardRefExoticComponent<Omit<Omit<DialogPrimitive.DialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DrawerHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DrawerFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DrawerTitle: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const DrawerDescription: React$1.ForwardRefExoticComponent<Omit<DialogPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const AlertDialog: React$1.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React$1.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React$1.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare const AlertDialogOverlay: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogContent: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AlertDialogHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const AlertDialogFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const AlertDialogTitle: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const AlertDialogDescription: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const AlertDialogAction: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogActionProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogCancel: React$1.ForwardRefExoticComponent<Omit<AlertDialogPrimitive.AlertDialogCancelProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;

declare const Slot: React$1.ForwardRefExoticComponent<_radix_ui_react_slot.SlotProps & React$1.RefAttributes<HTMLElement>>;

/**
 * Parent container – renders children in a flex column and adds a left border.
 */
declare const Timeline: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/**
 * Renders an item with optional icon slot on the left.
 */
interface TimelineItemProps extends React$1.ComponentProps<'div'> {
    icon?: React$1.ReactNode;
}
declare const TimelineItem: React$1.ForwardRefExoticComponent<Omit<TimelineItemProps, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/**
 * Small circle/icon container.
 */
declare const TimelineSeparator: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
/**
 * Wrapper for item body so spacing aligns.
 */
declare const TimelineContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type ToasterProps = React.ComponentProps<typeof Toaster$1>;
declare const Toaster: ({ ...props }: ToasterProps) => react_jsx_runtime.JSX.Element;

type ThemeProviderProps = React$1.ComponentProps<typeof ThemeProvider$1>;
declare function ThemeProvider({ children, ...props }: ThemeProviderProps): react_jsx_runtime.JSX.Element;

declare function ThemeToggle(): react_jsx_runtime.JSX.Element;

export { Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, Avatar, AvatarFallback, AvatarImage, Badge, type BadgeProps, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, type ButtonProps, Calendar, type CalendarProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Checkbox, Collapsible, CollapsibleContent, CollapsibleTrigger, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, CsvUpload, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, HoverCard, HoverCardContent, HoverCardTrigger, Input, Label, LoadingSpinner, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Skeleton, Slot, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, type TextareaProps, ThemeProvider, ThemeToggle, Timeline, TimelineContent, TimelineItem, type TimelineItemProps, TimelineSeparator, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, badgeVariants, buttonVariants, cn, getThemeColor, themeConfig, useFormField };
