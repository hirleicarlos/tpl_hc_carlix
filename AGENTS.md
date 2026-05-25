# AGENTS.md - tpl_hc_carlix

Use este arquivo como fonte principal de contexto para agentes no projeto
`tpl_hc_carlix`.

## Escopo

Este repositorio e o template site Joomla `hc_carlix`, com foco em Joomla 5/6,
PHP 8.3+, CSS nativo, JavaScript vanilla e Web Asset Manager.

## Mapa rapido

- `templateDetails.xml`: manifest do template, posicoes, parametros e fieldsets.
- `joomla.asset.json`: declaracao dos assets Joomla.
- `index.php`: renderizacao frontend do template e leitura do JSON do Layout Manager.
- `field/layoutmanager.php`: campo customizado Joomla do Layout Manager.
- `media/js/layout-manager.js`: UI, estado, normalizacao e JSON do Layout Manager.
- `media/css/layout-manager.css`: visual admin dark do Layout Manager.
- `media/js/template.js`: comportamento frontend.
- `media/css/*.css`: CSS frontend separado por responsabilidade.
- `html/`: overrides e chromes Joomla.
- `tpl_hc_carlix.zip`: artefato gerado; nao editar manualmente.

## Fluxo antes de alterar

1. Inspecionar primeiro com `rg` ou `rg --files`.
2. Ler apenas os arquivos diretamente relacionados ao pedido.
3. Preservar alteracoes existentes no worktree; nao reverter trabalho do usuario.
4. Fazer mudancas pequenas e focadas, sem refatorar o template inteiro.
5. Validar sintaxe quando tocar PHP ou JS.

## Regras do Layout Manager

- Preservar compatibilidade do JSON salvo em `layoutManager`.
- Ao mudar estruturas, normalizar dados antigos em `media/js/layout-manager.js`.
- Nao quebrar layouts salvos.
- UI administrativa deve manter dark theme, controles limpos e modernos.
- Booleanos novos devem usar switches/toggles, nao checkbox visual simples.
- Responsivo deve usar toggles independentes:
  - `hideDesktop`
  - `hideTablet`
  - `hideMobile`
- Nao voltar a usar select unico `all/desktop/tablet/mobile/hidden`.
- Evitar scroll da sidebar voltar ao topo ao alterar campos.
- Nao colocar regra pesada no HTML gerado; separar estado/logica/renderizacao.

## SITE no Layout Manager

Manter o SITE organizado em cards/secoes:

- Visual global
- Container
- Comportamento
- Responsivo, quando solicitado

Visual global deve suportar:

- tipo de fundo: nenhum, cor, gradiente, imagem
- cor de fundo do body
- gradiente
- imagem
- background position/size/repeat/attachment
- overlay/opacidade
- cor global do texto

Container deve manter:

- largura do container
- unidade do container
- container custom

Nao mostrar no SITE, salvo pedido explicito:

- cor primaria/secundaria como preset editavel
- placeholders tecnicos como "largura maxima futura"
- secao de acessibilidade

## Frontend

- `index.php` deve continuar Joomla native.
- Usar WebAssetManager para CSS/JS.
- Nao introduzir jQuery.
- Nao depender de Bootstrap no frontend do template.
- Classes responsivas existentes devem continuar funcionando:
  - `carlix-hide-desktop`
  - `carlix-hide-tablet`
  - `carlix-hide-mobile`
- Preservar compatibilidade com Joomla 5/6 e PHP 8.3+.

## CSS

- Manter arquivos CSS separados por responsabilidade.
- Evitar CSS inline grande em PHP/JS.
- Evitar mudancas cosmeticas fora do escopo.
- No Layout Manager, manter UI dark profissional e consistente.

## Validacao recomendada

Quando aplicavel:

```powershell
php -l index.php
php -l field/layoutmanager.php
Get-Content -Raw media\js\layout-manager.js | node --check
rg -n "var_dump|print_r|die\\(|exit\\(" .
```

Se uma ferramenta nao existir no ambiente atual, informar isso no resultado.

## Entrega

Ao finalizar, responder de forma curta:

- arquivos alterados
- o que mudou
- comandos de validacao executados
- pendencias reais, se houver
