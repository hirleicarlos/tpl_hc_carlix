<?php

/**
 * HC Carlix — Component view (popups, prints, tmpl=component).
 *
 * Carrega o mínimo necessário: sem cabeçalho, sem rodapé, sem módulos.
 * Útil para impressão, modais e iframes.
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

/** @var HtmlDocument $this */

$wa = $this->getWebAssetManager();
$wa->useStyle('template.hc_carlix.template');

$this->setMetaData('robots', 'noindex,nofollow');
$this->setMetaData('viewport', 'width=device-width, initial-scale=1');

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<jdoc:include type="metas" />
	<jdoc:include type="styles" />
</head>
<body class="carlix-component">
	<main class="carlix-component-main" role="main">
		<jdoc:include type="message" />
		<jdoc:include type="component" />
	</main>
	<jdoc:include type="scripts" />
</body>
</html>
