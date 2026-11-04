import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { SettingsApp } from '@/pages/settings/SettingsApp';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element for settings');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SettingsApp />
  </React.StrictMode>
);
