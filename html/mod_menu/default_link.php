<?php

/**
 * HC Carlix - shared link renderer for mod_menu items.
 *
 * @package     HC.Carlix
 * @subpackage  Templates.hc_carlix.mod_menu
 *
 * @copyright   Copyright (C) 2026 Hirlei Carlos. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

\defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Filter\OutputFilter;

$attributes = [];

if ($item->anchor_title) {
	$attributes['title'] = $item->anchor_title;
}

if ($item->anchor_css) {
	$attributes['class'] = $item->anchor_css;
}

if ($item->anchor_rel) {
	$attributes['rel'] = $item->anchor_rel;
}

if ($item->id == $active_id) {
	$attributes['aria-current'] = $item->current ? 'page' : 'location';
}

if (!empty($hasChildren)) {
	$attributes['aria-haspopup'] = 'true';
}

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
	$linktype .= '<span class="image-title' . ($itemParams->get('menu_text', 1) ? '' : ' visually-hidden') . '">' . htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8') . '</span>';
}

if ($item->browserNav == 1) {
	$attributes['target'] = '_blank';
	$rel = trim(($attributes['rel'] ?? '') . ' noopener noreferrer');
	$attributes['rel'] = implode(' ', array_unique(array_filter(explode(' ', $rel))));
} elseif ($item->browserNav == 2) {
	$options = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,' . $params->get('window_open');
	$attributes['onclick'] = "window.open(this.href, 'targetWindow', '" . htmlspecialchars($options, ENT_QUOTES, 'UTF-8') . "'); return false;";
}

echo HTMLHelper::_('link', OutputFilter::ampReplace(htmlspecialchars($item->flink, ENT_COMPAT, 'UTF-8', false)), $linktype, $attributes);
