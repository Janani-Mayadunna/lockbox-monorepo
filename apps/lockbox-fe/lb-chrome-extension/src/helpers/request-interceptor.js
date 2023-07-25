function authInterceptor(request) {
  const tokenString = localStorage.getItem('jwt-lockbox');
  const userToken = JSON.parse(tokenString);
  const access_token = userToken.access_token;

  if (access_token) {
    request.headers.set('Authorization', `Bearer ${access_token}`);
  }
  return request;
}

export function authorizedFetch(
  url,
  options,
) {
  const request = new Request(url, options);
  const interceptedRequest = authInterceptor(request);
  return fetch(interceptedRequest);
}

export function getVaultKey() {
  const storedVaultKey = localStorage.getItem('VK');
  const vaultKey = storedVaultKey;
  return vaultKey;
}

export function getUserSalt() {
  const storedVaultKey = localStorage.getItem('current-user');
  const userData = JSON.parse(storedVaultKey);
  const salt = userData.salt;
  return salt;
}

export function getLoggedIn() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loggedIn = isLoggedIn === 'true' ? true : false;
  return loggedIn;
}
