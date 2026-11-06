/* =====================================================================
   lib / util-labels.js  —  chip label lookups (i18n-aware)
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};

CyfrowaFilmoteka.labels = {

    findChip: function (moduleId, value) {
        var site = window.CyfrowaFilmoteka && window.CyfrowaFilmoteka.site;
        if (!site || !site.nav) return null;
        var m = site.nav.modules.find(function (x) { return x.id === moduleId; });
        if (!m || !m.chips) return null;
        return m.chips.find(function (x) { return x.value === value; }) || null;
    },

    chipLabel: function (moduleId, value) {
        var chip = this.findChip(moduleId, value);
        if (!chip) return value;
        if (chip.labelKey) return window.CyfrowaFilmoteka.i18nLib.t(chip.labelKey);
        return chip.label || value;
    },

    labelForPlatform: function (value) { return this.chipLabel('nav-searchplatform', value); },
    labelForType:     function (value) { return this.chipLabel('nav-searchtype', value); },
    labelForChannel:  function (value) { return this.chipLabel('nav-searchchannel', value); },
    labelForLanguage: function (value) { return this.chipLabel('nav-searchlanguage', value); },
    labelForCategory: function (value) { return this.chipLabel('nav-searchcategory', value); }
};
