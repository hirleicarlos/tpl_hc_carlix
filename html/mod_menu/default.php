<?php

/**
 * HC Carlix - clean mod_menu override.
 *
 * Renders the Joomla menu as a simple semantic list owned by the template.
 * This keeps header menus away from Cassiopeia/Bootstrap layouts.
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix.mod_menu
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Helper\ModuleHelper;

$tagId      = $params->get('tag_id', '') ?: 'mod-menu' . $module->id;
$startLevel = (int) $params->get('startLevel', 1);
$menuClass  = trim('carlix-nav mod-menu mod-list ' . $class_sfx);
?>
<ul id="<?php echo htmlspecialchars($tagId, ENT_QUOTES, 'UTF-8'); ?>" class="<?php echo htmlspecialchars($menuClass, ENT_QUOTES, 'UTF-8'); ?>">
<?php foreach ($list as $item) : ?>
	<?php
	$itemParams = $item->getParams();
	$level       = max(1, (int) $item->level - $startLevel + 1);
	$hasChildren = (bool) $item->deeper;
	$classes     = [
		'nav-item',
		'item-' . (int) $item->id,
		'level-' . $level,
	];

	if ($item->id == $default_id) {
		$classes[] = 'default';
	}

	if ($item->id == $active_id || ($item->type === 'alias' && $itemParams->get('aliasoptions') == $active_id)) {
		$classes[] = 'current';
	}

	if (in_array($item->id, $path)) {
		$classes[] = 'active';
	} elseif ($item->type === 'alias') {
		$aliasToId = $itemParams->get('aliasoptions');

		if (count($path) > 0 && $aliasToId == $path[count($path) - 1]) {
			$classes[] = 'active';
		} elseif (in_array($aliasToId, $path)) {
			$classes[] = 'alias-parent-active';
		}
	}

	if ($item->type === 'separator') {
		$classes[] = 'divider';
	}

	if ($hasChildren) {
		$classes[] = 'deeper';
		$classes[] = 'parent';
		$classes[] = 'has-submenu';
	}
	?>
	<li class="<?php echo htmlspecialchars(implode(' ', $classes), ENT_QUOTES, 'UTF-8'); ?>">
		<?php
		switch ($item->type) :
			case 'separator':
			case 'component':
			case 'heading':
			case 'url':
				require ModuleHelper::getLayoutPath('mod_menu', 'default_' . $item->type);
				break;

			default:
				require ModuleHelper::getLayoutPath('mod_menu', 'default_url');
				break;
		endswitch;

		if ($hasChildren) {
			echo '<ul class="mod-menu__sub carlix-nav-sub">';
		} elseif ($item->shallower) {
			echo '</li>';
			echo str_repeat('</ul></li>', $item->level_diff);
		} else {
			echo '</li>';
		}
		?>
<?php endforeach; ?>
</ul>
