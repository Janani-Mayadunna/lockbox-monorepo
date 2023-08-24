import { ICreateVault } from '../interfaces/vault.interfaces';
import { generateVaultKey } from './crypto';
import CustomCrypto from './custom-crypto';
import {
  authorizedFetch,
  getUserSalt,
  getVaultKey,
} from './request-interceptor';

// export const backendUrl = 'http://localhost:4000/api';
export const backendUrl = 'https://surge-lockbox-prod.up.railway.app/api';

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

          chrome.runtime.sendMessage({ action: 'login' }, (response) => {
            // console.log('Background script response:', response);
          });

          chrome.runtime.sendMessage(
            { action: 'setToken', token: token },
            (response) => {
              // console.log('Background script response:', response);
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
          // console.log('Background script response:', response);
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
      // console.log('Background script response:', response);
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
          // console.log('Background script response:', response);
        }
      );
    })
    .catch((err: any) => {
      throw new Error(err);
    });
}

// get all vaults api
export async function getAllVaults() {
  await authorizedFetch(`${backendUrl}/vault`, {
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
          // console.log('Background script response:', response);
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
  let decryptedNote = '';

  chrome.runtime.sendMessage({ action: 'getAllVaults' }, (response) => {
    // console.log('Background script response:', response);
  });

  const vaultData = await new Promise<string[] | []>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateAllVaults') {
        resolve(message.userVaults || null);
      }
    });
  });

  //map over vaultData and decrypt each password
  const decryptedData = await Promise.all(
    vaultData?.map(async (row: any) => {
      const decryptedVaultPW = await CustomCrypto.decrypt(
        vaultKey,
        row.password
      );

      const decryptedVaultUsername = await CustomCrypto.decrypt(
        vaultKey,
        row.username
      );

      if (row.note) {
        decryptedNote = await CustomCrypto.decrypt(vaultKey, row.note);
      }

      return {
        ...row,
        password: decryptedVaultPW,
        username: decryptedVaultUsername,
        note: decryptedNote,
      };
    })
  );

  return decryptedData;
}

export async function setFoldersToStorage() {
  //map over userFolders and get each folder
  await authorizedFetch(`${backendUrl}/user-folder`, {
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
          // console.log('Background script response:', response);
        }
      );
    })
    .catch((err) => {
      throw new Error('Failed to get folders' + err.message);
    });
}

export async function getFolders() {
  chrome.runtime.sendMessage({ action: 'getUserFolders' }, (response) => {
    // console.log('Background script response:', response);
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
  chrome.runtime.sendMessage({ action: 'getAllVaults' });

  const userVaults = await new Promise<string[] | []>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateAllVaults') {
        resolve(message.userVaults || []);
      }
    });
  });

  // get all vaults which have category = keyword
  const vaultsByCategories = userVaults.filter((vault: any) => {
    return vault.category === keyword;
  });

  return vaultsByCategories;
}

async function getTabVaultsFromStorage() {
  chrome.runtime.sendMessage({ action: 'getTabVaults' });

  const tabVaults = await new Promise<string[] | []>((resolve) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateTabVaults') {
        resolve(message.tabVaults || []);
      }
    });
  });

  return tabVaults;
}

export async function decryptTabVaults() {
  const vaultKey = await getVaultKey();

  const tabVaults = await getTabVaultsFromStorage();

  const decryptedData = await Promise.all(
    tabVaults?.map(async (row: any) => {
      const decryptedVaultPW = await CustomCrypto.decrypt(
        vaultKey,
        row.password
      );

      const decryptedVaultUsername = await CustomCrypto.decrypt(
        vaultKey,
        row.username
      );

      return {
        ...row,
        password: decryptedVaultPW,
        username: decryptedVaultUsername,
      };
    })
  );

  return decryptedData;
}

/* Create vault */
export async function createVault(newVault: ICreateVault): Promise<boolean> {
  const vaultKey = await getVaultKey();
  let encryptedVaultNote = '';
  let encryptedVaultUsername = '';
  let encryptedVaultPW = '';
  let success = false;

  if (newVault.password !== '') {
    encryptedVaultPW = await CustomCrypto.encrypt(vaultKey, newVault.password);
  }

  if (newVault.username !== '') {
    encryptedVaultUsername = await CustomCrypto.encrypt(
      vaultKey,
      newVault.username
    );
  }

  if (newVault.note !== '') {
    encryptedVaultNote = await CustomCrypto.encrypt(vaultKey, newVault.note);
  } else {
    encryptedVaultNote = '';
  }

  const response = await authorizedFetch(`${backendUrl}/vault`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...newVault,
      password: encryptedVaultPW,
      username: encryptedVaultUsername,
      note: encryptedVaultNote,
    }),
  });

  if (response.status === 201) {
    success = true;
  }

  return success;
}

export const logOut = async () => {
  await chrome.storage.local.clear();
};
