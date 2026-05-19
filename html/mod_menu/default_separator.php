<?php

/**
 * HC Carlix - separator menu item.
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix.mod_menu
 */

\defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;

$title      = $item->anchor_title ? ' title="' . htmlspecialchars($item->anchor_title, ENT_QUOTES, 'UTF-8') . '"' : '';
$anchorCss  = $item->anchor_css ?: '';
$submenuAttributes = !empty($hasChildren) ? ' aria-haspopup="true"' : '';
$itemParams = $item->getParams();
$linktype   = htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8');

if ($item->menu_icon) {
	if ($itemParams->get('menu_text', 1)) {
		$linktype = '<span class="' . htmlspecialchars($item->menu_icon, ENT_QUOTES, 'UTF-8') . '" aria-hidden="true"></span>' . $linktype;
	} else {
		$linktype = '<span class="' . htmlspecialchars($item->menu_icon, ENT_QUOTES, 'UTF-8') . '" aria-hidden="true"></span><span class="visually-hidden">' . $linktype . '</span>';
	}
} elseif ($item->menu_image) {
	$imageAttributes = [];

	if ($item->menu_image_css) {
		$imageAttributes['class'] = $item->menu_image_css;
	}

	$linktype = HTMLHelper::_('image', $item->menu_image, '', $imageAttributes);

	if ($itemParams->get('menu_text', 1)) {
		$linktype .= '<span class="image-title">' . htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8') . '</span>';
	}
}
?>
<span class="mod-menu__separator separator <?php echo htmlspecialchars($anchorCss, ENT_QUOTES, 'UTF-8'); ?>"<?php echo $title . $submenuAttributes; ?>><?php echo $linktype; ?></span>
