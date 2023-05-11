import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { getDefaultTheme, ThemeProvider } from '../../src';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={getDefaultTheme()}>{children}</ThemeProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
