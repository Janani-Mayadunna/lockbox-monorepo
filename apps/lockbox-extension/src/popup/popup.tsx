import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import {
  RouterProvider,
  createHashRouter,
} from 'react-router-dom';
import Router from './routes';
import { logOut } from '../utils/api';
const router = createHashRouter([
  {
    path: '*',
    element: <Router />,
  },
]);

document.addEventListener('DOMContentLoaded', () => {
  console.log('open ');
  chrome.runtime.sendMessage({ action: 'popupOpened' });
});

window.addEventListener('beforeunload', () => {
  console.log('Popup closed');
  // Notify the background script that the popup is about to close
});

// Establish a connection with the background script
const port = chrome.runtime.connect({ name: 'popupPort' });

// Close the port when the popup is closed
window.addEventListener('beforeunload', () => {
  port.disconnect();
});

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
