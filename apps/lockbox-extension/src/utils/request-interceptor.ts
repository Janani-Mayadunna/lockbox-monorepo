async function authInterceptor(request: Request): Promise<Request> {
  const token = await new Promise<string | null>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'tokenUpdated') {
        resolve(message.token || null);
      }
    });
  });
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
}

export async function authorizedFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  const request = new Request(url, options);
  const interceptedRequest = await authInterceptor(request);
  return fetch(interceptedRequest);
}

export function getVaultKey(): string {
  const storedVaultKey = localStorage.getItem('VK');
  const vaultKey = storedVaultKey!;
  return vaultKey;
}

export async function getUserSalt() {
  const salt = await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getCurrentUser') {
        resolve(message.currentUser.salt || null);
      }
    });
  });
  return salt;
}

export function getLoggedIn(): boolean {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loggedIn = isLoggedIn === 'true' ? true : false;
  return loggedIn;
}
