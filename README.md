# A Lei do Amor — PWA

Primeira versão do PWA inspirado na novela **A Lei do Amor**. A experiência foi criada com uma identidade própria: urbana, luminosa, prateada e sofisticada.

## Experiência

- Início com apresentação visual da novela
- Sinopse institucional da trama
- Área de resumos pronta para receber capítulos
- Área de trilha sonora pronta para músicas e playlists
- Elenco em cards responsivos
- Navegação por abas com suporte a teclado
- Layout mobile-first e adaptado para desktop
- Manifesto, ícones e service worker para instalação como PWA
- Cache básico para abertura offline

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Validações principais:

```bash
npm run lint
npm run build:vercel
```

## Publicação

O arquivo `vercel.json` configura o projeto para implantação como aplicação Next.js na Vercel.

---

Projeto não oficial inspirado na obra *A Lei do Amor*.
