Antes de alterar o código, faça uma auditoria rápida da landing page atual e identifique os pontos de quebra visual.

Audite:

* header
* hero
* RolodexText
* Plasma Background
* botões
* cards de serviços
* Pricing Plans
* CardSwap
* cases demonstrativos
* formulário
* footer

Para cada problema encontrado, corrija a causa raiz, não apenas o sintoma visual.

Regras avançadas de design responsivo:

1. Responsividade por conteúdo
   Não usar breakpoints apenas por padrão de device.
   Ajustar o layout quando o conteúdo começar a quebrar, comprimir, gerar overflow ou perder legibilidade.

2. Mobile first com desktop bem resolvido
   Começar por layout mobile simples e funcional.
   Expandir progressivamente para tablet e desktop.
   No desktop, evitar conteúdo muito disperso, seções vazias ou espaçamento exagerado.
   A página deve ter densidade visual adequada em 1280px e 1440px.

3. Sem overflow horizontal
   Garantir que não exista scroll horizontal em:
   320px
   360px
   390px
   430px
   768px
   1024px
   1280px
   1440px

Verificar especialmente:

* header
* botões
* título com RolodexText
* Pricing Plans
* CardSwap
* grids de cards
* formulário

4. Tipografia fluida
   Usar `clamp()` para títulos e subtítulos.
   Evitar tamanhos fixos exagerados.
   Controlar largura de leitura com `max-width` em `ch`, especialmente no hero e textos longos.

Exemplo de intenção:

* títulos grandes, mas adaptáveis
* subtítulos entre 45ch e 70ch no desktop
* boa quebra de linha no mobile
* line-height confortável

5. Layout fluido com Grid/Flex
   Preferir CSS Grid e Flexbox fluidos em vez de muitas media queries.

Para grids de cards, usar lógica equivalente a:
`grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));`

Aplicar isso em:

* serviços
* suporte de TI
* cases demonstrativos
* projetos, se CardSwap não for usado no mobile

6. Pricing Plans responsivo
   Mobile:

* 1 card por linha

Tablet:

* 1 ou 2 cards por linha, conforme espaço real

Desktop:

* 3 cards alinhados

Não usar altura fixa que quebre conteúdo.
Não usar toggle mensal/anual.
Destacar “Portfólio Profissional” sem quebrar o alinhamento dos demais cards.

7. CardSwap com fallback mobile
   CardSwap só deve aparecer se couber bem.
   No mobile, substituir por cards estáticos empilhados se o componente gerar overflow, corte ou interação ruim.

Desktop:

* pode usar CardSwap

Mobile:

* preferir lista/cards estáticos

8. RolodexText inline
   O texto animado deve ser inline e alinhado à esquerda.
   Não centralizar.
   Não criar gaps variáveis conforme o tamanho da palavra.
   Não quebrar o título de forma feia no mobile.

Usar:

* `display: inline-flex`
* `text-align: left`
* `transform-style: preserve-3d`
* altura suficiente para a rotação
* fallback com prefers-reduced-motion

9. Plasma Background performático
   Plasma deve ser sutil e não competir com o conteúdo.

Desktop:

* pode ter mouseInteractive true
* opacidade baixa
* movimento lento

Mobile:

* mouseInteractive false
* opacidade reduzida
* considerar gradiente estático se houver queda de performance

Respeitar `prefers-reduced-motion`.

10. Assets e imagens
    Logos e imagens devem usar:

* max-width: 100%
* height: auto
* object-fit: contain

Não esticar logo.
Não recriar logo em texto se o asset oficial estiver disponível.
Usar logo horizontal no header/rodapé.
Usar monograma BWS apenas como detalhe pequeno, avatar ou favicon.

11. Modo claro e escuro
    Ambos os modos precisam ser tratados como design real.

Modo escuro:

* padrão principal
* premium, noturno e tecnológico

Modo claro:

* não pode parecer genérico
* usar Ice White como base
* texto Deep Navy/Midnight Blue
* cards claros com bordas sutis
* Terra Orange apenas em CTAs e destaques

12. Acessibilidade e interação
    Adicionar:

* foco visível em botões, links, menu e formulário
* contraste adequado
* aria-label no toggle claro/escuro
* aria-label no menu mobile
* labels nos campos do formulário
* navegação por teclado funcionando

13. Arquitetura esperada
    Separar:

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

Separar dados em constantes:

* services
* supportServices
* packages
* projects
* demoCases
* processSteps

14. Checklist final obrigatório
    Antes de finalizar, validar:

* npm run build passa
* não existe scroll horizontal
* header funciona em mobile
* logo correta em modo claro/escuro
* BWS não aparece gigante
* RolodexText está alinhado à esquerda
* Plasma não prejudica leitura
* Pricing Plans não tem toggle mensal/anual
* CardSwap não quebra mobile
* formulário não usa número fake
* WhatsApp está como #whatsapp
* nenhum botão usa verde WhatsApp
* cores respeitam a paleta da Barthy
