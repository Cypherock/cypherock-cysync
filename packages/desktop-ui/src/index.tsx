import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import { setupCoreDependencies } from './utils/setupCore';
import { analyticsService } from '@cypherock/cysync-core';

export async function render(target?: HTMLElement) {
  await setupCoreDependencies();
  analyticsService.init();

  const root = ReactDOM.createRoot(target ?? document.body);
  root.render(<App />);
}
