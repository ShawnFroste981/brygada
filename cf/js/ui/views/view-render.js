/* =====================================================================
   ui / views / view-render.js  —  render header / nav / footer
   ---------------------------------------------------------------------
   Reads config/*.js configs and builds the inner HTML of every section.
   All text goes through i18nLib.t(). Re-renders on 'cf:lang-change'.
   Nav sections marked `collapsible: true` get a click-to-expand label.
   Sections with `defaultCollapsed: true` start collapsed.
   Sections with `searchable: true` get a text search field above the chips.
   ===================================================================== */

(function () {
    'use strict';

    var CF = window.CyfrowaFilmoteka;
    if (!CF || !CF.site || !CF.i18nLib) {
        console.error('[view-render.js] config/*.js + util-i18n.js must load before view-render.js');
        return;
    }
    var site = CF.site;
    var t = CF.i18nLib.t.bind(CF.i18nLib);
    var esc = CF.format.esc;

    document.addEventListener('DOMContentLoaded', function () {
        renderHeader();
        renderNav();
        renderFooter();
    });

    document.addEventListener('cf:lang-change', function () {
        renderHeader();
        renderNav();
        renderFooter();
    });


    /* =================================================================
       HEADER
       ================================================================= */
    function renderHeader() {
        var el = document.getElementById('headerContent');
        if (!el) return;
        var h = site.header;

        el.innerHTML =
            '<div class="header-brand">' +
                '<span class="brand-tape">' + esc(h.brandGlyphs.left) + '</span>' +
                '<h1 class="header-title">' + esc(t(h.titleKey)) + '</h1>' +
                '<span class="brand-tape">' + esc(h.brandGlyphs.right) + '</span>' +
            '</div>' +
            '<p class="header-sub">' + esc(t(h.subtitleKey)) + '</p>';

        var strip = document.querySelector('.header-strip .strip-text');
        if (strip) strip.textContent = t('strip.header');
    }


    /* =================================================================
       NAV
       ================================================================= */
    function renderNav() {
        var el = document.getElementById('navContent');
        if (!el) return;
        var n = site.nav;

        var html = '<div class="nav-title">' + esc(t(n.titleKey)) + '</div>';

        n.modules.forEach(function (m) {
            var collapsible = m.collapsible !== false;
            var collapsedCls = (collapsible && m.defaultCollapsed) ? ' nav-module-collapsed' : '';
            var collapsibleCls = collapsible ? ' nav-module-collapsible' : '';
            html += '<div class="nav-module' + collapsibleCls + collapsedCls + '" id="' + esc(m.id) + '">';

            if (collapsible) {
                html += '<div class="nav-module-label nav-module-toggle" data-toggle-module="' + esc(m.id) + '">' +
                            '<span class="nav-collapse-arrow">\u25BC</span>' +
                            '<span>' + esc(t(m.labelKey)) + '</span>' +
                        '</div>';
            } else {
                html += '<div class="nav-module-label">&gt; ' + esc(t(m.labelKey)) + '</div>';
            }

            html += '<div class="nav-module-body">';

            if (m.type === 'search')        html += renderSearch(m);
            else if (m.type === 'select')   html += renderSelect(m);
            else if (m.type === 'chips') {
                if (m.searchable) html += renderChipSearch(m);
                html += renderChips(m);
            }

            html += '</div></div>';
        });

        el.innerHTML = html;

        var strip = document.querySelector('.nav-strip .strip-text');
        if (strip) strip.textContent = t('strip.nav');

        wireCollapseToggles();
        wireChipSearches();
        document.dispatchEvent(new CustomEvent('cf:nav-rendered'));
    }

    function renderSearch(m) {
        return '<input type="text" class="nav-search-input" id="' + esc(m.id) + '-input" ' +
               'placeholder="' + esc(t(m.placeholderKey)) + '" autocomplete="off" spellcheck="false">';
    }

    /** Render the category search field (filters chips by text). */
    function renderChipSearch(m) {
        return '<input type="text" class="nav-search-input nav-chip-search" ' +
               'id="' + esc(m.id) + '-search" ' +
               'data-chip-search-group="' + esc(m.id) + '" ' +
               'placeholder="' + esc(t(m.searchPlaceholderKey)) + '" ' +
               'autocomplete="off" spellcheck="false">';
    }

    function renderSelect(m) {
        var html = '<select class="nav-sort-select" id="' + esc(m.id) + '-input">';
        m.options.forEach(function (o) {
            var sel = (o.value === m.default) ? ' selected' : '';
            html += '<option value="' + esc(o.value) + '"' + sel + '>' + esc(t(o.labelKey)) + '</option>';
        });
        html += '</select>';
        return html;
    }

    function renderChips(m) {
        var html = '<div class="nav-chips" id="' + esc(m.id) + '-chips">';
        m.chips.forEach(function (c) {
            var label = c.labelKey ? t(c.labelKey) : (c.label || c.value);
            html += '<button type="button" class="nav-chip" ' +
                        'data-chip-group="' + esc(m.id) + '" ' +
                        'data-chip-value="' + esc(c.value) + '" ' +
                        'data-chip-label="' + esc(label.toLowerCase()) + '">' +
                        esc(label) +
                    '</button>';
        });
        html += '</div>';
        return html;
    }

    function wireCollapseToggles() {
        document.querySelectorAll('.nav-module-toggle').forEach(function (label) {
            label.addEventListener('click', function () {
                label.parentElement.classList.toggle('nav-module-collapsed');
            });
        });
    }

    /** Wire the category search field — filters chips by their label text. */
    function wireChipSearches() {
        document.querySelectorAll('.nav-chip-search').forEach(function (input) {
            input.addEventListener('input', function () {
                var groupId = input.getAttribute('data-chip-search-group');
                var q = input.value.trim().toLowerCase();
                var chips = document.querySelectorAll(
                    '#' + groupId + '-chips .nav-chip'
                );
                chips.forEach(function (chip) {
                    var label = chip.getAttribute('data-chip-label') || '';
                    /* keep chip visible if its label matches OR if it's active */
                    var matches = label.indexOf(q) !== -1;
                    var isActive = chip.classList.contains('active');
                    chip.style.display = (matches || isActive) ? '' : 'none';
                });
            });
        });
    }


    /* =================================================================
       FOOTER
       ================================================================= */
    function renderFooter() {
        var el = document.getElementById('footerContent');
        if (!el) return;
        var f = site.footer;

        el.innerHTML =
            '<span class="footer-item footer-brand">' + esc(t(f.brandKey)) + '</span>' +
            '<span class="footer-sep">//</span>' +
            '<span class="footer-item footer-author">' + esc(t(f.authorKey)) + '</span>' +
            '<span class="footer-sep">//</span>' +
            '<span class="footer-item">' + esc(t(f.timeLabelKey)) + ': ' +
                '<span id="footerClock" class="footer-clock">--:--:--</span>' +
            '</span>' +
            '<span class="footer-sep">//</span>' +
            '<span class="footer-item footer-status">[ ' + esc(t(f.recLabelKey)) +
                ' <span class="rec-dot"></span> ]</span>';

        var strip = document.querySelector('.footer-strip .strip-text');
        if (strip) strip.textContent = t('strip.footer');
    }


    console.log('%c\u25B6 view-render.js :: site rendered', 'color:#39ff14;');
})();
