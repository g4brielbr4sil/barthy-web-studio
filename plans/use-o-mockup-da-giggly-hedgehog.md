# Plano — Landing Page Barthy Web Studio

## Contexto

O projeto está vazio (`src/app/App.tsx` apenas com container centralizado, nenhum componente customizado em `src/app/components/`). Existe um brief completo em `src/imports/pasted_text/barthy-landing-page.md` descrevendo 12 seções, paleta oficial, copy em português, regras de marca, e três componentes especiais (Plasma, CardSwap, Pricing).

O usuário fixou a direção visual:
- **Imagem 1 (`Xs0gU__1___3_.jpg`)** = prancha de identidade visual oficial (paleta, logo horizontal, monograma BWS, capa de proposta). Fonte de verdade da marca.
- **Imagem 2 (`image.png`)** = mockup de referência principal do site: hero escuro, navy profundo, ondas/elementos fluidos em azul gelo no canto direito, tipografia serifada generosa para o título, header limpo com nav e CTA Terra Orange, monograma BWS pequeno como selo no canto inferior direito. **Toda a linguagem visual do site segue esse mockup**: refinada, fluida, premium, escura.
- Demais JPGs (I9wkN, NE4Bd, 9Wb0M, Zeh9p, tBlpa) = referências auxiliares de atmosfera.

Objetivo: entregar a landing institucional completa, responsiva, modo escuro como padrão + modo claro, fiel ao mockup e à identidade.

## Arquitetura

Tudo composto em `src/app/App.tsx` importando seções de `src/app/components/`. Dados (serviços, pacotes, projetos, cases) em `src/app/data/` como arrays tipados, para facilitar edição.

### Componentes a criar (`src/app/components/`)

- `Header.tsx` — logo horizontal à esquerda, nav (Início, Serviços, Pacotes, Portfólio, Como funciona, Contato), `ThemeToggle`, CTA "Solicitar orçamento" em Terra Orange. Sticky com backdrop blur, borda sutil inferior.
- `ThemeToggle.tsx` — toggle sol/lua animado com Motion, discreto. Persiste em `localStorage`, aplica classe `dark` no `<html>`.
- `Hero.tsx` — replica o mockup: fundo navy profundo, `PlasmaBackground` em baixa opacidade, "ondas" fluidas em azul gelo via SVG decorativo à direita, título em serif display (Inter Bold + tracking apertado conforme mockup), subtítulo, 2 CTAs (Solicitar orçamento / Ver serviços), monograma BWS pequeno como selo no canto.
- `WhatWeDo.tsx` — grid 3×2 com 6 cards de serviço (ícones lucide-react, bordas sutis em ice blue).
- `DigitalServices.tsx` — grid 4×2 com 8 cards.
- `ITSupport.tsx` — grid 4×2 com 8 cards.
- `Pricing.tsx` — Pricing Plans adaptado (sem toggle mensal/anual). 3 planos, "Portfólio Profissional" destacado (borda/glow Terra Orange, badge "Mais escolhido"). Preços em Terra Orange. CTAs Terra Orange.
- `HowItWorks.tsx` — timeline horizontal/grid de 4 etapas (Diagnóstico, Proposta, Produção, Entrega) com numeração grande em ice blue.
- `Projects.tsx` — seção "Experiências e projetos" com `CardSwap` (4 cards abstratos: Levens, PNQC, Hermes, GitHub). Texto à esquerda, cards à direita.
- `Cases.tsx` — "Modelos demonstrativos", 3 cards com badge "modelo demonstrativo".
- `QuoteForm.tsx` — formulário visual (Nome, WhatsApp, Tipo de serviço, Mensagem) + botão "Enviar solicitação" + botão alternativo "Falar pelo WhatsApp" (link `#whatsapp`, **sem verde**, usa estilo da marca).
- `FinalCTA.tsx` — Plasma sutil, título grande, botão "Solicitar orçamento pelo WhatsApp".
- `Footer.tsx` — logo, slogan, email, descrição, ícones Instagram/LinkedIn/GitHub (placeholders).
- `BarthyLogo.tsx` + `BarthyMonogram.tsx` — SVGs inline da marca (criados a partir da prancha de identidade, sem dependência de assets externos).
- `PlasmaBackground.tsx` — adaptado de `src/imports/pasted_text/plasma-component.tsx`. Requer `ogl`.
- `CardSwap.tsx` — adaptado de `src/imports/pasted_text/card-swap-component.tsx`. Requer `gsap`.
- `SectionHeading.tsx` — primitivo reutilizável (eyebrow + título + descrição) para padronizar tipografia das seções.

### Dados (`src/app/data/`)
- `services.ts`, `itSupport.ts`, `packages.ts`, `projects.ts`, `cases.ts` — arrays tipados consumidos pelas seções.

### Estilo
- `src/styles/theme.css` — adicionar tokens CSS da paleta oficial (`--color-deep-navy`, `--color-midnight`, `--color-royal`, `--color-ice-blue`, `--color-soft-ice`, `--color-ice-white`, `--color-terra`) e variantes `.dark` / claro. Não tocar Tailwind preflight além disso.
- Fonte Inter: import em `src/styles/fonts.css` (Google Fonts).
- **Não usar** classes Tailwind de font-size/weight/line-height nas seções (regra do projeto) — confiar nos defaults de `theme.css` e tags semânticas (`h1`, `h2`, `p`).

### Dependências a instalar (pnpm)
- `ogl` (Plasma)
- `gsap` (CardSwap)
- `motion` já está; `lucide-react` a confirmar/instalar.

### Design system
Antes de qualquer código: verificar `node_modules/@make-kits/*` e ler `guidelines/setup.md` + `guidelines/Guidelines.md` se existirem. Usar componentes do kit (Button, Input, Textarea, Card etc.) sempre que disponíveis; só criar custom quando o kit não cobrir.

## Regras de marca a respeitar
- Fundo escuro predominante (modo escuro padrão).
- Azul gelo em detalhes, linhas, ícones, texto secundário.
- Terra Orange **apenas** em CTAs, preços, tags, pequenos destaques.
- Sem verde WhatsApp, sem neon, sem gamer, sem cursor custom, sem BWS gigante.
- Monograma BWS apenas como selo pequeno/avatar/favicon.
- WhatsApp = `#whatsapp` (placeholder).

## Verificação
1. `pnpm install` para novas deps.
2. Dev server já roda — abrir o preview e percorrer a página:
   - Hero fiel ao mockup (escuro, fluido, plasma sutil, monograma como selo).
   - Todas as 12 seções presentes na ordem do brief.
   - Toggle claro/escuro funciona e preserva legibilidade nos dois modos.
   - CardSwap anima e pausa no hover.
   - Pricing destaca "Portfólio Profissional".
   - Responsivo: testar largura mobile (plasma com `mouseInteractive=false` e opacidade menor).
   - Botões WhatsApp apontam para `#whatsapp` e usam Terra Orange (sem verde).
3. Confirmar que não há erros de console (Plasma WebGL, GSAP timeline).
