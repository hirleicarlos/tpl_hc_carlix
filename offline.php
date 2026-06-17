<?php

/**
 * HC Carlix — Offline / maintenance page.
 *
 * Renderizada quando o site está em modo offline. Apresenta a mensagem
 * configurada no Global Config e um formulário de login para administradores.
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
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\Module\Login\Site\Helper\LoginHelper;
use Joomla\Registry\Registry;

/** @var HtmlDocument $this */

$app      = Factory::getApplication();
$wa       = $this->getWebAssetManager();
$siteName = htmlspecialchars((string) $app->get('sitename'), ENT_QUOTES, 'UTF-8');
$loginReturn = (new LoginHelper())->getReturnUrlString(new Registry(['login' => 0]), 'login', $app);

$wa->useStyle('template.hc_carlix.icons')
   ->useStyle('template.hc_carlix.template');

$this->setMetaData('robots', 'noindex,nofollow');

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<jdoc:include type="metas" />
	<jdoc:include type="styles" />
</head>
<body class="carlix-offline">
	<main class="carlix-container carlix-offline-page" role="main">

		<h1 class="carlix-offline-title"><?php echo $siteName; ?></h1>

		<?php if ($app->get('display_offline_message', 1) == 1) : ?>
			<p class="carlix-offline-message">
				<?php echo htmlspecialchars((string) $app->get('offline_message'), ENT_QUOTES, 'UTF-8'); ?>
			</p>
		<?php elseif ($app->get('display_offline_message', 1) == 2) : ?>
			<p class="carlix-offline-message">
				<?php echo Text::_('JOFFLINE_MESSAGE'); ?>
			</p>
		<?php endif; ?>

		<jdoc:include type="message" />

		<form action="<?php echo Route::_('index.php', true); ?>" method="post" class="carlix-offline-form">
			<fieldset>
				<legend><?php echo Text::_('JLOGIN'); ?></legend>

				<p>
					<label for="username"><?php echo Text::_('JGLOBAL_USERNAME'); ?></label>
					<input id="username" name="username" type="text" autocomplete="username" required>
				</p>

				<p>
					<label for="passwd"><?php echo Text::_('JGLOBAL_PASSWORD'); ?></label>
					<input id="passwd" name="password" type="password" autocomplete="current-password" required>
				</p>

				<p>
					<button type="submit" class="carlix-btn carlix-btn-primary">
						<?php echo Text::_('JLOGIN'); ?>
					</button>
				</p>

				<input type="hidden" name="option" value="com_users">
				<input type="hidden" name="task" value="user.login">
				<input type="hidden" name="return" value="<?php echo $loginReturn; ?>">
				<?php echo HTMLHelper::_('form.token'); ?>
			</fieldset>
		</form>
	</main>
	<jdoc:include type="scripts" />
</body>
</html>
