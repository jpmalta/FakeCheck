# 📰 FakeCheck – Extensão para análise automática de notícias

**FakeCheck** é uma extensão de navegador que analisa automaticamente o conteúdo de notícias e artigos online, classificando-os como **provavelmente verdadeiros**, **falsos** ou **duvidosos**.  
O objetivo é ajudar o leitor a avaliar a **credibilidade** do conteúdo, destacando os trechos que mais influenciaram a análise.

*Obs:* Este projeto foi desenvolvido por estudantes de graduação da PUC CAMPINAS, no 6º período do curso de Sistemas De Informação.
João Pedro Malta, Gustavo Steluti, José Guilherme, Gabriel Duarte, Victor Oliveira

---

## ✨ Funcionalidades

- 🔍 **Análise automática** do texto de notícias em tempo real.  
- 🎯 **Classificação por nível de confiança**:  
  - ✅ Provavelmente verdadeiro  
  - ⚠️ Duvidoso  
  - ❌ Provavelmente falso  
- 🖍 **Destaque dos trechos-chave** que influenciaram a avaliação.  
- 📊 Exibição de **percentual de confiança**.  
- 🌐 Compatível com principais navegadores baseados em Chromium (Chrome, Edge, Opera) e Firefox.

---

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
├── manifest.json        # Configuração da extensão
├── background.js        # Lógica de comunicação e processamento
├── content.js           # Captura de conteúdo da página
├── popup.html           # Interface do popup
├── popup.js             # Script do popup
├── styles.css           # Estilo da interface
└── README.md            # Documentação
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

Este projeto é experimental e **não garante 100% de precisão** nas análises.  
Sempre verifique as informações em múltiplas fontes confiáveis.

---

## 📜 Licença

Distribuído sob a licença Creative Commons BY-NC. Veja `LICENSE` para mais detalhes.
