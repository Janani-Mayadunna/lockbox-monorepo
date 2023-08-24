import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Router from './routes';

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'popupOpened' });
});

// Establish a connection with the background script
const port = chrome.runtime.connect({ name: 'popupPort' });

// Close the port when the popup is closed
window.addEventListener('beforeunload', () => {
  port.disconnect();
});

const router = createHashRouter([
  {
    path: '*',
    element: <Router />,
  },
]);

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
