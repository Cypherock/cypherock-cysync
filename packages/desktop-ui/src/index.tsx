import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

export default function render(target?: HTMLElement) {
  ReactDOM.render(<App />, target ?? document.body);
}
