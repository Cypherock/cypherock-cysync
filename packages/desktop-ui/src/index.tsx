import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './app';
import { setupCoreDependencies } from './utils/setupCore';

export async function render(target?: HTMLElement) {
  await setupCoreDependencies();

  const root = ReactDOM.createRoot(target ?? document.body);
  root.render(<App />);
}
