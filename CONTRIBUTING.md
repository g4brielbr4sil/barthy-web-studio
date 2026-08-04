# Guia de contribuição

Este repositório usa português do Brasil como idioma principal de documentação, commits e Pull Requests.

## Linguagem

- Escrever de forma clara, direta, natural e profissional.
- Evitar frases genéricas, exageros, jargões desnecessários e tom que pareça produzido automaticamente.
- Manter nomes oficiais de tecnologias, bibliotecas, APIs, comandos, arquivos e identificadores no idioma original.
- Usar primeira pessoa quando o texto representar a atuação, as decisões ou a experiência de Gabriel Brasil.
- Descrever somente funcionalidades, resultados e responsabilidades que possam ser comprovados pelo projeto.
- Diferenciar com clareza o que está concluído, em produção, em desenvolvimento ou planejado.

## Commits

Usar Conventional Commits com o prefixo técnico em inglês e a descrição em português.

```text
<tipo>: <descrição objetiva em português>
```

Tipos principais:

- `feat`: nova funcionalidade
- `fix`: correção de problema
- `docs`: documentação
- `refactor`: reorganização sem mudança funcional intencional
- `test`: testes
- `chore`: manutenção
- `ci`: integração contínua
- `perf`: desempenho
- `security`: segurança

Exemplos:

```text
feat: adicionar filtros ao pipeline
fix: corrigir carregamento do perfil
docs: atualizar README com a arquitetura real
refactor: separar serviços de autenticação
test: cobrir fluxo de recuperação de senha
ci: validar typecheck e build
security: bloquear elevação indevida de permissão
```

Regras:

- Usar verbo no infinitivo.
- Informar a mudança real, sem mensagens vagas como `update`, `changes` ou `ajustes gerais`.
- Manter cada commit focado em uma intenção principal.
- Não reescrever o histórico publicado apenas para traduzir mensagens antigas.

## Pull Requests

O título deve seguir o mesmo padrão dos commits.

```text
docs: padronizar documentação em português
```

A descrição deve explicar:

1. o que mudou
2. por que mudou
3. qual é o impacto
4. como foi validado
5. o que ficou fora do escopo
6. riscos, segurança ou privacidade quando aplicável

Evitar descrições genéricas. Informar arquivos, fluxos e verificações relevantes sem transformar a PR em um relatório artificialmente longo.

## READMEs

Os READMEs devem apresentar o projeto para recrutadores, clientes e desenvolvedores sem perder precisão técnica.

Estrutura recomendada:

1. apresentação do projeto
2. problema ou necessidade atendida
3. solução e principais funcionalidades
4. atuação e responsabilidades
5. arquitetura e tecnologias
6. execução local
7. validação e qualidade
8. segurança e privacidade
9. status, limitações ou roadmap
10. autoria e contato

## Veracidade e segurança

- Não inventar métricas, clientes, usuários, resultados, certificações ou funcionalidades.
- Não publicar credenciais, tokens, bancos, backups, logs, dados pessoais ou informações privadas.
- Não tratar protótipos, mocks ou interfaces demonstrativas como funcionalidades concluídas.
- Registrar limitações reais quando elas forem relevantes para compreender o projeto.
