Ajuste o projeto da landing page da Barthy Web Studio sem redesenhar do zero. Mantenha a identidade visual atual, a estética noturna/premium/minimalista e a paleta oficial:

* Deep Navy: #0A1931
* Midnight Blue: #1B212C
* Royal Blue: #1A3D63
* Ice Blue: #4A7FA7
* Soft Ice: #B3CFE5
* Ice White: #F6FAFD
* Terra Orange: #CD765D

Objetivo principal: deixar o site pronto para pré-publicação, com foco em SEO, responsividade real em todos os dispositivos, enquadramento correto e sem estouro horizontal.

Correções obrigatórias:

1. Responsividade geral

* Revisar todo o layout em mobile, tablet, notebook e desktop.
* Garantir que nada estoure horizontalmente em telas pequenas.
* Testar mentalmente/estruturalmente os breakpoints de 320px, 360px, 390px, 430px, 768px, 1024px, 1366px e 1440px.
* Adicionar proteções globais contra overflow horizontal.
* Usar `max-width: 100%`, `min-width: 0`, `box-sizing: border-box`, `overflow-x: clip` ou equivalente quando necessário.
* Ajustar grids para virarem uma coluna no mobile, duas no tablet e três/quatro apenas quando houver espaço real.
* Evitar larguras fixas rígidas que quebrem em celulares.

2. Hero principal

* Corrigir o problema do ponto final da frase principal que não acompanha o texto animado.
* O ponto deve acompanhar a palavra/frase animada, sem ficar preso no tamanho da maior palavra.
* O texto animado não pode causar salto brusco de layout nem estourar largura.
* Remover `whitespace-nowrap` ou qualquer classe que impeça quebra adequada no mobile, quando necessário.
* Ajustar o tamanho do H1 com `clamp()` ou classes responsivas para ficar elegante em mobile e desktop.
* Botões da hero devem ficar empilhados e com largura total no mobile.
* No desktop, manter botões lado a lado com bom espaçamento.
* As estatísticas/cards da hero devem reorganizar corretamente em telas pequenas.

3. Header

* Corrigir o header em telas pequenas.
* Logo, botão de tema e menu não podem se apertar ou sair da tela.
* Em celulares muito pequenos, reduzir textos secundários como “Web Studio” se necessário.
* O menu mobile deve abrir e fechar corretamente.
* O CTA do menu mobile deve fechar o menu ao ser clicado.

4. Seções e cards

* Revisar cards de serviços, projetos, cases, pacotes, processo e CTA final.
* Garantir que textos longos quebrem linha corretamente.
* Preços dos pacotes como “R$ 1.197 – 1.997” não podem estourar.
* Ajustar fontes com `clamp()` quando necessário.
* Garantir espaçamento vertical confortável em mobile.
* A seção de projetos/CardSwap não pode invadir laterais em tablet ou notebook.
* No mobile, priorizar leitura simples e empilhada.

5. SEO técnico
   Adicionar ou revisar SEO completo do site:

* Title claro e comercial.
* Meta description.
* Keywords relevantes.
* Canonical URL preparado.
* Open Graph para WhatsApp, LinkedIn e redes sociais.
* Twitter Card.
* Favicon.
* Manifest web app, se o projeto suportar.
* Robots.txt, se o projeto suportar.
* Sitemap.xml, se o projeto suportar.
* JSON-LD estruturado com Organization, ProfessionalService e WebSite.
* Usar conteúdo coerente com a Barthy Web Studio.

Sugestão de title:
“Barthy Web Studio | Presença digital para pequenos negócios”

Sugestão de description:
“Landing pages, portfólios, propostas comerciais e automações simples para pequenos negócios venderem melhor pelo WhatsApp.”

6. Conteúdo comercial
   Manter o posicionamento:
   “Presença digital e suporte técnico para pequenos negócios.”

Mas tornar a copy mais direta para conversão:

* Falar menos como agência genérica.
* Falar mais sobre organizar o negócio para receber orçamento pelo WhatsApp.
* Citar exemplos como negócios locais, eventos, buffet, prestadores de serviço e autônomos.
* Manter tom profissional, simples e confiável.

7. Formulário e CTAs

* Trocar placeholders como `#whatsapp`, `#instagram`, `#linkedin`, `#github` por variáveis centralizadas ou links preparados para substituição.
* Caso ainda não exista número oficial, criar uma configuração central tipo `siteConfig` com:

  * url
  * domain
  * whatsapp
  * instagram
  * linkedin
  * github
  * email
* O formulário deve ter comportamento útil:

  * ou abrir WhatsApp com mensagem pronta,
  * ou abrir e-mail com assunto e corpo preenchidos,
  * ou deixar preparado claramente para integração futura com Hermes/n8n.
* Não deixar formulário apenas visual sem ação.

8. Performance e qualidade

* Reduzir animações pesadas no mobile.
* Respeitar `prefers-reduced-motion`.
* Evitar efeitos que causem layout shift.
* Garantir contraste adequado entre texto e fundo.
* Manter hierarquia visual premium.
* Não adicionar dependências desnecessárias.
* Remover código morto ou classes conflitantes quando encontrar.

9. Arquivos a revisar com prioridade
   Revisar especialmente:

* App.tsx
* Header.tsx
* Hero.tsx
* RolodexWord.tsx
* Pricing.tsx
* Projects.tsx
* CardSwap.tsx
* QuoteForm.tsx
* FinalCTA.tsx
* Footer.tsx
* content.ts
* theme.css
* globals.css
* index.css
* tailwind.css
* index.html, se existir no projeto

10. Resultado esperado
    Ao final, me entregue:

* lista dos arquivos alterados
* resumo das correções feitas
* observações sobre qualquer ponto que ainda dependa de domínio, WhatsApp oficial ou deploy
* confirmação de que o layout foi pensado para 320px, 360px, 390px, 768px, 1024px, 1366px e 1440px

Não crie outro projeto. Não mude a identidade visual principal. Não transforme o site em algo colorido ou genérico. Apenas corrija, otimize, refine e deixe pronto para publicar.
