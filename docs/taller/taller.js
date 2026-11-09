/*
  Proposta 2 · Taller — taulell infinit arrossegable.

  Com funciona:
  · Cada capa és una "rajola" de mida fixa (TW × TH) amb totes les peces col·locades sense solapar-se.
    La rajola es repeteix en 2×2 i la càmera es calcula en mòdul, de manera que el taulell no té vora.
  · Dues capes: el grafisme FARS al fons (es mou més lent) i les fotos al davant (profunditat).
  · Arrossegar (ratolí o dit), roda/trackpad i fletxes del teclat; inèrcia en deixar anar.
  · Les peces són botons reals (només a la còpia principal): accessible amb teclat.
*/
(() => {
  const G = window.GIL;
  const world = document.getElementById('world');
  const layerMain = document.getElementById('layer-main');
  const layerBack = document.getElementById('layer-back');
  const hint = document.getElementById('hint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mod = (n, m) => ((n % m) + m) % m;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ───────── Dades ───────── */
  const peces = G.projectes.flatMap((p) => p.imatges.map((im, i) => ({ p, im, i })));
  const metaDe = (p) => [p.subtitol, p.lloc, p.any].filter(Boolean).join(', ');
  const itemsDe = (p) => p.imatges.map((im) => ({ src: im.src, alt: im.alt, w: im.w, h: im.h, titol: p.titol, meta: metaDe(p), text: p.text }));
  const obre = (p, i, origin) => GilViewer.open({ items: itemsDe(p), index: i, origin });

  // grafisme per a la capa del fons (negre sobre blanc: es fon amb el blau amb multiply)
  const fons = [
    ['fars-logo.png', 'h', 720], ['fars-estrella.jpg', 'h', 640], ['fars-figures-negres.png', 'w', 820],
    ['fars-arma-paraigua.jpg', 'w', 920], ['fars-cara.jpg', 'w', 520], ['fars-figures-dibuix.png', 'w', 700],
    ['fars-estrella-3d.jpg', 'h', 560],
  ].map(([file, side, size]) => ({ im: G.per('fars').imatges.find((x) => x.file === file), side, size }));

  /* ───────── Utilitats de col·locació ───────── */
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Col·loca rectangles dins d'una rajola periòdica, sense solapar-se (tenint en compte el salt de vora).
  function empaqueta(rects, TW, TH, rand, marge) {
    const col = [];
    const xoca = (a, b) => {
      for (const ox of [-TW, 0, TW]) for (const oy of [-TH, 0, TH]) {
        if (a.x < b.x + ox + b.w + marge && a.x + a.w + marge > b.x + ox &&
            a.y < b.y + oy + b.h + marge && a.y + a.h + marge > b.y + oy) return true;
      }
      return false;
    };
    [...rects].sort((a, b) => b.w * b.h - a.w * a.h).forEach((r) => {
      let k = 1, fet = false;
      for (let n = 0; n < 1800 && !fet; n++) {
        if (n && n % 150 === 0) k *= 0.95;        // si no hi cap, la peça s'encongeix una mica
        const w = r.w * k, h = r.h * k;
        const c = { x: rand() * (TW - w), y: rand() * (TH - h), w, h, r };
        if (!col.some((o) => xoca(c, o))) { col.push(c); fet = true; }
      }
      if (!fet) col.push({ x: rand() * (TW - r.w), y: rand() * (TH - r.h), w: r.w, h: r.h, r });
    });
    return col;
  }

  /* ───────── Construcció de les capes ───────── */
  const layers = [];       // { el, TW, TH, speed }
  let primary = [];        // peces reals (botons) de la rajola principal: { el, cx, cy, tipus }
  let S = 1;

  function escala() { return Math.max(0.62, Math.min(1.5, innerWidth / 1440)); }

  function construeix() {
    S = escala();
    layers.length = 0; primary = [];
    layerMain.replaceChildren(); layerBack.replaceChildren();

    /* capa principal */
    const rand = mulberry32(11);
    const TW = 3200 * S, TH = 2200 * S;
    const rects = peces.map(({ p, im, i }) => {
      const vertical = im.h > im.w;
      let L = p.id === 'fars' ? (im.file === 'fars-logo.png' ? 330 : im.w / im.h > 2 ? 430 : 255) : vertical ? 540 : 470;
      L *= S * (0.92 + rand() * 0.2);
      const w = vertical ? L * (im.w / im.h) : L;
      return { p, im, i, w, h: w * (im.h / im.w) };
    });
    const pos = empaqueta(rects, TW, TH, rand, 30 * S);
    const crea = (copia, esPrincipal) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.cssText = `width:${TW}px;height:${TH}px`;
      pos.forEach((c) => {
        const { p, im, i } = c.r;
        const el = document.createElement(esPrincipal ? 'button' : 'div');
        el.className = 'piece';
        el.dataset.pid = p.id; el.dataset.i = i; el.dataset.tipus = p.tipus;
        el.style.cssText = `left:${c.x.toFixed(1)}px;top:${c.y.toFixed(1)}px;width:${c.w.toFixed(1)}px`;
        if (esPrincipal) {
          el.type = 'button';
          el.innerHTML = `<img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" decoding="async"><span class="piece__cap">${esc(p.curt)}, ${esc(p.any)}</span>`;
          primary.push({ el, cx: c.x + c.w / 2, cy: c.y + c.h / 2, tipus: p.tipus, p, i });
        } else {
          el.setAttribute('aria-hidden', 'true');
          el.innerHTML = `<img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="" decoding="async">`;
        }
        tile.append(el);
      });
      return tile;
    };
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const t = crea(i + j * 2, i === 0 && j === 0);
      t.style.left = `${i * TW}px`; t.style.top = `${j * TH}px`;
      layerMain.append(t);
    }
    layers.push({ el: layerMain, TW, TH, speed: 1 });

    /* capa del fons */
    const randB = mulberry32(5);
    const TWb = 3700 * S, THb = 2600 * S;
    const rb = fons.map(({ im, side, size }) => {
      const L = size * S;
      const w = side === 'w' ? L : L * (im.w / im.h);
      return { im, w, h: w * (im.h / im.w) };
    });
    const posB = empaqueta(rb, TWb, THb, randB, 60 * S);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.cssText = `width:${TWb}px;height:${THb}px;left:${i * TWb}px;top:${j * THb}px`;
      posB.forEach((c) => {
        const a = document.createElement('div');
        a.className = 'art';
        a.style.cssText = `left:${c.x.toFixed(1)}px;top:${c.y.toFixed(1)}px;width:${c.w.toFixed(1)}px`;
        a.innerHTML = `<img src="${esc(c.r.im.src)}" alt="" width="${c.r.im.w}" height="${c.r.im.h}" decoding="async">`;
        tile.append(a);
      });
      layerBack.append(tile);
    }
    layers.push({ el: layerBack, TW: TWb, TH: THb, speed: 0.55 });
    aplica();
    refiltra();
  }

  /* ───────── Càmera, amb inèrcia ───────── */
  const cam = { x: 0, y: 0 };
  const tgt = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };      // px/ms
  let dragging = false, raf = 0, last = 0;

  function aplica() {
    layers.forEach((l) => {
      const ox = mod(cam.x * l.speed, l.TW), oy = mod(cam.y * l.speed, l.TH);
      l.el.style.transform = `translate3d(${-ox.toFixed(2)}px, ${-oy.toFixed(2)}px, 0)`;
    });
  }

  function tick(t) {
    const dt = Math.min(48, t - last || 16); last = t;
    if (!dragging && (Math.abs(vel.x) > 0.015 || Math.abs(vel.y) > 0.015)) {
      tgt.x += vel.x * dt; tgt.y += vel.y * dt;
      const f = Math.exp(-dt / 420);
      vel.x *= f; vel.y *= f;
    }
    const k = reduced.matches ? 1 : 1 - Math.exp(-dt / (dragging ? 26 : 120));
    cam.x += (tgt.x - cam.x) * k;
    cam.y += (tgt.y - cam.y) * k;
    aplica();
    const quiet = !dragging && Math.abs(tgt.x - cam.x) < 0.2 && Math.abs(tgt.y - cam.y) < 0.2 && Math.abs(vel.x) < 0.015 && Math.abs(vel.y) < 0.015;
    if (quiet) { cam.x = tgt.x; cam.y = tgt.y; aplica(); raf = 0; } else raf = requestAnimationFrame(tick);
  }
  const desperta = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
  const gust = () => hint.classList.add('is-gone');

  /* centra la càmera en un punt de la rajola principal, triant la còpia més propera */
  function centraEn(cx, cy, immediat = false) {
    const l = layers[0];
    const dx = mod(cx - (cam.x + innerWidth / 2) + l.TW / 2, l.TW) - l.TW / 2;
    const dy = mod(cy - (cam.y + innerHeight / 2) + l.TH / 2, l.TH) - l.TH / 2;
    tgt.x = cam.x + dx; tgt.y = cam.y + dy;
    vel.x = vel.y = 0;
    if (immediat) { cam.x = tgt.x; cam.y = tgt.y; aplica(); } else desperta();
  }

  /* ───────── Entrada: ratolí, tàctil, roda, teclat ───────── */
  let down = null;
  world.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), peca: e.target.closest('.piece'), moved: 0 };
    vel.x = vel.y = 0;
    world.setPointerCapture(e.pointerId);
  });
  world.addEventListener('pointermove', (e) => {
    if (!down || e.pointerId !== down.id) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    const now = performance.now(), dt = Math.max(1, now - down.t);
    down.moved = Math.max(down.moved, Math.hypot(e.clientX - down.sx, e.clientY - down.sy));
    if (down.moved > 6 && !dragging) { dragging = true; world.classList.add('is-dragging'); gust(); }
    if (dragging) {
      tgt.x -= dx; tgt.y -= dy;
      vel.x = vel.x * 0.4 + (-dx / dt) * 0.6;
      vel.y = vel.y * 0.4 + (-dy / dt) * 0.6;
      desperta();
    }
    down.x = e.clientX; down.y = e.clientY; down.t = now;
  });
  const deixa = (e) => {
    if (!down || e.pointerId !== down.id) return;
    const clic = down.moved <= 6 && e.type === 'pointerup' && down.peca;
    if (performance.now() - down.t > 90) vel.x = vel.y = 0;      // s'havia aturat abans de deixar anar
    if (reduced.matches) vel.x = vel.y = 0;
    dragging = false; world.classList.remove('is-dragging');
    const peca = down.peca; down = null;
    if (clic) {
      const p = G.per(peca.dataset.pid);
      obre(p, +peca.dataset.i, peca.querySelector('img'));
    } else desperta();
  };
  world.addEventListener('pointerup', deixa);
  world.addEventListener('pointercancel', deixa);

  world.addEventListener('wheel', (e) => {
    e.preventDefault();
    const m = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    tgt.x += e.deltaX * m; tgt.y += e.deltaY * m;
    vel.x = vel.y = 0; gust(); desperta();
  }, { passive: false });

  addEventListener('keydown', (e) => {
    if (document.body.dataset.view !== 'canvas' || document.querySelector('dialog[open]')) return;
    const pas = e.shiftKey ? 420 : 150;
    const d = { ArrowLeft: [-pas, 0], ArrowRight: [pas, 0], ArrowUp: [0, -pas], ArrowDown: [0, pas] }[e.key];
    if (!d) return;
    e.preventDefault();
    tgt.x += d[0]; tgt.y += d[1]; gust(); desperta();
  });

  // teclat: en enfocar una peça, el taulell la porta al centre. La còpia visible pot ser un clon
  // de la rajola periòdica, així que l'estat de focus es reflecteix a totes les còpies de la peça.
  const marcaFocus = (e, on) => {
    const b = e.target.closest?.('.piece');
    if (!b) return;
    layerMain.querySelectorAll(`.piece[data-pid="${b.dataset.pid}"][data-i="${b.dataset.i}"]`).forEach((c) => c.classList.toggle('is-focus', on));
  };
  layerMain.addEventListener('focusin', (e) => {
    const pc = primary.find((x) => x.el === e.target);
    if (pc && e.target.matches(':focus-visible')) { gust(); marcaFocus(e, true); centraEn(pc.cx, pc.cy); }
  });
  layerMain.addEventListener('focusout', (e) => marcaFocus(e, false));
  // clic amb teclat (Enter/Espai sobre un botó)
  layerMain.addEventListener('click', (e) => {
    if (e.detail !== 0) return;
    const b = e.target.closest('.piece');
    if (b) obre(G.per(b.dataset.pid), +b.dataset.i, b.querySelector('img'));
  });

  /* ───────── Filtres ───────── */
  const filtres = [['tot', 'Tot'], ['instal·lacions', 'Instal·lacions'], ['escenografia', 'Escenografia'], ['fars', 'FARS']];
  let filtreActual = 'tot';
  const fbox = document.getElementById('filters');
  fbox.innerHTML = filtres.map(([k, t]) => `<button type="button" data-f="${k}" aria-pressed="${k === 'tot'}">${t}</button>`).join('');

  function refiltra() {
    world.querySelectorAll('.piece').forEach((el) => {
      el.classList.toggle('is-dim', filtreActual !== 'tot' && el.dataset.tipus !== filtreActual);
    });
  }
  fbox.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filtreActual = b.dataset.f;
    fbox.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    refiltra();
    if (filtreActual === 'tot') return;
    // porta la càmera cap a la peça de la categoria que quedi més a prop del centre
    const l = layers[0];
    const cx = cam.x + innerWidth / 2, cy = cam.y + innerHeight / 2;
    let millor = null, dmin = Infinity;
    primary.filter((x) => x.tipus === filtreActual).forEach((x) => {
      const dx = mod(x.cx - cx + l.TW / 2, l.TW) - l.TW / 2, dy = mod(x.cy - cy + l.TH / 2, l.TH) - l.TH / 2;
      const d = Math.hypot(dx, dy);
      if (d < dmin) { dmin = d; millor = x; }
    });
    if (millor) { gust(); centraEn(millor.cx, millor.cy); }
  });

  /* ───────── Vista en llista ───────── */
  const llista = document.getElementById('llista');
  llista.innerHTML = G.projectes.map((p) => `
    <article class="list__item">
      <div class="list__head">
        <h2>${esc(p.titol)}</h2>
        <p>${esc(p.text)}</p>
        <p class="meta">${esc(metaDe(p))}</p>
      </div>
      <div class="list__thumbs">
        ${p.imatges.map((im, i) => `<button type="button" data-pid="${p.id}" data-i="${i}"><img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" loading="lazy" decoding="async"></button>`).join('')}
      </div>
    </article>`).join('');
  llista.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    obre(G.per(b.dataset.pid), +b.dataset.i, b.querySelector('img'));
  });

  const toggle = document.getElementById('viewtoggle');
  toggle.addEventListener('click', () => {
    const aLlista = document.body.dataset.view === 'canvas';
    document.body.dataset.view = aLlista ? 'list' : 'canvas';
    llista.hidden = !aLlista;
    toggle.textContent = aLlista ? 'Taulell' : 'Llista';
    toggle.setAttribute('aria-pressed', String(aLlista));
    scrollTo(0, 0);
  });

  // l'enllaç «Salta a la llista» obre la vista en llista (el taulell no és navegable amb lector de pantalla)
  document.querySelector('.skip-link').addEventListener('click', (e) => {
    e.preventDefault();
    if (document.body.dataset.view === 'canvas') toggle.click();
    llista.tabIndex = -1;
    llista.focus();
  });

  /* ───────── Sobre mi ───────── */
  const about = document.getElementById('about');
  about.innerHTML = `
    <button type="button" class="about__close" data-close>Tanca</button>
    <div class="about__inner">
      <h2 id="about-t">${esc(G.nom)}</h2>
      <figure><img src="${esc(G.retrat.src)}" width="${G.retrat.w}" height="${G.retrat.h}" alt="${esc(G.retrat.alt)}" decoding="async"><figcaption>${esc(G.lloc)}</figcaption></figure>
      <div class="about__text">${G.bio.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      <div class="about__block"><h3>Formació</h3>
        <ul>${G.formacio.map((f) => `<li><span class="yr">${esc(f.any)}</span>${esc(f.titol)}, ${esc(f.lloc)}</li>`).join('')}</ul></div>
      <div class="about__block"><h3>Experiència</h3>
        <ul>${G.experiencia.map((x) => `<li><span class="yr">${esc(x.any)}</span>${esc(x.text)}</li>`).join('')}</ul></div>
      <p class="about__links"><a href="mailto:${esc(G.email)}">${esc(G.email)}</a>
        <a href="${esc(G.instagram.url)}" target="_blank" rel="noopener">${esc(G.instagram.usuari)}</a></p>
    </div>`;
  document.getElementById('open-about').addEventListener('click', () => about.showModal());
  about.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) about.close(); });

  /* Punt d'inici: el lloc del taulell on el nom (fix al centre) queda enmarcat per obres
     sense quedar tapat. Es calcula per cada mida de pantalla de forma determinista. */
  let iniciXY = { x: 0, y: 0 };
  function calculaInici() {
    const l = layers[0], vw = innerWidth, vh = innerHeight;
    const caixa = { w: vw * 0.9, h: vh * 0.5 };           // zona on viu el nom
    const dades = primary.map((x) => ({ x: parseFloat(x.el.style.left), y: parseFloat(x.el.style.top), w: parseFloat(x.el.style.width), h: x.el.offsetHeight, fars: x.tipus === 'fars' }));
    const minObres = vw < 720 ? 2 : 3;                     // obres d'instal·lació/escenografia ben visibles a l'obrir
    let millor = null, score = Infinity;
    for (let cx = 0; cx < l.TW; cx += 60) for (let cy = 0; cy < l.TH; cy += 60) {
      let cobert = 0, visibles = 0, obres = 0;
      for (const d of dades) for (const ox of [-l.TW, 0, l.TW]) for (const oy of [-l.TH, 0, l.TH]) {
        const x0 = d.x + ox - (cx - vw / 2), y0 = d.y + oy - (cy - vh / 2);
        if (x0 < vw - 60 && x0 + d.w > 60 && y0 < vh - 60 && y0 + d.h > 60) {
          visibles++;
          // «ben visible»: com a mínim el 75 % de la peça dins la pantalla
          const dins = (Math.min(x0 + d.w, vw) - Math.max(x0, 0)) * (Math.min(y0 + d.h, vh) - Math.max(y0, 0));
          if (!d.fars && dins >= 0.75 * d.w * d.h) obres++;
        }
        const ix = Math.max(0, Math.min(x0 + d.w, (vw + caixa.w) / 2) - Math.max(x0, (vw - caixa.w) / 2));
        const iy = Math.max(0, Math.min(y0 + d.h, (vh + caixa.h) / 2) - Math.max(y0, (vh - caixa.h) / 2));
        cobert += ix * iy;
      }
      const s = Math.abs(cobert / (caixa.w * caixa.h) - 0.2) + (visibles < 6 ? 1 : 0) + Math.max(0, minObres - obres) * 0.5;
      if (s < score) { score = s; millor = { x: cx, y: cy }; }
    }
    return millor;
  }

  document.getElementById('home').addEventListener('click', () => {
    if (document.body.dataset.view === 'list') toggle.click();
    centraEn(iniciXY.x, iniciXY.y);
  });

  /* ───────── Arrencada ───────── */
  construeix();
  iniciXY = calculaInici();
  centraEn(iniciXY.x, iniciXY.y, true);

  let amplada = innerWidth;
  let tRedim;
  addEventListener('resize', () => {
    clearTimeout(tRedim);
    tRedim = setTimeout(() => {
      if (Math.abs(escala() - S) > 0.08 || Math.abs(innerWidth - amplada) > 400) {
        amplada = innerWidth;
        construeix();
        iniciXY = calculaInici();
        centraEn(iniciXY.x, iniciXY.y, true);
      } else aplica();
    }, 200);
  });
})();
