import type { Preview } from '@storybook/react';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { getDefaultTheme, ThemeProvider } from '../src';

const theme = getDefaultTheme();

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value: theme.palette.background.content,
        },
        {
          name: 'sidebar',
          value: theme.palette.background.sideBar,
        },
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
  },
};

export default preview;

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      default: getDefaultTheme(),
    },
    defaultTheme: 'default',
    Provider: ThemeProvider,
  }),
];
