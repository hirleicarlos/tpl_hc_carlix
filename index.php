<?php

/**
 * HC Carlix Template for Joomla 6.x — organizacao das sessoes/posicoes.
 *
 * SESSAO  = faixa full-width (so renderiza se algum slot tiver modulo;
 *           HEADER/MAIN/CREDITS sempre). Gate via countModules(p).
 * POSICAO = ID unico de slot (Joomla position).
 * COLUNA  = grid.css. A largura da coluna numa faixa e calculada pelo
 *           numero de posicoes preenchidas (1=100, 2=50/50, 3=33, 4=25).
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix
 * @version     1.0.0
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

$siteName  = htmlspecialchars((string) $app->get('sitename'), ENT_QUOTES, 'UTF-8');

$cssValue = static function (string $name, string $default) use ($params): string {
	$value = trim((string) $params->get($name, $default));

	if ($value === '') {
		$value = $default;
	}

	return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
};

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

$cssVars = [
	'--carlix-text: ' . $cssValue('textColor', '#333333'),
	'--carlix-primary: ' . $cssValue('primaryColor', '#d32f2f'),
	'--carlix-secondary: ' . $cssValue('secondaryColor', '#151515'),
	'--carlix-menu-icon-color: ' . $cssValue('menuIconColor', '#111111'),
	'--carlix-submenu-min-width: ' . $cssValue('submenuMinWidth', '18rem'),
];

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

	/* Largura do container desta secao (vazio = herda a global; "full" = sem limite) */
	$secContainer = trim((string) $params->get($fieldPrefix . 'Container', ''));
	if ($secContainer !== '') {
		$cssVars[] = '--carlix-' . $section . '-container: '
			. (strcasecmp($secContainer, 'full') === 0 ? 'none' : htmlspecialchars($secContainer, ENT_QUOTES, 'UTF-8'));
	}
}

/* Largura global do container ("full" = largura total) */
$containerWidth = trim((string) $params->get('containerWidth', '1200px'));
if ($containerWidth === '') {
	$containerWidth = '1200px';
}
$cssVars[] = '--carlix-container: '
	. (strcasecmp($containerWidth, 'full') === 0 ? 'none' : htmlspecialchars($containerWidth, ENT_QUOTES, 'UTF-8'));

/* Logo: param OU webp empacotado (sem texto) */
$logoParam = trim((string) $params->get('logo', ''));
if ($logoParam !== '') {
	$logoSrc = Uri::root(true) . '/' . ltrim(HTMLHelper::cleanImageURL($logoParam)->url, '/');
} else {
	$logoSrc = Uri::root(true) . '/media/templates/site/hc_carlix/images/hc-carlix_logo.webp';
}
$logoHtml = '<a class="carlix-brand" href="' . Uri::root() . '" aria-label="' . $siteName . '">'
	. '<img class="carlix-logo" src="' . htmlspecialchars($logoSrc, ENT_QUOTES, 'UTF-8')
	. '" alt="' . $siteName . '"></a>';
$logoAlign = (string) $params->get('logoAlign', 'start');
$logoAlign = in_array($logoAlign, ['start', 'center', 'end'], true) ? $logoAlign : 'start';

/* Navegacao (parametros) */
$menuAlign      = (string) $params->get('menuAlign', 'start');
$menuAlign      = in_array($menuAlign, ['start', 'center', 'end'], true) ? $menuAlign : 'start';
$offcanvasSide  = $params->get('offcanvasSide', 'right') === 'left' ? 'left' : 'right';
$headerBehavior = (string) $params->get('headerBehavior', 'sticky');
$headerBehavior = in_array($headerBehavior, ['static', 'sticky', 'fixed', 'floating'], true) ? $headerBehavior : 'sticky';
$backToTop      = (int) $params->get('backToTop', 0);

$offcanvasLogoParam = trim((string) $params->get('offcanvasLogo', ''));
if ($offcanvasLogoParam !== '') {
	$ocLogoSrc = Uri::root(true) . '/' . ltrim(HTMLHelper::cleanImageURL($offcanvasLogoParam)->url, '/');
	$offcanvasLogoHtml = '<a class="carlix-brand" href="' . Uri::root() . '" aria-label="' . $siteName . '">'
		. '<img class="carlix-logo" src="' . htmlspecialchars($ocLogoSrc, ENT_QUOTES, 'UTF-8')
		. '" alt="' . $siteName . '"></a>';
} else {
	$offcanvasLogoHtml = $logoHtml;
}

$ocLogoAlign = (string) $params->get('offcanvasLogoAlign', 'start');
$ocLogoAlign = in_array($ocLogoAlign, ['start', 'center', 'end'], true) ? $ocLogoAlign : 'start';
$cssVars[]   = '--carlix-oc-logo-h: ' . $cssValue('offcanvasLogoHeight', '2.5rem');

/* Avancado: favicon, SEO, Google Analytics e codigo custom */
$faviconParam = trim((string) $params->get('favicon', ''));
$faviconSrc   = $faviconParam !== ''
	? Uri::root(true) . '/' . ltrim(HTMLHelper::cleanImageURL($faviconParam)->url, '/')
	: Uri::root(true) . '/media/templates/site/hc_carlix/images/hc-carlix_icon.webp';
$faviconExt   = strtolower(pathinfo((string) parse_url($faviconSrc, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'webp');
$faviconType  = [
	'ico' => 'image/x-icon', 'svg' => 'image/svg+xml', 'png' => 'image/png',
	'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'gif' => 'image/gif', 'webp' => 'image/webp',
][$faviconExt] ?? 'image/webp';

$gaId      = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $params->get('gaId', ''));
$customCss = (string) $params->get('customCss', '');
$headCode  = (string) $params->get('headCode', '');
$bodyCode  = (string) $params->get('bodyCode', '');

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
$pageDesc  = $ogDescription !== '' ? $ogDescription : $seoDescription;
$ogImage   = $absoluteImage($ogImageParam);

$metaTag('property', 'og:site_name', (string) $app->get('sitename'));
$metaTag('property', 'og:title', $pageTitle);
$metaTag('property', 'og:description', $pageDesc);
$metaTag('property', 'og:type', $ogType);
$metaTag('property', 'og:url', $canonicalUrl !== '' ? $canonicalUrl : Uri::current());
$metaTag('property', 'og:image', $ogImage);
$metaTag('name', 'twitter:card', $twitterCard);
$metaTag('name', 'twitter:title', $pageTitle);
$metaTag('name', 'twitter:description', $pageDesc);
$metaTag('name', 'twitter:image', $ogImage);

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

/* Classe de coluna conforme nº de posicoes preenchidas na faixa */
$colClass = static fn (int $n): string => match (max(1, $n)) {
	1       => 'col-12',
	2       => 'col-12 col-lg-6',
	3       => 'col-12 col-lg-4',
	default => 'col-12 col-md-6 col-lg-3',
};

/* Renderiza posicoes sem herdar layouts fixados por outro template. */
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
$hasOffcanvas = $hasMenu || (bool) $this->countModules('offcanvas');
$leftSpan    = $hasL ? 2 : 0;
$rightSpan   = $hasR ? 3 : 0;
$contentSpan = 12 - $leftSpan - $rightSpan; // 12, 10/9 ou 7

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<jdoc:include type="metas" />
	<link rel="icon" type="<?php echo $faviconType; ?>" href="<?php echo htmlspecialchars($faviconSrc, ENT_QUOTES, 'UTF-8'); ?>">
	<jdoc:include type="styles" />
	<style>:root { <?php echo implode('; ', $cssVars); ?>; }</style>
	<?php if (trim($customCss) !== '') : ?>
	<style><?php echo $customCss; ?></style>
	<?php endif; ?>
	<?php if ($gaId !== '') : ?>
	<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $gaId; ?>"></script>
	<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','<?php echo $gaId; ?>');</script>
	<?php endif; ?>
	<?php if (trim($headCode) !== '') { echo $headCode; } ?>
</head>
<body class="carlix-site">

	<a class="carlix-skip-link" href="#carlix-main"><?php echo Text::_('TPL_HC_CARLIX_SKIP_TO_CONTENT'); ?></a>

	<?php // ===== SESSAO: TOPBAR ===== ?>
	<?php if ($topbar) : $c = $colClass(count($topbar)); ?>
	<section class="carlix-session carlix-topbar">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($topbar as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SESSAO: HEADER (sempre) — logo 3 | menu 7 | busca 2 ===== ?>
	<header class="carlix-session carlix-header carlix-header--<?php echo $headerBehavior; ?>" data-carlix-header="<?php echo $headerBehavior; ?>">
		<div class="carlix-container">
			<div class="carlix-row">

				<div class="col-8 col-lg-3 carlix-logo-slot carlix-logo-slot--<?php echo $logoAlign; ?>">
					<?php if ($this->countModules('logo')) : ?>
						<?php $renderModules('logo'); ?>
					<?php else : ?>
						<?php echo $logoHtml; ?>
					<?php endif; ?>
				</div>

				<?php if ($hasOffcanvas) : ?>
					<div class="col-4 carlix-mobile-nav">
						<button class="carlix-menu-toggle" type="button" aria-controls="carlix-offcanvas-menu" aria-expanded="false">
							<span class="carlix-menu-toggle-bars" aria-hidden="true"></span>
							<span class="visually-hidden"><?php echo Text::_('TPL_HC_CARLIX_TOGGLE_MENU'); ?></span>
						</button>
					</div>
				<?php endif; ?>

				<?php if ($hasMenu) : ?>
					<div class="col-12 col-lg-7 carlix-menu carlix-menu--<?php echo $menuAlign; ?>">
						<?php $renderModules('menu', ['style' => 'none'], '_:default'); ?>
					</div>
				<?php endif; ?>

				<?php if ($this->countModules('search')) : ?>
					<div class="col-12 col-lg-2 carlix-search">
						<?php $renderModules('search'); ?>
					</div>
				<?php endif; ?>

			</div>
		</div>
	</header>

	<?php if ($hasOffcanvas) : ?>
		<div class="carlix-offcanvas-backdrop" data-carlix-offcanvas-close hidden></div>
		<aside id="carlix-offcanvas-menu" class="carlix-offcanvas carlix-offcanvas--<?php echo $offcanvasSide; ?>" aria-label="<?php echo Text::_('TPL_HC_CARLIX_MAIN_MENU'); ?>" aria-hidden="true">
			<div class="carlix-offcanvas-header carlix-offcanvas-header--<?php echo $ocLogoAlign; ?>">
				<?php echo $offcanvasLogoHtml; ?>
				<button class="carlix-offcanvas-close" type="button" data-carlix-offcanvas-close aria-label="<?php echo Text::_('JCLOSE'); ?>">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<?php if ($hasMenu) : ?>
			<nav class="carlix-offcanvas-nav" aria-label="<?php echo Text::_('TPL_HC_CARLIX_MAIN_MENU'); ?>">
				<?php
				$renderModules('menu', ['style' => 'none'], '_:default', [
					'tag_id' => 'carlix-offcanvas-menu-{id}',
				]);
				?>
			</nav>
			<?php endif; ?>
			<?php if ($this->countModules('offcanvas')) : ?>
			<div class="carlix-offcanvas-modules">
				<?php $renderModules('offcanvas'); ?>
			</div>
			<?php endif; ?>
		</aside>
	<?php endif; ?>

	<?php // ===== SESSAO: BANNER ===== ?>
	<?php if ($this->countModules('banner')) : ?>
	<section class="carlix-session carlix-banner">
		<div class="carlix-container">
			<div class="carlix-row">
				<div class="col-12"><?php $renderModules('banner'); ?></div>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SESSAO: BREADCRUMBS ===== ?>
	<?php if ($this->countModules('breadcrumbs')) : ?>
	<nav class="carlix-session carlix-breadcrumbs" aria-label="<?php echo Text::_('TPL_HC_CARLIX_BREADCRUMB'); ?>">
		<div class="carlix-container">
			<div class="carlix-row">
				<div class="col-12"><?php $renderModules('breadcrumbs'); ?></div>
			</div>
		</div>
	</nav>
	<?php endif; ?>

	<?php // ===== SESSAO: TOP ===== ?>
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

	<?php // ===== SESSAO: MAIN (sempre) — [sidebar-left] conteudo [sidebar-right] ===== ?>
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

	<?php // ===== SESSAO: BOTTOM ===== ?>
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

	<?php // ===== SESSAO: FOOTER ===== ?>
	<?php if ($foot) : $c = $colClass(count($foot)); ?>
	<section class="carlix-session carlix-footer">
		<div class="carlix-container">
			<div class="carlix-row">
				<?php foreach ($foot as $p) : ?>
					<div class="<?php echo $c; ?>"><?php $renderModules($p); ?></div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<?php // ===== SESSAO: CREDITS (sempre) — ate 4 colunas; senao fallback © ===== ?>
	<footer class="carlix-session carlix-credits" role="contentinfo">
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
	</footer>

	<?php if ($this->countModules('debug')) : ?>
	<?php $renderModules('debug'); ?>
	<?php endif; ?>

	<?php if ($backToTop) : ?>
	<button type="button" class="carlix-to-top" data-carlix-to-top aria-label="<?php echo Text::_('TPL_HC_CARLIX_BACK_TO_TOP'); ?>" hidden>
		<span aria-hidden="true">&uarr;</span>
	</button>
	<?php endif; ?>

	<jdoc:include type="scripts" />
	<?php if (trim($bodyCode) !== '') { echo $bodyCode; } ?>
</body>
</html>
