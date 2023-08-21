import { useCallback } from 'react';
import jwt_decode from 'jwt-decode';

const useAuthentication = () => {
  const tokenString = sessionStorage.getItem('jwt-lockbox');
  const userToken = JSON.parse(tokenString!);
  const token = userToken?.access_token;

  const isAuthenticated = useCallback((): boolean => {
    if (token) {
      const user: { exp: number } = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return user.exp >= currentTime;
    }
    return false;
  }, [token]);

  return { isAuthenticated };
};

export default useAuthentication;
