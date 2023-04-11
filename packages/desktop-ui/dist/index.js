import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
export default function render(target) {
    ReactDOM.render(React.createElement(App, null), target !== null && target !== void 0 ? target : document.body);
}
