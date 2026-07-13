Faça uma rodada específica para corrigir completamente os modos claro e escuro da landing page da Barthy Web Studio.

Não altere a estrutura, a copy, a ordem das seções ou a identidade visual definidas no prompt principal.

Não crie uma nova paleta.

Não mude a marca.

Não adicione novas bibliotecas.

Não redesenhe a landing.

Esta rodada deve corrigir exclusivamente:

1. sistema de tema
2. versão light estourada
3. consistência na troca light/dark
4. contraste
5. superfícies
6. gradientes
7. componentes que não se adaptam corretamente ao tema
8. flash branco na inicialização
9. persistência da preferência

## 1. Diagnóstico do problema atual

O projeto atual possui estes tokens no modo claro:

```css
--background: #F6FAFD;
--surface: #ffffff;
--surface-2: #EEF3F9;
--card: rgba(255, 255, 255, 0.7);
--popover: #ffffff;
--muted: #E6EDF5;
--input-background: rgba(255, 255, 255, 0.7);
```

Essa combinação deixa:

* fundo muito branco
* cards quase indistinguíveis do fundo
* seções sem profundidade
* efeito glass lavado
* inputs claros demais
* header pouco separado do conteúdo
* modo light com aparência genérica
* ausência de hierarquia entre background, superfície, cards e elementos elevados

Além disso, o tema é inicializado em dois locais:

* `App.tsx`
* `ThemeToggle.tsx`

Remover essa duplicação.

Deve existir uma única fonte de verdade para o tema.

## 2. Direção visual do modo claro

O modo claro não deve ser branco puro.

Ele deve parecer:

* editorial
* premium
* tecnológico
* sóbrio
* levemente azulado
* coerente com a identidade noturna
* claramente relacionado ao modo escuro

Não transformar o modo light em uma landing branca genérica de SaaS.

Não usar branco puro como fundo principal.

Não deixar todas as seções com a mesma cor.

Não criar um modo claro bege, cinza neutro ou desconectado da marca.

Usar tons derivados da paleta oficial:

* Deep Navy
* Midnight Blue
* Royal Blue
* Ice Blue
* Soft Ice
* Ice White
* Terra Orange

Os tons intermediários podem ser derivados dessas cores para uso técnico em superfícies, bordas e estados, mas não devem ser apresentados como novas cores oficiais da marca.

## 3. Novos tokens semânticos para o modo claro

Refatorar os tokens do `:root` para criar profundidade visual.

Usar aproximadamente:

```css
:root {
  color-scheme: light;

  --background: #EAF1F7;
  --foreground: #0A1931;

  --surface: #F6FAFD;
  --surface-raised: #F1F6FA;
  --surface-2: #DDE8F2;
  --surface-3: #D2E0EC;

  --card: rgba(246, 250, 253, 0.86);
  --card-solid: #F6FAFD;
  --card-foreground: #0A1931;

  --popover: #F6FAFD;
  --popover-foreground: #0A1931;

  --primary: #CD765D;
  --primary-foreground: #FFFFFF;

  --secondary: #1A3D63;
  --secondary-foreground: #F6FAFD;

  --muted: #D9E5EF;
  --muted-foreground: #52657B;

  --accent: #B3CFE5;
  --accent-foreground: #0A1931;

  --border: rgba(26, 61, 99, 0.17);
  --border-strong: rgba(26, 61, 99, 0.26);
  --hairline: rgba(26, 61, 99, 0.10);

  --input: rgba(26, 61, 99, 0.06);
  --input-background: rgba(246, 250, 253, 0.92);

  --switch-background: #CBD9E5;
  --ring: #4A7FA7;

  --shadow-color: rgba(10, 25, 49, 0.16);
  --shadow-soft: 0 18px 50px -32px rgba(10, 25, 49, 0.30);
}
```

Os valores podem ser refinados visualmente, mas devem seguir essa lógica.

Regras:

* `Ice White` deve funcionar como superfície, não como fundo único de toda a página.
* O background deve ter um tom azulado visível.
* Não usar `#FFFFFF` como fundo de seções inteiras.
* `#FFFFFF` pode continuar apenas em textos sobre Terra Orange e casos pontuais de contraste.
* Bordas no modo claro precisam ser mais visíveis do que atualmente.
* Sombras devem usar Deep Navy com baixa opacidade, não preto puro pesado.

## 4. Preservar o modo escuro

Não descaracterizar o dark mode atual.

Manter a direção:

* Deep Navy no fundo
* superfícies azul-escuras
* textos Ice White
* detalhes Ice Blue
* Terra Orange controlado

Adicionar tokens equivalentes para evitar condicionais espalhadas:

```css
.dark {
  color-scheme: dark;

  --background: #0A1931;
  --foreground: #F6FAFD;

  --surface: #0D1F3D;
  --surface-raised: #102543;
  --surface-2: #122849;
  --surface-3: #173153;

  --card: rgba(255, 255, 255, 0.045);
  --card-solid: #0F2240;
  --card-foreground: #F6FAFD;

  --popover: #0F2240;
  --popover-foreground: #F6FAFD;

  --muted: rgba(255, 255, 255, 0.065);
  --muted-foreground: #9FB3CC;

  --border: rgba(179, 207, 229, 0.13);
  --border-strong: rgba(179, 207, 229, 0.22);
  --hairline: rgba(179, 207, 229, 0.08);

  --input: rgba(255, 255, 255, 0.06);
  --input-background: rgba(255, 255, 255, 0.045);

  --shadow-color: rgba(0, 0, 0, 0.45);
  --shadow-soft: 0 24px 70px -36px rgba(0, 0, 0, 0.70);
}
```

Não alterar a identidade visual do dark mode além da padronização dos tokens.

## 5. Corrigir a arquitetura do tema

Atualmente `App.tsx` e `ThemeToggle.tsx` controlam a classe `dark`.

Isso deve ser centralizado.

Criar uma única solução, como:

* `ThemeProvider`
* `ThemeContext`
* hook `useTheme`

A solução deve controlar:

```ts
type Theme = "light" | "dark";
```

Responsabilidades da solução central:

* ler `localStorage`
* aplicar a classe `dark`
* atualizar `document.documentElement.style.colorScheme`
* salvar a preferência
* fornecer `theme`, `isDark` e `toggleTheme`
* impedir estados diferentes entre interface e DOM

Remover do `App.tsx` o `useEffect` que altera diretamente a classe `dark`.

Remover do `ThemeToggle.tsx` a segunda inicialização independente.

O `ThemeToggle` deve apenas consumir o estado central.

Não manter duas fontes de verdade.

## 6. Evitar clarão na abertura do site

A classe do tema deve ser definida antes do React renderizar.

Adicionar a inicialização antes de `createRoot`, no `main.tsx`, ou por script curto no `index.html`.

Lógica:

```ts
const storedTheme = localStorage.getItem("barthy-theme");
const initialTheme = storedTheme === "light" ? "light" : "dark";

document.documentElement.classList.toggle(
  "dark",
  initialTheme === "dark"
);

document.documentElement.style.colorScheme = initialTheme;
```

Regras:

* dark continua como padrão quando não há preferência salva
* não mostrar fundo branco antes de aplicar dark
* recarregar em light deve abrir diretamente em light
* recarregar em dark deve abrir diretamente em dark
* não executar uma troca visual depois que a página já apareceu
* não causar hydration warning ou erro no Vite

Também adicionar no `index.html` uma cor inicial coerente, caso necessário:

```html
<meta name="theme-color" content="#0A1931">
```

O `theme-color` deve ser atualizado quando o tema mudar:

* dark: `#0A1931`
* light: tom do novo background claro

## 7. Transição entre temas

A troca atual não deve piscar, desmontar componentes nem trocar cores em momentos diferentes.

Adicionar transição curta apenas para propriedades visuais:

* background-color
* color
* border-color
* box-shadow
* fill
* stroke
* opacity

Duração recomendada:

```css
180ms a 260ms
```

Não aplicar `transition: all`.

Não aplicar transição global em transformações, tamanhos ou posições.

Não animar layout.

Não fazer o conteúdo pular.

Não aplicar a transição durante a carga inicial.

Adicionar uma classe como:

```css
.theme-ready
```

Somente depois do primeiro frame.

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Nesse caso, não animar a troca.

## 8. Corrigir a utility `.glass`

A classe atual:

```css
.glass {
  background: var(--card);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border);
}
```

No modo claro isso fica lavado.

Refatorar:

```css
.glass {
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

No light mode:

* usar uma superfície azul-clara translúcida
* aumentar discretamente a borda
* usar sombra navy suave
* reduzir aparência leitosa

No dark mode:

* preservar transparência escura
* manter borda Ice Blue sutil
* não clarear demais

Não usar `.glass` em todas as seções.

Usar somente onde já for visualmente necessário.

## 9. Alternância de fundos entre seções

A versão light não pode ser uma faixa branca contínua.

Criar ritmo usando os tokens:

* `--background`
* `--surface`
* `--surface-2`

Alternar de forma sutil entre as seções.

Exemplo de lógica:

* hero: background com atmosfera leve
* primeira seção: `--background`
* próxima seção: `--surface`
* soluções: `--background`
* sistemas: `--surface-2` com baixa intensidade
* experiência: `--background`
* pacotes: `--surface`
* processo: `--background`
* Hermes: bloco elevado
* FAQ: `--surface`
* contato: `--background`

Não criar faixas duras.

Usar transições suaves, gradientes discretos ou divisores.

Não deixar tudo dentro de cards.

## 10. Hero adaptada ao tema

A hero atual possui gradientes fixos:

```css
rgba(26,61,99,0.5)
rgba(74,127,167,0.22)
```

Esses valores foram pensados principalmente para dark mode.

Criar tratamentos diferentes por tema.

Dark mode:

* manter gradientes mais profundos
* Deep Navy, Royal Blue e Ice Blue
* Plasma com opacidade atual ou levemente reduzida

Light mode:

* usar gradientes mais suaves
* evitar grande massa branca
* usar azul frio de baixa opacidade
* manter contraste do título Deep Navy
* Plasma com menor opacidade
* retirar qualquer névoa branca

Exemplo de direção para light:

```css
radial-gradient(
  900px 520px at 15% 5%,
  rgba(74, 127, 167, 0.18),
  transparent 62%
),
radial-gradient(
  760px 420px at 95% 90%,
  rgba(179, 207, 229, 0.28),
  transparent 65%
)
```

No light:

* Plasma entre `0.06` e `0.11`
* sem brilho branco
* sem fundo puro
* sem contraste fraco no título
* sem `Soft Ice` em texto sobre fundo claro quando não atingir contraste

Toda palavra ou destaque que usa `--soft-ice` no dark deve utilizar `--royal` ou `--ice-blue` no light.

Criar token semântico para esse destaque, por exemplo:

```css
--text-accent: #1A3D63;
```

No dark:

```css
--text-accent: #B3CFE5;
```

## 11. Header

No modo claro, o header deve ter:

* fundo translúcido azulado
* separação visível do conteúdo
* borda discreta
* sombra quase imperceptível ao rolar
* logo Deep Navy
* navegação em muted foreground legível
* menu mobile com superfície sólida suficiente

Quando `scrolled`:

Light:

```css
background: rgba(234, 241, 247, 0.86);
border-color: rgba(26, 61, 99, 0.14);
box-shadow: 0 10px 35px -28px rgba(10, 25, 49, 0.45);
```

Dark:

manter a solução atual com fundo Deep Navy translúcido.

Não deixar o header light completamente branco.

Não deixar os links acinzentados demais.

## 12. ThemeToggle

Refatorar o toggle para não depender de valores de `left` diferentes por largura.

Atualmente há cálculo manual:

```tsx
style={{ left: isDark ? 3 : "calc(100% - 23px)" }}
```

Trocar por uma solução estável com:

* container flex
* thumb posicionado por `translateX`
* dimensões coerentes em mobile e desktop
* sem salto ao trocar de breakpoint

Exemplo de lógica:

```tsx
animate={{ x: isDark ? 0 : toggleDistance }}
```

Ou usar CSS grid/flex com alinhamento controlado.

Garantir:

* sol no modo claro
* lua no modo escuro
* `aria-label` correto
* `aria-pressed` correto
* foco visível
* contraste correto
* thumb legível nos dois modos
* sem piscada ao carregar
* sem ícone trocando antes da cor da página

## 13. Logo

A logo deve se adaptar ao tema.

No dark:

* versão clara
* Ice White ou asset oficial claro

No light:

* versão Deep Navy ou Royal Blue
* nunca cinza claro
* nunca branco

Se a logo continuar temporariamente como componente tipográfico, garantir contraste correto.

A implementação final no Codex deverá usar os assets oficiais.

Não deixar a logo trocar com atraso depois do restante do tema.

## 14. Cards e componentes

Auditar os componentes principais:

* Header
* Hero
* ForWhom
* Solutions
* SystemsCRM
* Pricing
* HowItWorks
* HermesSection
* AppliedExperience
* FAQ
* QuoteForm
* Footer
* CardSwap

Corrigir em cada um:

* fundo
* borda
* sombra
* texto
* ícone
* hover
* estado de foco
* transparência
* contraste

No light:

* cards não podem desaparecer no fundo
* bordas precisam ser perceptíveis
* hover não pode clarear ainda mais
* usar sombra navy suave
* ícones devem usar Royal Blue ou Ice Blue com contraste
* textos secundários não podem ficar cinza claro
* superfícies elevadas devem ser visualmente diferentes do background

No dark:

* não transformar cards em retângulos cinza
* preservar o aspecto noturno
* não aumentar demais o contraste das bordas

## 15. Pricing

O card recomendado precisa funcionar nos dois temas.

Light mode:

* superfície Ice White
* borda Terra Orange controlada
* sombra navy com leve presença Terra Orange
* preço bem legível
* fundo diferente dos cards normais
* sem branco estourado

Dark mode:

* preservar visual atual
* não usar gradiente que fique acinzentado

Cards não recomendados no light:

* usar superfície clara azulada
* borda visível
* sombra suave
* não usar branco puro

## 16. AppliedExperience e CardSwap

O componente possui conteúdo com `text-white`.

Esse conteúdo só pode continuar branco se o fundo do card permanecer propositalmente escuro nos dois temas.

Escolher uma destas soluções:

Opção preferida:

* manter os cards visuais de experiência escuros em ambos os temas
* usar Deep Navy ou Royal Blue como base
* preservar `text-white`
* integrá-los ao light mode por borda e sombra

Ou:

* criar tokens específicos para texto e overlay por tema

Não permitir texto branco sobre superfície clara.

A sombra do `CardSwap` atual usa preto com opacidade alta:

```css
rgba(0,0,0,0.55)
```

No light, trocar por sombra baseada em Deep Navy.

No dark, manter sombra escura.

## 17. Formulário

No light mode:

* inputs precisam se diferenciar da seção
* fundo Ice White ou superfície clara
* borda Royal Blue com baixa opacidade
* foco em Ice Blue
* placeholder legível
* labels Deep Navy
* select sem fundo branco nativo estourado
* autofill do navegador adaptado ao tema

Tratar:

```css
input:-webkit-autofill
textarea:-webkit-autofill
select:-webkit-autofill
```

Garantir que o autofill não fique amarelo ou branco incompatível.

No dark:

* manter inputs escuros
* autofill não pode ficar claro
* texto digitado precisa continuar legível

Adicionar:

```css
accent-color: var(--terra);
```

quando aplicável.

## 18. FAQ

No modo claro, a FAQ atual usa:

```tsx
bg-[var(--surface)]/20
```

Isso fica quase invisível.

Corrigir:

* fundo da estrutura com superfície sólida ou 70% a 90%
* perguntas com contraste
* hover usando `--muted`
* divisores visíveis
* painel aberto com fundo levemente diferente
* ícone com Royal Blue ou Ice Blue

No dark, preservar leveza sem deixar cada pergunta parecendo um card pesado.

## 19. Botões

Auditar todas as variantes:

Primary:

* Terra Orange
* texto branco
* contraste correto nos dois temas

Outline:

Light:

* borda Royal Blue ou Ice Blue
* texto Deep Navy
* hover com `--muted`

Dark:

* borda Ice Blue sutil
* texto Ice White
* hover escuro

Ghost:

* não desaparecer no light
* não criar fundo branco

Não usar texto branco fora de fundos escuros ou Terra Orange.

## 20. Acessibilidade

Validar contraste seguindo WCAG AA sempre que possível.

Verificar:

* texto principal
* texto secundário
* links
* botões
* placeholders
* labels
* chips
* badges
* bordas de inputs
* foco visível
* textos sobre Plasma
* textos nos cards de experiência

Não corrigir contraste usando preto puro ou branco puro indiscriminadamente.

Manter a identidade Barthy.

## 21. Testes obrigatórios

Testar de forma real:

1. abrir sem preferência salva
2. confirmar dark como padrão
3. mudar para light
4. recarregar
5. confirmar light persistido
6. mudar novamente para dark
7. recarregar
8. confirmar dark persistido
9. alternar várias vezes rapidamente
10. alternar no topo da página
11. alternar no meio da página
12. alternar com menu mobile aberto
13. alternar com campo do formulário focado
14. alternar em 320px
15. alternar em 390px
16. alternar em 768px
17. alternar em 1024px
18. alternar em 1440px

Verificar:

* sem flash branco
* sem estado invertido do ícone
* sem atraso na logo
* sem fundo quebrado
* sem texto ilegível
* sem canvas duplicado
* sem Plasma duplicado
* sem layout shift
* sem menu transparente demais
* sem inputs estourados
* sem cards brancos sobre fundo branco
* sem cores antigas permanecendo após a troca

## 22. Restrições finais

Não alterar:

* textos da rodada principal
* ordem final das seções
* serviços
* pacotes
* identidade visual
* estrutura comercial
* conteúdo do FAQ
* formulário
* experiência aplicada
* posicionamento
* animações definidas no prompt principal

Não adicionar:

* nova paleta
* verde
* roxo
* amarelo
* gradiente colorido genérico
* brilho neon
* estética gamer
* nova biblioteca de tema
* `next-themes`
* dependência externa
* troca automática baseada no sistema operacional nesta versão

Manter a escolha salva manualmente pelo usuário.

## 23. Entrega esperada

Ao finalizar, informar:

1. causa identificada do modo claro estourado
2. tokens alterados
3. arquivos alterados
4. duplicação de tema removida
5. como o flash inicial foi evitado
6. componentes auditados
7. ajustes feitos no Plasma
8. ajustes feitos no header
9. ajustes feitos nos cards
10. ajustes feitos no formulário
11. resultado dos testes de persistência
12. resultado dos testes de troca light/dark
13. pendências para o Codex

Esta correção deve deixar:

* dark mode premium e noturno
* light mode premium e azulado
* troca consistente
* ausência de clarão
* contraste equilibrado
* identidade visual preservada
* nenhuma aparência branca genérica
