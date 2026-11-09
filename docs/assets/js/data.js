/*
  Dades de Taller: carrega els fitxers de docs/content/ i construeix window.GIL.

    content/site.json      tope del taulell (boardLimit) i categories amb el seu nom en 3 idiomes
    content/projects.json  projectes i fotos. Cada foto té "board": true/false (surt al taulell o no)
    content/about.json     sobre mi: biografia, estudis, experiència, contacte

  · Cada text és un objecte { "ca": "...", "es": "...", "en": "..." }. El català és obligatori;
    si falta un altre idioma es mostra el català (i queda anotat a GIL.missing).
  · GIL.localize(codi) reescriu en lloc tots els textos a l'idioma demanat (el crida i18n.js).
  · GIL.board() dóna les fotos del taulell: les marcades "board": true, com a màxim boardLimit.
    La llista, en canvi, mostra tots els projectes i totes les fotos, sense límit.
  · GIL.ready és la promesa que cal esperar abans d'usar res més.
  Paper i Sala NO usen això: continuen amb assets/js/works.js.
*/
(function () {
  'use strict';
  const root = new URL('../../', document.currentScript.src);          // .../docs/
  const G = (window.GIL = { lang: 'ca', loaded: false, missing: [], root: root.href });

  const REF_SIZE = 0.43;                                                // mida per defecte d'una foto nova = 43 % del costat llarg
  const MIN_SIZE = 220, MAX_SIZE = 540;

  const load = (name) => fetch(new URL(`content/${name}`, root)).then((r) => {
    if (!r.ok) throw new Error(`No s'ha pogut carregar content/${name} (${r.status})`);
    return r.json();
  });
  const img = (file) => new URL(`assets/img/${file}`, root).href;
  const sizeOf = (ph) => (ph.boardSize > 0 ? ph.boardSize
    : Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(REF_SIZE * Math.max(ph.w, ph.h)))));

  function build({ site, proj, about }) {
    if (!proj || !Array.isArray(proj.projects)) throw new Error('projects.json: falta la llista "projects"');

    G.boardLimit = Number.isFinite(site && site.boardLimit) && site.boardLimit > 0 ? Math.floor(site.boardLimit) : 42;

    G.categories = ((site && site.categories) || []).map((c) => ({ id: c.id, cover: c.cover !== false, label: '' }));
    // una categoria que un projecte usi però no estigui definida no ha de trencar res: es mostra pel seu identificador
    proj.projects.forEach((p) => { if (!G.categories.some((c) => c.id === p.category)) G.categories.push({ id: p.category, cover: true, label: '', sinDefinir: true }); });

    G.projectes = proj.projects.map((p) => ({
      id: p.id, tipus: p.category, any: String(p.year || ''), lloc: p.place || '',
      titol: '', curt: '', subtitol: '', text: '',
      imatges: (p.photos || []).map((ph) => ({
        file: ph.file, src: img(ph.file), w: ph.w, h: ph.h,
        board: ph.board === true, boardSize: sizeOf(ph), alt: '',
      })),
    }));
    G.per = (id) => G.projectes.find((p) => p.id === id);

    G.nom = about.name;
    G.nomCurt = about.shortName || about.name;
    G.email = about.email;
    G.instagram = { usuari: about.instagram.handle, url: about.instagram.url };
    G.lloc = about.place;
    G.any = about.portfolioYear;
    G.retrat = { src: img(about.portrait.file), w: about.portrait.w, h: about.portrait.h, alt: '' };
    G.bio = about.bio.map(() => '');
    G.formacio = about.education.map((e) => ({ any: e.year, titol: '', lloc: e.place || '' }));
    G.experiencia = about.experience.map((e) => ({ any: e.year, text: '' }));
  }

  /* Reescriu tots els textos a l'idioma indicat (sense tornar a crear els objectes). */
  function localize(code) {
    const { site, proj, about } = G.src;
    const miss = new Set();
    const P = (o, path) => {
      if (typeof o === 'string') return o;
      const v = o && o[code];
      if (v) return v;
      if (code !== 'ca') miss.add(`${path}.${code}`);
      return (o && o.ca) || '';
    };

    G.categories.forEach((c) => {
      const def = ((site && site.categories) || []).find((x) => x.id === c.id);
      c.label = def ? P(def.label, `categories.${c.id}`) : c.id;
    });
    proj.projects.forEach((p, i) => {
      const o = G.projectes[i];
      o.titol = P(p.title, `${p.id}.title`);
      o.curt = P(p.short || p.title, `${p.id}.short`);
      o.subtitol = p.subtitle ? P(p.subtitle, `${p.id}.subtitle`) : '';
      o.text = P(p.text, `${p.id}.text`);
      (p.photos || []).forEach((ph, k) => { o.imatges[k].alt = P(ph.alt, `${p.id}.${ph.file}.alt`); });
    });
    G.retrat.alt = P(about.portrait.alt, 'portrait.alt');
    about.bio.forEach((b, i) => { G.bio[i] = P(b, `bio.${i + 1}`); });
    about.education.forEach((e, i) => { G.formacio[i].titol = P(e.title, `education.${i + 1}`); });
    about.experience.forEach((e, i) => { G.experiencia[i].text = P(e.text, `experience.${i + 1}`); });
    G.missing = [...miss];
  }

  /* Fotos del taulell, en l'ordre dels projectes. Mai buit ni per sobre del tope. */
  G.board = function () {
    const all = G.projectes.flatMap((p) => p.imatges.map((im, i) => ({ p, im, i })));
    let sel = all.filter((x) => x.im.board);
    if (!sel.length) {
      console.warn('[taulell] cap foto marcada "board": es mostren les primeres', G.boardLimit);
      sel = all.slice(0, G.boardLimit);
    } else if (sel.length > G.boardLimit) {
      console.warn(`[taulell] ${sel.length} fotos marcades i el tope és ${G.boardLimit}: es mostren només les ${G.boardLimit} primeres`);
      sel = sel.slice(0, G.boardLimit);
    }
    return sel;
  };

  G.localize = localize;
  G.ready = Promise.all([load('site.json'), load('projects.json'), load('about.json')])
    .then(([site, proj, about]) => {
      G.src = { site, proj, about };
      build(G.src);
      G.loaded = true;
      localize(G.lang);
    });
})();
