import type { Preview } from '@storybook/react-webpack5'
import { withReact19 } from './react19-decorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
  decorators: [withReact19],
};

export default preview;