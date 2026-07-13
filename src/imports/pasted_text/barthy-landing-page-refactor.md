Ajuste o projeto da landing page da Barthy Web Studio sem redesenhar do zero. Mantenha a identidade visual atual, a estética noturna/premium/minimalista e a paleta oficial:

* Deep Navy: #0A1931
* Midnight Blue: #1B212C
* Royal Blue: #1A3D63
* Ice Blue: #4A7FA7
* Soft Ice: #B3CFE5
* Ice White: #F6FAFD
* Terra Orange: #CD765D

Objetivo principal: deixar o site pronto para pré-publicação, com foco em SEO, responsividade real em todos os dispositivos, enquadramento correto, textos mais comerciais, preços mais claros e sem estouro horizontal.

Não crie outro projeto. Não mude a identidade visual principal. Não transforme o site em algo colorido ou genérico. Apenas corrija, otimize, refine e deixe pronto para publicar.

1. Responsividade geral

Revise todo o layout em mobile, tablet, notebook e desktop.

Garanta que nada estoure horizontalmente em telas pequenas.

Considere obrigatoriamente os tamanhos:

* 320px
* 360px
* 390px
* 430px
* 768px
* 1024px
* 1366px
* 1440px

Adicione proteções globais contra overflow horizontal:

* `box-sizing: border-box`
* `max-width: 100%`
* `min-width: 0`
* `overflow-x: clip` ou equivalente
* imagens, cards, grids e textos nunca devem ultrapassar a largura da tela

Ajuste grids para:

* 1 coluna no mobile
* 2 colunas no tablet quando fizer sentido
* 3 ou 4 colunas apenas em desktop com espaço real

Evite larguras fixas rígidas. Use `clamp()`, `minmax()`, `auto-fit`, `auto-fill`, `max-width`, `w-full`, `min-w-0` e classes responsivas sempre que necessário.

2. Correção importante no botão de tema claro/escuro

Na versão mobile, o botão que alterna o tema da página entre modo escuro e modo claro está estourando ou apertando o header.

Corrija isso com prioridade.

O botão de tema precisa:

* caber perfeitamente no header em 320px, 360px e 390px
* não empurrar o logo para fora
* não invadir o botão de menu
* manter área clicável confortável
* reduzir tamanho visual no mobile se necessário
* usar `shrink-0`, `min-w-0`, `clamp()` ou esconder texto secundário se preciso
* continuar funcionando corretamente no desktop

Se o botão tiver texto além do ícone, no mobile deixe apenas o ícone. No desktop pode manter ícone + texto, se já existir.

3. Hero principal

Corrija o problema do ponto final da frase principal que não acompanha o texto animado.

O ponto deve acompanhar a palavra/frase animada, sem ficar preso no tamanho da maior palavra.

O texto animado não pode causar salto brusco de layout nem estourar largura.

Remova `whitespace-nowrap` ou qualquer classe que impeça quebra adequada no mobile, quando necessário.

Ajuste o tamanho do H1 com `clamp()` ou classes responsivas para ficar elegante em mobile e desktop.

A hero deve comunicar melhor o valor da Barthy.

Sugestão de H1:

“Sites, portfólios e automações simples para seu negócio vender melhor pelo WhatsApp.”

Sugestão de subtítulo:

“A Barthy Web Studio organiza sua presença digital com landing pages, propostas comerciais, formulários de orçamento, materiais de apresentação e suporte técnico para pequenos negócios.”

Botões da hero:

Primário:
“Quero organizar meu digital”

Secundário:
“Ver serviços”

No mobile:

* botões empilhados
* largura total
* sem estouro lateral
* espaçamento confortável

No desktop:

* botões lado a lado
* bom respiro
* alinhamento premium

As estatísticas/cards da hero devem reorganizar corretamente em telas pequenas.

4. Header

Corrija o header em telas pequenas.

Logo, botão de tema e menu não podem se apertar ou sair da tela.

Em celulares muito pequenos, reduzir textos secundários como “Web Studio” se necessário.

O menu mobile deve abrir e fechar corretamente.

O CTA do menu mobile deve fechar o menu ao ser clicado.

O header deve ficar limpo, profissional e funcional.

5. Seções e cards

Revise todos os cards:

* serviços
* projetos
* cases
* pacotes
* processo
* CTA final
* formulário
* footer

Garanta que textos longos quebrem linha corretamente.

Preços como “R$ 1.197 – 1.997” não podem estourar.

Ajuste fontes com `clamp()` quando necessário.

Garanta espaçamento vertical confortável em mobile.

A seção de projetos/CardSwap não pode invadir laterais em tablet ou notebook.

No mobile, priorizar leitura simples e empilhada.

6. Ajuste da seção “Vivências práticas” / “Produtos” / “Projetos”

A seção atual começa a demonstrar vivências práticas e produtos, mas citar “GitHub como vitrine técnica” não fica tão comercial para o público da Barthy.

Remova ou reduza a ênfase em “GitHub como vitrine técnica”.

Não use GitHub como card principal para cliente final.

Em vez disso, use exemplos mais parecidos com empresas e negócios reais do mercado da Barthy.

Sugestões de cards/projetos para essa seção:

1. Negócio de eventos e buffet
   Título:
   “Eventos e buffet”

Texto:
“Estrutura digital para apresentar serviços, receber pedidos de orçamento e organizar o atendimento pelo WhatsApp.”

Entregas:

* landing page
* proposta comercial
* formulário de orçamento
* cardápio ou catálogo digital
* WhatsApp organizado

2. Prestador de serviço local
   Título:
   “Prestadores de serviço”

Texto:
“Página profissional para mostrar serviços, diferenciais, área de atendimento e facilitar o primeiro contato com clientes.”

Entregas:

* página institucional
* formulário
* CTA para WhatsApp
* materiais de apresentação
* organização básica do atendimento

3. Pequeno negócio em crescimento
   Título:
   “Negócios locais”

Texto:
“Presença digital simples, clara e confiável para empresas que precisam sair do improviso e vender melhor.”

Entregas:

* landing page
* identidade aplicada
* proposta PDF
* link profissional
* suporte técnico inicial

4. Operação comercial com automação
   Título:
   “Operação comercial”

Texto:
“Fluxos simples para captar leads, registrar contatos, acompanhar orçamentos e lembrar próximos passos.”

Entregas:

* formulário
* planilha ou CRM já existente
* automação simples
* mensagens prontas
* relatório básico

Se quiser manter algo técnico, coloque como apoio secundário, não como produto principal:

“Experiência técnica em sistemas, automações e portais internos.”

Mas não destaque GitHub como se fosse uma oferta para o cliente.

7. Serviços principais

Melhore os textos para ficarem mais comerciais.

Serviços recomendados:

1. Landing pages profissionais
   Texto:
   “Páginas rápidas e objetivas para apresentar seu negócio, explicar seus serviços e levar o cliente direto para o WhatsApp.”

2. Portfólio online
   Texto:
   “Uma vitrine simples e bonita para mostrar trabalhos, fotos, diferenciais, depoimentos e formas de contato.”

3. Propostas comerciais
   Texto:
   “Modelos de proposta em PDF ou página online para enviar orçamentos com mais clareza e aparência profissional.”

4. Formulários de orçamento
   Texto:
   “Formulários para coletar informações do cliente antes da conversa, economizando tempo no atendimento.”

5. Organização de WhatsApp
   Texto:
   “Mensagens prontas, etiquetas, links e fluxo básico para não perder cliente no meio da conversa.”

6. Automações simples
   Texto:
   “Conexões leves entre formulário, planilha, e-mail, WhatsApp ou CRM para reduzir trabalho manual.”

7. Pacotes e preços

Atualize a seção de preços com pacotes claros, simples e comerciais.

Use estes pacotes como base:

Pacote 1:
Nome: Start Digital
Preço: A partir de R$ 497
Descrição:
“Para quem precisa sair do improviso e ter uma apresentação mínima profissional.”

Inclui:

* link profissional
* ajuste de bio e CTA
* página simples ou estrutura de apresentação
* botão de WhatsApp
* textos básicos do negócio
* orientação inicial de presença digital

CTA:
“Começar pelo básico”

Pacote 2:
Nome: Presença Profissional
Preço: R$ 897 a R$ 1.497
Descrição:
“Para pequenos negócios que precisam de uma landing page completa e materiais melhores para vender.”

Inclui:

* landing page profissional
* seções de serviços, diferenciais e contato
* formulário de orçamento
* proposta comercial simples
* SEO básico
* responsividade mobile
* integração com WhatsApp

CTA:
“Montar minha presença”

Marcar este como recomendado/destaque.

Pacote 3:
Nome: Operação Comercial
Preço: R$ 1.497 a R$ 2.497
Descrição:
“Para negócios que querem organizar atendimento, captação e acompanhamento comercial.”

Inclui:

* landing page completa
* formulário estratégico
* organização de leads
* mensagens comerciais prontas
* automação simples
* relatório ou painel básico
* suporte de ajustes iniciais

CTA:
“Organizar minha operação”

Observações importantes:

* Não prometa sistemas complexos nesses pacotes.
* Não usar linguagem exagerada.
* Deixar claro que valores podem variar conforme escopo.
* Adicionar nota:
  “Valores iniciais. Projetos personalizados podem variar conforme quantidade de páginas, integrações, conteúdo e urgência.”

9. SEO técnico

Adicionar ou revisar SEO completo do site.

Title recomendado:
“Barthy Web Studio | Sites e presença digital para pequenos negócios”

Meta description recomendada:
“Landing pages, portfólios, propostas comerciais, formulários de orçamento e automações simples para pequenos negócios venderem melhor pelo WhatsApp.”

Keywords:
“landing page para pequenos negócios, site para prestador de serviço, portfólio online, proposta comercial digital, automação simples, WhatsApp para negócios, presença digital, Barthy Web Studio, sites em Brasília, suporte técnico para pequenos negócios”

Canonical:
Preparar para domínio futuro:
“https://barthywebstudio.com.br/”

Open Graph:
Title:
“Barthy Web Studio | Presença digital para pequenos negócios”

Description:
“Sites, portfólios, propostas e automações simples para pequenos negócios venderem melhor pelo WhatsApp.”

Type:
website

Locale:
pt_BR

Twitter Card:
summary_large_image

JSON-LD:
Adicionar dados estruturados com:

* Organization
* ProfessionalService
* WebSite

Usar como base:

Nome:
Barthy Web Studio

Descrição:
“Presença digital e suporte técnico para pequenos negócios.”

Área de atendimento:
Brasil, com foco inicial em Brasília/DF

Serviços:

* Landing pages
* Portfólios online
* Propostas comerciais digitais
* Formulários de orçamento
* Automações simples
* Suporte técnico para pequenos negócios

Criar ou revisar também:

* favicon
* manifest web app, se o projeto suportar
* robots.txt, se o projeto suportar
* sitemap.xml, se o projeto suportar

10. Textos principais do site

Use textos mais diretos, comerciais e confiáveis.

Hero eyebrow:
“PRESENÇA DIGITAL PARA NEGÓCIOS LOCAIS”

Hero título:
“Sites, portfólios e automações simples para seu negócio vender melhor pelo WhatsApp.”

Hero subtítulo:
“A Barthy Web Studio organiza sua presença digital com páginas profissionais, propostas comerciais, formulários de orçamento e suporte técnico para pequenos negócios.”

CTA principal:
“Quero organizar meu digital”

CTA secundário:
“Ver serviços”

Seção serviços:
Título:
“O que a Barthy organiza para o seu negócio”

Subtítulo:
“Estruturas simples, bonitas e funcionais para melhorar sua apresentação, atendimento e conversão.”

Seção projetos/vivências:
Título:
“Aplicações práticas para negócios reais”

Subtítulo:
“Exemplos de como a Barthy pode estruturar presença digital, atendimento e materiais comerciais para diferentes tipos de negócio.”

Seção processo:
Título:
“Como funciona”

Passos:

1. Diagnóstico
   “Entendemos seu negócio, seu público, seus serviços e onde o atendimento está travando.”

2. Estrutura
   “Organizamos a oferta, os textos, as seções da página e os canais de contato.”

3. Produção
   “Criamos a página, proposta, formulário ou automação simples com identidade visual profissional.”

4. Entrega
   “Você recebe uma estrutura pronta para divulgar, atender melhor e acompanhar próximos passos.”

Seção preços:
Título:
“Pacotes para começar sem complicar”

Subtítulo:
“Escolha um ponto de partida. O escopo final pode ser ajustado conforme a necessidade do negócio.”

CTA final:
Título:
“Pronto para tirar seu digital do improviso?”

Texto:
“Vamos organizar uma presença profissional para seu negócio vender melhor, atender com mais clareza e passar mais confiança.”

Botão:
“Falar com a Barthy”

11. Formulário e CTAs

Trocar placeholders como:

* `#whatsapp`
* `#instagram`
* `#linkedin`
* `#github`

por uma configuração central tipo `siteConfig`.

Criar ou revisar:

```ts
export const siteConfig = {
  name: "Barthy Web Studio",
  url: "https://barthywebstudio.com.br/",
  domain: "barthywebstudio.com.br",
  email: "contato.barthywebstudio@gmail.com",
  whatsapp: "",
  instagram: "",
  linkedin: "",
  github: "",
}
```

Se ainda não houver número oficial de WhatsApp, deixar o campo preparado e comentar claramente onde trocar.

O formulário deve ter comportamento útil:

Opção preferencial:
Abrir WhatsApp com mensagem pronta contendo:

* nome
* telefone
* tipo de serviço
* mensagem

Mensagem sugerida:
“Olá, tenho interesse em organizar a presença digital do meu negócio. Meu nome é [nome], meu WhatsApp é [telefone], estou procurando [serviço]. [mensagem].”

Se WhatsApp ainda estiver vazio, abrir e-mail com assunto e corpo preenchidos.

Não deixar o formulário apenas visual sem ação.

12. Performance e acessibilidade

Reduzir animações pesadas no mobile.

Respeitar `prefers-reduced-motion`.

Evitar efeitos que causem layout shift.

Garantir contraste adequado entre texto e fundo.

Manter hierarquia visual premium.

Não adicionar dependências desnecessárias.

Remover código morto ou classes conflitantes quando encontrar.

Garantir foco visível em botões, links e campos.

Botões devem ter `aria-label` quando forem apenas ícones, especialmente:

* botão de tema claro/escuro
* botão de menu mobile
* botões de carrossel ou cards, se existirem

13. Arquivos a revisar com prioridade

Revisar especialmente:

* App.tsx
* Header.tsx
* ThemeToggle.tsx
* Hero.tsx
* RolodexWord.tsx
* Pricing.tsx
* Projects.tsx
* CardSwap.tsx
* Cases.tsx
* ServiceGrid.tsx
* QuoteForm.tsx
* FinalCTA.tsx
* Footer.tsx
* content.ts
* theme.css
* globals.css
* index.css
* tailwind.css
* index.html, se existir no projeto

14. Resultado esperado

Ao final, entregue:

* lista dos arquivos alterados
* resumo das correções feitas
* quais textos foram melhorados
* quais preços foram aplicados
* quais ajustes de SEO foram adicionados
* observações sobre qualquer ponto que ainda dependa de domínio, WhatsApp oficial ou deploy
* confirmação de que o layout foi pensado para 320px, 360px, 390px, 430px, 768px, 1024px, 1366px e 1440px

Não publique ainda. Apenas deixe o projeto corrigido, responsivo, otimizado e pronto para revisão final.
