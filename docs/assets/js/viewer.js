/*
  Visor d'imatge ampliada. Ús:
    GilViewer.open({ items: [{ src, alt, w, h, titol, meta, text }], index: 0, origin: <img opcional> })
  - <dialog> natiu (focus atrapat, Esc per tancar)
  - Fletxes del teclat i lliscament per canviar d'imatge
  - Si el navegador suporta View Transitions, la foto creix des del seu lloc d'origen i hi torna en tancar.
*/
(function () {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canTransition = () => typeof document.startViewTransition === 'function' && !reduced();
  let dlg, img, title, meta, text, prev, next;
  let state = null;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'viewer';
    dlg.setAttribute('aria-label', 'Imatge ampliada');
    dlg.innerHTML = `
      <div class="viewer__stage"><img class="viewer__img" alt=""></div>
      <div class="viewer__bar">
        <div class="viewer__cap">
          <p class="viewer__title"></p>
          <p class="viewer__meta"></p>
          <p class="viewer__text"></p>
        </div>
        <div class="viewer__nav">
          <button type="button" data-act="prev">Anterior</button>
          <button type="button" data-act="next">Següent</button>
          <button type="button" data-act="close">Tanca</button>
        </div>
      </div>`;
    document.body.append(dlg);
    img = dlg.querySelector('.viewer__img');
    title = dlg.querySelector('.viewer__title');
    meta = dlg.querySelector('.viewer__meta');
    text = dlg.querySelector('.viewer__text');
    prev = dlg.querySelector('[data-act=prev]');
    next = dlg.querySelector('[data-act=next]');

    dlg.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'close' || e.target === dlg) close();
      else if (act === 'prev') go(-1);
      else if (act === 'next') go(1);
    });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

    // lliscament horitzontal sobre l'imatge (tàctil o ratolí)
    let x0 = null;
    const stage = dlg.querySelector('.viewer__stage');
    stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    });
  }

  function paint(i) {
    const it = state.items[i];
    img.src = it.src;
    img.alt = it.alt || '';
    if (it.w && it.h) {
      img.width = it.w; img.height = it.h;
      // ampliar fins a 1,8× la mida original: més enllà es veuria pixelada
      img.style.maxWidth = `${Math.round(it.w * 1.8)}px`;
      img.style.maxHeight = `${Math.round(it.h * 1.8)}px`;
    }
    title.textContent = it.titol || '';
    meta.textContent = it.meta || '';
    text.textContent = it.text || '';
    text.hidden = !it.text;
    prev.disabled = i === 0;
    next.disabled = i === state.items.length - 1;
    const n = state.items[i + 1];
    if (n) new Image().src = n.src; // precàrrega de la següent
  }

  function go(d) {
    const i = state.index + d;
    if (i < 0 || i >= state.items.length) return;
    state.index = i;
    if (reduced()) { paint(i); return; }
    img.classList.add('is-swapping');
    setTimeout(() => { paint(i); img.classList.remove('is-swapping'); }, 160);
  }

  function open({ items, index = 0, origin = null }) {
    if (!dlg) build();
    state = { items, index, origin, originIndex: index };
    const useVT = canTransition() && origin;
    const show = () => {
      paint(index);
      if (!dlg.open) dlg.showModal();
      if (useVT) { origin.style.viewTransitionName = ''; img.style.viewTransitionName = 'viewer-img'; }
      dlg.querySelector('[data-act=close]').focus({ preventScroll: true });
    };
    if (useVT) {
      origin.style.viewTransitionName = 'viewer-img';
      document.startViewTransition(show).finished.finally(() => { img.style.viewTransitionName = ''; });
    } else show();
  }

  function close() {
    if (!dlg || !dlg.open) return;
    const { origin, index, originIndex } = state;
    // la foto només "torna" al seu lloc si encara es mostra la mateixa imatge d'origen
    const goesHome = canTransition() && origin && document.contains(origin) && index === originIndex;
    if (goesHome) {
      img.style.viewTransitionName = 'viewer-img';
      const t = document.startViewTransition(() => {
        img.style.viewTransitionName = '';
        dlg.close();
        origin.style.viewTransitionName = 'viewer-img';
      });
      t.finished.finally(() => { origin.style.viewTransitionName = ''; });
    } else {
      dlg.close();
    }
  }

  window.GilViewer = { open, close };
})();
