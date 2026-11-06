/* =====================================================================
   ui / views / view-modal.js  —  video detail modal
   ---------------------------------------------------------------------
   MODAL LAYOUT (top to bottom):
     1. Thumbnail (or NOT FOUND)
     2. Title (localized)
     3. Meta row: date / duration / category / language / sources
     4. WATCH ON    ← platform selection (immediately accessible)
     5. Channels
     6. Description (localized)
     7. Types
     8. Tags

   Close: click backdrop, click × button, or press Esc.
   ===================================================================== */

(function () {
    'use strict';

    var CF = window.CyfrowaFilmoteka;
    if (!CF || !CF.site || !CF.i18nLib) {
        console.error('[view-modal.js] config/*.js + util-i18n.js must load before view-modal.js');
        return;
    }
    var site = CF.site;
    var vlib = CF.videosLib;
    var fmt  = CF.format;
    var lbl  = CF.labels;
    var t    = CF.i18nLib.t.bind(CF.i18nLib);

    var backdrop = null;
    var currentVideo = null;


    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('modalRoot');
        if (!container) {
            console.error('[view-modal.js] #modalRoot not found');
            return;
        }

        container.innerHTML =
            '<div class="modal-backdrop" id="modalBackdrop">' +
                '<div class="modal" id="modalBox" role="dialog" aria-modal="true">' +
                    '<button class="modal-close" id="modalClose" type="button" aria-label="Close">&times;</button>' +
                    '<div class="modal-body" id="modalBody"></div>' +
                '</div>' +
            '</div>';

        backdrop = document.getElementById('modalBackdrop');
        document.getElementById('modalClose').addEventListener('click', closeModal);
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen()) closeModal();
        });

        CF.openModal = openModal;
        console.log('%c\u25B6 view-modal.js :: modal ready', 'color:#39ff14;');
    });

    document.addEventListener('cf:lang-change', function () {
        if (isOpen() && currentVideo) {
            document.getElementById('modalBody').innerHTML = renderModal(currentVideo);
        }
    });


    function openModal(video) {
        if (!video || !backdrop) return;
        currentVideo = video;
        document.getElementById('modalBody').innerHTML = renderModal(video);
        backdrop.classList.add('open');
        document.body.classList.add('modal-open');
        document.getElementById('modalBox').scrollTop = 0;
    }

    function closeModal() {
        if (!backdrop) return;
        backdrop.classList.remove('open');
        document.body.classList.remove('modal-open');
        currentVideo = null;
    }

    function isOpen() {
        return backdrop && backdrop.classList.contains('open');
    }


    function renderModal(v) {
        var esc = fmt.esc;
        var lang = CF.i18nLib.getCurrentLang();
        var title = vlib.getLocalizedTitle(v, lang);
        var desc = vlib.getLocalizedDescription(v, lang);

        var thumb = vlib.getThumbnail(v);
        var thumbHtml = thumb
            ? '<img class="modal-thumb" src="' + esc(thumb) + '" alt="" ' +
              'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
              '<div class="modal-thumb-notfound" style="display:none">' + esc(t('card.notFound')) + '</div>'
            : '<div class="modal-thumb-notfound">' + esc(t('card.notFound')) + '</div>';

        var channels = vlib.uniqueChannels(v);
        var channelBadges = channels.length
            ? channels.map(function (c) {
                  return '<span class="modal-badge modal-badge-channel">' + esc(lbl.labelForChannel(c)) + '</span>';
              }).join('')
            : '<span class="modal-none">' + esc(t('modal.none')) + '</span>';

        var typeBadges = (v.types && v.types.length)
            ? v.types.map(function (tt) {
                  return '<span class="modal-badge modal-badge-type">' + esc(lbl.labelForType(tt)) + '</span>';
              }).join('')
            : '<span class="modal-none">' + esc(t('modal.none')) + '</span>';

        var tagBadges = (v.tags && v.tags.length)
            ? v.tags.map(function (tg) {
                  return '<span class="modal-badge modal-badge-tag">' + esc(tg) + '</span>';
              }).join('')
            : '<span class="modal-none">' + esc(t('modal.none')) + '</span>';

        var descHtml = desc
            ? '<p class="modal-description">' + esc(desc) + '</p>'
            : '<p class="modal-none">' + esc(t('modal.noDescription')) + '</p>';

        var platformButtons = renderPlatformButtons(v);

        var langValue = lbl.labelForLanguage(v.language || 'none');

        /* categories — now an array */
        var categoryBadges = (v.categories && v.categories.length)
            ? v.categories.map(function (c) {
                  return '<span class="modal-badge modal-badge-category">' + esc(lbl.labelForCategory(c)) + '</span>';
              }).join('')
            : '<span class="modal-none">' + esc(t('modal.none')) + '</span>';

        return '' +
            '<div class="modal-thumb-area">' + thumbHtml + '</div>' +
            '<div class="modal-text">' +
                '<h2 class="modal-title">' + esc(title) + '</h2>' +
                '<div class="modal-meta">' +
                    metaItem(t('modal.date'), fmt.formatDate(v.date)) +
                    metaItem(t('modal.duration'), fmt.formatDuration(v.duration)) +
                    metaItem(t('modal.language'), langValue) +
                    metaItem(t('modal.sources'), (v.sources || []).length + ' ' + t('modal.available')) +
                '</div>' +
                section(t('modal.watchOn'),     '<div class="modal-platforms">' + platformButtons + '</div>') +
                section(t('modal.channels'),    '<div class="modal-badges">' + channelBadges + '</div>') +
                section(t('modal.description'), descHtml) +
                section(t('modal.types'),       '<div class="modal-badges">' + typeBadges + '</div>') +
                section(t('modal.category'),    '<div class="modal-badges">' + categoryBadges + '</div>') +
                section(t('modal.tags'),        '<div class="modal-badges">' + tagBadges + '</div>') +
            '</div>';
    }

    function metaItem(label, value, extraClass) {
        var cls = 'modal-meta-item' + (extraClass ? ' ' + extraClass : '');
        return '<div class="' + cls + '">' +
                    '<span class="modal-meta-label">' + fmt.esc(label) + '</span>' +
                    '<span class="modal-meta-value">' + fmt.esc(value) + '</span>' +
               '</div>';
    }

    function section(label, content) {
        return '<div class="modal-section">' +
                    '<h3 class="modal-section-title">&gt; ' + fmt.esc(label) + '</h3>' +
                    content +
               '</div>';
    }

    function renderPlatformButtons(v) {
        var esc = fmt.esc;
        var sources = v.sources || [];
        if (sources.length === 0) {
            return '<p class="modal-none">' + esc(t('modal.noPlayback')) + '</p>';
        }
        var html = '';
        sources.forEach(function (s) {
            var label = lbl.labelForPlatform(s.platform);
            var channelLabel = lbl.labelForChannel(s.channel);
            if (s.url) {
                html += '<a class="modal-platform-btn platform-' + esc(s.platform) + '" ' +
                            'href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
                            '<span class="modal-platform-icon">\u25B6</span>' +
                            '<span class="modal-platform-text">' + esc(label) + '</span>' +
                            '<span class="modal-platform-channel">' + esc(channelLabel) + '</span>' +
                        '</a>';
            } else {
                html += '<span class="modal-platform-btn platform-' + esc(s.platform) + ' disabled" title="URL not set yet">' +
                            '<span class="modal-platform-icon">\u25B6</span>' +
                            '<span class="modal-platform-text">' + esc(label) + '</span>' +
                            '<span class="modal-platform-channel">' + esc(channelLabel) + '</span>' +
                        '</span>';
            }
        });
        return html;
    }


    console.log('%c\u25B6 view-modal.js :: modal module initialised', 'color:#39ff14;');
})();
