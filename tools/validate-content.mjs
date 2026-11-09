#!/usr/bin/env node
/*
  Valida docs/content/*.json antes de publicar. Sin dependencias.

    node tools/validate-content.mjs                  (valida docs/)
    node tools/validate-content.mjs --root otra/docs (valida otra carpeta, p. ej. para pruebas)

  Sale con código 1 si hay ERRORES (no debería publicarse). Los AVISOS no bloquean:
  son cosas a mejorar (traducciones que faltan, fotos sin usar, archivos pesados...).
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const rootArg = args.indexOf('--root') >= 0 ? args[args.indexOf('--root') + 1] : null;
const root = path.resolve(rootArg || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs'));
const LANGS = ['ca', 'es', 'en'];
const MAX_KB = 1500;

const errors = [];
const warns = [];
const missing = { es: [], en: [] };
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);

const readJson = (name) => {
  const file = path.join(root, 'content', name);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { E(`content/${name}: ${e.code === 'ENOENT' ? 'no existe' : 'JSON no válido (' + e.message + ')'}`); return null; }
};

// Tamaño en píxeles leyendo la cabecera (PNG y JPEG), para comprobar que w/h de los datos son los reales.
function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xff) { i++; continue; }
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

// Un texto en 3 idiomas: el catalán es obligatorio (error); es/en vacíos solo avisan (se verá el catalán).
const text = (obj, where, { required = true } = {}) => {
  if (obj === undefined || obj === null) { if (required) E(`${where}: falta`); return; }
  if (typeof obj !== 'object' || Array.isArray(obj)) { E(`${where}: debe ser { "ca": "...", "es": "...", "en": "..." }`); return; }
  if (!String(obj.ca || '').trim()) { E(`${where}: falta el texto en catalán (ca)`); return; }
  for (const l of ['es', 'en']) if (!String(obj[l] || '').trim()) missing[l].push(where);
  for (const k of Object.keys(obj)) if (!LANGS.includes(k)) W(`${where}: idioma desconocido "${k}" (se ignora)`);
};

const checkImage = (file, w, h, where) => {
  if (!file || typeof file !== 'string') { E(`${where}: falta "file"`); return; }
  if (/[\\/]/.test(file)) { E(`${where}: "file" debe ser solo el nombre (${file}), sin carpetas`); return; }
  const p = path.join(root, 'assets', 'img', file);
  if (!fs.existsSync(p)) { E(`${where}: la imagen assets/img/${file} no existe`); return; }
  const buf = fs.readFileSync(p);
  const kb = Math.round(buf.length / 1024);
  if (kb > MAX_KB) W(`${where}: ${file} pesa ${kb} KB (más de ${MAX_KB}); conviene reducirla`);
  const real = imageSize(buf);
  if (!real) { W(`${where}: no he podido leer el tamaño de ${file} (¿formato distinto de JPG/PNG?)`); return; }
  if (real.w !== w || real.h !== h) E(`${where}: ${file} mide ${real.w}x${real.h} px pero los datos dicen ${w}x${h}`);
};

/* ───────── site.json ───────── */
const site = readJson('site.json');
let limit = 42;
const cats = new Set();
if (site) {
  if (!Number.isInteger(site.boardLimit) || site.boardLimit < 1 || site.boardLimit > 200) E('site.json: "boardLimit" debe ser un entero entre 1 y 200');
  else limit = site.boardLimit;
  if (!Array.isArray(site.categories) || !site.categories.length) E('site.json: falta la lista "categories"');
  (site.categories || []).forEach((c, i) => {
    const w = `site.json categoría ${i + 1}`;
    if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) E(`${w}: "id" debe ser minúsculas, números y guiones (${c.id})`);
    else if (cats.has(c.id)) E(`${w}: id repetido "${c.id}"`);
    else cats.add(c.id);
    text(c.label, `${w} (${c.id}) label`);
  });
}

/* ───────── projects.json ───────── */
const proj = readJson('projects.json');
const ids = new Set();
const used = new Set();
let photos = 0, onBoard = 0;
if (proj) {
  if (!Array.isArray(proj.projects) || !proj.projects.length) E('projects.json: falta la lista "projects"');
  (proj.projects || []).forEach((p, i) => {
    const w = `proyecto ${i + 1} (${p.id || '¿sin id?'})`;
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) E(`${w}: "id" debe ser minúsculas, números y guiones`);
    else if (ids.has(p.id)) E(`${w}: id repetido`);
    else ids.add(p.id);
    if (site && !cats.has(p.category)) E(`${w}: la categoría "${p.category}" no existe en site.json`);
    if (!String(p.year || '').trim()) W(`${w}: sin año`);
    text(p.title, `${w} title`);
    text(p.short, `${w} short`, { required: false });
    text(p.text, `${w} text`);
    if (p.subtitle !== undefined) text(p.subtitle, `${w} subtitle`, { required: false });
    if (!Array.isArray(p.photos) || !p.photos.length) { W(`${w}: no tiene fotos`); return; }
    const seen = new Set();
    p.photos.forEach((ph, k) => {
      const pw = `${w} foto ${k + 1} (${ph.file})`;
      photos++;
      if (seen.has(ph.file)) W(`${pw}: foto repetida en el mismo proyecto`);
      seen.add(ph.file); used.add(ph.file);
      checkImage(ph.file, ph.w, ph.h, pw);
      if (typeof ph.board !== 'boolean') E(`${pw}: "board" debe ser true o false`);
      else if (ph.board) onBoard++;
      if (ph.boardSize !== undefined && !(Number.isFinite(ph.boardSize) && ph.boardSize >= 100 && ph.boardSize <= 1000)) W(`${pw}: "boardSize" debería estar entre 100 y 1000 (o quitarlo)`);
      text(ph.alt, `${pw} alt`);
    });
  });
}

/* ───────── about.json ───────── */
const about = readJson('about.json');
if (about) {
  for (const k of ['name', 'email']) if (!String(about[k] || '').trim()) E(`about.json: falta "${k}"`);
  if (about.email && !/^\S+@\S+\.\S+$/.test(about.email)) E(`about.json: el correo no parece válido (${about.email})`);
  if (!about.instagram || !/^https:\/\//.test(about.instagram.url || '')) E('about.json: instagram.url debe empezar por https://');
  if (!about.portrait) E('about.json: falta "portrait"');
  else { used.add(about.portrait.file); checkImage(about.portrait.file, about.portrait.w, about.portrait.h, 'about.json portrait'); text(about.portrait.alt, 'about.json portrait alt'); }
  if (!Array.isArray(about.bio) || !about.bio.length) E('about.json: "bio" debe tener al menos un párrafo');
  (about.bio || []).forEach((b, i) => text(b, `about.json bio párrafo ${i + 1}`));
  (about.education || []).forEach((e, i) => { if (!String(e.year || '').trim()) W(`about.json estudio ${i + 1}: sin año`); text(e.title, `about.json estudio ${i + 1}`); });
  (about.experience || []).forEach((e, i) => { if (!String(e.year || '').trim()) W(`about.json experiencia ${i + 1}: sin año`); text(e.text, `about.json experiencia ${i + 1}`); });
}

/* ───────── Tablero y limpieza ───────── */
if (proj) {
  if (onBoard > limit) E(`tablero: hay ${onBoard} fotos marcadas y el tope es ${limit}. Quita ${onBoard - limit}.`);
  if (onBoard === 0) W('tablero: no hay ninguna foto marcada ("board": true); la web mostrará las primeras ' + limit);
}
const imgDir = path.join(root, 'assets', 'img');
if (fs.existsSync(imgDir)) {
  const unused = fs.readdirSync(imgDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !used.has(f));
  if (unused.length) W(`${unused.length} imagen(es) en assets/img sin usar en ningún proyecto: ${unused.slice(0, 6).join(', ')}${unused.length > 6 ? '…' : ''}`);
}
for (const l of ['es', 'en']) {
  if (missing[l].length) {
    const n = missing[l].length;
    W(`${n} texto(s) sin traducir al ${l === 'es' ? 'castellano' : 'inglés'} (se mostrará en catalán): ${missing[l].slice(0, 4).join(' | ')}${n > 4 ? ` … y ${n - 4} más` : ''}`);
  }
}

/* ───────── Resultado ───────── */
console.log(`Contenido: ${proj ? proj.projects.length : '?'} proyectos, ${photos} fotos`);
console.log(`Tablero:   ${onBoard}/${limit} fotos${onBoard > limit ? '  <-- SE PASA DEL TOPE' : ''}`);
for (const m of errors) console.log(`  ERROR  ${m}`);
for (const m of warns) console.log(`  AVISO  ${m}`);
console.log(errors.length ? `\n${errors.length} error(es): NO publicar hasta corregirlos.` : `\nSin errores${warns.length ? ` (${warns.length} aviso(s))` : ''}.`);
process.exit(errors.length ? 1 : 0);
