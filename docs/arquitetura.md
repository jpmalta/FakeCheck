# Arquitetura do Projeto FakeCheck AI

## Visão Geral
O projeto **FakeCheck AI** é uma extensão de navegador que analisa notícias em tempo real, avaliando sua confiabilidade e destacando trechos que influenciaram a análise.  
O objetivo é fornecer ao usuário uma ferramenta simples, rápida e transparente para verificar a credibilidade de conteúdos online.

## Camadas da Arquitetura

### 1. **Camada de Apresentação (Frontend da Extensão)**
- **popup.html / popup.js / styles.css**: Interface com o usuário, onde são exibidos os resultados da análise.
- **content.js (contenttest.js)**: Script injetado na página para capturar textos e interagir com o DOM.
- **highlighter.js**: Responsável por destacar no texto os trechos que influenciaram a decisão da IA.

### 2. **Camada de Comunicação**
- **api.js**: Faz a ponte entre a extensão e a API de Machine Learning.
- Responsável por enviar o texto coletado e receber a resposta da análise.

### 3. **Camada de Serviço (Backend/API de IA)**
- Inicialmente simulada por uma API mock (para MVP).
- Posteriormente implementada em **Python (Flask/FastAPI)** com modelo treinado em ML/NLP.
- Responsável por:
  - Pré-processar textos (limpeza, tokenização, remoção de stopwords).
  - Rodar o modelo de classificação (fake news vs confiável).
  - Retornar resultados com nível de confiança e justificativas.

### 4. **Camada de Dados**
- Dataset de notícias rotuladas (ex.: FakeNewsNet, LIAR dataset).
- Utilizado para treinar e validar o modelo de IA.
- Banco de dados pode ser adicionado futuramente para armazenar logs e estatísticas de uso.

---

## Fluxo de Dados
1. Usuário abre uma notícia → `contenttest.js` captura o texto.
2. O texto é enviado via `api.js` para o backend.
3. A API processa e retorna:
   - Classificação (`verdadeira`, `falsa`, `duvidosa`).
   - Nível de confiança (ex.: 87%).
   - Trechos relevantes.
4. O resultado aparece no `popup.html` e trechos destacados via `highlighter.js`.

---

## Decisões de Arquitetura
- **Extensibilidade**: a arquitetura separa claramente as responsabilidades (UI, comunicação, ML).
- **Testabilidade**: API isolada facilita testes de integração.
- **Evolutividade**: é possível trocar o modelo de IA sem alterar a extensão.
- **Documentação**: todos os componentes terão README próprios no futuro.

---

## Próximos Passos
- Finalizar API mock em Node/Python para testes.
- Conectar extensão com API real.
- Versionar modelos de ML.
- Definir estratégia de logs e monitoramento.
