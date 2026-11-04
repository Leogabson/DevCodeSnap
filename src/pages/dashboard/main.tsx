import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardApp } from '@/pages/dashboard/DashboardApp';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element for dashboard');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>
);
