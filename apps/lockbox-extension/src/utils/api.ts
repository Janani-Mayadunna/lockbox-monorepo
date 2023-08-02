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
        console.log('response', response);
        if (response.status === 201) {
          console.log('data', data);
          const token = data.access_token;

          localStorage.setItem('jwt-lockbox', JSON.stringify(data));
          localStorage.setItem('isLoggedIn', JSON.stringify(true));

          /* Since chrome.storage.session type is not supported, I've sorted to emulate session storage 
          instead using local storage and adding listeners for browser.runtime.onStartup, 
          browser.runtime.onSuspend, browser.runtime.onInstalled that will clear 'session' storage data.*/
          //   chrome.storage.

          console.log('Successfully Logged In!');
          console.log(data);

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

export function getCurrentUser(email: string, hashedPassword: string) {
  authorizedFetch(`${backendUrl}/auth/current-user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
        console.log('data', data);
      localStorage.setItem('current-user', JSON.stringify(data.user));
      //   navigate('/dashboard');
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    const salt = getUserSalt();

    const vaultKey = generateVaultKey({
      hashedPassword: hashedPassword,
      email: email,
      salt: salt,
    });

    localStorage.setItem('VK', vaultKey);
  }, 1000);
}
