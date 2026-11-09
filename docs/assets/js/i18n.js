/*
  Idiomes de Taller (cat · es · en): text de la interfície i elecció de l'idioma.
  Paper i Sala no el carreguen i continuen en català.

  · Aquí només hi ha la INTERFÍCIE (botons, avisos, títol de la pàgina).
    El CONTINGUT (títols, descripcions, biografia, CV, alts) és a docs/content/*.json, cada text en els
    3 idiomes; data.js el reescriu amb GIL.localize(). El català és l'original de Gil; el castellà i l'anglès
    són traduccions seves a revisar.
  · setLang() canvia l'idioma i avisa amb l'esdeveniment «gil:lang» perquè taller.js repinti.
  · Ordre d'elecció: ?lang=xx a l'adreça · tria guardada del visitant · idioma del navegador · anglès.
  Ordre dels scripts: data.js (crea GIL) abans que aquest fitxer; aquest, abans que taller.js.
*/
(function () {
  'use strict';
  const G = window.GIL;
  const LANGS = ['ca', 'es', 'en'];
  const STORE = 'gil-lang';

  /* ───────── Textos de la interfície ───────── */
  const UI = {
    ca: {
      skip: 'Salta a la llista d’obres', about: 'Sobre mi', contact: 'Contacte', hint: 'Arrossega per explorar',
      f_tot: 'Tot', v_list: 'Llista', v_board: 'Taulell',
      world_aria: 'Taula de treball. Arrossega per explorar les obres.', nav_aria: 'Informació',
      filters_aria: 'Filtra les obres', lang_aria: 'Llengua', list_aria: 'Llista d’obres',
      prev: 'Anterior', next: 'Següent', close: 'Tanca', viewer_aria: 'Imatge ampliada',
      formation: 'Formació', experience: 'Experiència',
      title: 'Gil Farrés · Taller',
      desc: 'Taula de treball de Gil Farrés: instal·lacions, escenografia i la marca FARS.',
      load_error: 'No s’ha pogut carregar el contingut. Torna-ho a provar d’aquí una estona.',
    },
    es: {
      skip: 'Saltar a la lista de obras', about: 'Sobre mí', contact: 'Contacto', hint: 'Arrastra para explorar',
      f_tot: 'Todo', v_list: 'Lista', v_board: 'Tablero',
      world_aria: 'Mesa de trabajo. Arrastra para explorar las obras.', nav_aria: 'Información',
      filters_aria: 'Filtrar las obras', lang_aria: 'Idioma', list_aria: 'Lista de obras',
      prev: 'Anterior', next: 'Siguiente', close: 'Cerrar', viewer_aria: 'Imagen ampliada',
      formation: 'Formación', experience: 'Experiencia',
      title: 'Gil Farrés · Taller',
      desc: 'Mesa de trabajo de Gil Farrés: instalaciones, escenografía y la marca FARS.',
      load_error: 'No se ha podido cargar el contenido. Inténtalo de nuevo dentro de un rato.',
    },
    en: {
      skip: 'Skip to the list of works', about: 'About', contact: 'Contact', hint: 'Drag to explore',
      f_tot: 'All', v_list: 'List', v_board: 'Board',
      world_aria: 'Worktable. Drag to explore the works.', nav_aria: 'Information',
      filters_aria: 'Filter the works', lang_aria: 'Language', list_aria: 'List of works',
      prev: 'Previous', next: 'Next', close: 'Close', viewer_aria: 'Enlarged image',
      formation: 'Education', experience: 'Experience',
      title: 'Gil Farrés · Workshop',
      desc: 'Gil Farrés’s worktable: installations, set design and the FARS label.',
      load_error: 'The content could not be loaded. Please try again in a moment.',
    },
  };

  const t = (key) => (UI[G.lang] && UI[G.lang][key]) || UI.ca[key] || key;

  /* ───────── Text estàtic de la pàgina ───────── */
  function traduirDom() {
    document.documentElement.lang = G.lang;
    document.title = t('title');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('desc'));
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === G.lang)));
  }

  /* ───────── Elecció de l'idioma ───────── */
  function guardat() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function guarda(code) { try { localStorage.setItem(STORE, code); } catch (e) { /* mode privat: no passa res */ } }
  function delNavegador() {
    const llistes = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
    return llistes.map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => LANGS.includes(l));
  }
  function inicial() {
    const q = new URLSearchParams(location.search).get('lang');
    return [q, guardat(), delNavegador()].find((l) => LANGS.includes(l)) || 'en';
  }

  function setLang(code, { persist = false } = {}) {
    if (!LANGS.includes(code)) return;
    G.lang = code;
    if (G.loaded) G.localize(code);       // si el contingut encara no ha arribat, ho farà la cadena de G.ready
    traduirDom();
    if (persist) guarda(code);
    window.dispatchEvent(new CustomEvent('gil:lang', { detail: code }));
  }

  G.langs = LANGS;
  G.t = t;
  G.setLang = setLang;

  // La interfície es tradueix de seguida (no depèn de res). El contingut, quan hagi arribat.
  G.lang = inicial();
  traduirDom();
  G.ready = G.ready.then(() => G.localize(G.lang));

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b && b.dataset.lang !== G.lang) setLang(b.dataset.lang, { persist: true });
  });
})();
