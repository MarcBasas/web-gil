/*
  Idiomes (cat · es · en). Només el carrega Taller; Paper i Sala continuen en català.

  · El català és l'ORIGINAL (assets/js/works.js, tal com surt del CV i del portafoli de Gil).
  · Castellà i anglès són TRADUCCIONS: cal que Gil les revisi (sobretot el to de la biografia
    i els títols). Els títols de les obres («Omplint el buit», Rec.0, FARS) es deixen en l'original.
  · setLang() reescriu en lloc els textos de window.GIL (títols, descripcions, alts, biografia, CV),
    així que la resta del codi no ha de saber res d'idiomes. Avisa amb l'esdeveniment «gil:lang».
  · Ordre d'elecció: ?lang=xx a l'adreça · tria guardada del visitant · idioma del navegador · anglès.
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
      f_tot: 'Tot', f_inst: 'Instal·lacions', f_esc: 'Escenografia', f_fars: 'FARS',
      v_list: 'Llista', v_board: 'Taulell',
      world_aria: 'Taula de treball. Arrossega per explorar les obres.', nav_aria: 'Informació',
      filters_aria: 'Filtra les obres', lang_aria: 'Llengua', list_aria: 'Llista d’obres',
      prev: 'Anterior', next: 'Següent', close: 'Tanca', viewer_aria: 'Imatge ampliada',
      formation: 'Formació', experience: 'Experiència',
      title: 'Gil Farrés · Taller',
      desc: 'Taula de treball de Gil Farrés: instal·lacions, escenografia i la marca FARS.',
    },
    es: {
      skip: 'Saltar a la lista de obras', about: 'Sobre mí', contact: 'Contacto', hint: 'Arrastra para explorar',
      f_tot: 'Todo', f_inst: 'Instalaciones', f_esc: 'Escenografía', f_fars: 'FARS',
      v_list: 'Lista', v_board: 'Tablero',
      world_aria: 'Mesa de trabajo. Arrastra para explorar las obras.', nav_aria: 'Información',
      filters_aria: 'Filtrar las obras', lang_aria: 'Idioma', list_aria: 'Lista de obras',
      prev: 'Anterior', next: 'Siguiente', close: 'Cerrar', viewer_aria: 'Imagen ampliada',
      formation: 'Formación', experience: 'Experiencia',
      title: 'Gil Farrés · Taller',
      desc: 'Mesa de trabajo de Gil Farrés: instalaciones, escenografía y la marca FARS.',
    },
    en: {
      skip: 'Skip to the list of works', about: 'About', contact: 'Contact', hint: 'Drag to explore',
      f_tot: 'All', f_inst: 'Installations', f_esc: 'Set design', f_fars: 'FARS',
      v_list: 'List', v_board: 'Board',
      world_aria: 'Worktable. Drag to explore the works.', nav_aria: 'Information',
      filters_aria: 'Filter the works', lang_aria: 'Language', list_aria: 'List of works',
      prev: 'Previous', next: 'Next', close: 'Close', viewer_aria: 'Enlarged image',
      formation: 'Education', experience: 'Experience',
      title: 'Gil Farrés · Workshop',
      desc: 'Gil Farrés’s worktable: installations, set design and the FARS label.',
    },
  };

  /* ───────── Traduccions del contingut (el català és l'original) ───────── */
  const TX = {
    es: {
      projectes: {
        balloon: {
          titol: 'Instalación European Balloon Festival',
          text: 'Instalación de la pieza hinchable «Omplint el buit» en el festival European Balloon Festival, en colaboración con Iglusdevent.',
        },
        buit: { text: 'Proyecto sobre la vida pasada en el barrio del Rec de Igualada. Serie de instalaciones hinchables.' },
        rec0: { text: 'Diseño y producción de espacios para el festival Rec.0.' },
        encesa: {
          titol: 'Encendido de las luces de Navidad de Igualada',
          curt: 'Encendido de luces de Navidad',
          text: 'Diseño y producción de escenografía para el encendido de las luces de Navidad de Igualada. Encargo del Ayuntamiento de Igualada.',
        },
        fars: {
          subtitol: 'Concepto de marca',
          text: 'Marca propia de complementos, entendida como un espacio de investigación, experimentación y creación personal donde explorar materiales, técnicas y conceptos al margen de los encargos profesionales.',
        },
      },
      retrat: 'Retrato de Gil Farrés.',
      alts: {
        'balloon-1.jpg': 'Pieza hinchable translúcida y blanca en el interior de una gran estructura hinchable de tonos verdosos.',
        'balloon-2.jpg': 'Cúpula hinchable blanca con la base naranja en una nave con ventanales; delante, dos pedestales de madera con un libro abierto.',
        'balloon-3.jpg': 'Dos personas observan los pedestales de madera frente a la cúpula hinchable.',
        'balloon-4.jpg': 'Los tubos hinchables blancos y translúcidos vistos de cerca, dentro de la estructura.',
        'buit-1.jpg': 'Pieza hinchable translúcida de tubos entrelazados dentro de una antigua sala con vigas de madera.',
        'buit-2.jpg': 'Un tubo hinchable gris sigue el curso del Rec entre muros de piedra y vegetación.',
        'buit-3.jpg': 'Un tubo hinchable blanco con un nudo se extiende sobre la hierba, con el barrio al fondo.',
        'buit-4.jpg': 'Un nudo hinchable iluminado de noche frente a un muro de piedra.',
        'rec0-1.jpg': 'Escenografía de cajas de plástico azules apiladas, con sillas de madera, una columna naranja y una rosa.',
        'rec0-2.jpg': 'Público sentado ante un concierto, con las cajas azules y las columnas de colores al fondo.',
        'rec0-3.jpg': 'Una pequeña casa de madera cubierta de cajas azules, a modo de parada de autobús, con un autobús al fondo.',
        'encesa-1.jpg': 'Una gran pieza blanca con forma de roca flota sobre la plaza, con una figura debajo y la gente alrededor.',
        'encesa-2.jpg': 'La pieza iluminada cuelga sobre la avenida de árboles con luces, entre una multitud.',
        'encesa-3.jpg': 'La pieza brilla sobre la gente, que levanta los móviles para fotografiarla.',
        'encesa-4.jpg': 'La pieza flotando sobre la plaza de noche, con globos de colores entre el público.',
        'fars-logo.png': 'Logotipo FARS: las letras F, A, R y S bordean una figura negra con cresta de espigas.',
        'fars-estrella.jpg': 'Estrella de ocho puntas con contorno negro, con unas letras en el centro.',
        'fars-estrella-3d.jpg': 'La misma estrella en relieve, con aspecto brillante e hinchado.',
        'fars-arma-paraigua.jpg': 'Dibujo a línea de un fusil y un paraguas con estrellas que estallan.',
        'fars-bulldog.jpg': 'Un bulldog rojo con cuatro círculos que llevan las letras F, A, R y S.',
        'fars-cara.jpg': 'Dibujo a tinta de un rostro esquemático dentro de un recuadro.',
        'fars-figures-negres.png': 'Tres figuras negras en movimiento, en tinta.',
        'fars-objectes.jpg': 'Tres piezas de color: una pastilla azul, una estrella roja y una figurita naranja.',
        'fars-samarreta-bulldog.jpg': 'Camiseta blanca con el logotipo FARS y un bulldog.',
        'fars-samarreta-figures.jpg': 'Camiseta blanca con tres figuras con cresta de colores.',
        'fars-samarreta-lletres.jpg': 'Camiseta blanca con tres figuras y el logotipo FARS en letras cromadas.',
        'fars-samarreta-mascara.jpg': 'Camiseta blanca con una figura negra encapuchada con orejas y el logotipo FARS.',
        'fars-samarreta-rosa-1.jpg': 'Camiseta rosa con un rostro en relieve y el nombre FARS escrito a mano.',
        'fars-samarreta-rosa-2.jpg': 'Camiseta rosa con un rostro estampado en negro y el nombre FARS escrito a mano.',
        'fars-samarreta-catifa-blanca.jpg': 'Camiseta blanca con tres figuras de colores, sobre una alfombra estampada.',
        'fars-samarreta-catifa-blava.jpg': 'Camiseta azul marino con tres figuras de colores, sobre una alfombra estampada.',
        'fars-samarreta-vermella.jpg': 'Camiseta roja con un círculo de estrellas alrededor del logotipo FARS.',
        'fars-samarreta-taronja.jpg': 'Camiseta naranja con el logotipo FARS dibujado con líneas rojas.',
        'fars-dessuadora-negra.jpg': 'Sudadera negra con cremallera y una figura encapuchada en blanco, con el logotipo FARS.',
        'fars-dessuadora-camuflatge-davant.jpg': 'Sudadera de camuflaje con cremallera y el logotipo FARS en rojo, vista frontal.',
        'fars-dessuadora-camuflatge-darrera.jpg': 'La misma sudadera de camuflaje, vista por detrás, con una figura roja.',
        'fars-figures-dibuix.png': 'Tres figuras con cresta cogidas de la mano, en dibujo de tinta.',
        'fars-banner.jpg': 'El logotipo FARS en blanco sobre una fotografía nocturna de un paseo con palmeras.',
        'fars-cartera-vermella.jpg': 'Cartera de piel roja con tachuelas metálicas y la estrella FARS en relieve.',
        'fars-carteres-1.jpg': 'Cuatro carteras de piel de colores con la estrella FARS grabada, sobre una plancha de corte verde.',
        'fars-carteres-2.jpg': 'Carteras de piel azules, grises y naranjas con figuras y letras grabadas.',
        'fars-carteres-munt.jpg': 'Un montón de carteras de piel de colores sobre una mesa de madera.',
      },
      bio: [
        'Graduado en 2025 en Artes y Diseño en la Escola Massana, soy una persona creativa, curiosa y con una mirada abierta hacia las nuevas tendencias y formas de expresión. Me interesa investigar e innovar desde la actualidad, teniendo siempre presentes las tendencias artísticas y culturales como punto de partida para desarrollar nuevas ideas y proyectos.',
        'Mi experiencia en ámbitos tan diversos como el trabajo analógico, artesanal y digital me ha permitido adquirir una mirada transversal y explorar distintas maneras de entender y materializar la creatividad. Esta combinación de técnicas y perspectivas me permite adaptarme a distintos procesos de trabajo y encontrar nuevas formas de resolver y desarrollar proyectos.',
        'He participado en proyectos artísticos, culturales y de producción, como el proyecto propio «Omplint el buit», actualmente en marcha y expuesto en el marco del Balloon Festival, así como en tareas de ayudante de dirección creativa y producción en el festival Rec.0 de Igualada. También he trabajado en el diseño y la producción de escenografías para distintos proyectos, explorando la relación entre espacio, materiales y narrativa visual.',
        'Actualmente busco seguir creciendo profesionalmente y ampliar mis conocimientos, descubriendo nuevos campos, técnicas y formas de trabajo que me permitan seguir desarrollando proyectos con una mirada creativa, contemporánea y experimental.',
      ],
      formacio: [{ titol: 'Grado universitario en Artes y Diseño' }, { titol: 'Bachillerato artístico' }],
      experiencia: [
        'Producción de complementos para marca propia (@gfars_)',
        'Diseño y producción de escenografía para el espectáculo «Hamlet», de Albert Pla y Peyu',
        'Presentación del proyecto «Omplint el buit» (instalación)',
        'Diseño y producción de escenografía para el encendido de las luces de Navidad de Igualada, para el Ayuntamiento de Igualada',
        'Ayudante de dirección creativa y producción en el festival Rec.0',
        'Instalación «Omplint el buit» en el European Balloon Festival, en colaboración con Iglusdevent',
      ],
    },

    en: {
      projectes: {
        balloon: {
          titol: 'European Balloon Festival installation',
          text: 'Installation of the inflatable piece “Omplint el buit” at the European Balloon Festival, in collaboration with Iglusdevent.',
        },
        buit: { text: 'A project about past life in Igualada’s Rec neighbourhood. A series of inflatable installations.' },
        rec0: { titol: 'Rec.0 Festival', curt: 'Rec.0 Festival', text: 'Design and production of spaces for the Rec.0 festival.' },
        encesa: {
          titol: 'Igualada Christmas lights switch-on',
          curt: 'Christmas lights switch-on',
          text: 'Set design and production for the Igualada Christmas lights switch-on. Commissioned by the Igualada City Council.',
        },
        fars: {
          subtitol: 'Brand concept',
          text: 'A personal accessories label, understood as a space for research, experimentation and personal creation, where materials, techniques and concepts can be explored outside professional commissions.',
        },
      },
      retrat: 'Portrait of Gil Farrés.',
      alts: {
        'balloon-1.jpg': 'Translucent white inflatable piece inside a large inflatable structure in greenish tones.',
        'balloon-2.jpg': 'White inflatable dome with an orange base in a hall with large windows; in front, two wooden plinths with an open book.',
        'balloon-3.jpg': 'Two people look at the wooden plinths in front of the inflatable dome.',
        'balloon-4.jpg': 'The white translucent inflatable tubes seen up close, inside the structure.',
        'buit-1.jpg': 'Translucent inflatable piece of interlaced tubes inside an old room with wooden beams.',
        'buit-2.jpg': 'A grey inflatable tube follows the course of the Rec between stone walls and vegetation.',
        'buit-3.jpg': 'A white inflatable tube with a knot stretches across the grass, with the neighbourhood behind.',
        'buit-4.jpg': 'A lit inflatable knot at night in front of a stone wall.',
        'rec0-1.jpg': 'Set made of stacked blue plastic crates, with wooden chairs, an orange column and a pink one.',
        'rec0-2.jpg': 'Audience seated at a concert, with the blue crates and coloured columns behind.',
        'rec0-3.jpg': 'A small wooden house covered in blue crates, serving as a bus stop, with a bus behind.',
        'encesa-1.jpg': 'A large white rock-shaped piece floats above the square, with a figure beneath it and people around.',
        'encesa-2.jpg': 'The lit piece hangs over the tree-lined avenue strung with lights, above a crowd.',
        'encesa-3.jpg': 'The piece glows above the crowd, who hold up their phones to photograph it.',
        'encesa-4.jpg': 'The piece floating above the square at night, with coloured balloons among the audience.',
        'fars-logo.png': 'FARS logo: the letters F, A, R and S frame a black figure with a spiked crest.',
        'fars-estrella.jpg': 'Eight-pointed star with a black outline and lettering in the centre.',
        'fars-estrella-3d.jpg': 'The same star in relief, with a glossy, inflated look.',
        'fars-arma-paraigua.jpg': 'Line drawing of a rifle and an umbrella with bursting stars.',
        'fars-bulldog.jpg': 'A red bulldog with four circles bearing the letters F, A, R and S.',
        'fars-cara.jpg': 'Ink drawing of a schematic face inside a frame.',
        'fars-figures-negres.png': 'Three black figures in motion, in ink.',
        'fars-objectes.jpg': 'Three coloured pieces: a blue pill, a red star and a small orange figure.',
        'fars-samarreta-bulldog.jpg': 'White T-shirt with the FARS logo and a bulldog.',
        'fars-samarreta-figures.jpg': 'White T-shirt with three crested figures in colour.',
        'fars-samarreta-lletres.jpg': 'White T-shirt with three figures and the FARS logo in chrome lettering.',
        'fars-samarreta-mascara.jpg': 'White T-shirt with a hooded black figure with ears and the FARS logo.',
        'fars-samarreta-rosa-1.jpg': 'Pink T-shirt with a face in relief and the name FARS handwritten.',
        'fars-samarreta-rosa-2.jpg': 'Pink T-shirt with a face printed in black and the name FARS handwritten.',
        'fars-samarreta-catifa-blanca.jpg': 'White T-shirt with three coloured figures, laid on a patterned rug.',
        'fars-samarreta-catifa-blava.jpg': 'Navy T-shirt with three coloured figures, laid on a patterned rug.',
        'fars-samarreta-vermella.jpg': 'Red T-shirt with a circle of stars around the FARS logo.',
        'fars-samarreta-taronja.jpg': 'Orange T-shirt with the FARS logo drawn in red lines.',
        'fars-dessuadora-negra.jpg': 'Black zip-up sweatshirt with a hooded figure in white, with the FARS logo.',
        'fars-dessuadora-camuflatge-davant.jpg': 'Camouflage zip-up sweatshirt with the FARS logo in red, front view.',
        'fars-dessuadora-camuflatge-darrera.jpg': 'The same camouflage sweatshirt, seen from behind, with a red figure.',
        'fars-figures-dibuix.png': 'Three crested figures holding hands, in an ink drawing.',
        'fars-banner.jpg': 'The FARS logo in white over a night photograph of a promenade with palm trees.',
        'fars-cartera-vermella.jpg': 'Red leather wallet with metal studs and the FARS star in relief.',
        'fars-carteres-1.jpg': 'Four coloured leather wallets with the FARS star engraved, on a green cutting mat.',
        'fars-carteres-2.jpg': 'Blue, grey and orange leather wallets with engraved figures and lettering.',
        'fars-carteres-munt.jpg': 'A pile of coloured leather wallets on a wooden table.',
      },
      bio: [
        'I graduated in Arts and Design from the Escola Massana in 2025. I am a creative, curious person with an open mind towards new trends and forms of expression. I am interested in researching and innovating from the present, always taking artistic and cultural trends as a starting point for developing new ideas and projects.',
        'My experience in fields as diverse as analogue, handcrafted and digital work has given me a cross-disciplinary outlook and let me explore different ways of understanding and materialising creativity. This combination of techniques and perspectives allows me to adapt to different working processes and find new ways of solving and developing projects.',
        'I have taken part in artistic, cultural and production projects, such as my own project “Omplint el buit”, currently live and on show at the Balloon Festival, and as assistant creative director and producer at the Rec.0 festival in Igualada. I have also designed and produced sets for a range of projects, exploring the relationship between space, materials and visual narrative.',
        'I am currently looking to keep growing professionally and broaden my knowledge, discovering new fields, techniques and ways of working that let me keep developing projects with a creative, contemporary and experimental outlook.',
      ],
      formacio: [{ titol: 'University degree in Arts and Design' }, { titol: 'Arts baccalaureate' }],
      experiencia: [
        'Production of accessories for a personal label (@gfars_)',
        'Set design and production for the show “Hamlet”, by Albert Pla and Peyu',
        'Presentation of the project “Omplint el buit” (installation)',
        'Set design and production for the Igualada Christmas lights switch-on, for the Igualada City Council',
        'Assistant creative director and producer at the Rec.0 festival',
        'Installation “Omplint el buit” at the European Balloon Festival, in collaboration with Iglusdevent',
      ],
    },
  };

  /* ───────── Còpia de l'original en català ───────── */
  const base = {
    proj: Object.fromEntries(G.projectes.map((p) => [p.id, { titol: p.titol, curt: p.curt, subtitol: p.subtitol, text: p.text }])),
    alts: Object.fromEntries(G.projectes.flatMap((p) => p.imatges.map((im) => [im.file, im.alt]))),
    retrat: G.retrat.alt,
    bio: [...G.bio],
    formacio: G.formacio.map((f) => ({ titol: f.titol })),
    experiencia: G.experiencia.map((e) => e.text),
  };

  /* ───────── Aplicar un idioma (reescriu GIL en lloc) ───────── */
  function apply(code) {
    const tx = TX[code] || null;                          // null = català (l'original)
    const falta = (que) => console.warn(`[i18n:${code}] sense traducció: ${que}`);

    G.projectes.forEach((p) => {
      const b = base.proj[p.id];
      const o = (tx && tx.projectes && tx.projectes[p.id]) || {};
      ['titol', 'curt', 'subtitol', 'text'].forEach((k) => { p[k] = (tx && o[k]) || b[k]; });
      p.imatges.forEach((im) => {
        const a = tx && tx.alts && tx.alts[im.file];
        if (tx && !a) falta(`alt de ${im.file}`);
        im.alt = a || base.alts[im.file];
      });
    });
    G.retrat.alt = (tx && tx.retrat) || base.retrat;
    if (tx && (!tx.bio || tx.bio.length !== base.bio.length)) falta('biografia');
    G.bio = (tx && tx.bio && tx.bio.length === base.bio.length) ? tx.bio : base.bio;
    G.formacio.forEach((f, i) => { f.titol = (tx && tx.formacio && tx.formacio[i] && tx.formacio[i].titol) || base.formacio[i].titol; });
    G.experiencia.forEach((e, i) => { e.text = (tx && tx.experiencia && tx.experiencia[i]) || base.experiencia[i]; });
  }

  /* ───────── Text estàtic de la pàgina ───────── */
  const t = (key) => (UI[G.lang] && UI[G.lang][key]) || UI.ca[key] || key;

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
    apply(code);
    traduirDom();
    if (persist) guarda(code);
    window.dispatchEvent(new CustomEvent('gil:lang', { detail: code }));
  }

  G.langs = LANGS;
  G.t = t;
  G.setLang = setLang;
  setLang(inicial());

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b && b.dataset.lang !== G.lang) setLang(b.dataset.lang, { persist: true });
  });
})();
