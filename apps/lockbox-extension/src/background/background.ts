import { logOut } from '../utils/api';
import jwt_decode from 'jwt-decode';

let isPortConnected = false;
let popupOpen = true;

console.log('background script running');

// chrome.runtime.onStartup.addListener(() => {
//   chrome.alarms.clearAll();
//   chrome.alarms.create('tokenCheckAlarm', { periodInMinutes: 1 / 60 });
// });

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popupPort') {
    isPortConnected = true;

    port.onDisconnect.addListener(() => {
      isPortConnected = false;
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'popupOpened':
      popupOpen = true;
      console.log('popupOpen', popupOpen);

      break;
    case 'login':
      console.log('Received login action from popup');
      sendResponse({ message: 'Login action received' });
      break;
    case 'setToken':
      chrome.storage.local.set({ token: message.token }, () => {
        // console.log('Token stored in chrome.storage.local:', message.token);

        sendResponse({ message: 'Token stored successfully' });
        chrome.runtime.sendMessage({
          action: 'tokenUpdated',
          token: message.token,
        });
      });
      break;
    case 'getToken':
      chrome.storage.local.get(['token']).then((result) => {
        // console.log('Token retrieved from chrome.storage.local:', result.token);
        sendResponse({ token: result });

        chrome.runtime.sendMessage({
          action: 'tokenUpdated',
          token: result.token,
        });
      });
      break;
    case 'clearToken':
      chrome.storage.local.remove(['token'], () => {
        console.log('Token removed from chrome.storage.local');

        sendResponse({ message: 'Token removed successfully' });
      });
      break;
    case 'setCurrentUser':
      chrome.storage.local.set({ currentUser: message.currentUser }, () => {
        // console.log(
        //   'Current User stored in chrome.storage.local:',
        //   message.currentUser
        // );

        sendResponse({ message: 'Current User stored successfully' });
        chrome.runtime.sendMessage({
          action: 'updateCurrentUser',
          currentUser: message.currentUser,
        });
      });
      break;
    case 'getCurrentUser':
      chrome.storage.local.get(['currentUser'], (result) => {
        console.log(
          'Current User retrieved from chrome.storage.local:',
          result.currentUser
        );
        sendResponse({ currentUser: result.currentUser });

        chrome.runtime.sendMessage({
          action: 'updateCurrentUser',
          currentUser: result.currentUser,
        });
      });
      break;
    case 'setVaultKey':
      chrome.storage.local.set({ vaultKey: message.vaultKey }, () => {
        // console.log(
        //   'Vault Key stored in chrome.storage.local:',
        //   message.vaultKey
        // );

        sendResponse({ message: 'Vault Key stored successfully' });
        chrome.runtime.sendMessage({
          action: 'getVaultKey',
          vaultKey: message.vaultKey,
        });
      });
      break;
    case 'getVaultKey':
      chrome.storage.local.get(['vaultKey'], (result) => {
        // console.log(
        //   'Vault Key retrieved from chrome.storage.local:',
        //   result.vaultKey
        // );
        sendResponse({ vaultKey: result.vaultKey });

        chrome.runtime.sendMessage({
          action: 'updateVaultKey',
          vaultKey: result.vaultKey,
        });
      });
      break;
    case 'setAllVaults':
      chrome.storage.local.set({ userVaults: message.userVaults }, () => {
        // console.log(
        //   'All User Vaults stored in chrome.storage.local:',
        //   message.userVaults
        // );

        sendResponse({ message: 'All User Vaults stored successfully' });
        chrome.runtime.sendMessage({
          action: 'updateAllVaults',
          userVaults: message.userVaults,
        });
      });
      break;
    case 'getAllVaults':
      chrome.storage.local.get(['userVaults'], (result) => {
        console.log(
          'All User Vaults retrieved from chrome.storage.local:',
          result.userVaults
        );

        sendResponse({ userVaults: result.userVaults });
        chrome.runtime.sendMessage({
          action: 'updateAllVaults',
          userVaults: result.userVaults,
        });
      });
      break;
    case 'setUserFolders':
      chrome.storage.local.set({ userFolders: message.userFolders }, () => {
        // console.log(
        //   'All User Folders stored in chrome.storage.local:',
        //   message.userFolders
        // );

        sendResponse({ message: 'All User Folders stored successfully' });
        chrome.runtime.sendMessage({
          action: 'updateUserFolders',
          userFolders: message.userFolders,
        });
      });
      break;
    case 'getUserFolders':
      chrome.storage.local.get(['userFolders'], (result) => {
        // console.log(
        //   'All User Folders retrieved from chrome.storage.local:',
        //   result.userFolders
        // );

        sendResponse({ userFolders: result.userFolders });
        chrome.runtime.sendMessage({
          action: 'updateUserFolders',
          userFolders: result.userFolders,
        });
      });
      break;
    case 'getTabVaults':
      chrome.storage.local.get(['tabVaults'], (result) => {
        sendResponse({ tabVaults: result.tabVaults });
        chrome.runtime.sendMessage({
          action: 'updateTabVaults',
          tabVaults: result.tabVaults,
        });
      });
      break;
    case 'autoFill':
      const sendData = {
        type: 'autoFill',
        data: {
          username: message.username,
          password: message.password,
        },
      };

      console.log('data', sendData);

      // send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, sendData, (response) => {
          console.log('autofill', response);
        });
      });
      break;
    case 'routeChanged':
      console.log('routeChanged');
      sendResponse({ message: 'routeChanged' });
      chrome.runtime.sendMessage({
        action: 'checkTokenValidity',
      });
      break;
    // case 'tokenExpired':
    //   chrome.runtime.sendMessage({
    //     action: 'replaceToLogin',
    //   });
    //   break;
    default:
      break;
  }

  // Return true to indicate that the response will be sent asynchronously
  return true;
});



function getValueFromStorage(key, callback) {
  chrome.storage.local.get([key], (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback(undefined); // Or handle the error in some way
    } else {
      callback(result[key]);
    }
  });
}

/* ALARM */
chrome.alarms.create('tokenCheckAlarm', { periodInMinutes: 1 / 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  // console.log('popupOpen', popupOpen);
  if (alarm.name === 'tokenCheckAlarm') {
    getValueFromStorage('token', (token) => {
      if (token) {
        const user: { exp: number; iat: number } = jwt_decode(token);
        const expirationBuffer = ((user.exp - user.iat) / 5) * 1;
        const currentTime = Math.floor(Date.now() / 1000);

        const remainingTime = user.exp - currentTime;
        console.log('remainingTime', remainingTime);

        const isValid = remainingTime > expirationBuffer;
        console.log('isValid', isValid);

        if (!isValid && alarm.name === 'tokenCheckAlarm') {
          chrome.alarms.clearAll();
          //restart timer
          chrome.alarms.create('tokenCheckAlarm', { periodInMinutes: 1 / 60 });

          chrome.runtime.sendMessage(
            {
              action: 'replaceToLogin',
            },
            // due to the asynchronous nature of the messaging API, we need to handle the response
            // when the popup is closed, the receiving end does not exist anymore
            // therefore it throws an error saying receiving end doesnt exist
            // handling connection closing before response received from popup
            function (entry) {
              if (chrome.runtime.lastError) {
                console.warn(
                  'No worries, your session expired and you got logged out. Please, log in again'
                );
              } else {
                console.log('User logged out');
              }
            }
          );

          logOut();
        }
      }
    });
  }
});

function extractDomain(url) {
  url = url.replace(/^(https?:\/\/)?/, ''); // Remove "https://"
  url = url.replace(/^www\./, ''); // Remove "www."
  const parts = url.split('/'); // Split the URL at the first "/"
  const domain = parts[0]; // The first part after splitting is the domain

  return domain;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    if (tab.url?.startsWith('chrome://')) {
      console.log('chrome://');
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['contentScript.js'],
      });

      chrome.storage.local.get(['userVaults'], (result) => {
        const vaults = result?.userVaults;

        const tabVaults = vaults?.filter((vault: any) => {
          const extractedDomain = extractDomain(vault.link);
          return extractedDomain && tab.url.includes(extractedDomain);
        });

        chrome.storage.local.set({ tabVaults: tabVaults });
      });

      const sendData = {
        type: 'connectionEstablished',
        data: tab.url,
      };

      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, sendData, (response) => {
          console.log('tab updated', response);
        });
      }, 2000);
    }
  }
});

/*
  Using tabs onActivated (doesn't work wwhen navigating from scratch. 
  only listnes when an already exisitng tab gets activated) 
   * code below is for reference for future use * 
*/

// chrome.tabs.onActivated.addListener((tab) => {
//   chrome.tabs.get(tab.tabId, (currentTabData) => {
//     console.log('currentTabData', currentTabData);

//     if (currentTabData.url?.startsWith('chrome://')) {
//       console.log('chrome://');
//     } else {
//       chrome.scripting.executeScript({
//         target: { tabId: currentTabData.id },
//         files: ['contentScript.js'],
//       });

//       chrome.storage.local.get(['userVaults'], (result) => {
//         const vaults = result.userVaults;
//         const tabVaults = vaults.filter(
//           (vault: { link: string }) =>
//             vault.link && currentTabData.url.includes(vault.link)
//         );
//         console.log('vault', tabVaults);

//         // save the current vaults in chrome storage local
//         chrome.storage.local.set({ tabVaults: tabVaults });
//       });

//       const sendData = {
//         type: 'connectionEstablished',
//         data: currentTabData.url,
//       };

//       setTimeout(() => {
//         chrome.tabs.sendMessage(tab.tabId, sendData, (response) => {
//           console.log('tab activated', response);
//         });
//       }, 2000);
//     }
//   });
// });

/* BUG - Handle the runtime error when listening end doesnt exist*/
