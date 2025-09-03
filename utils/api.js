// api.js
// Responsável pela comunicação entre a extensão e o backend de IA

const API_URL = "http://localhost:5000/api/analyze"; // ajustar futuramente

async function analyzeText(text) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text })
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
    return { status: "error", message: "API indisponível" };
  }
}
