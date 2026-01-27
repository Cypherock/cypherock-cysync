import { analyticsService } from '@cypherock/cysync-core';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import { setupCoreDependencies } from './utils/setupCore';

export async function render(target?: HTMLElement) {
  await setupCoreDependencies();
  await analyticsService.init();

  const root = ReactDOM.createRoot(target ?? document.body);
  root.render(<App />);
}
