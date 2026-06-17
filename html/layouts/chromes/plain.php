<?php

/**
 * HC Carlix — Module chrome "plain".
 *
 * Wrapper mínimo, sem caixa de card. Apenas título opcional + conteúdo.
 * O elemento externo é o grid-item e recebe o "Module Class Suffix",
 * permitindo controle de largura via `carlix-col-N` no grid 12 colunas.
 *
 * Uso: <jdoc:include type="modules" name="footer1" style="plain" />
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix.Chromes
 * @version     1.0.0
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE
 */

\defined('_JEXEC') or die;

extract($displayData);

/**
 * @var   object                     $module   Dados do módulo
 * @var   \Joomla\Registry\Registry  $params   Parâmetros do módulo
 * @var   array                      $attribs  Atributos do jdoc:include
 */

if (empty(trim((string) $module->content))) {
	return;
}

$sfx       = trim((string) $params->get('moduleclass_sfx', ''));
$headerTag = htmlspecialchars((string) ($attribs['headerTag'] ?? 'h2'), ENT_QUOTES, 'UTF-8');
$classes   = trim('carlix-module carlix-module-plain ' . $sfx);
?>
<div class="<?php echo htmlspecialchars($classes, ENT_QUOTES, 'UTF-8'); ?>">
	<?php if ((bool) $module->showtitle) : ?>
		<<?php echo $headerTag; ?> class="carlix-module-title"><?php echo $module->title; ?></<?php echo $headerTag; ?>>
	<?php endif; ?>
	<div class="carlix-module-content">
		<?php echo $module->content; ?>
	</div>
</div>
