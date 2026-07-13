COMPLEMENTO FINAL DE VERIFICAÇÃO

Antes de concluir, revise também os pontos abaixo. Eles foram encontrados no código atual e não devem permanecer na versão exportada para o Codex.

## 1. Tipografia oficial

A identidade da Barthy usa Inter.

O código atual ainda importa e utiliza Fraunces em:

* `src/styles/fonts.css`
* `--font-display`
* títulos H1 e H2
* componentes que usam `fontFamily: var(--font-display)`

Remover Fraunces da interface final.

Usar Inter em:

* títulos
* subtítulos
* textos
* botões
* formulários
* cards
* navegação

A hierarquia deve ser criada por:

* tamanho
* peso
* entrelinha
* espaçamento
* largura do texto

Não por uma segunda fonte editorial que não faz parte da identidade aprovada.

Não deixar a importação da Fraunces como código morto.

## 2. Navegação e IDs das seções

Como várias seções serão removidas, renomeadas ou unificadas, revisar todos os links do header.

O header atual aponta para:

* `#servicos`
* `#pacotes`
* `#solucoes`
* `#como-funciona`
* `#experiencia`
* `#faq`
* `#contato`

Depois da nova estrutura, nenhum link pode apontar para seção inexistente.

Usar uma navegação final curta e coerente, por exemplo:

* Soluções
* Sistemas
* Experiência
* Pacotes
* Como trabalhamos
* FAQ
* Contato

IDs sugeridos:

* `#inicio`
* `#solucoes`
* `#sistemas`
* `#experiencia`
* `#pacotes`
* `#como-trabalhamos`
* `#hermes`
* `#faq`
* `#contato`

Não manter:

* links quebrados
* IDs duplicados
* âncoras de seções removidas
* navegação para “Serviços mais procurados”
* navegação para “Exemplos de aplicação”

Ao clicar em qualquer item do menu mobile, fechar o menu.

## 3. Remover componentes órfãos após a reorganização

Depois de remover ou unificar seções, limpar os imports e componentes que não forem mais utilizados.

Verificar especialmente:

* `MostRequested.tsx`
* `ProblemsSolved.tsx`
* `Examples.tsx`
* `TrustProcess.tsx`
* `FinalCTA.tsx`
* `RolodexWord.tsx`, caso deixe de ser exibido
* dados antigos correspondentes em `content.ts`

Não deixar componentes antigos renderizados escondidos.

Não manter imports quebrados no `App.tsx`.

Não duplicar a função do formulário com um CTA final separado.

O formulário deve encerrar a narrativa comercial da página.

## 4. Logo oficial

O componente atual monta “Barthy Web Studio” com texto HTML e recria o monograma em SVG.

Na interface final:

* usar o asset oficial da logo horizontal
* usar a versão adequada para cada tema
* usar `alt="Barthy Web Studio"`
* preservar proporção
* não esticar
* não reconstruir a marca com texto
* não usar monograma decorativo na hero
* monograma apenas em favicon ou aplicação pequena

Se os assets oficiais não puderem ser aplicados corretamente no Figma, registrar como pendência obrigatória para o Codex.

## 5. SEO estático está incorreto no código atual

O `index.html` atual contém:

* `lang="en"`
* título “Refine landing page design”
* descrição genérica em inglês
* `noindex, nofollow`

Isso não pode chegar ao deploy.

Também não depender somente de `SeoHead.tsx` com `useEffect`, porque:

* as tags aparecem apenas depois do JavaScript
* robôs de compartilhamento podem não executar o React
* Open Graph pode não funcionar corretamente no WhatsApp e redes sociais
* o `noindex` inicial pode ser lido antes da alteração dinâmica

Registrar como pendência obrigatória para o Codex:

* alterar o HTML estático para `lang="pt-BR"`
* definir title real
* definir description real
* definir `index, follow`
* colocar canonical estático
* colocar Open Graph estático
* colocar Twitter Card estático
* colocar favicon e manifest estáticos
* incluir `og:image`
* incluir `twitter:image`

O Figma não precisa implementar a infraestrutura final de SEO, mas não deve preservar ou gerar metadados genéricos.

## 6. Structured Data sem dados inventados

O código atual adiciona um `PostalAddress` para Brasília no JSON-LD.

Não existe endereço físico público definido para a Barthy.

Remover qualquer objeto `address` até que exista um endereço comercial real que deva ser publicado.

Pode manter:

* `Organization`
* `ProfessionalService`
* `WebSite`
* `FAQPage`
* `areaServed: Brasil`
* base operacional em Brasília, de maneira institucional

Não inventar:

* rua
* CEP
* endereço comercial
* telefone
* CNPJ
* avaliações
* horário de funcionamento
* faixa de preço estruturada sem definição real

A descrição do JSON-LD também não deve repetir “pequenos negócios” como limitação da marca.

## 7. Sitemap

O sitemap atual lista URLs com fragmentos como:

* `/#servicos`
* `/#pacotes`
* `/#faq`
* `/#contato`

Fragmentos da mesma landing não devem ser tratados como páginas independentes no sitemap.

Enquanto o site tiver apenas uma página, o sitemap deve listar apenas:

`https://barthywebstudio.com.br/`

Páginas adicionais só devem entrar quando existirem rotas reais e indexáveis.

Essa correção deve ser feita no Codex.

## 8. Manifest e metadados antigos

O `site.webmanifest` atual ainda contém:

“Sites e presença digital para pequenos negócios venderem melhor pelo WhatsApp.”

Atualizar para uma descrição mais abrangente:

“Páginas, sistemas, automações e operação digital para empresas e profissionais.”

Revisar também:

* título SEO
* meta description
* Open Graph
* keywords existentes
* descriptions do JSON-LD
* textos alternativos
* favicon
* nome curto do aplicativo

Não manter a comunicação antiga escondida nos arquivos técnicos.

## 9. Formulário

O formulário final deve usar:

Label:

Cidade/UF

Placeholder:

Digite sua cidade e estado

Não listar cidades no placeholder.

Adicionar os campos definidos no prompt principal:

* Nome
* WhatsApp
* E-mail opcional
* Empresa ou projeto
* Cidade/UF
* Tipo de solução
* Mensagem

Remover da interface pública:

* explicação sobre endpoint
* explicação sobre fallback
* mensagem sobre configuração futura
* texto sobre integração ainda não configurada
* prazo “respondemos em até 1 dia útil”
* qualquer mensagem técnica de desenvolvimento

A interface deve mostrar apenas mensagens comerciais e operacionais.

O estado de sucesso só pode aparecer depois de uma ação realmente concluída.

## 10. FAQ e JSON-LD devem usar o mesmo conteúdo

A lista visual do FAQ e o `FAQPage` do JSON-LD precisam vir da mesma fonte de dados.

Não permitir:

* pergunta atualizada na tela e antiga no JSON-LD
* respostas diferentes entre interface e SEO
* perguntas sobre endpoint
* perguntas sobre integração futura
* linguagem de desenvolvimento

O FAQ deve refletir exatamente o conteúdo aprovado no prompt principal.

## 11. CardSwap e redução de movimento

O `CardSwap` atual usa GSAP com easing elástico e continua animando mesmo para usuários com redução de movimento.

Corrigir ou registrar para o Codex:

* respeitar `prefers-reduced-motion`
* nessa condição, exibir cards estáticos
* reduzir ou remover easing elástico
* interromper animação quando a aba estiver oculta
* cancelar timeline e intervalos na desmontagem
* não esconder conteúdo essencial atrás da animação
* não usar sombra preta pesada no modo claro

No desktop, a animação deve ser lenta e discreta.

No mobile e tablet, usar cards estáticos.

## 12. Plasma e comportamento responsivo

A hero atual calcula `isMobile` diretamente durante o render e não reage corretamente quando a janela muda de tamanho.

No Codex:

* usar hook responsivo real ou media query reativa
* evitar recriar o canvas desnecessariamente
* limitar DPR
* respeitar redução de movimento
* pausar quando a aba estiver oculta
* remover corretamente canvas, listeners e animação
* usar configuração diferente por tema
* evitar Plasma forte no light
* manter fallback estático sem canvas quando necessário

Não adicionar segundo Plasma ou canvas duplicado ao trocar de tema.

## 13. Menu mobile

Além dos atributos já existentes:

* fechar com Escape
* impedir que o foco fique perdido atrás do menu
* manter foco visível
* fechar ao selecionar uma seção
* evitar menu transparente no modo claro
* garantir contraste nos dois temas
* não bloquear o scroll permanentemente depois de fechar
* atualizar `aria-expanded` corretamente

Não precisa transformar o menu em componente complexo ou adicionar biblioteca.

## 14. Botões e cantos arredondados

O código atual aplica `rounded-full` em praticamente todos os botões.

Aplicar a regra aprovada:

* botão principal: raio entre 12px e 16px
* botão secundário: mesmo padrão
* pills somente para chips, status e badges
* toggle de tema pode continuar em formato pill
* não deixar todos os controles com aparência de cápsula

Revisar `ui-primitives.tsx`, porque o estilo base atual força `rounded-full` em todos os botões e links.

## 15. Evitar “cardização” automática

O componente `Card` atual aplica sempre:

* glass
* borda
* hover com elevação
* translação vertical

Não utilizar esse componente de forma automática em toda seção.

Criar variações sem adicionar bibliotecas:

* editorial
* bordered
* elevated
* dark visual
* list item
* plain

Nem todo conteúdo precisa subir no hover.

No mobile, evitar movimentos de hover desnecessários.

## 16. Links e canais reais

Não renderizar:

* Instagram sem URL
* LinkedIn sem URL
* WhatsApp sem URL
* links `#`
* links vazios
* canais ainda não configurados

O e-mail real pode permanecer:

`contato.barthywebstudio@gmail.com`

Links externos devem usar:

* `target="_blank"` quando necessário
* `rel="noopener noreferrer"`
* rótulos acessíveis

O link da matéria da PEGN deve ser externo, discreto e claramente identificado.

## 17. Arquivos antigos e textos colados

O projeto contém arquivos antigos em:

* `src/imports/pasted_text/`
* imagens de referência não utilizadas
* componentes shadcn não usados
* textos com a copy antiga
* referências a “pequenos negócios”
* referências a cidades usadas apenas como exemplos
* versões antigas dos prompts

O Figma não deve puxar novamente esses textos para a interface.

Na migração para o Codex:

* remover arquivos mortos
* remover componentes não utilizados
* remover imagens sem uso
* remover prompts e markdowns internos do bundle de produção
* remover dependências relacionadas aos componentes mortos

Não apagar assets oficiais da identidade visual.

## 18. Dependências

O `package.json` atual voltou a conter dezenas de dependências não utilizadas.

Na etapa Codex, auditar e manter somente o necessário para a versão final.

Provavelmente essenciais:

* React
* React DOM
* Vite
* Tailwind
* Lucide React
* Motion
* OGL, caso Plasma seja mantido
* GSAP, somente se CardSwap continuar

React e React DOM devem estar em `dependencies`, não apenas como `peerDependencies`, para um projeto de deploy independente.

Remover bibliotecas de componentes mortos.

Não fazer essa limpeza dentro do Figma se houver risco de quebrar a exportação. Registrar para o Codex.

## 19. Fonte externa e desempenho

O código atual carrega Google Fonts por `@import`, o que pode atrasar a renderização.

Como Inter é a única fonte aprovada:

* remover Fraunces
* evitar múltiplas famílias
* no Codex, preferir carregamento otimizado de Inter
* usar `font-display: swap`
* evitar bloqueio da primeira renderização
* preservar fallback de sistema

Não compartilhar ou empacotar arquivos de fonte sem necessidade.

## 20. Verificação final de texto proibido

Antes de entregar, buscar em todo o projeto e confirmar que não aparece na interface final:

* “Sem projeto infinito”
* “Muitos pequenos negócios”
* “Pequenos negócios” repetido como público principal
* “Presença digital · Brasília e atendimento remoto”
* “Os pedidos que mais aparecem entre pequenos negócios”
* “Mensagens improvisadas”
* “Seu pedido não fica perdido no WhatsApp”
* “Endpoint”
* “Mock”
* “Enquanto o endpoint”
* “Respondemos em até 1 dia útil”
* “Exemplos de aplicação”
* “GitHub / Vitrine técnica”
* “Refine landing page design”

Não basta esconder com CSS.

Remover da fonte de conteúdo utilizada pela página.

## 21. Resultado esperado desta rodada

Ao concluir no Figma:

* hero final aprovada
* light e dark coerentes
* copy aprovada
* seções unificadas
* navegação sem links quebrados
* nenhuma localização usada como proposta de valor
* nenhum público tratado como pequeno
* nenhuma mensagem técnica visível
* nenhuma seção fictícia
* identidade visual intacta
* componentes prontos para exportar

Ao concluir no Codex posteriormente:

* SEO estático correto
* formulário integrado ao Hermes
* dependências limpas
* assets oficiais aplicados
* build real
* responsividade validada
* acessibilidade validada
* deploy configurado
