/**
 * HC Carlix - Layout Manager admin UI.
 * Pure JavaScript, native drag and drop, no jQuery.
 */
(function () {
	'use strict';

	var SITE_ID = 'site-root';
	var ROOT_TYPES = ['header', 'nav', 'section', 'footer'];
	var UNIQUE_ROOT_TYPES = ['header', 'nav', 'footer'];
	var GAP_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
	var WIDTH_OPTIONS = ['inherit', 'container', 'container-fluid', 'full'];
	var SECTION_WIDTH_OPTIONS = ['container', 'container-fluid', 'full'];
	var VISIBILITY_OPTIONS = ['all', 'desktop', 'tablet', 'mobile', 'hidden'];
	var CSS_UNIT_OPTIONS = ['px', 'rem', 'em', '%', 'vw', 'vh'];
	var GAP_UNIT_OPTIONS = ['px', 'rem', 'em', '%'];
	var BACKGROUND_POSITION_OPTIONS = ['center center', 'top center', 'bottom center', 'left center', 'right center'];
	var BACKGROUND_SIZE_OPTIONS = ['cover', 'contain', 'auto', '100% auto', 'auto 100%'];
	var BACKGROUND_REPEAT_OPTIONS = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'];
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
		row: 'Row',
		column: 'Column'
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
		warning: 'Aviso',
		error: 'Erro'
	};
	var PALETTE_MESSAGES = {
		header: 'Header ja existe no layout.',
		nav: 'A navegacao principal ja foi definida.',
		footer: 'Footer ja existe no layout.'
	};
	var TOAST_TIMEOUT = 3600;

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
			settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .92V20a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1-.92 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.92-1H3.6a2 2 0 0 1 0-4h.08a1.7 1.7 0 0 0 .92-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.92V3.6a2 2 0 0 1 4 0v.08a1.7 1.7 0 0 0 1 .92 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.36.56.67.92.92h.08a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-.92 1z"/>',
			'add-row': '<path d="M4 6h16v4H4z"/><path d="M4 14h7v4H4z"/><path d="M16 13v6"/><path d="M13 16h6"/>',
			'add-column': '<path d="M5 4h5v16H5z"/><path d="M14 4h5v8h-5z"/><path d="M16.5 15v6"/><path d="M13.5 18h6"/>',
			duplicate: '<path d="M8 8h11v11H8z"/><path d="M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"/>',
			trash: '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/>',
			up: '<path d="m6 15 6-6 6 6"/>',
			down: '<path d="m6 9 6 6 6-6"/>',
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
			customClass: '',
			customId: '',
			backgroundColor: '',
			backgroundImage: '',
			backgroundPosition: 'center center',
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
			backgroundOpacity: '1',
			textColor: '',
			linkColor: '',
			hoverColor: '',
			borderBottom: '',
			shadow: '',
			padding: '',
			margin: '',
			paddingTop: '',
			paddingRight: '',
			paddingBottom: '',
			paddingLeft: '',
			paddingUnit: 'rem',
			marginTop: '',
			marginRight: '',
			marginBottom: '',
			marginLeft: '',
			marginUnit: 'rem',
			rowGap: '',
			visibility: 'all',
			order: ''
		};
	}

	function defaultSiteSettings() {
		return {
			id: SITE_ID,
			type: 'site',
			title: 'SITE',
			bodyBg: '#ffffff',
			textColor: '#333333',
			primaryColor: '#d32f2f',
			secondaryColor: '#151515',
			containerWidthValue: '1320',
			containerWidthUnit: 'px',
			containerWidthCustom: '',
			backToTop: false,
			typography: '',
			maxWidth: '',
			globalBehavior: 'default'
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
		value.bodyBg = value.bodyBg || value.body_background || fallback.bodyBg;
		value.textColor = value.textColor || value.text_color || fallback.textColor;
		value.primaryColor = value.primaryColor || value.primary_color || fallback.primaryColor;
		value.secondaryColor = value.secondaryColor || value.secondary_color || fallback.secondaryColor;
		value.containerWidthValue = String(value.containerWidthValue || value.container_value || fallback.containerWidthValue || '1320');
		value.containerWidthUnit = ['px', 'rem', '%', 'vw', 'full', 'custom'].indexOf(value.containerWidthUnit || value.container_unit) !== -1 ? (value.containerWidthUnit || value.container_unit) : fallback.containerWidthUnit;
		value.containerWidthCustom = value.containerWidthCustom || value.container_custom || fallback.containerWidthCustom || '';
		value.backToTop = value.backToTop === true || value.back_to_top === true || String(value.backToTop || value.back_to_top || '') === '1';
		value.typography = value.typography || fallback.typography || '';
		value.maxWidth = value.maxWidth || value.max_width || fallback.maxWidth || '';
		value.globalBehavior = value.globalBehavior || value.global_behavior || fallback.globalBehavior || 'default';

		return value;
	}

	function normalizeRoot(item) {
		item.id = item.id || uid(item.type || 'section');
		item.type = ROOT_TYPES.indexOf(item.type) !== -1 ? item.type : 'section';
		item.title = item.title || TYPE_LABELS[item.type] || 'Section';
		item.enabled = item.enabled !== false;
		item.width = SECTION_WIDTH_OPTIONS.indexOf(item.width) !== -1 ? item.width : 'container';
		item.settings = Object.assign(defaultSettings(), item.settings || {});
		item.rows = Array.isArray(item.rows) ? item.rows.map(normalizeRow) : [];

		if (!item.rows.length) {
			item.rows = [createRow(item.title + ' row')];
		}

		if (item.type === 'header') {
			item.mode = HEADER_MODES.indexOf(item.mode) !== -1 ? item.mode : 'sticky';
			item.header = Object.assign(defaultHeaderSettings(), item.header || {});
		}

		if (item.type === 'header' || item.type === 'nav' || item.type === 'footer') {
			item.rows = [item.rows[0]];
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
		row.alignVertical = row.alignVertical || 'stretch';
		row.alignHorizontal = row.alignHorizontal || 'start';
		row.settings = Object.assign(defaultSettings(), row.settings || {});
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
		column.grid = Object.assign(defaultGrid(), column.grid || {});
		column.settings = Object.assign(defaultSettings(), column.settings || {});

		BREAKPOINTS.forEach(function (bp) {
			column.grid[bp.key] = GRID_VALUES.indexOf(String(column.grid[bp.key])) !== -1 ? String(column.grid[bp.key]) : '12';
		});

		return column;
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

	function rebalanceRowColumns(row) {
		var columns = row && Array.isArray(row.columns) ? row.columns : [];
		var count = columns.length;
		var sizes = count === 1 ? ['12'] :
			(count === 2 ? ['6', '6'] :
			(count === 3 ? ['4', '4', '4'] :
			(count === 4 ? ['3', '3', '3', '3'] : distributedGrid(count))));

		columns.forEach(function (column, index) {
			column.grid = Object.assign(defaultGrid(), column.grid || {});
			BREAKPOINTS.forEach(function (bp) {
				column.grid[bp.key] = sizes[index] || '12';
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
			issues.push(validation('error', 'Header so pode existir uma vez.', headerItems[1].id, 'header-unique'));
		}

		if (footerItems.length > 1) {
			issues.push(validation('error', 'Footer so pode existir uma vez.', footerItems[1].id, 'footer-unique'));
		}

		if (navItems.length > 1) {
			issues.push(validation('error', 'Nav so pode existir uma vez.', navItems[1].id, 'nav-unique'));
		}

		if (navItems.length && mainNavigationColumns.length) {
			issues.push(validation('error', 'Use Nav como section ou Column Main Navigation, nunca os dois ao mesmo tempo.', mainNavigationColumns[0].id, 'main-navigation-conflict'));
		}

		if (mainNavigationColumns.length > 1) {
			issues.push(validation('error', 'Main Navigation so pode existir uma vez.', mainNavigationColumns[1].id, 'main-navigation-unique'));
		}

		if (componentColumns.length > 1) {
			issues.push(validation('error', 'Component Area so pode existir uma vez.', componentColumns[1].id, 'component-area-unique'));
		}

		if (componentColumns.length < 1) {
			issues.push(validation('error', 'O layout precisa ter uma Component Area.', layout.items[0] ? layout.items[0].id : '', 'component-area-required'));
		}

		layout.items.forEach(function (item) {
			if ((item.type === 'header' || item.type === 'nav' || item.type === 'footer') && (!item.rows || item.rows.length !== 1)) {
				issues.push(validation('error', (TYPE_LABELS[item.type] || item.type) + ' precisa ter exatamente uma Row.', item.id, item.id + '-single-row'));
			}

			(item.rows || []).forEach(function (row) {
				if (!row.columns || !row.columns.length) {
					issues.push(validation('error', 'A Row "' + row.title + '" precisa ter pelo menos uma Column.', row.id, row.id + '-empty'));
				}

				BREAKPOINTS.forEach(function (bp) {
					if (bp.key === 'phone' || bp.key === 'largePhone' || bp.key === 'tablet') {
						return;
					}

					if (rowSum(row, bp.key) > 12) {
						issues.push(validation('warning', 'A Row "' + row.title + '" passa de 12 colunas em ' + bp.label + '.', row.id, row.id + '-sum-' + bp.key));
					}
				});
			});
		});

		return uniqueValidations(issues);
	}

	function initManager(root) {
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
		var jsonWrap = root.querySelector('[data-hc-lm-json-wrap]');
		var jsonArea = root.querySelector('[data-hc-lm-json]');
		var positions = parseJson(root.getAttribute('data-positions'), []);
		var defaultLayout = normalizeLayout(parseJson(root.getAttribute('data-default-layout'), { items: [] }), { items: [] });
		var state = {
			layout: normalizeLayout(parseJson(input.value, defaultLayout), defaultLayout),
			selectedId: null,
			draggingId: null,
			draggingPaletteType: '',
			validationOpen: true,
			dismissedValidations: {},
			toasts: []
		};

		state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;

		function sync() {
			input.value = JSON.stringify(state.layout);
		}

		function render() {
			state.layout = normalizeLayout(state.layout, defaultLayout);
			renderAlerts();
			renderPalette();
			renderCanvas();
			renderSettings();
			sync();
		}

		function pushToast(type, message, actions) {
			var toast = {
				id: uid('toast'),
				type: type || 'info',
				message: message,
				actions: actions || []
			};

			state.toasts.push(toast);
			renderToasts();

			window.setTimeout(function () {
				state.toasts = state.toasts.filter(function (item) {
					return item.id !== toast.id;
				});
				renderToasts();
			}, TOAST_TIMEOUT);
		}

		function renderToasts() {
			if (!toasts) {
				return;
			}

			toasts.innerHTML = state.toasts.map(function (toast) {
				var actions = '';

				if (toast.actions && toast.actions.length) {
					actions = '<div class="hc-lm-toast__actions">' + toast.actions.map(function (action) {
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
			var status = errorCount ? 'error' : (warningCount ? 'warning' : 'ok');
			var title = status === 'ok' ? 'Layout validado' : 'Validacao do layout';
			var summary = errorCount + ' erro(s), ' + warningCount + ' aviso(s), ' + infoCount + ' info';
			var html = '<section class="hc-lm-validation hc-lm-validation--' + status + (state.validationOpen ? '' : ' is-collapsed') + '">' +
				'<button type="button" class="hc-lm-validation__summary" data-action="toggle-validations" aria-expanded="' + (state.validationOpen ? 'true' : 'false') + '">' +
				'<span><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(summary) + '</small></span>' +
				'<span class="hc-lm-validation__count">' + issues.length + '</span>' +
				'</button>';

			if (state.validationOpen) {
				html += '<div class="hc-lm-validation__body">';

				if (!visible.length) {
					html += '<p class="hc-lm-validation__empty">Sem problemas ativos. O JSON pode ser salvo com seguranca.</p>';
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
				paletteButton('section', 'Area estrutural livre.'),
				paletteButton('row', 'Adicionar dentro do item selecionado.', !selected),
				paletteButton('column', 'Adicionar dentro da Row selecionada.', !selected),
				paletteButton('footer', 'Rodape estrutural. Apenas um.', footerCount > 0)
			].join('');

			palette.innerHTML =
				'<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Paleta</h3><p class="hc-lm-panel__hint">Arraste ou clique para montar a estrutura.</p></div></div>' +
				'<div class="hc-lm-palette-list">' + buttons + '</div>' +
				'<div class="hc-lm-status">' +
				statusItem('Header', headerCount, 1) +
				statusItem('Main Navigation', navExists ? 1 : 0, 1) +
				statusItem('Component Area', componentCount, 1) +
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
				'<summary aria-label="Acoes do SITE">' + icon('settings') + '</summary>' +
				'<div class="hc-lm-action-menu__list">' +
				actionButton('select', site.id, 'Configurar', 'Abrir configuracoes globais do site.') +
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
			var html = '<div class="hc-lm-node hc-lm-node--' + item.type + selected + disabled + issueClass + '" draggable="true" data-node-id="' + item.id + '" data-node-type="' + item.type + '"' + columnStyle(item) + '>' +
				'<div class="hc-lm-node__bar" data-action="select" data-id="' + item.id + '">' +
				'<div class="hc-lm-node__title"><span class="hc-lm-badge">' + icon(TYPE_ICONS[item.type]) + '</span><span class="hc-lm-node__name">' + escapeHtml(item.title) + '</span></div>' +
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
				meta.push(tag('gap: ' + (item.gapEnabled ? ((item.gapValue || '15') + (item.gapUnit || 'px')) : '0px')));
				meta.push(tag('desktop: ' + rowSum(item, 'largeDesktop') + '/12'));
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

		function nodeActions(item) {
			var actions = [
				actionButton('select', item.id, 'Configurar', 'Abrir configuracoes deste item.'),
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
				actions.push(actionButton('duplicate', item.id, 'Duplicar', 'Criar uma copia simples.'));
			}

			actions.push(actionButton('request-remove', item.id, 'Deletar', 'Pede confirmacao antes de remover.', true));

			return '<details class="hc-lm-action-menu">' +
				'<summary aria-label="Acoes do item">' + icon('settings') + '</summary>' +
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

		function renderSettings() {
			var found = state.selectedId ? findItem(state.layout, state.selectedId) : null;

			if (!found) {
				settings.innerHTML = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Configuracoes</h3><p class="hc-lm-panel__hint">Selecione um item no construtor.</p></div></div>';
				return;
			}

			var item = found.item;
			var html = '<div class="hc-lm-panel__head"><div><h3 class="hc-lm-panel__title">Configuracoes</h3><p class="hc-lm-panel__hint">' + escapeHtml(TYPE_LABELS[item.type]) + ': ' + escapeHtml(item.title) + '</p></div></div>';
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
		}

		function renderSiteSettings(item) {
			return formSection('Configuracoes globais do site',
				colorControl('Cor de fundo do body', 'bodyBg', item.bodyBg) +
				colorControl('Cor do texto', 'textColor', item.textColor) +
				colorControl('Cor primaria', 'primaryColor', item.primaryColor) +
				colorControl('Cor secundaria', 'secondaryColor', item.secondaryColor)
			) +
			formSection('Container',
				numberControl('Largura do container', 'containerWidthValue', item.containerWidthValue, 'Padrao atual: 1320. Informe apenas o valor numerico.') +
				selectControl('Unidade do container', 'containerWidthUnit', item.containerWidthUnit, ['px', 'rem', '%', 'vw', 'full', 'custom']) +
				textControl('Container custom', 'containerWidthCustom', item.containerWidthCustom, 'Use quando a unidade for custom. Ex.: min(1320px, 96vw)') +
				textControl('Largura maxima futura', 'maxWidth', item.maxWidth, 'Campo reservado para evolucoes globais.')
			) +
			formSection('Comportamento global',
				checkControl('Botao voltar ao topo', 'backToTop', item.backToTop) +
				selectControl('Comportamento global', 'globalBehavior', item.globalBehavior, ['default', 'compact', 'spacious']) +
				textControl('Tipografia futura', 'typography', item.typography, 'Reservado para familia, escala ou preset tipografico.')
			);
		}

		function renderRootSettings(item) {
			var html = formSection('Basico',
				textControl('Titulo', 'title', item.title) +
				checkControl('Ativar', 'enabled', item.enabled) +
				selectControl('Largura', 'width', item.width, SECTION_WIDTH_OPTIONS)
			);

			if (item.type === 'header') {
				html += formSection('Header',
					selectControl('Modo', 'mode', item.mode, HEADER_MODES) +
					selectControl('Comportamento', 'header.behavior', item.header.behavior, HEADER_BEHAVIORS) +
					textControl('Altura desktop', 'header.heightDesktop', item.header.heightDesktop, 'px, rem, vh, auto') +
					textControl('Altura tablet', 'header.heightTablet', item.header.heightTablet, 'px, rem, vh, auto') +
					textControl('Altura mobile', 'header.heightMobile', item.header.heightMobile, 'px, rem, vh, auto') +
					checkControl('Sticky ativo', 'header.sticky', item.header.sticky) +
					checkControl('Shrink ao scroll', 'header.shrinkOnScroll', item.header.shrinkOnScroll) +
					checkControl('Sombra ao scroll', 'header.shadowOnScroll', item.header.shadowOnScroll) +
					checkControl('Fundo ao scroll', 'header.backgroundScroll', item.header.backgroundScroll) +
					textControl('Velocidade transicao', 'header.transitionSpeed', item.header.transitionSpeed, 'Ex.: 180ms, 0.25s') +
					checkControl('Transparente inicial', 'header.transparentInitial', item.header.transparentInitial) +
					checkControl('Blur background', 'header.blurBackground', item.header.blurBackground) +
					checkControl('Overlay content', 'header.overlayContent', item.header.overlayContent) +
					checkControl('Auto body offset', 'header.autoBodyOffset', item.header.autoBodyOffset)
				);
			}

			html += styleSettings(item);
			return html;
		}

		function renderRowSettings(item) {
			return formSection('Basico',
				textControl('Titulo', 'title', item.title) +
				selectControl('Largura', 'width', item.width, WIDTH_OPTIONS) +
				checkControl('Com gap', 'gapEnabled', item.gapEnabled) +
				gapControls(item) +
				selectControl('Alinhamento vertical', 'alignVertical', item.alignVertical, ['start', 'center', 'end', 'stretch']) +
				selectControl('Alinhamento horizontal', 'alignHorizontal', item.alignHorizontal, ['start', 'center', 'end', 'between'])
			) + styleSettings(item, true);
		}

		function renderColumnSettings(item) {
			var positionOptions = [''].concat(positions.map(function (position) { return position.value; }));
			var grid = BREAKPOINTS.map(function (bp) {
				return selectControl(bp.label, 'grid.' + bp.key, item.grid[bp.key], GRID_VALUES);
			}).join('');

			return formSection('Basico',
				textControl('Titulo', 'title', item.title) +
				checkControl('Component Area', 'componentArea', item.componentArea) +
				checkControl('Main Navigation', 'mainNavigation', item.mainNavigation) +
				selectControl('Module Position', 'position', item.position, positionOptions)
			) +
			formSection('Grid por breakpoint', '<div class="hc-lm-grid-fields">' + grid + '</div>') +
			styleSettings(item, true);
		}

		function styleSettings(item, includeOrder) {
			return formSection('CSS',
				textControl('Custom class', 'settings.customClass', item.settings.customClass) +
				(item.type !== 'row' ? textControl('Custom id', 'settings.customId', item.settings.customId) : '')
			) +
			formSection('Visual',
				colorControl('Background color', 'settings.backgroundColor', item.settings.backgroundColor) +
				mediaControl('Background image', 'settings.backgroundImage', item.settings.backgroundImage, 'Use uma imagem do Media Manager do Joomla. Ex.: images/banner.jpg') +
				selectControl('Background position', 'settings.backgroundPosition', item.settings.backgroundPosition, BACKGROUND_POSITION_OPTIONS) +
				selectControl('Background size', 'settings.backgroundSize', item.settings.backgroundSize, BACKGROUND_SIZE_OPTIONS) +
				selectControl('Background repeat', 'settings.backgroundRepeat', item.settings.backgroundRepeat, BACKGROUND_REPEAT_OPTIONS) +
				textControl('Background opacity', 'settings.backgroundOpacity', item.settings.backgroundOpacity) +
				colorControl('Text color', 'settings.textColor', item.settings.textColor) +
				colorControl('Link color', 'settings.linkColor', item.settings.linkColor) +
				colorControl('Hover color', 'settings.hoverColor', item.settings.hoverColor) +
				textControl('Border bottom', 'settings.borderBottom', item.settings.borderBottom, 'Ex.: 1px solid #ddd') +
				textControl('Shadow', 'settings.shadow', item.settings.shadow, 'Ex.: 0 8px 24px rgba(0,0,0,.12)')
			) +
			formSection('Espacamento',
				boxSpacingControls('Padding', 'padding', item.settings) +
				boxSpacingControls('Margin', 'margin', item.settings) +
				textControl('Gap entre rows', 'settings.rowGap', item.settings.rowGap, 'Usado em Header/Nav/Section/Footer')
			) +
			formSection('Responsive',
				selectControl('Visibilidade', 'settings.visibility', item.settings.visibility, VISIBILITY_OPTIONS) +
				(includeOrder ? textControl('Ordem responsiva', 'settings.order', item.settings.order, 'Numero simples quando precisar') : '')
			);
		}

		function gapControls(item) {
			return '<div class="hc-lm-field hc-lm-inline-fields">' +
				'<label><span>Gap value</span><input type="number" step="1" min="0" value="' + escapeHtml(item.gapValue || '15') + '" data-path="gapValue"></label>' +
				'<label><span>Gap unit</span><select data-path="gapUnit">' + optionsHtml(GAP_UNIT_OPTIONS, item.gapUnit || 'px') + '</select></label>' +
				'<small>Com gap ativo, o valor inicial e 15px. Sem gap, o frontend aplica 0px.</small>' +
				'</div>';
		}

		function formSection(title, body) {
			return '<section class="hc-lm-form-section"><h4>' + escapeHtml(title) + '</h4>' + body + '</section>';
		}

		function boxSpacingControls(label, prefix, values) {
			return '<div class="hc-lm-field hc-lm-box-field">' +
				'<label>' + escapeHtml(label) + '</label>' +
				'<div class="hc-lm-box-grid">' +
				textMiniControl('Cima', 'settings.' + prefix + 'Top', values[prefix + 'Top']) +
				textMiniControl('Direita', 'settings.' + prefix + 'Right', values[prefix + 'Right']) +
				textMiniControl('Baixo', 'settings.' + prefix + 'Bottom', values[prefix + 'Bottom']) +
				textMiniControl('Esquerda', 'settings.' + prefix + 'Left', values[prefix + 'Left']) +
				'</div>' +
				selectControl('Unidade de ' + label.toLowerCase(), 'settings.' + prefix + 'Unit', values[prefix + 'Unit'] || 'rem', CSS_UNIT_OPTIONS) +
				'<small>Informe apenas numeros. Ex.: valor 2 com unidade rem vira 2rem. Campo vazio vira 0.</small>' +
				'</div>';
		}

		function textMiniControl(label, path, value) {
			return '<label class="hc-lm-mini-field"><span>' + escapeHtml(label) + '</span><input type="number" step="0.05" value="' + escapeHtml(value || '') + '" data-path="' + path + '"></label>';
		}

		function textControl(label, path, value, help) {
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><input type="text" value="' + escapeHtml(value) + '" data-path="' + path + '">' + (help ? '<small>' + escapeHtml(help) + '</small>' : '') + '</div>';
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

		function colorControl(label, path, value) {
			var color = /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000';
			return '<div class="hc-lm-field"><label>' + escapeHtml(label) + '</label><input type="color" value="' + escapeHtml(color) + '" data-path="' + path + '"><input type="text" value="' + escapeHtml(value || '') + '" data-path="' + path + '" placeholder="#d32f2f"></div>';
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
			return '<label class="hc-lm-check"><span>' + escapeHtml(label) + '</span><input type="checkbox" data-path="' + path + '"' + (checked ? ' checked' : '') + '></label>';
		}

		function addFromPalette(type) {
			if (ROOT_TYPES.indexOf(type) !== -1) {
				if (UNIQUE_ROOT_TYPES.indexOf(type) !== -1 && state.layout.items.some(function (item) { return item.type === type; })) {
					pushToast('info', PALETTE_MESSAGES[type] || (TYPE_LABELS[type] + ' ja existe no layout.'));
					return;
				}

				if (type === 'nav' && countBy(state.layout, function (item) { return item.type === 'column' && item.mainNavigation; })) {
					pushToast('warning', 'A navegacao principal ja foi definida em uma Column.');
					return;
				}

				var rootItem = createRoot(type);
				state.layout.items.push(rootItem);
				state.selectedId = rootItem.id;
				render();
				return;
			}

			var selected = state.selectedId ? findItem(state.layout, state.selectedId) : null;

			if (type === 'row' && selected && ROOT_TYPES.indexOf(selected.item.type) !== -1) {
				addRow(selected.item);
			}

			if (type === 'column' && selected) {
				addColumnNear(selected);
			}
		}

		function addFromPaletteToDrop(type, targetId) {
			var target = targetId ? findItem(state.layout, targetId) : null;

			if (ROOT_TYPES.indexOf(type) !== -1) {
				addFromPalette(type);
				return;
			}

			if (type === 'row') {
				if (target && ROOT_TYPES.indexOf(target.item.type) !== -1) {
					addRow(target.item);
					return;
				}

				if (target && target.parent && ROOT_TYPES.indexOf(target.parent.type) !== -1) {
					addRow(target.parent);
					return;
				}

				pushToast('info', 'Arraste Row para dentro de Header, Nav, Section ou Footer.');
				return;
			}

			if (type === 'column') {
				if (target && (target.item.type === 'row' || target.item.type === 'column')) {
					addColumnNear(target);
					return;
				}

				pushToast('info', 'Arraste Column para uma Row ou Column existente.');
			}
		}

		function addRow(item) {
			if ((item.type === 'header' || item.type === 'nav' || item.type === 'footer') && item.rows.length >= 1) {
				pushToast('warning', (TYPE_LABELS[item.type] || item.type) + ' aceita apenas uma Row.');
				return;
			}

			var row = createRow(item.title + ' row');
			item.rows.push(row);
			state.selectedId = row.id;
			render();
		}

		function addColumnNear(found) {
			var row = found.item.type === 'row' ? found.item : (found.parent && found.parent.type === 'row' ? found.parent : null);

			if (!row) {
				pushToast('info', 'Selecione uma Row ou Column para adicionar coluna.');
				return;
			}

			var column = createColumn('Column', '');
			row.columns.push(column);
			rebalanceRowColumns(row);
			state.selectedId = column.id;
			render();
		}

		function removeItem(id) {
			var found = findItem(state.layout, id);

			if (!found) {
				return;
			}

			if (found.item.type === 'row' && found.collection.length <= 1) {
				pushToast('warning', 'Essa area precisa manter pelo menos uma Row.');
				return;
			}

			if (found.item.type === 'column' && found.collection.length <= 1) {
				pushToast('warning', 'Essa Row precisa manter pelo menos uma Column.');
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

		function applyFieldChange(target, live) {
			var found = state.selectedId ? findItem(state.layout, state.selectedId) : null;
			var path = target.getAttribute('data-path');

			if (!found || !path) {
				return;
			}

			var value = target.type === 'checkbox' ? target.checked : target.value;

			if (path === 'componentArea' && value && flagExistsExcept(state.layout, found.item.id, 'componentArea')) {
				target.checked = false;
				pushToast('warning', 'Ja existe uma Component Area.');
				render();
				return;
			}

			if (path === 'mainNavigation' && value && state.layout.items.some(function (item) { return item.type === 'nav'; })) {
				target.checked = false;
				pushToast('warning', 'Remova a Section Nav antes de marcar Column como Main Navigation.');
				render();
				return;
			}

			if (path === 'mainNavigation' && value && flagExistsExcept(state.layout, found.item.id, 'mainNavigation')) {
				target.checked = false;
				pushToast('warning', 'A navegacao principal ja foi definida.');
				render();
				return;
			}

			setPath(found.item, path, value);

			sync();

			if (!live) {
				render();
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
			} else if (action === 'move-up') {
				moveItem(id, -1);
			} else if (action === 'move-down') {
				moveItem(id, 1);
			} else if (action === 'duplicate') {
				duplicateItem(id);
			} else if (action === 'reset') {
				state.layout = normalizeLayout(clone(defaultLayout), defaultLayout);
				state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;
				state.dismissedValidations = {};
				pushToast('info', 'Layout resetado para o padrao.');
				render();
			} else if (action === 'export') {
				jsonArea.value = JSON.stringify(state.layout, null, 2);
				jsonWrap.hidden = false;
			} else if (action === 'import') {
				jsonArea.value = '';
				jsonWrap.hidden = false;
				jsonArea.focus();
			} else if (action === 'apply-json') {
				state.layout = normalizeLayout(parseJson(jsonArea.value, state.layout), defaultLayout);
				state.selectedId = state.layout.site ? state.layout.site.id : SITE_ID;
				state.dismissedValidations = {};
				pushToast('info', 'JSON aplicado.');
				jsonWrap.hidden = true;
				render();
			} else if (action === 'close-json') {
				jsonWrap.hidden = true;
			} else if (action === 'open-media') {
				openMediaPicker(path || '');
			} else if (action === 'toggle-validations') {
				state.validationOpen = !state.validationOpen;
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

		settings.addEventListener('input', function (event) {
			if (!event.target.matches('[data-path]')) {
				return;
			}

			applyFieldChange(event.target, event.target.type !== 'checkbox' && event.target.tagName !== 'SELECT');
		});

		settings.addEventListener('change', function (event) {
			if (!event.target.matches('[data-path]')) {
				return;
			}

			applyFieldChange(event.target, false);
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
			canvas.querySelectorAll('.is-drag-over').forEach(function (node) {
				node.classList.remove('is-drag-over');
			});
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

			if (state.draggingPaletteType) {
				event.preventDefault();
				canvas.classList.add('is-palette-over');

				if (node) {
					node.classList.add('is-drag-over');
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
				node.classList.remove('is-drag-over');
			}
		});

		canvas.addEventListener('drop', function (event) {
			var node = event.target.closest('[data-node-id]');

			if (state.draggingPaletteType) {
				event.preventDefault();
				addFromPaletteToDrop(state.draggingPaletteType, node ? node.getAttribute('data-node-id') : '');
				state.draggingPaletteType = '';
				canvas.classList.remove('is-palette-over');
				canvas.querySelectorAll('.is-drag-over').forEach(function (item) {
					item.classList.remove('is-drag-over');
				});
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
			canvas.querySelectorAll('.is-drag-over').forEach(function (node) {
				node.classList.remove('is-drag-over');
			});
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
