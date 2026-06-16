# 🎨 HC Carlix — Template Joomla 6 Nativo & Estrutura Base de Layout

![Status](https://img.shields.io/badge/status-ativo-success)
![Joomla](https://img.shields.io/badge/Joomla-6.x-orange)
![PHP](https://img.shields.io/badge/PHP-8.3%2B-blue)
![CSS](https://img.shields.io/badge/CSS-Nativo%20%7C%20Custom%20Properties-red)
![JS](https://img.shields.io/badge/JS-Vanilla-black)
![Version](https://img.shields.io/badge/version-1.2.2-blue)
![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green)

---

## 📌 Visão Geral

Este repositório contém o template **HC Carlix** para Joomla, construído como uma base própria, nativa e controlável para Joomla 6.

O objetivo do projeto é criar um template limpo, sem dependência de framework visual externo, usando ao máximo a estrutura real do Joomla:

- 🧩 posições de módulos bem distribuídas
- 🧭 menu principal com submenu desktop aparente e offcanvas mobile
- 🧱 layout por seções reutilizáveis
- 🎛 parâmetros administrativos para SITE, layout, menu, SEO, scripts e comportamento do header
- 📚 overrides Joomla preparados para evolução
- 🎨 CSS separado por responsabilidade
- 🧠 HTML semântico para facilitar futuros overrides de componentes
- ⚙ Web Asset Manager do Joomla para carregar CSS/JS corretamente

O projeto separa completamente:

- **Camada de estrutura Joomla** — posições, módulos, menus, chromes e overrides
- **Camada de apresentação** — CSS organizado por responsabilidade
- **Camada de comportamento** — JavaScript puro, sem jQuery
- **Camada administrativa** — parâmetros do template no estilo nativo do Joomla

### Estado atual do fonte

- Layout Manager com item `SITE` global para fundo do body, texto, container, comportamento e acessibilidade.
- Controles modernos com toggles, grupos recolhíveis e responsivo por flags independentes.
- Menu desktop com dropdown sempre aparente; offcanvas fica reservado para hamburguer/mobile ou modo escolhido na aba `Menu`.
- Botão hamburguer renderizado como item real do grid do header, antes da logo quando fica à esquerda e como último item quando fica à direita.
- JSON do Layout Manager compactado antes de salvar/exportar para reduzir o tamanho gravado em `params`.
- CSS crítico pequeno no `index.php` para manter header/menu estáveis mesmo quando o Joomla ainda entrega CSS antigo em cache.

---

## 🧭 Filosofia do Projeto

**Joomla native first.**

O HC Carlix não tenta transformar Joomla em outro framework. A ideia é respeitar o CMS, mas limpar a apresentação para que módulos, menus, artigos e componentes fiquem previsíveis.

### Princípios

| Princípio | Aplicação |
|----------|-----------|
| Joomla nativo | Usa posições, módulos, menus, artigos e parâmetros do próprio Joomla |
| CSS organizado | Cada arquivo tem responsabilidade clara |
| Sem Bootstrap obrigatório | Botões, forms, tabelas e listas são estilizados no template |
| Sem jQuery | Interações em JavaScript puro |
| Sem page builder | Layout controlado por posições e CSS |
| Sem CSS por item | Estilo geral para elementos HTML e estruturas Joomla |
| Overrides progressivos | Começa por `mod_menu`, depois evolui para componentes |
| Admin simples | Parâmetros em fieldsets/abas nativas do Joomla |
| Responsivo real | Desktop, tablet e mobile podem ter espaçamentos diferentes |
| Cache controlado | Versões individuais de assets para CSS/JS alterados |

---

## 📁 Estrutura do Projeto

```text
tpl_hc_carlix/
│
├── templateDetails.xml                    ← Manifesto do template Joomla
├── joomla.asset.json                      ← Declaração de assets via Web Asset Manager
├── index.php                              ← Layout principal do site
├── component.php                          ← Layout component-only
├── error.php                              ← Página de erro
├── offline.php                            ← Página offline/manutenção
├── LICENSE                                ← Licença GPL
├── README.md                              ← Documentação do projeto
├── build_template_zip.py                  ← Geração limpa do ZIP do template
│
├── field/
│   └── layoutmanager.php                  ← Campo customizado do Layout Manager
│
├── pt-BR.tpl_hc_carlix.ini                ← Traduções frontend/admin
├── pt-BR.tpl_hc_carlix.sys.ini            ← Traduções de sistema
├── en-GB.tpl_hc_carlix.ini                ← Traduções frontend/admin
├── en-GB.tpl_hc_carlix.sys.ini            ← Traduções de sistema
│
├── html/
│   ├── layouts/
│   │   └── chromes/
│   │       ├── card.php                   ← Chrome de módulo em card
│   │       └── plain.php                  ← Chrome de módulo simples
│   │
│   └── mod_menu/
│       ├── default.php                    ← Override principal do menu
│       ├── default_link.php               ← Link de menu
│       ├── default_url.php                ← URL externa
│       ├── default_component.php          ← Item de componente
│       ├── default_heading.php            ← Heading
│       ├── default_separator.php          ← Separador
│       ├── dropdown-metismenu.php         ← Alias de compatibilidade
│       └── collapse-metismenu.php         ← Alias de compatibilidade
│
└── media/
    ├── css/
    │   ├── variables.css                  ← Tokens globais do template
    │   ├── fonts.css                      ← Fontes self-hosted
    │   ├── grid.css                       ← Grid próprio de 12 colunas
    │   ├── template.css                   ← Estrutura geral e seções
    │   ├── utilities.css                  ← Utilitários gerais
    │   ├── buttons.css                    ← Botões estilo Bootstrap-like
    │   ├── forms.css                      ← Formulários Joomla/HTML
    │   ├── elements.css                   ← Listas, tabelas, alertas, paginação
    │   ├── breadcrumbs.css                ← Breadcrumbs
    │   ├── hero.css                       ← Banners/heros
    │   ├── modules.css                    ← Módulos Joomla
    │   ├── menu.css                       ← Menus desktop, vertical e offcanvas
    │   └── layout-manager.css             ← Interface admin do Layout Manager
    │
    ├── js/
    │   ├── template.js                    ← Offcanvas, submenus mobile, header e back-to-top
    │   └── layout-manager.js              ← Builder visual admin em JavaScript puro
    │
    ├── fonts/
    │   ├── inter.woff2                    ← Fonte de corpo/UI
    │   └── roboto.woff2                   ← Fonte de títulos
    │
    └── images/
        ├── hc-carlix_logo.webp            ← Logo padrão
        ├── hc-carlix_retina.webp          ← Logo retina
        ├── hc-carlix_icon.webp            ← Favicon/ícone padrão
        ├── template_preview.png           ← Prévia exibida no administrator Joomla
        └── template_thumbnail.png         ← Miniatura exibida no administrator Joomla
```

---

## 🧩 Posições Joomla

As posições foram pensadas para testar e povoar o site com recursos reais do Joomla: menus, breadcrumbs, banners, login, artigos, categorias, tags, módulos custom HTML, listas e rodapés.

### Topbar

| Posição | Uso sugerido |
|--------|--------------|
| `topbar-1` | Links rápidos, contato, idioma |
| `topbar-2` | Redes, informações secundárias |
| `topbar-3` | Mensagens curtas |
| `topbar-4` | Login rápido ou ação auxiliar |

### Header

| Posição | Uso sugerido |
|--------|--------------|
| `logo` | Substitui a logo padrão por módulo |
| `menu` | Menu principal desktop e fonte do offcanvas mobile |
| `offcanvas` | Módulos extras dentro do menu mobile |
| `search` | Busca no cabeçalho |

### Conteúdo Superior

| Posição | Uso sugerido |
|--------|--------------|
| `banner` | Banner, hero, `mod_banners` ou custom HTML |
| `breadcrumbs` | Trilha de navegação |
| `top-a` | Card/lista/artigos/categorias |
| `top-b` | Card/lista/artigos/categorias |
| `top-c` | Card/lista/artigos/categorias |
| `top-d` | Card/lista/artigos/categorias |

### Main

| Posição | Uso sugerido |
|--------|--------------|
| `sidebar-left` | Menu lateral, categorias, navegação contextual |
| `main-top` | Módulos antes do componente |
| `main-bottom` | Módulos depois do componente |
| `sidebar-right` | Login, tags, populares, banners, arquivo |

### Bottom, Footer e Credits

| Posição | Uso sugerido |
|--------|--------------|
| `bottom-a` | Bloco inferior 1 |
| `bottom-b` | Bloco inferior 2 |
| `bottom-c` | Bloco inferior 3 |
| `bottom-d` | Bloco inferior 4 |
| `footer-1` | Coluna 1 do footer |
| `footer-2` | Coluna 2 do footer |
| `footer-3` | Coluna 3 do footer |
| `footer-4` | Coluna 4 do footer |
| `credits-1` | Crédito / copyright |
| `credits-2` | Links legais |
| `credits-3` | Menu inferior |
| `credits-4` | Informação extra |

### Outras

| Posição | Uso sugerido |
|--------|--------------|
| `debug` | Debug do Joomla |
| `error-403` | Conteúdo extra para erro 403 |
| `error-404` | Conteúdo extra para erro 404 |

### Posições Extras para o Layout Manager

A próxima fase adiciona posições semânticas e flexíveis sem apagar as antigas.

| Grupo | Posições |
|-------|----------|
| Estrutura | `topbar`, `header`, `navigation`, `navigation-mobile`, `mobile-menu` |
| Header | `header-left`, `header-center`, `header-right` |
| Hero / showcase | `hero`, `hero-top`, `hero-bottom`, `showcase`, `showcase-a`, `showcase-b` |
| Conteúdo | `breadcrumb`, `content-top`, `content-bottom`, `main-top`, `main-bottom` |
| Utilitárias | `utility-a`, `utility-b`, `utility-c` |
| Features | `feature-a`, `feature-b`, `feature-c`, `feature-d` |
| Footer semântico | `footer`, `footer-a`, `footer-b`, `footer-c`, `copyright` |
| Flexíveis | `position-1` até `position-20` |

Todas aparecem automaticamente no select de `Module Position` do Layout Manager porque o campo lê o `templateDetails.xml`.

---

## 🏗 Layout Principal

O `index.php` organiza o site em faixas semânticas:

```text
topbar
header
offcanvas mobile
banner
breadcrumbs
top
main
bottom
footer
credits
debug
```

### Regras de renderização

| Seção | Regra |
|------|-------|
| `topbar` | Só aparece se houver módulo em alguma posição `topbar-*` |
| `header` | Sempre aparece |
| `offcanvas` | Aparece no mobile quando há menu ou módulo em `offcanvas` |
| `banner` | Só aparece se houver módulo em `banner` |
| `breadcrumbs` | Só aparece se houver módulo em `breadcrumbs` |
| `top` | Só aparece se houver módulo em `top-a` até `top-d` |
| `main` | Sempre aparece |
| `bottom` | Só aparece se houver módulo em `bottom-a` até `bottom-d` |
| `footer` | Só aparece se houver módulo em `footer-1` até `footer-4` |
| `credits` | Sempre aparece, com fallback de copyright |

### Colunas automáticas

As faixas `top`, `bottom`, `footer` e `credits` calculam a largura conforme a quantidade de posições publicadas:

| Módulos ativos | Largura |
|---------------|---------|
| 1 | `col-12` |
| 2 | `col-12 col-lg-6` |
| 3 | `col-12 col-lg-4` |
| 4 | `col-12 col-md-6 col-lg-3` |

### Main com sidebars

O conteúdo principal adapta a largura conforme `sidebar-left` e `sidebar-right`:

| Situação | Resultado |
|---------|-----------|
| Sem sidebars | Conteúdo `12/12` |
| Só esquerda | Sidebar `2/12`, conteúdo `10/12` |
| Só direita | Conteúdo `9/12`, sidebar `3/12` |
| Duas sidebars | Esquerda `2/12`, conteúdo `7/12`, direita `3/12` |

---

## 🧱 Layout Manager

O HC Carlix agora possui uma primeira evolução do Layout Manager nativo do template.

Ele continua seguindo a regra principal do projeto:

> O HC Carlix não é page builder. Ele organiza visualmente a estrutura do template usando posições Joomla.

### Onde fica

| Parte | Arquivo |
|------|---------|
| Campo Joomla | `field/layoutmanager.php` |
| Interface visual | `media/js/layout-manager.js` |
| Estilo admin | `media/css/layout-manager.css` |
| Valor salvo | parâmetro `layoutManager` no estilo do template |
| Render frontend | `index.php` |

### Estrutura da interface

| Coluna | Função |
|--------|--------|
| Esquerda | Paleta com ícones para `Header`, `Nav`, `Section`, `Row`, `Column`, `Footer` |
| Centro | Canvas visual amplo com o item raiz `SITE` e a árvore do layout |
| Direita | Configurações do item selecionado |

### Ferramentas do Layout

As ações de JSON ficam em uma modal acessada pelo botão `Ferramentas` no topo do Layout Manager.

| Ação | Comportamento |
|------|---------------|
| Exportar | Copia o JSON atual para a área de transferência ou baixa um arquivo `.json` |
| Importar | Aceita JSON colado em textarea ou upload de arquivo `.json` |
| Reset | Exige confirmação antes de restaurar o layout padrão |

### Regras aplicadas

| Regra | Comportamento |
|-------|---------------|
| SITE | raiz global do layout, sempre selecionável no canvas |
| Header | máximo 1 |
| Nav | máximo 1 |
| Footer | máximo 1 |
| Área do componente | máximo 1 e obrigatória antes de salvar |
| Main Navigation | máximo 1 |
| Nav section x Main Navigation column | não podem coexistir |
| Header/Nav/Footer | minimo 1 Row e podem ter varias Rows |
| Row | pelo menos 1 Column |
| Grid | soma por breakpoint não pode passar de 12 |
| Colunas novas | recalcula automaticamente `12`, `6+6`, `4+4+4`, `3+3+3+3` |
| Gap da Row | liga/desliga gap e salva valor + unidade, iniciando em `15px` |
| Responsivo | usa toggles independentes para ocultar no desktop, tablet e mobile |
| JSON compacto | remove valores vazios/padrão antes de salvar e exportar |
| Header/Nav | mantém dropdown sem clipping, mesmo com configurações visuais de overflow em outros itens |
| Position visual | usa campo CSS livre com chips rápidos, permitindo até duas posições como `center top` |
| Scroll do painel | alterar controles não deve mandar a sidebar de volta para o topo |
| IDs | somente `Header` e `Footer` usam ID; demais estruturas usam classes |

### Validações e avisos

A fase atual `1.2.2` registra a instalação direta do template, mantém os avisos em painel recolhível e documenta o preview/thumbnail usado pelo Joomla.

| Recurso | Comportamento |
|--------|---------------|
| Estado geral | Mostra quantidade de erros, avisos e infos |
| Categorias | `info`, `warning`, `error` |
| Dedupe | Mensagens repetidas são agrupadas |
| Clique no aviso | Seleciona o item relacionado no construtor |
| Fechar aviso | Oculta o aviso atual sem apagar a regra |
| Destaque visual | Item com problema ganha borda discreta |

Também existe um sistema de toast leve para ações como tentar adicionar outro `Header`, `Footer`, `Nav`, `Main Navigation` ou `Área do componente`. Cada bloco usa um único botão de ações com ícone para configurar, adicionar linha/coluna, duplicar, mover e deletar com confirmação.

### Header no Layout Manager

O Header suporta:

| Modo | Comportamento |
|------|---------------|
| `static` | fluxo normal da página |
| `sticky` | acompanha o scroll no topo |
| `fixed` | fica fixo sobre a página |

Configurações disponíveis:

- comportamento `sempre visível` ou `esconder ao descer / mostrar ao subir`
- altura desktop, tablet e mobile
- shrink ao scroll
- sombra ao scroll
- fundo ao scroll
- transparência inicial
- blur
- overlay content
- offset automático do body/main
- cores, imagem de fundo, borda, sombra, padding, margin, classe e id
- ordem semântica do hamburguer no grid do header, sem sobrepor logo, menu ou busca

Quando o hamburguer está à esquerda, ele é renderizado antes da logo. Quando está à direita, ele é renderizado depois dos demais itens do header. Em ambos os casos o botão fica em uma coluna própria e centralizada pela altura do header, evitando posicionamento absoluto sobre a marca.

### JSON

O JSON salvo usa `version: 2`, um objeto `site` e uma lista `items`. Antes de gravar no campo do Joomla ou exportar, o Layout Manager compacta o objeto para preservar somente valores úteis e manter compatibilidade com a coluna `params`.

O objeto `site` guarda as configurações globais:

- `visual.backgroundType`
- `visual.backgroundColor`
- `visual.backgroundGradient`
- `visual.backgroundImage`
- `visual.backgroundPosition`
- `visual.backgroundSize`
- `visual.backgroundRepeat`
- `visual.backgroundAttachment`
- `visual.backgroundOpacity`
- `visual.overlayEnabled`
- `visual.overlayColor`
- `visual.overlayOpacity`
- `visual.textColor`
- `containerWidthValue`
- `containerWidthUnit`
- `containerWidthCustom`
- `responsive.hideDesktop`
- `responsive.hideTablet`
- `responsive.hideMobile`
- `behavior.backToTop`

Cada item estrutural pode ter:

- `type`: `header`, `nav`, `section`, `footer`
- `rows`
- `columns`
- `settings`
- `componentArea`
- `mainNavigation`
- `position`
- `grid` por breakpoint

O `index.php` mantém fallback: se `layoutManager` estiver vazio ou inválido, o layout antigo continua funcionando.

Layouts antigos continuam aceitos. Campos ausentes recebem fallback seguro durante a normalização do JSON, e valores legados de responsivo/menu são convertidos para o padrão atual quando possível.

### Importar e Exportar

A interface tem botões para:

- exportar JSON
- importar JSON
- resetar para o layout padrão

Esse recurso ajuda a testar variações sem transformar o template em construtor de conteúdo.

---

## 🧭 Sistema de Menu

O menu foi uma das primeiras áreas ajustadas, porque o Joomla 6 mudou detalhes do `mod_menu` e o template precisava controlar o layout sem depender do Cassiopeia/Bootstrap.

### Override de `mod_menu`

Arquivos principais:

```text
html/mod_menu/default.php
html/mod_menu/default_link.php
html/mod_menu/default_url.php
html/mod_menu/default_component.php
html/mod_menu/default_heading.php
html/mod_menu/default_separator.php
```

O override:

- renderiza submenus corretamente
- adiciona classes `has-submenu`, `parent`, `deeper`
- aplica `aria-haspopup` nos itens com filhos
- evita layouts herdados de outro template
- mantém aliases de compatibilidade com `dropdown-metismenu.php` e `collapse-metismenu.php`

### Menu desktop

O menu desktop fica horizontal dentro do header.

Parâmetros administrativos:

| Campo | Valores |
|------|---------|
| Tipo de navegação | Somente Menu, Menu + Offcanvas, Somente Offcanvas |
| Alinhamento do menu | Esquerda, centro, direita |
| Largura mínima do submenu | Ex.: `18rem`, `320px`, `clamp(18rem, 24vw, 26rem)` |
| Acionamento do submenu | Hover ou click |
| Direção do submenu | Esquerda ou direita |
| Animação do submenu | Slide, fade ou nenhuma |
| Delay do submenu | Ex.: `0ms`, `120ms`, `0.2s` |

### Submenu desktop

O submenu tem:

- largura mínima via variável `--carlix-submenu-min-width`
- padrão `18rem`, cerca de `288px`
- `max-width` para não estourar a tela
- camada acima de banner, hero e conteúdo principal
- ancestrais de navegação sem clipping para dropdown desktop
- quebra de linha com `overflow-wrap`
- borda externa
- bordas internas/separadores entre itens
- padding confortável
- suporte a submenu em segundo nível

No desktop, submenu é dropdown do menu principal. Ele não deve virar offcanvas nem ficar escondido atrás da seção seguinte.

### Menu vertical

Menus publicados fora do header usam layout vertical:

- blocos com padding
- estados hover/focus
- submenu indentado
- visual de navegação real, não lista crua

### Menu mobile / offcanvas

No mobile, o mesmo módulo da posição `menu` é reaproveitado dentro do offcanvas.

Recursos:

- botão hamburguer
- abertura pela direita ou esquerda
- backdrop
- botão fechar
- tecla `Esc`
- fechamento ao clicar fora
- fechamento ao clicar em link
- focus trap
- submenus fechados por padrão
- submenus abrem por clique/toque
- separadores horizontais entre itens
- área extra para módulos na posição `offcanvas`

O offcanvas é uma gaveta de navegação independente. No mobile ele é o comportamento padrão; no desktop ele aparece somente quando o tipo de navegação escolhido usa hamburguer.

---

## 🎛 Parâmetros Administrativos

Os parâmetros ficam organizados em fieldsets nativos do Joomla:

```text
Geral
Layout
Menu
Código
SEO
Atribuir Menu
```

As antigas guias por seção foram removidas da administração principal. A configuração visual de `SITE`, `Header`, `Nav`, `Section`, `Row`, `Column` e `Footer` fica dentro da guia `Layout`, sempre no painel da direita do Layout Manager.

---

## ⚙️ Geral

### Logo / Identidade

| Campo | Descrição |
|------|-----------|
| Tipo de logo | Radio `Imagem` ou `Texto`; controla a renderização real no frontend |
| Texto da logo | Usado somente no tipo Texto. Se vazio, usa `HC Carlix` |
| Slogan | Usado somente no tipo Texto e renderizado abaixo do nome |
| Logo | Imagem principal, via Media Manager |
| Retina Logo | Versão 2x usada no `srcset` da imagem principal |
| Mobile Logo | Versão alternativa via `<picture>` para telas pequenas |
| Sticky Header Logo | Troca a imagem quando header sticky/fixed/flutuante entra em scroll |
| Logo Alt Text | Texto alternativo da imagem; fallback `HC Carlix` |
| Logo Width / Height | Tamanho opcional. Aceita número em px automático, `px`, `rem`, `em`, `%`, `vw`, `vh` ou `auto` |
| Logo Alignment | Esquerda, centro ou direita |
| Logo Custom Link | Link aplicado na logo textual ou imagem. Padrão: `/` |

### Site

| Campo | Descrição |
|------|-----------|
| Favicon | Ícone do site, via Media Manager |
| Apple Touch Icon | Ícone para atalhos em dispositivos Apple; se vazio, a tag não é renderizada |
| Cor do navegador mobile | Gera `<meta name="theme-color">` no frontend |

Renderização no frontend:

- `Tipo de logo = Texto`: renderiza link textual com `.carlix-logo--text`, título e slogan.
- `Tipo de logo = Imagem`: renderiza link com imagem, `alt`, `srcset` retina, mobile via `<picture>` e dimensões opcionais.
- Se a imagem principal estiver vazia no tipo Imagem, o frontend usa a logo padrão do template.
- A posição Joomla `logo` continua existindo; módulo antigo publicado nela fica como fallback apenas para estilos antigos sem parâmetros novos de identidade salvos.

## 🎨 SITE no Layout Manager

O item `SITE` é a raiz global do construtor. Ao selecionar `SITE`, a coluna direita mostra as configurações globais:

| Campo | Descrição |
|------|-----------|
| Tipo de fundo | Nenhum, cor, gradiente ou imagem |
| Cor de fundo do body | Cor base do fundo do site, com opacidade |
| Gradiente de fundo | Aceita valores CSS como `linear-gradient()` |
| Imagem de fundo | Imagem do Media Manager ou valor CSS como `url()` |
| Background position | Campo livre com chips para montar até duas posições |
| Background size/repeat/attachment | Controles separados para o fundo global |
| Overlay | Cor e opacidade sobre imagem de fundo |
| Cor global do texto | Cor base aplicada no `body` |
| Valor do container | Padrão atual `1320` |
| Unidade do container | `px`, `rem`, `vw` ou `custom` |
| Container custom | Valor avançado como `min(1320px, 96vw)` |
| Botão voltar ao topo | Switch moderno para ligar/desligar botão flutuante |
| Responsivo | Toggles para ocultar no desktop, tablet e mobile |

### Container

O container global usa:

```css
--carlix-container: 1320px;
```

Valores aceitos:

| Exemplo | Resultado |
|--------|-----------|
| `1320px` | largura fixa máxima padrão |
| `90rem` | largura baseada na fonte |
| `full` | largura total com padding |
| `min(1320px, 96vw)` | largura responsiva avançada |

---

## 🧭 Navegação

| Campo | Descrição |
|------|-----------|
| Tipo de navegação | `Somente Menu`, `Menu + Offcanvas`, `Somente Offcanvas` |
| Alinhamento do menu | Esquerda, centro ou direita |
| Largura mínima do submenu | Controla dropdown desktop |
| Acionamento do submenu | Hover/focus ou click |
| Direção do submenu | Dropdown alinhado à esquerda ou direita |
| Animação do submenu | Slide, fade ou sem animação |
| Delay do submenu | Tempo CSS como `0ms`, `120ms` ou `0.2s` |
| Lado do offcanvas | Direita ou esquerda |
| Largura do offcanvas | Ex.: `24rem`, `360px`, `min(24rem, 92vw)` |
| Fundo/texto do offcanvas | Cores da gaveta mobile |
| Overlay/blur/velocidade | Ajustes de fundo e animação |
| Fechar ao clicar em link | Liga/desliga fechamento automático |
| Mostrar logo no offcanvas | Liga/desliga logo do topo da gaveta |
| Logo do menu mobile | Pode ser diferente da logo normal |
| Alinhamento da logo mobile | Esquerda, centro ou direita |
| Altura da logo mobile | Ex.: `2.5rem`, `40px`, `3rem` |
| Botão hamburguer | Posição esquerda/direita, tamanho, cor, fundo, borda e radius |

### Tipos de navegação

| Tipo | Desktop | Mobile |
|-----|---------|--------|
| Somente Menu | Menu horizontal tradicional | Botão hamburguer + offcanvas |
| Menu + Offcanvas | Menu horizontal + botão hamburguer | Botão hamburguer + offcanvas |
| Somente Offcanvas | Botão hamburguer | Botão hamburguer + offcanvas |

### Ordem do hamburguer

O parâmetro de posição do hamburguer aceita `esquerda` ou `direita`.

| Posição | Resultado |
|--------|-----------|
| Esquerda | O botão entra antes da logo, em coluna própria |
| Direita | O botão entra como último item do header, depois de menu/busca |

O botão não usa posição absoluta para montar o layout do header. O grid cria uma trilha automática para o hamburguer e mantém logo, menu e busca sem sobreposição.

O comportamento do `Header` (`static`, `sticky`, `fixed`) fica no item `Header` dentro do Layout Manager, não mais misturado na aba de navegação.

---

## 🔍 SEO

O template tem uma guia própria para SEO global.

| Campo | Função |
|------|-------|
| Sufixo do título | Adiciona texto ao final do title |
| Meta description | Descrição padrão do site |
| Robots | `index/follow`, `noindex`, etc. |
| URL canônica | Canonical fixa, se necessário |
| Open Graph - título | Título para redes sociais |
| Open Graph - descrição | Descrição social |
| Open Graph - imagem | Imagem social padrão |
| Open Graph - tipo | `website` ou `article` |
| Twitter/X card | `summary_large_image` ou `summary` |
| Schema JSON-LD | JSON puro sem tag `<script>` |

### Observação

O Joomla e os componentes ainda podem definir metadados específicos por página, artigo ou item de menu. Esta camada do template serve como base global.

---

## 🔌 Scripts e Códigos

A aba `Código` foi reorganizada em cards técnicos para scripts, CSS, JavaScript, integrações, performance, segurança e desenvolvimento. O campo exclusivo de GA4 foi removido da interface; instalações antigas com `gaId` continuam com fallback no frontend.

| Grupo | Campos principais |
|------|-------------------|
| Scripts Globais | código no `<head>`, após abertura do `<body>`, antes de `</body>` e `noscript` |
| CSS Personalizado | CSS global, desktop, tablet, mobile, crítico e adicional |
| JavaScript Personalizado | JavaScript no head, footer e DOM Ready |
| Integrações & Tracking | GTM, GA, Meta Pixel, TikTok Pixel, Clarity, Hotjar, LinkedIn e verificações |
| Performance Técnica | defer, async, lazy load, font-display, DNS prefetch, preconnect e preloads |
| Segurança | helpers para referrer policy, X-Frame-Options e CSP simples |
| Desenvolvimento | mostrar posições, grid, breakpoints, áreas vazias e desativar minificação/cache |

As descrições usam `&lt;head&gt;`, `&lt;/head&gt;`, `&lt;/body&gt;` e `&lt;style&gt;` escapados para não quebrar o formulário do administrator.

---

## 🎨 Configuração Visual por Item

Cada item selecionado no Layout Manager tem sua própria configuração no painel direito.

| Campo | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Cor de fundo | Sim | Herda valor | Herda valor |
| Cor do texto | Sim | Herda valor | Herda valor |
| Cor dos links | Sim | Herda valor | Herda valor |
| Largura do container da seção | Sim | Sim | Sim |
| Espaço superior | Sim | Sim | Sim |
| Espaço inferior | Sim | Sim | Sim |

Itens configuráveis:

```text
Header
Nav
Section
Footer
Row
Column
```

### Espaçamentos

O template usa unidades CSS reais.

| Valor | Equivalência padrão |
|------|----------------------|
| `0.5rem` | 8px |
| `0.75rem` | 12px |
| `1rem` | 16px |
| `1.5rem` | 24px |
| `2rem` | 32px |
| `2.5rem` | 40px |

Também podem ser usados:

```text
px, rem, em, %, vw, vh, clamp(), min(), max(), calc()
```

---

## 🎨 Design System — variables.css

`variables.css` é a fonte principal de tokens.

### Tipografia

| Token | Valor |
|------|-------|
| `--carlix-font-body` | `Inter`, system-ui |
| `--carlix-font-heading` | `Roboto`, system-ui |
| `--carlix-font-size` | `1rem` |
| `--carlix-line-height` | `1.6` |

### Cores

| Token | Valor padrão |
|------|--------------|
| `--carlix-bg` | `#ffffff` |
| `--carlix-text` | `#333333` |
| `--carlix-heading` | `#111111` |
| `--carlix-muted` | `#555555` |
| `--carlix-border` | `#e6e6e6` |
| `--carlix-primary` | `#d32f2f` |
| `--carlix-secondary` | `#151515` |

### Layout

| Token | Valor |
|------|-------|
| `--carlix-container` | `1320px` |
| `--carlix-grid-gap` | `1.5rem` |
| `--carlix-radius` | `0.5rem` |
| `--carlix-radius-lg` | `1rem` |

### Espaçamento

| Token | Valor |
|------|-------|
| `--carlix-space-1` | `0.25rem` |
| `--carlix-space-2` | `0.5rem` |
| `--carlix-space-3` | `0.75rem` |
| `--carlix-space-4` | `1rem` |
| `--carlix-space-6` | `1.5rem` |
| `--carlix-space-8` | `2rem` |
| `--carlix-space-12` | `3rem` |
| `--carlix-space-16` | `4rem` |

---

## 🧱 Arquitetura CSS

O CSS é separado por responsabilidade.

| Arquivo | Responsabilidade |
|--------|------------------|
| `variables.css` | Tokens globais |
| `fonts.css` | Fontes locais |
| `grid.css` | Grid próprio |
| `template.css` | Estrutura geral e seções |
| `utilities.css` | Utilitários |
| `buttons.css` | Botões e variações |
| `forms.css` | Inputs, selects, textarea, checkbox, radio |
| `elements.css` | Tabelas, listas, alertas, badges, paginação |
| `breadcrumbs.css` | Breadcrumbs |
| `hero.css` | Banner/hero |
| `modules.css` | Módulos Joomla |
| `menu.css` | Menus desktop, vertical e mobile |

### Regras que seguimos

- não criar CSS por item específico
- preferir seletores gerais e semânticos
- manter CSS de menu no `menu.css`
- manter forms no `forms.css`
- manter tabelas/listas/paginação no `elements.css`
- manter seções e layout estrutural no `template.css`
- usar variáveis `--carlix-*`

---

## 🔘 Botões

`buttons.css` cria uma base semelhante à lógica do Bootstrap, mas sem carregar Bootstrap.

Classes suportadas:

```text
.btn
.hc-button
.btn-primary
.btn-secondary
.btn-success
.btn-danger
.btn-warning
.btn-info
.btn-light
.btn-dark
.btn-outline-primary
.btn-outline-secondary
.btn-outline-success
.btn-outline-danger
.btn-outline-warning
.btn-outline-info
.btn-outline-light
.btn-outline-dark
.btn-link
.btn-sm
.btn-lg
.btn-block
.btn-group
.btn-toolbar
```

Também estiliza:

```text
button[type="submit"]
button[type="button"]
button[type="reset"]
input[type="submit"]
input[type="button"]
input[type="reset"]
```

---

## 🧾 Formulários

`forms.css` cobre formulários Joomla e HTML:

- `fieldset`
- `legend`
- labels
- `.form-group`
- `.control-group`
- `.controls`
- `.input-group`
- `.input-append`
- `.input-prepend`
- `.form-control`
- `.form-select`
- `.inputbox`
- checkbox/radio
- estados disabled/readonly
- estados valid/invalid
- login module

---

## 📋 Elementos HTML

`elements.css` cobre elementos de conteúdo:

- parágrafos
- `lead`
- `small`
- `hr`
- `blockquote`
- `code`
- `kbd`
- `pre`
- listas ordenadas e não ordenadas
- listas inline
- `dl`, `dt`, `dd`
- tabelas
- tabelas responsivas
- alertas
- badges
- paginação
- navegação artigo anterior/próximo

Classes úteis:

```text
.table
.table-striped
.table-hover
.table-bordered
.table-responsive
.alert
.alert-success
.alert-info
.alert-warning
.alert-danger
.badge
.pagination
.pager
```

---

## 🧩 Módulos Joomla

`modules.css` organiza os módulos para não ficarem com aparência de lista crua.

Já foram ajustados:

- módulos laterais
- listas de categorias
- artigos populares/mais lidos
- arquivo de artigos
- módulos custom HTML
- espaçamento interno em menus/listas laterais
- cards para posições de topo/bottom
- imagens dentro de módulos

### Chromes

| Chrome | Arquivo | Uso |
|-------|---------|-----|
| `card` | `html/layouts/chromes/card.php` | Módulo com título e borda |
| `plain` | `html/layouts/chromes/plain.php` | Módulo simples com título |
| `none` | padrão Joomla | Sem wrapper extra |

---

## 📱 JavaScript — template.js

O JavaScript é puro, sem jQuery.

Recursos:

| Recurso | Descrição |
|--------|-----------|
| Offcanvas mobile | Abre/fecha menu mobile |
| Focus trap | Mantém foco dentro do offcanvas aberto |
| ESC | Fecha offcanvas |
| Backdrop | Clique fora fecha |
| Submenu mobile | Abre por clique/toque |
| Reset de submenu | Fecha submenus ao fechar offcanvas |
| Desktop breakpoint | Fecha offcanvas ao voltar para desktop |
| Back to top | Botão aparece após rolagem |
| Header fixed | Calcula altura para compensar conteúdo |
| Header floating/sticky | Adiciona classe ao rolar |

---

## 🌐 Web Asset Manager

Todos os assets são declarados em `joomla.asset.json`.

| Asset | Arquivo | Versão atual |
|------|---------|--------------|
| `template.hc_carlix.variables` | `variables.css` | `1.2.2` |
| `template.hc_carlix.grid` | `grid.css` | `1.0.1` |
| `template.hc_carlix.template` | `template.css` | `1.0.29` |
| `template.hc_carlix.utilities` | `utilities.css` | `1.0.1` |
| `template.hc_carlix.buttons` | `buttons.css` | `1.0.1` |
| `template.hc_carlix.forms` | `forms.css` | `1.0.1` |
| `template.hc_carlix.elements` | `elements.css` | `1.0.0` |
| `template.hc_carlix.breadcrumbs` | `breadcrumbs.css` | `1.0.1` |
| `template.hc_carlix.hero` | `hero.css` | `1.0.0` |
| `template.hc_carlix.modules` | `modules.css` | `1.0.2` |
| `template.hc_carlix.menu` | `menu.css` | `1.2.8` |
| `template.hc_carlix.template` | `template.js` | `1.2.3` |
| `template.hc_carlix.layout-manager` | `layout-manager.css` | `1.2.17` |
| `template.hc_carlix.layout-manager` | `layout-manager.js` | `1.2.18` |

### Importante sobre versões

| Tipo | Valor |
|-----|-------|
| Versão pública do template | `1.2.2` |
| Estado da documentação | `1.2.2` |
| Versões de assets | controle interno de cache |

O template só deve mudar de versão pública quando for decidido publicar uma nova versão. Alterações em CSS/JS podem subir versões individuais no `joomla.asset.json` para forçar atualização de cache.

O `index.php` também contém um bloco mínimo de CSS crítico para header/menu. Ele existe para proteger o frontend quando uma instalação de teste ainda entrega `template.css` ou `menu.css` antigos pelo cache do Joomla/navegador. A fonte de verdade continua nos arquivos CSS do template.

---

## 🧪 Testes e Validação

Comandos usados durante o desenvolvimento:

```bash
php -l index.php
```

```bash
php -l field/layoutmanager.php
```

```bash
node --check media/js/template.js
```

```bash
node --check media/js/layout-manager.js
```

```bash
node -e "JSON.parse(require('fs').readFileSync('joomla.asset.json','utf8')); console.log('JSON OK')"
```

```bash
git diff --check -- README.md .gitignore index.php media/css/menu.css media/css/template.css media/js/layout-manager.js
```

Validação XML via PowerShell:

```powershell
try {
  [xml](Get-Content -Raw templateDetails.xml) | Out-Null
  'XML OK'
} catch {
  $_.Exception.Message
  exit 1
}
```

Limpar cache no ambiente Docker usado para testes:

```bash
docker exec php_server php /var/www/html/joomla6/cli/joomla.php cache:clean
```

---

## 🛠 Fluxo de Trabalho do Projeto

Este repositório é o código-fonte do template.

### Projeto fonte

```text
tpl_hc_carlix/
```

Uso:

- editar PHP
- editar CSS
- editar JS
- editar manifest
- editar idiomas
- preparar overrides
- documentar o projeto

### Joomla de teste

```text
joomla6/
```

Uso:

- criar módulos
- criar menus
- criar artigos
- testar posições
- povoar conteúdo inicial
- validar comportamento no administrator/frontend

### Regra combinada

O pacote ZIP e a instalação/atualização do template ficam a cargo do mantenedor do projeto.

O desenvolvimento deve evitar alterações diretas no core do Joomla. Quando houver ajuste emergencial no runtime de teste, ele deve ser refletido no projeto fonte.

### GitHub Desktop no Windows + WSL

Para adicionar este repositório local no GitHub Desktop, use `File` → `Add local repository` e informe:

```text
\\wsl.localhost\Ubuntu\home\hirleicarlos\projetos\meg-load\tpl_hc_carlix
```

Se o GitHub Desktop avisar que o repositório pertence a outro usuário, marque a pasta como segura no Git do Windows:

```powershell
git config --global --add safe.directory '//wsl.localhost/Ubuntu/home/hirleicarlos/projetos/meg-load/tpl_hc_carlix'
```

---

## 📦 Empacotamento

Versão pública atual:

```text
1.2.2
```

Para instalar como template direto, o `templateDetails.xml` precisa ficar na raiz do ZIP. Entre na pasta do template e compacte o conteúdo dela, sem colocar a pasta `tpl_hc_carlix/` como primeiro nível do arquivo.

Exemplo de ZIP manual do template:

```bash
cd ~/projetos/meg-load/tpl_hc_carlix
zip -r ../tpl_hc_carlix-1.2.2.zip . \
  -x ".git/*" \
  -x ".idea/*" \
  -x "tpl_hc_carlix.zip" \
  -x "README.md" \
  -x ".gitignore" \
  -x "AGENTS.md" \
  -x "CLAUDE.md" \
  -x "CODEX.md" \
  -x "SKILL.md" \
  -x "build_template_zip.py"
```

Opcionalmente, gere o ZIP limpo do template com:

```bash
python3 build_template_zip.py
```

Instalação pelo Joomla:

```text
Sistema → Instalar → Extensões → Carregar pacote
```

Depois:

```text
Sistema → Estilos do site → HC Carlix
```

---

## 🧠 Decisões Técnicas Já Tomadas

| Decisão | Motivo |
|--------|--------|
| Manter Joomla nativo | Facilita manutenção e evita lock-in |
| Não usar Bootstrap como dependência | Template controla sua própria UI |
| Criar `buttons.css`, `forms.css`, `elements.css` | Padronizar HTML comum sem CSS por item |
| Separar `menu.css` | Menu tem regras próprias desktop/mobile |
| Reaproveitar o mesmo menu no offcanvas | Evita duplicar estrutura no Joomla |
| Criar posição `offcanvas` | Permite testar módulos dentro do menu mobile |
| Concentrar seções no Layout Manager | Evita abas duplicadas e coloca a configuração visual no item certo |
| Usar espaçamentos por device | Desktop, tablet e mobile podem ser diferentes dentro do layout |
| Registrar versão `1.2.2` | Instalação direta do template, preview/thumbnail no Joomla e remoção do fluxo de pacote |
| Escapar tags nas descrições `.ini` | Evita quebrar o formulário do administrator |
| Manter skip link semântico | Link de acessibilidade fica visualmente oculto até receber foco |
| Evitar offcanvas para submenu desktop | Dropdown desktop precisa permanecer aparente e acima do conteúdo |

---

## 🧾 Correção Importante no Administrator

Durante os testes, o administrator apresentava:

```text
Uncaught TypeError: can't access property "value", r.task is undefined
```

Causa:

- descrições de idioma continham tags literais como `<style>`, `<head>` e `</body>`
- o Joomla renderiza descrições no HTML do formulário
- o navegador interpretava essas tags como HTML real
- o campo hidden `task` deixava de existir no DOM do formulário

Correção:

```text
<style>  → &lt;style&gt;
<head>   → &lt;head&gt;
</head>  → &lt;/head&gt;
</body>  → &lt;/body&gt;
```

Resultado:

- `Salvar` voltou a funcionar
- `Salvar & Fechar` voltou a funcionar
- `Fechar` voltou a funcionar
- formulário voltou a conter `[name="task"]`

---

## 📬 Contato

- 🌐 Site: [hirleicarlos.github.io](https://hirleicarlos.github.io)
- 💼 LinkedIn: [linkedin.com/in/hirleicarlos](https://linkedin.com/in/hirleicarlos)
- 🐙 GitHub: [github.com/hirleicarlos](https://github.com/hirleicarlos)
- ✉️ E-mail: prof.hirleicarlos@gmail.com

---

© 2026 — Hirlei Carlos<br>
Desenvolvedor Full Stack Sênior | PHP & Joomla | Sistemas Corporativos | Docker | Governo e Educação
