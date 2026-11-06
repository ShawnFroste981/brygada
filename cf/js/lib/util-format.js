/* =====================================================================
   lib / util-format.js  —  shared formatting utilities
   ===================================================================== */

window.CyfrowaFilmoteka = window.CyfrowaFilmoteka || {};

CyfrowaFilmoteka.format = {

    esc: function (s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    formatDuration: function (sec) {
        if (!sec || sec < 0) return '--:--';
        var h = Math.floor(sec / 3600);
        var m = Math.floor((sec % 3600) / 60);
        var s = sec % 60;
        if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        return m + ':' + String(s).padStart(2, '0');
    },

    formatDate: function (dateStr) {
        if (!dateStr) return '----';
        return dateStr;
    }
};
