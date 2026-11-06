/* =====================================================================
   ui / behaviour / behaviour-layout.js
   ---------------------------------------------------------------------
   - i18n init (must run before any rendering)
   - Theme toggle (dark / light, persisted)
   - Language toggle (EN / PL, persisted)
   - Collapse-to-strip area toggles (header / nav / footer)
   - Footer clock (HH:MM:SS, survives re-renders)
   - Keyboard shortcuts (H/N/F toggle areas)
   - Mobile: auto-collapse nav on small screens
   ===================================================================== */

(function () {
    'use strict';

    var CF = window.CyfrowaFilmoteka;
    var i18n = CF.i18nLib;

    /* 1. i18n INIT */
    i18n.init();

    /* 2. THEME TOGGLE */
    var THEME_KEY = 'cf-theme';
    var themeBtn = document.getElementById('themeToggle');
    var themeIcon = document.getElementById('themeIcon');

    function getCurrentTheme() {
        var saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
        return saved || 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) themeIcon.textContent = theme === 'light' ? '\u25D1' : '\u25D0';
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }

    applyTheme(getCurrentTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    /* 3. LANGUAGE TOGGLE */
    var langBtn = document.getElementById('langToggle');
    var langLabel = document.getElementById('langLabel');

    function updateLangLabel() {
        if (langLabel) langLabel.textContent = i18n.getCurrentLang().toUpperCase();
    }

    updateLangLabel();
    document.addEventListener('cf:lang-change', function () {
        updateLangLabel();
        setTimeout(startClock, 100);
    });

    if (langBtn) {
        langBtn.addEventListener('click', function () { i18n.toggleLang(); });
    }

    /* 4. COLLAPSE / EXPAND AREA TOGGLES */
    function initToggles() {
        document.querySelectorAll('.toggle[data-target]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var area = document.getElementById(btn.getAttribute('data-target'));
                if (!area) return;
                area.classList.toggle('collapsed');
                updateToggleIcon(btn, area.classList.contains('collapsed'));
            });
        });
    }

    function updateToggleIcon(btn, isCollapsed) {
        var icon = btn.querySelector('.toggle-icon');
        if (!icon) return;
        icon.textContent = isCollapsed
            ? icon.getAttribute('data-icon-collapsed')
            : icon.getAttribute('data-icon-expanded');
    }

    /* 5. MOBILE — auto-collapse nav */
    function handleMobileNav() {
        var nav = document.getElementById('nav');
        if (!nav) return;
        if (window.innerWidth <= 768) {
            if (!nav.classList.contains('collapsed')) {
                nav.classList.add('collapsed');
                var toggle = document.querySelector('.toggle-nav');
                if (toggle) updateToggleIcon(toggle, true);
            }
        }
    }

    /* 6. FOOTER CLOCK */
    var clockInterval = null;

    function startClock() {
        if (clockInterval) clearInterval(clockInterval);
        function tick() {
            var clock = document.getElementById('footerClock');
            if (!clock) return;
            var now = new Date();
            clock.textContent =
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');
        }
        tick();
        clockInterval = setInterval(tick, 1000);
    }

    /* 7. KEYBOARD SHORTCUTS */
    document.addEventListener('keydown', function (e) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        var map = { h: 'header', n: 'nav', f: 'footer' };
        var key = e.key.toLowerCase();
        if (map[key]) {
            var btn = document.querySelector('.toggle[data-target="' + map[key] + '"]');
            if (btn) btn.click();
        }
    });

    /* 8. INIT */
    document.addEventListener('DOMContentLoaded', function () {
        initToggles();
        handleMobileNav();
        startClock();
        window.addEventListener('resize', handleMobileNav);
    });

    console.log('%c\u25B6 behaviour-layout.js :: layout ready', 'color:#39ff14;');
})();
