<?php

/**
 * HC Carlix - Layout Manager form field.
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

/**
 * Visual layout manager field.
 *
 * The field stores a JSON payload in the regular template params table. The
 * visual interface is handled by media/js/layout-manager.js.
 */
class JFormFieldLayoutmanager extends FormField
{
	/**
	 * Field type.
	 *
	 * @var string
	 */
	protected $type = 'Layoutmanager';

	/**
	 * Hide the default Joomla label. The manager renders its own header.
	 *
	 * @return string
	 */
	protected function getLabel()
	{
		return '';
	}

	/**
	 * Render only the manager markup. This avoids Joomla's empty
	 * control-label column from stealing horizontal space in the admin.
	 *
	 * @param   array  $options  Layout options.
	 *
	 * @return string
	 */
	public function renderField($options = [])
	{
		return $this->getInput();
	}

	/**
	 * Render field input.
	 *
	 * @return string
	 */
	protected function getInput()
	{
		$this->loadAssets();

		$positions     = $this->getTemplatePositions();
		$siteSettings  = $this->getSiteSettings();
		$defaultLayout = $this->getDefaultLayout($siteSettings);
		$value         = is_string($this->value) ? $this->value : '';
		$layout        = $this->decodeLayout($value, $defaultLayout);

		if ($value === '') {
			$value = json_encode($layout, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
		}

		$positionsJson = htmlspecialchars(json_encode($positions, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
		$defaultJson   = htmlspecialchars(json_encode($defaultLayout, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
		$valueAttr     = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
		$fallbackTags  = $this->getFallbackAssetTags();

		return $fallbackTags
			. '<div class="hc-layout-manager-field">'
			. '<input type="hidden" id="' . $this->id . '" name="' . $this->name . '" value="' . $valueAttr . '" data-hc-layout-input>'
			. '<div class="hc-layout-manager" data-hc-layout-manager data-field-id="' . $this->id . '" data-positions="' . $positionsJson . '" data-default-layout="' . $defaultJson . '">'
			. '<div class="hc-lm-header">'
			. '<div>'
			. '<strong>' . Text::_('TPL_HC_CARLIX_LAYOUT_MANAGER_TITLE') . '</strong>'
			. '<p>' . Text::_('TPL_HC_CARLIX_LAYOUT_MANAGER_DESC') . '</p>'
			. '</div>'
			. '<div class="hc-lm-header__actions">'
			. '<button type="button" class="hc-lm-btn hc-lm-btn--light" data-action="open-tools">' . $this->icon('tools') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_TOOLS') . '</span></button>'
			. '</div>'
			. '</div>'
			. '<div class="hc-lm-alerts" data-hc-lm-alerts></div>'
			. '<div class="hc-lm-shell">'
			. '<aside class="hc-lm-panel hc-lm-palette" data-hc-lm-palette>' . $this->renderStaticPalette($layout) . '</aside>'
			. '<main class="hc-lm-panel hc-lm-canvas" data-hc-lm-canvas>' . $this->renderStaticCanvas($layout) . '</main>'
			. '<aside class="hc-lm-panel hc-lm-settings" data-hc-lm-settings>' . $this->renderStaticSettings($layout) . '</aside>'
			. '</div>'
			. '<div class="hc-lm-toasts" data-hc-lm-toasts aria-live="polite" aria-atomic="false"></div>'
			. '<div class="hc-lm-modal" hidden data-hc-lm-tools-modal role="dialog" aria-modal="true" aria-labelledby="' . $this->id . '_tools_title">'
			. '<div class="hc-lm-modal__backdrop" data-action="close-tools"></div>'
			. '<section class="hc-lm-modal__dialog" tabindex="-1" data-hc-lm-tools-dialog>'
			. '<header class="hc-lm-modal__head">'
			. '<div><h3 id="' . $this->id . '_tools_title">' . Text::_('TPL_HC_CARLIX_LAYOUT_TOOLS_TITLE') . '</h3><p>' . Text::_('TPL_HC_CARLIX_LAYOUT_TOOLS_DESC') . '</p></div>'
			. '<button type="button" class="hc-lm-modal__close" data-action="close-tools" aria-label="' . Text::_('JCLOSE') . '">&times;</button>'
			. '</header>'
			. '<div class="hc-lm-tools">'
			. '<section class="hc-lm-tools__section"><h4>' . Text::_('TPL_HC_CARLIX_LAYOUT_EXPORT') . '</h4><p>' . Text::_('TPL_HC_CARLIX_LAYOUT_EXPORT_DESC') . '</p><div class="hc-lm-tools__actions">'
			. '<button type="button" class="hc-lm-btn" data-action="copy-json">' . $this->icon('copy') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_COPY_JSON') . '</span></button>'
			. '<button type="button" class="hc-lm-btn hc-lm-btn--light" data-action="download-json">' . $this->icon('download') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_DOWNLOAD_JSON') . '</span></button>'
			. '</div></section>'
			. '<section class="hc-lm-tools__section"><h4>' . Text::_('TPL_HC_CARLIX_LAYOUT_IMPORT') . '</h4><p>' . Text::_('TPL_HC_CARLIX_LAYOUT_IMPORT_DESC') . '</p>'
			. '<label for="' . $this->id . '_json">' . Text::_('TPL_HC_CARLIX_LAYOUT_JSON_LABEL') . '</label>'
			. '<textarea id="' . $this->id . '_json" rows="10" spellcheck="false" placeholder="' . Text::_('TPL_HC_CARLIX_LAYOUT_JSON_PLACEHOLDER') . '" data-hc-lm-json></textarea>'
			. '<label class="hc-lm-file" for="' . $this->id . '_json_file">' . $this->icon('import') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_UPLOAD_JSON') . '</span></label>'
			. '<input id="' . $this->id . '_json_file" class="hc-lm-file__input" type="file" accept=".json,application/json" data-hc-lm-json-file>'
			. '<div class="hc-lm-tools__actions">'
			. '<button type="button" class="hc-lm-btn" data-action="apply-json">' . $this->icon('import') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_APPLY_JSON') . '</span></button>'
			. '</div></section>'
			. '<section class="hc-lm-tools__section hc-lm-tools__section--danger"><h4>' . Text::_('TPL_HC_CARLIX_LAYOUT_RESET') . '</h4><p>' . Text::_('TPL_HC_CARLIX_LAYOUT_RESET_DESC') . '</p>'
			. '<button type="button" class="hc-lm-btn hc-lm-btn--danger" data-action="reset">' . $this->icon('reset') . '<span>' . Text::_('TPL_HC_CARLIX_LAYOUT_RESET') . '</span></button>'
			. '<div class="hc-lm-reset-confirm" hidden data-hc-lm-reset-confirm><p>' . Text::_('TPL_HC_CARLIX_LAYOUT_RESET_CONFIRM') . '</p><div class="hc-lm-tools__actions">'
			. '<button type="button" class="hc-lm-btn hc-lm-btn--light" data-action="cancel-reset">' . Text::_('JCANCEL') . '</button>'
			. '<button type="button" class="hc-lm-btn hc-lm-btn--danger" data-action="confirm-reset">' . Text::_('TPL_HC_CARLIX_LAYOUT_CONFIRM_RESET') . '</button>'
			. '</div></div></section>'
			. '</div>'
			. '</section>'
			. '</div>'
			. '</div>'
			. '</div>';
	}

	/**
	 * Read site-level layout settings stored as template params.
	 *
	 * @return array<string, string>
	 */
	private function getSiteSettings(): array
	{
		return [
			'bodyBg'               => $this->getParamValue('bodyBg', '#ffffff'),
			'textColor'            => $this->getParamValue('textColor', '#333333'),
			'containerWidthValue'  => $this->getParamValue('containerWidthValue', '1320'),
			'containerWidthUnit'   => $this->getParamValue('containerWidthUnit', 'px'),
			'containerWidthCustom' => $this->getParamValue('containerWidthCustom', ''),
			'backToTop'            => $this->getParamValue('backToTop', '0'),
			'smoothScroll'         => $this->getParamValue('smoothScroll', '1'),
			'reduceMotion'         => $this->getParamValue('reduceMotion', '0'),
			'visibleFocus'         => $this->getParamValue('visibleFocus', '1'),
			'enhancedContrast'     => $this->getParamValue('enhancedContrast', '0'),
		];
	}

	/**
	 * Get another param value from the same field group.
	 */
	private function getParamValue(string $name, string $default = ''): string
	{
		$group = $this->group ?: 'params';
		$value = $this->form ? $this->form->getValue($name, $group, $default) : $default;

		if (is_array($value) || is_object($value)) {
			return $default;
		}

		$value = (string) $value;

		return $value === '' ? $default : $value;
	}

	/**
	 * Register and use admin assets through Joomla Web Asset Manager.
	 *
	 * @return void
	 */
	private function loadAssets(): void
	{
		$wa = Factory::getApplication()->getDocument()->getWebAssetManager();
		$wa->getRegistry()->addTemplateRegistryFile('hc_carlix', 0);

		$wa->registerAndUseStyle(
			'template.hc_carlix.layout-manager.admin',
			'media/templates/site/hc_carlix/css/layout-manager.css',
			['version' => '1.2.17']
		);

		$wa->registerAndUseScript(
			'template.hc_carlix.layout-manager.admin',
			'media/templates/site/hc_carlix/js/layout-manager.js',
			['version' => '1.2.18'],
			['defer' => true]
		);
	}

	/**
	 * Body-level fallback for administrator pages where the document head was
	 * already rendered before the custom field requested its assets.
	 *
	 * @return string
	 */
	private function getFallbackAssetTags(): string
	{
		$base = rtrim(Uri::root(true), '/') . '/media/templates/site/hc_carlix';
		$cssVer = '1.2.17';
		$jsVer  = '1.2.18';

		return '<link rel="stylesheet" href="' . htmlspecialchars($base . '/css/layout-manager.css?' . $cssVer, ENT_QUOTES, 'UTF-8') . '" data-hc-layout-manager-fallback>'
			. '<script defer src="' . htmlspecialchars($base . '/js/layout-manager.js?' . $jsVer, ENT_QUOTES, 'UTF-8') . '" data-hc-layout-manager-fallback></script>';
	}

	/**
	 * Decode stored layout with a safe fallback.
	 *
	 * @param   string  $value    Stored value.
	 * @param   array   $fallback Default layout.
	 *
	 * @return array<string, mixed>
	 */
	private function decodeLayout(string $value, array $fallback): array
	{
		if ($value === '') {
			return $fallback;
		}

		$layout = json_decode($value, true);

		if (!is_array($layout)) {
			return $fallback;
		}

		if (isset($layout['layout']) && is_string($layout['layout'])) {
			$nested = json_decode($layout['layout'], true);
			$layout = is_array($nested) ? $nested : $layout;
		}

		if (isset($layout['sections']) && !isset($layout['items'])) {
			$layout['items'] = $layout['sections'];
		}

		if (!isset($layout['items']) || !is_array($layout['items'])) {
			return $fallback;
		}

		if (!isset($layout['site']) || !is_array($layout['site'])) {
			$layout['site'] = $fallback['site'] ?? $this->site($this->getSiteSettings());
		}

		return $layout;
	}

	/**
	 * Render initial palette before JavaScript hydrates the UI.
	 *
	 * @param   array  $layout  Layout payload.
	 *
	 * @return string
	 */
	private function renderStaticPalette(array $layout): string
	{
		$items = $layout['items'] ?? [];
		$hasHeader = $this->countRootType($items, 'header') > 0;
		$hasFooter = $this->countRootType($items, 'footer') > 0;
		$hasNav = $this->countRootType($items, 'nav') > 0 || $this->hasColumnFlag($items, 'mainNavigation');
		$hasComponent = $this->hasColumnFlag($items, 'componentArea');

		return '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Paleta</h3><p class="hc-lm-panel__hint">Arraste ou clique para montar a estrutura.</p></div></div>'
			. '<div class="hc-lm-palette-list">'
			. $this->paletteButton('header', 'Header', 'Elemento principal. Apenas um.', $hasHeader)
			. $this->paletteButton('nav', 'Nav', 'Menu principal como section. Apenas um.', $hasNav)
			. $this->paletteButton('section', 'Section', 'Área estrutural livre.', false)
			. $this->paletteButton('row', 'Linha', 'Adicionar dentro do item selecionado.', false)
			. $this->paletteButton('column', 'Coluna', 'Adicionar dentro da Linha selecionada.', false)
			. $this->paletteButton('footer', 'Footer', 'Rodapé estrutural. Apenas um.', $hasFooter)
			. '</div>'
			. '<div class="hc-lm-status">'
			. $this->statusItem('Header', $hasHeader ? 1 : 0)
			. $this->statusItem('Main Navigation', $hasNav ? 1 : 0)
			. $this->statusItem('Área do componente', $hasComponent ? 1 : 0)
			. $this->statusItem('Footer', $hasFooter ? 1 : 0)
			. '</div>';
	}

	/**
	 * Render a palette button.
	 */
	private function paletteButton(string $type, string $label, string $help, bool $disabled): string
	{
		return '<button type="button" class="hc-lm-palette-item' . ($disabled ? ' is-disabled' : '') . '" data-action="add-palette" data-type="' . $type . '" aria-disabled="' . ($disabled ? 'true' : 'false') . '" draggable="' . ($disabled ? 'false' : 'true') . '">'
			. '<span class="hc-lm-palette-icon">' . $this->icon($type) . '</span>'
			. '<span><span class="hc-lm-palette-label">' . $label . '</span><span class="hc-lm-palette-help">' . htmlspecialchars($help, ENT_QUOTES, 'UTF-8') . '</span></span>'
			. '</button>';
	}

	/**
	 * Render status row.
	 */
	private function statusItem(string $label, int $count): string
	{
		$class = $count === 1 ? 'hc-lm-badge--ok' : 'hc-lm-badge--warn';

		return '<div class="hc-lm-status__item"><span>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</span><span class="hc-lm-badge ' . $class . '">' . $count . '/1</span></div>';
	}

	/**
	 * Small inline icons used before JavaScript hydrates the interface.
	 */
	private function icon(string $name): string
	{
		$paths = [
			'header' => '<path d="M3 5h18v14H3z"/><path d="M3 9h18"/>',
			'site' => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
			'nav' => '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
			'section' => '<path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 13h5"/>',
			'row' => '<path d="M4 7h16v10H4z"/><path d="M9 7v10"/><path d="M15 7v10"/>',
			'column' => '<path d="M5 4h5v16H5z"/><path d="M14 4h5v16h-5z"/>',
			'footer' => '<path d="M3 5h18v14H3z"/><path d="M3 15h18"/>',
			'tools' => '<path d="M4 7h16"/><path d="M7 7v10"/><path d="M17 7v10"/><path d="M4 17h16"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
			'export' => '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
			'import' => '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
			'copy' => '<path d="M8 8h11v11H8z"/><path d="M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"/>',
			'download' => '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
			'reset' => '<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4v6h-6"/>',
		];

		$path = $paths[$name] ?? '<circle cx="12" cy="12" r="7"/>';

		return '<svg class="hc-lm-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' . $path . '</svg>';
	}

	/**
	 * Render initial visual canvas before JavaScript hydrates the UI.
	 *
	 * @param   array  $layout  Layout payload.
	 *
	 * @return string
	 */
	private function renderStaticCanvas(array $layout): string
	{
		$html = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Construtor</h3><p class="hc-lm-panel__hint">Selecione, ordene e valide a estrutura do template.</p></div></div>';
		$site = is_array($layout['site'] ?? null) ? $layout['site'] : $this->site($this->getSiteSettings());
		$html .= '<div class="hc-lm-canvas-list">';
		$html .= '<div class="hc-lm-node hc-lm-node--site is-selected" data-node-id="' . htmlspecialchars((string) ($site['id'] ?? 'site-root'), ENT_QUOTES, 'UTF-8') . '" data-node-type="site">'
			. '<div class="hc-lm-node__bar" data-action="select" data-id="' . htmlspecialchars((string) ($site['id'] ?? 'site-root'), ENT_QUOTES, 'UTF-8') . '">'
			. '<div class="hc-lm-node__title"><span class="hc-lm-badge">' . $this->icon('site') . '</span><span class="hc-lm-node__name">SITE</span></div>'
			. '</div>'
			. '<div class="hc-lm-node__meta"><span class="hc-lm-badge">Global</span></div>'
			. '<div class="hc-lm-node__body"><div class="hc-lm-site-tree">';

		foreach (($layout['items'] ?? []) as $item) {
			$html .= $this->renderStaticNode($item, false);
		}

		$html .= '</div></div></div></div>';

		return $html;
	}

	/**
	 * Render initial canvas node.
	 *
	 * @param   array  $item     Node item.
	 * @param   bool   $selected First item selected.
	 *
	 * @return string
	 */
	private function renderStaticNode(array $item, bool $selected = false): string
	{
		$type = (string) ($item['type'] ?? 'section');
		$title = (string) ($item['title'] ?? ucfirst($type));
		if ($type === 'row') {
			$title = 'Linha';
		} elseif ($type === 'column') {
			$title = 'Coluna';
		}
		$classes = 'hc-lm-node hc-lm-node--' . $type . ($selected ? ' is-selected' : '') . (($item['enabled'] ?? true) ? '' : ' is-disabled');
		$html = '<div class="' . htmlspecialchars($classes, ENT_QUOTES, 'UTF-8') . '" draggable="true" data-node-id="' . htmlspecialchars((string) ($item['id'] ?? ''), ENT_QUOTES, 'UTF-8') . '" data-node-type="' . htmlspecialchars($type, ENT_QUOTES, 'UTF-8') . '">'
			. '<div class="hc-lm-node__bar" data-action="select" data-id="' . htmlspecialchars((string) ($item['id'] ?? ''), ENT_QUOTES, 'UTF-8') . '">'
			. '<div class="hc-lm-node__title"><span class="hc-lm-badge">' . $this->icon($type) . '</span><span class="hc-lm-node__name">' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</span></div>'
			. '</div>';

		if (in_array($type, ['header', 'nav', 'section', 'footer'], true)) {
			$html .= '<div class="hc-lm-node__body"><div class="hc-lm-row-list">';
			foreach (($item['rows'] ?? []) as $row) {
				$html .= $this->renderStaticNode($row);
			}
			$html .= '</div></div>';
		}

		if ($type === 'row') {
			$html .= '<div class="hc-lm-node__body"><div class="hc-lm-column-list">';
			foreach (($item['columns'] ?? []) as $column) {
				$html .= $this->renderStaticNode($column);
			}
			$html .= '</div></div>';
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Render initial settings shell before JavaScript hydrates the UI.
	 *
	 * @param   array  $layout  Layout payload.
	 *
	 * @return string
	 */
	private function renderStaticSettings(array $layout): string
	{
		return '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Configurações</h3><p class="hc-lm-panel__hint">SITE: configurações globais</p></div></div>'
			. '<div class="hc-lm-form"><section class="hc-lm-form-section"><h4>Carregando campos</h4><p class="hc-lm-panel__hint">O JavaScript do Layout Manager vai abrir as configurações globais automaticamente.</p></section></div>';
	}

	/**
	 * Count root items by type.
	 *
	 * @param   array   $items Root items.
	 * @param   string  $type  Type.
	 *
	 * @return int
	 */
	private function countRootType(array $items, string $type): int
	{
		$count = 0;

		foreach ($items as $item) {
			if (($item['type'] ?? '') === $type) {
				$count++;
			}
		}

		return $count;
	}

	/**
	 * Check if any column has a boolean flag.
	 *
	 * @param   array   $items Root items.
	 * @param   string  $flag  Flag name.
	 *
	 * @return bool
	 */
	private function hasColumnFlag(array $items, string $flag): bool
	{
		foreach ($items as $item) {
			foreach (($item['rows'] ?? []) as $row) {
				foreach (($row['columns'] ?? []) as $column) {
					if (!empty($column[$flag])) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Read positions from templateDetails.xml, preserving manifest order.
	 *
	 * @return array<int, array{value: string, label: string}>
	 */
	private function getTemplatePositions(): array
	{
		$templateDir = dirname(__DIR__);
		$manifest    = $templateDir . '/templateDetails.xml';
		$positions   = [];

		if (is_file($manifest)) {
			$xml = simplexml_load_file($manifest);

			if ($xml && isset($xml->positions->position)) {
				foreach ($xml->positions->position as $position) {
					$name = trim((string) $position);

					if ($name === '' || isset($positions[$name])) {
						continue;
					}

					$positions[$name] = [
						'value' => $name,
						'label' => $name,
					];
				}
			}
		}

		return array_values($positions);
	}

	/**
	 * Default JSON mirrors the current hardcoded template layout.
	 *
	 * @return array<string, mixed>
	 */
	private function getDefaultLayout(array $siteSettings = []): array
	{
		return [
			'version' => 2,
			'site'    => $this->site($siteSettings ?: $this->getSiteSettings()),
			'items'   => [
				$this->section('topbar', 'Topbar', [['topbar-1', 'topbar-2', 'topbar-3', 'topbar-4']], 'container', 'topbar'),
				[
					'id'      => 'header-main',
					'type'    => 'header',
					'title'   => 'Header',
					'enabled' => true,
					'width'   => 'container',
					'mode'    => 'sticky',
					'header'  => [
						'behavior'        => 'always',
						'heightDesktop'   => 'auto',
						'heightTablet'    => 'auto',
						'heightMobile'    => 'auto',
						'sticky'          => true,
						'shrinkOnScroll'  => false,
						'shadowOnScroll'  => true,
						'backgroundScroll'=> true,
						'transitionSpeed' => '220ms',
						'transparentInitial' => false,
						'blurBackground'  => false,
						'overlayContent'  => false,
						'autoBodyOffset'  => true,
					],
					'settings' => $this->settings(''),
					'rows'    => [
						[
							'id'      => 'header-row',
							'type'    => 'row',
							'title'   => 'Header row',
							'width'   => 'inherit',
							'gap'     => 'md',
							'columns' => [
								$this->column('Logo', 'logo', ['phone' => '8', 'largePhone' => '8', 'tablet' => '8', 'smallDesktop' => '3', 'largeDesktop' => '3', 'extraLargeDesktop' => '3']),
								$this->column('Main Navigation', '', ['phone' => '4', 'largePhone' => '4', 'tablet' => '4', 'smallDesktop' => '7', 'largeDesktop' => '7', 'extraLargeDesktop' => '7'], false, true),
								$this->column('Search', 'search', ['phone' => '12', 'largePhone' => '12', 'tablet' => '12', 'smallDesktop' => '2', 'largeDesktop' => '2', 'extraLargeDesktop' => '2']),
							],
						],
					],
				],
				$this->section('banner', 'Banner', [['banner']], 'container', 'banner'),
				$this->section('breadcrumbs', 'Breadcrumbs', [['breadcrumbs']], 'container', 'breadcrumbs'),
				$this->section('top', 'Top', [['top-a', 'top-b', 'top-c', 'top-d']], 'container', 'top'),
				[
					'id'      => 'main-content',
					'type'    => 'section',
					'title'   => 'Main',
					'enabled' => true,
					'width'   => 'container',
					'settings'=> $this->settings(''),
					'rows'    => [
						[
							'id'      => 'main-row',
							'type'    => 'row',
							'title'   => 'Main row',
							'width'   => 'inherit',
							'gap'     => 'md',
							'columns' => [
								$this->column('Sidebar Left', 'sidebar-left', ['phone' => '12', 'largePhone' => '12', 'tablet' => '12', 'smallDesktop' => '2', 'largeDesktop' => '2', 'extraLargeDesktop' => '2']),
								$this->column('Component', '', ['phone' => '12', 'largePhone' => '12', 'tablet' => '12', 'smallDesktop' => '7', 'largeDesktop' => '7', 'extraLargeDesktop' => '7'], true, false),
								$this->column('Sidebar Right', 'sidebar-right', ['phone' => '12', 'largePhone' => '12', 'tablet' => '12', 'smallDesktop' => '3', 'largeDesktop' => '3', 'extraLargeDesktop' => '3']),
							],
						],
					],
				],
				$this->section('bottom', 'Bottom', [['bottom-a', 'bottom-b', 'bottom-c', 'bottom-d']], 'container', 'bottom'),
				$this->section('footer', 'Footer', [['footer-1', 'footer-2', 'footer-3', 'footer-4']], 'container', 'footer'),
				$this->section('credits', 'Credits', [['credits-1', 'credits-2', 'credits-3', 'credits-4']], 'container', 'credits'),
			],
		];
	}

	/**
	 * Create a section item.
	 *
	 * @param   string  $id        Item id.
	 * @param   string  $title     Title.
	 * @param   array   $rows      Position rows.
	 * @param   string  $width     Width mode.
	 * @param   string  $className Extra class.
	 *
	 * @return array<string, mixed>
	 */
	private function section(string $id, string $title, array $rows, string $width, string $className): array
	{
		$itemRows = [];

		foreach ($rows as $index => $positions) {
			$columns = [];
			$count   = max(1, count($positions));
			$desktop = (string) max(1, (int) floor(12 / $count));
			$tablet  = $count <= 2 ? '12' : $desktop;

			foreach ($positions as $position) {
				$columns[] = $this->column(
					ucwords(str_replace(['-', '_'], ' ', $position)),
					$position,
					['phone' => '12', 'largePhone' => '12', 'tablet' => $tablet, 'smallDesktop' => $desktop, 'largeDesktop' => $desktop, 'extraLargeDesktop' => $desktop]
				);
			}

			$itemRows[] = [
				'id'      => $id . '-row-' . ($index + 1),
				'type'    => 'row',
				'title'   => $title . ' row',
				'width'   => 'inherit',
				'gap'     => 'md',
				'columns' => $columns,
			];
		}

		return [
			'id'       => $id . '-section',
			'type'     => $id === 'footer' ? 'footer' : 'section',
			'title'    => $title,
			'enabled'  => true,
			'width'    => $width,
			'settings' => $this->settings($className),
			'rows'     => $itemRows,
		];
	}

	/**
	 * Create the global SITE settings node.
	 *
	 * @param   array<string, string>  $settings  Values read from existing params.
	 *
	 * @return array<string, mixed>
	 */
	private function site(array $settings): array
	{
		return [
			'id'                   => 'site-root',
			'type'                 => 'site',
			'title'                => 'SITE',
			'visual'               => [
				'backgroundType'       => 'color',
				'backgroundColor'      => $settings['bodyBg'] ?? '#ffffff',
				'backgroundGradient'   => '',
				'backgroundImage'      => '',
				'backgroundPosition'   => 'center center',
				'backgroundSize'       => 'cover',
				'backgroundRepeat'     => 'no-repeat',
				'backgroundAttachment' => 'scroll',
				'backgroundOpacity'    => '1',
				'overlayEnabled'       => false,
				'overlayColor'         => 'rgba(0,0,0,.35)',
				'overlayOpacity'       => '0.35',
				'textColor'            => $settings['textColor'] ?? '#333333',
			],
			'containerWidthValue'  => $settings['containerWidthValue'] ?? '1320',
			'containerWidthUnit'   => $settings['containerWidthUnit'] ?? 'px',
			'containerWidthCustom' => $settings['containerWidthCustom'] ?? '',
			'behavior'             => [
				'backToTop'    => (string) ($settings['backToTop'] ?? '0') === '1',
				'smoothScroll' => (string) ($settings['smoothScroll'] ?? '1') === '1',
				'reduceMotion' => (string) ($settings['reduceMotion'] ?? '0') === '1',
			],
			'accessibility'        => [
				'visibleFocus'     => (string) ($settings['visibleFocus'] ?? '1') === '1',
				'reduceMotion'     => (string) ($settings['reduceMotion'] ?? '0') === '1',
				'enhancedContrast' => (string) ($settings['enhancedContrast'] ?? '0') === '1',
			],
			'backToTop'            => (string) ($settings['backToTop'] ?? '0') === '1',
		];
	}

	/**
	 * Create a column item.
	 *
	 * @param   string  $title          Title.
	 * @param   string  $position       Module position.
	 * @param   array   $grid           Grid values.
	 * @param   bool    $componentArea  Whether this column renders component.
	 * @param   bool    $mainNavigation Whether this column renders main menu.
	 *
	 * @return array<string, mixed>
	 */
	private function column(string $title, string $position, array $grid, bool $componentArea = false, bool $mainNavigation = false): array
	{
		return [
			'id'             => 'col-' . strtolower(preg_replace('/[^a-z0-9]+/i', '-', $title)) . '-' . substr(md5($title . $position), 0, 6),
			'type'           => 'column',
			'title'          => $title,
			'position'       => $position,
			'componentArea'  => $componentArea,
			'mainNavigation' => $mainNavigation,
			'grid'           => $grid,
			'settings'       => $this->settings(''),
		];
	}

	/**
	 * Default style/settings payload.
	 *
	 * @param   string  $className  Custom class.
	 *
	 * @return array<string, mixed>
	 */
	private function settings(string $className): array
	{
		return [
			'layout'     => [],
			'visual'     => [
				'backgroundType'       => 'none',
				'backgroundColor'      => '',
				'backgroundGradient'   => '',
				'backgroundImage'      => '',
				'backgroundPosition'   => 'center center',
				'backgroundSize'       => 'cover',
				'backgroundRepeat'     => 'no-repeat',
				'backgroundAttachment' => 'scroll',
				'backgroundOpacity'    => '1',
				'overlayEnabled'       => false,
				'overlayColor'         => 'rgba(0,0,0,.35)',
				'overlayOpacity'       => '0.35',
				'textColor'            => '',
				'linkColor'            => '',
				'hoverColor'           => '',
				'shadow'               => '',
			],
			'border'     => [
				'enabled'           => false,
				'widthTop'          => '',
				'widthRight'        => '',
				'widthBottom'       => '',
				'widthLeft'         => '',
				'widthUnit'         => 'px',
				'style'             => 'solid',
				'color'             => '',
				'radiusTopLeft'     => '',
				'radiusTopRight'    => '',
				'radiusBottomRight' => '',
				'radiusBottomLeft'  => '',
				'radiusUnit'        => 'px',
				'legacyBottom'      => '',
			],
			'spacing'    => [
				'paddingTop'    => '',
				'paddingRight'  => '',
				'paddingBottom' => '',
				'paddingLeft'   => '',
				'paddingUnit'   => 'rem',
				'marginTop'     => '',
				'marginRight'   => '',
				'marginBottom'  => '',
				'marginLeft'    => '',
				'marginUnit'    => 'rem',
			],
			'height'     => [
				'mode'  => 'auto',
				'value' => '',
				'unit'  => 'px',
			],
			'alignment'  => [
				'horizontal' => 'default',
				'vertical'   => 'default',
			],
			'position'   => [
				'type'   => 'default',
				'top'    => '',
				'right'  => '',
				'bottom' => '',
				'left'   => '',
				'unit'   => 'px',
			],
			'overflow'   => [
				'value' => 'default',
				'x'     => 'default',
				'y'     => 'default',
			],
			'responsive' => [
				'hideTablet'            => false,
				'hideMobile'            => false,
				'hideDesktop'           => false,
			],
			'advanced'   => [
				'customClass' => $className,
				'customId'    => '',
				'zIndex'      => '',
				'order'       => '',
			],
		];
	}
}
