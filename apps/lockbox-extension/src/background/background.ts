chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
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
          action: 'getCurrentUser',
          currentUser: message.currentUser,
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
        console.log(
          'Vault Key retrieved from chrome.storage.local:',
          result.vaultKey
        );
        sendResponse({ vaultKey: result.vaultKey });

        chrome.runtime.sendMessage({
          action: 'updateVaultKey',
          vaultKey: result.vaultKey,
        });
      });
      break;
    case 'setAllVaults':
      chrome.storage.local.set({ userVaults: message.userVaults }, () => {
        console.log(
          'All User Vaults stored in chrome.storage.local:',
          message.userVaults
        );

        sendResponse({ message: 'All User Vaults stored successfully' });
        chrome.runtime.sendMessage({
          action: 'getAllVaults',
          userVaults: message.userVaults,
        });
      });
      break;
    default:
      break;
  }

  // Return true to indicate that the response will be sent asynchronously
  return true;
});

console.log('Background script loaded');
