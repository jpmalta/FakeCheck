// keep last request so we can retry
let lastRequest = null;

function showSpinner(visible) {
  const s = document.getElementById('spinner');
  if (!s) return;
  s.hidden = !visible;
  s.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function clearResult() {
  const msg = document.getElementById('message');
  const details = document.getElementById('details');
  const retry = document.getElementById('retryBtn');
  if (msg) { msg.textContent = ''; msg.className = 'fc-message'; }
  if (details) { details.textContent = ''; details.hidden = true; }
  if (retry) { retry.hidden = true; retry.disabled = false; }
}

function showRetryButton(visible) {
  const retry = document.getElementById('retryBtn');
  if (!retry) return;
  retry.hidden = !visible;
}

function setPending(p) {
  showSpinner(p);
  const btn = document.getElementById('check');
  const btnText = document.getElementById('checkText');
  const retry = document.getElementById('retryBtn');
  if (btn) btn.disabled = p;
  if (btnText) btnText.disabled = p;
  if (retry) retry.disabled = p;
}

function setResult(message, options = {}) {
  // options: { type: 'error'|'info'|'success', details: object|string, showRetry: bool }
  clearResult();
  const msg = document.getElementById('message');
  const details = document.getElementById('details');
  if (!msg) return;
  const type = options.type || (options.isError ? 'error' : 'info');
  msg.textContent = message;
  msg.classList.add(type === 'error' ? 'fc-error' : type === 'success' ? 'fc-success' : 'fc-info');
  if (options.details) {
    details.textContent = typeof options.details === 'string' ? options.details : JSON.stringify(options.details, null, 2);
    details.hidden = false;
  }
  if (options.showRetry) showRetryButton(true);
}

function sendAnalyzeTab(tabId) {
  lastRequest = { type: 'TAB', tabId };
  setPending(true);
  setResult('Extraindo texto da página...', { type: 'info' });
  chrome.runtime.sendMessage({ action: 'ANALYZE_CURRENT_TAB', tabId }, (resp) => {
    setPending(false);
    if (!resp) return setResult('Sem resposta do background.', { type: 'error', showRetry: true });
    if (!resp.success) return setResult('Erro ao analisar página: ' + (resp.error || 'unknown'), { type: 'error', details: resp.detail || null, showRetry: true });
    setResult('Análise recebida', { type: 'success', details: resp.result });
  });
}

function sendAnalyzeText(text, source) {
  lastRequest = { type: 'TEXT', text, source };
  setPending(true);
  setResult('Enviando texto para verificação...', { type: 'info' });
  chrome.runtime.sendMessage({ action: 'ANALYZE_TEXT', text, source }, (resp) => {
    setPending(false);
    if (!resp) return setResult('Sem resposta do background.', { type: 'error', showRetry: true });
    if (!resp.success) return setResult('Erro ao analisar texto: ' + (resp.error || 'unknown'), { type: 'error', details: resp.detail || null, showRetry: true });
    setResult('Análise recebida', { type: 'success', details: resp.result });
  });
}

async function analyzeCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return setResult('Não foi possível identificar a aba ativa.', { type: 'error' });
    sendAnalyzeTab(tab.id);
  } catch (err) {
    setPending(false);
    setResult('Erro ao pedir extração: ' + err.message, { type: 'error', showRetry: false });
  }
}

function analyzeTextFromPopup() {
  const text = document.getElementById('userText').value.trim();
  const source = document.getElementById('sourceUrl').value.trim();
  if (!text) return setResult('Por favor insira o texto que deseja verificar.', { type: 'error' });
  sendAnalyzeText(text, source);
}

function retryLast() {
  if (!lastRequest) return setResult('Nada para reexecutar.', { type: 'error' });
  if (lastRequest.type === 'TEXT') {
    sendAnalyzeText(lastRequest.text, lastRequest.source);
  } else if (lastRequest.type === 'TAB') {
    sendAnalyzeTab(lastRequest.tabId);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('check');
  const btnText = document.getElementById('checkText');
  const retry = document.getElementById('retryBtn');
  btn?.addEventListener('click', analyzeCurrentTab);
  btnText?.addEventListener('click', analyzeTextFromPopup);
  retry?.addEventListener('click', retryLast);
});
