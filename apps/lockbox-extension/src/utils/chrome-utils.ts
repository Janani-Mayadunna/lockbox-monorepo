// Function to get data from chrome.storage.local
export function chromeStorageGet(key, callback) {
    chrome.storage.local.get([key], (result) => {
      callback(result[key]);
    });
  }
  