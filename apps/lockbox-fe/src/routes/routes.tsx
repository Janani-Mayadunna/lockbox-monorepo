import ROUTE from '../constants/route';
import Auth from '../pages/auth/login/Auth.tsx';
import Dashboard from '../pages/dashboard/index.tsx';
import { Route, Routes } from 'react-router-dom';
import Landing from '../pages/landing/Landing.tsx';
import SignUp from '../pages/auth/sign-up/SignUp.tsx';
import PublicSharedVault from '../pages/public-shared/index.tsx';
import ReceivedPasswordsVault from '../pages/vault-received/index.tsx';
import AuthVerify from '../components/auth/AuthVerify.tsx';
import UserRelog from '../pages/relog/index.tsx';

const publicRoutes = [
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
    path: ROUTE.USERS_RELOG,
    component: UserRelog,
  },
];

const routers = [
  {
    path: ROUTE.DASHBOARD,
    component: Dashboard,
  },
  {
    path: ROUTE.PUBLIC_SHARED,
    component: PublicSharedVault,
  },
  {
    path: ROUTE.USERS_SHARED,
    component: ReceivedPasswordsVault,
  },
];

const Router = () => (
  <Routes>
    {publicRoutes.map((route) => (
      <Route element={<route.component />} path={route.path} key={route.path} />
    ))}
    {routers.map((route) => (
      <Route
        element={
          <AuthVerify>
            <route.component />
          </AuthVerify>
        }
        path={route.path}
        key={route.path}
      />
    ))}
  </Routes>
);

export default Router;
