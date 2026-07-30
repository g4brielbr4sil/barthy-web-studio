# Barthy Web Studio V1

Primeira versão da experiência digital da **Barthy Web Studio**, uma operação própria de soluções digitais para pequenos negócios.

A Barthy Web Studio envolve estratégia, posicionamento, identidade visual, presença digital, desenvolvimento de sites e sistemas, propostas comerciais, CRM, automações, suporte e organização de processos. Este repositório representa somente a primeira versão pública do site da operação.

## Status

- **Versão:** V1
- **Situação:** versão anterior mantida como histórico técnico
- **Direção atual:** [`barthy-web-studio-v2`](https://github.com/g4brielbr4sil/barthy-web-studio-v2)
- **Deploy:** URL pública não documentada neste repositório
- **Licença:** proprietária

A V1 não deve ser substituída, arquivada ou retirada de produção sem comparação com a V2 e aprovação explícita.

## Objetivo da V1

Apresentar a Barthy Web Studio, suas soluções, projetos e processo de trabalho por meio de uma interface técnica, modular e orientada à demonstração de capacidade digital.

## Stack confirmada

### Aplicação

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Material UI
- Emotion
- Radix UI
- GSAP
- Motion
- React Hook Form
- React Router
- Recharts
- Lucide React

### Ferramentas

- pnpm
- Git
- GitHub
- Cloudflare Pages nos previews e validações registradas

## Características técnicas

- temas claro e escuro
- interface responsiva
- componentes reutilizáveis
- animações e interações progressivas
- formulário de contato
- acessibilidade por teclado
- SEO e carregamento revisados
- observabilidade local da experiência
- métricas da sessão sem analytics externo
- lazy loading para recursos técnicos
- tratamento de movimento reduzido

## Histórico de evolução

As Pull Requests da V1 registram trabalhos de:

- refinamento de posicionamento e narrativa
- reorganização de soluções, sistemas e produtos
- acessibilidade
- responsividade
- performance
- SEO
- movimento progressivo
- observabilidade da experiência
- privacidade e sanitização de relatórios

## Estrutura do projeto

```text
src/
  app/
  components/
  hooks/
  lib/
  styles/
  types/
public/
```

A estrutura detalhada deve ser consultada no código da versão atual da branch `main`.

## Requisitos

- Node.js conforme `.nvmrc`
- pnpm conforme `packageManager` no `package.json`

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

## Validação

```bash
pnpm typecheck
pnpm build
pnpm preview
pnpm audit --prod
```

O build de produção é gerado em `dist/`.

## V1 e V2

### V1

- estética dark-first
- estrutura técnica e modular
- conteúdo aprofundado
- maior quantidade de blocos operacionais
- recursos de observabilidade local

### V2

- estética light-first
- direção editorial e cinematográfica
- narrativa mais direta
- progressive enhancement visual
- foco ampliado em projetos e posicionamento

A V1 permanece como evidência da evolução do produto e das decisões de design. A V2 deve assumir o protagonismo do portfólio depois de publicada e validada.

## Screenshots

As imagens da V1 serão produzidas junto com as da V2. As capturas devem usar somente conteúdo aprovado e não podem exibir dados pessoais, leads reais ou informações internas.

## Segurança e privacidade

- variáveis de ambiente não devem ser versionadas
- dados de formulário não devem aparecer em screenshots
- relatórios locais devem permanecer sanitizados
- nenhum analytics externo deve ser ativado sem aprovação
- nenhuma credencial deve usar prefixo `VITE_`

## Próximos passos

- confirmar a URL pública atual da V1
- adicionar screenshots
- documentar arquitetura visual
- validar o CI
- adicionar description e topics no GitHub
- decidir o destino definitivo somente depois da publicação da V2

## Licença

Código, design, marca, conteúdo e documentação são proprietários. Consulte [`LICENSE`](LICENSE).
