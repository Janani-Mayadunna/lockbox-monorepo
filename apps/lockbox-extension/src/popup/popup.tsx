import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  }
]);

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
