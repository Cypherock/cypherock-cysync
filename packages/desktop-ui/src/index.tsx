import React from 'react';
import ReactDOM from 'react-dom/client';
import './utils/logger';

import App from './app';

export default function render(target?: HTMLElement) {
  const root = ReactDOM.createRoot(target ?? document.body);
  root.render(<App />);
}
