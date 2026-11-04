import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/popup/App';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element for popup');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
