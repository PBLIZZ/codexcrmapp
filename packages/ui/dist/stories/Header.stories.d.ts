import type { StoryObj } from '@storybook/react-webpack5';
declare const meta: {
    title: string;
    component: ({ user, onLogin, onLogout, onCreateAccount }: import("./Header").HeaderProps) => import("react/jsx-runtime").JSX.Element;
    tags: string[];
    parameters: {
        layout: string;
    };
    args: {
        onLogin: import("storybook/internal/test").Mock<(...args: any[]) => any>;
        onLogout: import("storybook/internal/test").Mock<(...args: any[]) => any>;
        onCreateAccount: import("storybook/internal/test").Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const LoggedIn: Story;
export declare const LoggedOut: Story;
//# sourceMappingURL=Header.stories.d.ts.map