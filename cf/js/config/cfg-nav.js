/* =====================================================================
   config / cfg-nav.js  —  navigation panel config
   ---------------------------------------------------------------------
   MODULE ORDER:
     1. Search   2. Sort   3. Category   4. Type   5. Channel
     6. Language   7. Platform

   All filter sections (Category / Type / Channel / Language / Platform)
   are COLLAPSED BY DEFAULT. The user clicks a section label to expand it.

   `value` fields are constant identifiers (never translate).
   `labelKey` fields point to translatable strings in cfg-i18n.js.

   CATEGORY is now manually maintained (chips list below) — no longer
   auto-generated. Each video can have multiple categories (array).
   The Category section also has its own text search field for quick
   filtering when there are many categories.
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};
window.CyfrowaFilmoteka.site = window.CyfrowaFilmoteka.site || {};

CyfrowaFilmoteka.site.nav = {
    titleKey: 'nav.title',
    modules: [

        /* 1. --- text search (matches title AND custom tags) --------- */
        {
            id: 'nav-searchbar',
            labelKey: 'nav.search.label',
            type: 'search',
            placeholderKey: 'nav.search.placeholder',
            collapsible: false
        },

        /* 2. --- sort dropdown --------------------------------------- */
        {
            id: 'nav-searchsort',
            labelKey: 'nav.sort.label',
            type: 'select',
            default: 'newest',
            options: [
                { value: 'newest',      labelKey: 'nav.sort.newest'      },
                { value: 'oldest',      labelKey: 'nav.sort.oldest'      },
                { value: 'az',          labelKey: 'nav.sort.az'          },
                { value: 'za',          labelKey: 'nav.sort.za'          },
                { value: 'longest',     labelKey: 'nav.sort.longest'     },
                { value: 'shortest',    labelKey: 'nav.sort.shortest'    },
                { value: 'recommended', labelKey: 'nav.sort.recommended' }
            ],
            collapsible: false
        },

        /* 3. --- category filter (manual chips + text search) ------- */
        /* Categories are manually maintained here. Each video can have
           multiple categories (array in db-videos.js).
           `defaultCollapsed: true` means the section starts collapsed. */
        {
            id: 'nav-searchcategory',
            labelKey: 'nav.category.label',
            type: 'chips',
            multi: true,
            collapsible: true,
            defaultCollapsed: true,
            searchable: true,
            searchPlaceholderKey: 'nav.category.searchPlaceholder',
            chips: [
                { value: 'Bevelstan-AF', labelKey: 'nav.category.Bevelstan-AF'}
            ]
        },

        /* 4. --- type filter chips (multi-select, OR logic) --------- */
        {
            id: 'nav-searchtype',
            labelKey: 'nav.type.label',
            type: 'chips',
            multi: true,
            collapsible: true,
            defaultCollapsed: true,
            chips: [
                { value: 'gaming', labelKey: 'nav.type.gaming'},
                { value: 'comedy', labelKey: 'nav.type.comedy'},
                { value: 'horror', labelKey: 'nav.type.horror'},
                { value: 'documentary', labelKey: 'nav.type.documentary'}
            ]
        },

        /* 5. --- channel filter chips (multi-select, OR logic) ------ */
        {
            id: 'nav-searchchannel',
            labelKey: 'nav.channel.label',
            type: 'chips',
            multi: true,
            collapsible: true,
            defaultCollapsed: true,
            chips: [
                { value: 'stary_lolseczeq', labelKey: 'nav.channel.stary_lolseczeq'},
                { value: 'rogal', labelKey: 'nav.channel.rogal'},
                { value: 'archiwa_u_lolseczqa', labelKey: 'nav.channel.archiwa_u_lolseczqa'}
            ]
        },

        /* 6. --- language filter chips (multi-select, OR logic) ----- */
        {
            id: 'nav-searchlanguage',
            labelKey: 'nav.language.label',
            type: 'chips',
            multi: true,
            collapsible: true,
            defaultCollapsed: true,
            chips: [
                { value: 'pl',   labelKey: 'nav.language.pl'   },
                { value: 'en',   labelKey: 'nav.language.en'   }
            ]
        },

        /* 7. --- platform filter chips (multi-select, OR logic) ----- */
        {
            id: 'nav-searchplatform',
            labelKey: 'nav.platform.label',
            type: 'chips',
            multi: true,
            collapsible: true,
            defaultCollapsed: true,
            chips: [
                { value: 'youtube', labelKey: 'nav.platform.youtube' },
                { value: 'cda',     labelKey: 'nav.platform.cda'     },
                { value: 'rumble',  labelKey: 'nav.platform.rumble'  }
            ]
        }
    ]
};
