# 📰 FakeCheck – Extensão para análise automática de notícias

[PT-BR]

**FakeCheck** é uma extensão de navegador que analisa automaticamente o conteúdo de notícias e artigos online, classificando-os como **provavelmente verdadeiros**, **falsos** ou **duvidosos**.  
O objetivo é ajudar o leitor a avaliar a **credibilidade** do conteúdo, destacando os trechos que mais influenciaram a análise.

*Obs:* Este é um projeto acadêmico, desenvolvido por estudantes de graduação da PUC CAMPINAS, no 6º período do curso de Sistemas De Informação.
João Pedro Malta, Gustavo Steluti

---

## 🚀 Funcionalidades Principais (MVP)  
- Captura de textos diretamente das páginas web.  
- Envio do conteúdo para análise em serviços externos (IA/API).  
- Destacar trechos suspeitos no DOM.  
- Interface popup para interação rápida com o usuário.  
- Histórico básico de análises.  
---

## ✨ Funcionalidades esperadas

- 🔍 **Análise automática** do texto de notícias em tempo real.  
- 🎯 **Classificação por nível de confiança**:  
  - ✅ Provavelmente verdadeiro  
  - ⚠️ Duvidoso  
  - ❌ Provavelmente falso  
- 🖍 **Destaque dos trechos-chave** que influenciaram a avaliação.  
- 📊 Exibição de **percentual de confiança**.  
- 🌐 Compatível com principais navegadores baseados em Chromium (Chrome, Edge, Opera) e Firefox.

## 🛠 Como funciona

1. A extensão captura o texto da página visitada.  
2. O texto é enviado para um **modelo de análise de credibilidade** (usando IA e verificação cruzada de fontes confiáveis).  
3. O resultado é processado e exibido em um **alerta no navegador**.  
4. Os trechos mais relevantes são destacados diretamente na página para que o usuário possa fazer sua própria avaliação.

> **Importante:** A ferramenta não substitui o julgamento crítico do leitor — ela fornece apenas um **apoio adicional**.

---

## 🚀 Instalação

### Chrome / Edge
1. Baixe o repositório ou clone:
   ```bash
   git clone https://github.com/jpmalta/fakecheck.git
   ```
2. Abra `chrome://extensions` no navegador.  
3. Ative o **Modo do desenvolvedor**.  
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.

### Firefox
1. Instale via `about:debugging` usando **Carregar Extensão Temporária**.  

---

## 📂 Estrutura do projeto

```
fakecheck/
│
├── assets/ # Recursos visuais (logos, imagens gerais)
│ └── logo.png
│
├── content/ # Scripts injetados nas páginas
│ ├── content.js # Captura e envio de textos da página
│ ├── highlighter.js # Destaca trechos analisados
│ └── injector.js # Orquestra injeção de scripts/estilos
│
├── background/ # Camada de processamento e eventos
│ └── background.js # Coordena requests, mensagens e análise
│
├── popup/ # Interface popup da extensão
│ ├── popup.html # Estrutura HTML
│ ├── popup.js # Lógica de interação do popup
│ └── popup.css # Estilos do popup
│
├── utils/ # Funções auxiliares / camada de domínio
│ ├── api.js # Comunicação com serviços externos / IA
│ ├── storage.js # Abstração para storage do navegador
│ ├── logger.js # Centralização de logs e erros
│ └── config.js # Constantes e parâmetros de configuração
│
├── tests/ # Testes automatizados
│ ├── content.test.js
│ ├── api.test.js
│ └── highlighter.test.js
│
├── icons/ # Ícones oficiais da extensão
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
│
├── docs/ # Documentação técnica
│ ├── README.md
│ ├── arquitetura.md
│ ├── requisitos.md
│ └── contribuicao.md
│
├── manifest.json # Manifesto da extensão
├── LICENSE
└── package.json # (opcional) se usar npm para lint/test/build
```

---

## 📡 Tecnologias utilizadas

- **JavaScript** (Extensões Web API)  
- **HTML5 / CSS3**  
- **Modelo de análise de texto com IA** (API externa ou modelo local)  
- **Verificação cruzada** com bases de dados confiáveis (opcional)

---

## 🤝 Contribuindo

1. Faça um **fork** do projeto.  
2. Crie uma nova branch:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m 'Minha nova feature'
   ```
4. Envie para o repositório:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request**.

---

## ⚠️ Aviso Legal

Este projeto é experimental, desenvolvido em ambiente universitário e **não garante 100% de precisão** nas análises.  
Sempre verifique as informações em múltiplas fontes confiáveis.

---

## 📜 Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial 4.0 International License**.  
Você pode usar, modificar e distribuir o conteúdo para fins não comerciais, desde que atribua crédito ao autor.  
Para uso comercial, entre em contato: [joaopedromalta1@gmail.com](mailto:joaopedromalta1@gmail.com)

🔗 [Leia a licença completa](http://creativecommons.org/licenses/by-nc/4.0/)
