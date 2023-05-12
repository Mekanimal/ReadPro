chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['fontEnabled', 'bionicReadingEnabled'], (data) => {
    chrome.storage.sync.set({ 
      fontEnabled: data.fontEnabled || false, 
      bionicReadingEnabled: data.bionicReadingEnabled || false 
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFont') {
    chrome.storage.sync.get('fontEnabled', (data) => {
      const newState = !data.fontEnabled;
      chrome.storage.sync.set({ fontEnabled: newState });
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: 'toggleFont' });
        });
        sendResponse({ fontEnabled: newState });
      });
    });
  } else if (request.action === 'toggleBionicReading') {
    chrome.storage.sync.get('bionicReadingEnabled', (data) => {
      const newState = !data.bionicReadingEnabled;
      chrome.storage.sync.set({ bionicReadingEnabled: newState }, () => {
        chrome.tabs.query({ status: 'complete' }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleBionicReading' });
          });
          sendResponse({ bionicReadingEnabled: newState });
        });
      });
    });
  } else {
    sendResponse({});
  }
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get('bionicReadingEnabled', (data) => {
      if (data.bionicReadingEnabled) {
        chrome.tabs.sendMessage(tabId, { action: 'applyBionicReading' });
      }
    });
  }
});
