Você está trabalhando no projeto Barthy Web Studio.

A Barthy Web Studio é uma operação de serviços digitais e suporte técnico para pequenos negócios. A marca vende portfólios online, landing pages, propostas comerciais em PDF, formulários de orçamento, organização de presença digital, mensagens comerciais, automações simples e suporte de TI básico.

Serviços principais:

* Portfólio online profissional
* Landing page
* Proposta comercial em PDF
* Link profissional para bio/WhatsApp
* Formulário de orçamento/captação
* Organização visual da presença digital
* Mensagens comerciais prontas
* Materiais de divulgação
* Automações simples
* Organização de atendimento e leads
* Suporte de TI simples

Serviços de TI:

* Formatação e reinstalação de PC
* Limpeza e otimização
* Instalação de programas
* Backup e organização de arquivos
* Configuração de Gmail, Drive e contas
* Suporte remoto simples
* Configuração de impressoras e periféricos
* Dual boot/Linux

Identidade visual:
Use as imagens anexadas como referência obrigatória.

Função dos arquivos anexados:

1. Prancha de identidade visual:
   Referência principal da marca. Use para entender paleta, logo, monograma, capa de proposta, atmosfera visual e aplicação geral.

2. Mockup de site:
   Referência principal para o visual do site. O site deve seguir essa direção: hero escuro, elegante, premium, limpo, com ondas/elementos fluidos e layout refinado.

3. Logo horizontal:
   Usar como logo principal no header, rodapé e áreas institucionais.

4. Monograma BWS:
   Usar apenas como detalhe pequeno, avatar, favicon, selo discreto ou elemento secundário. Não usar BWS gigante no hero.

5. Capa de proposta:
   Usar como referência estética para cards premium, fundos escuros, detalhes em azul gelo e composição elegante.

Direção de arte:

* visual noturno
* tecnológico
* premium acessível
* limpo
* profissional
* confiável
* organizado
* com atmosfera de estúdio digital e suporte técnico
* fundo escuro predominante
* azul gelo em linhas, detalhes, ícones e textos secundários
* Terra Orange apenas em botões, preços, tags e pequenos destaques
* cards escuros com bordas sutis
* bastante espaçamento
* excelente legibilidade
* sem visual gamer
* sem verde neon
* sem glitch
* sem cursor customizado
* sem excesso de brilho
* sem usar BWS como elemento gigante

Paleta oficial:
#0A1931 - Deep Navy
#1B212C - Midnight Blue
#1A3D63 - Royal Blue
#4A7FA7 - Ice Blue
#B3CFE5 - Soft Ice
#F6FAFD - Ice White
#CD765D - Terra Orange

Tipografia:
Usar Inter como base principal.
Títulos com Inter Bold ou peso equivalente.
Texto com Inter Regular/Medium.

Slogan:
Presença digital e suporte técnico para pequenos negócios.

E-mail:
[contato.barthywebstudio@gmail.com](mailto:contato.barthywebstudio@gmail.com)

WhatsApp:
Usar placeholder:
#whatsapp

Objetivo:
Criar uma landing page institucional completa, responsiva e pronta para virar site real, com identidade visual fiel à Barthy Web Studio.

O projeto deve ser feito em React + Vite + Tailwind, com código limpo, componentizado e fácil de refatorar.

Requisitos técnicos:

* React + Vite + Tailwind
* Componentes separados por seção
* Dados de serviços, pacotes, projetos e cases em arrays/constantes
* Código organizado
* Responsivo desktop/mobile
* Preparado para deploy
* Garantir que compile
* Não deixar número fake de WhatsApp
* Usar #whatsapp como placeholder
* Não usar botão verde do WhatsApp
* CTA deve usar Terra Orange ou estilo da marca
* Formulário pode ser visual, mas o código deve estar preparado para integração futura com WhatsApp, Google Forms, Tally, n8n, Hermes ou backend próprio

Modo claro e escuro:
Criar suporte para modo escuro e modo claro no site, com botão criativo de alternância no header.

Modo escuro:
Deve ser o padrão principal, usando a identidade noturna da Barthy.

Modo claro:
Deve manter a mesma identidade premium, usando:

* fundo Ice White
* textos em Deep Navy/Midnight Blue
* cards claros com bordas sutis
* Terra Orange apenas em botões e destaques

O botão de alternância deve ser discreto, criativo e profissional. Pode usar sol/lua, esfera animada ou toggle premium com microinteração.

Componentes anexados:
Você receberá markdowns/códigos de componentes. Analise cada um e integre somente nos locais indicados.

1. Plasma Background
   Usar o componente Plasma Background como efeito visual sutil no hero principal e, se fizer sentido, no CTA final.

Regras para Plasma:

* usar como fundo decorativo, não como elemento principal
* baixa opacidade
* movimento lento
* cor #4A7FA7 ou #B3CFE5
* não prejudicar legibilidade
* não usar verde neon
* não usar roxo exagerado
* não usar estética gamer
* simplificar ou desativar interação no mobile

Configuração sugerida:
color="#4A7FA7"
speed={0.25}
direction="forward"
scale={1.2}
opacity={0.22}
mouseInteractive={true}

No mobile:
mouseInteractive={false}
opacity menor

2. CardSwap
   Usar o componente CardSwap na seção “Experiências e projetos”.

Objetivo:
Demonstrar visualmente os projetos e experiências da Barthy sem expor dados confidenciais.

Cards:

* Levens / Sistemas internos
* PNQC / Programa Nacional de Qualificação de Cuidadores
* Hermes Command Center
* GitHub / Vitrine técnica

Regras:

* não usar imagens reais sensíveis
* criar cards abstratos e elegantes
* fundo escuro
* bordas sutis em azul gelo
* detalhes pequenos em Terra Orange
* pausar no hover
* visual premium e tecnológico
* não transformar a seção em algo gamer

Configuração sugerida:
width={420}
height={300}
cardDistance={36}
verticalDistance={32}
delay={4500}
pauseOnHover={true}
skewAmount={3}
easing="elastic"

3. Pricing Plans
   Usar o componente Pricing Plans na seção “Pacotes”, adaptado para pacotes de projeto fechado.

Importante:
Não usar toggle mensal/anual.
A Barthy vende pacotes fechados, não assinatura.

Remover ou desativar qualquer alternância monthly/annual.

Pacotes:
Presença Básica
R$ 297 a R$ 497
Ideal para quem precisa organizar o básico da presença digital.

Portfólio Profissional
R$ 697 a R$ 997
Ideal para empresas que precisam se apresentar melhor.
Este deve ser o pacote visualmente destacado.

Comercial Completo
R$ 1.197 a R$ 1.997
Ideal para quem quer presença digital e estrutura comercial mais completa.

Regras visuais:

* fundo escuro premium
* glassmorphism sutil
* bordas com baixa opacidade
* preços com destaque em Terra Orange
* CTA em Terra Orange
* excelente legibilidade
* responsivo
* sem verde WhatsApp
* sem cores fora da paleta

4. GhostCursor
   Não usar.
   Esse componente foi descartado.
   Não adicionar cursor customizado, rastro, neon, glitch ou efeito parecido.

Estrutura da página:

1. Header

* logo horizontal Barthy Web Studio à esquerda
* menu: Início, Serviços, Pacotes, Portfólio, Como funciona, Contato
* botão destacado: Solicitar orçamento
* toggle claro/escuro criativo e discreto

2. Hero
   Título:
   Presença digital e suporte técnico para pequenos negócios.

Subtítulo:
Criamos portfólios online, landing pages, propostas comerciais, formulários de orçamento e suporte técnico simples para negócios que querem se apresentar melhor e vender com mais clareza.

Botões:

* Solicitar orçamento
* Ver serviços

Visual:
Inspirar no mockup de site anexado.
Fundo escuro elegante.
Plasma Background sutil.
Elementos fluidos em azul gelo.
Não usar BWS gigante.
Não colocar assets soltos aleatoriamente.

3. O que fazemos
   Texto:
   A Barthy Web Studio ajuda pequenos negócios, prestadores de serviço e empresas locais a organizarem sua presença digital com entregas objetivas, escopo claro e visual profissional.

Cards:

* Portfólios online
* Landing pages
* Propostas comerciais em PDF
* Formulários de orçamento
* Organização da presença digital
* Suporte técnico simples

4. Serviços digitais
   Cards:

* Portfólio online profissional
* Landing page
* Link profissional para bio/WhatsApp
* Proposta comercial em PDF
* Mensagens comerciais prontas
* Materiais de divulgação
* Automações simples
* Organização de atendimento e leads

5. Suporte de TI simples
   Texto:
   Além da presença digital, oferecemos suporte técnico simples para pequenos negócios e pessoas físicas.

Cards:

* Formatação e reinstalação de PC
* Limpeza e otimização
* Instalação de programas
* Backup e organização de arquivos
* Configuração de Gmail, Drive e contas
* Suporte remoto simples
* Configuração de impressoras e periféricos
* Dual boot/Linux

6. Pacotes
   Usar Pricing Plans adaptado.

Pacote Presença Básica
R$ 297 a R$ 497
Inclui:

* Link profissional
* Ajuste de bio
* Botão para WhatsApp
* Organização básica dos serviços
* Mensagem inicial de atendimento
* Formulário simples de orçamento

Pacote Portfólio Profissional
R$ 697 a R$ 997
Inclui:

* Página profissional da empresa
* Apresentação da marca
* Serviços
* Fotos
* Botão para WhatsApp
* Instagram
* Formulário de orçamento
* Texto comercial profissional
* Identidade visual básica
* Proposta comercial em PDF

Pacote Comercial Completo
R$ 1.197 a R$ 1.997
Inclui:

* Portfólio online profissional
* Proposta comercial em PDF
* Formulário de captação
* Mensagens comerciais prontas
* Organização visual da presença digital
* Funil simples de atendimento
* Checklist comercial
* Organização de arquivos no Drive
* Suporte técnico inicial simples, se necessário

Observação:
Os pacotes podem ser ajustados conforme a necessidade do cliente, mantendo escopo claro.

7. Como funciona
   Criar 4 etapas:

8. Diagnóstico
   Entendemos o que o negócio precisa.

9. Proposta
   Definimos escopo, prazo e valor.

10. Produção
    Criamos a entrega combinada.

11. Entrega
    Validamos, entregamos e orientamos o uso.

12. Experiências e projetos
    Usar CardSwap.

Texto:
A Barthy Web Studio nasce da experiência prática com sistemas, produtos digitais, automações, dashboards, documentação técnica e organização operacional.

Importante:
Não expor dados confidenciais, internos ou sensíveis.
Usar descrições genéricas e profissionais.
Criar cards abstratos e elegantes, sem depender de prints reais.

Cards:
Levens / Sistemas internos
Apoio em sistemas internos, testes, documentação, identificação de bugs, fluxos operacionais e melhorias de processos.

PNQC / Programa Nacional de Qualificação de Cuidadores
Projeto de plataforma educacional com trilhas, módulos, autenticação, certificados, estrutura pedagógica digital e organização da jornada do aluno.

Hermes Command Center
Dashboard operacional com CRM, pipeline, financeiro, rotina, relatórios, automações e visão de Personal OS.

GitHub / Vitrine técnica
Organização de código, versionamento, documentação e evolução técnica dos projetos.

9. Cases demonstrativos
   Título:
   Modelos demonstrativos

Texto:
Exemplos visuais de soluções que podem ser adaptadas para diferentes tipos de negócios.

Cards:

* Empresa de eventos: portfólio online + proposta comercial + formulário de orçamento.
* Bar/experiência: página comercial + agenda + link para reservas/WhatsApp.
* Prestador de serviços: link profissional + formulário de orçamento + mensagem comercial.

Indicar visualmente que são modelos demonstrativos, não clientes reais.

10. Captação de orçamento
    Criar seção com CTA para WhatsApp e formulário visual simples.

Campos:

* Nome
* WhatsApp
* Tipo de serviço
* Mensagem

Botão:
Enviar solicitação

Botão alternativo:
Falar pelo WhatsApp

Observação:
O formulário pode ser visual nesta versão, mas deve estar organizado para integração futura.

11. CTA final
    Título:
    Vamos organizar a presença digital do seu negócio?

Texto:
Se você precisa de uma página profissional, proposta comercial, formulário de orçamento ou suporte técnico simples, a Barthy Web Studio pode te ajudar com uma entrega clara e objetiva.

Botão:
Solicitar orçamento pelo WhatsApp

Visual:
Pode usar Plasma Background sutil, mantendo legibilidade.

12. Rodapé

* logo Barthy Web Studio
* slogan
* [contato.barthywebstudio@gmail.com](mailto:contato.barthywebstudio@gmail.com)
* serviços digitais e suporte técnico simples
* placeholder de links: Instagram, LinkedIn, GitHub

Resultado esperado:
Entregar o código completo da primeira versão da landing page institucional da Barthy Web Studio em React + Vite + Tailwind, com:

* identidade visual fiel
* modo claro/escuro
* Plasma Background sutil
* Pricing Plans adaptado
* CardSwap em experiências/projetos
* serviços e pacotes
* projetos e cases demonstrativos
* seção de orçamento
* responsividade
* código componentizado
* build funcionando

Antes de gerar, analise os arquivos anexados, entenda a função de cada um e explique rapidamente a arquitetura que vai criar.
Depois entregue os arquivos/código.
