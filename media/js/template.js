/**
 * HC Carlix - template.js
 *
 * Tres recursos independentes (cada um com seu próprio guard):
 *   - Offcanvas mobile (toggle, backdrop, submenu, focus-trap, ESC)
 *   - Botão voltar-ao-topo
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
		var toggles = document.querySelectorAll('.carlix-menu-toggle');
		var toggle = toggles[0];
		var panel = document.querySelector('.carlix-offcanvas');
		var backdrop = document.querySelector('.carlix-offcanvas-backdrop');
		var closeButtons = document.querySelectorAll('[data-carlix-offcanvas-close]');
		var desktopQuery = window.matchMedia('(min-width: 1024px)');
		var keepDesktopOffcanvas = body.classList.contains('carlix-nav-type-offcanvas') || body.classList.contains('carlix-nav-type-menu-offcanvas');
		var closeOnClick = !panel || panel.getAttribute('data-carlix-close-on-click') !== '0';
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
			toggles.forEach(function (item) {
				item.setAttribute('aria-expanded', 'true');
			});

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
			toggles.forEach(function (item) {
				item.setAttribute('aria-expanded', 'false');
			});
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
		toggles.forEach(function (item) {
			item.addEventListener('click', toggleMenu);
		});

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

			if (closeOnClick && event.target.closest('a[href]')) {
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
				if (!keepDesktopOffcanvas && event.matches && body.classList.contains('carlix-offcanvas-open')) {
					closeMenu();
				}
			});
		}
	}

	/* ===================== MENU DESKTOP POR CLIQUE ===================== */
	function initDesktopMenus() {
		var desktopQuery = window.matchMedia('(min-width: 1024px)');
		var triggerSelector = '.has-submenu > a, .has-submenu > .mod-menu__heading, .has-submenu > .mod-menu__separator';
		var menus = document.querySelectorAll('.carlix-menu[data-carlix-menu-interaction="click"]');

		if (!menus.length) {
			return;
		}

		function closeSiblings(menu, item) {
			menu.querySelectorAll('.submenu-open').forEach(function (current) {
				if (current !== item && !current.contains(item)) {
					current.classList.remove('submenu-open');
					var currentTrigger = current.querySelector(':scope > a, :scope > .mod-menu__heading, :scope > .mod-menu__separator');

					if (currentTrigger) {
						currentTrigger.setAttribute('aria-expanded', 'false');
					}
				}
			});
		}

		menus.forEach(function (menu) {
			menu.querySelectorAll(triggerSelector).forEach(function (trigger) {
				var item = trigger.parentElement;

				if (!item || !item.querySelector(':scope > .carlix-nav-sub')) {
					return;
				}

				trigger.setAttribute('aria-expanded', 'false');
			});

			menu.addEventListener('click', function (event) {
				if (!desktopQuery.matches) {
					return;
				}

				var trigger = event.target.closest(triggerSelector);

				if (!trigger || !menu.contains(trigger)) {
					return;
				}

				var item = trigger.parentElement;

				if (!item || !item.querySelector(':scope > .carlix-nav-sub')) {
					return;
				}

				event.preventDefault();
				closeSiblings(menu, item);

				var opened = item.classList.toggle('submenu-open');
				trigger.setAttribute('aria-expanded', opened ? 'true' : 'false');
			});
		});

		document.addEventListener('click', function (event) {
			if (!desktopQuery.matches) {
				return;
			}

			menus.forEach(function (menu) {
				if (menu.contains(event.target)) {
					return;
				}

				menu.querySelectorAll('.submenu-open').forEach(function (item) {
					item.classList.remove('submenu-open');
					var trigger = item.querySelector(':scope > a, :scope > .mod-menu__heading, :scope > .mod-menu__separator');

					if (trigger) {
						trigger.setAttribute('aria-expanded', 'false');
					}
				});
			});
		});
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
			var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('carlix-reduce-motion');
			var smooth = document.body.classList.contains('carlix-smooth-scroll');
			window.scrollTo({ top: 0, behavior: reduce || !smooth ? 'auto' : 'smooth' });
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
		var scrollBehavior = header.getAttribute('data-carlix-header-behavior') || 'always';
		var body = document.body;
		var ticking = false;
		var lastScrollY = window.scrollY;
		var stickyLogoImages = document.querySelectorAll('[data-carlix-sticky-logo]');
		var canUseStickyLogo = behavior === 'sticky' || behavior === 'fixed' || behavior === 'floating';

		function setOffset() {
			body.style.setProperty('--carlix-header-h', header.offsetHeight + 'px');
		}

		function swapPictureSources(img, stickySrc, active) {
			var picture = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null;

			if (!picture) {
				return;
			}

			picture.querySelectorAll('source').forEach(function (source) {
				if (!source.dataset.carlixDefaultSrcset) {
					source.dataset.carlixDefaultSrcset = source.getAttribute('srcset') || '';
				}

				if (active) {
					source.setAttribute('srcset', stickySrc);
				} else if (source.dataset.carlixDefaultSrcset) {
					source.setAttribute('srcset', source.dataset.carlixDefaultSrcset);
				} else {
					source.removeAttribute('srcset');
				}
			});
		}

		function setStickyLogo(active) {
			stickyLogoImages.forEach(function (img) {
				var stickySrc = img.getAttribute('data-carlix-sticky-logo');

				if (!stickySrc) {
					return;
				}

				if (!img.dataset.carlixDefaultSrc) {
					img.dataset.carlixDefaultSrc = img.getAttribute('src') || '';
				}

				if (!img.dataset.carlixDefaultSrcset) {
					img.dataset.carlixDefaultSrcset = img.getAttribute('srcset') || '';
				}

				swapPictureSources(img, stickySrc, active);

				if (active) {
					img.setAttribute('src', stickySrc);
					img.removeAttribute('srcset');
					return;
				}

				if (img.dataset.carlixDefaultSrc) {
					img.setAttribute('src', img.dataset.carlixDefaultSrc);
				}

				if (img.dataset.carlixDefaultSrcset) {
					img.setAttribute('srcset', img.dataset.carlixDefaultSrcset);
				}
			});
		}

		function setScrolled() {
			ticking = false;
			var currentY = window.scrollY;
			var goingDown = currentY > lastScrollY && currentY > header.offsetHeight;

			body.classList.toggle('carlix-header-scrolled', currentY > 12);
			body.classList.toggle('carlix-header-is-hidden', scrollBehavior === 'hide-down-show-up' && goingDown);
			setStickyLogo(canUseStickyLogo && currentY > 12);
			lastScrollY = currentY;
		}

		if (behavior === 'fixed') {
			body.classList.add('carlix-header-is-fixed');
			body.classList.toggle('carlix-header-overlay-content', header.classList.contains('carlix-header--overlay'));
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
		initDesktopMenus();
		initBackToTop();
		initHeaderState();
	});
})();
