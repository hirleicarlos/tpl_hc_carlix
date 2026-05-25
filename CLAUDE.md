# CLAUDE.md - tpl_hc_carlix

Leia primeiro `AGENTS.md`. Este arquivo existe para reduzir contexto repetido em
execucoes do Claude.

## Prioridade

1. Seguir `AGENTS.md`.
2. Preservar compatibilidade Joomla 5/6 e PHP 8.3+.
3. Nao recriar o template, o Layout Manager ou o manifesto.
4. Nao reverter alteracoes existentes sem pedido explicito.

## Area principal do projeto

O trabalho costuma cair em quatro pontos:

- `media/js/layout-manager.js`: estado, normalizacao, controles e renderizacao admin.
- `media/css/layout-manager.css`: visual dark do construtor.
- `index.php`: aplicacao frontend do JSON salvo.
- `templateDetails.xml` e arquivos `.ini`: parametros e textos do Joomla.

## Regras praticas

- Use busca direcionada antes de ler arquivos grandes.
- Evite despejar README inteiro no contexto.
- Prefira patches pequenos e verificaveis.
- Se adicionar campo no Layout Manager, garantir leitura/salvamento e normalizacao.
- Se o campo afetar frontend, ajustar tambem `index.php` ou CSS correspondente.
- Nunca quebrar JSON antigo salvo em `layoutManager`.

## Validacao curta

Quando tocar:

- PHP: `php -l arquivo.php`
- JS: `Get-Content -Raw media\js\layout-manager.js | node --check`
- Manifest/assets: conferir `templateDetails.xml` e `joomla.asset.json`

No final, listar arquivos alterados, validacoes e pendencias.

