export function setToken(token: string) {
  chrome.storage.local.set({token: token}).then(() => {
    console.log('Token saved', token);
  });
}

export function getTokenAccess() {
  chrome.storage.local.get('token', (result) => {
    console.log('Token retrieved', result.token.access_token);
    return result.token.access_token;
  });
}

// export function getAccessToken(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get('token', (result) => {
//       const token = result.token.access_token as string;
//       if (chrome.runtime.lastError) {
//         console.log('Error getting token', chrome.runtime.lastError);
//         return reject(chrome.runtime.lastError);
//       }
//       console.log('Token retrieved', token);
//       resolve(token);
//     });
//   });
// }

export function getCurrentUserId(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('token', (result) => {
      if (chrome.runtime.lastError) {
        console.log('Error getting token', chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }
      console.log('Token retrieved', result.token.user_id);
      resolve(result.token.user_id);
    });
  });
}
