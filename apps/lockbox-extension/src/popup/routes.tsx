import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../views/dashboard/Dashboard';
import VaultsFiltered from '../views/vaults/VaultsFiltered';
import VaultsUpdate from '../views/vaults/vaults-update/VaultsUpdate';
import Login from '../views/login/Login';

const router = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/vaults/filtered',
    component: VaultsFiltered,
  },
  {
    path: '/vaults/update',
    component: VaultsUpdate,
  },
];

const Router = () => {
  return (
    <Routes>
      {router.map((route) => (
        <Route
          element={<route.component />}
          path={route.path}
          key={route.path}
        />
      ))}
    </Routes>
  );
};

export default Router;
