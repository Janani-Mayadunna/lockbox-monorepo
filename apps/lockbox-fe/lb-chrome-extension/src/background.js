/* eslint-disable no-undef */

console.log('background.js loaded');

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ passwords: [] });
  console.log('onInstalled');
});
