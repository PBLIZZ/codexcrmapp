import { VariantProps } from 'class-variance-authority';
export { VariantProps, cva } from 'class-variance-authority';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ClassValue } from 'clsx';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as LabelPrimitive from '@radix-ui/react-label';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { FileWithPath } from 'react-dropzone';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { DayPicker, DayButton } from 'react-day-picker';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { Command as Command$1 } from 'cmdk';
import { Drawer as Drawer$1 } from 'vaul';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { ToasterProps } from 'sonner';
import { ThemeProvider as ThemeProvider$1 } from 'next-themes';

declare function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>): react_jsx_runtime.JSX.Element;
declare function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>): react_jsx_runtime.JSX.Element;

/**
 * A reusable, centered loading spinner component.
 *
 * It is accessible via the `role="status"` attribute and a visually hidden
 * "Loading..." text for screen readers. It can be customized with a className.
 */
declare const LoadingSpinner: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;

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
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Badge({ className, variant, asChild, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

declare function Input({ className, type, ...props }: React.ComponentProps<'input'>): react_jsx_runtime.JSX.Element;

declare function Separator({ className, orientation, decorative, ...props }: React.ComponentProps<typeof SeparatorPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function TooltipProvider({ delayDuration, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): react_jsx_runtime.JSX.Element;
declare function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function TooltipContent({ className, sideOffset, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>): react_jsx_runtime.JSX.Element;

declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>): react_jsx_runtime.JSX.Element;
declare function AlertTitle({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function AlertDescription({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;

declare function Table({ className, ...props }: React.ComponentProps<'table'>): react_jsx_runtime.JSX.Element;
declare function TableHeader({ className, ...props }: React.ComponentProps<'thead'>): react_jsx_runtime.JSX.Element;
declare function TableBody({ className, ...props }: React.ComponentProps<'tbody'>): react_jsx_runtime.JSX.Element;
declare function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>): react_jsx_runtime.JSX.Element;
declare function TableRow({ className, ...props }: React.ComponentProps<'tr'>): react_jsx_runtime.JSX.Element;
declare function TableHead({ className, ...props }: React.ComponentProps<'th'>): react_jsx_runtime.JSX.Element;
declare function TableCell({ className, ...props }: React.ComponentProps<'td'>): react_jsx_runtime.JSX.Element;
declare function TableCaption({ className, ...props }: React.ComponentProps<'caption'>): react_jsx_runtime.JSX.Element;

declare function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuContent({ className, sideOffset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}): react_jsx_runtime.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): react_jsx_runtime.JSX.Element;

declare function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): react_jsx_runtime.JSX.Element;
declare function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): react_jsx_runtime.JSX.Element;
declare function SelectTrigger({ className, size, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default';
}): react_jsx_runtime.JSX.Element;
declare function SelectContent({ className, children, position, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): react_jsx_runtime.JSX.Element;
declare function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>): react_jsx_runtime.JSX.Element;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): react_jsx_runtime.JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): react_jsx_runtime.JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): react_jsx_runtime.JSX.Element;

declare function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Card({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;

declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): react_jsx_runtime.JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): react_jsx_runtime.JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): react_jsx_runtime.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): react_jsx_runtime.JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): react_jsx_runtime.JSX.Element;

declare function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>): react_jsx_runtime.JSX.Element;
declare function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): react_jsx_runtime.JSX.Element;

declare function Textarea({ className, ...props }: React.ComponentProps<'textarea'>): react_jsx_runtime.JSX.Element;

declare function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>): react_jsx_runtime.JSX.Element;

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
};
declare function Carousel({ orientation, opts, setApi, plugins, className, children, ...props }: React.ComponentProps<'div'> & CarouselProps): react_jsx_runtime.JSX.Element;
declare function CarouselContent({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CarouselItem({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function CarouselPrevious({ className, variant, size, ...props }: React.ComponentProps<typeof Button>): react_jsx_runtime.JSX.Element;
declare function CarouselNext({ className, variant, size, ...props }: React.ComponentProps<typeof Button>): react_jsx_runtime.JSX.Element;

interface CsvUploadProps {
    onFilesAccepted: (files: FileWithPath[]) => void;
    maxSize?: number;
}
declare function CsvUpload({ onFilesAccepted, maxSize }: CsvUploadProps): react_jsx_runtime.JSX.Element;

declare function Breadcrumb({ ...props }: React.ComponentProps<'nav'>): react_jsx_runtime.JSX.Element;
declare function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>): react_jsx_runtime.JSX.Element;
declare function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>): react_jsx_runtime.JSX.Element;
declare function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<'a'> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>): react_jsx_runtime.JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>): react_jsx_runtime.JSX.Element;
declare function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>): react_jsx_runtime.JSX.Element;

declare function Sheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): react_jsx_runtime.JSX.Element;
declare function SheetContent({ className, children, side, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
}): react_jsx_runtime.JSX.Element;
declare function SheetHeader({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function SheetFooter({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): react_jsx_runtime.JSX.Element;
declare function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): react_jsx_runtime.JSX.Element;

declare function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): react_jsx_runtime.JSX.Element;
declare function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): react_jsx_runtime.JSX.Element;

declare function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>): react_jsx_runtime.JSX.Element;

declare function Calendar({ className, classNames, showOutsideDays, captionLayout, buttonVariant, formatters, components, ...props }: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}): react_jsx_runtime.JSX.Element;
declare function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>): react_jsx_runtime.JSX.Element;

declare const Form: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>(props: react_hook_form.FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React.JSX.Element;
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
declare function FormItem({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function FormControl({ ...props }: React.ComponentProps<typeof Slot>): react_jsx_runtime.JSX.Element;
declare function FormDescription({ className, ...props }: React.ComponentProps<'p'>): react_jsx_runtime.JSX.Element;
declare function FormMessage({ className, ...props }: React.ComponentProps<'p'>): react_jsx_runtime.JSX.Element | null;

declare function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function HoverCardContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>): react_jsx_runtime.JSX.Element;

declare function Command({ className, ...props }: React.ComponentProps<typeof Command$1>): react_jsx_runtime.JSX.Element;
declare function CommandDialog({ title, description, children, className, showCloseButton, ...props }: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function CommandInput({ className, ...props }: React.ComponentProps<typeof Command$1.Input>): react_jsx_runtime.JSX.Element;
declare function CommandList({ className, ...props }: React.ComponentProps<typeof Command$1.List>): react_jsx_runtime.JSX.Element;
declare function CommandEmpty({ ...props }: React.ComponentProps<typeof Command$1.Empty>): react_jsx_runtime.JSX.Element;
declare function CommandGroup({ className, ...props }: React.ComponentProps<typeof Command$1.Group>): react_jsx_runtime.JSX.Element;
declare function CommandSeparator({ className, ...props }: React.ComponentProps<typeof Command$1.Separator>): react_jsx_runtime.JSX.Element;
declare function CommandItem({ className, ...props }: React.ComponentProps<typeof Command$1.Item>): react_jsx_runtime.JSX.Element;
declare function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>): react_jsx_runtime.JSX.Element;

declare function Drawer({ ...props }: React.ComponentProps<typeof Drawer$1.Root>): react_jsx_runtime.JSX.Element;
declare function DrawerTrigger({ ...props }: React.ComponentProps<typeof Drawer$1.Trigger>): react_jsx_runtime.JSX.Element;
declare function DrawerPortal({ ...props }: React.ComponentProps<typeof Drawer$1.Portal>): react_jsx_runtime.JSX.Element;
declare function DrawerClose({ ...props }: React.ComponentProps<typeof Drawer$1.Close>): react_jsx_runtime.JSX.Element;
declare function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof Drawer$1.Overlay>): react_jsx_runtime.JSX.Element;
declare function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof Drawer$1.Content>): react_jsx_runtime.JSX.Element;
declare function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function DrawerTitle({ className, ...props }: React.ComponentProps<typeof Drawer$1.Title>): react_jsx_runtime.JSX.Element;
declare function DrawerDescription({ className, ...props }: React.ComponentProps<typeof Drawer$1.Description>): react_jsx_runtime.JSX.Element;

declare function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): react_jsx_runtime.JSX.Element;
declare function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): react_jsx_runtime.JSX.Element;
declare function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): react_jsx_runtime.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): react_jsx_runtime.JSX.Element;
declare function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>): react_jsx_runtime.JSX.Element;
declare function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>): react_jsx_runtime.JSX.Element;

declare function Skeleton({ className, ...props }: React.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;

declare const Toaster: ({ ...props }: ToasterProps) => react_jsx_runtime.JSX.Element;

/**
 * Parent container – renders children in a flex column and adds a left border.
 */
declare const Timeline: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Renders an item with optional icon slot on the left.
 */
interface TimelineItemProps extends React.ComponentProps<'div'> {
    icon?: React.ReactNode;
}
declare const TimelineItem: React.ForwardRefExoticComponent<Omit<TimelineItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Small circle/icon container.
 */
declare const TimelineSeparator: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
/**
 * Wrapper for item body so spacing aligns.
 */
declare const TimelineContent: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;

type ThemeProviderProps = React.ComponentProps<typeof ThemeProvider$1>;
declare function ThemeProvider({ children, ...props }: ThemeProviderProps): react_jsx_runtime.JSX.Element;

declare function ThemeToggle(): react_jsx_runtime.JSX.Element;

export { Alert, AlertDescription, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertTitle, Avatar, AvatarFallback, AvatarImage, Badge, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Calendar, CalendarDayButton, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Checkbox, Collapsible, CollapsibleContent, CollapsibleTrigger, Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, CsvUpload, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, HoverCard, HoverCardContent, HoverCardTrigger, Input, Label, LoadingSpinner, Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Skeleton, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, ThemeProvider, ThemeToggle, Timeline, TimelineContent, TimelineItem, type TimelineItemProps, TimelineSeparator, Toaster, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, badgeVariants, buttonVariants, cn, getThemeColor, themeConfig, useFormField };
