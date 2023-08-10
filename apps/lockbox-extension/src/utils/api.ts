import { Row } from '../interfaces/vault.interfaces';
import { generateVaultKey } from './crypto';
import CustomCrypto from './custom-crypto';
import {
  authorizedFetch,
  getUserSalt,
  getVaultKey,
} from './request-interceptor';

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

export async function getAllUserVaults() {
  await authorizedFetch(`${backendUrl}/vault`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('just data', data);
      chrome.runtime.sendMessage(
        { action: 'setAllUserVaults', userVaults: data },
        (response) => {
          console.log('Background script response:', response);
        }
      );
    })
    .catch((err: any) => {
      throw new Error(err);
    });
}

async function decryptedPasswords(vaultData: any) {
  const vaultKey = await getVaultKey();

  const decryptedData = await Promise.all(
    vaultData.map(async (row: Row) => {
      const decryptedVaultPW = await CustomCrypto.decrypt(
        vaultKey,
        row.password
      );

      return {
        ...row,
        password: decryptedVaultPW,
      };
    })
  );
  return decryptedData;
}

export async function getDecryptedVaults() {
  await getAllUserVaults();

  const vaultData = await new Promise<string | null>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getAllUserVaults') {
        resolve(message.userVaults || null);
      }
    });
  });
  const decryptedData = await decryptedPasswords(vaultData);
  console.log('decrypted data', decryptedData);
  return decryptedData;
}

// get all vaults api

export async function getAllVaults() {
  await authorizedFetch('http://localhost:4000/api/vault', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      chrome.runtime.sendMessage(
        { action: 'setAllVaults', userVaults: data },
        (response) => {
          console.log('Background script response:', response);
        }
      );
    })
    .catch((err: any) => {
      // throw new Error(err);
      console.log('err', err);
    });
}

export async function getDecryptedAllVaults() {
  const vaultKey = await getVaultKey();

  const vaultData = await new Promise<string[] | null>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getAllVaults') {
        resolve(message.userVaults || null);
      }
    });
  });

  //map over vaultData and decrypt each password
  const decryptedData = await Promise.all(
    vaultData.map(async (row: any) => {
      const decryptedVaultPW = await CustomCrypto.decrypt(
        vaultKey,
        row.password
      );

      return {
        ...row,
        password: decryptedVaultPW,
      };
    })
  );

  return decryptedData;
}

export async function setFoldersToStorage() {
  //map over userFolders and get each folder
  await authorizedFetch(`http://localhost:4000/api/user-folder`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // set user folders in chrome storage local
      chrome.runtime.sendMessage(
        { action: 'setUserFolders', userFolders: data },
        (response) => {
          console.log('Background script response:', response);
        }
      );
    })
    .catch((err) => {
      throw new Error('Failed to get folders' + err.message);
    });
}

export async function getFolders() {
  chrome.runtime.sendMessage({ action: 'getUserFolders' }, (response) => {
    console.log('Background script response:', response);
  });

  const userFolders = await new Promise<string[] | []>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateUserFolders') {
        resolve(message.userFolders || []);
      }
    });
  });

  return userFolders;
}

export async function getByCategories(keyword: string[]) {
  //get all vaults
  chrome.runtime.sendMessage({ action: 'getAllVaults' })

  const userVaults = await new Promise<string[] | []>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateAllVaults') {
        resolve(message.userVaults || []);
      }
    });
  });

  console.log('all vaults for categories', userVaults)

  // get all vaults which have category = keyword
  const vaultsByCategories = userVaults.filter((vault: any) => {
    return vault.category === keyword
  })

  console.log('vaults by categories', vaultsByCategories)

  return vaultsByCategories;
}