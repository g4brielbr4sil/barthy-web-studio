Refine a landing page atual da Barthy Web Studio com foco em design responsivo, hierarquia visual, performance e consistência da identidade.

Não recrie o projeto do zero. Refatore e ajuste a versão atual.

Contexto:
A Barthy Web Studio é uma operação de serviços digitais e suporte técnico para pequenos negócios. A landing page precisa parecer profissional, premium, tecnológica e confiável. A identidade visual já está definida: azul escuro profundo, azul gelo, branco gelo e Terra Orange como destaque.

Direção visual final:

* usar a identidade visual aprovada da Barthy
* usar o mockup escuro/refinado como referência principal do site
* visual noturno, limpo, premium e tecnológico
* Terra Orange apenas em CTA principal, preços, tags e pequenos destaques
* BWS apenas como detalhe pequeno, favicon ou selo
* logo horizontal Barthy Web Studio no header e rodapé
* não usar BWS gigante
* não usar verde neon
* não usar estética gamer
* não usar cursor customizado

Paleta oficial:
#0A1931
#1B212C
#1A3D63
#4A7FA7
#B3CFE5
#F6FAFD
#CD765D

Objetivo desta rodada:

1. Refinar hero e primeira dobra.
2. Corrigir responsividade real da página.
3. Melhorar logo/header.
4. Ajustar botões e excesso de Terra Orange.
5. Integrar RolodexText no título.
6. Aplicar Plasma Background de forma sutil e performática.
7. Garantir que cards, grids, Pricing Plans e CardSwap não quebrem em mobile.

Regras de responsividade obrigatórias:

* Aplicar mobile first.
* Começar layouts em uma coluna e expandir progressivamente.
* Usar `min-width` como estratégia principal de breakpoints.
* Evitar misturar `min-width` e `max-width`, salvo exceções justificadas.
* Evitar larguras e alturas fixas em componentes principais.
* Usar `width: 100%`, `max-width`, `minmax()`, `clamp()`, `ch`, Flexbox e CSS Grid.
* Não usar valores rígidos que causem overflow horizontal.
* Usar `max-width: 100%` em imagens, logos, cards e elementos gráficos.
* Textos longos devem ter largura confortável, idealmente entre `36ch` e `70ch`, conforme o contexto.
* Títulos devem usar `clamp()` para escalar bem entre mobile e desktop.
* A página não pode ter scroll horizontal em 320px, 360px, 390px, 430px, 768px, 1024px, 1280px e 1440px.
* Header, hero, cards, pacotes, CardSwap e formulário devem ser testados nesses tamanhos.
* Ajustar breakpoints quando o conteúdo começar a ficar ruim, não por tamanho fixo de aparelho.
* Usar Grid/Flex moderno em vez de muitas media queries.
* Criar layouts fluidos com `grid-template-columns: repeat(auto-fit, minmax(...))` quando fizer sentido.
* Em mobile, cards de pacotes e serviços devem ficar em coluna única.
* Em tablet, usar duas colunas quando houver espaço.
* Em desktop, usar grids mais largos com máximo de largura controlado.
* Evitar “pixel perfect” rígido. Priorizar fluidez e robustez.

Meta viewport:
Garantir que o projeto tenha:
`<meta name="viewport" content="width=device-width, initial-scale=1">`

Header:

* Usar logo horizontal correta.
* No modo escuro, usar logo clara/ice white.
* No modo claro, usar logo escura/azul.
* Menu desktop: Início, Serviços, Pacotes, Portfólio, Como funciona, Contato.
* Mobile: menu compacto/hamburger ou navegação colapsada.
* O botão “Solicitar orçamento” do header deve ser o principal CTA em Terra Orange.
* O toggle claro/escuro deve ser discreto, criativo e bem alinhado.
* Header não pode quebrar em telas pequenas.
* Evitar altura excessiva no mobile.

Hero:

* Remover qualquer BWS gigante ou card pesado no hero.
* Usar composição inspirada no mockup escuro/refinado: hero limpo, premium, escuro, com ondas/plasma sutil.
* Título principal:
  “Presença digital e suporte técnico para [palavra animada]”
* Usar componente Rolodex/slot machine na parte final do título.

RolodexText:
Criar ou ajustar o componente de texto animado para palavras alternando como máquina de slot física ou Rolodex.

Palavras:

* pequenos negócios
* empresas locais
* prestadores de serviço
* negócios que vendem pelo WhatsApp

Regras da animação:

* O texto antigo deve rotacionar 90° para trás no eixo X.
* O novo texto deve subir de baixo, também com rotação no eixo X.
* Usar `transform-style: preserve-3d`.
* O container não pode cortar a rotação de forma dura.
* Não centralizar o texto animado.
* O texto animado deve ser alinhado à esquerda para ficar colado ao texto anterior.
* Evitar gaps estranhos quando a palavra muda de tamanho.
* Usar `display: inline-flex` ou solução equivalente.
* Respeitar `prefers-reduced-motion`, mostrando fallback estático ou transição simples.
* Em mobile, garantir que o título quebre linha de forma limpa.

Botões do hero:

* Manter o botão “Solicitar orçamento” do header como principal CTA laranja.
* No hero, transformar “Solicitar orçamento” em botão secundário/outline ou reduzir destaque.
* “Ver serviços” deve manter estilo discreto.
* Evitar dois CTAs laranja competindo na primeira dobra.

Plasma Background:

* Usar Plasma como atmosfera sutil, não como elemento principal.
* Aplicar no hero e, se adequado, no CTA final.
* Pode haver um GlobalPlasmaBackdrop muito sutil, mas não deve prejudicar leitura nem performance.
* Cores permitidas: #4A7FA7 e #B3CFE5.
* Velocidade baixa: entre 0.18 e 0.30.
* Opacidade baixa: entre 0.12 e 0.24.
* Em mobile, desativar mouseInteractive e reduzir opacidade ou substituir por gradiente estático.
* Respeitar `prefers-reduced-motion`.
* Não usar verde, roxo exagerado, neon, glitch ou efeito gamer.

Seção “O que fazemos”:

* Grid responsivo.
* Mobile: 1 coluna.
* Tablet: 2 colunas.
* Desktop: 3 colunas.
* Cards com altura flexível, não fixa.
* Texto e ícones não podem overflowar.

Serviços digitais e Suporte de TI:

* Usar estrutura clara em duas áreas.
* Mobile em coluna única.
* Desktop pode usar duas colunas ou grid.
* Evitar lista longa visualmente pesada.
* Agrupar itens com espaçamento adequado.

Pacotes / Pricing Plans:

* Manter 3 pacotes.
* Remover definitivamente toggle mensal/anual.
* A Barthy vende pacote fechado, não assinatura.
* Destacar “Portfólio Profissional”.
* Mobile: 1 card por linha.
* Tablet: 1 ou 2 por linha conforme largura.
* Desktop: 3 cards alinhados.
* Cards devem ter altura coerente, mas sem forçar altura fixa que quebre conteúdo.
* Preços em Terra Orange.
* CTA em Terra Orange somente dentro do card destacado ou de forma equilibrada.
* Sem botão verde.
* Sem overflow horizontal.
* Usar `minmax()` ou classes Tailwind equivalentes para fluidez.

Como funciona:

* 4 etapas claras.
* Mobile em timeline vertical.
* Desktop em linha ou cards horizontais.
* Não deixar etapas pequenas demais no desktop nem comprimidas no mobile.

Experiências e projetos / CardSwap:

* Usar CardSwap somente se ele ficar responsivo e não quebrar mobile.
* Mobile: se CardSwap não couber bem, substituir por stack/lista de cards estáticos.
* Desktop: usar CardSwap com largura controlada.
* Nunca deixar CardSwap causar overflow horizontal.
* Cards:

  * Levens / Sistemas internos
  * PNQC / Programa Nacional de Qualificação de Cuidadores
  * Hermes Command Center
  * GitHub / Vitrine técnica
* Usar descrições genéricas e profissionais.
* Não expor dados sensíveis.
* Visual abstrato, escuro, elegante, com detalhes em azul gelo.

Cases demonstrativos:

* 3 cards.
* Mobile: 1 coluna.
* Desktop: 3 colunas.
* Indicar que são modelos demonstrativos.
* Não parecer cliente real.

Formulário / Captação:

* Formulário visual simples.
* Campos: Nome, WhatsApp, Tipo de serviço, Mensagem.
* Código preparado para integração futura.
* Não fingir envio real se não houver backend.
* CTA alternativo para WhatsApp com placeholder `#whatsapp`.
* Sem número fake.
* Sem verde WhatsApp.

Modo claro/escuro:

* Garantir contraste adequado nos dois modos.
* Modo escuro é padrão.
* Modo claro não deve parecer site branco genérico.
* Usar Ice White como base, texto Deep Navy/Midnight Blue, cards claros com bordas sutis.
* Manter Terra Orange como destaque controlado.
* Logo precisa mudar corretamente de acordo com o modo.

Performance e acessibilidade:

* Respeitar `prefers-reduced-motion`.
* Botões e links com foco visível.
* Contraste adequado.
* Animações não devem bloquear interação.
* Evitar efeitos WebGL em excesso no mobile.
* Usar lazy/defer quando fizer sentido.
* Evitar re-renderizações desnecessárias de animações.
* Garantir navegação por teclado no menu e formulário.

Arquitetura do código:

* Manter React + Vite + Tailwind.
* Separar componentes:

  * Header
  * Hero
  * RolodexText
  * PlasmaLayer
  * ServicesSection
  * PricingSection
  * ProcessSection
  * ProjectsSection
  * DemoCasesSection
  * ContactSection
  * Footer
* Separar dados em constantes:

  * services
  * supportServices
  * packages
  * projects
  * demoCases
  * processSteps
* Não duplicar conteúdo hardcoded.
* Garantir `npm run build` funcionando.
* Se remover dependências não usadas, limpar package.json.
* Não adicionar biblioteca pesada sem necessidade.

Checklist obrigatório antes de finalizar:

* Verificar 320px, 360px, 390px, 430px, 768px, 1024px, 1280px e 1440px.
* Verificar que não existe scroll horizontal.
* Verificar que o header não quebra.
* Verificar que o hero mantém legibilidade.
* Verificar que RolodexText está alinhado à esquerda.
* Verificar que Plasma não prejudica leitura.
* Verificar que Pricing Plans não tem toggle mensal/anual.
* Verificar que CardSwap não quebra mobile.
* Verificar que não existe BWS gigante.
* Verificar que não existe verde WhatsApp.
* Verificar que não há número fake.
* Verificar que build passa.

Resultado esperado:
Refatorar a landing page atual da Barthy Web Studio para uma versão mais profissional, responsiva, fluida, premium, fiel à identidade visual e pronta para refinamento final.
