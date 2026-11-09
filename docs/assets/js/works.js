/*
  Dades compartides per les tres propostes (Paper, Taller, Sala).
  Per afegir o canviar una obra només cal editar aquest fitxer.
  Les imatges viuen a /assets/img/. Els textos vénen del CV i del portafoli de Gil.
*/
(function () {
  const base = new URL('../img/', document.currentScript.src).href;
  const img = (file, w, h, alt) => ({ file, src: base + file, w, h, alt });

  const projectes = [
    {
      id: 'balloon',
      tipus: 'instal·lacions',
      titol: 'Instal·lació European Balloon Festival',
      curt: 'European Balloon Festival',
      any: '2026',
      lloc: 'Igualada, Barcelona',
      text: 'Instal·lació de la peça inflable «Omplint el buit» al festival European Balloon Festival, en col·laboració amb Iglusdevent.',
      imatges: [
        img('balloon-1.jpg', 1090, 726, 'Peça inflable translúcida i blanca a l’interior d’una gran estructura inflable de tons verdosos.'),
        img('balloon-2.jpg', 1090, 726, 'Cúpula inflable blanca amb la base taronja en una nau amb finestrals; al davant, dos pedestals de fusta amb un llibre obert.'),
        img('balloon-3.jpg', 1091, 727, 'Dues persones observen els pedestals de fusta davant la cúpula inflable.'),
        img('balloon-4.jpg', 1091, 727, 'Els tubs inflables blancs i translúcids vistos de prop, dins l’estructura.'),
      ],
    },
    {
      id: 'buit',
      tipus: 'instal·lacions',
      titol: 'Omplint el buit',
      curt: 'Omplint el buit',
      any: '2025',
      lloc: 'Igualada, Barcelona',
      text: 'Projecte sobre la vida passada al barri del Rec d’Igualada. Sèrie d’instal·lacions inflables.',
      imatges: [
        img('buit-1.jpg', 1090, 727, 'Peça inflable translúcida de tubs entrellaçats dins d’una antiga sala amb bigues de fusta.'),
        img('buit-2.jpg', 1090, 727, 'Un tub inflable gris segueix el curs del Rec entre murs de pedra i vegetació.'),
        img('buit-3.jpg', 1090, 728, 'Un tub inflable blanc amb un nus s’estén sobre l’herba, amb el barri al fons.'),
        img('buit-4.jpg', 1090, 727, 'Un nus inflable il·luminat de nit davant d’un mur de pedra.'),
      ],
    },
    {
      id: 'rec0',
      tipus: 'escenografia',
      titol: 'Festival Rec.0',
      curt: 'Festival Rec.0',
      any: '2026',
      lloc: 'Igualada, Barcelona',
      text: 'Disseny i producció d’espais per al festival Rec.0.',
      imatges: [
        img('rec0-1.jpg', 991, 1329, 'Escenografia de caixes de plàstic blaves apilades, amb cadires de fusta, una columna taronja i una de rosa.'),
        img('rec0-2.jpg', 1090, 722, 'Públic assegut davant d’un concert, amb les caixes blaves i les columnes de colors al fons.'),
        img('rec0-3.jpg', 1090, 703, 'Una petita casa de fusta coberta de caixes blaves, a mode de parada d’autobús, amb un autobús al fons.'),
      ],
    },
    {
      id: 'encesa',
      tipus: 'escenografia',
      titol: 'Encesa de llums de Nadal d’Igualada',
      curt: 'Encesa de llums de Nadal',
      any: '2025',
      lloc: 'Igualada, Barcelona',
      text: 'Disseny i producció d’escenografia per a l’encesa de llums de Nadal d’Igualada. Encarregat per l’Ajuntament d’Igualada.',
      imatges: [
        img('encesa-1.jpg', 1090, 767, 'Una gran peça blanca amb forma de roca flota sobre la plaça, amb una figura a sota i la gent al voltant.'),
        img('encesa-2.jpg', 1091, 672, 'La peça il·luminada penja sobre l’avinguda d’arbres amb llums, entre una multitud.'),
        img('encesa-3.jpg', 1090, 766, 'La peça brilla sobre la gent, que aixeca els mòbils per fotografiar-la.'),
        img('encesa-4.jpg', 1090, 672, 'La peça flotant sobre la plaça de nit, amb globus de colors entre el públic.'),
      ],
    },
    {
      id: 'fars',
      tipus: 'fars',
      titol: 'FARS',
      curt: 'FARS',
      any: '2024',
      lloc: '',
      subtitol: 'Concepte de marca',
      text: 'Marca pròpia de complements, entesa com un espai d’investigació, experimentació i creació personal on explorar materials, tècniques i conceptes al marge dels encàrrecs professionals.',
      imatges: [
        // grafisme
        img('fars-logo.png', 1658, 1906, 'Logotip FARS: les lletres F, A, R i S voregen una figura negra amb cresta d’espigues.'),
        img('fars-estrella.jpg', 399, 616, 'Estrella de vuit puntes amb contorn negre, amb unes lletres al centre.'),
        img('fars-estrella-3d.jpg', 399, 616, 'La mateixa estrella en relleu, amb aspecte brillant i inflat.'),
        img('fars-arma-paraigua.jpg', 1090, 390, 'Dibuix a línia d’un fusell i un paraigua amb estrelles que esclaten.'),
        img('fars-bulldog.jpg', 545, 342, 'Un bulldog vermell amb quatre cercles que porten les lletres F, A, R i S.'),
        img('fars-cara.jpg', 499, 362, 'Dibuix a tinta d’un rostre esquemàtic dins d’un requadre.'),
        img('fars-figures-negres.png', 1170, 417, 'Tres figures negres en moviment, en tinta.'),
        img('fars-objectes.jpg', 928, 369, 'Tres peces de color: una pastilla blava, una estrella vermella i una figureta taronja.'),
        // roba
        img('fars-samarreta-bulldog.jpg', 522, 665, 'Samarreta blanca amb el logotip FARS i un bulldog.'),
        img('fars-samarreta-figures.jpg', 510, 665, 'Samarreta blanca amb tres figures amb cresta de colors.'),
        img('fars-samarreta-lletres.jpg', 522, 630, 'Samarreta blanca amb tres figures i el logotip FARS en lletres cromades.'),
        img('fars-samarreta-mascara.jpg', 511, 630, 'Samarreta blanca amb una figura negra encaputxada amb orelles i el logotip FARS.'),
        img('fars-samarreta-rosa-1.jpg', 585, 531, 'Samarreta rosa amb un rostre en relleu i el nom FARS escrit a mà.'),
        img('fars-samarreta-rosa-2.jpg', 596, 520, 'Samarreta rosa amb un rostre estampat en negre i el nom FARS escrit a mà.'),
        img('fars-samarreta-catifa-blanca.jpg', 506, 531, 'Samarreta blanca amb tres figures de colors, sobre una catifa estampada.'),
        img('fars-samarreta-catifa-blava.jpg', 495, 520, 'Samarreta blau marí amb tres figures de colors, sobre una catifa estampada.'),
        img('fars-samarreta-vermella.jpg', 545, 507, 'Samarreta vermella amb un cercle d’estrelles al voltant del logotip FARS.'),
        img('fars-samarreta-taronja.jpg', 545, 530, 'Samarreta taronja amb el logotip FARS dibuixat amb línies vermelles.'),
        img('fars-dessuadora-negra.jpg', 490, 548, 'Dessuadora negra amb cremallera i una figura encaputxada en blanc, amb el logotip FARS.'),
        img('fars-dessuadora-camuflatge-davant.jpg', 555, 543, 'Dessuadora de camuflatge amb cremallera i el logotip FARS en vermell, vista davantera.'),
        img('fars-dessuadora-camuflatge-darrera.jpg', 565, 543, 'La mateixa dessuadora de camuflatge, vista per darrere, amb una figura vermella.'),
        img('fars-figures-dibuix.png', 749, 453, 'Tres figures amb cresta agafades de la mà, en dibuix de tinta.'),
        img('fars-banner.jpg', 1091, 394, 'El logotip FARS en blanc sobre una fotografia nocturna d’un passeig amb palmeres.'),
        // complements
        img('fars-cartera-vermella.jpg', 1023, 682, 'Cartera de pell vermella amb tatxes metàl·liques i l’estrella FARS en relleu.'),
        img('fars-carteres-1.jpg', 546, 457, 'Quatre carteres de pell de colors amb l’estrella FARS gravada, sobre una planxa de tall verda.'),
        img('fars-carteres-2.jpg', 546, 464, 'Carteres de pell blaves, grises i taronges amb figures i lletres gravades.'),
        img('fars-carteres-munt.jpg', 591, 956, 'Un munt de carteres de pell de colors sobre una taula de fusta.'),
      ],
    },
  ];

  window.GIL = {
    nom: 'Gil Farrés Hernàndez',
    nomCurt: 'Gil Farrés',
    email: 'gilfarres@gmail.com',
    instagram: { usuari: '@gfars_', url: 'https://www.instagram.com/gfars_/' },
    retrat: { src: base + 'gil-retrat.jpg', w: 527, h: 657, alt: 'Retrat de Gil Farrés.' },
    lloc: 'Igualada, Barcelona',
    any: '2026',
    bio: [
      'Graduat el 2025 en Arts i Disseny a l’Escola Massana, soc una persona creativa, curiosa i amb una mirada oberta cap a les noves tendències i formes d’expressió. M’interessa investigar i innovar des de l’actualitat, tenint sempre presents les tendències artístiques i culturals com a punt de partida per desenvolupar noves idees i projectes.',
      'La meva experiència en àmbits tan diversos com el treball analògic, artesanal i digital m’ha permès adquirir una mirada transversal i explorar diferents maneres d’entendre i materialitzar la creativitat. Aquesta combinació de tècniques i perspectives em permet adaptar-me a diferents processos de treball i trobar noves formes de resoldre i desenvolupar projectes.',
      'He participat en projectes artístics, culturals i de producció, com el projecte propi «Omplint el buit», actualment viu i exposat en el marc del Balloon Festival, així com en tasques d’ajudant de direcció creativa i producció al festival Rec.0 d’Igualada. També he treballat en el disseny i la producció d’escenografies per a diferents projectes, explorant la relació entre espai, materials i narrativa visual.',
      'Actualment busco continuar creixent professionalment i ampliar els meus coneixements, descobrint nous camps, tècniques i formes de treball que em permetin seguir desenvolupant projectes amb una mirada creativa, contemporània i experimental.',
    ],
    formacio: [
      { any: '2025', titol: 'Grau universitari en Arts i Disseny', lloc: 'Escola Massana, Barcelona' },
      { any: '2020', titol: 'Batxillerat artístic', lloc: 'IES Joan Mercader, Igualada' },
    ],
    experiencia: [
      { any: '2024', text: 'Producció de complements per a marca pròpia (@gfars_)' },
      { any: '2024', text: 'Disseny i producció d’escenografia per a l’espectacle «Hamlet», d’Albert Pla i Peyu' },
      { any: '2025', text: 'Presentació del projecte «Omplint el buit» (instal·lació)' },
      { any: '2025', text: 'Disseny i producció d’escenografia per a l’encesa de llums de Nadal d’Igualada, per a l’Ajuntament d’Igualada' },
      { any: '2026', text: 'Ajudant de direcció creativa i producció al festival Rec.0' },
      { any: '2026', text: 'Instal·lació «Omplint el buit» a l’European Balloon Festival, en col·laboració amb Iglusdevent' },
    ],
    projectes,
    per: (id) => projectes.find((p) => p.id === id),
  };
})();
