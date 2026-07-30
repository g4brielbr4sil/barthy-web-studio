# Revisão de segurança do React Router

## Situação encontrada

A Barthy Web Studio V1 utilizava `react-router` 7.13.0. A auditoria identificou vulnerabilidades altas com correções disponíveis em versões posteriores da mesma major.

## Correção aplicada

A dependência foi atualizada para 7.18.1 e o `pnpm-lock.yaml` foi regenerado pelo pnpm.

Essa atualização corrige os advisories anteriores com patches disponíveis na série 7.x, incluindo os problemas corrigidos a partir das versões 7.13.2, 7.14.0, 7.14.2, 7.15.0 e 7.18.0.

## Advisory RSC remanescente

A auditoria atual também registra um advisory relacionado ao modo React Server Components.

A V1 é uma aplicação cliente construída com React e Vite. Ela não implementa React Server Components, server actions ou endpoints do modo framework afetado.

## Decisão de CI

- typecheck e build permanecem obrigatórios
- o CI bloqueia vulnerabilidades críticas
- advisories altos continuam visíveis e documentados
- a versão não será reduzida apenas para silenciar um advisory de recurso não utilizado
- qualquer adoção futura de SSR, RSC ou server actions exige nova revisão
