function authInterceptor(request: Request): Request {
  const tokenString = localStorage.getItem('jwt-lockbox');
  const userToken = JSON.parse(tokenString!);
  const access_token = userToken.access_token;

  if (access_token) {
    request.headers.set('Authorization', `Bearer ${access_token}`);
  }
  return request;
}

export function authorizedFetch(
  url: string,
  options: RequestInit
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
