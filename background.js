chrome.runtime.onInstalled.addListener(() => {
  console.log("FakeCheck AI instalado!");
});

// import helper API module which exposes FakeCheckApi.analyzeText
importScripts('utils/api.js'); // provides self.FakeCheckApi

const API_TIMEOUT_MS = 12000;

// helper to send a message to a tab's content script to extract text
function requestPageContent(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: 'EXTRACT_ARTICLE' }, (resp) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      if (!resp || !resp.success) return reject(new Error('No content extracted'));
      resolve(resp.content);
    });
  });
}

function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('API_TIMEOUT')), timeout);
    fetch(url, options)
      .then(resp => { clearTimeout(timer); resolve(resp); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
}

// main handler invoked by popup via message
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req?.action === 'ANALYZE_CURRENT_TAB') {
    (async () => {
      try {
        const tabId = req.tabId || sender.tab?.id;
        if (!tabId) throw new Error('TabId not provided');

        // 1) extract content from page
        const article = await requestPageContent(tabId);

        // 2) optional: chunking if > 10k, we'll send just the first part for MVP
        const maxSend = 15000;
        const toSend = article.length > maxSend ? article.slice(0, maxSend) : article;

        // 3) call API via centralized helper
        const apiBase = await getApiBaseUrlFromStorage(); // implement below
        const apiRes = await (self.FakeCheckApi?.analyzeText?.(toSend, '', { baseUrl: apiBase, endpoint: '/predict', timeout: API_TIMEOUT_MS, retries: 1 })
          || Promise.reject(new Error('NO_API_IMPL')));

        if (!apiRes || apiRes.ok === false) {
          // include structured details for richer error reporting
          sendResponse({ success: false, error: 'API_ERROR', detail: apiRes || { error: 'no response' } });
          return;
        }
        sendResponse({ success: true, result: apiRes.json, original_length: article.length });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();

    // indicate that we'll respond asynchronously
    return true;
  }

  if (req?.action === 'ANALYZE_TEXT') {
    (async () => {
      try {
        const text = req.text || '';
        const source = req.source || '';
        if (!text) {
          sendResponse({ success: false, error: 'NO_TEXT_PROVIDED' });
          return;
        }

        const apiBase = await getApiBaseUrlFromStorage();
        const apiRes = await (self.FakeCheckApi?.analyzeText?.(text, source || '', { baseUrl: apiBase, endpoint: '/predict', timeout: API_TIMEOUT_MS, retries: 1 })
          || Promise.reject(new Error('NO_API_IMPL')));

        if (!apiRes || apiRes.ok === false) {
          sendResponse({ success: false, error: 'API_ERROR', detail: apiRes || { error: 'no response' } });
          return;
        }
        sendResponse({ success: true, result: apiRes.json });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});

// read API URL from chrome.storage (fallback to localhost)
function getApiBaseUrlFromStorage() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(['API_BASE_URL'], (res) => {
        resolve(res?.API_BASE_URL || 'http://127.0.0.1:8000');
      });
    } catch (e) {
      resolve('http://127.0.0.1:8000');
    }
  });
}
