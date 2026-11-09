/* Proposta 1 · Paper — renderitza el portafoli a partir de GIL (assets/js/works.js) */
(() => {
  const G = window.GIL;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Cada projecte es maqueta amb files; els números són les columnes (de 12) que ocupa cada foto.
  const patrons = {
    balloon: [[12], [6, 6], [12]],
    buit: [[7, 5], [5, 7]],
    rec0: [[5, 7], [12]],
    encesa: [[12], [7, 5], [12]],
  };

  const fig = (im, span, { lead = false, eager = false } = {}) => `
    <figure class="fig${lead ? ' fig--lead' : ''}" style="--span:${span}">
      <img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}"
           ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </figure>`;

  const projecte = (p, idx) => {
    const files = patrons[p.id];
    let n = 0;
    const rows = files.map((row) => row.map((span) => {
      const im = p.imatges[n];
      const html = fig(im, span, { lead: n === 0, eager: idx === 0 && n === 0 });
      n += 1;
      return html;
    }).join('')).join('');
    return `
      <section class="project" id="${p.id}" aria-labelledby="${p.id}-t">
        <div class="project__info">
          <h2 id="${p.id}-t">${esc(p.titol.toUpperCase())}</h2>
          <p>${esc(p.text)}</p>
          <p class="project__meta">${esc(p.lloc)}<br>${esc(p.any)}</p>
        </div>
        <div class="project__gallery">${rows}</div>
      </section>`;
  };

  document.getElementById('projectes').innerHTML = G.projectes
    .filter((p) => patrons[p.id])
    .map(projecte)
    .join('');

  /* FARS: pàgina divisòria + mosaic de files justificades (cada foto creix segons la seva proporció) */
  const fars = G.per('fars');
  const imatge = (file) => fars.imatges.find((i) => i.file === file);
  const farsFiles = [
    ['fars-logo.png', 'fars-estrella.jpg', 'fars-estrella-3d.jpg'],
    ['fars-arma-paraigua.jpg', 'fars-figures-negres.png'],
    ['fars-bulldog.jpg', 'fars-cara.jpg', 'fars-objectes.jpg'],
    ['fars-samarreta-bulldog.jpg', 'fars-samarreta-figures.jpg', 'fars-samarreta-lletres.jpg', 'fars-samarreta-mascara.jpg'],
    ['fars-samarreta-rosa-1.jpg', 'fars-samarreta-rosa-2.jpg', 'fars-samarreta-catifa-blanca.jpg', 'fars-samarreta-catifa-blava.jpg'],
    ['fars-samarreta-vermella.jpg', 'fars-samarreta-taronja.jpg', 'fars-dessuadora-negra.jpg'],
    ['fars-dessuadora-camuflatge-davant.jpg', 'fars-dessuadora-camuflatge-darrera.jpg', 'fars-figures-dibuix.png'],
    ['fars-banner.jpg'],
    ['fars-cartera-vermella.jpg', 'fars-carteres-munt.jpg'],
    ['fars-carteres-1.jpg', 'fars-carteres-2.jpg'],
  ];
  document.getElementById('fars').innerHTML = `
    <div class="fars__divider">
      <h2 id="fars-titol">FARS</h2>
      <p class="fars__sub">${esc(fars.subtitol.toLowerCase())}</p>
      <p class="fars__text">${esc(fars.text)}</p>
    </div>
    <div class="mosaic">
      ${farsFiles.map((row) => `
        <div class="mosaic__row${row.length === 1 ? ' mosaic__row--solo' : ''}">
          ${row.map((f) => {
            const im = imatge(f);
            return `<figure style="--r:${(im.w / im.h).toFixed(3)}">
              <img src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" loading="lazy" decoding="async">
            </figure>`;
          }).join('')}
        </div>`).join('')}
    </div>`;

  /* Sobre mi (estructura del CV: foto + text, contacte, formació, experiència) */
  document.getElementById('sobre').innerHTML = `
    <h2 id="sobre-titol" class="about__name">GIL FARRÉS HERNÀNDEZ</h2>
    <div class="about__top">
      <figure class="about__photo">
        <img src="${esc(G.retrat.src)}" width="${G.retrat.w}" height="${G.retrat.h}" alt="${esc(G.retrat.alt)}" loading="lazy" decoding="async">
        <figcaption>${esc(G.lloc)}.</figcaption>
      </figure>
      <div class="about__bio">${G.bio.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
    </div>
    <div class="about__row about__row--rule">
      <h3 class="visually-hidden">Contacte</h3>
      <a href="mailto:${esc(G.email)}">${esc(G.email)}</a>
      <a href="${esc(G.instagram.url)}" rel="noopener" target="_blank">${esc(G.instagram.usuari)}</a>
    </div>
    <div class="about__row about__row--list">
      <h3>FORMACIÓ</h3>
      <ul>${G.formacio.map((f) => `<li><strong>${esc(f.any)}&nbsp;&nbsp;${esc(f.titol.toUpperCase())}</strong><br>${esc(f.lloc)}</li>`).join('')}</ul>
    </div>
    <div class="about__row about__row--list">
      <h3>EXPERIÈNCIA</h3>
      <ul>${G.experiencia.map((e) => `<li><span class="yr">${esc(e.any)}</span>${esc(e.text)}</li>`).join('')}</ul>
    </div>`;

  /* Contacte (com la contraportada del PDF, però amb el correu a gran mida) */
  document.getElementById('contacte').innerHTML = `
    <h2 id="contacte-titol" class="visually-hidden">Contacte</h2>
    <a class="contact__mail" href="mailto:${esc(G.email)}">${esc(G.email)}</a>
    <p class="contact__foot">GIL FARRÉS HERNÀNDEZ<br>
      <a href="${esc(G.instagram.url)}" rel="noopener" target="_blank">${esc(G.instagram.usuari)}</a><br>${esc(G.any)}</p>`;

  /* Enllaç actiu a la barra */
  const links = [...document.querySelectorAll('.bar__nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      links[sections.indexOf(e.target)]?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && io.observe(s));
})();
