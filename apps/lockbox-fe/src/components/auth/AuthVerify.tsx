import { Navigate, useLocation } from 'react-router-dom';
import useAuthentication from './hooks/use-authentication';

interface IAuthVerifyProps {
  children: any;
}

const AuthVerify = ({ children }: IAuthVerifyProps) => {
  const { isAuthenticated } = useAuthentication();
  const location = useLocation();

  const authenticated = isAuthenticated();

  return authenticated ? (
    children
  ) : (
    <Navigate to='/relog' replace state={{ path: location.pathname }} />
  );
};

export default AuthVerify;
