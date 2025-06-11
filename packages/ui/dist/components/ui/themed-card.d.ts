export interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'accent' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    withHover?: boolean;
    withShadow?: boolean;
}
declare const ThemedCard: import("react").ForwardRefExoticComponent<ThemedCardProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ThemedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const ThemedCardHeader: import("react").ForwardRefExoticComponent<ThemedCardHeaderProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ThemedCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}
declare const ThemedCardTitle: import("react").ForwardRefExoticComponent<ThemedCardTitleProps & import("react").RefAttributes<HTMLHeadingElement>>;
export interface ThemedCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
declare const ThemedCardDescription: import("react").ForwardRefExoticComponent<ThemedCardDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>>;
export interface ThemedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const ThemedCardContent: import("react").ForwardRefExoticComponent<ThemedCardContentProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ThemedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const ThemedCardFooter: import("react").ForwardRefExoticComponent<ThemedCardFooterProps & import("react").RefAttributes<HTMLDivElement>>;
export { ThemedCard, ThemedCardHeader, ThemedCardTitle, ThemedCardDescription, ThemedCardContent, ThemedCardFooter, };
//# sourceMappingURL=themed-card.d.ts.map