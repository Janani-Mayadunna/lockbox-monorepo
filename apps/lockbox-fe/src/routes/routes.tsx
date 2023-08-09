import ROUTE from '../constants/route';
import Auth from '../pages/auth/login/Auth.tsx';
import Dashboard from '../pages/dashboard/Dashboard.tsx';
import { Route, Routes } from 'react-router-dom';
import Landing from '../pages/landing/Landing.tsx';
import PasswordAdd from '../pages/add-password/PasswordAdd.tsx';
import SignUp from '../pages/auth/sign-up/SignUp.tsx';
import PublicSharedVault from '../pages/public-shared/index.tsx';
import ReceivedPasswordsVault from '../pages/vault-received/index.tsx';

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
    path: ROUTE.PASSWORD_VAULT_ADD,
    component: PasswordAdd,
  },
  {
    path: ROUTE.PUBLIC_SHARED,
    component: PublicSharedVault,
  },
  {
    path: ROUTE.USERS_SHARED,
    component: ReceivedPasswordsVault,
  }
];

const Router = () => (
  <Routes>
    {routers.map((route) => (
      <Route element={<route.component />} path={route.path} key={route.path} />
    ))}
  </Routes>
);

export default Router;
