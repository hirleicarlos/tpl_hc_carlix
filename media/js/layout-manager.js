/**
 * HC Carlix - Layout Manager admin UI.
 * Pure JavaScript, native drag and drop, no jQuery.
 */
(function () {
	'use strict';

	var SITE_ID = 'site-root';
	var ROOT_TYPES = ['header', 'nav', 'section', 'footer'];
	var UNIQUE_ROOT_TYPES = ['header', 'footer'];
	var GAP_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
	var WIDTH_OPTIONS = ['inherit', 'container', 'container-fluid', 'full'];
	var SECTION_WIDTH_OPTIONS = ['container', 'container-fluid', 'full'];
	var CSS_UNIT_OPTIONS = ['px', 'rem', 'em', '%', 'vw', 'vh'];
	var GAP_UNIT_OPTIONS = ['px', 'rem', 'em', '%', 'custom'];
	var BORDER_STYLE_OPTIONS = ['none', 'solid', 'dashed', 'dotted', 'double'];
	var BORDER_UNIT_OPTIONS = ['px', 'rem', 'em', '%'];
	var BACKGROUND_TYPE_OPTIONS = [
		{ value: 'none', label: 'Nenhum' },
		{ value: 'color', label: 'Cor' },
		{ value: 'gradient', label: 'Gradiente' },
		{ value: 'image', label: 'Imagem' }
	];
	var BACKGROUND_POSITION_TOKENS = ['left', 'center', 'right', 'top', 'bottom'];
	var BACKGROUND_SIZE_OPTIONS = ['cover', 'contain', 'auto', '100% auto', 'auto 100%'];
	var BACKGROUND_REPEAT_OPTIONS = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'];
	var BACKGROUND_ATTACHMENT_OPTIONS = ['scroll', 'fixed', 'local'];
	var HEIGHT_MODE_OPTIONS = [
		{ value: 'auto', label: 'Auto' },
		{ value: 'min-height', label: 'Min-height' },
		{ value: 'fixed', label: 'Altura fixa' },
		{ value: 'viewport', label: 'Full viewport' }
	];
	var HEIGHT_UNIT_OPTIONS = ['px', 'rem', 'em', 'vh', '%', 'custom'];
	var ALIGN_HORIZONTAL_OPTIONS = [
		{ value: 'default', label: 'Padrão' },
		{ value: 'left', label: 'Esquerda' },
		{ value: 'center', label: 'Centro' },
		{ value: 'right', label: 'Direita' },
		{ value: 'space-between', label: 'Space-between' },
		{ value: 'space-around', label: 'Space-around' },
		{ value: 'space-evenly', label: 'Space-evenly' }
	];
	var ALIGN_VERTICAL_OPTIONS = [
		{ value: 'default', label: 'Padrão' },
		{ value: 'top', label: 'Topo' },
		{ value: 'center', label: 'Centro' },
		{ value: 'bottom', label: 'Baixo' },
		{ value: 'stretch', label: 'Stretch' }
	];
	var OVERFLOW_VALUES = ['default', 'visible', 'hidden', 'auto', 'scroll', 'clip'];
	var OVERFLOW_OPTIONS = [
		{ value: 'default', label: 'Padrão' },
		{ value: 'visible', label: 'Visible' },
		{ value: 'hidden', label: 'Hidden' },
		{ value: 'auto', label: 'Auto' },
		{ value: 'scroll', label: 'Scroll' },
		{ value: 'clip', label: 'Clip' }
	];
	var POSITION_OPTIONS = ['default', 'relative', 'sticky', 'fixed', 'absolute'];
	var POSITION_UNIT_OPTIONS = ['px', 'rem', 'em', '%', 'vh', 'vw', 'custom'];
	var HEADER_MODES = ['static', 'sticky', 'fixed'];
	var HEADER_BEHAVIORS = ['always', 'hide-down-show-up'];
	var GRID_VALUES = ['hidden', 'auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
	var BREAKPOINTS = [
		{ key: 'phone', label: 'Phone' },
		{ key: 'largePhone', label: 'Large phone' },
		{ key: 'tablet', label: 'Tablet' },
		{ key: 'smallDesktop', label: 'Small desktop' },
		{ key: 'largeDesktop', label: 'Large desktop' },
		{ key: 'extraLargeDesktop', label: 'Extra large' }
	];
	var TYPE_LABELS = {
		site: 'SITE',
		header: 'Header',
		nav: 'Nav',
		section: 'Section',
		footer: 'Footer',
		row: 'Linha',
		column: 'Coluna'
	};
	var TYPE_ICONS = {
		site: 'site',
		header: 'header',
		nav: 'nav',
		section: 'section',
		row: 'row',
		column: 'column',
		footer: 'footer'
	};
	var ACTION_ICONS = {
		select: 'settings',
		'add-row': 'add-row',
		'add-column': 'add-column',
		duplicate: 'duplicate',
		'move-up': 'up',
		'move-down': 'down',
		'request-remove': 'trash',
		export: 'export',
		import: 'import',
		reset: 'reset'
	};
	var VALIDATION_LABELS = {
		info: 'Info',
		success: 'Sucesso',
		warning: 'Aviso',
		error: 'Erro',
		confirm: 'Confirmar'
	};
	var PALETTE_MESSAGES = {
		header: 'Header já existe no layout.',
		nav: 'A navegação principal já foi definida.',
		footer: 'Footer já existe no layout.'
	};

	function onReady(fn) {
		if (document.readyState !== 'loading') {
			fn();
			return;
		}

		document.addEventListener('DOMContentLoaded', fn, { once: true });
	}

	function clone(value) {
		return JSON.parse(JSON.stringify(value));
	}

	function parseJson(value, fallback) {
		if (!value) {
			return clone(fallback);
		}

		try {
			return JSON.parse(value);
		} catch (error) {
			return clone(fallback);
		}
	}

	function escapeHtml(value) {
		return String(value == null ? '' : value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function uid(prefix) {
		return prefix + '-' + Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36);
	}

	function icon(name) {
		var paths = {
			site: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
			header: '<path d="M3 5h18v14H3z"/><path d="M3 9h18"/>',
			nav: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
			section: '<path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 13h5"/>',
			row: '<path d="M4 7h16v10H4z"/><path d="M9 7v10"/><path d="M15 7v10"/>',
			column: '<path d="M5 4h5v16H5z"/><path d="M14 4h5v16h-5z"/>',
			footer: '<path d="M3 5h18v14H3z"/><path d="M3 15h18"/>',
			tools: '<path d="M4 7h16"/><path d="M7 7v10"/><path d="M17 7v10"/><path d="M4 17h16"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
			settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .92V20a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1-.92 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.92-1H3.6a2 2 0 0 1 0-4h.08a1.7 1.7 0 0 0 .92-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.92V3.6a2 2 0 0 1 4 0v.08a1.7 1.7 0 0 0 1 .92 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.36.56.67.92.92h.08a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-.92 1z"/>',
			'add-row': '<path d="M4 6h16v4H4z"/><path d="M4 14h7v4H4z"/><path d="M16 13v6"/><path d="M13 16h6"/>',
			'add-column': '<path d="M5 4h5v16H5z"/><path d="M14 4h5v8h-5z"/><path d="M16.5 15v6"/><path d="M13.5 18h6"/>',
			duplicate: '<path d="M8 8h11v11H8z"/><path d="M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"/>',
			trash: '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/>',
			up: '<path d="m6 15 6-6 6 6"/>',
			down: '<path d="m6 9 6 6 6-6"/>',
			copy: '<path d="M8 8h11v11H8z"/><path d="M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"/>',
			download: '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
			export: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
			import: '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/>',
			reset: '<path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4v6h-6"/>',
			media: '<path d="M4 5h16v14H4z"/><path d="m4 15 4-4 4 4 3-3 5 5"/><circle cx="15" cy="9" r="1.5"/>'
		};
		var path = paths[name] || '<circle cx="12" cy="12" r="7"/>';

		return '<svg class="hc-lm-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + '</svg>';
	}

	function defaultSettings() {
		return {
			layout: {},
			visual: {
				backgroundType: 'none',
				backgroundColor: '',
				backgroundGradient: '',
				backgroundImage: '',
				backgroundPosition: 'center center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundAttachment: 'scroll',
				backgroundOpacity: '1',
				overlayEnabled: false,
				overlayColor: 'rgba(0,0,0,.35)',
				overlayOpacity: '0.35',
				textColor: '',
				linkColor: '',
				hoverColor: '',
				shadow: ''
			},
			border: {
				enabled: false,
				widthTop: '',
				widthRight: '',
				widthBottom: '',
				widthLeft: '',
				widthUnit: 'px',
				style: 'solid',
				color: '',
				radiusTopLeft: '',
				radiusTopRight: '',
				radiusBottomRight: '',
				radiusBottomLeft: '',
				radiusUnit: 'px',
				legacyBottom: ''
			},
			spacing: {
				paddingTop: '',
				paddingRight: '',
				paddingBottom: '',
				paddingLeft: '',
				paddingUnit: 'rem',
				marginTop: '',
				marginRight: '',
				marginBottom: '',
				marginLeft: '',
				marginUnit: 'rem'
			},
			height: {
				mode: 'auto',
				value: '',
				unit: 'px'
			},
			alignment: {
				horizontal: 'default',
				vertical: 'default'
			},
			position: {
				type: 'default',
				top: '',
				right: '',
				bottom: '',
				left: '',
				unit: 'px'
			},
			overflow: {
				value: 'default',
				x: 'default',
				y: 'default'
			},
			responsive: defaultResponsiveSettings(),
			advanced: {
				customClass: '',
				customId: '',
				zIndex: '',
				order: ''
			}
		};
	}

	function defaultResponsiveSettings() {
		return {
			hideTablet: false,
			hideMobile: false,
			hideDesktop: false
		};
	}

	function isPlainObject(value) {
		return value && typeof value === 'object' && !Array.isArray(value);
	}

	function asBoolean(value) {
		return value === true || value === 1 || String(value).toLowerCase() === 'true' || String(value) === '1';
	}

	function isCssGradient(value) {
		return /gradient\(/i.test(String(value || ''));
	}

	function responsiveFlagsFromVisibility(value) {
		var flags = defaultResponsiveSettings();

		switch (String(value || 'all')) {
			case 'desktop':
				flags.hideTablet = true;
				flags.hideMobile = true;
				break;
			case 'tablet':
				flags.hideDesktop = true;
				flags.hideMobile = true;
				break;
			case 'mobile':
				flags.hideDesktop = true;
				flags.hideTablet = true;
				break;
			case 'hidden':
				Object.keys(flags).forEach(function (key) {
					flags[key] = true;
				});
				break;
		}

		return flags;
	}

	function normalizeSettings(settings) {
		var raw = isPlainObject(settings) ? settings : {};
		var base = defaultSettings();
		var normalized = Object.assign({}, raw);
		var hasVisual = isPlainObject(raw.visual);
		var hasBorder = isPlainObject(raw.border);
		var hasSpacing = isPlainObject(raw.spacing);
		var hasResponsive = isPlainObject(raw.responsive);
		var hasAdvanced = isPlainObject(raw.advanced);
		var hasVisualType = hasVisual && raw.visual.backgroundType != null && raw.visual.backgroundType !== '';
		var legacyBackgroundColor = String(raw.backgroundColor || '').trim();
		var legacyBackgroundImage = String(raw.backgroundImage || '').trim();
		var legacyGradient = isCssGradient(legacyBackgroundColor) ? legacyBackgroundColor : (isCssGradient(legacyBackgroundImage) ? legacyBackgroundImage : '');
		var visual = Object.assign({}, base.visual, hasVisual ? raw.visual : {});
		var border = Object.assign({}, base.border, hasBorder ? raw.border : {});
		var spacing = Object.assign({}, base.spacing, hasSpacing ? raw.spacing : {});
		var height = Object.assign({}, base.height, isPlainObject(raw.height) ? raw.height : {});
		var alignment = Object.assign({}, base.alignment, isPlainObject(raw.alignment) ? raw.alignment : {});
		var position = Object.assign({}, base.position, isPlainObject(raw.position) ? raw.position : {});
		var overflow = Object.assign({}, base.overflow, isPlainObject(raw.overflow) ? raw.overflow : {});
		var responsive = Object.assign({}, base.responsive, hasResponsive ? raw.responsive : {});
		var advanced = Object.assign({}, base.advanced, hasAdvanced ? raw.advanced : {});

		if (!hasVisual) {
			visual.backgroundColor = visual.backgroundColor || (isCssGradient(legacyBackgroundColor) ? '' : legacyBackgroundColor);
			visual.backgroundGradient = visual.backgroundGradient || legacyGradient;
			visual.backgroundImage = visual.backgroundImage || (isCssGradient(legacyBackgroundImage) ? '' : legacyBackgroundImage);
			visual.backgroundPosition = visual.backgroundPosition || raw.backgroundPosition || base.visual.backgroundPosition;
			visual.backgroundSize = visual.backgroundSize || raw.backgroundSize || base.visual.backgroundSize;
			visual.backgroundRepeat = visual.backgroundRepeat || raw.backgroundRepeat || base.visual.backgroundRepeat;
			visual.backgroundOpacity = String(visual.backgroundOpacity || raw.backgroundOpacity || base.visual.backgroundOpacity);
			visual.textColor = visual.textColor || raw.textColor || '';
			visual.linkColor = visual.linkColor || raw.linkColor || '';
			visual.hoverColor = visual.hoverColor || raw.hoverColor || '';
			visual.shadow = visual.shadow || raw.shadow || '';
		}

		visual.overlayEnabled = asBoolean(visual.overlayEnabled);
		visual.backgroundType = ['none', 'color', 'gradient', 'image'].indexOf(visual.backgroundType) !== -1 ? visual.backgroundType : 'none';

		if (!hasVisualType && visual.backgroundType === 'none') {
			if (visual.backgroundImage) {
				visual.backgroundType = 'image';
			} else if (visual.backgroundGradient) {
				visual.backgroundType = 'gradient';
			} else if (visual.backgroundColor) {
				visual.backgroundType = 'color';
			}
		}

		if (!hasBorder && raw.borderBottom && !border.legacyBottom) {
			border.legacyBottom = raw.borderBottom;
		}

		border.enabled = asBoolean(border.enabled) || String(border.legacyBottom || '').trim() !== '';
		border.style = BORDER_STYLE_OPTIONS.indexOf(border.style) !== -1 ? border.style : 'solid';
		border.widthUnit = BORDER_UNIT_OPTIONS.indexOf(border.widthUnit) !== -1 ? border.widthUnit : 'px';
		border.radiusUnit = BORDER_UNIT_OPTIONS.indexOf(border.radiusUnit) !== -1 ? border.radiusUnit : 'px';

		if (!hasSpacing) {
			['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingUnit', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginUnit'].forEach(function (key) {
				if ((spacing[key] === '' || spacing[key] == null) && raw[key] != null) {
					spacing[key] = raw[key];
				}
			});
		}

		height.mode = ['auto', 'min-height', 'fixed', 'viewport'].indexOf(height.mode) !== -1 ? height.mode : 'auto';
		height.unit = HEIGHT_UNIT_OPTIONS.indexOf(height.unit) !== -1 ? height.unit : 'px';
		alignment.horizontal = ['default', 'left', 'center', 'right', 'space-between', 'space-around', 'space-evenly'].indexOf(alignment.horizontal) !== -1 ? alignment.horizontal : 'default';
		alignment.vertical = ['default', 'top', 'center', 'bottom', 'stretch'].indexOf(alignment.vertical) !== -1 ? alignment.vertical : 'default';
		overflow.value = OVERFLOW_VALUES.indexOf(overflow.value) !== -1 ? overflow.value : 'default';
		overflow.x = OVERFLOW_VALUES.indexOf(overflow.x) !== -1 ? overflow.x : 'default';
		overflow.y = OVERFLOW_VALUES.indexOf(overflow.y) !== -1 ? overflow.y : 'default';
		position.type = POSITION_OPTIONS.indexOf(position.type) !== -1 ? position.type : 'default';
		position.unit = POSITION_UNIT_OPTIONS.indexOf(position.unit) !== -1 ? position.unit : 'px';

		if (!hasResponsive) {
			responsive = Object.assign(responsive, responsiveFlagsFromVisibility(raw.visibility));
		} else {
			if (responsive.hideMobile == null) {
				responsive.hideMobile = asBoolean(responsive.hidePhone) && asBoolean(responsive.hideLargePhone);
			}

			if (responsive.hideDesktop == null) {
				responsive.hideDesktop = asBoolean(responsive.hideSmallDesktop) && asBoolean(responsive.hideLargeDesktop) && asBoolean(responsive.hideExtraLargeDesktop);
			}
		}

		Object.keys(responsive).forEach(function (key) {
			responsive[key] = asBoolean(responsive[key]);
		});

		if (!hasAdvanced) {
			advanced.customClass = advanced.customClass || raw.customClass || '';
			advanced.customId = advanced.customId || raw.customId || '';
			advanced.order = advanced.order || raw.order || '';
			advanced.zIndex = advanced.zIndex || raw.zIndex || '';
		}

		normalized.visual = visual;
		normalized.border = border;
		normalized.spacing = spacing;
		normalized.height = height;
		normalized.alignment = alignment;
		normalized.position = position;
		normalized.overflow = overflow;
		normalized.responsive = responsive;
		normalized.advanced = advanced;

		return normalized;
	}

	function defaultSiteSettings() {
		return {
			id: SITE_ID,
			type: 'site',
			title: 'SITE',
			visual: defaultSiteVisualSettings(),
			containerWidthValue: '1320',
			containerWidthUnit: 'px',
			containerWidthCustom: '',
			responsive: defaultResponsiveSettings(),
			behavior: {
				backToTop: false,
				smoothScroll: true,
				reduceMotion: false
			},
			accessibility: {
				visibleFocus: true,
				reduceMotion: false,
				enhancedContrast: false
			},
			backToTop: false
		};
	}

	function defaultSiteVisualSettings() {
		return {
			backgroundType: 'none',
			backgroundColor: '#ffffff',
			backgroundGradient: '',
			backgroundImage: '',
			backgroundPosition: 'center center',
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
			backgroundAttachment: 'scroll',
			backgroundOpacity: '1',
			overlayEnabled: false,
			overlayColor: 'rgba(0,0,0,.35)',
			overlayOpacity: '0.35',
			textColor: '#333333'
		};
	}

	function defaultHeaderSettings() {
		return {
			behavior: 'always',
			heightDesktop: 'auto',
			heightTablet: 'auto',
			heightMobile: 'auto',
			sticky: true,
			shrinkOnScroll: false,
			shadowOnScroll: true,
			backgroundScroll: true,
			transitionSpeed: '220ms',
			transparentInitial: false,
			blurBackground: false,
			overlayContent: false,
			autoBodyOffset: true
		};
	}

	function defaultGrid() {
		return {
			phone: '12',
			largePhone: '12',
			tablet: '12',
			smallDesktop: '12',
			largeDesktop: '12',
			extraLargeDesktop: '12'
		};
	}

	function createColumn(title, position, options) {
		options = options || {};

		return normalizeColumn({
			id: uid('col'),
			type: 'column',
			title: title || 'Column',
			position: position || '',
			componentArea: !!options.componentArea,
			mainNavigation: !!options.mainNavigation,
			grid: options.grid || defaultGrid(),
			settings: defaultSettings()
		});
	}

	function createRow(title) {
		return normalizeRow({
			id: uid('row'),
			type: 'row',
			title: title || 'Row',
			width: 'inherit',
			gap: 'md',
			gapEnabled: true,
			gapValue: '15',
			gapUnit: 'px',
			gapCustom: '',
			alignVertical: 'stretch',
			alignHorizontal: 'start',
			settings: defaultSettings(),
			columns: [createColumn('Column', '')]
		});
	}

	function createRoot(type) {
		var title = TYPE_LABELS[type] || 'Section';
		var item = {
			id: uid(type),
			type: type,
			title: title,
			enabled: true,
			width: type === 'row' ? 'inherit' : 'container',
			settings: defaultSettings(),
			rows: [createRow(title + ' row')]
		};

		if (type === 'header') {
			item.mode = 'sticky';
			item.header = defaultHeaderSettings();
		}

		if (type === 'nav') {
			item.rows = [normalizeRow({
				id: uid('row'),
				type: 'row',
				title: 'Navigation row',
				width: 'inherit',
				gap: 'md',
				gapEnabled: true,
				gapValue: '15',
				gapUnit: 'px',
				gapCustom: '',
				alignVertical: 'center',
				alignHorizontal: 'start',
				settings: defaultSettings(),
				columns: [createColumn('Navigation', '', { grid: fullGrid() })]
			})];
		}

		return normalizeRoot(item);
	}

	function fullGrid() {
		return {
			phone: '12',
			largePhone: '12',
			tablet: '12',
			smallDesktop: '12',
			largeDesktop: '12',
			extraLargeDesktop: '12'
		};
	}

	function normalizeLayout(raw, fallback) {
		var layout = raw;

		if (typeof layout === 'string') {
			layout = parseJson(layout, fallback);
		}

		if (layout && typeof layout.layout === 'string') {
			layout = parseJson(layout.layout, fallback);
		}

		if (Array.isArray(layout)) {
			layout = { version: 2, items: layout };
		}

		if (!layout || typeof layout !== 'object') {
			layout = clone(fallback);
		}

		if (!Array.isArray(layout.items) && Array.isArray(layout.sections)) {
			layout.items = layout.sections;
		}

		if (!Array.isArray(layout.items)) {
			layout.items = clone(fallback.items || []);
		}

		layout.version = 2;
		layout.site = normalizeSite(layout.site, fallback.site);
		layout.items = layout.items
			.filter(function (item) { return item && ROOT_TYPES.indexOf(item.type) !== -1; })
			.map(normalizeRoot);

		if (!layout.items.length && fallback.items) {
			layout.items = clone(fallback.items).map(normalizeRoot);
		}

		return layout;
	}

	function normalizeSite(site, fallbackSite) {
		var fallback = Object.assign(defaultSiteSettings(), fallbackSite || {});
		var value = Object.assign({}, fallback, site || {});

		value.id = SITE_ID;
		value.type = 'site';
		value.title = value.title || 'SITE';
		value.visual = normalizeSiteVisual(value.visual, value);
		value.containerWidthValue = String(value.containerWidthValue || value.container_value || fallback.containerWidthValue || '1320');
		value.containerWidthUnit = ['px', 'rem', '%', 'vw', 'full', 'custom'].indexOf(value.containerWidthUnit || value.container_unit) !== -1 ? (value.containerWidthUnit || value.container_unit) : fallback.containerWidthUnit;
		value.containerWidthCustom = value.containerWidthCustom || value.container_custom || fallback.containerWidthCustom || '';
		value.responsive = normalizeSiteResponsive(value.responsive, value);
		value.behavior = normalizeSiteBehavior(value.behavior, value);
		value.accessibility = normalizeSiteAccessibility(value.accessibility, value);
		value.backToTop = value.behavior.backToTop;

		return value;
	}

	function normalizeSiteVisual(visual, owner) {
		var hasVisual = isPlainObject(visual);
		var value = Object.assign({}, defaultSiteVisualSettings(), hasVisual ? visual : {});
		var legacyBackground = String(owner.bodyBg || owner.body_background || owner.backgroundColor || '').trim();
		var legacyImage = String(owner.backgroundImage || owner.background_image || '').trim();
		var legacyGradient = String(owner.backgroundGradient || owner.background_gradient || '').trim();
		var hasType = hasVisual && visual.backgroundType != null && visual.backgroundType !== '';

		if (!hasVisual) {
			value.backgroundColor = isCssGradient(legacyBackground) ? '' : (legacyBackground || value.backgroundColor);
			value.backgroundGradient = legacyGradient || (isCssGradient(legacyBackground) ? legacyBackground : '');
			value.backgroundImage = legacyImage || value.backgroundImage;
			value.textColor = owner.textColor || owner.text_color || value.textColor;
		}

		value.backgroundType = ['none', 'color', 'gradient', 'image'].indexOf(value.backgroundType) !== -1 ? value.backgroundType : 'none';

		if (!hasType && value.backgroundType === 'none') {
			if (value.backgroundImage) {
				value.backgroundType = 'image';
			} else if (value.backgroundGradient) {
				value.backgroundType = 'gradient';
			} else if (value.backgroundColor) {
				value.backgroundType = 'color';
			}
		}

		value.backgroundOpacity = String(value.backgroundOpacity || '1');
		value.overlayEnabled = asBoolean(value.overlayEnabled);

		return value;
	}

	function normalizeSiteBehavior(behavior, owner) {
		var hasBehavior = isPlainObject(behavior);
		var value = Object.assign({ backToTop: false, smoothScroll: true, reduceMotion: false }, hasBehavior ? behavior : {});

		if (!hasBehavior) {
			value.backToTop = owner.backToTop === true || owner.back_to_top === true || String(owner.backToTop || owner.back_to_top || '') === '1';
			value.smoothScroll = owner.smoothScroll == null && owner.smooth_scroll == null ? true : asBoolean(owner.smoothScroll || owner.smooth_scroll);
			value.reduceMotion = asBoolean(owner.reduceMotion || owner.reduce_motion);
		}

		value.backToTop = asBoolean(value.backToTop);
		value.smoothScroll = value.smoothScroll === false ? false : asBoolean(value.smoothScroll);
		value.reduceMotion = asBoolean(value.reduceMotion);

		return value;
	}

	function normalizeSiteResponsive(responsive, owner) {
		var hasResponsive = isPlainObject(responsive);
		var value = Object.assign({}, defaultResponsiveSettings(), hasResponsive ? responsive : {});

		if (!hasResponsive && owner.visibility) {
			value = Object.assign(value, responsiveFlagsFromVisibility(owner.visibility));
		}

		Object.keys(value).forEach(function (key) {
			value[key] = asBoolean(value[key]);
		});

		return value;
	}

	function normalizeSiteAccessibility(accessibility, owner) {
		var hasAccessibility = isPlainObject(accessibility);
		var value = Object.assign({ visibleFocus: true, reduceMotion: false, enhancedContrast: false }, hasAccessibility ? accessibility : {});

		if (!hasAccessibility) {
			value.visibleFocus = owner.visibleFocus == null && owner.visible_focus == null && owner.focusVisible == null ? true : asBoolean(owner.visibleFocus || owner.visible_focus || owner.focusVisible);
			value.reduceMotion = asBoolean(owner.accessibilityReduceMotion || owner.reduceMotion || owner.reduce_motion);
			value.enhancedContrast = asBoolean(owner.enhancedContrast || owner.enhanced_contrast);
		}

		value.visibleFocus = value.visibleFocus === false ? false : asBoolean(value.visibleFocus);
		value.reduceMotion = asBoolean(value.reduceMotion);
		value.enhancedContrast = asBoolean(value.enhancedContrast);

		return value;
	}

	function normalizeRoot(item) {
		item.id = item.id || uid(item.type || 'section');
		item.type = ROOT_TYPES.indexOf(item.type) !== -1 ? item.type : 'section';
		item.title = item.title || TYPE_LABELS[item.type] || 'Section';
		item.enabled = item.enabled !== false;
		item.width = SECTION_WIDTH_OPTIONS.indexOf(item.width) !== -1 ? item.width : 'container';
		item.settings = normalizeSettings(item.settings);
		item.rows = Array.isArray(item.rows) ? item.rows.map(normalizeRow) : [];

		if (!item.rows.length) {
			item.rows = [createRow(item.title + ' row')];
		}

		if (item.type === 'header') {
			item.mode = HEADER_MODES.indexOf(item.mode) !== -1 ? item.mode : 'sticky';
			item.header = Object.assign(defaultHeaderSettings(), item.header || {});
		}

		return item;
	}

	function normalizeRow(row) {
		row.id = row.id || uid('row');
		row.type = 'row';
		row.title = row.title || 'Row';
		row.width = WIDTH_OPTIONS.indexOf(row.width) !== -1 ? row.width : 'inherit';
		row.gap = GAP_OPTIONS.indexOf(row.gap) !== -1 ? row.gap : 'md';
		row.gapEnabled = typeof row.gapEnabled === 'boolean' ? row.gapEnabled : row.gap !== 'none';
		row.gapValue = String(row.gapValue || legacyGapValue(row.gap));
		row.gapUnit = GAP_UNIT_OPTIONS.indexOf(row.gapUnit) !== -1 ? row.gapUnit : 'px';
		row.gapCustom = String(row.gapCustom || '');
		row.alignVertical = row.alignVertical || 'stretch';
		row.alignHorizontal = row.alignHorizontal || 'start';
		row.settings = normalizeSettings(row.settings);
		row.settings.alignment.horizontal = row.settings.alignment.horizontal === 'default' ? legacyHorizontalAlignment(row.alignHorizontal) : row.settings.alignment.horizontal;
		row.settings.alignment.vertical = row.settings.alignment.vertical === 'default' ? legacyVerticalAlignment(row.alignVertical) : row.settings.alignment.vertical;
		row.columns = Array.isArray(row.columns) ? row.columns.map(normalizeColumn) : [];

		if (!row.columns.length) {
			row.columns = [createColumn('Column', '')];
		}

		return row;
	}

	function legacyGapValue(gap) {
		var map = {
			none: '0',
			xs: '8',
			sm: '12',
			md: '15',
			lg: '24',
			xl: '32'
		};

		return map[gap] || '15';
	}

	function normalizeColumn(column) {
		column.id = column.id || uid('col');
		column.type = 'column';
		column.title = column.title || 'Column';
		column.position = column.position || '';
		column.componentArea = !!column.componentArea;
		column.mainNavigation = !!column.mainNavigation;
		var manualFlag = !!(column.grid && column.grid.manual);
		column.grid = Object.assign(defaultGrid(), column.grid || {});
		column.settings = normalizeSettings(column.settings);

		BREAKPOINTS.forEach(function (bp) {
			column.grid[bp.key] = GRID_VALUES.indexOf(String(column.grid[bp.key])) !== -1 ? String(column.grid[bp.key]) : '12';
		});

		column.grid.manual = manualFlag;

		return column;
	}

	function legacyHorizontalAlignment(value) {
		return {
			start: 'left',
			center: 'center',
			end: 'right',
			between: 'space-between'
		}[value] || 'default';
	}

	function legacyVerticalAlignment(value) {
		return {
			start: 'top',
			center: 'center',
			end: 'bottom',
			stretch: 'stretch'
		}[value] || 'default';
	}

	function sameValue(left, right) {
		return JSON.stringify(left) === JSON.stringify(right);
	}

	function compactAgainstDefaults(value, defaults) {
		var output = {};

		Object.keys(value || {}).forEach(function (key) {
			var current = value[key];
			var defaultValue = defaults ? defaults[key] : undefined;
			var compacted = isPlainObject(current)
				? compactAgainstDefaults(current, isPlainObject(defaultValue) ? defaultValue : {})
				: current;

			if (isPlainObject(compacted) && !Object.keys(compacted).length) {
				return;
			}

			if (Array.isArray(compacted) && !compacted.length) {
				return;
			}

			if (defaultValue !== undefined && sameValue(compacted, defaultValue)) {
				return;
			}

			if (defaultValue === undefined && (compacted == null || compacted === '' || compacted === false)) {
				return;
			}

			output[key] = compacted;
		});

		return output;
	}

	function compactSettings(settings) {
		var normalized = normalizeSettings(settings || {});
		var defaults = defaultSettings();
		var compact = compactAgainstDefaults({
			layout: normalized.layout || {},
			visual: normalized.visual || {},
			border: normalized.border || {},
			spacing: normalized.spacing || {},
			height: normalized.height || {},
			alignment: normalized.alignment || {},
			position: normalized.position || {},
			overflow: normalized.overflow || {},
			responsive: normalized.responsive || {},
			advanced: normalized.advanced || {}
		}, defaults);

		if (normalized.visual && normalized.visual.overlayEnabled && compact.visual) {
			compact.visual.overlayColor = normalized.visual.overlayColor || defaults.visual.overlayColor;
			compact.visual.overlayOpacity = normalized.visual.overlayOpacity || defaults.visual.overlayOpacity;
		}

		return compact;
	}

	function compactSite(site) {
		var normalized = normalizeSite(site || {}, defaultSiteSettings());
		var defaults = defaultSiteSettings();
		var compact = {
			id: SITE_ID,
			type: 'site',
			title: 'SITE'
		};
		var visual = compactAgainstDefaults(normalized.visual || {}, defaults.visual);
		var responsive = compactAgainstDefaults(normalized.responsive || {}, defaults.responsive);
		var behavior = compactAgainstDefaults(normalized.behavior || {}, defaults.behavior);
		var accessibility = compactAgainstDefaults(normalized.accessibility || {}, defaults.accessibility);

		if (normalized.visual && normalized.visual.overlayEnabled) {
			visual.overlayColor = normalized.visual.overlayColor || defaults.visual.overlayColor;
			visual.overlayOpacity = normalized.visual.overlayOpacity || defaults.visual.overlayOpacity;
		}

		if (Object.keys(visual).length) {
			compact.visual = visual;
		}

		if (normalized.containerWidthValue !== defaults.containerWidthValue) {
			compact.containerWidthValue = normalized.containerWidthValue;
		}

		if (normalized.containerWidthUnit !== defaults.containerWidthUnit) {
			compact.containerWidthUnit = normalized.containerWidthUnit;
		}

		if (normalized.containerWidthCustom !== defaults.containerWidthCustom) {
			compact.containerWidthCustom = normalized.containerWidthCustom;
		}

		if (Object.keys(behavior).length) {
			compact.behavior = behavior;
		}

		if (Object.keys(accessibility).length) {
			compact.accessibility = accessibility;
		}

		if (Object.keys(responsive).length) {
			compact.responsive = responsive;
		}

		return compact;
	}

	function compactColumn(column) {
		var normalized = normalizeColumn(clone(column || {}));
		var compact = {
			id: normalized.id,
			type: 'column'
		};
		var settings = compactSettings(normalized.settings);
		var grid = compactAgainstDefaults(normalized.grid || {}, defaultGrid());

		if (normalized.position) {
			compact.position = normalized.position;
		}

		if (normalized.componentArea) {
			compact.componentArea = true;
		}

		if (normalized.mainNavigation) {
			compact.mainNavigation = true;
		}

		if (Object.keys(grid).length) {
			compact.grid = grid;
		}

		if (Object.keys(settings).length) {
			compact.settings = settings;
		}

		return compact;
	}

	function compactRow(row) {
		var normalized = normalizeRow(clone(row || {}));
		var compact = {
			id: normalized.id,
			type: 'row',
			columns: normalized.columns.map(compactColumn)
		};
		var settings = compactSettings(normalized.settings);

		if (normalized.width !== 'inherit') {
			compact.width = normalized.width;
		}

		if (normalized.gap !== 'md') {
			compact.gap = normalized.gap;
		}

		if (normalized.gapEnabled !== true) {
			compact.gapEnabled = normalized.gapEnabled;
		}

		if (normalized.gapValue !== '15') {
			compact.gapValue = normalized.gapValue;
		}

		if (normalized.gapUnit !== 'px') {
			compact.gapUnit = normalized.gapUnit;
		}

		if (normalized.gapCustom) {
			compact.gapCustom = normalized.gapCustom;
		}

		if (normalized.alignVertical !== 'stretch') {
			compact.alignVertical = normalized.alignVertical;
		}

		if (normalized.alignHorizontal !== 'start') {
			compact.alignHorizontal = normalized.alignHorizontal;
		}

		if (Object.keys(settings).length) {
			compact.settings = settings;
		}

		return compact;
	}

	function compactRoot(item) {
		var normalized = normalizeRoot(clone(item || {}));
		var compact = {
			id: normalized.id,
			type: normalized.type,
			title: normalized.title,
			rows: normalized.rows.map(compactRow)
		};
		var settings = compactSettings(normalized.settings);
		var header = normalized.type === 'header'
			? compactAgainstDefaults(normalized.header || {}, defaultHeaderSettings())
			: {};

		if (normalized.enabled === false) {
			compact.enabled = false;
		}

		if (normalized.width !== 'container') {
			compact.width = normalized.width;
		}

		if (normalized.type === 'header' && normalized.mode !== 'sticky') {
			compact.mode = normalized.mode;
		}

		if (normalized.type === 'header' && Object.keys(header).length) {
			compact.header = header;
		}

		if (Object.keys(settings).length) {
			compact.settings = settings;
		}

		return compact;
	}

	function compactLayout(layout) {
		var normalized = normalizeLayout(clone(layout || {}), { version: 2, site: defaultSiteSettings(), items: [] });

		return {
			version: 2,
			site: compactSite(normalized.site),
			items: normalized.items.map(compactRoot)
		};
	}

	function walkItems(layout, callback) {
		layout.items.forEach(function visitRoot(item, index) {
			callback(item, null, layout.items, index);

			(item.rows || []).forEach(function (row, rowIndex) {
				callback(row, item, item.rows, rowIndex);

				(row.columns || []).forEach(function (column, columnIndex) {
					callback(column, row, row.columns, columnIndex);
				});
			});
		});
	}

	function findItem(layout, id) {
		var found = null;

		if (id === SITE_ID || (layout.site && id === layout.site.id)) {
			return { item: layout.site, parent: null, collection: null, index: -1 };
		}

		walkItems(layout, function (item, parent, collection, index) {
			if (item.id === id) {
				found = { item: item, parent: parent, collection: collection, index: index };
			}
		});

		return found;
	}

	function findRootForFound(layout, found) {
		var root = null;

		if (!found || !found.item) {
			return null;
		}

		if (ROOT_TYPES.indexOf(found.item.type) !== -1) {
			return found.item;
		}

		layout.items.some(function (candidate) {
			if (found.item.id === candidate.id) {
				root = candidate;
				return true;
			}

			return (candidate.rows || []).some(function (row) {
				if (found.item.id === row.id) {
					root = candidate;
					return true;
				}

				return (row.columns || []).some(function (column) {
					if (found.item.id === column.id) {
						root = candidate;
						return true;
					}

					return false;
				});
			});
		});

		return root;
	}

	function findRowForFound(found) {
		if (!found || !found.item) {
			return null;
		}

		if (found.item.type === 'row') {
			return found.item;
		}

		if (found.item.type === 'column' && found.parent && found.parent.type === 'row') {
			return found.parent;
		}

		return null;
	}

	function findRowIndex(root, row) {
		return root && row ? (root.rows || []).indexOf(row) : -1;
	}

	function displayTitle(item) {
		if (!item) {
			return '';
		}

		if (item.type === 'row') {
			return 'Linha';
		}

		if (item.type === 'column') {
			return 'Coluna';
		}

		return item.title || TYPE_LABELS[item.type] || 'Section';
	}

	function getPath(object, path) {
		return path.split('.').reduce(function (current, key) {
			return current && current[key] != null ? current[key] : '';
		}, object);
	}

	function setPath(object, path, value) {
		var parts = path.split('.');
		var current = object;

		parts.slice(0, -1).forEach(function (key) {
			if (!current[key] || typeof current[key] !== 'object') {
				current[key] = {};
			}

			current = current[key];
		});

		current[parts[parts.length - 1]] = value;
	}

	function countBy(layout, predicate) {
		var total = 0;

		walkItems(layout, function (item) {
			if (predicate(item)) {
				total += 1;
			}
		});

		return total;
	}

	function firstBy(layout, predicate) {
		var found = null;

		walkItems(layout, function (item) {
			if (!found && predicate(item)) {
				found = item;
			}
		});

		return found;
	}

	function flagExistsExcept(layout, activeId, flag) {
		return !!firstBy(layout, function (item) {
			return item.type === 'column' && item.id !== activeId && item[flag];
		});
	}

	function rowSum(row, breakpoint) {
		return (row.columns || []).reduce(function (sum, column) {
			var value = String((column.grid || {})[breakpoint] || '12');
			var number = parseInt(value, 10);

			if (value === 'hidden' || value === 'auto' || Number.isNaN(number)) {
				return sum;
			}

			return sum + number;
		}, 0);
	}

	function distributedGrid(count) {
		var values = [];
		var remaining = 12;
		var slots = Math.max(1, count);
		var index;

		for (index = 0; index < slots; index += 1) {
			var value = Math.floor(remaining / (slots - index));
			values.push(String(Math.max(1, value)));
			remaining -= value;
		}

		return values;
	}

	/**
	 * Distribuição automática responsiva:
	 *   - phone / largePhone: sempre 12 (mobile-stack)
	 *   - tablet: 12 até 2 colunas; depois mesma distribuição do desktop
	 *   - smallDesktop / largeDesktop / extraLargeDesktop: 12 / 6+6 / 4+4+4 / 3+3+3+3
	 * Colunas com column.grid.manual === true não são tocadas (preserva
	 * configurações que o usuário editou no painel).
	 */
	function autoGridForIndex(count, index) {
		var sizes;

		if (count === 1) {
			sizes = ['12'];
		} else if (count === 2) {
			sizes = ['6', '6'];
		} else if (count === 3) {
			sizes = ['4', '4', '4'];
		} else if (count === 4) {
			sizes = ['3', '3', '3', '3'];
		} else {
			sizes = distributedGrid(count);
		}

		var desktopSize = sizes[index] || '12';
		var tabletSize = count <= 2 ? '12' : desktopSize;

		return {
			phone: '12',
			largePhone: '12',
			tablet: tabletSize,
			smallDesktop: desktopSize,
			largeDesktop: desktopSize,
			extraLargeDesktop: desktopSize
		};
	}

	function rebalanceRowColumns(row) {
		var columns = row && Array.isArray(row.columns) ? row.columns : [];
		var count = columns.length;

		columns.forEach(function (column, index) {
			var manualFlag = !!(column.grid && column.grid.manual);
			column.grid = Object.assign(defaultGrid(), column.grid || {});
			column.grid.manual = manualFlag;

			if (manualFlag) {
				return;
			}

			var auto = autoGridForIndex(count, index);
			BREAKPOINTS.forEach(function (bp) {
				column.grid[bp.key] = auto[bp.key];
			});
		});
	}

	function validation(level, message, itemId, key) {
		return {
			level: level,
			message: message,
			itemId: itemId || '',
			key: key || [level, itemId || 'layout', message].join('|')
		};
	}

	function uniqueValidations(items) {
		var seen = {};

		return items.filter(function (item) {
			if (seen[item.key]) {
				return false;
			}

			seen[item.key] = true;
			return true;
		});
	}

	function validateLayout(layout) {
		var issues = [];
		var headerItems = layout.items.filter(function (item) { return item.type === 'header'; });
		var navItems = layout.items.filter(function (item) { return item.type === 'nav'; });
		var footerItems = layout.items.filter(function (item) { return item.type === 'footer'; });
		var mainNavigationColumns = [];
		var componentColumns = [];

		walkItems(layout, function (item) {
			if (item.type === 'column' && item.mainNavigation) {
				mainNavigationColumns.push(item);
			}

			if (item.type === 'column' && item.componentArea) {
				componentColumns.push(item);
			}
		});

		if (headerItems.length > 1) {
			issues.push(validation('error', 'Header só pode existir uma vez.', headerItems[1].id, 'header-unique'));
		}

		if (footerItems.length > 1) {
			issues.push(validation('error', 'Footer só pode existir uma vez.', footerItems[1].id, 'footer-unique'));
		}

		if (navItems.length > 1) {
			issues.push(validation('error', 'Nav só pode existir uma vez.', navItems[1].id, 'nav-unique'));
		}

		if (navItems.length && mainNavigationColumns.length) {
			issues.push(validation('error', 'Use Nav como seção ou coluna Main Navigation, nunca os dois ao mesmo tempo.', mainNavigationColumns[0].id, 'main-navigation-conflict'));
		}

		if (mainNavigationColumns.length > 1) {
			issues.push(validation('error', 'Main Navigation só pode existir uma vez.', mainNavigationColumns[1].id, 'main-navigation-unique'));
		}

		if (componentColumns.length > 1) {
			issues.push(validation('error', 'Área do componente só pode existir uma vez.', componentColumns[1].id, 'component-area-unique'));
		}

		if (componentColumns.length < 1) {
			issues.push(validation('error', 'O layout precisa ter uma Área do componente.', layout.items[0] ? layout.items[0].id : '', 'component-area-required'));
		}

		layout.items.forEach(function (item) {
			if (ROOT_TYPES.indexOf(item.type) !== -1 && (!item.rows || item.rows.length < 1)) {
				issues.push(validation('error', (TYPE_LABELS[item.type] || item.type) + ' precisa ter pelo menos uma Linha.', item.id, item.id + '-row-required'));
			}

			(item.rows || []).forEach(function (row) {
				if (!row.columns || !row.columns.length) {
					issues.push(validation('error', 'A Linha precisa ter pelo menos uma Coluna.', row.id, row.id + '-empty'));
				}

				BREAKPOINTS.forEach(function (bp) {
					if (bp.key === 'phone' || bp.key === 'largePhone' || bp.key === 'tablet') {
						return;
					}

					if (rowSum(row, bp.key) > 12) {
						issues.push(validation('warning', 'A Linha passa de 12 colunas em ' + bp.label + '.', row.id, row.id + '-sum-' + bp.key));
					}
				});
			});
		});

		return uniqueValidations(issues);
	}

	function dropZoneFromEvent(event, node) {
		if (!event || !node || typeof node.getBoundingClientRect !== 'function') {
			return 'inside';
		}

		var rect = node.getBoundingClientRect();
		var y = event.clientY - rect.top;

		if (y < rect.height * 0.25) {
			return 'before';
		}

		if (y > rect.height * 0.75) {
			return 'after';
		}

		return 'inside';
	}

	function clearDropFeedback(canvasElement) {
		canvasElement.querySelectorAll('.is-drag-over, .is-drop-before, .is-drop-after, .is-drop-inside, .is-drop-invalid').forEach(function (node) {
			node.classList.remove('is-drag-over', 'is-drop-before', 'is-drop-after', 'is-drop-inside', 'is-drop-invalid');
			node.removeAttribute('data-drop-label');
		});
	}

	function addDropFeedback(node, plan) {
		if (!node || !plan) {
			return;
		}

		node.classList.add(plan.valid ? ('is-drop-' + plan.placement) : 'is-drop-invalid');
		node.setAttribute('data-drop-label', plan.label || (plan.valid ? 'Soltar aqui' : 'Não permitido'));
	}

	function defaultRootInsertIndex(layout, type) {
		var footerIndex;
		var headerIndex;

		if (type === 'header') {
			return 0;
		}

		if (type === 'nav') {
			headerIndex = layout.items.findIndex(function (item) {
				return item.type === 'header';
			});

			return headerIndex >= 0 ? headerIndex + 1 : 0;
		}

		if (type === 'footer') {
			return layout.items.length;
		}

		footerIndex = layout.items.findIndex(function (item) {
			return item.type === 'footer';
		});

		return footerIndex >= 0 ? footerIndex : layout.items.length;
	}

	function rootInsertIndex(layout, root, placement) {
		var index = root ? layout.items.indexOf(root) : -1;

		if (index < 0) {
			return defaultRootInsertIndex(layout, 'section');
		}

		if (root.type === 'footer') {
			return index;
		}

		return placement === 'before' ? index : index + 1;
	}

	function canCreateRoot(layout, type) {
		if (UNIQUE_ROOT_TYPES.indexOf(type) !== -1 && layout.items.some(function (item) { return item.type === type; })) {
			return PALETTE_MESSAGES[type] || (TYPE_LABELS[type] + ' já existe no layout.');
		}

		if (type === 'nav' && countBy(layout, function (item) { return item.type === 'column' && item.mainNavigation; })) {
			return 'A navegação principal já foi definida em uma coluna.';
		}

		return '';
	}

	function canAddRowToRoot(root) {
		if (!root || ROOT_TYPES.indexOf(root.type) === -1) {
			return 'Linha precisa ser adicionada dentro de Section, Header, Nav ou Footer.';
		}

		return '';
	}

	function canAddColumnToRow(row) {
		if (!row || row.type !== 'row') {
			return 'Coluna só pode ser adicionada dentro de uma Linha.';
		}

		if ((row.columns || []).length >= 12) {
			return 'Esta Linha já atingiu o limite de 12 colunas.';
		}

		return '';
	}

	function insertionPlan(layout, type, targetId, event, node) {
		var target = targetId ? findItem(layout, targetId) : null;
		var zone = dropZoneFromEvent(event, node);
		var root = target ? findRootForFound(layout, target) : null;
		var row = target ? findRowForFound(target) : null;
		var message;
		var fallbackRoot;
		var fallbackRow;

		if (target && target.item && target.item.type === 'site') {
			target = null;
			root = null;
			row = null;
		}

		if (ROOT_TYPES.indexOf(type) !== -1) {
			message = canCreateRoot(layout, type);

			if (message) {
				return { valid: false, message: message, placement: 'invalid', label: message };
			}

			if (type === 'section') {
				return {
					valid: true,
					kind: 'root',
					type: type,
					index: root ? rootInsertIndex(layout, root, zone === 'before' ? 'before' : 'after') : defaultRootInsertIndex(layout, type),
					placement: zone === 'before' ? 'before' : 'after',
					label: zone === 'before' ? 'Antes da section' : 'Depois da section'
				};
			}

			return {
				valid: true,
				kind: 'root',
				type: type,
				index: defaultRootInsertIndex(layout, type),
				placement: 'after',
				label: 'Posição estrutural'
			};
		}

		if (type === 'row') {
			if (!target) {
				fallbackRoot = layout.items.slice().reverse().find(function (item) {
					return item.type === 'section' && !canAddRowToRoot(item);
				});

				if (fallbackRoot) {
					return { valid: true, kind: 'row-inside-root', root: fallbackRoot, placement: 'after', label: 'Final do layout' };
				}
			}

			if (target && ROOT_TYPES.indexOf(target.item.type) !== -1) {
				message = canAddRowToRoot(target.item);

				return message
					? { valid: false, message: message, placement: 'invalid', label: message }
					: { valid: true, kind: 'row-inside-root', root: target.item, placement: 'inside', label: 'Dentro da section' };
			}

			if (row && root) {
				message = canAddRowToRoot(root);

				return message
					? { valid: false, message: message, placement: 'invalid', label: message }
					: { valid: true, kind: 'row-after-row', root: root, row: row, placement: 'after', label: 'Depois da linha' };
			}

			return { valid: false, message: 'Linha precisa ser adicionada dentro de Section, Header, Nav ou Footer.', placement: 'invalid', label: 'Não permitido' };
		}

		if (type === 'column') {
			if (!target) {
				layout.items.slice().reverse().some(function (candidate) {
					return (candidate.rows || []).slice().reverse().some(function (candidateRow) {
						if (!canAddColumnToRow(candidateRow)) {
							fallbackRow = candidateRow;
							return true;
						}

						return false;
					});
				});

				if (fallbackRow) {
					return { valid: true, kind: 'column-inside-row', row: fallbackRow, placement: 'after', label: 'Final do layout' };
				}
			}

			if (target && target.item.type === 'column' && row) {
				message = canAddColumnToRow(row);

				return message
					? { valid: false, message: message, placement: 'invalid', label: message }
					: { valid: true, kind: 'column-after-column', row: row, column: target.item, placement: 'after', label: 'Depois da coluna' };
			}

			if (target && target.item.type === 'row') {
				message = canAddColumnToRow(target.item);

				return message
					? { valid: false, message: message, placement: 'invalid', label: message }
					: { valid: true, kind: 'column-inside-row', row: target.item, placement: 'inside', label: 'Dentro da linha' };
			}

			return { valid: false, message: 'Coluna só pode ser adicionada dentro de uma Linha.', placement: 'invalid', label: 'Não permitido' };
		}

		return { valid: false, message: 'Ação não permitida.', placement: 'invalid', label: 'Não permitido' };
	}

	function applyInsertionPlan(layout, plan) {
		var item;
		var row;
		var column;
		var index;

		if (!plan || !plan.valid) {
			return null;
		}

		if (plan.kind === 'root') {
			item = createRoot(plan.type);
			layout.items.splice(Math.max(0, Math.min(plan.index, layout.items.length)), 0, item);
			return item;
		}

		if (plan.kind === 'row-inside-root') {
			row = createRow('Row');
			plan.root.rows.push(row);
			return row;
		}

		if (plan.kind === 'row-after-row') {
			row = createRow('Row');
			index = findRowIndex(plan.root, plan.row);
			plan.root.rows.splice(index + 1, 0, row);
			return row;
		}

		if (plan.kind === 'column-inside-row') {
			column = createColumn('Column', '');
			plan.row.columns.push(column);
			rebalanceRowColumns(plan.row);
			return column;
		}

		if (plan.kind === 'column-after-column') {
			column = createColumn('Column', '');
			index = plan.row.columns.indexOf(plan.column);
			plan.row.columns.splice(index + 1, 0, column);
			rebalanceRowColumns(plan.row);
			return column;
		}

		return null;
	}

	function unwrapJoomlaLayoutWrappers(root) {
		var field = root.closest('.hc-layout-manager-field');
		var fieldset;
		var parent;
		var host;
		var fallbackAssets;

		if (!field || field.dataset.hcLayoutUnwrapped === '1') {
			return;
		}

		fieldset = field.closest('fieldset#fieldset-layout');

		if (!fieldset || !fieldset.parentNode) {
			field.dataset.hcLayoutUnwrapped = '1';
			return;
		}

		parent = fieldset.parentNode;
		host = document.createElement('div');
		host.className = 'hc-layout-manager-host';
		host.setAttribute('data-hc-layout-manager-host', '');
		fallbackAssets = fieldset.querySelectorAll('[data-hc-layout-manager-fallback]');

		parent.insertBefore(host, fieldset);

		fallbackAssets.forEach(function (asset) {
			host.appendChild(asset);
		});

		host.appendChild(field);
		fieldset.remove();
		field.dataset.hcLayoutUnwrapped = '1';
	}

	function initManager(root) {
		unwrapJoomlaLayoutWrappers(root);

		if (root.dataset.hcLmReady === '1') {
			return;
		}

		root.dataset.hcLmReady = '1';

		var input = root.parentElement.querySelector('[data-hc-layout-input]');
		var palette = root.querySelector('[data-hc-lm-palette]');
		var canvas = root.querySelector('[data-hc-lm-canvas]');
		var settings = root.querySelector('[data-hc-lm-settings]');
		var alerts = root.querySelector('[data-hc-lm-alerts]');
		var toasts = root.querySelector('[data-hc-lm-toasts]');
		var toolsModal = root.querySelector('[data-hc-lm-tools-modal]');
		var toolsDialog = root.querySelector('[data-hc-lm-tools-dialog]');
		var jsonArea = root.querySelector('[data-hc-lm-json]');
		var jsonFile = root.querySelector('[data-hc-lm-json-file]');
		var resetConfirm = root.querySelector('[data-hc-lm-reset-confirm]');
		var positions = parseJson(root.getAttribute('data-positions'), []);
		var defaultLayout = normalizeLayout(parseJson(root.getAttribute('data-default-layout'), { items: [] }), { items: [] });
		var state = {
			layout: normalizeLayout(parseJson(input.value, defaultLayout), defaultLayout),
			selectedId: null,
			draggingId: null,
			draggingPaletteType: '',
			validationOpen: true,
			validationHidden: false,
			validationErrorSignature: '',
			dismissedValidations: {},
			toasts: []
		};

		state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;

		function sync() {
			input.value = JSON.stringify(compactLayout(state.layout));
		}

		function rowGapValue(row) {
			var unit = GAP_UNIT_OPTIONS.indexOf(String(row.gapUnit || 'px')) !== -1 ? String(row.gapUnit || 'px') : 'px';
			var value = String(row.gapValue || '').trim();

			if (!row.gapEnabled) {
				return '0px';
			}

			if (unit === 'custom') {
				return String(row.gapCustom || value || '15px').trim() || '15px';
			}

			value = /^\d+(\.\d+)?$/.test(value) ? value : '15';

			return value + unit;
		}

		function captureSettingsState() {
			var selectedId = settings.getAttribute('data-selected-id') || '';
			var openSections = [];

			settings.querySelectorAll('.hc-lm-form-section').forEach(function (section, index) {
				if (section.open) {
					openSections.push(index);
				}
			});

			return {
				selectedId: selectedId,
				scrollTop: settings.scrollTop || 0,
				openSections: openSections
			};
		}

		function restoreSettingsState(snapshot) {
			if (!snapshot || snapshot.selectedId !== (state.selectedId || '')) {
				return false;
			}

			settings.querySelectorAll('.hc-lm-form-section').forEach(function (section, index) {
				section.open = snapshot.openSections.indexOf(index) !== -1;
			});

			settings.scrollTop = snapshot.scrollTop || 0;

			return true;
		}

		var interactionScrollState = null;

		function rememberSettingsInteractionScroll(event) {
			if (!event.target.closest('[data-path], .hc-lm-toggle')) {
				return;
			}

			if (interactionScrollState && (event.type === 'input' || event.type === 'change' || event.type === 'click')) {
				return;
			}

			interactionScrollState = {
				settingsTop: settings.scrollTop || 0,
				pageX: window.pageXOffset || document.documentElement.scrollLeft || 0,
				pageY: window.pageYOffset || document.documentElement.scrollTop || 0
			};
		}

		function restoreSettingsInteractionScroll() {
			var snapshot = interactionScrollState;

			if (!snapshot) {
				return;
			}

			settings.scrollTop = snapshot.settingsTop;
			window.scrollTo(snapshot.pageX, snapshot.pageY);

			window.requestAnimationFrame(function () {
				settings.scrollTop = snapshot.settingsTop;
				window.scrollTo(snapshot.pageX, snapshot.pageY);
			});

			window.setTimeout(function () {
				settings.scrollTop = snapshot.settingsTop;
				window.scrollTo(snapshot.pageX, snapshot.pageY);

				if (interactionScrollState === snapshot) {
					interactionScrollState = null;
				}
			}, 30);
		}

		function render(options) {
			options = options || {};
			var settingsState = options.preserveSettings ? captureSettingsState() : null;
			var pageScroll = options.preserveSettings ? {
				x: window.pageXOffset || document.documentElement.scrollLeft || 0,
				y: window.pageYOffset || document.documentElement.scrollTop || 0
			} : null;

			state.layout = normalizeLayout(state.layout, defaultLayout);
			renderAlerts();
			renderPalette();
			renderCanvas();
			renderSettings(settingsState);
			sync();

			if (pageScroll) {
				window.requestAnimationFrame(function () {
					window.scrollTo(pageScroll.x, pageScroll.y);
				});
			}
		}

		function pushToast(type, message, actions, options) {
			options = options || {};
			var toast = {
				id: uid('toast'),
				type: type || 'info',
				message: message,
				actions: actions || [],
				autoClose: options.autoClose
			};

			state.toasts.push(toast);
			renderToasts();
		}

		function renderToasts() {
			if (!toasts) {
				return;
			}

			toasts.innerHTML = state.toasts.map(function (toast) {
				var actions = '';
				var toastActions = toast.actions && toast.actions.length
					? toast.actions
					: ((toast.type === 'warning' || toast.type === 'error') ? [{ action: 'close-toast', label: 'OK' }] : []);

				if (toastActions.length) {
					actions = '<div class="hc-lm-toast__actions">' + toastActions.map(function (action) {
						return '<button type="button" class="' + (action.danger ? 'is-danger' : '') + '" data-action="' + escapeHtml(action.action) + '" data-id="' + escapeHtml(action.id || toast.id) + '">' + escapeHtml(action.label) + '</button>';
					}).join('') + '</div>';
				}

				return '<div class="hc-lm-toast hc-lm-toast--' + escapeHtml(toast.type) + '">' +
					'<strong>' + escapeHtml(VALIDATION_LABELS[toast.type] || 'Info') + '</strong>' +
					'<span>' + escapeHtml(toast.message) + '</span>' +
					actions +
					'<button type="button" class="hc-lm-toast__close" data-action="close-toast" data-id="' + escapeHtml(toast.id) + '" aria-label="Fechar aviso">&times;</button>' +
					'</div>';
			}).join('');
		}

		function currentLayoutJson() {
			return JSON.stringify(compactLayout(state.layout), null, 2);
		}

		function openToolsModal(focusImport) {
			if (!toolsModal) {
				return;
			}

			if (jsonArea) {
				jsonArea.value = '';
			}

			if (jsonFile) {
				jsonFile.value = '';
			}

			if (resetConfirm) {
				resetConfirm.hidden = true;
			}

			toolsModal.hidden = false;
			root.classList.add('is-tools-open');

			window.requestAnimationFrame(function () {
				if (focusImport && jsonArea) {
					jsonArea.focus();
					return;
				}

				if (toolsDialog) {
					toolsDialog.focus();
				}
			});
		}

		function closeToolsModal() {
			if (!toolsModal) {
				return;
			}

			toolsModal.hidden = true;
			root.classList.remove('is-tools-open');

			if (resetConfirm) {
				resetConfirm.hidden = true;
			}
		}

		function copyText(text) {
			if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
				return navigator.clipboard.writeText(text);
			}

			var helper = document.createElement('textarea');
			helper.value = text;
			helper.setAttribute('readonly', 'readonly');
			helper.style.position = 'fixed';
			helper.style.top = '-9999px';
			document.body.appendChild(helper);
			helper.select();

			try {
				if (!document.execCommand('copy')) {
					throw new Error('copy failed');
				}

				return Promise.resolve();
			} catch (error) {
				return Promise.reject(error);
			} finally {
				document.body.removeChild(helper);
			}
		}

		function copyJson() {
			copyText(currentLayoutJson())
				.then(function () {
					pushToast('success', 'JSON copiado para a área de transferência.');
				})
				.catch(function () {
					pushToast('error', 'Não foi possível copiar automaticamente. Use baixar arquivo ou copie manualmente.');
				});
		}

		function downloadJson() {
			var blob = new Blob([currentLayoutJson() + '\n'], { type: 'application/json;charset=utf-8' });
			var url = URL.createObjectURL(blob);
			var link = document.createElement('a');
			var stamp = new Date().toISOString().replace(/[:.]/g, '-');

			link.href = url;
			link.download = 'hc-carlix-layout-' + stamp + '.json';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			pushToast('success', 'Arquivo JSON gerado para download.');
		}

		function importJsonText(text) {
			var parsed;

			text = String(text || '').trim();

			if (!text) {
				pushToast('warning', 'Cole um JSON válido antes de importar.');
				return false;
			}

			try {
				parsed = JSON.parse(text);
			} catch (error) {
				pushToast('error', 'JSON inválido. Verifique vírgulas, chaves e aspas antes de importar.');
				return false;
			}

			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || (!Array.isArray(parsed.items) && !parsed.site)) {
				pushToast('error', 'O JSON foi lido, mas não parece ser um layout do HC Carlix.');
				return false;
			}

			state.layout = normalizeLayout(parsed, defaultLayout);
			state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;
			state.dismissedValidations = {};
			pushToast('success', 'JSON importado.');
			closeToolsModal();
			render();

			return true;
		}

		function readJsonFile(file) {
			var reader;

			if (!file) {
				return;
			}

			if (!/\.json$/i.test(file.name) && file.type !== 'application/json') {
				pushToast('warning', 'Selecione um arquivo .json válido.');
				return;
			}

			reader = new FileReader();
			reader.onload = function () {
				if (jsonArea) {
					jsonArea.value = String(reader.result || '');
					jsonArea.focus();
				}

				pushToast('info', 'Arquivo carregado. Revise o JSON e clique em Aplicar JSON.');
			};
			reader.onerror = function () {
				pushToast('error', 'Não foi possível ler o arquivo selecionado.');
			};
			reader.readAsText(file, 'UTF-8');
		}

		function requestRemoveItem(id) {
			var found = findItem(state.layout, id);

			if (!found) {
				return;
			}

			pushToast('warning', 'Tem certeza que deseja deletar "' + found.item.title + '"?', [
				{ action: 'confirm-remove', id: id, label: 'Deletar', danger: true },
				{ action: 'close-toast', label: 'Cancelar' }
			]);
		}

		function renderAlerts() {
			var issues = validateLayout(state.layout);
			var visible = issues.filter(function (issue) {
				return !state.dismissedValidations[issue.key];
			});
			var errorCount = issues.filter(function (issue) { return issue.level === 'error'; }).length;
			var warningCount = issues.filter(function (issue) { return issue.level === 'warning'; }).length;
			var infoCount = issues.filter(function (issue) { return issue.level === 'info'; }).length;
			var errorSignature = issues.filter(function (issue) {
				return issue.level === 'error';
			}).map(function (issue) {
				return issue.key;
			}).sort().join('|');
			var status = errorCount ? 'error' : (warningCount ? 'warning' : 'ok');
			var title = status === 'ok' ? 'Layout validado' : 'Validação do layout';
			var summary = errorCount + ' erro(s), ' + warningCount + ' aviso(s), ' + infoCount + ' info';

			if (state.validationHidden && errorSignature && errorSignature !== state.validationErrorSignature) {
				state.validationHidden = false;
				state.validationOpen = true;
			}

			state.validationErrorSignature = errorSignature;

			if (state.validationHidden) {
				alerts.innerHTML = '<button type="button" class="hc-lm-validation-reopen hc-lm-validation-reopen--' + status + '" data-action="show-validations" aria-label="Mostrar validações do layout">' +
					'<span>Validações</span>' +
					'<small>' + escapeHtml(summary) + '</small>' +
					'<span class="hc-lm-validation__count">' + issues.length + '</span>' +
					'</button>';
				return;
			}

			var html = '<section class="hc-lm-validation hc-lm-validation--' + status + (state.validationOpen ? '' : ' is-collapsed') + '">' +
				'<div class="hc-lm-validation__top">' +
				'<button type="button" class="hc-lm-validation__summary" data-action="toggle-validations" aria-expanded="' + (state.validationOpen ? 'true' : 'false') + '">' +
				'<span><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(summary) + '</small></span>' +
				'<span class="hc-lm-validation__count">' + issues.length + '</span>' +
				'</button>' +
				'<button type="button" class="hc-lm-validation__dismiss" data-action="close-validations" aria-label="Fechar painel de validações">&times;</button>' +
				'</div>';

			if (state.validationOpen) {
				html += '<div class="hc-lm-validation__body">';

				if (!visible.length) {
					html += '<p class="hc-lm-validation__empty">Sem problemas ativos. O JSON pode ser salvo com segurança.</p>';
				} else {
					visible.forEach(function (issue) {
						html += '<article class="hc-lm-validation-item hc-lm-validation-item--' + escapeHtml(issue.level) + '">' +
							'<button type="button" class="hc-lm-validation-item__main" data-action="select-warning" data-id="' + escapeHtml(issue.itemId) + '">' +
							'<span>' + escapeHtml(VALIDATION_LABELS[issue.level] || issue.level) + '</span>' +
							'<strong>' + escapeHtml(issue.message) + '</strong>' +
							'</button>' +
							'<button type="button" class="hc-lm-validation-item__close" data-action="close-validation" data-key="' + escapeHtml(issue.key) + '" aria-label="Ocultar aviso">&times;</button>' +
							'</article>';
					});
				}

				html += '</div>';
			}

			html += '</section>';
			alerts.innerHTML = html;
		}

		function renderPalette() {
			var headerCount = state.layout.items.filter(function (item) { return item.type === 'header'; }).length;
			var navExists = state.layout.items.some(function (item) { return item.type === 'nav'; }) || countBy(state.layout, function (item) { return item.type === 'column' && item.mainNavigation; });
			var footerCount = state.layout.items.filter(function (item) { return item.type === 'footer'; }).length;
			var componentCount = countBy(state.layout, function (item) { return item.type === 'column' && item.componentArea; });
			var selected = state.selectedId ? findItem(state.layout, state.selectedId) : null;
			var buttons = [
				paletteButton('header', 'Elemento principal. Apenas um.', headerCount > 0),
				paletteButton('nav', 'Menu principal como section. Apenas um.', navExists),
				paletteButton('section', 'Área estrutural livre.'),
				paletteButton('row', 'Adicionar dentro do item selecionado.', !selected),
				paletteButton('column', 'Adicionar dentro da Linha selecionada.', !selected),
				paletteButton('footer', 'Rodapé estrutural. Apenas um.', footerCount > 0)
			].join('');

			palette.innerHTML =
				'<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Paleta</h3><p class="hc-lm-panel__hint">Arraste ou clique para montar a estrutura.</p></div></div>' +
				'<div class="hc-lm-palette-list">' + buttons + '</div>' +
				'<div class="hc-lm-status">' +
				statusItem('Header', headerCount, 1) +
				statusItem('Main Navigation', navExists ? 1 : 0, 1) +
				statusItem('Área do componente', componentCount, 1) +
				statusItem('Footer', footerCount, 1) +
				'</div>';
		}

		function paletteButton(type, help, disabled) {
			return '<button type="button" class="hc-lm-palette-item' + (disabled ? ' is-disabled' : '') + '" data-action="add-palette" data-type="' + type + '" aria-disabled="' + (disabled ? 'true' : 'false') + '" draggable="' + (disabled ? 'false' : 'true') + '">' +
				'<span class="hc-lm-palette-icon">' + icon(TYPE_ICONS[type]) + '</span>' +
				'<span><span class="hc-lm-palette-label">' + TYPE_LABELS[type] + '</span><span class="hc-lm-palette-help">' + escapeHtml(help || '') + '</span></span>' +
				'</button>';
		}

		function statusItem(label, count, max) {
			var cls = count > max ? 'hc-lm-badge--danger' : (count === max ? 'hc-lm-badge--ok' : 'hc-lm-badge--warn');
			return '<div class="hc-lm-status__item"><span>' + escapeHtml(label) + '</span><span class="hc-lm-badge ' + cls + '">' + count + '/' + max + '</span></div>';
		}

		function renderCanvas() {
			var html = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Construtor</h3><p class="hc-lm-panel__hint">Selecione, ordene e valide a estrutura do template.</p></div></div>';

			html += '<div class="hc-lm-canvas-list">' + renderSiteNode() + '</div>';

			canvas.innerHTML = html;
		}

		function renderSiteNode() {
			var site = state.layout.site;
			var selected = site.id === state.selectedId ? ' is-selected' : '';
			var html = '<div class="hc-lm-node hc-lm-node--site' + selected + '" data-node-id="' + escapeHtml(site.id) + '" data-node-type="site">' +
				'<div class="hc-lm-node__bar" data-action="select" data-id="' + escapeHtml(site.id) + '">' +
				'<div class="hc-lm-node__title"><span class="hc-lm-badge">' + icon('site') + '</span><span class="hc-lm-node__name">' + escapeHtml(site.title || 'SITE') + '</span></div>' +
				'<div class="hc-lm-actions">' + siteActions(site) + '</div>' +
				'</div>' +
				'<div class="hc-lm-node__meta">' + tag('Global') + tag('container: ' + siteContainerLabel(site)) + '</div>' +
				'<div class="hc-lm-node__body"><div class="hc-lm-site-tree">';

			if (!state.layout.items.length) {
				html += '<div class="hc-lm-empty">Arraste Header, Section ou Footer para dentro do SITE.</div>';
			} else {
				state.layout.items.forEach(function (item) {
					html += renderNode(item);
				});
			}

			html += '</div></div></div>';
			return html;
		}

		function siteActions(site) {
			return '<details class="hc-lm-action-menu">' +
				'<summary aria-label="Ações do SITE">' + icon('settings') + '</summary>' +
				'<div class="hc-lm-action-menu__list">' +
				actionButton('select', site.id, 'Configurar', 'Abrir configurações globais do site.') +
				'</div>' +
				'</details>';
		}

		function siteContainerLabel(site) {
			if (site.containerWidthUnit === 'full') {
				return 'full';
			}

			if (site.containerWidthUnit === 'custom') {
				return site.containerWidthCustom || 'custom';
			}

			return (site.containerWidthValue || '1320') + (site.containerWidthUnit || 'px');
		}

		function nodeValidationClass(id) {
			var level = '';

			validateLayout(state.layout).forEach(function (issue) {
				if (issue.itemId !== id) {
					return;
				}

				if (issue.level === 'error') {
					level = 'error';
				} else if (issue.level === 'warning' && level !== 'error') {
					level = 'warning';
				}
			});

			return level ? ' has-' + level : '';
		}

		function renderNode(item) {
			var selected = item.id === state.selectedId ? ' is-selected' : '';
			var disabled = item.enabled === false ? ' is-disabled' : '';
			var issueClass = nodeValidationClass(item.id);
			var meta = getMeta(item);
			var html = '<div class="hc-lm-node hc-lm-node--' + item.type + selected + disabled + issueClass + '" draggable="true" data-node-id="' + item.id + '" data-node-type="' + item.type + '"' + nodeStyle(item) + '>' +
				'<div class="hc-lm-node__bar" data-action="select" data-id="' + item.id + '">' +
				'<div class="hc-lm-node__title"><span class="hc-lm-badge">' + icon(TYPE_ICONS[item.type]) + '</span><span class="hc-lm-node__name">' + escapeHtml(displayTitle(item)) + '</span></div>' +
				'<div class="hc-lm-actions">' + nodeActions(item) + '</div>' +
				'</div>' +
				(meta ? '<div class="hc-lm-node__meta">' + meta + '</div>' : '');

			if (ROOT_TYPES.indexOf(item.type) !== -1) {
				html += '<div class="hc-lm-node__body"><div class="hc-lm-row-list">';
				(item.rows || []).forEach(function (row) {
					html += renderNode(row);
				});
				html += '</div></div>';
			}

			if (item.type === 'row') {
				html += '<div class="hc-lm-node__body"><div class="hc-lm-column-list">';
				(item.columns || []).forEach(function (column) {
					html += renderNode(column);
				});
				html += '</div></div>';
			}

			html += '</div>';
			return html;
		}

		function getMeta(item) {
			var meta = [];

			if (item.type === 'header') {
				meta.push(tag('mode: ' + item.mode));
			}

			if (ROOT_TYPES.indexOf(item.type) !== -1) {
				meta.push(tag(item.width || 'container'));
			}

			if (item.type === 'row') {
				meta.push(tag('gap: ' + rowGapValue(item)));
				meta.push(tag('grid: ' + rowSum(item, 'largeDesktop') + '/12'));
			}

			if (item.type === 'column') {
				if (item.position) {
					meta.push(tag('position: ' + item.position));
				}

				if (item.componentArea) {
					meta.push(tag('Component'));
				}

				if (item.mainNavigation) {
					meta.push(tag('Main Navigation'));
				}

				meta.push(tag('grid: ' + (item.grid.largeDesktop || item.grid.smallDesktop || item.grid.tablet || item.grid.phone || '12')));
			}

			return meta.join('');
		}

		function tag(text) {
			return '<span class="hc-lm-badge">' + escapeHtml(text) + '</span>';
		}

		function columnStyle(item) {
			if (item.type !== 'column') {
				return '';
			}

			var span = parseInt(item.grid.largeDesktop || item.grid.smallDesktop || item.grid.tablet || item.grid.phone || '12', 10);
			var hidden = String(item.grid.largeDesktop || '') === 'hidden';

			if (Number.isNaN(span) || span < 1 || span > 12) {
				span = 12;
			}

			return ' style="--hc-lm-col: ' + span + ';" data-hidden-col="' + (hidden ? 'true' : 'false') + '"';
		}

		function rowStyle(item) {
			if (item.type !== 'row') {
				return '';
			}

			return ' style="--carlix-row-gap: ' + escapeHtml(rowGapValue(item)) + ';"';
		}

		function nodeStyle(item) {
			return item.type === 'row' ? rowStyle(item) : columnStyle(item);
		}

		function nodeActions(item) {
			var actions = [
				actionButton('select', item.id, 'Configurar', 'Abrir configurações deste item.'),
				actionButton('move-up', item.id, 'Para cima', 'Mover este item acima.'),
				actionButton('move-down', item.id, 'Para baixo', 'Mover este item abaixo.')
			];

			if (ROOT_TYPES.indexOf(item.type) !== -1) {
				actions.push(actionButton('add-row', item.id, 'Linha', 'Adicionar uma linha dentro deste item.'));
			}

			if (item.type === 'row' || item.type === 'column') {
				actions.push(actionButton('add-column', item.id, 'Coluna', 'Adicionar coluna na linha.'));
			}

			if (item.type === 'section' || item.type === 'row') {
				actions.push(actionButton('duplicate', item.id, 'Duplicar', 'Criar uma cópia simples.'));
			}

			actions.push(actionButton('request-remove', item.id, 'Deletar', 'Pede confirmação antes de remover.', true));

			return '<details class="hc-lm-action-menu">' +
				'<summary aria-label="Ações do item">' + icon('settings') + '</summary>' +
				'<div class="hc-lm-action-menu__list">' + actions.join('') + '</div>' +
				'</details>';
		}

		function actionButton(action, id, label, help, danger) {
			return '<button type="button" class="hc-lm-action-item' + (danger ? ' is-danger' : '') + '" data-action="' + action + '" data-id="' + id + '">' +
				'<span class="hc-lm-action-item__icon">' + icon(ACTION_ICONS[action] || 'settings') + '</span>' +
				'<span class="hc-lm-action-item__copy"><strong>' + escapeHtml(label) + '</strong>' +
				(help ? '<small>' + escapeHtml(help) + '</small>' : '') + '</span>' +
				'</button>';
		}

		function renderSettings(settingsState) {
			var found = state.selectedId ? findItem(state.layout, state.selectedId) : null;

			if (!found) {
				settings.innerHTML = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Configurações</h3><p class="hc-lm-panel__hint">Selecione um item no construtor.</p></div></div>';
				settings.removeAttribute('data-selected-id');
				settings.scrollTop = 0;
				return;
			}

			var item = found.item;
			var settingsTitle = item.type === 'row'
				? 'Configurações da Linha'
				: (item.type === 'column' ? 'Configurações da Coluna' : 'Configurações');
			var settingsHint = item.type === 'row' || item.type === 'column'
				? escapeHtml(displayTitle(item))
				: escapeHtml(TYPE_LABELS[item.type] + ': ' + displayTitle(item));
			var html = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">' + settingsTitle + '</h3><p class="hc-lm-panel__hint">' + settingsHint + '</p></div></div>';
			html += '<div class="hc-lm-form">';

			if (item.type === 'site') {
				html += renderSiteSettings(item);
			} else if (ROOT_TYPES.indexOf(item.type) !== -1) {
				html += renderRootSettings(item);
			} else if (item.type === 'row') {
				html += renderRowSettings(item);
			} else {
				html += renderColumnSettings(item);
			}

			html += '</div>';
			settings.innerHTML = html;
			settings.setAttribute('data-selected-id', state.selectedId || '');

			if (!restoreSettingsState(settingsState)) {
				settings.scrollTop = 0;
			}
		}

		function renderSiteSettings(item) {
			return formSection('Visual global',
				siteVisualControls(item)
			) +
			formSection('Container',
				numberControl('Largura do container', 'containerWidthValue', item.containerWidthValue, 'Padrão: 1320. Informe apenas o número.') +
				selectControl('Unidade do container', 'containerWidthUnit', item.containerWidthUnit, ['px', 'rem', '%', 'vw', 'full', 'custom']) +
				textControl('Container custom', 'containerWidthCustom', item.containerWidthCustom, 'Use quando a unidade for custom. Ex.: min(1320px, 96vw).')
			) +
			formSection('Comportamento',
				checkControl('Botão voltar ao topo', 'behavior.backToTop', item.behavior.backToTop)
			) +
			formSection('Responsivo',
				siteResponsiveControls(item)
			);
		}

		function siteVisualControls(item) {
			var visual = item.visual || {};
			var type = visual.backgroundType || 'none';
			var html = selectControl('Tipo de fundo', 'visual.backgroundType', type, BACKGROUND_TYPE_OPTIONS);

			if (type === 'color') {
				html += colorControl('Cor de fundo do body', 'visual.backgroundColor', visual.backgroundColor, 'Aceita HEX, RGB(A), HSL(A), transparent e var().') +
					textControl('Opacidade', 'visual.backgroundOpacity', visual.backgroundOpacity, '0 a 1. Para controle fino, prefira rgba() ou hsla().');
			}

			if (type === 'gradient') {
				html += textareaControl('Gradiente de fundo', 'visual.backgroundGradient', visual.backgroundGradient, 'Ex.: linear-gradient(135deg, rgba(255,0,0,.8), rgba(0,0,255,.5)).') +
					cssPreview(visual.backgroundGradient) +
					textControl('Opacidade', 'visual.backgroundOpacity', visual.backgroundOpacity, '0 a 1, quando quiser opacidade no layer inteiro.');
			}

			if (type === 'image') {
				html += mediaControl('Imagem de fundo', 'visual.backgroundImage', visual.backgroundImage, 'Use uma imagem do Media Manager ou valor CSS como url() / image-set().') +
					backgroundPositionControl('Background position', 'visual.backgroundPosition', visual.backgroundPosition, 'Escolha até duas posições nos chips ou digite um valor CSS livre. Ex.: center top, 20% 40%, left 2rem top 1rem.') +
					selectControl('Background size', 'visual.backgroundSize', visual.backgroundSize, BACKGROUND_SIZE_OPTIONS) +
					selectControl('Background repeat', 'visual.backgroundRepeat', visual.backgroundRepeat, BACKGROUND_REPEAT_OPTIONS) +
					selectControl('Background attachment', 'visual.backgroundAttachment', visual.backgroundAttachment, BACKGROUND_ATTACHMENT_OPTIONS) +
					textControl('Opacidade', 'visual.backgroundOpacity', visual.backgroundOpacity, '0 a 1.') +
					checkControl('Overlay', 'visual.overlayEnabled', visual.overlayEnabled) +
					colorControl('Overlay color', 'visual.overlayColor', visual.overlayColor, 'Aceita HEX, RGBA e HSLA.') +
					textControl('Overlay opacity', 'visual.overlayOpacity', visual.overlayOpacity, '0 a 1.');
			}

			return html +
				colorControl('Cor global do texto', 'visual.textColor', visual.textColor, 'Aplicada como cor base do body.');
		}

		function siteResponsiveControls(item) {
			var responsive = item.responsive || {};

			return '<div class="hc-lm-toggle-stack">' +
				checkControl('Ocultar no Desktop', 'responsive.hideDesktop', responsive.hideDesktop) +
				checkControl('Ocultar no Tablet', 'responsive.hideTablet', responsive.hideTablet) +
				checkControl('Ocultar no Mobile', 'responsive.hideMobile', responsive.hideMobile) +
				'</div>';
		}

		function renderRootSettings(item) {
			var html = formSection('Básico',
				textControl('Título', 'title', item.title) +
				checkControl('Ativar', 'enabled', item.enabled)
			);

			html += formSection('Layout',
				selectControl('Largura', 'width', item.width, SECTION_WIDTH_OPTIONS) +
				(item.type === 'header' ? headerControls(item) : '')
			);

			html += commonSettings(item, { includeId: item.type === 'header' || item.type === 'footer', includeOrder: false });
			return html;
		}

		function renderRowSettings(item) {
			return formSection('Layout',
				selectControl('Largura', 'width', item.width, WIDTH_OPTIONS)
			) +
			formSection('Grid / Gap',
				checkControl('Ativar gap', 'gapEnabled', item.gapEnabled) +
				gapControls(item)
			) +
			commonSettings(item, { includeId: false, includeOrder: true });
		}

		function renderColumnSettings(item) {
			var positionOptions = [''].concat(positions.map(function (position) { return position.value; }));
			var grid = BREAKPOINTS.map(function (bp) {
				return selectControl(bp.label, 'grid.' + bp.key, item.grid[bp.key], GRID_VALUES);
			}).join('');

			return formSection('Grid', '<div class="hc-lm-grid-fields">' + grid + '</div>') +
			formSection('Conteúdo',
				checkControl('Área do componente', 'componentArea', item.componentArea) +
				checkControl('Main Navigation', 'mainNavigation', item.mainNavigation) +
				selectControl('Module Position', 'position', item.position, positionOptions)
			) +
			commonSettings(item, { includeId: false, includeOrder: true });
		}

		function headerControls(item) {
			return selectControl('Modo', 'mode', item.mode, HEADER_MODES) +
				selectControl('Comportamento', 'header.behavior', item.header.behavior, HEADER_BEHAVIORS) +
				textControl('Altura desktop', 'header.heightDesktop', item.header.heightDesktop, 'px, rem, vh, auto') +
				textControl('Altura tablet', 'header.heightTablet', item.header.heightTablet, 'px, rem, vh, auto') +
				textControl('Altura mobile', 'header.heightMobile', item.header.heightMobile, 'px, rem, vh, auto') +
				checkControl('Sticky ativo', 'header.sticky', item.header.sticky) +
				checkControl('Shrink ao scroll', 'header.shrinkOnScroll', item.header.shrinkOnScroll) +
				checkControl('Sombra ao scroll', 'header.shadowOnScroll', item.header.shadowOnScroll) +
				checkControl('Fundo ao scroll', 'header.backgroundScroll', item.header.backgroundScroll) +
				textControl('Velocidade transição', 'header.transitionSpeed', item.header.transitionSpeed, 'Ex.: 180ms, 0.25s') +
				checkControl('Transparente inicial', 'header.transparentInitial', item.header.transparentInitial) +
				checkControl('Blur background', 'header.blurBackground', item.header.blurBackground) +
				checkControl('Overlay content', 'header.overlayContent', item.header.overlayContent) +
				checkControl('Auto body offset', 'header.autoBodyOffset', item.header.autoBodyOffset);
		}

		function commonSettings(item, options) {
			options = options || {};

			return formSection('Visual', visualControls(item.settings)) +
				formSection('Borda', borderControls(item.settings), false) +
				formSection('Espaçamento',
					boxSpacingControls('Padding', 'padding', item.settings.spacing, 'settings.spacing') +
					boxSpacingControls('Margin', 'margin', item.settings.spacing, 'settings.spacing')
				, false) +
				formSection('Altura', heightControls(item.settings), false) +
				formSection('Alinhamento', alignmentControls(item.settings), false) +
				formSection('Position', positionControls(item.settings), false) +
				formSection('Overflow', overflowControls(item.settings), false) +
				formSection('Responsivo', responsiveControls(item.settings), false) +
				formSection('Avançado', advancedControls(item, options), false);
		}

		function visualControls(settings) {
			var visual = settings.visual || {};
			var type = visual.backgroundType || 'none';
			var html = selectControl('Background type', 'settings.visual.backgroundType', type, BACKGROUND_TYPE_OPTIONS);

			if (type === 'color') {
				html += colorControl('Background color', 'settings.visual.backgroundColor', visual.backgroundColor, 'HEX, RGB(A), HSL(A), transparent ou var().') +
					textControl('Opacity', 'settings.visual.backgroundOpacity', visual.backgroundOpacity, '0 a 1. Para controle fino, prefira rgba() ou hsla().');
			}

			if (type === 'gradient') {
				html += textareaControl('Gradiente CSS', 'settings.visual.backgroundGradient', visual.backgroundGradient, 'Ex.: linear-gradient(135deg, rgba(255,0,0,.8), rgba(0,0,255,.5)).') +
					cssPreview(visual.backgroundGradient) +
					textControl('Opacity', 'settings.visual.backgroundOpacity', visual.backgroundOpacity, '0 a 1, quando quiser opacidade no layer inteiro.');
			}

			if (type === 'image') {
				html += mediaControl('Imagem', 'settings.visual.backgroundImage', visual.backgroundImage, 'Use uma imagem do Media Manager ou um valor CSS como url() / image-set().') +
					backgroundPositionControl('Position', 'settings.visual.backgroundPosition', visual.backgroundPosition, 'Escolha até duas posições nos chips ou digite um valor CSS livre. Ex.: center top, 20% 40%, left 2rem top 1rem.') +
					selectControl('Size', 'settings.visual.backgroundSize', visual.backgroundSize, BACKGROUND_SIZE_OPTIONS) +
					selectControl('Repeat', 'settings.visual.backgroundRepeat', visual.backgroundRepeat, BACKGROUND_REPEAT_OPTIONS) +
					selectControl('Attachment', 'settings.visual.backgroundAttachment', visual.backgroundAttachment, BACKGROUND_ATTACHMENT_OPTIONS) +
					checkControl('Overlay', 'settings.visual.overlayEnabled', visual.overlayEnabled) +
					colorControl('Overlay color', 'settings.visual.overlayColor', visual.overlayColor, 'Aceita HEX, RGBA e HSLA.') +
					textControl('Overlay opacity', 'settings.visual.overlayOpacity', visual.overlayOpacity, '0 a 1.');
			}

			return html +
				colorControl('Cor do texto', 'settings.visual.textColor', visual.textColor, 'Use valores CSS de cor.') +
				colorControl('Cor dos links', 'settings.visual.linkColor', visual.linkColor, 'Vazio = herda a cor do template.') +
				colorControl('Cor hover', 'settings.visual.hoverColor', visual.hoverColor, 'Vazio = herda a cor dos links.') +
				textControl('Sombra', 'settings.visual.shadow', visual.shadow, 'Ex.: 0 8px 24px rgba(0,0,0,.12)');
		}

		function borderControls(settings) {
			var border = settings.border || {};

			return checkControl('Ativar borda', 'settings.border.enabled', border.enabled) +
				selectControl('Border style', 'settings.border.style', border.style, BORDER_STYLE_OPTIONS) +
				colorControl('Border color', 'settings.border.color', border.color, 'HEX, RGBA, HSLA ou var().') +
				'<div class="hc-lm-field hc-lm-box-field"><label>Border width</label><div class="hc-lm-box-grid">' +
				textMiniControl('Top', 'settings.border.widthTop', border.widthTop) +
				textMiniControl('Right', 'settings.border.widthRight', border.widthRight) +
				textMiniControl('Bottom', 'settings.border.widthBottom', border.widthBottom) +
				textMiniControl('Left', 'settings.border.widthLeft', border.widthLeft) +
				'</div>' +
				selectControl('Unidade da borda', 'settings.border.widthUnit', border.widthUnit || 'px', BORDER_UNIT_OPTIONS) +
				'</div>' +
				'<div class="hc-lm-field hc-lm-box-field"><label>Border radius</label><div class="hc-lm-box-grid">' +
				textMiniControl('Top left', 'settings.border.radiusTopLeft', border.radiusTopLeft) +
				textMiniControl('Top right', 'settings.border.radiusTopRight', border.radiusTopRight) +
				textMiniControl('Bottom right', 'settings.border.radiusBottomRight', border.radiusBottomRight) +
				textMiniControl('Bottom left', 'settings.border.radiusBottomLeft', border.radiusBottomLeft) +
				'</div>' +
				selectControl('Unidade do radius', 'settings.border.radiusUnit', border.radiusUnit || 'px', BORDER_UNIT_OPTIONS) +
				'</div>';
		}

		function heightControls(settings) {
			var height = settings.height || {};

			return selectControl('Height mode', 'settings.height.mode', height.mode, HEIGHT_MODE_OPTIONS) +
				textControl('Height value', 'settings.height.value', height.value, 'Número ou CSS. Ex.: 400, 80, min(100vh, 900px).') +
				selectControl('Height unit', 'settings.height.unit', height.unit, HEIGHT_UNIT_OPTIONS);
		}

		function alignmentControls(settings) {
			var alignment = settings.alignment || {};

			return selectControl('Horizontal', 'settings.alignment.horizontal', alignment.horizontal, ALIGN_HORIZONTAL_OPTIONS) +
				selectControl('Vertical', 'settings.alignment.vertical', alignment.vertical, ALIGN_VERTICAL_OPTIONS);
		}

		function overflowControls(settings) {
			var overflow = settings.overflow || {};

			return selectControl('Tipo', 'settings.overflow.value', overflow.value, OVERFLOW_OPTIONS) +
				selectControl('Overflow X', 'settings.overflow.x', overflow.x, OVERFLOW_OPTIONS) +
				selectControl('Overflow Y', 'settings.overflow.y', overflow.y, OVERFLOW_OPTIONS);
		}

		function positionControls(settings) {
			var position = settings.position || {};

			return selectControl('Position', 'settings.position.type', position.type, POSITION_OPTIONS) +
				'<div class="hc-lm-field hc-lm-box-field"><label>Offsets</label><div class="hc-lm-box-grid">' +
				valueMiniControl('Top', 'settings.position.top', position.top) +
				valueMiniControl('Right', 'settings.position.right', position.right) +
				valueMiniControl('Bottom', 'settings.position.bottom', position.bottom) +
				valueMiniControl('Left', 'settings.position.left', position.left) +
				'</div>' +
				selectControl('Unidade dos offsets', 'settings.position.unit', position.unit || 'px', POSITION_UNIT_OPTIONS) +
				'</div>';
		}

		function responsiveControls(settings) {
			var responsive = settings.responsive || {};

			return '<div class="hc-lm-toggle-stack">' +
				checkControl('Ocultar no Desktop', 'settings.responsive.hideDesktop', responsive.hideDesktop) +
				checkControl('Ocultar no Tablet', 'settings.responsive.hideTablet', responsive.hideTablet) +
				checkControl('Ocultar no Mobile', 'settings.responsive.hideMobile', responsive.hideMobile) +
				'</div>';
		}

		function advancedControls(item, options) {
			var advanced = item.settings.advanced || {};

			return textControl('Classe CSS', 'settings.advanced.customClass', advanced.customClass) +
				(options.includeId ? textControl('ID CSS', 'settings.advanced.customId', advanced.customId) : '') +
				textControl('Z-index', 'settings.advanced.zIndex', advanced.zIndex, 'Vazio = não aplicar.') +
				(options.includeOrder ? textControl('Ordem responsiva', 'settings.advanced.order', advanced.order, 'Número simples quando precisar.') : '');
		}

		function gapControls(item) {
			return '<div class="hc-lm-field hc-lm-inline-fields hc-lm-inline-fields--three">' +
				'<label><span>Gap value</span><input type="number" step="1" min="0" value="' + escapeHtml(item.gapValue || '15') + '" data-path="gapValue"></label>' +
				'<label><span>Gap unit</span><select data-path="gapUnit">' + optionsHtml(GAP_UNIT_OPTIONS, item.gapUnit || 'px') + '</select></label>' +
				'<label><span>Custom</span><input type="text" value="' + escapeHtml(item.gapCustom || '') + '" data-path="gapCustom" placeholder="clamp(1rem, 2vw, 2rem)"></label>' +
				'<small>Ativo sem valor usa 15px. Desativado aplica 0px via --carlix-row-gap.</small>' +
				'</div>';
		}

		function formSection(title, body, open) {
			return '<details class="hc-lm-form-section"' + (open === false ? '' : ' open') + '><summary><span>' + escapeHtml(title) + '</span></summary><div class="hc-lm-form-section__body">' + body + '</div></details>';
		}

		function boxSpacingControls(label, prefix, values, pathBase) {
			pathBase = pathBase || 'settings';

			return '<div class="hc-lm-field hc-lm-box-field">' +
				'<label>' + escapeHtml(label) + '</label>' +
				'<div class="hc-lm-box-grid">' +
				textMiniControl('Cima', pathBase + '.' + prefix + 'Top', values[prefix + 'Top']) +
				textMiniControl('Direita', pathBase + '.' + prefix + 'Right', values[prefix + 'Right']) +
				textMiniControl('Baixo', pathBase + '.' + prefix + 'Bottom', values[prefix + 'Bottom']) +
				textMiniControl('Esquerda', pathBase + '.' + prefix + 'Left', values[prefix + 'Left']) +
				'</div>' +
				selectControl('Unidade de ' + label.toLowerCase(), pathBase + '.' + prefix + 'Unit', values[prefix + 'Unit'] || 'rem', CSS_UNIT_OPTIONS) +
				'<small>Informe apenas números. Ex.: valor 2 com unidade rem vira 2rem. Campo vazio vira 0.</small>' +
				'</div>';
		}

		function textMiniControl(label, path, value) {
			return '<label class="hc-lm-mini-field"><span>' + escapeHtml(label) + '</span><input type="number" step="0.05" value="' + escapeHtml(value || '') + '" data-path="' + path + '"></label>';
		}

		function valueMiniControl(label, path, value) {
			return '<label class="hc-lm-mini-field"><span>' + escapeHtml(label) + '</span><input type="text" value="' + escapeHtml(value || '') + '" data-path="' + path + '"></label>';
		}

		function cssPreview(value) {
			return '<div class="hc-lm-css-preview" style="--hc-lm-preview:' + escapeHtml(value || 'transparent') + '" data-css-preview></div>';
		}

		function textControl(label, path, value, help) {
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><input type="text" value="' + escapeHtml(value) + '" data-path="' + path + '">' + (help ? '<small>' + escapeHtml(help) + '</small>' : '') + '</div>';
		}

		function textareaControl(label, path, value, help) {
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><textarea data-path="' + path + '" data-css-preview-source>' + escapeHtml(value || '') + '</textarea>' + (help ? '<small>' + escapeHtml(help) + '</small>' : '') + '</div>';
		}

		function numberControl(label, path, value, help) {
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><input type="number" step="1" min="0" value="' + escapeHtml(value) + '" data-path="' + path + '">' + (help ? '<small>' + escapeHtml(help) + '</small>' : '') + '</div>';
		}

		function mediaControl(label, path, value, help) {
			return '<div class="hc-lm-field hc-lm-media-field"><label>' + escapeHtml(label) + '</label>' +
				'<div class="hc-lm-media-field__control">' +
				'<input type="text" value="' + escapeHtml(value) + '" data-path="' + path + '" placeholder="images/exemplo.jpg">' +
				'<button type="button" class="hc-lm-btn hc-lm-btn--light" data-action="open-media" data-path="' + escapeHtml(path) + '">' + icon('media') + '<span>Media</span></button>' +
				'</div>' +
				(help ? '<small>' + escapeHtml(help) + '</small>' : '') +
				'</div>';
		}

		function backgroundPositionControl(label, path, value, help) {
			var parts = backgroundPositionParts(value);
			var chips = BACKGROUND_POSITION_TOKENS.map(function (token) {
				var active = parts.indexOf(token) !== -1 ? ' is-active' : '';

				return '<button type="button" class="hc-lm-position-chip' + active + '" data-position-token="' + escapeHtml(token) + '" aria-pressed="' + (active ? 'true' : 'false') + '">' + escapeHtml(token) + '</button>';
			}).join('');

			return '<div class="hc-lm-field hc-lm-position-field" data-position-control>' +
				'<label>' + escapeHtml(label) + '</label>' +
				'<input type="text" value="' + escapeHtml(value || '') + '" data-path="' + path + '" data-position-value placeholder="center top, 20% 40%, left 2rem top 1rem">' +
				'<div class="hc-lm-position-field__chips" aria-label="' + escapeHtml(label + ' quick values') + '">' + chips + '</div>' +
				(help ? '<small>' + escapeHtml(help) + '</small>' : '') +
				'</div>';
		}

		function backgroundPositionParts(value) {
			var seen = {};

			return String(value || '')
				.toLowerCase()
				.split(/\s+/)
				.filter(function (part) {
					if (BACKGROUND_POSITION_TOKENS.indexOf(part) === -1 || seen[part]) {
						return false;
					}

					seen[part] = true;
					return true;
				});
		}

		function updateBackgroundPositionChips(control) {
			var input = control.querySelector('[data-position-value]');
			var parts = backgroundPositionParts(input ? input.value : '');

			control.querySelectorAll('[data-position-token]').forEach(function (chip) {
				var active = parts.indexOf(chip.getAttribute('data-position-token')) !== -1;

				chip.classList.toggle('is-active', active);
				chip.setAttribute('aria-pressed', active ? 'true' : 'false');
			});
		}

		function syncBackgroundPositionControl(target) {
			var control = target.closest('[data-position-control]');
			var input;

			if (!control || !target.hasAttribute('data-position-value')) {
				return;
			}

			input = control.querySelector('[data-position-value]');

			if (input) {
				input.value = input.value.trim().replace(/\s+/g, ' ');
			}

			updateBackgroundPositionChips(control);
		}

		function toggleBackgroundPositionToken(button) {
			var control = button.closest('[data-position-control]');
			var input = control ? control.querySelector('[data-position-value]') : null;
			var token = button.getAttribute('data-position-token');
			var parts;
			var index;

			if (!control || !input || !token) {
				return;
			}

			parts = backgroundPositionParts(input.value);
			index = parts.indexOf(token);

			if (index !== -1) {
				parts.splice(index, 1);
			} else {
				if (parts.length >= 2) {
					parts.shift();
				}

				parts.push(token);
			}

			input.value = parts.join(' ');
			updateBackgroundPositionChips(control);
			applyFieldChange(input, false);
			restoreSettingsInteractionScroll();
		}

		function normalizeAlpha(value) {
			var alpha = parseFloat(String(value || '1').replace(',', '.'));

			if (Number.isNaN(alpha)) {
				return 1;
			}

			return Math.max(0, Math.min(1, alpha));
		}

		function alphaLabel(value) {
			return Math.round(normalizeAlpha(value) * 100) + '%';
		}

		function componentToHex(value) {
			var number = Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
			return number.toString(16).padStart(2, '0');
		}

		function expandHex(value) {
			var hex = String(value || '').trim().replace('#', '');

			if (hex.length === 3 || hex.length === 4) {
				hex = hex.split('').map(function (part) { return part + part; }).join('');
			}

			return hex;
		}

		function hexToRgb(value) {
			var hex = expandHex(value).slice(0, 6);

			if (!/^[0-9a-f]{6}$/i.test(hex)) {
				return { r: 0, g: 0, b: 0 };
			}

			return {
				r: parseInt(hex.slice(0, 2), 16),
				g: parseInt(hex.slice(2, 4), 16),
				b: parseInt(hex.slice(4, 6), 16)
			};
		}

		function rgbToHex(r, g, b) {
			return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}

		function alphaFromCss(value) {
			var text = String(value || '').trim();
			var hex;
			var match;
			var alpha;

			if (/^#[0-9a-f]{4}$/i.test(text) || /^#[0-9a-f]{8}$/i.test(text)) {
				hex = expandHex(text);
				return Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100;
			}

			match = text.match(/(?:rgba?|hsla?)\([^)]*?\/\s*([0-9.]+%?)\s*\)$/i)
				|| text.match(/(?:rgba?|hsla)\([^,]+,[^,]+,[^,]+,\s*([0-9.]+%?)\s*\)$/i);

			if (!match) {
				return 1;
			}

			alpha = String(match[1]);

			if (alpha.indexOf('%') !== -1) {
				return normalizeAlpha(parseFloat(alpha) / 100);
			}

			return normalizeAlpha(alpha);
		}

		function hexFromCss(value) {
			var text = String(value || '').trim();
			var hex = expandHex(text);
			var match;

			if (/^[0-9a-f]{6,8}$/i.test(hex)) {
				return '#' + hex.slice(0, 6);
			}

			match = text.match(/^rgba?\(\s*([0-9.]+)(?:\s*,\s*|\s+)([0-9.]+)(?:\s*,\s*|\s+)([0-9.]+)/i);

			if (match) {
				return rgbToHex(match[1], match[2], match[3]);
			}

			return '#000000';
		}

		function alphaText(value) {
			var alpha = normalizeAlpha(value);
			return String(Math.round(alpha * 100) / 100).replace(/^0\./, '.');
		}

		function colorValueFromInputs(control) {
			var picker = control.querySelector('[data-color-picker]');
			var alpha = control.querySelector('[data-color-alpha]');
			var hex = picker ? picker.value : '#000000';
			var opacity = alpha ? normalizeAlpha(alpha.value) : 1;
			var rgb = hexToRgb(hex);

			if (opacity >= 0.995) {
				return hex;
			}

			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alphaText(opacity) + ')';
		}

		function updateColorPreview(control, value) {
			var preview = control.querySelector('[data-color-preview]');
			var alpha = control.querySelector('[data-color-alpha]');
			var label = control.querySelector('[data-color-alpha-label]');
			var text = String(value || '').trim();

			if (preview) {
				preview.style.setProperty('--hc-lm-preview', text || 'transparent');
				preview.classList.toggle('is-empty', text === '');
			}

			if (label && alpha) {
				label.textContent = alphaLabel(alpha.value);
			}
		}

		function syncColorControl(target) {
			var control = target.closest('[data-color-control]');
			var text;
			var picker;
			var alpha;
			var value;

			if (!control) {
				return null;
			}

			text = control.querySelector('[data-color-value]');
			picker = control.querySelector('[data-color-picker]');
			alpha = control.querySelector('[data-color-alpha]');

			if (!text) {
				return null;
			}

			if (target.hasAttribute('data-color-picker') || target.hasAttribute('data-color-alpha')) {
				value = colorValueFromInputs(control);
				text.value = value;
				updateColorPreview(control, value);
				return text;
			}

			if (target.hasAttribute('data-color-value')) {
				value = target.value || '';

				if (picker && /^(#|rgb)/i.test(value.trim())) {
					picker.value = hexFromCss(value);
				}

				if (alpha && /^(#|rgb|hsl)/i.test(value.trim())) {
					alpha.value = alphaFromCss(value);
				}

				updateColorPreview(control, value);
			}

			return null;
		}

		function syncCssPreview(target) {
			var preview;

			if (!target || !target.hasAttribute('data-css-preview-source')) {
				return;
			}

			preview = target.closest('.hc-lm-field');
			preview = preview ? preview.nextElementSibling : null;

			if (preview && preview.hasAttribute('data-css-preview')) {
				preview.style.setProperty('--hc-lm-preview', target.value || 'transparent');
			}
		}

		function colorControl(label, path, value, help) {
			var color = hexFromCss(value || '');
			var alpha = alphaFromCss(value || '');

			return '<div class="hc-lm-field hc-lm-color-field" data-color-control>' +
				'<label>' + escapeHtml(label) + '</label>' +
				'<div class="hc-lm-color-field__grid">' +
				'<input type="color" value="' + escapeHtml(color) + '" data-color-picker aria-label="' + escapeHtml(label + ' picker') + '">' +
				'<label class="hc-lm-color-alpha"><span>Alpha <strong data-color-alpha-label>' + alphaLabel(alpha) + '</strong></span><input type="range" min="0" max="1" step="0.01" value="' + escapeHtml(alpha) + '" data-color-alpha></label>' +
				'</div>' +
				'<input type="text" value="' + escapeHtml(value || '') + '" data-path="' + path + '" data-color-value placeholder="#d32f2f, rgba(...), hsl(...), linear-gradient(...)">' +
				(help ? '<small>' + escapeHtml(help) + '</small>' : '') +
				'</div>';
		}

		function selectControl(label, path, value, options) {
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><select data-path="' + path + '">' + optionsHtml(options, value) + '</select></div>';
		}

		function optionsHtml(options, value) {
			var html = '';
			options.forEach(function (option) {
				var optionValue = typeof option === 'object' ? option.value : option;
				var optionLabel = typeof option === 'object' ? option.label : option;
				html += '<option value="' + escapeHtml(optionValue) + '"' + (String(value) === String(optionValue) ? ' selected' : '') + '>' + escapeHtml(optionLabel || 'Nenhum') + '</option>';
			});

			return html;
		}

		function checkControl(label, path, checked) {
			return '<label class="hc-lm-toggle"><span class="hc-lm-toggle__label">' + escapeHtml(label) + '</span><input class="hc-lm-toggle__input" type="checkbox" data-path="' + path + '"' + (checked ? ' checked' : '') + '><span class="hc-lm-toggle__track" aria-hidden="true"><span class="hc-lm-toggle__knob"></span></span></label>';
		}

		function addFromPalette(type) {
			var selected = state.selectedId ? findItem(state.layout, state.selectedId) : null;
			var targetId = selected && selected.item && selected.item.type !== 'site' ? selected.item.id : '';
			var plan = insertionPlan(state.layout, type, targetId, null, null);
			var inserted;

			if (!plan.valid) {
				pushToast('warning', plan.message);
				return;
			}

			inserted = applyInsertionPlan(state.layout, plan);

			if (inserted) {
				state.selectedId = inserted.id;
				render();
			}
		}

		function addFromPaletteToDrop(type, targetId, event, node) {
			var plan = insertionPlan(state.layout, type, targetId, event, node);
			var inserted;

			if (!plan.valid) {
				pushToast('warning', plan.message);
				return;
			}

			inserted = applyInsertionPlan(state.layout, plan);

			if (inserted) {
				state.selectedId = inserted.id;
				render();
			}
		}

		function addRow(item) {
			var plan = insertionPlan(state.layout, 'row', item ? item.id : '', null, null);
			var row;

			if (!plan.valid) {
				pushToast('warning', plan.message);
				return;
			}

			row = applyInsertionPlan(state.layout, plan);

			if (row) {
				state.selectedId = row.id;
				render();
			}
		}

		function addColumnNear(found) {
			var plan = insertionPlan(state.layout, 'column', found && found.item ? found.item.id : '', null, null);
			var column;

			if (!plan.valid) {
				pushToast('warning', plan.message);
				return;
			}

			column = applyInsertionPlan(state.layout, plan);

			if (column) {
				state.selectedId = column.id;
				render();
			}
		}

		function removeItem(id) {
			var found = findItem(state.layout, id);

			if (!found) {
				return;
			}

			if (found.item.type === 'row' && found.collection.length <= 1) {
				pushToast('warning', 'Essa área precisa manter pelo menos uma Linha.');
				return;
			}

			if (found.item.type === 'column' && found.collection.length <= 1) {
				pushToast('warning', 'Essa Linha precisa manter pelo menos uma Coluna.');
				return;
			}

			var removedType = found.item.type;
			var parent = found.parent;

			found.collection.splice(found.index, 1);

			if (removedType === 'column' && parent && parent.type === 'row') {
				rebalanceRowColumns(parent);
			}

			state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;
			render();
		}

		function moveItem(id, direction) {
			var found = findItem(state.layout, id);

			if (!found) {
				return;
			}

			var newIndex = found.index + direction;

			if (newIndex < 0 || newIndex >= found.collection.length) {
				return;
			}

			var item = found.collection.splice(found.index, 1)[0];
			found.collection.splice(newIndex, 0, item);
			render();
		}

		function duplicateItem(id) {
			var found = findItem(state.layout, id);

			if (!found || (found.item.type !== 'section' && found.item.type !== 'row')) {
				return;
			}

			var copy = clone(found.item);

			walkClone(copy);
			copy.title += ' copy';
			found.collection.splice(found.index + 1, 0, copy);
			state.selectedId = copy.id;
			render();
		}

		function walkClone(item) {
			item.id = uid(item.type);

			(item.rows || []).forEach(walkClone);
			(item.columns || []).forEach(walkClone);
		}

		function pathNeedsSettingsRefresh(path) {
			return path === 'visual.backgroundType' || path === 'settings.visual.backgroundType';
		}

		function refreshAfterFieldChange(path) {
			var settingsState = captureSettingsState();

			state.layout = normalizeLayout(state.layout, defaultLayout);
			renderAlerts();
			renderPalette();
			renderCanvas();

			if (pathNeedsSettingsRefresh(path)) {
				renderSettings(settingsState);
			}

			sync();
			restoreSettingsInteractionScroll();
		}

		function applyFieldChange(target, live) {
			var found = state.selectedId ? findItem(state.layout, state.selectedId) : null;
			var path = target.getAttribute('data-path');

			if (!found || !path) {
				return;
			}

			var value = target.type === 'checkbox' ? target.checked : target.value;

			if (path === 'componentArea' && value && flagExistsExcept(state.layout, found.item.id, 'componentArea')) {
				target.checked = false;
				pushToast('warning', 'Já existe uma Área do componente.');
				return;
			}

			if (path === 'mainNavigation' && value && state.layout.items.some(function (item) { return item.type === 'nav'; })) {
				target.checked = false;
				pushToast('warning', 'Remova a seção Nav antes de marcar a coluna como Main Navigation.');
				return;
			}

			if (path === 'mainNavigation' && value && flagExistsExcept(state.layout, found.item.id, 'mainNavigation')) {
				target.checked = false;
				pushToast('warning', 'A navegação principal já foi definida.');
				return;
			}

			setPath(found.item, path, value);

			/* Marca a coluna como "configurada manualmente" assim que o
			   usuário muda qualquer breakpoint do grid. Isso protege os
			   valores customizados contra o auto-grid (rebalanceRowColumns)
			   quando outras colunas são adicionadas ou removidas na mesma Linha. */
			if (found.item && found.item.type === 'column' && path.indexOf('grid.') === 0) {
				found.item.grid = found.item.grid || {};
				found.item.grid.manual = true;
			}

			sync();
			restoreSettingsInteractionScroll();

			if (path === 'gapValue' || path === 'gapUnit' || path === 'gapCustom' || path === 'gapEnabled') {
				renderAlerts();
				renderCanvas();
				restoreSettingsInteractionScroll();
				return;
			}

			if (!live) {
				refreshAfterFieldChange(path);
			}
		}

		function handleAction(action, id, type, key, path) {
			if (action === 'add-palette') {
				addFromPalette(type);
			} else if (action === 'select') {
				state.selectedId = id;
				render();
			} else if (action === 'add-row') {
				addRow(findItem(state.layout, id).item);
			} else if (action === 'add-column') {
				addColumnNear(findItem(state.layout, id));
			} else if (action === 'request-remove') {
				requestRemoveItem(id);
			} else if (action === 'confirm-remove') {
				state.toasts = state.toasts.filter(function (toast) {
					return !(toast.actions || []).some(function (toastAction) {
						return toastAction.action === 'confirm-remove' && toastAction.id === id;
					});
				});
				renderToasts();
				removeItem(id);
				pushToast('success', 'Item deletado.');
			} else if (action === 'move-up') {
				moveItem(id, -1);
			} else if (action === 'move-down') {
				moveItem(id, 1);
			} else if (action === 'duplicate') {
				duplicateItem(id);
			} else if (action === 'open-tools') {
				openToolsModal(false);
			} else if (action === 'reset') {
				if (resetConfirm) {
					resetConfirm.hidden = false;
				}
			} else if (action === 'confirm-reset') {
				state.toasts = state.toasts.filter(function (toast) {
					return !(toast.actions || []).some(function (toastAction) {
						return toastAction.action === 'confirm-reset';
					});
				});
				state.layout = normalizeLayout(clone(defaultLayout), defaultLayout);
				state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;
				state.dismissedValidations = {};
				state.validationHidden = false;
				pushToast('success', 'Layout resetado para o padrão.');
				closeToolsModal();
				render();
			} else if (action === 'cancel-reset') {
				if (resetConfirm) {
					resetConfirm.hidden = true;
				}
			} else if (action === 'export') {
				openToolsModal(false);
			} else if (action === 'import') {
				openToolsModal(true);
			} else if (action === 'copy-json') {
				copyJson();
			} else if (action === 'download-json') {
				downloadJson();
			} else if (action === 'apply-json') {
				importJsonText(jsonArea ? jsonArea.value : '');
			} else if (action === 'close-json') {
				closeToolsModal();
			} else if (action === 'close-tools') {
				closeToolsModal();
			} else if (action === 'open-media') {
				openMediaPicker(path || '');
			} else if (action === 'toggle-validations') {
				state.validationOpen = !state.validationOpen;
				renderAlerts();
			} else if (action === 'close-validations') {
				state.validationHidden = true;
				renderAlerts();
			} else if (action === 'show-validations') {
				state.validationHidden = false;
				state.validationOpen = true;
				renderAlerts();
			} else if (action === 'close-validation') {
				state.dismissedValidations[key || id || ''] = true;
				renderAlerts();
			} else if (action === 'select-warning') {
				if (id && findItem(state.layout, id)) {
					state.selectedId = id;
					render();
					var node = Array.prototype.find.call(canvas.querySelectorAll('[data-node-id]'), function (candidate) {
						return candidate.getAttribute('data-node-id') === id;
					});

					if (node) {
						node.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
				}
			} else if (action === 'close-toast') {
				state.toasts = state.toasts.filter(function (toast) {
					return toast.id !== id;
				});
				renderToasts();
			}
		}

		function openMediaPicker(path) {
			var url = '';

			if (window.Joomla && typeof window.Joomla.getOptions === 'function') {
				var paths = window.Joomla.getOptions('system.paths') || {};
				var base = paths.baseFull || paths.base || '';

				if (base) {
					url = base.replace(/\/$/, '') + '/index.php?option=com_media&view=media&tmpl=component&asset=com_templates&author=&path=local-images:/';
				}
			}

			if (!url) {
				pushToast('info', 'Abra o Media Manager do Joomla e informe aqui o caminho da imagem.');
				return;
			}

			window.open(url, 'hcCarlixMedia', 'width=1180,height=760');
			pushToast('info', 'Media Manager aberto. Use o caminho da imagem selecionada no campo deste item.');

			if (path && state.selectedId) {
				state.pendingMediaPath = path;
			}
		}

		function mediaPathFromMessage(data) {
			if (typeof data === 'string') {
				try {
					data = JSON.parse(data);
				} catch (error) {
					return '';
				}
			}

			if (!data || typeof data !== 'object') {
				return '';
			}

			var candidates = [
				data.path,
				data.url,
				data.name,
				data.file,
				data.selected && data.selected.path,
				data.selected && data.selected.url,
				data.data && data.data.path,
				data.data && data.data.url
			];

			if (Array.isArray(data.selected) && data.selected[0]) {
				candidates.push(data.selected[0].path, data.selected[0].url);
			}

			if (Array.isArray(data.data) && data.data[0]) {
				candidates.push(data.data[0].path, data.data[0].url);
			}

			return normalizeMediaPath(candidates.filter(Boolean).map(String)[0] || '');
		}

		function normalizeMediaPath(path) {
			path = String(path || '').trim();

			if (!path) {
				return '';
			}

			return path
				.replace(/^local-images:\//, 'images/')
				.replace(/^local-files:\//, 'files/');
		}

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' && toolsModal && !toolsModal.hidden) {
				closeToolsModal();
			}
		});

		if (jsonFile) {
			jsonFile.addEventListener('change', function (event) {
				readJsonFile(event.target.files && event.target.files[0]);
			});
		}

		root.addEventListener('click', function (event) {
			if (event.target.closest('.hc-lm-action-menu') && !event.target.closest('.hc-lm-action-item')) {
				return;
			}

			var button = event.target.closest('[data-action]');

			if (!button || !root.contains(button)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			handleAction(button.getAttribute('data-action'), button.getAttribute('data-id'), button.getAttribute('data-type'), button.getAttribute('data-key'), button.getAttribute('data-path'));
		});

		settings.addEventListener('pointerdown', rememberSettingsInteractionScroll, true);
		settings.addEventListener('mousedown', rememberSettingsInteractionScroll, true);
		settings.addEventListener('touchstart', rememberSettingsInteractionScroll, { capture: true, passive: true });
		settings.addEventListener('click', function (event) {
			var positionChip = event.target.closest('[data-position-token]');

			if (positionChip) {
				event.preventDefault();
				toggleBackgroundPositionToken(positionChip);
				return;
			}

			if (event.target.closest('[data-path], .hc-lm-toggle')) {
				restoreSettingsInteractionScroll();
			}
		}, true);

		settings.addEventListener('input', function (event) {
			rememberSettingsInteractionScroll(event);
			syncBackgroundPositionControl(event.target);
			var syncedColor = syncColorControl(event.target);

			syncCssPreview(event.target);

			if (syncedColor) {
				applyFieldChange(syncedColor, true);
				restoreSettingsInteractionScroll();
				return;
			}

			if (!event.target.matches('[data-path]')) {
				return;
			}

			applyFieldChange(event.target, event.target.type !== 'checkbox' && event.target.tagName !== 'SELECT');
			restoreSettingsInteractionScroll();
		});

		settings.addEventListener('change', function (event) {
			rememberSettingsInteractionScroll(event);
			var syncedColor = syncColorControl(event.target);

			if (syncedColor) {
				applyFieldChange(syncedColor, false);
				restoreSettingsInteractionScroll();
				return;
			}

			if (!event.target.matches('[data-path]')) {
				return;
			}

			applyFieldChange(event.target, false);
			restoreSettingsInteractionScroll();
		});

		palette.addEventListener('dragstart', function (event) {
			var item = event.target.closest('[data-action="add-palette"]');

			if (!item || item.getAttribute('aria-disabled') === 'true') {
				event.preventDefault();
				return;
			}

			state.draggingPaletteType = item.getAttribute('data-type') || '';
			state.draggingId = null;
			event.dataTransfer.effectAllowed = 'copy';
			event.dataTransfer.setData('text/plain', 'palette:' + state.draggingPaletteType);
		});

		palette.addEventListener('dragend', function () {
			state.draggingPaletteType = '';
			canvas.classList.remove('is-palette-over');
			clearDropFeedback(canvas);
		});

		canvas.addEventListener('dragstart', function (event) {
			var node = event.target.closest('[data-node-id]');

			if (!node) {
				return;
			}

			state.draggingId = node.getAttribute('data-node-id');
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', state.draggingId);
		});

		canvas.addEventListener('dragover', function (event) {
			var node = event.target.closest('[data-node-id]');
			var plan;

			if (state.draggingPaletteType) {
				event.preventDefault();
				canvas.classList.add('is-palette-over');
				clearDropFeedback(canvas);

				if (node) {
					plan = insertionPlan(state.layout, state.draggingPaletteType, node.getAttribute('data-node-id'), event, node);
					addDropFeedback(node, plan);
				}

				return;
			}

			if (!node || !state.draggingId || node.getAttribute('data-node-id') === state.draggingId) {
				return;
			}

			var dragged = findItem(state.layout, state.draggingId);
			var target = findItem(state.layout, node.getAttribute('data-node-id'));

			if (dragged && target && dragged.collection === target.collection) {
				event.preventDefault();
				node.classList.add('is-drag-over');
			}
		});

		canvas.addEventListener('dragleave', function (event) {
			var node = event.target.closest('[data-node-id]');

			if (node) {
				node.classList.remove('is-drag-over', 'is-drop-before', 'is-drop-after', 'is-drop-inside', 'is-drop-invalid');
				node.removeAttribute('data-drop-label');
			}
		});

		canvas.addEventListener('drop', function (event) {
			var node = event.target.closest('[data-node-id]');

			if (state.draggingPaletteType) {
				event.preventDefault();
				addFromPaletteToDrop(state.draggingPaletteType, node ? node.getAttribute('data-node-id') : '', event, node);
				state.draggingPaletteType = '';
				canvas.classList.remove('is-palette-over');
				clearDropFeedback(canvas);
				return;
			}

			if (!node || !state.draggingId) {
				return;
			}

			var dragged = findItem(state.layout, state.draggingId);
			var target = findItem(state.layout, node.getAttribute('data-node-id'));

			if (!dragged || !target || dragged.collection !== target.collection || dragged.item.id === target.item.id) {
				return;
			}

			event.preventDefault();
			var moved = dragged.collection.splice(dragged.index, 1)[0];
			var targetIndex = target.collection.indexOf(target.item);
			target.collection.splice(targetIndex, 0, moved);
			state.draggingId = null;
			render();
		});

		canvas.addEventListener('dragend', function () {
			state.draggingId = null;
			state.draggingPaletteType = '';
			canvas.classList.remove('is-palette-over');
			clearDropFeedback(canvas);
		});

		window.addEventListener('message', function (event) {
			if (!state.pendingMediaPath || !state.selectedId) {
				return;
			}

			var mediaPath = mediaPathFromMessage(event.data);

			if (!mediaPath) {
				return;
			}

			var found = findItem(state.layout, state.selectedId);

			if (!found) {
				return;
			}

			setPath(found.item, state.pendingMediaPath, mediaPath);
			state.pendingMediaPath = '';
			pushToast('info', 'Imagem aplicada no item selecionado.');
			render();
		});

		if (input.form) {
			input.form.addEventListener('submit', function (event) {
				var errors = validateLayout(state.layout).filter(function (issue) {
					return issue.level === 'error';
				});

				if (!errors.length) {
					sync();
					return;
				}

				event.preventDefault();
				state.validationOpen = true;
				state.validationHidden = false;
				pushToast('error', 'Corrija os erros do Layout Manager antes de salvar.');
				renderAlerts();
				root.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		}

		render();
	}

	onReady(function () {
		document.querySelectorAll('[data-hc-layout-manager]').forEach(initManager);
	});
})();
