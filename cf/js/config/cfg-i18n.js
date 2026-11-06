/* =====================================================================
   config / cfg-i18n.js  —  TRANSLATION STRINGS
   ---------------------------------------------------------------------
   All UI text strings live here, organized by language.
   To add a new language: add a new key under `strings` with all the
   same translation keys, then add the language code to `languages`.
   To add a new translatable string: add the key to EVERY language.
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};

CyfrowaFilmoteka.i18n = {
    languages: ['en', 'pl'],

    strings: {

        /* ===== ENGLISH ===== */
        en: {
            /* header */
            'header.title':       'CYFROWA FILMOTEKA',
            'header.subtitle':    '// DIGITAL FILM LIBRARY — VIDEO ARCHIVE //',
            'header.themeToggle': 'Toggle theme',
            'header.langToggle':  'Toggle language',

            /* collapsed strip labels */
            'strip.header': 'HEADER',
            'strip.nav':    'NAV',
            'strip.footer': 'FOOTER',

            /* nav section labels */
            'nav.title':              'SEARCH BAR',
            'nav.search.label':       'SEARCH',
            'nav.search.placeholder': 'title or #tag...',
            'nav.sort.label':         'SORT',
            'nav.sort.newest':        'Newest',
            'nav.sort.oldest':        'Oldest',
            'nav.sort.az':            'A \u2192 Z',
            'nav.sort.za':            'Z \u2192 A',
            'nav.sort.longest':       'Longest',
            'nav.sort.shortest':      'Shortest',
            'nav.sort.recommended':   'Recommended',

            /* type chips */
            'nav.type.label':       'TYPE',
            'nav.type.gaming':      'Gaming',
            'nav.type.comedy':      'Comedy',
            'nav.type.horror':      'Horror',
            'nav.type.documentary': 'Documentary',

            /* category */
            'nav.category.label':             'CATEGORY',
            'nav.category.searchPlaceholder': 'filter categories...',
            'nav.category.Bevelstan-AF':      'Bevelstanśkie Archiwum Filmowe',

            /* language chips */
            'nav.language.label': 'LANGUAGE',
            'nav.language.pl':    'PL',
            'nav.language.en':    'ENG',

            /* channel chips */
            'nav.channel.label':               'CHANNEL',
            'nav.channel.stary_lolseczeq':     'Stary Lolseczeq',
            'nav.channel.rogal':               'Rogal',
            'nav.channel.archiwa_u_lolseczqa': 'Archiwa u Lolseczqa',

            /* platform chips */
            'nav.platform.label':   'PLATFORM',
            'nav.platform.youtube': 'YouTube',
            'nav.platform.cda':     'CDA',
            'nav.platform.rumble':  'Rumble',

            /* main / results bar / empty state */
            'main.resultsPrefix': 'SHOWING',
            'main.resultsOf':      'OF',
            'main.resultsSuffix':  'VIDEOS',
            'main.clearLabel':     'CLEAR FILTERS',
            'main.emptyTitle':     'NO MATCHES',
            'main.emptyLine1':     'No videos match the current filters.',
            'main.emptyLine2':     'Clear the search or select less types / platforms.',

            /* footer */
            'footer.brand':     '@ Cyfrowa Filmoteka',
            'footer.author':    'Ognisty Sutek',
            'footer.timeLabel': 'SYS.TIME',
            'footer.recLabel':  'REC',

            /* card */
            'card.notFound': 'NOT FOUND',

            /* modal */
            'modal.watchOn':       'WATCH ON',
            'modal.channels':      'CHANNELS',
            'modal.description':   'DESCRIPTION',
            'modal.types':         'TYPES',
            'modal.tags':          'TAGS',
            'modal.date':          'DATE',
            'modal.duration':      'DURATION',
            'modal.category':      'CATEGORY',
            'modal.sources':       'SOURCES',
            'modal.available':     'available',
            'modal.language':      'LANGUAGE',
            'modal.noDescription': 'No description yet.',
            'modal.noPlayback':    'No playback links available.',
            'modal.none':          'none'
        },

        /* ===== POLISH ===== */
        pl: {
            /* header */
            'header.title':       'CYFROWA FILMOTEKA',
            'header.subtitle':    '// CYFROWA BIBLIOTEKA FILMÓW — ARCHIWUM WIDEO //',
            'header.themeToggle': 'Przełącz motyw',
            'header.langToggle':  'Przełącz język',

            /* collapsed strip labels */
            'strip.header': 'HEADER',
            'strip.nav':    'NAV',
            'strip.footer': 'FOOTER',

            /* nav section labels */
            'nav.title':              'WYSZUKIWARKA',
            'nav.search.label':       'SZUKAJ',
            'nav.search.placeholder': 'tytuł lub #tag...',
            'nav.sort.label':         'SORTUJ',
            'nav.sort.newest':        'Najnowsze',
            'nav.sort.oldest':        'Najstarsze',
            'nav.sort.az':            'A \u2192 Z',
            'nav.sort.za':            'Z \u2192 A',
            'nav.sort.longest':       'Najdłuższe',
            'nav.sort.shortest':      'Najkrótsze',
            'nav.sort.recommended':   'Polecane',

            /* type chips */
            'nav.type.label':       'TYP',
            'nav.type.gaming':      'Gry',
            'nav.type.comedy':      'Komedia',
            'nav.type.horror':      'Horror',
            'nav.type.documentary': 'Dokument',

            /* category */
            'nav.category.label':             'KATEGORIA',
            'nav.category.searchPlaceholder': 'filtruj kategorie...',
            'nav.category.Bevelstan-AF':      'Bevelstanśkie Archiwum Filmowe',

            /* language chips */
            'nav.language.label': 'JĘZYK',
            'nav.language.pl':    'PL',
            'nav.language.en':    'ANG',

            /* channel chips */
            'nav.channel.label':               'KANAŁ',
            'nav.channel.stary_lolseczeq':     'Stary Lolseczeq',
            'nav.channel.rogal':               'Rogal',
            'nav.channel.archiwa_u_lolseczqa': 'Archiwa u Lolseczqa',

            /* platform chips */
            'nav.platform.label':   'PLATFORMA',
            'nav.platform.youtube': 'YouTube',
            'nav.platform.cda':     'CDA',
            'nav.platform.rumble':  'Rumble',

            /* main / results bar / empty state */
            'main.resultsPrefix': 'POKAZANO',
            'main.resultsOf':      'Z',
            'main.resultsSuffix':  'FILMÓW',
            'main.clearLabel':     'WYCZYŚĆ FILTRY',
            'main.emptyTitle':     'BRAK WYNIKÓW',
            'main.emptyLine1':     'Brak filmów pasujących do obecnych filtrów.',
            'main.emptyLine2':     'Wyczyść wyszukiwanie lub wybierz mniej typów / platform.',

            /* footer */
            'footer.brand':     '@ Cyfrowa Filmoteka',
            'footer.author':    'Ognisty Sutek',
            'footer.timeLabel': 'CZAS SYS',
            'footer.recLabel':  'REC',

            /* card */
            'card.notFound': 'NIE ZNALEZIONO',

            /* modal */
            'modal.watchOn':       'OGLĄDAJ NA',
            'modal.channels':      'KANAŁY',
            'modal.description':   'OPIS',
            'modal.types':         'TYPY',
            'modal.tags':          'TAGI',
            'modal.date':          'DATA',
            'modal.duration':      'CZAS TRWANIA',
            'modal.category':      'KATEGORIA',
            'modal.sources':       'ŹRÓDŁA',
            'modal.available':     'dostępne',
            'modal.language':      'JĘZYK',
            'modal.noDescription': 'Brak opisu.',
            'modal.noPlayback':    'Brak dostępnych linków odtwarzania.',
            'modal.none':          'brak'
        }
    }
};
