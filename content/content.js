// content/content.js
// Exports a function to extract article-like text from page and listens for messages

function getMeta(selector) {
  const el = document.querySelector(selector);
  return el ? (el.content || el.innerText || el.getAttribute('content')) : null;
}

function extractBySelectors(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      // gather paragraph text inside candidate
      const ps = Array.from(el.querySelectorAll('p'));
      if (ps.length >= 2) {
        return ps.map(p => p.innerText.trim()).filter(Boolean).join('\n\n');
      }
      // fallback: whole element text
      const text = el.innerText.trim();
      if (text.length > 200) return text;
    }
  }
  return null;
}

export function extractArticleText() {
  // 1) Title / meta
  const title = document.querySelector('h1')?.innerText?.trim()
    || getMeta("meta[property='og:title']") 
    || getMeta("meta[name='twitter:title']")
    || document.title;

  // 2) Try article/main selectors
  const candidates = [
    'article',
    'main',
    "[role='main']",
    '.post-content',
    '.article-content',
    '.entry-content',
    '#content',
    '.story-body'
  ];

  let body = extractBySelectors(candidates);

  // 3) fallback: take many <p>
  if (!body) {
    const ps = Array.from(document.querySelectorAll('p'));
    if (ps.length) {
      body = ps.map(p => p.innerText.trim()).filter(Boolean).join('\n\n');
    } else {
      body = document.body?.innerText?.trim() || '';
    }
  }

  // meta: author/date
  const author = (getMeta("meta[name='author']") || getMeta("meta[property='article:author']") || '').trim();
  const date = (getMeta("meta[property='article:published_time']") || getMeta("meta[name='date']") || '').trim();

  // sanitize: remove excessive whitespace
  const clean = text => text.replace(/\s{2,}/g, ' ').trim();

  const textCombined = clean([title, author ? `By ${author}` : '', date ? `Published: ${date}` : '', body].filter(Boolean).join('\n\n'));

  // Limit max length to e.g. 20000 chars to avoid huge payloads — we'll chunk later if needed
  const MAX_LEN = 20000;
  return textCombined.length > MAX_LEN ? textCombined.slice(0, MAX_LEN) : textCombined;
}

// Listener for messages from popup/background
chrome.runtime?.onMessage?.addListener((request, _sender, sendResponse) => {
  if (request?.action === 'EXTRACT_ARTICLE') {
    const content = extractArticleText();
    sendResponse({ success: true, content });
  }
  // return true to indicate async response if needed
  return true;
});
