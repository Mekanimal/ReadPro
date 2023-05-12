document.addEventListener('DOMContentLoaded', () => {
  const fontButton = document.querySelector('#toggleFont');
  const bionicButton = document.querySelector('#toggleBionicReading');

  if (fontButton && bionicButton) {
    chrome.storage.sync.get(['fontEnabled', 'bionicReadingEnabled'], (data) => {
      fontButton.textContent = data.fontEnabled ? 'Deactivate Font' : 'Activate Font';
      bionicButton.textContent = data.bionicReadingEnabled ? 'Deactivate Bionic Reading' : 'Activate Bionic Reading';

      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'setStates',
            fontEnabled: data.fontEnabled,
            bionicReadingEnabled: data.bionicReadingEnabled
          });
        }
      });
    });

    fontButton.addEventListener('click', () => {
      chrome.storage.sync.get('fontEnabled', (data) => {
        const newState = !data.fontEnabled;
        chrome.storage.sync.set({ fontEnabled: newState });

        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleFont', fontEnabled: newState });
          }
        });

        if (newState) {
          fontButton.textContent = 'Deactivate Font';
        } else {
          fontButton.textContent = 'Activate Font';
        }
      });
    });

    bionicButton.addEventListener('click', () => {
      chrome.storage.sync.get('bionicReadingEnabled', (data) => {
        const newState = !data.bionicReadingEnabled;
        chrome.storage.sync.set({ bionicReadingEnabled: newState });

        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleBionicReading', bionicReadingEnabled: newState });
          }
        });

        if (newState) {
          bionicButton.textContent = 'Deactivate Bionic Reading';
        } else {
          bionicButton.textContent = 'Activate Bionic Reading';
        }
      });
    });
  }
});
