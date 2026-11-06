/* =====================================================================
   lib / util-i18n.js  —  translation logic
   ---------------------------------------------------------------------
     t(key)              → translated string for current language
     getCurrentLang()    → 'en' | 'pl'
     setLang(lang)       → switch language + persist + dispatch event
     toggleLang()        → cycle to next language
     init()              → load saved preference, set <html lang>
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};

CyfrowaFilmoteka.i18nLib = {

    currentLang: 'en',
    storageKey:  'cf-lang',

    init: function () {
        var saved = null;
        try { saved = localStorage.getItem(this.storageKey); } catch (e) {}
        if (saved && this._isValidLang(saved)) {
            this.currentLang = saved;
        } else {
            this.currentLang = CyfrowaFilmoteka.i18n.languages[0] || 'en';
        }
        this._updateHtmlLang();
    },

    t: function (key) {
        var strings = CyfrowaFilmoteka.i18n.strings[this.currentLang];
        if (strings && strings[key]) return strings[key];
        var fallback = CyfrowaFilmoteka.i18n.strings.en;
        if (fallback && fallback[key]) return fallback[key];
        return key;
    },

    getCurrentLang: function () {
        return this.currentLang;
    },

    setLang: function (lang) {
        if (!this._isValidLang(lang)) return;
        this.currentLang = lang;
        try { localStorage.setItem(this.storageKey, lang); } catch (e) {}
        this._updateHtmlLang();
        document.dispatchEvent(new CustomEvent('cf:lang-change'));
    },

    toggleLang: function () {
        var langs = CyfrowaFilmoteka.i18n.languages;
        var idx = langs.indexOf(this.currentLang);
        var next = langs[(idx + 1) % langs.length];
        this.setLang(next);
    },

    _isValidLang: function (lang) {
        return CyfrowaFilmoteka.i18n.languages.indexOf(lang) !== -1;
    },

    _updateHtmlLang: function () {
        document.documentElement.lang = this.currentLang;
    }
};
