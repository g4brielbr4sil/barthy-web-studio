Refine a landing page atual da Barthy Web Studio sem recriar a página do zero. Quero ajustes pontuais de design, animação, logo e hierarquia visual.

Contexto:
A página ficou no caminho certo, mas algumas partes estão travando visualmente e precisam ser refinadas. Preserve a estrutura geral, as seções existentes, a paleta e a direção premium/noturna. Não mude a identidade visual.

Ajustes obrigatórios:

1. Hero title com animação Rolodex / slot machine

Na área principal do hero, onde está o título:

“Presença digital e suporte técnico para pequenos negócios.”

Crie um componente de texto animado para a parte final da frase, com palavras alternando como uma máquina de slot física ou Rolodex.

Exemplo de estrutura:
“Presença digital e suporte técnico para [pequenos negócios / empresas locais / prestadores de serviço / negócios que vendem pelo WhatsApp]”

Regras da animação:

* O texto antigo deve rotacionar 90° para trás no eixo X.
* O novo texto deve subir/vir de baixo, também com rotação no eixo X.
* A animação deve parecer física, como um flip/slot/Rolodex.
* Usar preserve-3d.
* Não cortar a rotação 3D de forma dura.
* O container não pode ser estritamente clipado a ponto de esconder a animação.
* A animação deve ser elegante e premium, não chamativa demais.
* Deve funcionar bem no modo claro e escuro.
* Deve respeitar prefers-reduced-motion, oferecendo fallback sem animação para usuários que reduzem movimento.

Regra crítica de layout:
Esse texto animado será usado inline no título. Ele precisa ficar alinhado à esquerda dentro do próprio container.

Não centralizar o texto animado.
Não criar gaps estranhos quando a palavra muda de tamanho.
A parte animada deve ficar flush/alinhada com o texto anterior, como continuação natural da frase.

2. Reduzir excesso de Terra Orange no hero

Atualmente existem botões/elementos laranja demais na primeira dobra.

Ajustar assim:

* Manter o botão “Solicitar orçamento” do header em Terra Orange como CTA principal.
* No hero, remover o botão laranja inferior ou transformar ele em botão secundário/outline, no mesmo estilo visual do botão “Ver serviços”.
* Deixar apenas o botão do header como CTA laranja mais forte.
* No hero, os CTAs devem ser mais discretos para não competir com o header.
* Terra Orange deve continuar sendo usado apenas em destaques pequenos, botões principais, preços e tags, sem excesso.

3. Ajustar a logo no header

A logo atual ainda não está boa o suficiente.

Use como referência:

* logo horizontal em fundo escuro para o modo escuro
* logo em azul/escura para o modo claro
* monograma BWS apenas como detalhe pequeno, avatar ou favicon

Regras:

* No header, usar a logo horizontal “Barthy Web Studio” como marca principal.
* Não usar apenas o monograma como logo principal.
* Não usar “BX” ou variação visual parecida.
* O monograma BWS pode aparecer como favicon, selo pequeno ou detalhe, mas não deve substituir a logo.
* No modo escuro, usar a versão clara/ice white da logo.
* No modo claro, usar a versão escura/azul da logo.
* Manter o header limpo, premium e bem alinhado.

4. Plasma / animação de fundo

A animação Plasma ficou interessante, mas quero que ela seja aplicada de forma mais refinada.

Direção:

* Usar Plasma como fundo atmosférico sutil da página, não apenas como bloco isolado.
* Pode aparecer no hero e voltar em áreas estratégicas, como CTA final.
* Não deixar o Plasma disputar atenção com o conteúdo.
* Não usar opacidade alta.
* Não usar roxo exagerado, verde neon ou brilho gamer.
* Usar cores da Barthy:

  * #4A7FA7
  * #B3CFE5
  * #0A1931
  * #1B212C
* No mobile, reduzir ou simplificar a animação para performance.
* Garantir que o texto continue altamente legível.

Configuração sugerida:
color="#4A7FA7"
speed={0.18 a 0.30}
direction="forward"
scale={1.15 a 1.4}
opacity={0.14 a 0.26}
mouseInteractive={true no desktop, false no mobile}

5. Alinhamento e respiro geral

Melhorar a hierarquia visual da primeira dobra:

* Melhorar espaçamento entre badge, título, subtítulo e botões.
* Evitar que o hero pareça apertado.
* O título deve ser forte, mas bem equilibrado.
* O subtítulo deve ter largura confortável e boa leitura.
* Os elementos de prova abaixo do hero precisam ficar alinhados e discretos.

6. Não alterar o escopo geral

Não remova as seções principais:

* Serviços
* Suporte de TI
* Pacotes
* Como funciona
* Experiências e projetos
* Cases demonstrativos
* Orçamento/contato
* Rodapé

O foco deste ajuste é:

* hero
* logo/header
* botões
* animação do texto
* plasma/background
* alinhamento visual

7. Regras técnicas

Manter:

* React + Vite + Tailwind
* código componentizado
* modo claro/escuro
* responsividade
* arrays/constantes para dados
* build funcional

Criar ou ajustar componentes:

* AnimatedRolodexText ou RotatingWords
* BarthyLogo com variantes light/dark
* GlobalPlasmaBackdrop ou PlasmaLayer
* Hero refinado

Evitar:

* hardcode duplicado
* cores fora da paleta
* número fake de WhatsApp
* botão verde de WhatsApp
* BWS gigante
* cursor customizado
* neon/glitch/gamer

Resultado esperado:
Refinar a landing page atual, deixando a primeira dobra mais premium, alinhada com a identidade visual da Barthy, com logo correta, botão laranja apenas onde faz sentido, animação Rolodex no título e Plasma Background sutil e bem integrado.
