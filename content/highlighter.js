// highlighter.js
// Destaca no DOM os trechos que mais influenciaram a análise

function highlightText(snippets) {
  snippets.forEach(snippet => {
    const regex = new RegExp(snippet, "gi");
    document.body.innerHTML = document.body.innerHTML.replace(
      regex,
      `<span class="fakecheck-highlight">${snippet}</span>`
    );
  });
}
