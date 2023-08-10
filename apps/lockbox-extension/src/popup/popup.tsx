import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from '../views/login/Login';
import Dashboard from '../views/dashboard/Dashboard';
import Landing from '../views/landing/Landing';
import VaultsFiltered from '../views/vaults/VaultsFiltered';
import VaultsUpdate from '../views/vaults/vaults-update/VaultsUpdate';

const router = createHashRouter([
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/',
    // path: '/test',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/vaults/filtered',
    element: <VaultsFiltered />,
  },
  {
    path: '/vaults/update',
    // path: '/',
    element: <VaultsUpdate />,
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
