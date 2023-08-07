import { generateVaultKey } from './crypto';
import { authorizedFetch, getUserSalt } from './request-interceptor';
const backendUrl = 'http://localhost:4000/api';

export function userLogin(email: string, hashedPassword: string) {
  fetch(`${backendUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: hashedPassword,
    }),
  })
    .then((response) => {
      response.json().then((data) => {
        if (response.status === 201) {
          const token = data.access_token;

          /* Since chrome.storage.session type is not supported, I've sorted to emulate session storage 
          instead using local storage and adding listeners for browser.runtime.onStartup, 
          browser.runtime.onSuspend, browser.runtime.onInstalled that will clear 'session' storage data.*/
          //   chrome.storage.

          chrome.runtime.sendMessage({ action: 'login' }, (response) => {
            console.log('Background script response:', response);
          });

          chrome.runtime.sendMessage(
            { action: 'setToken', token: token },
            (response) => {
              console.log('Background script response:', response);
            }
          );

          getCurrentUser(email, hashedPassword);

          return token;
        } else {
          console.log('Failed to Login');
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getCurrentUser(email: string, hashedPassword: string) {
  await authorizedFetch(`${backendUrl}/auth/current-user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const currentUser = data.user;

      chrome.runtime.sendMessage(
        { action: 'setCurrentUser', currentUser: currentUser },
        (response) => {
          console.log('Background script response:', response);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });

  const salt = await getUserSalt();

  const vaultKey = generateVaultKey({
    hashedPassword: hashedPassword,
    email: email,
    salt: salt,
  });

  chrome.runtime.sendMessage(
    { action: 'setVaultKey', vaultKey: vaultKey },
    (response) => {
      console.log('Background script response:', response);
    }
  );
}
