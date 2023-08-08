import type { Preview } from '@storybook/react';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { getDefaultTheme, ThemeProvider } from '../src';
import '../src/stories/style.css';

const theme = getDefaultTheme();

const preview: Preview = {
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1728px',
            height: '1117px',
          },
          type: 'desktop',
        },
        desktopMini: {
          name: 'Desktop Mini',
          styles: {
            width: '1024px',
            height: '700px',
          },
          type: 'tablet',
        },
      },
      defaultViewPort: 'desktop',
    },
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
  args: {
    $fontFamily: 'monospace',
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
