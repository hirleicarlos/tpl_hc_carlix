# 🎨 HC Carlix — Template Joomla 6 Nativo & Estrutura Base de Layout

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-success)
![Joomla](https://img.shields.io/badge/Joomla-6.x-orange)
![PHP](https://img.shields.io/badge/PHP-8.3%2B-blue)
![CSS](https://img.shields.io/badge/CSS-Nativo%20%7C%20Custom%20Properties-red)
![JS](https://img.shields.io/badge/JS-Vanilla-black)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green)

---

## 📌 Visão Geral

Este repositório contém o template **HC Carlix** para Joomla, construído como uma base própria, nativa e controlável para Joomla 6.

O objetivo do projeto é criar um template limpo, sem dependência de framework visual externo, usando ao máximo a estrutura real do Joomla:

- 🧩 posições de módulos bem distribuídas
- 🧭 menu principal com submenu desktop e offcanvas mobile
- 🧱 layout por seções reutilizáveis
- 🎛 parâmetros administrativos para cores, espaçamentos, SEO, scripts e comportamento do header
- 📚 overrides Joomla preparados para evolução
- 🎨 CSS separado por responsabilidade
- 🧠 HTML semântico para facilitar futuros overrides de componentes
- ⚙ Web Asset Manager do Joomla para carregar CSS/JS corretamente

O projeto separa completamente:

- **Camada de estrutura Joomla** — posições, módulos, menus, chromes e overrides
- **Camada de apresentação** — CSS organizado por responsabilidade
- **Camada de comportamento** — JavaScript puro, sem jQuery
- **Camada administrativa** — parâmetros do template no estilo nativo do Joomla

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
    │   └── menu.css                       ← Menus desktop, vertical e offcanvas
    │
    ├── js/
    │   └── template.js                    ← Offcanvas, submenus mobile, header e back-to-top
    │
    ├── fonts/
    │   ├── inter.woff2                    ← Fonte de corpo/UI
    │   └── roboto.woff2                   ← Fonte de títulos
    │
    └── images/
        ├── hc-carlix_logo.webp            ← Logo padrão
        ├── hc-carlix_retina.webp          ← Logo retina
        └── hc-carlix_icon.webp            ← Favicon/ícone padrão
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
| Alinhamento do menu | Esquerda, centro, direita |
| Largura mínima do submenu | Ex.: `18rem`, `320px`, `clamp(18rem, 24vw, 26rem)` |
| Cor do ícone mobile | Cor do botão hamburguer |

### Submenu desktop

O submenu tem:

- largura mínima via variável `--carlix-submenu-min-width`
- padrão `18rem`, cerca de `288px`
- `max-width` para não estourar a tela
- quebra de linha com `overflow-wrap`
- borda externa
- bordas internas/separadores entre itens
- padding confortável
- suporte a submenu em segundo nível

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

---

## 🎛 Parâmetros Administrativos

Os parâmetros ficam organizados em fieldsets nativos do Joomla:

```text
Geral
Navegação
SEO
Scripts e códigos
Topbar
Header
Banner
Breadcrumbs
Top
Main / Conteúdo
Bottom
Footer
Créditos
```

---

## ⚙️ Geral

| Campo | Descrição |
|------|-----------|
| Logotipo | Logo principal do header |
| Alinhamento da logo | Esquerda, centro ou direita |
| Cor do texto | Cor base do site |
| Cor primária | Cor principal de botões, links e estados |
| Cor secundária | Cor de apoio |
| Largura máxima do container | Padrão `1200px` |
| Favicon | Ícone do site |

### Container

O container global usa:

```css
--carlix-container: 1200px;
```

Valores aceitos:

| Exemplo | Resultado |
|--------|-----------|
| `1200px` | largura fixa máxima |
| `1320px` | container mais largo |
| `90rem` | largura baseada na fonte |
| `full` | largura total com padding |
| `min(1320px, 96vw)` | largura responsiva avançada |

---

## 🧭 Navegação

| Campo | Descrição |
|------|-----------|
| Comportamento do cabeçalho | `static`, `sticky`, `fixed`, `floating` |
| Alinhamento do menu | Esquerda, centro ou direita |
| Largura mínima do submenu | Controla dropdown desktop |
| Cor do ícone do menu mobile | Cor do hamburguer |
| Lado do offcanvas | Direita ou esquerda |
| Logo do menu mobile | Pode ser diferente da logo normal |
| Alinhamento da logo mobile | Esquerda, centro ou direita |
| Altura da logo mobile | Ex.: `2.5rem`, `40px`, `3rem` |
| Botão voltar ao topo | Liga/desliga botão flutuante |

### Header

| Modo | Comportamento |
|-----|---------------|
| `static` | Header rola normalmente |
| `sticky` | Gruda no topo ao rolar |
| `fixed` | Sempre fixo no topo, com compensação de altura via JS |
| `floating` | Header flutuante com sombra ao iniciar rolagem |

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

| Campo | Descrição |
|------|-----------|
| Google Analytics 4 | ID `G-XXXXXXXXXX`, injeta `gtag.js` |
| Código antes de `</head>` | GTM, Search Console, metas extras, pixels |
| Código antes de `</body>` | Noscript, chat, widgets, scripts finais |
| CSS personalizado | CSS extra sem precisar tag `<style>` |

As descrições usam `&lt;head&gt;`, `&lt;/head&gt;`, `&lt;/body&gt;` e `&lt;style&gt;` escapados para não quebrar o formulário do administrator.

---

## 🎨 Parâmetros por Seção

Cada seção visual tem a mesma estrutura de campos:

| Campo | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Cor de fundo | Sim | Herda valor | Herda valor |
| Cor do texto | Sim | Herda valor | Herda valor |
| Cor dos links | Sim | Herda valor | Herda valor |
| Largura do container da seção | Sim | Sim | Sim |
| Espaço superior | Sim | Sim | Sim |
| Espaço inferior | Sim | Sim | Sim |

Seções com parâmetros:

```text
topbar
header
banner
breadcrumbs
top
main
bottom
footer
credits
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
| `--carlix-container` | `1200px` |
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
| `template.hc_carlix.variables` | `variables.css` | `1.0.0` |
| `template.hc_carlix.grid` | `grid.css` | `1.0.0` |
| `template.hc_carlix.template` | `template.css` | `1.0.11` |
| `template.hc_carlix.utilities` | `utilities.css` | `1.0.0` |
| `template.hc_carlix.buttons` | `buttons.css` | `1.0.1` |
| `template.hc_carlix.forms` | `forms.css` | `1.0.1` |
| `template.hc_carlix.elements` | `elements.css` | `1.0.0` |
| `template.hc_carlix.breadcrumbs` | `breadcrumbs.css` | `1.0.1` |
| `template.hc_carlix.hero` | `hero.css` | `1.0.0` |
| `template.hc_carlix.modules` | `modules.css` | `1.0.2` |
| `template.hc_carlix.menu` | `menu.css` | `1.0.11` |
| `template.hc_carlix.template` | `template.js` | `1.0.3` |

### Importante sobre versões

| Tipo | Valor |
|-----|-------|
| Versão pública do template | `1.0.0` |
| Versões de assets | controle interno de cache |

O template só deve mudar de versão pública quando for decidido publicar uma nova versão. Alterações em CSS/JS podem subir versões individuais no `joomla.asset.json` para forçar atualização de cache.

---

## 🧪 Testes e Validação

Comandos usados durante o desenvolvimento:

```bash
php -l index.php
```

```bash
node --check media/js/template.js
```

```bash
node -e "JSON.parse(require('fs').readFileSync('joomla.asset.json','utf8')); console.log('JSON OK')"
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

---

## 📦 Empacotamento

Versão pública atual:

```text
1.0.0
```

Exemplo de empacotamento:

```bash
cd ~/projetos
zip -r tpl_hc_carlix-1.0.0.zip tpl_hc_carlix \
  -x "tpl_hc_carlix/.git/*" \
  -x "tpl_hc_carlix/.idea/*" \
  -x "tpl_hc_carlix/tpl_hc_carlix.zip" \
  -x "tpl_hc_carlix/README.md" \
  -x "tpl_hc_carlix/.gitignore"
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
| Usar fieldsets por seção | Admin fica simples e previsível |
| Usar espaçamentos por device | Desktop, tablet e mobile podem ser diferentes |
| Manter versão pública `1.0.0` | Só muda quando houver decisão de release |
| Escapar tags nas descrições `.ini` | Evita quebrar o formulário do administrator |

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

## 🔮 Próximos Passos

Itens previstos para evolução:

- overrides de `com_content`
- overrides de `com_contact`
- overrides de paginação/listagem
- página de categoria mais refinada
- página de artigo individual
- layout de tags
- tela de busca
- módulos Joomla core com HTML mais semântico
- documentação visual das posições
- wireframe HTML estático das posições
- mais presets de admin para cores e espaçamento

---

## 📬 Autor

**Hirlei Carlos**

Desenvolvedor Full Stack Sênior, com foco em PHP, Joomla, sistemas corporativos e arquitetura web.

---

© 2026 — Hirlei Carlos  
Template Joomla HC Carlix — estrutura própria, nativa e preparada para evolução.
