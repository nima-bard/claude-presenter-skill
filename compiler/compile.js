#!/usr/bin/env node
/* Slidedown compiler — deterministic .md → presentation build.
   Usage: node compile.js <deck.md> [--out <dir>]
   Same input always produces the same output. The language is documented in
   ../README.md; theme styles live in ../themes/, the deck runtime in ../shared/.
   Output folder: index.html + style.css + shared/ (copied verbatim). */
'use strict';

const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.join(__dirname, '..');
const THEMES = {
  purple: {
    css: 'themes/purple.css',
    font: '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">',
    nav: 'fade',
    blocks: ['chips', 'flow', 'callout', 'html', 'bars', 'split', 'badge', 'formula', 'example', 'table', 'compare'],
  },
  zastrpay: {
    css: 'themes/zastrpay.css',
    font: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
    nav: 'scroll',
    blocks: ['chips', 'flow', 'callout', 'html', 'cards', 'steps', 'checks', 'panels', 'metrics', 'meta', 'cta'],
  },
};
const RAW_BLOCKS = ['callout', 'formula', 'example', 'cta', 'html'];
const TABLE_BLOCKS = ['table', 'compare'];

/* ---------------- helpers ---------------- */

const errors = [];
function fail(slide, msg) {
  errors.push((slide != null ? 'slide ' + slide + ': ' : '') + msg);
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s, theme) {
  let t = esc(s);
  t = t.replace(/&lt;br&gt;/g, '<br>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/==([^=]+)==/g, theme === 'purple'
    ? '<span class="grad-text">$1</span>'
    : '<span class="grad">$1</span>');
  t = t.replace(/\+\+([^+]+)\+\+/g, theme === 'zastrpay'
    ? '<span class="underline-accent">$1</span>'
    : '<strong>$1</strong>');
  return t;
}

function inlineFormula(s) {
  let t = esc(s);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  t = t.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  t = t.replace(/\^(\w)/g, '<sup>$1</sup>');
  return t;
}

/* ---------------- parsing ---------------- */

function parseFrontMatter(lines) {
  const fm = {};
  let i = 0;
  if (lines[0] !== '---') return { fm, rest: lines };
  for (i = 1; i < lines.length && lines[i] !== '---'; i++) {
    const m = lines[i].match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) fm[m[1].toLowerCase()] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return { fm, rest: lines.slice(i + 1) };
}

function parseItems(lines, slideNo, blockName) {
  // item line: "- text" or "-* ..." (highlight) or "-? ..." (soon/planned)
  const items = [];
  for (const ln of lines) {
    const m = ln.match(/^-(\*|\?)?\s+(.*)$/);
    if (!m) {
      if (ln.trim()) fail(slideNo, 'in ::: ' + blockName + ', expected "- item" lines, got: "' + ln.trim() + '"');
      continue;
    }
    items.push({ mod: m[1] || '', fields: m[2].split(' | ').map(f => f.trim()) });
  }
  if (!items.length) fail(slideNo, '::: ' + blockName + ' has no "- item" lines');
  return items;
}

function parseTable(lines, slideNo, blockName) {
  const rows = [];
  for (const ln of lines) {
    const t = ln.trim();
    if (!t.startsWith('|')) { if (t) fail(slideNo, '::: ' + blockName + ' expects markdown table rows'); continue; }
    if (/^\|[\s:|-]+\|$/.test(t)) continue; // separator row
    rows.push(t.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
  }
  if (rows.length < 2) fail(slideNo, '::: ' + blockName + ' needs a header row and at least one data row');
  return rows;
}

function parseSlides(lines, theme) {
  const slides = [];
  let cur = null;
  let i = 0;

  function pushNode(node) { (cur.cols ? cur.right : cur.nodes).push(node); }

  while (i < lines.length) {
    const ln = lines[i];

    if (ln.startsWith('## ')) {
      const m = ln.slice(3).match(/^(.*?)(?:\s*\{([^}]*)\})?\s*$/);
      cur = {
        no: slides.length + 1,
        title: m[1].replace(/^\d+[.)]\s*/, '').trim(),
        attrs: (m[2] || '').split(/\s+/).filter(Boolean),
        eyebrow: '', notes: [], nodes: [], cols: false, right: [],
      };
      slides.push(cur);
      i++; continue;
    }
    if (!cur) { // before the first slide: allow "# deck title" and blanks
      i++; continue;
    }

    if (ln.startsWith('Eyebrow:')) { cur.eyebrow = ln.slice(8).trim(); i++; continue; }
    if (ln.startsWith('Notes:')) { cur.notes.push(ln.slice(6).trim()); i++; continue; }

    if (/^:::\s*\S/.test(ln)) {
      const head = ln.replace(/^:::\s*/, '').split(/\s+/);
      const name = head[0].toLowerCase();
      const arg = head[1] || '';
      const body = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        if (lines[i].startsWith('## ')) { fail(cur.no, '::: ' + name + ' is not closed (reached next slide)'); break; }
        body.push(lines[i]); i++;
      }
      if (i < lines.length && lines[i].trim() === ':::') i++;

      if (!THEMES[theme].blocks.includes(name)) {
        const other = theme === 'purple' ? 'zastrpay' : 'purple';
        fail(cur.no, '::: ' + name + ' is not available' +
          (THEMES[other].blocks.includes(name) ? ' in theme "' + theme + '" (it is ' + other + '-only)' : ' — unknown element') +
          '. ' + theme + ' elements: ' + THEMES[theme].blocks.join(', '));
        continue;
      }
      let node = { type: name, arg };
      if (name === 'panels') {
        node.groups = [];
        let g = null;
        for (const b of body) {
          if (b.trim() === '---') { g = null; continue; }
          if (!g) {
            const f = b.split(' | ').map(x => x.trim());
            g = { label: f[0] || '', heading: f[1] || '', items: [] };
            node.groups.push(g);
          } else {
            const m2 = b.match(/^-\s+(.*)$/);
            if (m2) g.items.push(m2[1]);
          }
        }
        if (node.groups.length < 2) fail(cur.no, '::: panels needs 2 groups separated by a "---" line');
      } else if (RAW_BLOCKS.includes(name)) {
        node.raw = body.filter(b => b.trim() !== '').map(b => b.trim());
        if (!node.raw.length) fail(cur.no, '::: ' + name + ' is empty');
      } else if (TABLE_BLOCKS.includes(name)) {
        node.rows = parseTable(body, cur.no, name);
      } else {
        node.items = parseItems(body, cur.no, name);
      }
      pushNode(node);
      continue;
    }

    if (ln.trim() === '---') {
      if (cur.cols) fail(cur.no, 'more than one "---" column split');
      cur.cols = true;
      i++; continue;
    }

    if (/^-\s+/.test(ln)) { // top-level bullets → points list
      const pts = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) { pts.push(lines[i].replace(/^-\s+/, '')); i++; }
      pushNode({ type: 'points', items: pts });
      continue;
    }

    if (ln.trim() !== '') { // paragraph: join consecutive text lines
      const buf = [];
      while (i < lines.length && lines[i].trim() !== '' && !/^(##\s|:::|---$|-\s|Eyebrow:|Notes:)/.test(lines[i])) {
        buf.push(lines[i].trim()); i++;
      }
      pushNode({ type: 'p', text: buf.join(' ') });
      continue;
    }
    i++;
  }
  return slides;
}

/* ---------------- rendering: shared bits ---------------- */

function notesAside(slide, theme) {
  if (!slide.notes.length) return '';
  return '      <aside class="speaker-notes">' + inline(slide.notes.join(' '), theme) + '</aside>\n';
}

function pointsHtml(items, theme) {
  return '<ul class="points">' + items.map(p => '<li>' + inline(p, theme) + '</li>').join('') + '</ul>';
}

/* ---------------- rendering: purple ---------------- */

function purpleNode(node, slide) {
  const t = 'purple';
  switch (node.type) {
    case 'p':
      return '<p class="sub">' + inline(node.text, t) + '</p>';
    case 'points':
      return pointsHtml(node.items, t);
    case 'chips':
      return '<div class="chips">' + node.items.map(it => {
        let color = 'purple', icon = '◆', text = it.fields.join(' | ');
        const m = text.match(/^\[(\w+)(?::(\S+))?\]\s+(.*)$/);
        if (m) { color = m[1]; icon = m[2] || icon; text = m[3]; }
        return '<span class="chip ' + color + '"><span class="ic">' + esc(icon) + '</span> ' + inline(text, t) + '</span>';
      }).join('') + '</div>';
    case 'flow':
      return '<div class="flow">' + node.items.map(it =>
        '<div class="step' + (it.mod === '*' ? ' hot' : '') + '"><span class="ic">' + esc(it.fields[0] || '•') + '</span><div>' +
        inline(it.fields[1] || '', t) + (it.fields[2] ? '<small>' + inline(it.fields[2], t) + '</small>' : '') + '</div></div>'
      ).join('<span class="arrow">→</span>') + '</div>';
    case 'callout':
      return '<div class="moon">' + inline(node.raw.join(' '), t) + '</div>';
    case 'bars':
    case 'split':
      return node.items.map((it, k) => {
        const pct = Math.max(0, Math.min(100, parseInt(it.fields[1], 10) || 0));
        const top = '<div class="top"><span>' + inline(it.fields[0] || '', t) + '</span><span class="pct" style="color:var(--purple)">' + pct + '%</span></div>';
        const bar = node.type === 'bars'
          ? '<div class="bar"><span style="width:' + pct + '%"></span></div>'
          : '<div class="split"><span class="cov" style="width:' + pct + '%"></span><span class="unc" style="width:' + (100 - pct) + '%"></span></div>';
        return '<div class="metric"' + (k ? ' style="margin-top:22px"' : '') + '>' + top + bar + '</div>';
      }).join('');
    case 'badge': {
      const it = node.items[0];
      return '<div class="badge"><span class="n">' + esc(it.fields[0] || '') + '</span><span class="l">' + esc(it.fields[1] || '') + '</span></div>';
    }
    case 'formula':
      return '<div class="formula">' + node.raw.map(inlineFormula).join('<br>') + '</div>';
    case 'example':
      return '<div class="example">' + node.raw.map(r => esc(r).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')).join('<br>') + '</div>';
    case 'table':
    case 'compare': {
      const cls = node.type === 'table' ? 'report' : 'cmp';
      const head = '<thead><tr>' + node.rows[0].map(c => '<th>' + inline(c, t) + '</th>').join('') + '</tr></thead>';
      const body = node.rows.slice(1).map(row => {
        const pick = node.type === 'compare' && row[0].startsWith('*');
        const cells = row.map((c, ci) => {
          if (pick && ci === 0) c = c.replace(/^\*\s*/, '');
          if (node.type === 'compare') {
            if (c === 'y') return '<td class="c yes">✓</td>';
            if (c === 'n') return '<td class="c no">✗</td>';
            if (ci === 0) return '<td class="opt">' + inline(c, t) + (pick ? ' <span class="pick-pill">chosen</span>' : '') + '</td>';
            return '<td class="verdict">' + inline(c, t) + '</td>';
          }
          return '<td' + (ci === 0 ? ' class="name"' : '') + '>' + inline(c, t) + '</td>';
        }).join('');
        return '<tr' + (pick ? ' class="pick"' : '') + '>' + cells + '</tr>';
      }).join('');
      return '<div class="card" style="padding:16px 28px"><table class="' + cls + '">' + head + '<tbody>' + body + '</tbody></table></div>';
    }
    case 'html':
      return node.raw.join('\n');
    default:
      fail(slide.no, 'internal: unhandled purple node ' + node.type);
      return '';
  }
}

function purpleSlide(slide, idx) {
  const t = 'purple';
  const eyebrow = slide.eyebrow
    ? '      <span class="eyebrow"><span class="dot"></span> ' + inline(slide.eyebrow, t) + '</span>\n' : '';
  let body = '';

  if (slide.attrs.includes('title')) {
    const lead = slide.nodes.find(n => n.type === 'p');
    const rest = slide.nodes.filter(n => n !== lead);
    body = eyebrow
      + '      <h1>' + inline(slide.title, t) + '</h1>\n'
      + (lead ? '      <p class="lead">' + inline(lead.text, t) + '</p>\n' : '')
      + rest.map(n => '      ' + purpleNode(n, slide)).join('\n') + (rest.length ? '\n' : '');
  } else if (slide.cols) {
    const wrap = (nodes) => {
      if (nodes.length === 1 && ['bars', 'split', 'table', 'compare'].includes(nodes[0].type)) {
        if (nodes[0].type === 'table' || nodes[0].type === 'compare') return purpleNode(nodes[0], slide);
        return '<div class="card">' + purpleNode(nodes[0], slide) + '</div>';
      }
      if (nodes.length && nodes[0].type === 'badge') {
        return '<div style="display:grid;place-items:center">' + nodes.map(n => purpleNode(n, slide)).join('') + '</div>';
      }
      return '<div>' + nodes.map(n => purpleNode(n, slide)).join('') + '</div>';
    };
    body = eyebrow
      + '      <div class="grid2">\n'
      + '        <div>\n'
      + '          <h2>' + inline(slide.title, t) + '</h2>\n'
      + slide.nodes.map(n => '          ' + purpleNode(n, slide)).join('\n') + (slide.nodes.length ? '\n' : '')
      + '        </div>\n'
      + '        ' + wrap(slide.right) + '\n'
      + '      </div>\n';
  } else {
    body = eyebrow
      + '      <h2>' + inline(slide.title, t) + '</h2>\n'
      + slide.nodes.map(n => '      ' + purpleNode(n, slide)).join('\n') + (slide.nodes.length ? '\n' : '');
  }

  return '    <!-- ' + slide.no + ' · ' + slide.title.replace(/-->/g, '') + ' -->\n'
    + '    <section class="slide' + (idx === 0 ? ' active' : '') + '">\n'
    + body + notesAside(slide, t)
    + '    </section>\n';
}

/* ---------------- rendering: zastrpay ---------------- */

const ZP_LOGO_USE = '<svg class="zp-logo" viewBox="0 0 480 80" role="img" aria-label="zastrpay"><use href="#zp-logo"/></svg>';

function zastrNode(node, slide) {
  const t = 'zastrpay';
  switch (node.type) {
    case 'p':
      return '<p class="lead">' + inline(node.text, t) + '</p>';
    case 'points':
      return pointsHtml(node.items, t);
    case 'chips':
      return '<div class="payoff">' + node.items.map(it => {
        const text = it.fields.join(' | ').replace(/^\[\w+(?::\S+)?\]\s+/, '');
        return '<span class="chip">' + inline(text, t) + '</span>';
      }).join('') + '</div>';
    case 'flow':
      return '<div class="flow">' + node.items.map(it =>
        '<div class="node' + (it.mod === '*' ? ' gov' : '') + '"><div class="ic">' + esc(it.fields[0] || '•') + '</div><strong>' +
        inline(it.fields[1] || '', t) + '</strong>' + (it.fields[2] ? '<span>' + inline(it.fields[2], t) + '</span>' : '') + '</div>'
      ).join('<div class="arrow">→</div>') + '</div>';
    case 'callout':
      return '<div class="note">' + inline(node.raw.join(' '), t) + '</div>';
    case 'cards': {
      const g = ['2', '3', '4'].includes(node.arg) ? node.arg : String(Math.min(4, Math.max(2, node.items.length)));
      return '<div class="grid g' + g + '">' + node.items.map(it => {
        const cls = it.mod === '*' ? ' win' : it.mod === '?' ? ' soon' : '';
        const pill = it.mod === '*' ? '<span class="pill">' + inline(it.fields[3] || 'Recommended', t) + '</span>'
          : it.mod === '?' ? '<span class="pill soon">' + inline(it.fields[3] || 'Planned', t) + '</span>' : '';
        return '<div class="card' + cls + '">' + pill + '<div class="ic">' + esc(it.fields[0] || '◆') + '</div><h3>' +
          inline(it.fields[1] || '', t) + '</h3><p>' + inline(it.fields[2] || '', t) + '</p></div>';
      }).join('') + '</div>';
    }
    case 'steps':
      return '<div class="steps">' + node.items.map((it, k) =>
        '<div class="step"><span class="n">' + (k + 1) + '</span><span class="body"><strong>' + inline(it.fields[0] || '', t) +
        '</strong><span>' + inline(it.fields[1] || '', t) + '</span></span></div>'
      ).join('') + '</div>';
    case 'checks': {
      const check = it => '<div class="check"><span class="tick">✓</span><span class="tx"><strong>' + inline(it.fields[0] || '', t) +
        '</strong>' + (it.fields[1] ? '<span>' + inline(it.fields[1], t) + '</span>' : '') + '</span></div>';
      if (node.items.length <= 3) return '<div class="checks" style="margin-top:clamp(2.8rem,6vh,4.4rem)">' + node.items.map(check).join('') + '</div>';
      const half = Math.ceil(node.items.length / 2);
      return '<div class="grid g2" style="margin-top:clamp(2.8rem,6vh,4.4rem)"><div class="checks">' +
        node.items.slice(0, half).map(check).join('') + '</div><div class="checks">' +
        node.items.slice(half).map(check).join('') + '</div></div>';
    }
    case 'panels':
      return '<div class="twopanel">' + node.groups.map(g =>
        '<div class="panel"><div class="label">' + inline(g.label, t) + '</div><h3>' + inline(g.heading, t) + '</h3><ul>' +
        g.items.map(li => '<li>' + inline(li, t) + '</li>').join('') + '</ul></div>'
      ).join('') + '</div>';
    case 'metrics':
      return '<div class="metrics">' + node.items.map(it =>
        '<div class="metric"><div class="v">' + inline(it.fields[0] || '', t) + '</div><div class="k">' + inline(it.fields[1] || '', t) + '</div></div>'
      ).join('') + '</div>';
    case 'meta':
      return '<div class="hero-meta">' + node.items.map(it => '<span>' + inline(it.fields.join(' | '), t) + '</span>').join('') + '</div>';
    case 'cta':
      return '<div class="closing-cta">' + inline(node.raw.join(' '), t) + '</div>';
    case 'html':
      return node.raw.join('\n');
    default:
      fail(slide.no, 'internal: unhandled zastrpay node ' + node.type);
      return '';
  }
}

function zastrSlide(slide, idx, fm) {
  const t = 'zastrpay';
  const isTitle = slide.attrs.includes('title');
  const isClosing = slide.attrs.includes('closing');
  let surface = 'light';
  if (isTitle) surface = 'dark glow bl';
  else if (isClosing) surface = 'dark glow';
  else {
    if (slide.attrs.includes('dark')) surface = 'dark';
    if (slide.attrs.includes('pure')) surface = 'light pure';
    if (slide.attrs.includes('glow')) surface += ' glow';
  }

  const eyebrow = slide.eyebrow ? '      <span class="eyebrow">' + inline(slide.eyebrow, t) + '</span>\n' : '';
  const tag = fm.brand || fm.tag || '';
  const topbar = (isTitle || isClosing) ? '' :
    '    <div class="topbar">\n      ' + ZP_LOGO_USE + '\n' +
    (tag ? '      <span class="tag"' + (surface.startsWith('dark') ? ' style="color:#9aa0b2"' : '') + '>' + inline(tag, t) + '</span>\n' : '') +
    '    </div>\n';

  let inner = '';
  if (isTitle) {
    const lead = slide.nodes.find(n => n.type === 'p');
    const rest = slide.nodes.filter(n => n !== lead);
    inner = '      <div class="hero-top">\n        ' + ZP_LOGO_USE + '\n'
      + '        <span style="color:#9aa0b2;font-weight:600;letter-spacing:.1em;text-transform:uppercase;font-size:.82rem;">Presentation</span>\n      </div>\n'
      + eyebrow
      + '      <h1>' + inline(slide.title, t) + '</h1>\n'
      + (lead ? '      <p class="lead" style="margin-top:clamp(1.8rem,4vh,2.6rem);font-size:clamp(1.2rem,2.1vw,1.7rem);">' + inline(lead.text, t) + '</p>\n' : '')
      + rest.map(n => '      ' + zastrNode(n, slide)).join('\n') + (rest.length ? '\n' : '');
  } else if (isClosing) {
    inner = eyebrow
      + '      <h1>' + inline(slide.title, t) + '</h1>\n'
      + slide.nodes.map(n => '      ' + zastrNode(n, slide)).join('\n') + (slide.nodes.length ? '\n' : '')
      + '      <div class="hero-meta" style="margin-top:clamp(2.4rem,6vh,4rem); justify-content:space-between;">\n'
      + '        <svg class="zp-logo lg" viewBox="0 0 480 80" role="img" aria-label="zastrpay"><use href="#zp-logo"/></svg>\n'
      + (fm.quote ? '        <span style="font-style:italic;color:#c3c7d4;">“' + inline(fm.quote, t) + '”</span>\n' : '')
      + '      </div>\n'
      + '      <p style="margin-top:1.6rem;color:#9aa0b2;font-weight:600;letter-spacing:.04em;">Thank you.</p>\n';
  } else if (slide.cols) {
    inner = eyebrow
      + '      <h2>' + inline(slide.title, t) + '</h2>\n'
      + '      <div class="grid g2" style="margin-top:clamp(2.8rem,6vh,4.4rem)">\n'
      + '        <div>\n' + slide.nodes.map(n => '          ' + zastrNode(n, slide)).join('\n') + (slide.nodes.length ? '\n' : '') + '        </div>\n'
      + '        <div>\n' + slide.right.map(n => '          ' + zastrNode(n, slide)).join('\n') + (slide.right.length ? '\n' : '') + '        </div>\n'
      + '      </div>\n';
  } else {
    inner = eyebrow
      + '      <h2>' + inline(slide.title, t) + '</h2>\n'
      + slide.nodes.map(n => '      ' + zastrNode(n, slide)).join('\n') + (slide.nodes.length ? '\n' : '');
  }

  return '  <!-- ' + slide.no + ' · ' + slide.title.replace(/-->/g, '') + ' -->\n'
    + '  <section class="slide ' + surface + '">\n'
    + topbar
    + '    <div class="inner">\n' + inner + '    </div>\n'
    + notesAside(slide, t)
    + '  </section>\n';
}

/* ---------------- document assembly ---------------- */

function buildHtml(fm, slides, theme) {
  const title = fm.title || 'Presentation';
  const head = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    + '<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
    + '<title>' + esc(title) + '</title>\n'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    + THEMES[theme].font + '\n'
    + '<link rel="stylesheet" href="shared/presenter.css">\n'
    + '<link rel="stylesheet" href="style.css">\n'
    + '</head>\n<body>\n';

  let chrome1 = '', chrome2 = '';
  if (theme === 'purple') {
    chrome1 = '  <div class="blob a"></div><div class="blob b"></div><div class="blob c"></div>\n'
      + '  <div class="brand"><span class="sq"></span> ' + inline(fm.brand || title, 'purple') + '</div>\n'
      + '  <div class="count"><b id="cur">01</b> / <span id="total">' + String(slides.length).padStart(2, '0') + '</span></div>\n\n'
      + '  <div class="deck" id="deck" data-nav="fade">\n\n';
    chrome2 = '  </div>\n\n'
      + '  <div class="nav">\n'
      + '    <button class="nbtn" id="prev" aria-label="Previous slide">‹</button>\n'
      + '    <div class="dots" id="dots"></div>\n'
      + '    <button class="nbtn" id="next" aria-label="Next slide">›</button>\n'
      + '    <button class="nbtn" id="remote" title="Speaker remote (R)" aria-label="Open speaker remote" style="font-size:14px">⧉</button>\n'
      + '  </div>\n'
      + '  <div class="hint" id="hint">← → navigate · S notes · R remote · F fullscreen</div>\n';
  } else {
    const logo = fs.readFileSync(path.join(SKILL_DIR, 'themes', 'zastrpay-logo.html'), 'utf8').trimEnd();
    chrome1 = logo + '\n\n<div class="progress"><div class="bar" id="bar"></div></div>\n\n'
      + '<main class="deck" id="deck" data-nav="scroll">\n\n';
    chrome2 = '</main>\n\n'
      + '<nav class="dots" id="dots" aria-label="Slide navigation"></nav>\n'
      + '<div class="counter"><b id="cur">01</b> / <span id="total">' + String(slides.length).padStart(2, '0') + '</span></div>\n'
      + '<div class="arrows">\n'
      + '  <button id="remote" title="Speaker remote (R)" aria-label="Open speaker remote">⧉</button>\n'
      + '  <button id="prev" aria-label="Previous slide">↑</button>\n'
      + '  <button id="next" aria-label="Next slide">↓</button>\n'
      + '</div>\n'
      + '<div class="hint" id="hint"><span class="key">↓</span> scroll · <span class="key">S</span> notes · <span class="key">R</span> remote · <span class="key">F</span> fullscreen</div>\n';
  }

  const body = slides.map((s, i) => theme === 'purple' ? purpleSlide(s, i) : zastrSlide(s, i, fm)).join('\n');
  return head + chrome1 + body + '\n' + chrome2 + '\n<script src="shared/presenter.js"></script>\n</body>\n</html>\n';
}

function copyShared(outDir) {
  const src = path.join(SKILL_DIR, 'shared');
  const dst = path.join(outDir, 'shared');
  fs.rmSync(dst, { recursive: true, force: true });
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
}

/* ---------------- main ---------------- */

function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf('--out');
  const outArg = outFlag !== -1 ? args.splice(outFlag, 2)[1] : null;
  const mdPath = args[0];
  if (!mdPath) { console.error('usage: node compile.js <deck.md> [--out <dir>]'); process.exit(2); }
  if (!fs.existsSync(mdPath)) { console.error('not found: ' + mdPath); process.exit(2); }

  const raw = fs.readFileSync(mdPath, 'utf8');

  // unresolved [[ directives ]] block the build
  const directives = [...raw.matchAll(/\[\[([\s\S]*?)\]\]/g)];
  if (directives.length) {
    console.error('Build blocked — unresolved [[ directives ]] in ' + mdPath + ':');
    directives.forEach(d => console.error('  [[' + d[1].trim() + ']]'));
    console.error('Ask the presenter skill to sync (it resolves directives into the md), or remove them.');
    process.exit(1);
  }

  const lines = raw.split(/\r?\n/);
  const { fm, rest } = parseFrontMatter(lines);
  const theme = (fm.theme || '').toLowerCase();
  if (!THEMES[theme]) {
    console.error('front-matter "theme" must be one of: ' + Object.keys(THEMES).join(', ') + ' (got "' + (fm.theme || '') + '")');
    process.exit(1);
  }
  if (!fm.title) {
    const h1 = rest.find(l => l.startsWith('# '));
    fm.title = h1 ? h1.slice(2).trim() : path.basename(mdPath, '.md');
  }

  const slides = parseSlides(rest, theme);
  if (!slides.length) fail(null, 'no slides found (a slide starts with "## Title")');

  if (errors.length) {
    console.error('Build failed — ' + errors.length + ' error(s):');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }

  const mdDir = path.dirname(path.resolve(mdPath));
  const slug = path.basename(mdPath, '.md');
  const outDir = outArg ? path.resolve(outArg)
    : fm.output ? path.resolve(mdDir, fm.output)
    : path.join(mdDir, 'output', slug);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(fm, slides, theme));
  fs.copyFileSync(path.join(SKILL_DIR, THEMES[theme].css), path.join(outDir, 'style.css'));
  copyShared(outDir);

  console.log('built ' + slides.length + ' slides (' + theme + ') → ' + outDir);
}

main();
