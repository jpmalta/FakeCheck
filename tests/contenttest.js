// contenttest.js
// Captura o conteúdo principal da página (simplificado)

function extractArticleText() {
  const paragraphs = document.querySelectorAll("p");
  return Array.from(paragraphs).map(p => p.innerText).join(" ");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_text") {
    const text = extractArticleText();
    sendResponse({ content: text });
  }
});
