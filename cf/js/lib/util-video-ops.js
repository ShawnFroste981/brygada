/* =====================================================================
   lib / util-video-ops.js  —  video database operations
   ---------------------------------------------------------------------
   All code that OPERATES on the video data lives here.
   The data itself lives in  js/data/db-videos.js  (pure entries, no logic).

   Exposed via CyfrowaFilmoteka.videosLib:
     getThumbnail(v)         → thumbnail URL or null
     uniqueChannels(v)       → array of channel keys (deduped)
     uniquePlatforms(v)      → array of platform keys (deduped)
     filterVideos(state)     → filtered array
     sortVideos(list, sort)  → sorted copy
     findVideoById(id)       → video object or null
     getLocalizedTitle(v, lang)       → translated title
     getLocalizedDescription(v, lang) → translated description
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};

CyfrowaFilmoteka.videosLib = (function () {
    'use strict';

    var CF = window.CyfrowaFilmoteka;

    function videos() { return CF.videos || []; }

    /* Quality tags used by the recommended / well-made / poor-made sorts.
       Videos WITHOUT the tag sink to the bottom (but still appear). */
    var TAG_RECOMMENDED = '*⭐*';
    var TAG_WELL_MADE   = '*well-made*';
    var TAG_POOR_MADE   = '*poor-made*';


    /* =================================================================
       THUMBNAIL
       1. first source with explicit `thumbnail`
       2. first YouTube source with `videoId` → auto-construct
       3. null (caller shows NOT FOUND placeholder)
       ================================================================= */
    function getThumbnail(v) {
        var sources = v.sources || [];
        for (var i = 0; i < sources.length; i++) {
            if (sources[i].thumbnail) return sources[i].thumbnail;
        }
        for (var j = 0; j < sources.length; j++) {
            var s = sources[j];
            if (s.platform === 'youtube' && s.videoId) {
                return 'https://img.youtube.com/vi/' + s.videoId + '/hqdefault.jpg';
            }
        }
        return null;
    }


    /* =================================================================
       SOURCE DERIVATION (deduped)
       ================================================================= */
    function uniqueChannels(v) {
        var seen = {};
        var list = [];
        (v.sources || []).forEach(function (s) {
            if (s.channel && !seen[s.channel]) {
                seen[s.channel] = true;
                list.push(s.channel);
            }
        });
        return list;
    }

    /** Deduped list of platforms — so 2 YouTube sources show "YouTube" once. */
    function uniquePlatforms(v) {
        var seen = {};
        var list = [];
        (v.sources || []).forEach(function (s) {
            if (s.platform && !seen[s.platform]) {
                seen[s.platform] = true;
                list.push(s.platform);
            }
        });
        return list;
    }


    /* =================================================================
       FILTER
       state = { query, types:Set, platforms:Set, channels:Set,
                 categories:Set, languages:Set }
       ================================================================= */
    function filterVideos(state) {
        var q = (state.query || '').trim().toLowerCase();
        var qTag = q.charAt(0) === '#' ? q.slice(1) : q;
        var lang = CF.i18nLib ? CF.i18nLib.getCurrentLang() : 'en';

        return videos().filter(function (v) {
            /* search: title OR tags (uses localized title) */
            if (q) {
                var title = getLocalizedTitle(v, lang).toLowerCase();
                var titleHit = title.indexOf(q) !== -1;
                var tagHit = (v.tags || []).some(function (t) {
                    var lt = t.toLowerCase();
                    return lt === q || lt === qTag ||
                           lt.indexOf(q) !== -1 || lt.indexOf(qTag) !== -1;
                });
                if (!titleHit && !tagHit) return false;
            }

            if (state.types && state.types.size > 0) {
                var hasType = v.types.some(function (t) { return state.types.has(t); });
                if (!hasType) return false;
            }

            if (state.platforms && state.platforms.size > 0) {
                var hasPlatform = (v.sources || []).some(function (s) {
                    return state.platforms.has(s.platform);
                });
                if (!hasPlatform) return false;
            }

            if (state.channels && state.channels.size > 0) {
                var hasChannel = (v.sources || []).some(function (s) {
                    return state.channels.has(s.channel);
                });
                if (!hasChannel) return false;
            }

            /* categories — now an array; OR logic (any match passes) */
            if (state.categories && state.categories.size > 0) {
                var vCats = v.categories || [];
                var hasCat = vCats.some(function (c) { return state.categories.has(c); });
                if (!hasCat) return false;
            }

            if (state.languages && state.languages.size > 0) {
                var vLang = v.language || 'none';
                if (!state.languages.has(vLang)) return false;
            }

            return true;
        });
    }


    /* =================================================================
       SORT
       Data dates are stored as 'DD-MM-YYYY' (not lexicographically
       sortable), so we convert to 'YYYY-MM-DD' inline before comparing.
       recommended / well-made / poor-made sorts use quality tags —
       tagged videos float to the top, untagged sink to the bottom.
       ================================================================= */

    function toSortable(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        if (parts.length === 3) return parts[2] + '-' + parts[1] + '-' + parts[0];
        return '';
    }

    function hasTag(v, tag) {
        return (v.tags || []).indexOf(tag) !== -1;
    }

    function sortVideos(list, sort) {
        var out = list.slice();
        switch (sort) {
            case 'newest':
                out.sort(function (a, b) {
                    return toSortable(b.date).localeCompare(toSortable(a.date));
                });
                break;
            case 'oldest':
                out.sort(function (a, b) {
                    return toSortable(a.date).localeCompare(toSortable(b.date));
                });
                break;
            case 'az':
                out.sort(function (a, b) { return getLocalizedTitle(a).localeCompare(getLocalizedTitle(b)); });
                break;
            case 'za':
                out.sort(function (a, b) { return getLocalizedTitle(b).localeCompare(getLocalizedTitle(a)); });
                break;
            case 'longest':
                out.sort(function (a, b) { return b.duration - a.duration; });
                break;
            case 'shortest':
                out.sort(function (a, b) { return a.duration - b.duration; });
                break;
            case 'recommended':
                out.sort(function (a, b) {
                    var aT = hasTag(a, TAG_RECOMMENDED);
                    var bT = hasTag(b, TAG_RECOMMENDED);
                    if (aT !== bT) return aT ? -1 : 1;
                    return toSortable(b.date).localeCompare(toSortable(a.date));
                });
                break;
        }
        return out;
    }


    function findVideoById(id) {
        return videos().find(function (x) { return x.id === id; }) || null;
    }


    /* =================================================================
       LOCALIZED TITLE / DESCRIPTION
         title: 'My Video'                         → used for all languages
         title: { en: 'My Video', pl: 'Mój Film' } → uses current language
       Falls back to English, then to the first available.
       ================================================================= */
    function getLocalizedTitle(v, lang) {
        return getLocalizedField(v.title, lang || (CF.i18nLib ? CF.i18nLib.getCurrentLang() : 'en'));
    }

    function getLocalizedDescription(v, lang) {
        return getLocalizedField(v.description, lang || (CF.i18nLib ? CF.i18nLib.getCurrentLang() : 'en'));
    }

    function getLocalizedField(field, lang) {
        if (field == null) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            if (field[lang]) return field[lang];
            if (field.en) return field.en;
            for (var k in field) { if (field[k]) return field[k]; }
        }
        return '';
    }


    return {
        getThumbnail: getThumbnail,
        uniqueChannels: uniqueChannels,
        uniquePlatforms: uniquePlatforms,
        filterVideos: filterVideos,
        sortVideos: sortVideos,
        findVideoById: findVideoById,
        getLocalizedTitle: getLocalizedTitle,
        getLocalizedDescription: getLocalizedDescription
    };
})();
