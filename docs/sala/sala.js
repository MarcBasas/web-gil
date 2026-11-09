/*
  Proposta 3 · Sala — exposició que es recorre en horitzontal.

  Com funciona:
  · El scroll vertical de la pàgina es tradueix en un desplaçament horitzontal de la «pista» (sticky + translate).
    És el patró més robust: funciona amb roda, tàctil, teclat i barra de scroll, sense segrestar res.
  · La rotulació de cada sala va més lenta que les obres (parallax per sala, via la variable --rel).
  · Cada sala és un projecte, pintat amb el color de la seva obra. Només hi ha dades reals de Gil.
  · Amb «moviment reduït» les sales s'apilen en vertical (classe .is-walk absent).
*/
(() => {
  const G = window.GIL;
  const root = document.documentElement;
  const track = document.getElementById('track');
  const walk = document.getElementById('sales');
  const nav = document.getElementById('nav');
  const menu = document.getElementById('menu');
  const nowEl = document.getElementById('now');
  const barEl = document.getElementById('bar');
  const hint = document.getElementById('hint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const metaDe = (p) => [p.subtitol, p.lloc, p.any].filter(Boolean).join(', ');

  /* ───────── Disseny de les sales ─────────
     h = alçada de l'obra en % d'alçada de pantalla · y = desplaçament vertical · mult = es fon amb la paret
     Els colors de paret surten de cada projecte (blanc inflable, verd del Rec, blau de Rec.0, nit de Nadal, rosa de FARS). */
  const fars = G.per('fars');
  const f = (file, h, y = 0, extra = {}) => ({ im: fars.imatges.find((x) => x.file === file), h, y, ...extra });
  const p = (idx, h, y = 0) => ({ idx, h, y });   // imatge d'índex idx del projecte de la sala
  const sales = [
    {
      id: 'entrada', nom: 'Entrada', wall: '#26282b', ink: '#efece6', wash: 'rgba(255,238,205,.15)',
      lettering: 'Gil<br>Farrés',
      text: { titol: G.nom, p: [G.bio[0]], meta: `Portafoli ${G.any}` },
      obres: [{ im: G.retrat, h: 50, y: -1 }],
      items: () => [{ ...G.retrat, titol: G.nom, meta: G.lloc }],
    },
    {
      id: 'balloon', proj: 'balloon', nom: 'Balloon Festival', wall: '#d3cfc6', ink: '#1c1b19', wash: 'rgba(255,255,255,.75)',
      lettering: 'Balloon<br>Festival',
      obres: [p(0, 46, -5), p(1, 40, 5), p(2, 44, -2), p(3, 48, 4)],
    },
    {
      id: 'buit', proj: 'buit', nom: 'Omplint el buit', wall: '#2b3326', ink: '#eeeadf', wash: 'rgba(235,242,205,.17)',
      lettering: 'Omplint<br>el buit',
      obres: [p(0, 44, -4), p(1, 38, 6), p(2, 46, -1), p(3, 40, 5)],
    },
    {
      id: 'rec0', proj: 'rec0', nom: 'Rec.0', wall: '#2a44cf', ink: '#ffffff', wash: 'rgba(255,255,255,.2)',
      lettering: 'Rec.0',
      obres: [p(0, 54, -4), p(1, 38, 5), p(2, 40, -3)],
    },
    {
      id: 'encesa', proj: 'encesa', nom: 'Encesa de llums', wall: '#0f1428', ink: '#efebe0', wash: 'rgba(255,225,170,.15)',
      lettering: 'Encesa<br>de llums',
      obres: [p(0, 46, -3), p(1, 36, 5), p(2, 46, -1), p(3, 36, 5)],
    },
    {
      id: 'fars', proj: 'fars', nom: 'FARS', wall: '#ea6aa8', ink: '#170d13', wash: 'rgba(255,255,255,.3)',
      lettering: 'FARS',
      // columnes: una obra o una pila de dues
      obres: [
        f('fars-logo.png', 56, -3, { mult: true }),
        [f('fars-estrella-3d.jpg', 32, 0, { mult: true }), f('fars-cara.jpg', 17, 0, { mult: true })],
        f('fars-samarreta-vermella.jpg', 40, 4),
        f('fars-dessuadora-negra.jpg', 46, -4),
        [f('fars-figures-negres.png', 17, 0, { mult: true }), f('fars-arma-paraigua.jpg', 15, 0, { mult: true })],
        f('fars-samarreta-taronja.jpg', 38, 3),
        f('fars-banner.jpg', 28, -2),
        f('fars-dessuadora-camuflatge-davant.jpg', 42, 4),
        f('fars-samarreta-catifa-blava.jpg', 38, -4),
        f('fars-carteres-munt.jpg', 52, 1),
        f('fars-cartera-vermella.jpg', 28, 5),
        f('fars-samarreta-rosa-2.jpg', 36, -3),
      ],
    },
    {
      id: 'contacte', nom: 'Contacte', wall: '#26282b', ink: '#efece6', wash: 'rgba(255,238,205,.1)',
      lettering: 'Contacte', custom: true, obres: [],
    },
  ];

  /* ───────── Construcció ───────── */
  const obresDe = (s) => {
    // normalitza: cada «columna» és una llista d'obres
    return (s.obres || []).map((o) => (Array.isArray(o) ? o : [o])).map((col) => col.map((o) =>
      (o.idx !== undefined ? { im: G.per(s.proj).imatges[o.idx], h: o.h, y: o.y } : o)));
  };
  const itemsDe = (s) => {
    if (s.items) return s.items();
    const p = G.per(s.proj);
    return obresDe(s).flat().map(({ im }) => ({ src: im.src, alt: im.alt, w: im.w, h: im.h, titol: p.titol, meta: metaDe(p), text: p.text }));
  };

  const workHtml = (o, idx, sala) => `
    <figure class="work${o.mult ? ' work--multiply' : ''}" style="--h:${o.h};--y:${o.y || 0}">
      <button class="work__btn" type="button" data-sala="${sala}" data-idx="${idx}">
        <img src="${esc(o.im.src)}" width="${o.im.w}" height="${o.im.h}" alt="${esc(o.im.alt)}" decoding="async"${sala > 1 ? ' loading="lazy"' : ''}>
      </button>
    </figure>`;

  const salaHtml = (s, n) => {
    let idx = 0;
    const cols = obresDe(s).map((col) => {
      const html = col.map((o) => workHtml(o, idx++, n)).join('');
      return col.length > 1 ? `<div class="work-stack">${html}</div>` : html;
    }).join('');
    const p = s.proj ? G.per(s.proj) : null;
    let text;
    if (s.custom) {
      text = `
        <div class="room__text">
          <h2>Formació</h2>
          <ul>${G.formacio.map((x) => `<li><span class="yr">${esc(x.any)}</span>${esc(x.titol)}, ${esc(x.lloc)}</li>`).join('')}</ul>
          <h2>Experiència</h2>
          <ul>${G.experiencia.map((x) => `<li><span class="yr">${esc(x.any)}</span>${esc(x.text)}</li>`).join('')}</ul>
        </div>
        <div class="room__text room__text--contact">
          <h2>${esc(G.nom)}</h2>
          <a class="big-mail" href="mailto:${esc(G.email)}">${esc(G.email)}</a>
          <p style="margin-top:1.2rem"><a href="${esc(G.instagram.url)}" target="_blank" rel="noopener">${esc(G.instagram.usuari)}</a></p>
          <p class="meta">${esc(G.lloc)}, ${esc(G.any)}</p>
        </div>`;
    } else if (p) {
      text = `
        <div class="room__text">
          <h2 id="sala-${s.id}-t">${esc(p.titol)}</h2>
          <p>${esc(p.text)}</p>
          <p class="meta">${esc(metaDe(p))}</p>
        </div>`;
    } else {
      text = `
        <div class="room__text">
          <h2 id="sala-${s.id}-t">${esc(s.text.titol)}</h2>
          ${s.text.p.map((t) => `<p>${esc(t)}</p>`).join('')}
          <p class="meta">${esc(s.text.meta)}</p>
        </div>`;
    }
    return `
      <section class="room${s.custom ? ' room--sortida' : ''}" id="${s.id}" data-nom="${esc(s.nom)}" aria-label="${esc(s.nom)}"
               style="--wall:${s.wall};--ink:${s.ink};--wash:${s.wash}">
        <div class="room__lettering" aria-hidden="true">${s.lettering}</div>
        ${text}
        <div class="room__works">${cols}</div>
      </section>`;
  };

  track.innerHTML = sales.map(salaHtml).join('');
  nav.innerHTML = sales.map((s) => `<a href="#${s.id}" data-room="${s.id}">${esc(s.nom)}</a>`).join('');

  const rooms = [...track.querySelectorAll('.room')];
  let geo = [], vw = 0, vh = 0, maxX = 0, x = 0, active = -1, ticking = false;
  const caminar = !reduced.matches;
  if (caminar) root.classList.add('is-walk');

  /* Textos fixos (marca, menú, indicador): cada un agafa el color de la sala que té al darrere */
  const ui = [];
  function recullUI() {
    ui.length = 0;
    const afegeix = (el, cx) => {
      const r = el.getBoundingClientRect();
      if (r.width) ui.push({ el, cx: cx ?? r.left + r.width / 2, k: -1 });
    };
    afegeix(document.querySelector('.bar__brand'));
    nav.querySelectorAll('a').forEach((a) => afegeix(a));
    afegeix(menu.querySelector('summary'));
    afegeix(nowEl);
    afegeix(hint);
    afegeix(document.querySelector('.hud__line'), vw / 2);
  }

  /* ───────── Mesura i desplaçament ───────── */
  function mesura() {
    vw = innerWidth; vh = innerHeight;
    geo = rooms.map((el) => ({ el, left: el.offsetLeft, width: el.offsetWidth }));
    maxX = Math.max(0, track.offsetWidth - vw);
    if (caminar) walk.style.height = `${maxX + vh}px`;
    recullUI();
    pinta();
  }

  function pinta() {
    ticking = false;
    if (!caminar) return;
    x = clamp(scrollY, 0, maxX);
    track.style.transform = `translate3d(${-x.toFixed(1)}px, 0, 0)`;
    geo.forEach((g) => {
      if (g.left > x + vw || g.left + g.width < x) return;      // només les sales visibles
      g.el.style.setProperty('--rel', Math.max(0, x - g.left).toFixed(1));
    });
    barEl.style.transform = `scaleX(${maxX ? (x / maxX).toFixed(4) : 0})`;
    const ultima = geo.length - 1;
    ui.forEach((u) => {
      const px = x + u.cx;
      let k = geo.findIndex((g) => px >= g.left && px < g.left + g.width);
      if (k < 0) k = px < 0 ? 0 : ultima;
      if (k !== u.k) { u.k = k; u.el.style.color = sales[k].ink; }
    });
    const mig = x + vw / 2;
    const i = Math.max(0, geo.findIndex((g) => mig >= g.left && mig < g.left + g.width));
    if (i !== active) {
      active = i;
      const s = sales[i];
      root.style.setProperty('--ui-ink', s.ink);
      root.style.setProperty('--ui-bg', s.wall);
      nowEl.textContent = s.nom;
      nav.querySelectorAll('a').forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    }
    if (x > 40) hint.classList.add('is-gone');
  }
  const demana = () => { if (!ticking) { ticking = true; requestAnimationFrame(pinta); } };

  addEventListener('scroll', demana, { passive: true });
  addEventListener('resize', mesura);
  addEventListener('load', mesura);
  document.fonts?.ready.then(mesura);
  mesura();

  /* ───────── Entrada addicional: trackpad horitzontal, teclat ───────── */
  if (caminar) {
    addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && !document.querySelector('dialog[open]')) {
        e.preventDefault();
        scrollBy(0, e.deltaX);
      }
    }, { passive: false });
    addEventListener('keydown', (e) => {
      if (document.querySelector('dialog[open]') || e.target.closest('details, a, button, input')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy({ top: vw * 0.45 }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy({ top: -vw * 0.45 }); }
    });
  }

  /* ───────── Navegació entre sales ───────── */
  const vesA = (id) => {
    const g = geo[rooms.findIndex((r) => r.id === id)];
    if (!g) return;
    if (!caminar) { g.el.scrollIntoView({ behavior: 'auto' }); return; }
    scrollTo({ top: g.left, behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-room]');
    if (!a) return;
    e.preventDefault();
    vesA(a.dataset.room);
    if (matchMedia('(max-width: 720px)').matches) menu.open = false;
  });
  // menú: obert a escriptori, plegat a mòbil
  const mq = matchMedia('(min-width: 721px)');
  const menuSegonsMida = () => { menu.open = mq.matches; mesura(); };
  mq.addEventListener('change', menuSegonsMida);
  menu.addEventListener('toggle', recullUI);
  menuSegonsMida();

  /* ───────── Visor, i focus des del teclat ───────── */
  track.addEventListener('click', (e) => {
    const b = e.target.closest('.work__btn');
    if (!b) return;
    GilViewer.open({ items: itemsDe(sales[+b.dataset.sala]), index: +b.dataset.idx, origin: b.querySelector('img') });
  });
  track.addEventListener('focusin', (e) => {
    const b = e.target.closest('.work__btn');
    if (!b || !caminar || !b.matches(':focus-visible')) return;
    const r = b.getBoundingClientRect();
    scrollTo({ top: clamp(r.left + x + r.width / 2 - vw / 2, 0, maxX), behavior: reduced.matches ? 'auto' : 'smooth' });
  });
})();
