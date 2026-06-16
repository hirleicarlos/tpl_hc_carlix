<?php

/**
 * HC Carlix Template for Joomla 6.x — organização das seções/posições.
 *
 * SEÇÃO   = faixa full-width (só renderiza se algum slot tiver módulo;
 *           HEADER/MAIN/CREDITS sempre). Gate via countModules(p).
 * POSIÇÃO = ID único de slot (Joomla position).
 * COLUNA  = grid.css. A largura da coluna em uma faixa é calculada pelo
 *           número de posições preenchidas (1=100, 2=50/50, 3=33, 4=25).
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix
 * @version     1.2.2
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Document\HtmlDocument;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\Registry\Registry;

/** @var HtmlDocument $this */

$app    = Factory::getApplication();
$wa     = $this->getWebAssetManager();
$params = $this->params;

$siteNameRaw = (string) $app->get('sitename');
$siteName    = htmlspecialchars($siteNameRaw, ENT_QUOTES, 'UTF-8');

$cssValue = static function (string $name, string $default) use ($params): string {
	$value = trim((string) $params->get($name, $default));

	if ($value === '') {
		$value = $default;
	}

	return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
};

$dimensionValue = static function (string $valueName, string $unitName, string $customName, string $legacyName, string $defaultValue, string $defaultUnit) use ($params): string {
	$legacy = trim((string) $params->get($legacyName, ''));
	$value  = trim((string) $params->get($valueName, $defaultValue));
	$unit   = trim((string) $params->get($unitName, $defaultUnit));
	$custom = trim((string) $params->get($customName, ''));

	if ($legacy !== '' && $params->get($valueName, null) === null) {
		return $legacy;
	}

	if ($unit === 'full') {
		return 'full';
	}

	if ($unit === 'custom') {
		return $custom !== '' ? $custom : $defaultValue . $defaultUnit;
	}

	$allowedUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];
	$unit = in_array($unit, $allowedUnits, true) ? $unit : $defaultUnit;
	$value = $value !== '' ? $value : $defaultValue;

	return $value . $unit;
};

$layoutRaw = trim((string) $params->get('layoutManager', ''));
$decodeLayout = static function (string $raw): array {
	if ($raw === '') {
		return [];
	}

	$layout = json_decode($raw, true);

	if (!is_array($layout)) {
		return [];
	}

	if (isset($layout['layout']) && is_string($layout['layout'])) {
		$nested = json_decode($layout['layout'], true);
		$layout = is_array($nested) ? $nested : $layout;
	}

	if (isset($layout['sections']) && !isset($layout['items'])) {
		$layout['items'] = $layout['sections'];
	}

	if (!isset($layout['items']) && array_is_list($layout)) {
		$layout = ['version' => 2, 'items' => $layout];
	}

	return isset($layout['items']) && is_array($layout['items']) ? $layout : [];
};

$managedLayout = $decodeLayout($layoutRaw);
$useManagedLayout = !empty($managedLayout['items']);
$layoutSite = is_array($managedLayout['site'] ?? null) ? $managedLayout['site'] : [];

$sitePathValue = static function (array $source, string $path) {
	$current = $source;

	foreach (explode('.', $path) as $part) {
		if (!is_array($current) || !array_key_exists($part, $current)) {
			return null;
		}

		$current = $current[$part];
	}

	return $current;
};

$siteHasPath = static function (array $source, string $path) use ($sitePathValue): bool {
	$value = $sitePathValue($source, $path);

	return $value !== null && $value !== '';
};

$siteParam = static function (string $layoutKey, string $legacyKey, string $default) use ($layoutSite, $params, $sitePathValue): string {
	$value = $sitePathValue($layoutSite, $layoutKey);
	$aliases = [
		'backgroundType' => ['visual.backgroundType', 'background_type'],
		'backgroundColor' => ['visual.backgroundColor', 'bodyBg', 'body_background', 'background_color'],
		'backgroundGradient' => ['visual.backgroundGradient', 'background_gradient'],
		'backgroundImage' => ['visual.backgroundImage', 'background_image'],
		'backgroundPosition' => ['visual.backgroundPosition', 'background_position'],
		'backgroundSize' => ['visual.backgroundSize', 'background_size'],
		'backgroundRepeat' => ['visual.backgroundRepeat', 'background_repeat'],
		'backgroundAttachment' => ['visual.backgroundAttachment', 'background_attachment'],
		'backgroundOpacity' => ['visual.backgroundOpacity', 'background_opacity'],
		'overlayColor' => ['visual.overlayColor', 'overlay_color'],
		'overlayOpacity' => ['visual.overlayOpacity', 'overlay_opacity'],
		'bodyBg' => ['visual.backgroundColor', 'body_background'],
		'textColor' => ['visual.textColor', 'text_color'],
		'primaryColor' => ['primary_color'],
		'secondaryColor' => ['secondary_color'],
		'containerWidthValue' => ['container_value'],
		'containerWidthUnit' => ['container_unit'],
		'containerWidthCustom' => ['container_custom'],
		'backToTop' => ['behavior.backToTop', 'back_to_top'],
	];

	foreach (($aliases[$layoutKey] ?? []) as $alias) {
		if ($value !== null && $value !== '') {
			break;
		}

		$value = $sitePathValue($layoutSite, $alias);
	}

	if ($value === null) {
		$snake = strtolower((string) preg_replace('/(?<!^)[A-Z]/', '_$0', $layoutKey));
		$value = $sitePathValue($layoutSite, $snake);
	}

	if ($value === null || $value === '') {
		$value = $params->get($legacyKey, $default);
	}

	$value = is_scalar($value) ? trim((string) $value) : $default;

	return $value === '' ? $default : $value;
};

$siteBool = static function (string $layoutKey, string $legacyKey, bool $default = false) use ($layoutSite, $params, $sitePathValue): bool {
	$value = $sitePathValue($layoutSite, $layoutKey);
	$aliases = [
		'backToTop' => ['behavior.backToTop', 'back_to_top'],
		'smoothScroll' => ['behavior.smoothScroll', 'smooth_scroll'],
		'reduceMotion' => ['behavior.reduceMotion', 'accessibility.reduceMotion', 'reduce_motion'],
		'visibleFocus' => ['accessibility.visibleFocus', 'visible_focus', 'focusVisible', 'focus_visible'],
		'enhancedContrast' => ['accessibility.enhancedContrast', 'enhanced_contrast'],
		'overlayEnabled' => ['visual.overlayEnabled', 'overlay_enabled'],
	];

	foreach (($aliases[$layoutKey] ?? []) as $alias) {
		if ($value !== null && $value !== '') {
			break;
		}

		$value = $sitePathValue($layoutSite, $alias);
	}

	if ($value === null) {
		$snake = strtolower((string) preg_replace('/(?<!^)[A-Z]/', '_$0', $layoutKey));
		$value = $sitePathValue($layoutSite, $snake);
	}

	if ($value === null || $value === '') {
		$value = $params->get($legacyKey, $default ? 1 : 0);
	}

	return $value === true || (string) $value === '1' || strtolower((string) $value) === 'true';
};

$siteDimensionValue = static function () use ($siteParam): string {
	$value = $siteParam('containerWidthValue', 'containerWidthValue', '1320');
	$unit = $siteParam('containerWidthUnit', 'containerWidthUnit', 'px');
	$custom = $siteParam('containerWidthCustom', 'containerWidthCustom', '');

	if ($unit === 'full') {
		return 'full';
	}

	if ($unit === 'custom') {
		return $custom !== '' ? $custom : '1320px';
	}

	$allowedUnits = ['px', 'rem', '%', 'vw'];
	$unit = in_array($unit, $allowedUnits, true) ? $unit : 'px';
	$value = preg_match('/^\d+(\.\d+)?$/', $value) ? $value : '1320';

	return $value . $unit;
};

$siteMediaCssValue = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	if (preg_match('/^(url|image-set|var|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient)\(/i', $value)) {
		return $value;
	}

	$value = preg_replace('#^local-images:/#', 'images/', $value);
	$value = preg_replace('#^local-files:/#', 'files/', $value);
	$clean = HTMLHelper::cleanImageURL($value)->url;

	if (!preg_match('#^https?://#i', $clean)) {
		$clean = Uri::root(true) . '/' . ltrim($clean, '/');
	}

	return 'url("' . str_replace('"', '%22', $clean) . '")';
};

$siteBackgroundType = $siteParam('backgroundType', 'siteBackgroundType', 'none');
$siteBackgroundColor = $siteParam('backgroundColor', 'bodyBg', '#ffffff');
$siteBackgroundGradient = $siteParam('backgroundGradient', 'siteBackgroundGradient', '');
$siteBackgroundImage = $siteParam('backgroundImage', 'siteBackgroundImage', '');
$siteHasBackgroundType = $siteHasPath($layoutSite, 'visual.backgroundType')
	|| $siteHasPath($layoutSite, 'backgroundType')
	|| $siteHasPath($layoutSite, 'background_type');

if (!$siteHasBackgroundType && $siteBackgroundType === 'none') {
	$siteBackgroundType = $siteBackgroundImage !== '' ? 'image' : ($siteBackgroundGradient !== '' ? 'gradient' : ($siteBackgroundColor !== '' ? 'color' : 'none'));
}

$siteTextColor = $siteParam('textColor', 'textColor', '#333333');
$siteSmoothScroll = $siteBool('smoothScroll', 'smoothScroll', true);
$siteReduceMotion = $siteBool('reduceMotion', 'reduceMotion', false);
$siteVisibleFocus = $siteBool('visibleFocus', 'visibleFocus', true);
$siteEnhancedContrast = $siteBool('enhancedContrast', 'enhancedContrast', false);

$sectionDefaults = [
	'topbar' => ['bg' => '#151515', 'text' => '#f5f5f5', 'link' => '#ffffff', 'top' => '0.5rem', 'bottom' => '0.5rem'],
	'header' => ['bg' => '#ffffff', 'text' => '#1a1a1a', 'link' => '#d32f2f', 'top' => '1rem', 'bottom' => '1rem'],
	'banner' => ['bg' => '#ffffff', 'text' => '#333333', 'link' => '#d32f2f', 'top' => '1.5rem', 'bottom' => '1rem'],
	'breadcrumbs' => ['bg' => '#ffffff', 'text' => '#555555', 'link' => '#d32f2f', 'top' => '0.75rem', 'bottom' => '0.75rem'],
	'top' => ['bg' => '#ffffff', 'text' => '#333333', 'link' => '#d32f2f', 'top' => '2rem', 'bottom' => '2rem'],
	'main' => ['bg' => '#ffffff', 'text' => '#333333', 'link' => '#d32f2f', 'top' => '2rem', 'bottom' => '2rem'],
	'bottom' => ['bg' => '#f3f6f7', 'text' => '#333333', 'link' => '#d32f2f', 'top' => '2rem', 'bottom' => '2rem'],
	'footer' => ['bg' => '#d32f2f', 'text' => '#ffffff', 'link' => '#ffffff', 'top' => '2.5rem', 'bottom' => '2.5rem'],
	'credits' => ['bg' => '#a51f1f', 'text' => '#ffffff', 'link' => '#ffffff', 'top' => '0.75rem', 'bottom' => '0.75rem'],
];

$siteBackgroundBase = $siteBackgroundColor !== '' ? $siteBackgroundColor : '#ffffff';
$cssVars = [
	'--carlix-bg: ' . htmlspecialchars($siteBackgroundBase, ENT_QUOTES, 'UTF-8'),
	'--carlix-text: ' . htmlspecialchars($siteTextColor, ENT_QUOTES, 'UTF-8'),
	'--carlix-primary: ' . htmlspecialchars($siteParam('primaryColor', 'primaryColor', '#d32f2f'), ENT_QUOTES, 'UTF-8'),
	'--carlix-secondary: ' . htmlspecialchars($siteParam('secondaryColor', 'secondaryColor', '#151515'), ENT_QUOTES, 'UTF-8'),
	'--carlix-submenu-min-width: ' . $cssValue('submenuMinWidth', '18rem'),
	'--carlix-scroll-behavior: ' . ($siteSmoothScroll && !$siteReduceMotion ? 'smooth' : 'auto'),
];

if ($siteBackgroundType === 'color' && $siteBackgroundColor !== '') {
	$cssVars[] = '--carlix-site-bg: ' . htmlspecialchars($siteBackgroundColor, ENT_QUOTES, 'UTF-8');
} elseif ($siteBackgroundType === 'gradient' && $siteBackgroundGradient !== '') {
	$cssVars[] = '--carlix-site-bg: ' . htmlspecialchars($siteBackgroundGradient, ENT_QUOTES, 'UTF-8');
} elseif ($siteBackgroundType === 'image' && $siteBackgroundImage !== '') {
	$siteBackgroundImageCss = $siteMediaCssValue($siteBackgroundImage);

	if ($siteBackgroundImageCss !== '') {
		$cssVars[] = '--carlix-site-bg-image: ' . htmlspecialchars($siteBackgroundImageCss, ENT_QUOTES, 'UTF-8');
	}

	foreach ([
		'backgroundPosition' => '--carlix-site-bg-position',
		'backgroundSize' => '--carlix-site-bg-size',
		'backgroundRepeat' => '--carlix-site-bg-repeat',
		'backgroundAttachment' => '--carlix-site-bg-attachment',
	] as $key => $property) {
		$value = $siteParam($key, 'site' . ucfirst($key), '');

		if ($value !== '') {
			$cssVars[] = $property . ': ' . htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
		}
	}
}

$siteBackgroundOpacity = $siteParam('backgroundOpacity', 'siteBackgroundOpacity', '1');
if ($siteBackgroundOpacity !== '' && $siteBackgroundOpacity !== '1') {
	$cssVars[] = '--carlix-site-bg-opacity: ' . htmlspecialchars($siteBackgroundOpacity, ENT_QUOTES, 'UTF-8');
}

if ($siteBool('overlayEnabled', 'siteOverlayEnabled', false)) {
	$siteOverlayColor = $siteParam('overlayColor', 'siteOverlayColor', 'rgba(0,0,0,.35)');
	$siteOverlayOpacity = $siteParam('overlayOpacity', 'siteOverlayOpacity', '0.35');

	if ($siteOverlayColor !== '') {
		$cssVars[] = '--carlix-site-overlay-bg: ' . htmlspecialchars($siteOverlayColor, ENT_QUOTES, 'UTF-8');
		$cssVars[] = '--carlix-site-overlay-opacity: ' . htmlspecialchars($siteOverlayOpacity !== '' ? $siteOverlayOpacity : '0.35', ENT_QUOTES, 'UTF-8');
	}
}

if ($siteEnhancedContrast) {
	$cssVars[] = '--carlix-focus-ring: 3px solid #ffbf47';
}

foreach ($sectionDefaults as $section => $defaults) {
	$fieldPrefix = str_replace(' ', '', lcfirst(str_replace('-', ' ', $section)));
	$cssVars[] = '--carlix-' . $section . '-bg: ' . $cssValue($fieldPrefix . 'Bg', $defaults['bg']);
	$cssVars[] = '--carlix-' . $section . '-text: ' . $cssValue($fieldPrefix . 'Text', $defaults['text']);
	$cssVars[] = '--carlix-' . $section . '-link: ' . $cssValue($fieldPrefix . 'Link', $defaults['link']);
	$cssVars[] = '--carlix-' . $section . '-space-top: ' . $cssValue($fieldPrefix . 'SpaceTopDesktop', $defaults['top']);
	$cssVars[] = '--carlix-' . $section . '-space-bottom: ' . $cssValue($fieldPrefix . 'SpaceBottomDesktop', $defaults['bottom']);
	$cssVars[] = '--carlix-' . $section . '-space-top-tablet: ' . $cssValue($fieldPrefix . 'SpaceTopTablet', $defaults['top']);
	$cssVars[] = '--carlix-' . $section . '-space-bottom-tablet: ' . $cssValue($fieldPrefix . 'SpaceBottomTablet', $defaults['bottom']);
	$cssVars[] = '--carlix-' . $section . '-space-top-mobile: ' . $cssValue($fieldPrefix . 'SpaceTopMobile', $defaults['top']);
	$cssVars[] = '--carlix-' . $section . '-space-bottom-mobile: ' . $cssValue($fieldPrefix . 'SpaceBottomMobile', $defaults['bottom']);

	/* Largura do container desta seção (vazio = herda a global; "full" = sem limite) */
	$secContainer = trim((string) $params->get($fieldPrefix . 'Container', ''));
	if ($secContainer !== '') {
		$cssVars[] = '--carlix-' . $section . '-container: '
			. (strcasecmp($secContainer, 'full') === 0 ? 'none' : htmlspecialchars($secContainer, ENT_QUOTES, 'UTF-8'));
	}
}

/* Largura global do container ("full" = largura total) */
$containerWidth = $layoutSite ? $siteDimensionValue() : $dimensionValue('containerWidthValue', 'containerWidthUnit', 'containerWidthCustom', 'containerWidth', '1320', 'px');
if ($containerWidth === '') {
	$containerWidth = '1320px';
}
$cssVars[] = '--carlix-container: '
	. (strcasecmp($containerWidth, 'full') === 0 ? 'none' : htmlspecialchars($containerWidth, ENT_QUOTES, 'UTF-8'));

/* Logo / identidade */
$mediaUrl = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	$clean = HTMLHelper::cleanImageURL($value)->url;

	if (preg_match('#^(https?:)?//#i', $clean)) {
		return $clean;
	}

	return Uri::root(true) . '/' . ltrim($clean, '/');
};

$siteLink = static function (string $value): string {
	$value = trim($value);

	if ($value === '' || $value === '/') {
		return Uri::root();
	}

	if (preg_match('#^(https?:)?//#i', $value) || preg_match('#^(mailto|tel):#i', $value) || str_starts_with($value, '#')) {
		return $value;
	}

	return rtrim(Uri::root(), '/') . '/' . ltrim($value, '/');
};

$cssDimension = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	if (preg_match('/^\d+(\.\d+)?$/', $value)) {
		return $value . 'px';
	}

	if (preg_match('/^\d+(\.\d+)?(px|rem|em|%|vw|vh)$/', $value) || $value === 'auto') {
		return $value;
	}

	return '';
};

$logoIdentityKeys = ['logoType', 'logoText', 'logoSlogan', 'retinaLogo', 'mobileLogo', 'stickyLogo', 'logoAlt', 'logoWidth', 'logoHeight', 'logoCustomLink'];
$hasLogoIdentityParams = false;

foreach ($logoIdentityKeys as $logoIdentityKey) {
	if ((method_exists($params, 'exists') && $params->exists($logoIdentityKey)) || (!method_exists($params, 'exists') && $params->get($logoIdentityKey, null) !== null)) {
		$hasLogoIdentityParams = true;
		break;
	}
}

$logoType = strtolower(trim((string) $params->get('logoType', 'image')));
$logoType = in_array($logoType, ['image', 'text'], true) ? $logoType : 'image';
$logoText = trim((string) $params->get('logoText', 'HC Carlix')) ?: 'HC Carlix';
$logoSlogan = trim((string) $params->get('logoSlogan', 'Lightweight Joomla Template'));
$logoAlt = trim((string) $params->get('logoAlt', 'HC Carlix')) ?: 'HC Carlix';
$logoHref = htmlspecialchars($siteLink((string) $params->get('logoCustomLink', '/')), ENT_QUOTES, 'UTF-8');
$logoWidthRaw = trim((string) $params->get('logoWidth', ''));
$logoHeightRaw = trim((string) $params->get('logoHeight', ''));
$logoWidth = $cssDimension($logoWidthRaw);
$logoHeight = $cssDimension($logoHeightRaw);
$logoWidthAttr = preg_match('/^\d+$/', $logoWidthRaw) ? $logoWidthRaw : '';
$logoHeightAttr = preg_match('/^\d+$/', $logoHeightRaw) ? $logoHeightRaw : '';
$logoStyle = [];

if ($logoWidth !== '') {
	$logoStyle[] = 'width: ' . $logoWidth;
}

if ($logoHeight !== '') {
	$logoStyle[] = 'height: ' . $logoHeight;
	$logoStyle[] = 'max-height: none';
}

if ($logoType === 'text') {
	$logoHtml = '<a class="carlix-brand carlix-logo carlix-logo--text carlix-brand--text" href="' . $logoHref . '" aria-label="' . htmlspecialchars($logoText, ENT_QUOTES, 'UTF-8') . '" data-carlix-logo-type="text">'
		. '<span class="carlix-logo__title carlix-brand-title">' . htmlspecialchars($logoText, ENT_QUOTES, 'UTF-8') . '</span>'
		. ($logoSlogan !== '' ? '<span class="carlix-logo__slogan carlix-brand-slogan">' . htmlspecialchars($logoSlogan, ENT_QUOTES, 'UTF-8') . '</span>' : '')
		. '</a>';
} else {
	$logoSrc = $mediaUrl((string) $params->get('logo', ''));
	$retinaLogoSrc = $mediaUrl((string) $params->get('retinaLogo', ''));
	$mobileLogoSrc = $mediaUrl((string) $params->get('mobileLogo', ''));
	$stickyLogoSrc = $mediaUrl((string) $params->get('stickyLogo', ''));

	if ($logoSrc === '') {
		$logoSrc = Uri::root(true) . '/media/templates/site/hc_carlix/images/hc-carlix_logo.webp';
	}

	$imgAttrs = [
		'class="carlix-logo__image"',
		'src="' . htmlspecialchars($logoSrc, ENT_QUOTES, 'UTF-8') . '"',
		'alt="' . htmlspecialchars($logoAlt, ENT_QUOTES, 'UTF-8') . '"',
		'decoding="async"',
	];

	if ($logoWidthAttr !== '') {
		$imgAttrs[] = 'width="' . htmlspecialchars($logoWidthAttr, ENT_QUOTES, 'UTF-8') . '"';
	}

	if ($logoHeightAttr !== '') {
		$imgAttrs[] = 'height="' . htmlspecialchars($logoHeightAttr, ENT_QUOTES, 'UTF-8') . '"';
	}

	if ($retinaLogoSrc !== '') {
		$imgAttrs[] = 'srcset="' . htmlspecialchars($logoSrc . ' 1x, ' . $retinaLogoSrc . ' 2x', ENT_QUOTES, 'UTF-8') . '"';
	}

	if ($stickyLogoSrc !== '') {
		$imgAttrs[] = 'data-carlix-sticky-logo="' . htmlspecialchars($stickyLogoSrc, ENT_QUOTES, 'UTF-8') . '"';
	}

	if ($logoStyle) {
		$imgAttrs[] = 'style="' . htmlspecialchars(implode('; ', $logoStyle), ENT_QUOTES, 'UTF-8') . '"';
	}

	$logoImage = '<img ' . implode(' ', $imgAttrs) . '>';

	if ($mobileLogoSrc !== '') {
		$logoImage = '<picture class="carlix-logo__picture carlix-logo-picture">'
			. '<source media="(max-width: 640px)" srcset="' . htmlspecialchars($mobileLogoSrc, ENT_QUOTES, 'UTF-8') . '">'
			. $logoImage
			. '</picture>';
	}

	$logoHtml = '<a class="carlix-brand carlix-logo carlix-logo--image carlix-brand--image" href="' . $logoHref . '" aria-label="' . htmlspecialchars($logoAlt, ENT_QUOTES, 'UTF-8') . '" data-carlix-logo-type="image">' . $logoImage . '</a>';
}

$logoAlign = (string) $params->get('logoAlign', 'start');
$logoAlign = in_array($logoAlign, ['start', 'center', 'end'], true) ? $logoAlign : 'start';
$renderLegacyLogoModule = !$hasLogoIdentityParams;

$paramBool = static fn (string $name, bool $default = false): bool => (int) $params->get($name, $default ? 1 : 0) === 1;
$paramRaw = static fn (string $name): string => trim((string) $params->get($name, ''));
$paramToken = static fn (string $name): string => preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $params->get($name, ''));

/* Navegação (parâmetros) */
$navigationType = (string) $params->get('navigationType', 'menu-offcanvas');
$navigationType = in_array($navigationType, ['menu', 'menu-offcanvas', 'offcanvas'], true) ? $navigationType : 'menu-offcanvas';
$menuAlign      = (string) $params->get('menuAlign', 'start');
$menuAlign      = in_array($menuAlign, ['start', 'center', 'end'], true) ? $menuAlign : 'start';
$menuInteraction = (string) $params->get('menuInteraction', 'hover');
$menuInteraction = in_array($menuInteraction, ['hover', 'click'], true) ? $menuInteraction : 'hover';
$submenuDirection = (string) $params->get('submenuDirection', 'start');
$submenuDirection = in_array($submenuDirection, ['start', 'end'], true) ? $submenuDirection : 'start';
$submenuAnimation = (string) $params->get('submenuAnimation', 'slide');
$submenuAnimation = in_array($submenuAnimation, ['none', 'fade', 'slide'], true) ? $submenuAnimation : 'slide';
$offcanvasSide  = $params->get('offcanvasSide', 'right') === 'left' ? 'left' : 'right';
$headerBehavior = (string) $params->get('headerBehavior', 'sticky');
$headerBehavior = in_array($headerBehavior, ['static', 'sticky', 'fixed', 'floating'], true) ? $headerBehavior : 'sticky';
$backToTop      = $siteBool('backToTop', 'backToTop', false) ? 1 : 0;
$siteResponsiveClasses = [];
$siteResponsive = $sitePathValue($layoutSite, 'responsive');

if (is_array($siteResponsive)) {
	foreach ([
		'hideDesktop' => 'carlix-hide-desktop',
		'hideTablet' => 'carlix-hide-tablet',
		'hideMobile' => 'carlix-hide-mobile',
	] as $key => $class) {
		$value = $siteResponsive[$key] ?? false;

		if ($value === true || (string) $value === '1' || strtolower((string) $value) === 'true') {
			$siteResponsiveClasses[] = $class;
		}
	}
}

$enableLazyImages = $paramBool('lazyImages');
$enableLazyIframes = $paramBool('lazyIframes');
$bodyClasses = [
	'carlix-site',
	'carlix-nav-type-' . $navigationType,
	$siteSmoothScroll && !$siteReduceMotion ? 'carlix-smooth-scroll' : '',
	$siteReduceMotion ? 'carlix-reduce-motion' : '',
	$siteVisibleFocus ? 'carlix-focus-visible' : 'carlix-focus-muted',
	$siteEnhancedContrast ? 'carlix-enhanced-contrast' : '',
	$paramBool('deferJavaScript') ? 'carlix-defer-js' : '',
	$paramBool('asyncScripts') ? 'carlix-async-scripts' : '',
	$enableLazyImages ? 'carlix-lazy-images' : '',
	$enableLazyIframes ? 'carlix-lazy-iframes' : '',
	$paramBool('fontDisplaySwap', true) ? 'carlix-font-display-swap' : '',
	$paramBool('removeRenderBlocking') ? 'carlix-remove-render-blocking' : '',
	$paramBool('devShowPositions') ? 'carlix-dev-show-positions' : '',
	$paramBool('devShowGrid') ? 'carlix-dev-show-grid' : '',
	$paramBool('devShowBreakpoints') ? 'carlix-dev-show-breakpoints' : '',
	$paramBool('devShowEmptyAreas') ? 'carlix-dev-show-empty-areas' : '',
	$paramBool('devDisableMinification') ? 'carlix-dev-no-minify' : '',
	$paramBool('devDisableAssetCache') ? 'carlix-dev-no-asset-cache' : '',
];
$bodyClasses = array_merge($bodyClasses, $siteResponsiveClasses);
$offcanvasShowLogo = (int) $params->get('offcanvasShowLogo', 1) === 1;
$offcanvasCloseOnClick = (int) $params->get('offcanvasCloseOnClick', 1) === 1;
$mobileButtonPosition = (string) $params->get('mobileButtonPosition', 'end');
$mobileButtonPosition = in_array($mobileButtonPosition, ['start', 'end'], true) ? $mobileButtonPosition : 'end';

$offcanvasLogoParam = trim((string) $params->get('offcanvasLogo', ''));
if ($offcanvasLogoParam !== '') {
	$ocLogoSrc = $mediaUrl($offcanvasLogoParam);
	$offcanvasLogoHtml = '<a class="carlix-brand carlix-logo carlix-logo--image carlix-brand--image" href="' . $logoHref . '" aria-label="' . $siteName . '">'
		. '<img class="carlix-logo__image" src="' . htmlspecialchars($ocLogoSrc, ENT_QUOTES, 'UTF-8')
		. '" alt="' . htmlspecialchars($logoAlt, ENT_QUOTES, 'UTF-8') . '"></a>';
} else {
	$offcanvasLogoHtml = $logoHtml;
}

$ocLogoAlign = (string) $params->get('offcanvasLogoAlign', 'start');
$ocLogoAlign = in_array($ocLogoAlign, ['start', 'center', 'end'], true) ? $ocLogoAlign : 'start';
$cssVars[]   = '--carlix-oc-logo-h: ' . $cssValue('offcanvasLogoHeight', '2.5rem');
$cssVars[]   = '--carlix-oc-width: ' . $cssValue('offcanvasWidth', '24rem');
$cssVars[]   = '--carlix-oc-bg: ' . $cssValue('offcanvasBackground', '#ffffff');
$cssVars[]   = '--carlix-oc-text: ' . $cssValue('offcanvasTextColor', '#333333');
$cssVars[]   = '--carlix-oc-overlay-opacity: ' . $cssValue('offcanvasOverlayOpacity', '0.55');
$cssVars[]   = '--carlix-oc-overlay-blur: ' . $cssValue('offcanvasOverlayBlur', '2px');
$cssVars[]   = '--carlix-oc-speed: ' . $cssValue('offcanvasSpeed', '200ms');
$cssVars[]   = '--carlix-mobile-button-size: ' . $cssValue('mobileButtonSize', '2.75rem');
$cssVars[]   = '--carlix-mobile-button-color: ' . $cssValue('mobileButtonColor', '#111111');
$cssVars[]   = '--carlix-mobile-button-bg: ' . $cssValue('mobileButtonBackground', '#ffffff');
$cssVars[]   = '--carlix-mobile-button-border: ' . $cssValue('mobileButtonBorder', '1px solid #e6e6e6');
$cssVars[]   = '--carlix-mobile-button-radius: ' . $cssValue('mobileButtonRadius', '0.5rem');
$cssVars[]   = '--carlix-submenu-delay: ' . $cssValue('submenuDelay', '0ms');

/* Avançado: favicon, SEO, Google Analytics e código custom */
$faviconParam = trim((string) $params->get('favicon', ''));
$faviconSrc   = $faviconParam !== ''
	? $mediaUrl($faviconParam)
	: Uri::root(true) . '/media/templates/site/hc_carlix/images/hc-carlix_icon.webp';
$faviconExt   = strtolower(pathinfo((string) parse_url($faviconSrc, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'webp');
$faviconType  = [
	'ico' => 'image/x-icon', 'svg' => 'image/svg+xml', 'png' => 'image/png',
	'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'gif' => 'image/gif', 'webp' => 'image/webp',
][$faviconExt] ?? 'image/webp';
$appleTouchIconSrc = $mediaUrl((string) $params->get('appleTouchIcon', ''));
$themeColor = trim((string) $params->get('themeColor', '#d32f2f'));
$themeColor = preg_match('/^#[0-9a-f]{3,8}$/i', $themeColor) ? $themeColor : '#d32f2f';

$customCss = (string) $params->get('customCss', '');
$criticalCss = (string) $params->get('criticalCss', '');
$customCssDesktop = (string) $params->get('customCssDesktop', '');
$customCssTablet = (string) $params->get('customCssTablet', '');
$customCssMobile = (string) $params->get('customCssMobile', '');
$additionalCss = (string) $params->get('additionalCss', '');
$headCode  = (string) $params->get('headCode', '');
$bodyStartCode = (string) $params->get('bodyStartCode', '');
$bodyCode  = (string) $params->get('bodyCode', '');
$noscriptCode = (string) $params->get('noscriptCode', '');
$customJsHead = (string) $params->get('customJsHead', '');
$customJsFooter = (string) $params->get('customJsFooter', '');
$customJsDomReady = (string) $params->get('customJsDomReady', '');
$gtmId = $paramToken('gtmId');
$gaMeasurementId = $paramToken('gaMeasurementId');
$legacyGaId = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $params->get('gaId', ''));
$gaMeasurementId = $gaMeasurementId !== '' ? $gaMeasurementId : $legacyGaId;
$metaPixelId = $paramToken('metaPixelId');
$tiktokPixelId = $paramToken('tiktokPixelId');
$clarityId = $paramToken('clarityId');
$hotjarId = $paramToken('hotjarId');
$linkedInPartnerId = $paramToken('linkedInPartnerId');
$verificationMetas = [
	'google-site-verification' => $paramRaw('googleSiteVerification'),
	'msvalidate.01' => $paramRaw('bingSiteVerification'),
	'p:domain_verify' => $paramRaw('pinterestVerification'),
	'facebook-domain-verification' => $paramRaw('facebookDomainVerification'),
];
$enableDnsPrefetch = $paramBool('dnsPrefetch');
$enablePreconnect = $paramBool('externalPreconnect');
$enablePreloadFonts = $paramBool('preloadFonts');
$enablePreloadCriticalImage = $paramBool('preloadCriticalImage');
$enableReferrerPolicy = $paramBool('enableReferrerPolicy');
$enableXFrameOptions = $paramBool('xFrameOptionsHelper');
$enableCspHelper = $paramBool('cspHelper');

$seoSiteName    = trim((string) $params->get('seoSiteName', ''));
$seoSiteName    = $seoSiteName !== '' ? $seoSiteName : $siteNameRaw;
$seoSlogan      = trim((string) $params->get('seoSlogan', ''));
$seoTitleSuffix = trim((string) $params->get('seoTitleSuffix', ''));
$seoDescription = trim((string) $params->get('seoDescription', ''));
$seoRobots      = trim((string) $params->get('seoRobots', ''));
$canonicalUrl   = trim((string) $params->get('canonicalUrl', ''));
$ogTitle        = trim((string) $params->get('ogTitle', ''));
$ogDescription  = trim((string) $params->get('ogDescription', ''));
$ogImageParam   = trim((string) $params->get('ogImage', ''));
$ogType         = (string) $params->get('ogType', 'website');
$ogType         = in_array($ogType, ['website', 'article'], true) ? $ogType : 'website';
$twitterCard    = (string) $params->get('twitterCard', 'summary_large_image');
$twitterCard    = in_array($twitterCard, ['summary_large_image', 'summary'], true) ? $twitterCard : 'summary_large_image';
$schemaJsonLd   = trim((string) $params->get('schemaJsonLd', ''));

/* CSS/JS: camadas separadas por responsabilidade. */
$wa->useStyle('template.hc_carlix.variables')
   ->useStyle('template.hc_carlix.grid')
   ->useStyle('template.hc_carlix.template')
   ->useStyle('template.hc_carlix.utilities')
   ->useStyle('template.hc_carlix.buttons')
   ->useStyle('template.hc_carlix.forms')
   ->useStyle('template.hc_carlix.elements')
   ->useStyle('template.hc_carlix.breadcrumbs')
   ->useStyle('template.hc_carlix.hero')
   ->useStyle('template.hc_carlix.modules')
   ->useStyle('template.hc_carlix.menu')
   ->useScript('template.hc_carlix.template');

$this->setMetaData('viewport', 'width=device-width, initial-scale=1');
$this->setGenerator('HC Carlix');

if ($seoTitleSuffix !== '' && !str_ends_with((string) $this->getTitle(), $seoTitleSuffix)) {
	$this->setTitle(trim((string) $this->getTitle() . ' ' . $seoTitleSuffix));
}

if ($seoDescription !== '') {
	$this->setDescription($seoDescription);
}

if ($seoRobots !== '') {
	$this->setMetaData('robots', $seoRobots);
}

if ($canonicalUrl !== '') {
	$this->addHeadLink($canonicalUrl, 'canonical');
}

$document = $this;

$metaTag = static function (string $attribute, string $name, string $content) use ($document): void {
	$content = trim($content);

	if ($content === '') {
		return;
	}

	$document->addCustomTag(
		'<meta ' . $attribute . '="' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '" content="'
		. htmlspecialchars($content, ENT_QUOTES, 'UTF-8') . '">'
	);
};

$linesFromTextarea = static function (string $value): array {
	$lines = preg_split('/\R+/', trim($value)) ?: [];

	return array_values(array_filter(array_map('trim', $lines), static fn (string $line): bool => $line !== ''));
};

$assetUrl = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	if (preg_match('#^(https?:)?//#i', $value)) {
		return $value;
	}

	return Uri::root(true) . '/' . ltrim($value, '/');
};

$originUrl = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	if (str_starts_with($value, '//')) {
		return $value;
	}

	if (!preg_match('#^https?://#i', $value)) {
		$value = '//' . ltrim($value, '/');
	}

	return $value;
};

$styleBlock = static function (string $css, string $media = ''): string {
	$css = trim($css);

	if ($css === '') {
		return '';
	}

	if ($media !== '') {
		$css = '@media ' . $media . ' {' . "\n" . $css . "\n" . '}';
	}

	return '<style>' . "\n" . $css . "\n" . '</style>' . "\n";
};

$scriptBlock = static function (string $code): string {
	$code = trim($code);

	if ($code === '') {
		return '';
	}

	if (stripos($code, '<script') !== false) {
		return $code . "\n";
	}

	return '<script>' . "\n" . $code . "\n" . '</script>' . "\n";
};

$domReadyBlock = static function (string $code): string {
	$code = trim($code);

	if ($code === '') {
		return '';
	}

	if (stripos($code, '<script') !== false) {
		return $code . "\n";
	}

	return '<script>document.addEventListener("DOMContentLoaded",function(){' . "\n" . $code . "\n" . '});</script>' . "\n";
};

$absoluteImage = static function (string $image) : string {
	$image = trim($image);

	if ($image === '') {
		return '';
	}

	$clean = HTMLHelper::cleanImageURL($image)->url;

	if (preg_match('#^https?://#i', $clean)) {
		return $clean;
	}

	return rtrim(Uri::root(), '/') . '/' . ltrim($clean, '/');
};

$pageTitle = $ogTitle !== '' ? $ogTitle : (string) $this->getTitle();
$pageDesc  = $ogDescription !== '' ? $ogDescription : ($seoDescription !== '' ? $seoDescription : $seoSlogan);
$ogImage   = $absoluteImage($ogImageParam);

$metaTag('property', 'og:site_name', $seoSiteName);
$metaTag('property', 'og:title', $pageTitle);
$metaTag('property', 'og:description', $pageDesc);
$metaTag('property', 'og:type', $ogType);
$metaTag('property', 'og:url', $canonicalUrl !== '' ? $canonicalUrl : Uri::current());
$metaTag('property', 'og:image', $ogImage);
$metaTag('name', 'twitter:card', $twitterCard);
$metaTag('name', 'twitter:title', $pageTitle);
$metaTag('name', 'twitter:description', $pageDesc);
$metaTag('name', 'twitter:image', $ogImage);

$autoBodyStartCode = '';

foreach ($verificationMetas as $name => $content) {
	$metaTag('name', $name, $content);
}

if ($enableReferrerPolicy) {
	$referrerPolicy = (string) $params->get('referrerPolicyValue', 'strict-origin-when-cross-origin');
	$allowedReferrers = ['no-referrer', 'no-referrer-when-downgrade', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url'];

	if (in_array($referrerPolicy, $allowedReferrers, true)) {
		$metaTag('name', 'referrer', $referrerPolicy);
	}
}

if ($enableXFrameOptions) {
	$xFrameValue = (string) $params->get('xFrameOptionsValue', 'SAMEORIGIN');
	$xFrameValue = in_array($xFrameValue, ['SAMEORIGIN', 'DENY'], true) ? $xFrameValue : 'SAMEORIGIN';
	$this->addCustomTag('<meta http-equiv="X-Frame-Options" content="' . htmlspecialchars($xFrameValue, ENT_QUOTES, 'UTF-8') . '">');
}

if ($enableCspHelper) {
	$cspPolicy = trim((string) $params->get('cspPolicy', ''));

	if ($cspPolicy !== '') {
		$this->addCustomTag('<meta http-equiv="Content-Security-Policy" content="' . htmlspecialchars($cspPolicy, ENT_QUOTES, 'UTF-8') . '">');
	}
}

if ($enableDnsPrefetch) {
	foreach ($linesFromTextarea((string) $params->get('dnsPrefetchHosts', '')) as $host) {
		$url = $originUrl($host);

		if ($url !== '') {
			$this->addCustomTag('<link rel="dns-prefetch" href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '">');
		}
	}
}

if ($enablePreconnect) {
	foreach ($linesFromTextarea((string) $params->get('preconnectUrls', '')) as $host) {
		$url = $originUrl($host);

		if ($url !== '') {
			$this->addCustomTag('<link rel="preconnect" href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '" crossorigin>');
		}
	}
}

if ($enablePreloadFonts) {
	foreach ($linesFromTextarea((string) $params->get('preloadFontUrls', '')) as $fontUrl) {
		$url = $assetUrl($fontUrl);

		if ($url !== '') {
			$this->addCustomTag('<link rel="preload" href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '" as="font" type="font/woff2" crossorigin>');
		}
	}
}

if ($enablePreloadCriticalImage) {
	$criticalImageUrl = $assetUrl((string) $params->get('preloadCriticalImageUrl', ''));

	if ($criticalImageUrl !== '') {
		$this->addCustomTag('<link rel="preload" href="' . htmlspecialchars($criticalImageUrl, ENT_QUOTES, 'UTF-8') . '" as="image">');
	}
}

if ($gtmId !== '') {
	$gtmJson = json_encode($gtmId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer",' . $gtmJson . ');</script>');
}

if ($gaMeasurementId !== '') {
	$gaJson = json_encode($gaMeasurementId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script async src="https://www.googletagmanager.com/gtag/js?id=' . htmlspecialchars($gaMeasurementId, ENT_QUOTES, 'UTF-8') . '"></script>');
	$this->addCustomTag('<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",' . $gaJson . ');</script>');
}

if ($metaPixelId !== '') {
	$metaPixelJson = json_encode($metaPixelId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init",' . $metaPixelJson . ');fbq("track","PageView");</script>');
	$autoBodyStartCode .= '<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' . htmlspecialchars($metaPixelId, ENT_QUOTES, 'UTF-8') . '&amp;ev=PageView&amp;noscript=1" alt=""></noscript>' . "\n";
}

if ($tiktokPixelId !== '') {
	$tiktokJson = json_encode($tiktokPixelId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var i="https://analytics.tiktok.com/i18n/pixel/events.js",n=d.createElement("script");n.type="text/javascript";n.async=!0;n.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a)};ttq.load(' . $tiktokJson . ');ttq.page();}(window,document,"ttq");</script>');
}

if ($clarityId !== '') {
	$clarityJson = json_encode($clarityId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",' . $clarityJson . ');</script>');
}

if ($hotjarId !== '') {
	$hotjarJson = json_encode($hotjarId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:' . $hotjarJson . ',hjsv:6};a=o.getElementsByTagName("head")[0];r=o.createElement("script");r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,"https://static.hotjar.com/c/hotjar-",".js?sv=");</script>');
}

if ($linkedInPartnerId !== '') {
	$linkedInJson = json_encode($linkedInPartnerId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	$this->addCustomTag('<script>_linkedin_partner_id=' . $linkedInJson . ';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);</script><script>(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);</script>');
}

if ($schemaJsonLd !== '') {
	$decodedSchema = json_decode($schemaJsonLd, false);

	if (json_last_error() === JSON_ERROR_NONE) {
		$this->addCustomTag(
			'<script type="application/ld+json">'
			. json_encode($decodedSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
			. '</script>'
		);
	}
}

/* Posicoes de uma faixa que tem modulo (respeita ?tp=1) */
$activeOf = static function (array $positions, HtmlDocument $doc): array {
	$out = [];
	foreach ($positions as $p) {
		if ($doc->countModules($p)) {
			$out[] = $p;
		}
	}
	return $out;
};

/* Classe de coluna conforme nº de posições preenchidas na faixa */
$colClass = static fn (int $n): string => match (max(1, $n)) {
	1       => 'col-12',
	2       => 'col-12 col-lg-6',
	3       => 'col-12 col-lg-4',
	default => 'col-12 col-md-6 col-lg-3',
};

/* Renderiza posições sem herdar layouts fixados por outro template. */
$renderModules = static function (string $position, array $attribs = ['style' => 'none'], ?string $forcedMenuLayout = null, array $paramOverrides = []): void {
	foreach (ModuleHelper::getModules($position) as $module) {
		$moduleParams = new Registry($module->params);
		$layout       = (string) $moduleParams->get('layout', '');
		$needsClone   = false;

		if ($forcedMenuLayout !== null && $module->module === 'mod_menu') {
			$moduleParams->set('layout', $forcedMenuLayout);
			$needsClone = true;
		} elseif (str_contains($layout, ':') && !str_starts_with($layout, '_:') && !str_starts_with($layout, 'hc_carlix:')) {
			$moduleParams->set('layout', '_:default');
			$needsClone = true;
		}

		foreach ($paramOverrides as $name => $value) {
			if (is_string($value)) {
				$value = str_replace('{id}', (string) $module->id, $value);
			}

			$moduleParams->set($name, $value);
			$needsClone = true;
		}

		if ($needsClone) {
			$module = clone $module;
			$module->params = $moduleParams->toString();
		}

		echo ModuleHelper::renderModule($module, $attribs);
	}
};

$topbar = $activeOf(['topbar-1', 'topbar-2', 'topbar-3', 'topbar-4'], $this);
$top    = $activeOf(['top-a', 'top-b', 'top-c', 'top-d'], $this);
$bottom = $activeOf(['bottom-a', 'bottom-b', 'bottom-c', 'bottom-d'], $this);
$foot   = $activeOf(['footer-1', 'footer-2', 'footer-3', 'footer-4'], $this);
$creds  = $activeOf(['credits-1', 'credits-2', 'credits-3', 'credits-4'], $this);

$hasL = (bool) $this->countModules('sidebar-left');
$hasR = (bool) $this->countModules('sidebar-right');
$hasMenu = (bool) $this->countModules('menu');
$desktopMenuEnabled = $navigationType !== 'offcanvas';
$desktopOffcanvasEnabled = $navigationType !== 'menu';
$hasOffcanvas = $hasMenu
	|| (bool) $this->countModules('offcanvas')
	|| (bool) $this->countModules('mobile-menu')
	|| (bool) $this->countModules('navigation-mobile');
$debugLayoutAttrs = $paramBool('devShowGrid') || $paramBool('devShowPositions') || $paramBool('devShowBreakpoints');
$leftSpan    = $hasL ? 2 : 0;
$rightSpan   = $hasR ? 3 : 0;
$contentSpan = 12 - $leftSpan - $rightSpan; // 12, 10/9 ou 7

$safeToken = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	return preg_replace('/[^A-Za-z0-9_\- ]/', '', $value) ?: '';
};

$settingGroup = static function (array $settings, string $group): array {
	return is_array($settings[$group] ?? null) ? $settings[$group] : [];
};

$settingValue = static function (array $settings, string $group, string $key, string $legacyKey = '', string $default = '') use ($settingGroup): string {
	$hasGroup    = is_array($settings[$group] ?? null);
	$groupValues = $settingGroup($settings, $group);
	$value       = $groupValues[$key] ?? null;

	if (!$hasGroup && ($value === null || $value === '') && $legacyKey !== '') {
		$value = $settings[$legacyKey] ?? null;
	}

	return $value === null ? $default : (string) $value;
};

$truthy = static function ($value): bool {
	return $value === true || $value === 1 || strtolower((string) $value) === 'true' || (string) $value === '1';
};

$cssDimension = static function (string $value, string $unit, array $allowedUnits, string $fallbackUnit = 'px'): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	$unit = in_array($unit, $allowedUnits, true) ? $unit : $fallbackUnit;

	if ($unit === 'custom' || !preg_match('/^-?\d+(\.\d+)?$/', $value)) {
		return $value;
	}

	return $value . $unit;
};

$mediaCssValue = static function (string $value): string {
	$value = trim($value);

	if ($value === '') {
		return '';
	}

	if (preg_match('/^(url|image-set|var|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient)\(/i', $value)) {
		return $value;
	}

	$value = preg_replace('#^local-images:/#', 'images/', $value);
	$value = preg_replace('#^local-files:/#', 'files/', $value);
	$clean = HTMLHelper::cleanImageURL($value)->url;

	if (!preg_match('#^https?://#i', $clean)) {
		$clean = Uri::root(true) . '/' . ltrim($clean, '/');
	}

	return 'url("' . str_replace('"', '%22', $clean) . '")';
};

$styleAttr = static function (array $settings, bool $allowOverflow = true) use ($settingGroup, $settingValue, $truthy, $cssDimension, $mediaCssValue): string {
	$styles = [];
	$isGradient = static function (string $value): bool {
		return (bool) preg_match('/gradient\(/i', $value);
	};
	$boxValue = static function (array $settings, string $prefix) use ($settingGroup): string {
		$spacing = $settingGroup($settings, 'spacing');
		$hasSpacing = is_array($settings['spacing'] ?? null);
		$unit = (string) ($spacing[$prefix . 'Unit'] ?? (!$hasSpacing ? ($settings[$prefix . 'Unit'] ?? 'rem') : 'rem'));
		$allowedUnits = ['px', 'rem', 'em', '%', 'vw', 'vh'];
		$unit = in_array($unit, $allowedUnits, true) ? $unit : 'rem';
		$keys = [$prefix . 'Top', $prefix . 'Right', $prefix . 'Bottom', $prefix . 'Left'];
		$values = [];
		$hasValue = false;

		foreach ($keys as $key) {
			$value = trim((string) ($spacing[$key] ?? (!$hasSpacing ? ($settings[$key] ?? '') : '')));

			if ($value !== '') {
				$hasValue = true;
			}

			$values[] = $value === '' ? '0' : $value . $unit;
		}

		return $hasValue ? implode(' ', $values) : '';
	};
	$paddingBox = $boxValue($settings, 'padding');
	$marginBox = $boxValue($settings, 'margin');
	$visual = $settingGroup($settings, 'visual');
	$border = $settingGroup($settings, 'border');
	$height = $settingGroup($settings, 'height');
	$alignment = $settingGroup($settings, 'alignment');
	$position = $settingGroup($settings, 'position');
	$overflow = $settingGroup($settings, 'overflow');
	$advanced = $settingGroup($settings, 'advanced');
	$hasVisual = is_array($settings['visual'] ?? null);
	$hasBorder = is_array($settings['border'] ?? null);
	$hasBackgroundType = $hasVisual && array_key_exists('backgroundType', $visual) && trim((string) $visual['backgroundType']) !== '';

	$legacyBackgroundColor = trim((string) ($settings['backgroundColor'] ?? ''));
	$legacyBackgroundImage = trim((string) ($settings['backgroundImage'] ?? ''));
	$backgroundType = trim((string) ($visual['backgroundType'] ?? ''));
	$backgroundColor = trim((string) ($visual['backgroundColor'] ?? ''));
	$backgroundGradient = trim((string) ($visual['backgroundGradient'] ?? ''));
	$backgroundImage = trim((string) ($visual['backgroundImage'] ?? ''));

	if (!$hasVisual && $backgroundColor === '' && !$isGradient($legacyBackgroundColor)) {
		$backgroundColor = $legacyBackgroundColor;
	}

	if (!$hasVisual && $backgroundGradient === '') {
		$backgroundGradient = $isGradient($legacyBackgroundColor) ? $legacyBackgroundColor : ($isGradient($legacyBackgroundImage) ? $legacyBackgroundImage : '');
	}

	if (!$hasVisual && $backgroundImage === '' && !$isGradient($legacyBackgroundImage)) {
		$backgroundImage = $legacyBackgroundImage;
	}

	if ($backgroundType === '' || (!$hasBackgroundType && $backgroundType === 'none')) {
		$backgroundType = $backgroundImage !== '' ? 'image' : ($backgroundGradient !== '' ? 'gradient' : ($backgroundColor !== '' ? 'color' : 'none'));
	}

	if ($backgroundType === 'color' && $backgroundColor !== '') {
		$styles[] = '--carlix-managed-bg: ' . $backgroundColor;
	} elseif ($backgroundType === 'gradient' && $backgroundGradient !== '') {
		$styles[] = '--carlix-managed-bg: ' . $backgroundGradient;
	} elseif ($backgroundType === 'image' && $backgroundImage !== '') {
		$imageValue = $mediaCssValue($backgroundImage);

		if ($imageValue !== '') {
			$styles[] = '--carlix-managed-bg-image: ' . $imageValue;
		}
	}

	if ($backgroundType === 'image' && $backgroundImage !== '') {
		foreach ([
			'backgroundPosition'   => '--carlix-managed-bg-position',
			'backgroundSize'       => '--carlix-managed-bg-size',
			'backgroundRepeat'     => '--carlix-managed-bg-repeat',
			'backgroundAttachment' => '--carlix-managed-bg-attachment',
		] as $key => $property) {
			$value = trim((string) ($visual[$key] ?? $settings[$key] ?? ''));

			if ($value !== '') {
				$styles[] = $property . ': ' . $value;
			}
		}

		if ($truthy($visual['overlayEnabled'] ?? false)) {
			$overlayColor = trim((string) ($visual['overlayColor'] ?? ''));
			$overlayOpacity = trim((string) ($visual['overlayOpacity'] ?? ''));

			if ($overlayColor !== '') {
				$styles[] = '--carlix-managed-overlay-bg: ' . $overlayColor;
				$styles[] = '--carlix-managed-overlay-opacity: ' . ($overlayOpacity !== '' ? $overlayOpacity : '0.35');
			}
		}
	}

	foreach ([
		'textColor' => 'color',
		'linkColor' => '--carlix-managed-link',
		'hoverColor' => '--carlix-managed-hover',
		'shadow' => 'box-shadow',
		'rowGap' => '--carlix-managed-row-gap',
		'rowColumnGap' => '--carlix-row-gap',
	] as $key => $property) {
		$value = in_array($key, ['rowGap', 'rowColumnGap'], true) ? trim((string) ($settings[$key] ?? '')) : trim($settingValue($settings, 'visual', $key, $key));

		if ($value !== '') {
			$styles[] = $property . ': ' . $value;
		}
	}

	if ($paddingBox !== '') {
		$styles[] = 'padding: ' . $paddingBox;
	}

	if ($marginBox !== '') {
		$styles[] = 'margin: ' . $marginBox;
	}

	$opacity = trim((string) ($visual['backgroundOpacity'] ?? $settings['backgroundOpacity'] ?? ''));
	if ($opacity !== '' && $opacity !== '1') {
		$styles[] = '--carlix-managed-bg-opacity: ' . $opacity;
	}

	$legacyBorder = trim((string) ($border['legacyBottom'] ?? (!$hasBorder ? ($settings['borderBottom'] ?? '') : '')));
	$borderEnabled = $truthy($border['enabled'] ?? false) || $legacyBorder !== '';

	if ($borderEnabled) {
		$borderUnit = in_array((string) ($border['widthUnit'] ?? 'px'), ['px', 'rem', 'em', '%'], true) ? (string) $border['widthUnit'] : 'px';
		$borderStyle = in_array((string) ($border['style'] ?? 'solid'), ['none', 'solid', 'dashed', 'dotted', 'double'], true) ? (string) $border['style'] : 'solid';
		$borderColor = trim((string) ($border['color'] ?? ''));
		$hasBorderWidth = false;

		foreach (['top' => 'widthTop', 'right' => 'widthRight', 'bottom' => 'widthBottom', 'left' => 'widthLeft'] as $side => $key) {
			$value = $cssDimension((string) ($border[$key] ?? ''), $borderUnit, ['px', 'rem', 'em', '%']);

			if ($value !== '') {
				$styles[] = 'border-' . $side . '-width: ' . $value;
				$hasBorderWidth = true;
			}
		}

		if ($hasBorderWidth) {
			$styles[] = 'border-style: ' . $borderStyle;

			if ($borderColor !== '') {
				$styles[] = $isGradient($borderColor) ? 'border-image: ' . $borderColor . ' 1' : 'border-color: ' . $borderColor;
			}
		} elseif ($legacyBorder !== '') {
			$styles[] = 'border-bottom: ' . $legacyBorder;
		}
	}

	$radiusUnit = in_array((string) ($border['radiusUnit'] ?? 'px'), ['px', 'rem', 'em', '%'], true) ? (string) $border['radiusUnit'] : 'px';
	foreach ([
		'top-left' => 'radiusTopLeft',
		'top-right' => 'radiusTopRight',
		'bottom-right' => 'radiusBottomRight',
		'bottom-left' => 'radiusBottomLeft',
	] as $corner => $key) {
		$value = $cssDimension((string) ($border[$key] ?? ''), $radiusUnit, ['px', 'rem', 'em', '%']);

		if ($value !== '') {
			$styles[] = 'border-' . $corner . '-radius: ' . $value;
		}
	}

	$heightMode = (string) ($height['mode'] ?? 'auto');
	if ($heightMode !== 'auto') {
		$heightValue = $cssDimension((string) ($height['value'] ?? ''), (string) ($height['unit'] ?? 'px'), ['px', 'rem', 'em', 'vh', '%', 'custom']);

		if ($heightMode === 'min-height' && $heightValue !== '') {
			$styles[] = 'min-height: ' . $heightValue;
		} elseif ($heightMode === 'fixed' && $heightValue !== '') {
			$styles[] = 'height: ' . $heightValue;
		} elseif ($heightMode === 'viewport') {
			$styles[] = 'min-height: ' . ($heightValue !== '' ? $heightValue : '100vh');
		}
	}

	$horizontalMap = [
		'left' => 'flex-start',
		'center' => 'center',
		'right' => 'flex-end',
		'space-between' => 'space-between',
		'space-around' => 'space-around',
		'space-evenly' => 'space-evenly',
	];
	$verticalMap = [
		'top' => 'flex-start',
		'center' => 'center',
		'bottom' => 'flex-end',
		'stretch' => 'stretch',
	];
	$horizontal = $horizontalMap[(string) ($alignment['horizontal'] ?? 'default')] ?? '';
	$vertical = $verticalMap[(string) ($alignment['vertical'] ?? 'default')] ?? '';

	if ($horizontal !== '') {
		$styles[] = '--carlix-align-horizontal: ' . $horizontal;
	}

	if ($vertical !== '') {
		$styles[] = '--carlix-align-vertical: ' . $vertical;
	}

	if ($allowOverflow) {
		foreach (['value' => 'overflow', 'x' => 'overflow-x', 'y' => 'overflow-y'] as $key => $property) {
			$value = (string) ($overflow[$key] ?? 'default');

			if (in_array($value, ['visible', 'hidden', 'auto', 'scroll', 'clip'], true)) {
				$styles[] = $property . ': ' . $value;
			}
		}
	}

	$positionType = (string) ($position['type'] ?? 'default');
	if (in_array($positionType, ['relative', 'sticky', 'fixed', 'absolute'], true)) {
		$styles[] = 'position: ' . $positionType;
	}

	$positionUnit = in_array((string) ($position['unit'] ?? 'px'), ['px', 'rem', 'em', '%', 'vh', 'vw', 'custom'], true) ? (string) $position['unit'] : 'px';
	foreach (['top', 'right', 'bottom', 'left'] as $side) {
		$value = $cssDimension((string) ($position[$side] ?? ''), $positionUnit, ['px', 'rem', 'em', '%', 'vh', 'vw', 'custom']);

		if ($value !== '') {
			$styles[] = $side . ': ' . $value;
		}
	}

	$zIndex = trim((string) ($advanced['zIndex'] ?? $settings['zIndex'] ?? ''));
	if ($zIndex !== '' && preg_match('/^-?\d+$/', $zIndex)) {
		$styles[] = 'z-index: ' . $zIndex;
	}

	$order = trim((string) ($advanced['order'] ?? $settings['order'] ?? ''));
	if ($order !== '' && preg_match('/^-?\d+$/', $order)) {
		$styles[] = 'order: ' . $order;
	}

	return $styles ? ' style="' . htmlspecialchars(implode('; ', $styles), ENT_QUOTES, 'UTF-8') . '"' : '';
};

$visibilityClass = static function (array $settings) use ($settingGroup, $truthy): string {
	$responsive = $settingGroup($settings, 'responsive');

	if (!$responsive) {
		$responsive = match ((string) ($settings['visibility'] ?? 'all')) {
			'desktop' => ['hideTablet' => true, 'hideMobile' => true],
			'tablet' => ['hideDesktop' => true, 'hideMobile' => true],
			'mobile' => ['hideDesktop' => true, 'hideTablet' => true],
			'hidden' => ['hideDesktop' => true, 'hideTablet' => true, 'hideMobile' => true],
			default => [],
		};
	}

	$classes = [];
	foreach ([
		'hideDesktop' => 'carlix-hide-desktop',
		'hideTablet' => 'carlix-hide-tablet',
		'hideMobile' => 'carlix-hide-mobile',
		'hidePhone' => 'carlix-hide-phone',
		'hideLargePhone' => 'carlix-hide-large-phone',
		'hideSmallDesktop' => 'carlix-hide-small-desktop',
		'hideLargeDesktop' => 'carlix-hide-large-desktop',
		'hideExtraLargeDesktop' => 'carlix-hide-extra-large-desktop',
	] as $key => $class) {
		if ($truthy($responsive[$key] ?? false)) {
			$classes[] = $class;
		}
	}

	return $classes ? ' ' . implode(' ', $classes) : '';
};

$advancedValue = static function (array $settings, string $key, string $legacyKey = '') use ($settingGroup): string {
	$hasAdvanced = is_array($settings['advanced'] ?? null);
	$advanced    = $settingGroup($settings, 'advanced');
	$value       = $advanced[$key] ?? null;

	if (!$hasAdvanced && ($value === null || $value === '') && $legacyKey !== '') {
		$value = $settings[$legacyKey] ?? null;
	}

	return trim((string) ($value ?? ''));
};

$containerClass = static function (string $width): string {
	return match ($width) {
		'container-fluid' => 'carlix-container carlix-container-fluid',
		'full' => 'carlix-container-full',
		default => 'carlix-container',
	};
};

/*
 * Mapeia o objeto grid do Layout Manager (6 breakpoints) para as classes
 * .col-* / .col-sm-* / .col-md-* / .col-lg-* / .col-xl-* / .col-xxl-* do
 * grid.css. Mobile-first: se um breakpoint não tem valor definido, herda
 * do breakpoint anterior — assim, layouts antigos que só configuraram
 * desktop não caem indevidamente para "12" em mobile/tablet.
 */
$gridClass = static function (array $grid): string {
	$order = [
		'phone'              => 'col',
		'largePhone'         => 'col-sm',
		'tablet'             => 'col-md',
		'smallDesktop'       => 'col-lg',
		'largeDesktop'       => 'col-xl',
		'extraLargeDesktop'  => 'col-xxl',
	];

	$valid = static function ($value): bool {
		if ($value === null || $value === '') {
			return false;
		}

		if ($value === 'hidden' || $value === 'auto') {
			return true;
		}

		$int = (int) $value;

		return (string) $int === (string) $value && $int >= 1 && $int <= 12;
	};

	$resolved = [];
	$last     = '12';

	foreach ($order as $key => $_prefix) {
		$raw = isset($grid[$key]) ? (string) $grid[$key] : '';

		if ($valid($raw)) {
			$last = $raw;
		}

		$resolved[$key] = $last;
	}

	$classes = [];
	$previous = null;

	foreach ($order as $key => $prefix) {
		$value = $resolved[$key];

		/* Se este breakpoint resolve para o MESMO valor que o anterior,
		   o CSS herda automaticamente. Pular evita duplicação visual e
		   reduz o ruido no DOM. O breakpoint base (phone) sempre entra. */
		if ($previous !== null && $value === $previous) {
			continue;
		}

		if ($value === 'hidden') {
			$classes[] = $prefix . '-hidden';
		} elseif ($value === 'auto') {
			$classes[] = $prefix . '-auto';
		} else {
			$classes[] = $prefix . '-' . (int) $value;
		}

		$previous = $value;
	}

	return implode(' ', $classes);
};

$columnIsNavigation = static function (array $column, string $sectionType): bool {
	$position = trim((string) ($column['position'] ?? ''));

	return !empty($column['mainNavigation'])
		|| $sectionType === 'nav'
		|| ($position === 'menu' && in_array($sectionType, ['header', 'nav'], true));
};

$columnHasContent = static function (array $column, string $sectionType = 'section') use ($document, $hasMenu, $hasOffcanvas, $desktopMenuEnabled, $columnIsNavigation): bool {
	if (!empty($column['componentArea'])) {
		return true;
	}

	if ($columnIsNavigation($column, $sectionType)) {
		return $hasMenu && ($desktopMenuEnabled || $hasOffcanvas);
	}

	$position = trim((string) ($column['position'] ?? ''));

	if ($position === '') {
		return false;
	}

	return $position === 'logo' || (bool) $document->countModules($position);
};

$sectionHasContent = static function (array $item) use (&$columnHasContent): bool {
	if (($item['enabled'] ?? true) === false) {
		return false;
	}

	$settings = is_array($item['settings'] ?? null) ? $item['settings'] : [];
	$isCredits = strtolower((string) ($item['title'] ?? '')) === 'credits'
		|| str_contains(' ' . strtolower((string) ($settings['customClass'] ?? '')) . ' ', ' credits ');

	if ($isCredits) {
		return true;
	}

	if (($item['type'] ?? '') === 'header') {
		return true;
	}

	foreach (($item['rows'] ?? []) as $row) {
		foreach (($row['columns'] ?? []) as $column) {
			if ($columnHasContent($column, (string) ($item['type'] ?? 'section'))) {
				return true;
			}
		}
	}

	return false;
};

$renderOffcanvas = static function () use ($hasOffcanvas, $hasMenu, $offcanvasSide, $ocLogoAlign, $offcanvasLogoHtml, $offcanvasShowLogo, $offcanvasCloseOnClick, $renderModules, $document): void {
	if (!$hasOffcanvas) {
		return;
	}
	?>
	<div class="carlix-offcanvas-backdrop" data-carlix-offcanvas-close aria-hidden="true" hidden></div>
	<aside id="carlix-offcanvas-menu" class="carlix-offcanvas carlix-offcanvas--<?php echo $offcanvasSide; ?>" aria-label="<?php echo Text::_('TPL_HC_CARLIX_MAIN_MENU'); ?>" aria-hidden="true" data-carlix-close-on-click="<?php echo $offcanvasCloseOnClick ? '1' : '0'; ?>">
		<?php if ($offcanvasShowLogo) : ?>
		<div class="carlix-offcanvas-header carlix-offcanvas-header--<?php echo $ocLogoAlign; ?>">
			<?php echo $offcanvasLogoHtml; ?>
			<button class="carlix-offcanvas-close" type="button" data-carlix-offcanvas-close aria-label="<?php echo Text::_('JCLOSE'); ?>">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<?php else : ?>
		<div class="carlix-offcanvas-header carlix-offcanvas-header--end">
			<button class="carlix-offcanvas-close" type="button" data-carlix-offcanvas-close aria-label="<?php echo Text::_('JCLOSE'); ?>">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<?php endif; ?>
		<?php if ($hasMenu) : ?>
		<nav class="carlix-offcanvas-nav" aria-label="<?php echo Text::_('TPL_HC_CARLIX_MAIN_MENU'); ?>">
			<?php
			$renderModules('menu', ['style' => 'none'], '_:default', [
				'tag_id' => 'carlix-offcanvas-menu-{id}',
			]);
			?>
		</nav>
		<?php endif; ?>
		<?php if ($document->countModules('navigation-mobile')) : ?>
		<div class="carlix-offcanvas-modules">
			<?php $renderModules('navigation-mobile'); ?>
		</div>
		<?php endif; ?>
		<?php if ($document->countModules('mobile-menu')) : ?>
		<div class="carlix-offcanvas-modules">
			<?php $renderModules('mobile-menu'); ?>
		</div>
		<?php endif; ?>
		<?php if ($document->countModules('offcanvas')) : ?>
		<div class="carlix-offcanvas-modules">
			<?php $renderModules('offcanvas'); ?>
		</div>
		<?php endif; ?>
	</aside>
	<?php
};

$renderMenuToggle = static function () use ($hasOffcanvas, $desktopOffcanvasEnabled, $mobileButtonPosition): void {
	if (!$hasOffcanvas) {
		return;
	}

	$position = htmlspecialchars($mobileButtonPosition, ENT_QUOTES, 'UTF-8');
	?>
	<div class="carlix-mobile-nav carlix-nav-toggle-column carlix-nav-toggle-column--<?php echo $position; ?> carlix-mobile-nav--<?php echo $position; ?><?php echo $desktopOffcanvasEnabled ? ' carlix-mobile-nav--desktop' : ''; ?>">
		<button class="carlix-menu-toggle" type="button" aria-controls="carlix-offcanvas-menu" aria-expanded="false">
			<span class="carlix-menu-toggle-bars" aria-hidden="true"></span>
			<span class="visually-hidden"><?php echo Text::_('TPL_HC_CARLIX_TOGGLE_MENU'); ?></span>
		</button>
	</div>
	<?php
};

$renderManagedColumn = static function (array $column, string $sectionType) use ($gridClass, $safeToken, $styleAttr, $visibilityClass, $advancedValue, $renderModules, $logoHtml, $document, $hasMenu, $desktopMenuEnabled, $menuAlign, $menuInteraction, $submenuDirection, $submenuAnimation, $renderLegacyLogoModule, $debugLayoutAttrs, $columnIsNavigation): void {
	$settings = is_array($column['settings'] ?? null) ? $column['settings'] : [];
	$grid     = is_array($column['grid'] ?? null) ? $column['grid'] : [];
	$columnPosition = trim((string) ($column['position'] ?? ''));
	$isNavigationColumn = $columnIsNavigation($column, $sectionType);

	if ($isNavigationColumn && (!$desktopMenuEnabled || !$hasMenu)) {
		return;
	}

	$classes  = [
		'carlix-layout-column',
		$isNavigationColumn ? 'carlix-nav-column' : '',
		$gridClass($grid),
		$safeToken($advancedValue($settings, 'customClass', 'customClass')),
		$visibilityClass($settings),
	];

	/* Atributo de debug — espelha o grid do JSON em ordem mobile-first
	   (phone, sm, md, lg, xl, xxl). Util para inspecionar o que veio do
	   Layout Manager sem precisar olhar as classes do CSS. */
	$dataGrid = '';
	$dataPosition = '';

	if ($debugLayoutAttrs) {
		$gridShort = [];
		foreach (['phone', 'largePhone', 'tablet', 'smallDesktop', 'largeDesktop', 'extraLargeDesktop'] as $bp) {
			$gridShort[] = isset($grid[$bp]) && $grid[$bp] !== '' ? (string) $grid[$bp] : '-';
		}

		$dataGrid = ' data-carlix-grid="' . htmlspecialchars(implode('/', $gridShort), ENT_QUOTES, 'UTF-8') . '"';
		$dataPosition = $columnPosition !== '' ? ' data-carlix-position="' . htmlspecialchars($columnPosition, ENT_QUOTES, 'UTF-8') . '"' : '';
	}
	?>
	<div class="<?php echo htmlspecialchars(trim(implode(' ', array_filter($classes))), ENT_QUOTES, 'UTF-8'); ?>"<?php echo $dataGrid; ?><?php echo $dataPosition; ?><?php echo $styleAttr($settings, !$isNavigationColumn); ?>>
		<?php if (!empty($column['componentArea'])) : ?>
			<jdoc:include type="message" />
			<jdoc:include type="component" />
		<?php elseif ($isNavigationColumn) : ?>
			<?php if ($desktopMenuEnabled && $hasMenu) : ?>
			<div class="carlix-menu carlix-menu--<?php echo htmlspecialchars($menuAlign, ENT_QUOTES, 'UTF-8'); ?> carlix-menu--interaction-<?php echo htmlspecialchars($menuInteraction, ENT_QUOTES, 'UTF-8'); ?> carlix-menu--submenu-<?php echo htmlspecialchars($submenuDirection, ENT_QUOTES, 'UTF-8'); ?> carlix-menu--anim-<?php echo htmlspecialchars($submenuAnimation, ENT_QUOTES, 'UTF-8'); ?>" data-carlix-menu-interaction="<?php echo htmlspecialchars($menuInteraction, ENT_QUOTES, 'UTF-8'); ?>">
				<?php $renderModules('menu', ['style' => 'none'], '_:default'); ?>
			</div>
			<?php endif; ?>
		<?php else : ?>
			<?php
			$position = $columnPosition;

			if ($position === 'logo') {
				if ($renderLegacyLogoModule && $document->countModules('logo')) {
					$renderModules('logo', ['style' => 'none']);
				} else {
					echo $logoHtml;
				}
			} elseif ($position !== '') {
				$renderModules($position, ['style' => 'none'], $position === 'menu' ? '_:default' : null);
			}
			?>
		<?php endif; ?>
	</div>
	<?php
};

$renderManagedRow = static function (array $row, string $sectionType) use (&$renderManagedColumn, $renderMenuToggle, $safeToken, $styleAttr, $visibilityClass, $advancedValue, $columnHasContent, $columnIsNavigation, $hasOffcanvas, $mobileButtonPosition): void {
	$settings = is_array($row['settings'] ?? null) ? $row['settings'] : [];
	$gap = in_array((string) ($row['gap'] ?? 'md'), ['none', 'xs', 'sm', 'md', 'lg', 'xl'], true) ? (string) $row['gap'] : 'md';
	if (array_key_exists('gapEnabled', $row)) {
		$gapUnit = in_array((string) ($row['gapUnit'] ?? 'px'), ['px', 'rem', 'em', '%', 'custom'], true) ? (string) $row['gapUnit'] : 'px';
		$gapValue = trim((string) ($row['gapValue'] ?? '15'));
		$gapValue = preg_match('/^\d+(\.\d+)?$/', $gapValue) ? $gapValue : '15';
		$gapCustom = trim((string) ($row['gapCustom'] ?? ''));
		$settings['rowColumnGap'] = !empty($row['gapEnabled'])
			? ($gapUnit === 'custom' ? ($gapCustom !== '' ? $gapCustom : '15px') : (($gapValue === '' ? '15' : $gapValue) . $gapUnit))
			: '0px';
	}
	$rowHasNavigation = false;

	if ($hasOffcanvas && in_array($sectionType, ['header', 'nav'], true)) {
		foreach (($row['columns'] ?? []) as $column) {
			if ($columnIsNavigation($column, $sectionType)) {
				$rowHasNavigation = true;
				break;
			}
		}
	}
	$classes = [
		'carlix-row',
		'carlix-layout-row',
		'carlix-layout-row--gap-' . $gap,
		'carlix-layout-row--v-' . $safeToken((string) ($row['alignVertical'] ?? 'stretch')),
		'carlix-layout-row--h-' . $safeToken((string) ($row['alignHorizontal'] ?? 'start')),
		$rowHasNavigation ? 'carlix-row--toggle-' . $safeToken($mobileButtonPosition) : '',
		$safeToken($advancedValue($settings, 'customClass', 'customClass')),
		$visibilityClass($settings),
	];
	?>
	<div class="<?php echo htmlspecialchars(trim(implode(' ', array_filter($classes))), ENT_QUOTES, 'UTF-8'); ?>"<?php echo $styleAttr($settings, !$rowHasNavigation); ?>>
		<?php if ($rowHasNavigation && $mobileButtonPosition === 'start') : ?>
			<?php $renderMenuToggle(); ?>
		<?php endif; ?>
		<?php foreach (($row['columns'] ?? []) as $column) : ?>
			<?php if ($columnHasContent($column, $sectionType)) : ?>
				<?php $renderManagedColumn($column, $sectionType); ?>
			<?php endif; ?>
		<?php endforeach; ?>
		<?php if ($rowHasNavigation && $mobileButtonPosition === 'end') : ?>
			<?php $renderMenuToggle(); ?>
		<?php endif; ?>
	</div>
	<?php
};

$renderManagedSection = static function (array $item) use (&$renderManagedRow, $sectionHasContent, $columnHasContent, $safeToken, $styleAttr, $visibilityClass, $advancedValue, $containerClass, $siteName): void {
	if (!$sectionHasContent($item)) {
		return;
	}

	$type = in_array((string) ($item['type'] ?? 'section'), ['header', 'nav', 'section', 'footer'], true) ? (string) $item['type'] : 'section';
	$settings = is_array($item['settings'] ?? null) ? $item['settings'] : [];
	$customClass = $advancedValue($settings, 'customClass', 'customClass');
	$semanticName = strtolower(trim((string) ($item['title'] ?? '') . ' ' . (string) ($item['id'] ?? '') . ' ' . $customClass));
	$semanticClass = match (true) {
		str_contains($semanticName, 'topbar') => 'carlix-topbar',
		str_contains($semanticName, 'banner') => 'carlix-banner',
		str_contains($semanticName, 'breadcrumb') => 'carlix-breadcrumbs',
		str_contains($semanticName, 'top') => 'carlix-top',
		str_contains($semanticName, 'bottom') => 'carlix-bottom',
		str_contains($semanticName, 'credits') => 'carlix-credits',
		default => '',
	};
	$isCredits = strtolower((string) ($item['title'] ?? '')) === 'credits'
		|| str_contains(' ' . strtolower($customClass) . ' ', ' credits ');
	$hasAnyContent = false;

	foreach (($item['rows'] ?? []) as $row) {
		foreach (($row['columns'] ?? []) as $column) {
			if ($columnHasContent($column, $type)) {
				$hasAnyContent = true;
				break 2;
			}
		}
	}
	$tag = match ($type) {
		'header' => 'header',
		'nav' => 'nav',
		'footer' => 'footer',
		default => 'section',
	};

	if ($type === 'section') {
		$tag = match ($semanticClass) {
			'carlix-topbar' => 'aside',
			'carlix-breadcrumbs', 'carlix-credits' => 'div',
			default => $tag,
		};
	}

	$hasComponent = false;

	foreach (($item['rows'] ?? []) as $row) {
		foreach (($row['columns'] ?? []) as $column) {
			if (!empty($column['componentArea'])) {
				$hasComponent = true;
				break 2;
			}
		}
	}

	if ($hasComponent) {
		$tag = 'main';
	}

	$modeValue = (string) ($item['mode'] ?? 'sticky');
	$mode = in_array($modeValue, ['static', 'sticky', 'fixed'], true) ? $modeValue : 'sticky';
	$classes = [
		'carlix-session',
		'carlix-layout-section',
		'carlix-layout-section--' . $type,
		$semanticClass,
		$hasComponent ? 'carlix-main' : '',
		$type === 'header' ? 'carlix-header carlix-header--' . $mode : '',
		$type === 'nav' ? 'carlix-navigation' : '',
		$type === 'footer' ? 'carlix-footer' : '',
		!empty($item['header']['shrinkOnScroll']) ? 'carlix-header--shrink-on-scroll' : '',
		!empty($item['header']['shadowOnScroll']) ? 'carlix-header--shadow-on-scroll' : '',
		!empty($item['header']['backgroundScroll']) ? 'carlix-header--background-on-scroll' : '',
		!empty($item['header']['transparentInitial']) ? 'carlix-header--transparent-initial' : '',
		!empty($item['header']['blurBackground']) ? 'carlix-header--blur' : '',
		!empty($item['header']['overlayContent']) ? 'carlix-header--overlay' : '',
		$safeToken($customClass),
		$visibilityClass($settings),
	];
	$id = in_array($type, ['header', 'footer'], true) ? $safeToken($advancedValue($settings, 'customId', 'customId')) : '';
	$id = $hasComponent && $id === '' ? 'carlix-main' : $id;
	$dataHeader = $type === 'header'
		? ' data-carlix-header="' . htmlspecialchars($mode, ENT_QUOTES, 'UTF-8') . '" data-carlix-header-behavior="' . htmlspecialchars((string) ($item['header']['behavior'] ?? 'always'), ENT_QUOTES, 'UTF-8') . '"'
		: '';
	$mainAttrs = $hasComponent ? ' tabindex="-1"' : '';
	$sectionStyle = $styleAttr($settings, !in_array($type, ['header', 'nav'], true));

	if ($type === 'header') {
		$headerStyles = [];
		$headerMap = [
			'transitionSpeed' => '--carlix-header-transition',
			'heightDesktop' => '--carlix-header-height-desktop',
			'heightTablet' => '--carlix-header-height-tablet',
			'heightMobile' => '--carlix-header-height-mobile',
		];

		foreach ($headerMap as $key => $property) {
			$value = trim((string) ($item['header'][$key] ?? ''));

			if ($value !== '') {
				$headerStyles[] = $property . ': ' . $value;
			}
		}

		if ($headerStyles) {
			$extraStyle = htmlspecialchars(implode('; ', $headerStyles), ENT_QUOTES, 'UTF-8');
			$sectionStyle = $sectionStyle === ''
				? ' style="' . $extraStyle . '"'
				: substr($sectionStyle, 0, -1) . '; ' . $extraStyle . '"';
		}
	}
	?>
	<<?php echo $tag; ?> class="<?php echo htmlspecialchars(trim(implode(' ', array_filter($classes))), ENT_QUOTES, 'UTF-8'); ?>"<?php echo $id !== '' ? ' id="' . htmlspecialchars($id, ENT_QUOTES, 'UTF-8') . '"' : ''; ?><?php echo $mainAttrs; ?><?php echo $dataHeader; ?><?php echo $sectionStyle; ?>>
		<div class="<?php echo htmlspecialchars($containerClass((string) ($item['width'] ?? 'container')), ENT_QUOTES, 'UTF-8'); ?>">
			<?php if ($isCredits && !$hasAnyContent) : ?>
				<p class="carlix-credits-text">&copy; <?php echo date('Y'); ?> <?php echo $siteName; ?></p>
			<?php else : ?>
				<?php foreach (($item['rows'] ?? []) as $row) : ?>
					<?php $renderManagedRow($row, $type); ?>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	</<?php echo $tag; ?>>
	<?php
};

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<jdoc:include type="metas" />
	<link rel="icon" type="<?php echo $faviconType; ?>" href="<?php echo htmlspecialchars($faviconSrc, ENT_QUOTES, 'UTF-8'); ?>">
	<?php if ($appleTouchIconSrc !== '') : ?>
	<link rel="apple-touch-icon" href="<?php echo htmlspecialchars($appleTouchIconSrc, ENT_QUOTES, 'UTF-8'); ?>">
	<?php endif; ?>
	<meta name="theme-color" content="<?php echo htmlspecialchars($themeColor, ENT_QUOTES, 'UTF-8'); ?>">
	<?php echo $styleBlock($criticalCss); ?>
	<jdoc:include type="styles" />
	<style>:root { <?php echo implode('; ', $cssVars); ?>; }</style>
	<style>
	.carlix-site > :not(.carlix-skip-link):not(.carlix-offcanvas):not(.carlix-offcanvas-backdrop) { position: relative; z-index: var(--carlix-layer, 1); }
	.carlix-header,
	.carlix-navigation { --carlix-layer: 60; position: relative; z-index: var(--carlix-layer); overflow: visible; }
	.carlix-header--sticky,
	.carlix-header--fixed,
	.carlix-header--floating { --carlix-layer: 70; }
	.carlix-header > .carlix-container,
	.carlix-header .carlix-row,
	.carlix-header .carlix-layout-row,
	.carlix-header .carlix-layout-column,
	.carlix-navigation > .carlix-container,
	.carlix-navigation .carlix-row,
	.carlix-navigation .carlix-layout-row,
	.carlix-navigation .carlix-layout-column { overflow: visible; }
	.carlix-header .carlix-row--toggle-start { grid-template-columns: auto repeat(12, minmax(0, 1fr)); }
	.carlix-header .carlix-row--toggle-end { grid-template-columns: repeat(12, minmax(0, 1fr)) auto; }
	.carlix-header .carlix-nav-toggle-column { position: relative; top: auto; display: none; align-items: center; justify-content: center; align-self: center; justify-self: center; width: auto; min-width: var(--carlix-mobile-button-size, 2.75rem); height: auto; transform: none; }
	.carlix-header .carlix-nav-toggle-column--start { grid-column: 1 / 2; grid-row: 1; }
	.carlix-header .carlix-nav-toggle-column--end { grid-column: -2 / -1; grid-row: 1; }
	.carlix-menu .carlix-nav > .has-submenu { z-index: 20; }
	.carlix-menu .carlix-nav > .has-submenu:hover,
	.carlix-menu .carlix-nav > .has-submenu:focus-within,
	.carlix-menu .carlix-nav > .submenu-open { z-index: 120; }
	.carlix-menu .carlix-nav-sub { z-index: 120; }
	@media (max-width: 1023px) {
		.carlix-header .carlix-nav-column { display: none; }
		.carlix-header .carlix-nav-toggle-column { display: flex; }
	}
	@media (min-width: 1024px) {
		.carlix-header .carlix-nav-toggle-column:not(.carlix-mobile-nav--desktop) { display: none; }
		.carlix-header .carlix-nav-toggle-column.carlix-mobile-nav--desktop { display: flex; }
	}
	</style>
	<?php echo $styleBlock($customCss); ?>
	<?php echo $styleBlock($customCssDesktop, '(min-width: 992px)'); ?>
	<?php echo $styleBlock($customCssTablet, '(min-width: 768px) and (max-width: 991.98px)'); ?>
	<?php echo $styleBlock($customCssMobile, '(max-width: 767.98px)'); ?>
	<?php echo $styleBlock($additionalCss); ?>
	<?php echo $scriptBlock($customJsHead); ?>
	<?php if (trim($headCode) !== '') { echo $headCode; } ?>
</head>
<body class="<?php echo htmlspecialchars(trim(implode(' ', array_filter($bodyClasses))), ENT_QUOTES, 'UTF-8'); ?>">
	<?php if (trim($autoBodyStartCode) !== '') { echo $autoBodyStartCode; } ?>
	<?php if (trim($bodyStartCode) !== '') { echo $bodyStartCode; } ?>
	<?php if (trim($noscriptCode) !== '') { echo $noscriptCode; } ?>

	<a class="carlix-skip-link" href="#carlix-main"><?php echo Text::_('TPL_HC_CARLIX_SKIP_TO_CONTENT'); ?></a>

	<?php if ($useManagedLayout) : ?>
		<?php foreach ($managedLayout['items'] as $layoutItem) : ?>
			<?php $renderManagedSection($layoutItem); ?>
		<?php endforeach; ?>
		<?php $renderOffcanvas(); ?>
	<?php else : ?>

	<?php // ===== SEÇÃO: TOPBAR ===== ?>
	<?php if ($topbar) : $c = $colClass(count($topbar)); ?>
	<aside class="carlix-session carlix-topbar">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($topbar as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</aside>
	<?php endif; ?>

		<?php // ===== SEÇÃO: HEADER (sempre) — logo 3 | menu 7 | busca 2 ===== ?>
		<header class="carlix-session carlix-header carlix-header--<?php echo $headerBehavior; ?>" data-carlix-header="<?php echo $headerBehavior; ?>">
			<div class="carlix-container">
				<div class="carlix-row<?php echo $hasOffcanvas ? ' carlix-row--toggle-' . htmlspecialchars($mobileButtonPosition, ENT_QUOTES, 'UTF-8') : ''; ?>">

				<?php if ($mobileButtonPosition === 'start') : ?>
					<?php $renderMenuToggle(); ?>
				<?php endif; ?>

				<div class="col-8 col-lg-3 carlix-logo-slot carlix-logo-slot--<?php echo $logoAlign; ?>">
					<?php if ($renderLegacyLogoModule && $this->countModules('logo')) : ?>
						<?php $renderModules('logo'); ?>
					<?php else : ?>
						<?php echo $logoHtml; ?>
					<?php endif; ?>
				</div>

				<?php if ($desktopMenuEnabled && $hasMenu) : ?>
					<div class="col-12 col-lg-7 carlix-menu carlix-menu--<?php echo $menuAlign; ?> carlix-menu--interaction-<?php echo htmlspecialchars($menuInteraction, ENT_QUOTES, 'UTF-8'); ?> carlix-menu--submenu-<?php echo htmlspecialchars($submenuDirection, ENT_QUOTES, 'UTF-8'); ?> carlix-menu--anim-<?php echo htmlspecialchars($submenuAnimation, ENT_QUOTES, 'UTF-8'); ?>" data-carlix-menu-interaction="<?php echo htmlspecialchars($menuInteraction, ENT_QUOTES, 'UTF-8'); ?>">
						<?php $renderModules('menu', ['style' => 'none'], '_:default'); ?>
					</div>
				<?php endif; ?>

				<?php if ($this->countModules('search')) : ?>
					<div class="col-12 col-lg-2 carlix-search">
						<?php $renderModules('search'); ?>
					</div>
				<?php endif; ?>

				<?php if ($mobileButtonPosition === 'end') : ?>
					<?php $renderMenuToggle(); ?>
				<?php endif; ?>

			</div>
		</div>
	</header>

	<?php $renderOffcanvas(); ?>

	<?php // ===== SEÇÃO: BANNER ===== ?>
	<?php if ($this->countModules('banner')) : ?>
	<section class="carlix-session carlix-banner">
		<div class="carlix-container">
			<div class="carlix-row">
				<div class="col-12"><?php $renderModules('banner'); ?></div>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SEÇÃO: BREADCRUMBS ===== ?>
	<?php if ($this->countModules('breadcrumbs')) : ?>
	<nav class="carlix-session carlix-breadcrumbs" aria-label="<?php echo Text::_('TPL_HC_CARLIX_BREADCRUMB'); ?>">
		<div class="carlix-container">
			<div class="carlix-row">
				<div class="col-12"><?php $renderModules('breadcrumbs'); ?></div>
			</div>
		</div>
	</nav>
	<?php endif; ?>

	<?php // ===== SEÇÃO: TOP ===== ?>
	<?php if ($top) : $c = $colClass(count($top)); ?>
	<section class="carlix-session carlix-top">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($top as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SEÇÃO: MAIN (sempre) — [sidebar-left] conteúdo [sidebar-right] ===== ?>
	<main id="carlix-main" class="carlix-session carlix-main" role="main" tabindex="-1">
		<div class="carlix-container">
			<div class="carlix-row">

				<?php if ($hasL) : ?>
				<aside class="col-12 col-lg-<?php echo $leftSpan; ?> carlix-sidebar carlix-sidebar-left" aria-label="<?php echo Text::_('TPL_HC_CARLIX_SIDEBAR_LEFT'); ?>">
					<?php $renderModules('sidebar-left'); ?>
				</aside>
				<?php endif; ?>

				<div class="col-12 col-lg-<?php echo $contentSpan; ?> carlix-content">
					<?php if ($this->countModules('main-top')) : ?>
						<div class="carlix-main-top">
							<?php $renderModules('main-top'); ?>
						</div>
					<?php endif; ?>

					<jdoc:include type="message" />
					<jdoc:include type="component" />

					<?php if ($this->countModules('main-bottom')) : ?>
						<div class="carlix-main-bottom">
							<?php $renderModules('main-bottom'); ?>
						</div>
					<?php endif; ?>
				</div>

				<?php if ($hasR) : ?>
				<aside class="col-12 col-lg-<?php echo $rightSpan; ?> carlix-sidebar carlix-sidebar-right" aria-label="<?php echo Text::_('TPL_HC_CARLIX_SIDEBAR_RIGHT'); ?>">
					<?php $renderModules('sidebar-right'); ?>
				</aside>
				<?php endif; ?>

			</div>
		</div>
	</main>

	<?php // ===== SEÇÃO: BOTTOM ===== ?>
	<?php if ($bottom) : $c = $colClass(count($bottom)); ?>
	<section class="carlix-session carlix-bottom">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($bottom as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SEÇÃO: FOOTER ===== ?>
	<?php if ($foot) : $c = $colClass(count($foot)); ?>
	<footer class="carlix-session carlix-footer">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($foot as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</footer>
	<?php endif; ?>

	<?php // ===== SEÇÃO: CREDITS (sempre) — até 4 colunas; senão fallback © ===== ?>
	<div class="carlix-session carlix-credits">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php if ($creds) : $c = $colClass(count($creds)); ?>
					<?php foreach ($creds as $p) : ?>
						<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
					<?php endforeach; ?>
				<?php else : ?>
					<div class="col-12">
						<p class="carlix-credits-text">&copy; <?php echo date('Y'); ?> <?php echo $siteName; ?></p>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<?php endif; ?>

	<?php if ($this->countModules('debug')) : ?>
	<?php $renderModules('debug'); ?>
	<?php endif; ?>

	<?php if ($backToTop) : ?>
	<button type="button" class="carlix-to-top" data-carlix-to-top aria-label="<?php echo Text::_('TPL_HC_CARLIX_BACK_TO_TOP'); ?>" hidden>
		<span aria-hidden="true">&uarr;</span>
	</button>
	<?php endif; ?>

	<jdoc:include type="scripts" />
	<?php if ($enableLazyImages || $enableLazyIframes) : ?>
	<script>document.addEventListener("DOMContentLoaded",function(){<?php if ($enableLazyImages) : ?>document.querySelectorAll("img:not([loading])").forEach(function(el){el.loading="lazy";});<?php endif; ?><?php if ($enableLazyIframes) : ?>document.querySelectorAll("iframe:not([loading])").forEach(function(el){el.loading="lazy";});<?php endif; ?>});</script>
	<?php endif; ?>
	<?php echo $scriptBlock($customJsFooter); ?>
	<?php echo $domReadyBlock($customJsDomReady); ?>
	<?php if (trim($bodyCode) !== '') { echo $bodyCode; } ?>
</body>
</html>
