import React from 'react';
import ReactDom from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from './pages/login';
import AddPassword from './pages/add-password';
import Vault from './pages/vault';

const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/add',
    element: <AddPassword />,
  },
  {
    path: '/vault',
    element: <Vault />,
  }
]);

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
