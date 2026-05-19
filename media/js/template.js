/**
 * HC Carlix - template.js
 *
 * Tres recursos independentes (cada um com seu proprio guard):
 *   - Offcanvas mobile (toggle, backdrop, submenu, focus-trap, ESC)
 *   - Botao voltar-ao-topo
 *   - Compensacao do header fixo
 */
(function () {
	'use strict';

	function onReady(fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn, { once: true });
		}
	}

	/* ===================== OFFCANVAS ===================== */
	function initOffcanvas() {
		var body = document.body;
		var toggle = document.querySelector('.carlix-menu-toggle');
		var panel = document.querySelector('.carlix-offcanvas');
		var backdrop = document.querySelector('.carlix-offcanvas-backdrop');
		var closeButtons = document.querySelectorAll('[data-carlix-offcanvas-close]');
		var desktopQuery = window.matchMedia('(min-width: 1024px)');
		var lastFocus = null;
		var submenuTriggerSelector = '.has-submenu > a, .has-submenu > .mod-menu__heading, .has-submenu > .mod-menu__separator';

		if (!toggle || !panel || !backdrop) {
			return;
		}

		function getFocusable() {
			return Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
				.filter(function (item) {
					return item.offsetParent !== null;
				});
		}

		function openMenu() {
			lastFocus = document.activeElement;
			backdrop.hidden = false;
			body.classList.add('carlix-offcanvas-open');
			panel.setAttribute('aria-hidden', 'false');
			toggle.setAttribute('aria-expanded', 'true');

			var focusable = getFocusable();
			if (focusable.length) {
				focusable[0].focus();
			}
		}

		function closeAllSubmenus() {
			panel.querySelectorAll('.submenu-open').forEach(function (item) {
				item.classList.remove('submenu-open');
			});

			panel.querySelectorAll(submenuTriggerSelector).forEach(function (trigger) {
				trigger.setAttribute('aria-expanded', 'false');
			});
		}

		function closeMenu() {
			body.classList.remove('carlix-offcanvas-open');
			panel.setAttribute('aria-hidden', 'true');
			toggle.setAttribute('aria-expanded', 'false');
			backdrop.hidden = true;
			closeAllSubmenus();

			if (lastFocus && typeof lastFocus.focus === 'function') {
				lastFocus.focus();
			}
		}

		function toggleMenu() {
			if (body.classList.contains('carlix-offcanvas-open')) {
				closeMenu();
			} else {
				openMenu();
			}
		}

		function setupSubmenus() {
			panel.querySelectorAll(submenuTriggerSelector).forEach(function (trigger) {
				var item = trigger.parentElement;

				if (!item || !item.querySelector(':scope > .carlix-nav-sub')) {
					return;
				}

				trigger.setAttribute('aria-expanded', 'false');

				if (!trigger.matches('a[href]')) {
					trigger.setAttribute('role', 'button');
					trigger.setAttribute('tabindex', '0');
				}
			});
		}

		function toggleSubmenu(trigger) {
			var item = trigger.parentElement;

			if (!item) {
				return;
			}

			var isOpen = item.classList.toggle('submenu-open');
			trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		}

		setupSubmenus();
		toggle.addEventListener('click', toggleMenu);

		closeButtons.forEach(function (button) {
			button.addEventListener('click', closeMenu);
		});

		panel.addEventListener('click', function (event) {
			var submenuTrigger = event.target.closest(submenuTriggerSelector);

			if (submenuTrigger && panel.contains(submenuTrigger)) {
				event.preventDefault();
				toggleSubmenu(submenuTrigger);
				return;
			}

			if (event.target.closest('a[href]')) {
				closeMenu();
			}
		});

		panel.addEventListener('keydown', function (event) {
			var submenuTrigger = event.target.closest(submenuTriggerSelector);

			if (!submenuTrigger || !panel.contains(submenuTrigger)) {
				return;
			}

			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				toggleSubmenu(submenuTrigger);
			}
		});

		document.addEventListener('keydown', function (event) {
			if (!body.classList.contains('carlix-offcanvas-open')) {
				return;
			}

			if (event.key === 'Escape') {
				closeMenu();
				return;
			}

			if (event.key !== 'Tab') {
				return;
			}

			var focusable = getFocusable();
			if (!focusable.length) {
				return;
			}

			var first = focusable[0];
			var last = focusable[focusable.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		});

		if (typeof desktopQuery.addEventListener === 'function') {
			desktopQuery.addEventListener('change', function (event) {
				if (event.matches && body.classList.contains('carlix-offcanvas-open')) {
					closeMenu();
				}
			});
		}
	}

	/* ===================== VOLTAR AO TOPO ===================== */
	function initBackToTop() {
		var btn = document.querySelector('[data-carlix-to-top]');
		if (!btn) {
			return;
		}

		var shown = false;
		var ticking = false;

		function apply() {
			ticking = false;
			var show = window.scrollY > 400;

			if (show === shown) {
				return;
			}

			shown = show;

			if (show) {
				btn.hidden = false;
				window.requestAnimationFrame(function () {
					btn.classList.add('is-visible');
				});
			} else {
				btn.classList.remove('is-visible');
				window.setTimeout(function () {
					if (!shown) {
						btn.hidden = true;
					}
				}, 220);
			}
		}

		function onScroll() {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(apply);
			}
		}

		btn.addEventListener('click', function () {
			var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
		});

		window.addEventListener('scroll', onScroll, { passive: true });
		apply();
	}

	/* ===================== HEADER FIXO / FLUTUANTE ===================== */
	function initHeaderState() {
		var header = document.querySelector('[data-carlix-header]');
		if (!header) {
			return;
		}

		var behavior = header.getAttribute('data-carlix-header') || 'sticky';
		var body = document.body;
		var ticking = false;

		function setOffset() {
			body.style.setProperty('--carlix-header-h', header.offsetHeight + 'px');
		}

		function setScrolled() {
			ticking = false;
			body.classList.toggle('carlix-header-scrolled', window.scrollY > 12);
		}

		if (behavior === 'fixed') {
			body.classList.add('carlix-header-is-fixed');
			setOffset();
			window.addEventListener('resize', setOffset, { passive: true });
		}

		if (behavior === 'floating' || behavior === 'sticky' || behavior === 'fixed') {
			window.addEventListener('scroll', function () {
				if (!ticking) {
					ticking = true;
					window.requestAnimationFrame(setScrolled);
				}
			}, { passive: true });
			setScrolled();
		}
	}

	onReady(function () {
		initOffcanvas();
		initBackToTop();
		initHeaderState();
	});
})();
