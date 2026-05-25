---
name: tpl-hc-carlix
description: Work on the HC Carlix Joomla site template, especially Layout Manager changes, Joomla manifest/assets, dark admin controls, vanilla JavaScript UI, and frontend rendering from the saved layoutManager JSON. Use when editing or reviewing the tpl_hc_carlix project.
---

# tpl_hc_carlix Skill

Use this skill for the `tpl_hc_carlix` Joomla template.

## First steps

1. Read `AGENTS.md`.
2. Use `rg` or `rg --files` before opening large files.
3. Identify the exact layer involved: manifest, field, admin JS, admin CSS,
   frontend PHP, frontend CSS, language file, or override.

## Project map

- Manifest: `templateDetails.xml`
- Assets: `joomla.asset.json`
- Frontend render: `index.php`
- Custom admin field: `field/layoutmanager.php`
- Layout Manager UI/state: `media/js/layout-manager.js`
- Layout Manager styles: `media/css/layout-manager.css`
- Frontend behavior: `media/js/template.js`
- Frontend CSS: `media/css/*.css`

## Layout Manager rules

- Preserve existing saved JSON.
- Normalize legacy structures instead of dropping them.
- Use modern switches/toggles for boolean UI.
- Use independent responsive toggles for desktop/tablet/mobile visibility.
- Keep dark admin UI consistent.
- Avoid broad rewrites and cosmetic churn.

## Validation

Run the smallest relevant checks:

```powershell
php -l index.php
php -l field/layoutmanager.php
Get-Content -Raw media\js\layout-manager.js | node --check
```

Report any unavailable command instead of hiding it.
