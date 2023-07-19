import ROUTE from '../constants/route';
import Auth from '../pages/auth/Auth.tsx';
import Dashboard from '../pages/dashboard/Dashboard.tsx';
import { Route, Routes } from 'react-router-dom';
import Landing from '../pages/landing/Landing.tsx';
import PasswordVault from '../pages/pw-vault/PasswordVault.tsx';
import PasswordAdd from '../pages/pw-vault-add/PasswordAdd.tsx';

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
];
// useEffect(() => {
//   fetch('/api').then((res) => res.text());
// }, []);

const Router = () => (
  <Routes>
    {routers.map((route) => (
      <Route element={<route.component />} path={route.path} key={route.path} />
    ))}
  </Routes>
);

export default Router;
