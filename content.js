async function extractTextFromPage() {
  let paragraphs = Array.from(document.querySelectorAll("p"));
  let text = paragraphs.map(p => p.innerText).join(" ");
  return text;
}

async function analyzeArticle() {
  let text = await extractTextFromPage();

  let response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article: text })
  });

  let result = await response.json();

  // Exibir alerta visual na página
  let banner = document.createElement("div");
  banner.innerText = `🔎 FakeCheck: ${result.label} (Confiança: ${result.confidence}%)`;
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "10px";
  banner.style.backgroundColor = result.label === "FALSO" ? "red" : "green";
  banner.style.color = "white";
  banner.style.fontWeight = "bold";
  document.body.prepend(banner);
}

analyzeArticle();
