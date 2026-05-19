<?php

/**
 * HC Carlix — Error page (4xx / 5xx).
 *
 * Página única e independente, sem dependência de módulos. Mostra código
 * do erro, mensagem amigável e botão de retorno para a home.
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix
 * @version     1.0.0
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Document\ErrorDocument;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

/** @var ErrorDocument $this */

$app      = Factory::getApplication();
$siteName = htmlspecialchars((string) $app->get('sitename'), ENT_QUOTES, 'UTF-8');
$code     = (int) ($this->error->getCode() ?: 500);
$message  = htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8');

// CSS direto via tag (em error.php o WAM pode estar indisponível dependendo do estado)
$css = Uri::root(true) . '/media/templates/site/hc_carlix/css/template.css';

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow">
	<title><?php echo $code; ?> &middot; <?php echo $siteName; ?></title>
	<link rel="stylesheet" href="<?php echo $css; ?>">
</head>
<body class="carlix-error">
	<main class="carlix-container carlix-error-page" role="main">
		<p class="carlix-error-code"><?php echo $code; ?></p>
		<h1 class="carlix-error-title"><?php echo Text::_('TPL_HC_CARLIX_ERROR_TITLE'); ?></h1>
		<p class="carlix-error-message"><?php echo $message; ?></p>
		<p>
			<a class="carlix-btn carlix-btn-primary" href="<?php echo Uri::root(); ?>">
				<?php echo Text::_('TPL_HC_CARLIX_ERROR_HOME'); ?>
			</a>
		</p>
	</main>
</body>
</html>
