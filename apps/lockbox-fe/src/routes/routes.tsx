import ROUTE from '../constants/route';
import Auth from '../pages/auth/Auth.tsx';
import Dashboard from '../pages/dashboard/Dashboard.tsx';
import { Route, Routes } from 'react-router-dom';
import Landing from '../pages/landing/Landing.tsx';
import PasswordVault from '../pages/dashboard/components/vault/PasswordVault.tsx';
import PasswordAdd from '../pages/add-password/PasswordAdd.tsx';
import SignUp from '../pages/auth/SignUp.tsx';
import SharedVault from '../pages/shared/index.tsx';

const routers = [
  {
    path: ROUTE.COMMON_LANDING,
    component: Landing,
  },
  {
    path: ROUTE.AUTH,
    component: Auth,
  },
  {
    path: ROUTE.SIGNUP,
    component: SignUp,
  },
  {
    path: ROUTE.DASHBOARD,
    component: Dashboard,
  },
  {
    path: ROUTE.PASSWORD_VAULT,
    component: PasswordVault,
  },
  {
    path: ROUTE.PASSWORD_VAULT_ADD,
    component: PasswordAdd,
  },
  {
    path: ROUTE.SHARED,
    component: SharedVault,
  },
];

const Router = () => (
  <Routes>
    {routers.map((route) => (
      <Route element={<route.component />} path={route.path} key={route.path} />
    ))}
  </Routes>
);

export default Router;
