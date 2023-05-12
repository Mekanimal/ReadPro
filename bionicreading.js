function initializePage() {
  chrome.storage.sync.get(['fontEnabled', 'bionicReadingEnabled'], (data) => {
    if (data.fontEnabled) {
      document.documentElement.classList.add('opendyslexic');
    } else {
      document.documentElement.classList.remove('opendyslexic');
    }

    if (data.bionicReadingEnabled) {
      document.documentElement.classList.add('bionic-reading');
      window.onload = applyBionicReading;
    } else {
      document.documentElement.classList.remove('bionic-reading');
    }
  });
}

function bionicReading(text) {
  return text.replace(
    /\b(\w)(\w*?)(\w?)\b/g,
    '<span class="bionic-first">$1</span><span class="bionic-middle">$2</span><span class="bionic-last">$3</span>'
  );
}

function applyBionicReading() {
  const textNodes = document.evaluate('//text()[normalize-space(.) != ""]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const textNode = textNodes.snapshotItem(i);
    const parent = textNode.parentNode;
    const newText = bionicReading(textNode.nodeValue);
    const tempElement = document.createElement('span');
    tempElement.innerHTML = newText;
    parent.replaceChild(tempElement, textNode);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFont') {
    if (document.documentElement.classList.contains('opendyslexic')) {
      document.documentElement.classList.remove('opendyslexic');
    } else {
      document.documentElement.classList.add('opendyslexic');
    }
  } 
  else if (request.action === 'toggleBionicReading') {
    if (document.documentElement.classList.contains('bionic-reading')) {
      document.documentElement.classList.remove('bionic-reading');
    } else {
      document.documentElement.classList.add('bionic-reading');
      applyBionicReading();
    }
  }
});


initializePage();