function authInterceptor(request: Request): Request {
  let tokenString = '' as string | null;
  tokenString = localStorage.getItem('jwt-lockbox');
  const userToken = JSON.parse(tokenString!);
  const access_token: string = userToken.access_token;

  if (access_token) {
    request.headers.set('Authorization', `Bearer ${access_token}`);
  } else {
    request.headers.delete('Authorization');
  }
  return request;
}

export function authorizedFetch(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const request = new Request(url, options);
  const interceptedRequest = authInterceptor(request);
  return fetch(interceptedRequest);
}

export function getVaultKey(): string {
  const storedVaultKey = localStorage.getItem('VK');
  const vaultKey = storedVaultKey!;
  return vaultKey;
}

export function getUserSalt(): string {
  const storedVaultKey = localStorage.getItem('current-user');
  const userData = JSON.parse(storedVaultKey!);
  const salt = userData.salt;
  return salt;
}

export function getLoggedIn(): boolean {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loggedIn = isLoggedIn === 'true' ? true : false;
  return loggedIn;
}
