/* =====================================================================
   ui / views / view-grid.js  —  video grid + filter state
   ---------------------------------------------------------------------
   Owns the filter/sort STATE and renders the video grid in <main>.
   Card clicks are delegated to view-modal.js.

   KEY FIX: Uses EVENT DELEGATION for chip clicks instead of attaching
   listeners to individual chips. This means chips ALWAYS work even after
   re-rendering (e.g. on language change), with no timing issues.

   Re-renders on 'cf:lang-change'. Re-wires on 'cf:nav-rendered' is NOT
   needed because delegation is set up once on the nav container.
   ===================================================================== */

(function () {
    'use strict';

    var CF = window.CyfrowaFilmoteka;
    if (!CF || !CF.site || !CF.videos) {
        console.error('[view-grid.js] config/*.js / data/db-videos.js must load before view-grid.js');
        return;
    }
    var site = CF.site;
    var vlib = CF.videosLib;
    var fmt  = CF.format;
    var lbl  = CF.labels;
    var t    = CF.i18nLib.t.bind(CF.i18nLib);


    /* -----------------------------------------------------------------
       STATE
       ----------------------------------------------------------------- */
    var state = {
        query: '',
        sort: 'newest',
        types: new Set(),
        platforms: new Set(),
        channels: new Set(),
        categories: new Set(),
        languages: new Set(),
        categorySearch: ''   /* category filter text search */
    };

    var sortModule = site.nav.modules.find(function (m) { return m.type === 'select'; });
    if (sortModule && sortModule.default) state.sort = sortModule.default;


    /* -----------------------------------------------------------------
       INIT
       ----------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        wireDelegation();
        wireGridClick();
        update();
    });

    /* re-render on language change (preserves filter state + sort) */
    document.addEventListener('cf:lang-change', function () {
        var sel = document.getElementById('nav-searchsort-input');
        var savedSort = sel ? sel.value : state.sort;
        /* small delay to let view-render.js finish re-rendering nav */
        setTimeout(function () {
            restoreSearchAndSort();
            restoreActiveChips();
            update();
        }, 50);
    });


    /* =================================================================
       WIRING — uses EVENT DELEGATION for robustness
       ================================================================= */

    /**
     * Set up event delegation on the nav container. This handles ALL
     * chip clicks, search input, and sort changes — no matter how many
     * times the nav HTML is re-rendered.
     */
    function wireDelegation() {
        var nav = document.getElementById('navContent');
        if (!nav) return;

        /* chip clicks (delegated) */
        nav.addEventListener('click', function (e) {
            var chip = e.target.closest('.nav-chip');
            if (!chip) return;
            handleChipClick(chip);
        });

        /* search input (delegated) */
        nav.addEventListener('input', function (e) {
            if (e.target.id === 'nav-searchbar-input') {
                state.query = e.target.value;
                update();
            }
            /* category chip search (filters chip visibility, not videos) */
            if (e.target.classList && e.target.classList.contains('nav-chip-search')) {
                state.categorySearch = e.target.value;
                /* the actual chip filtering is handled by view-render.js,
                   but we re-run it here in case chips were re-rendered */
            }
        });

        /* sort change (delegated) */
        nav.addEventListener('change', function (e) {
            if (e.target.id === 'nav-searchsort-input') {
                state.sort = e.target.value;
                update();
            }
        });
    }

    function handleChipClick(chip) {
        var group = chip.getAttribute('data-chip-group');
        var value = chip.getAttribute('data-chip-value');
        var set = setForGroup(group);
        if (!set) return;

        if (set.has(value)) {
            set.delete(value);
            chip.classList.remove('active');
        } else {
            set.add(value);
            chip.classList.add('active');
        }
        update();
    }

    function setForGroup(group) {
        if (group === 'nav-searchtype')      return state.types;
        if (group === 'nav-searchplatform')  return state.platforms;
        if (group === 'nav-searchchannel')   return state.channels;
        if (group === 'nav-searchcategory')  return state.categories;
        if (group === 'nav-searchlanguage')  return state.languages;
        return null;
    }

    function restoreSearchAndSort() {
        var input = document.getElementById('nav-searchbar-input');
        if (input) input.value = state.query;
        var sel = document.getElementById('nav-searchsort-input');
        if (sel) sel.value = state.sort;
        /* restore category chip search */
        var catSearch = document.getElementById('nav-searchcategory-search');
        if (catSearch) {
            catSearch.value = state.categorySearch;
            /* re-trigger the filter */
            catSearch.dispatchEvent(new Event('input'));
        }
    }

    function restoreActiveChips() {
        document.querySelectorAll('.nav-chip').forEach(function (chip) {
            var group = chip.getAttribute('data-chip-group');
            var value = chip.getAttribute('data-chip-value');
            var set = setForGroup(group);
            if (set && set.has(value)) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    function wireGridClick() {
        var main = document.getElementById('mainContent');
        if (!main) return;
        main.addEventListener('click', function (e) {
            var card = e.target.closest('.video-card');
            if (!card) return;
            var id = card.getAttribute('data-video-id');
            var v = vlib.findVideoById(id);
            if (v && CF.openModal) CF.openModal(v);
        });
    }

    function wireClear() {
        var btn = document.getElementById('clearFilters');
        if (!btn) return;
        btn.addEventListener('click', clearAll);
    }

    function clearAll() {
        state.query = '';
        state.types.clear();
        state.platforms.clear();
        state.channels.clear();
        state.categories.clear();
        state.languages.clear();
        state.categorySearch = '';

        var input = document.getElementById('nav-searchbar-input');
        if (input) input.value = '';

        var catSearch = document.getElementById('nav-searchcategory-search');
        if (catSearch) {
            catSearch.value = '';
            catSearch.dispatchEvent(new Event('input'));
        }

        var sel = document.getElementById('nav-searchsort-input');
        if (sel) {
            sel.value = sortModule && sortModule.default ? sortModule.default : 'newest';
            state.sort = sel.value;
        }

        document.querySelectorAll('.nav-chip.active').forEach(function (c) {
            c.classList.remove('active');
        });

        update();
    }


    /* =================================================================
       RENDER
       ================================================================= */
    function update() {
        var el = document.getElementById('mainContent');
        if (!el) return;

        var filtered = vlib.sortVideos(vlib.filterVideos(state), state.sort);
        var active = isFilterActive();

        el.innerHTML = renderResultsBar(filtered.length, active) + renderGrid(filtered);
        wireClear();
    }

    function renderResultsBar(count, active) {
        var copy = site.main;
        var total = CF.videos.length;
        var html = '<div class="results-bar">';
        html += '<span class="results-text">' +
                    esc(t(copy.resultsPrefixKey)) + ' ' + count + ' ' +
                    esc(t(copy.resultsOfKey)) + ' ' + total + ' ' +
                    esc(t(copy.resultsSuffixKey)) +
                '</span>';
        if (active) {
            html += '<button type="button" class="clear-btn" id="clearFilters">' +
                        esc(t(copy.clearLabelKey)) +
                    '</button>';
        }
        html += '</div>';
        return html;
    }

    function renderGrid(list) {
        if (list.length === 0) return renderEmpty();
        var html = '<div class="video-grid">';
        list.forEach(function (v) { html += renderCard(v); });
        html += '</div>';
        return html;
    }

    function renderCard(v) {
        var lang = CF.i18nLib.getCurrentLang();
        var title = vlib.getLocalizedTitle(v, lang);
        var thumb = vlib.getThumbnail(v);
        var thumbHtml = thumb
            ? '<img class="video-thumb" src="' + esc(thumb) + '" alt="" loading="lazy" ' +
              'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
              '<div class="video-thumb-notfound" style="display:none">' + esc(t('card.notFound')) + '</div>'
            : '<div class="video-thumb-notfound">' + esc(t('card.notFound')) + '</div>';

        /* DEDUPED platform badges — 2 YouTube sources show "YouTube" once */
        var platforms = vlib.uniquePlatforms(v);
        var platformBadges = platforms.map(function (p) {
            return '<span class="video-platform-badge platform-' + esc(p) + '">' +
                        esc(lbl.labelForPlatform(p)) +
                   '</span>';
        }).join('');

        var typeBadges = (v.types || []).map(function (tt) {
            return '<span class="video-type-badge">' + esc(lbl.labelForType(tt)) + '</span>';
        }).join('');

        /* categories — now an array, show all as badges */
        var categoryBadges = (v.categories || []).map(function (c) {
            return '<span class="video-category-badge">' + esc(lbl.labelForCategory(c)) + '</span>';
        }).join('');

        var primaryChannel = lbl.labelForChannel((v.sources || [])[0].channel);

        return '<article class="video-card" data-video-id="' + esc(v.id) + '">' +
            '<div class="video-thumb-area">' +
                thumbHtml +
                '<div class="video-card-top">' +
                    '<span class="video-platforms-row">' + platformBadges + '</span>' +
                    '<span class="video-duration">' + esc(fmt.formatDuration(v.duration)) + '</span>' +
                '</div>' +
            '</div>' +
            '<h3 class="video-title">' + esc(title) + '</h3>' +
            '<div class="video-types">' + typeBadges + '</div>' +
            '<div class="video-meta-bottom">' +
                '<span class="video-channel">' + esc(primaryChannel) + '</span>' +
                '<span class="video-date">' + esc(fmt.formatDate(v.date)) + '</span>' +
            '</div>' +
            (categoryBadges ? '<div class="video-category-row">' + categoryBadges + '</div>' : '') +
        '</article>';
    }

    function renderEmpty() {
        var copy = site.main;
        var lines = copy.emptyLineKeys.map(function (key) {
            return '<p class="empty-line">' + esc(t(key)) + '</p>';
        }).join('');
        return '<div class="main-empty">' +
                    '<div class="empty-bracket">[</div>' +
                    '<div class="empty-body">' +
                        '<h2 class="empty-title">' + esc(t(copy.emptyTitleKey)) + '</h2>' +
                        lines +
                    '</div>' +
                    '<div class="empty-bracket">]</div>' +
               '</div>';
    }

    function esc(s) { return fmt.esc(s); }


    /* =================================================================
       HELPERS
       ================================================================= */
    function isFilterActive() {
        return state.query.trim() !== '' ||
               state.types.size > 0 ||
               state.platforms.size > 0 ||
               state.channels.size > 0 ||
               state.categories.size > 0 ||
               state.languages.size > 0;
    }


    console.log('%c\u25B6 view-grid.js :: grid ready (event delegation)', 'color:#39ff14;');
})();
