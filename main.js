/* Chance portfolio. You shouldn't need to edit this file; content lives in content.js */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- content (with editor preview) ---------- */
  let SITE = window.SITE || {};
  if (/[?&]preview/.test(location.search)) {
    try {
      const saved = localStorage.getItem("chance-preview");
      if (saved) {
        SITE = JSON.parse(saved);
        const tag = document.createElement("div");
        tag.textContent = "Preview: editor changes, not live yet";
        tag.style.cssText = "position:fixed;bottom:1rem;left:1rem;z-index:190;background:#7E2320;color:#E8DCC4;padding:.5rem .9rem;font-weight:700";
        document.body.appendChild(tag);
      }
    } catch (e) { /* storage unavailable: show normal content */ }
  }
  const P = SITE.profile || {};
  const C = SITE.contact || {};
  const projects = (SITE.projects || []).filter(p => p && (p.title || p.image || p.link));
  // a project can have several categories: "Environment art, 3D art"
  const catsOf = p => String(p.category || "").split(",").map(c => c.trim()).filter(Boolean);
  const catText = p => catsOf(p).join(" · ");

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "style") n.style.cssText = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(c => c != null && n.append(c));
    return n;
  }
  const setText = (sel, v) => $$(sel).forEach(n => { n.textContent = v; });

  /* ---------- hand-inked sketches (original drawings) ---------- */
  let sid = 0;
  function sketch(kind) {
    const u = "k" + (++sid);
    const S = 'stroke="#1E1A16" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
    const defs = `<defs><pattern id="${u}h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#1E1A16" stroke-width="1.3"/></pattern><pattern id="${u}x" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5M0 0H5" stroke="#1E1A16" stroke-width="1.1"/></pattern></defs>`;
    const face = (d, fill) => `<path d="${d}" fill="#E8DCC4"/><path d="${d}" fill="${fill}" ${S}/>`;
    const cube = (t, topFill) => `<g transform="${t}">${face("M50 18 80 34 50 50 20 34Z", topFill || "#E8DCC4")}${face("M20 34 50 50 50 84 20 68Z", `url(#${u}h)`)}${face("M50 50 80 34 80 68 50 84Z", `url(#${u}x)`)}</g>`;
    let body;
    if (kind === "mesh") {
      const dots = [[50, 18], [80, 34], [50, 50], [20, 34], [20, 68], [50, 84], [80, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#7E2320" stroke="#1E1A16" stroke-width="1.4"/>`).join("");
      body = cube("") + `<path d="M35 26 65 42M65 26 35 42" stroke="#1E1A16" stroke-width="1.2" stroke-dasharray="3 3"/>` + dots;
    } else if (kind === "brush") {
      body = `<path d="M10 86C26 72 40 94 56 82S80 70 92 80" fill="none" stroke="#7E2320" stroke-width="7" stroke-linecap="round"/>
        <g transform="rotate(40 50 50)">
          <rect x="44" y="50" width="12" height="44" rx="5" fill="#E8DCC4"/><rect x="44" y="50" width="12" height="44" rx="5" fill="url(#${u}h)" ${S}/>
          <path d="M43 36h14v14H43z" fill="#D8C7A5" ${S}/><path d="M43 41h14M43 45h14" stroke="#1E1A16" stroke-width="1.2"/>
          <path d="M43 36C41 24 46 14 50 6 54 14 59 24 57 36Z" fill="#1E1A16" ${S}/>
          <path d="M48 10C47 18 47 26 48 34" stroke="#7E2320" stroke-width="2" fill="none"/>
        </g>`;
    } else if (kind === "blocks") {
      body = cube("translate(2 44) scale(.5)") + cube("translate(32 44) scale(.5)") + cube("translate(17 27) scale(.5)", "#7E2320");
      body = `<g transform="translate(9 -2) scale(1.25)">${body}</g>`;
    } else {
      body = `<g transform="rotate(-35 50 50)"><rect x="42" y="18" width="16" height="58" fill="#E8DCC4"/><rect x="42" y="18" width="16" height="58" fill="url(#${u}h)" ${S}/><path d="M42 76h16L50 94Z" fill="#E8DCC4" ${S}/><path d="M47 88h6L50 94Z" fill="#1E1A16"/><path d="M42 18h16v-6H42z" fill="#7E2320" ${S}/></g>`;
    }
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}${body}</svg>`;
  }
  const toolKind = name => /blender/i.test(name) ? "mesh" : /substance|paint/i.test(name) ? "brush" : /roblox/i.test(name) ? "blocks" : "pencil";

  /* ---------- hero ---------- */
  const name = P.name || "Chance";
  const h1 = $("[data-name]");
  h1.textContent = "";
  h1.setAttribute("data-text", name);
  h1.setAttribute("aria-label", name);
  [...name].forEach((ch, i) => {
    const s = el("span", { class: "ch", "aria-hidden": "true" }, ch === " " ? "\u00a0" : ch);
    s.style.setProperty("--i", i);
    h1.append(s);
  });
  setText("[data-role]", P.role || "3D artist");
  setText("[data-location]", P.location || "");
  setText("[data-intro]", P.intro || "");
  setText("[data-name-plain]", name);
  setText("[data-year]", new Date().getFullYear());
  document.title = name + " | " + (P.role || "3D artist");

  /* ---------- media helpers ---------- */
  const isVideoFile = s => /\.(mp4|webm|mov)(\?|$)/i.test(s || "");
  const ytId = s => { const m = /(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/.exec(s || ""); return m && m[1]; };
  function placeholder(label) {
    return el("div", { class: "placeholder", html: sketch("mesh") }, el("span", { text: label || "Render coming soon" }));
  }
  function image(src, alt, eager) {
    const img = el("img", { src, alt: alt || "", loading: eager ? "eager" : "lazy", decoding: "async" });
    img.addEventListener("error", () => img.replaceWith(placeholder("Image not found")));
    return img;
  }
  const kind = s => ytId(s) ? "yt" : isVideoFile(s) ? "video" : "image";
  // muted looping videos only play while on screen (saves a lot of lag)
  const vidObs = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause();
  }), { threshold: .2 }) : null;
  function loopVideo(src) {
    const v = el("video", { src, loop: "", playsinline: "", preload: "metadata", "aria-hidden": "true" });
    v.muted = true;
    v.addEventListener("error", () => v.replaceWith(placeholder("Video not found")));
    if (vidObs) vidObs.observe(v);
    return v;
  }
  function thumbFor(src, alt) {
    const k = kind(src);
    if (k === "video") return el("div", { style: "display:contents" }, loopVideo(src));
    if (k === "yt") return el("div", { style: "display:contents" }, image("https://i.ytimg.com/vi/" + ytId(src) + "/hqdefault.jpg", alt), el("span", { class: "play-badge", "aria-hidden": "true" }));
    return image(src, alt);
  }
  // every picture/video of a project, in order
  const mediaList = p => [p.image, ...(p.gallery || []), p.video].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  function cover(p) {
    const first = mediaList(p)[0];
    return first ? thumbFor(first, p.title) : placeholder();
  }
  const FRAMES = ["", "black", "", "wood", "", "black"];
  const TILTS = [-1.2, .9, -.5, 1.3, -.9, .6];
  function framed(content, variant, extraMat) {
    return el("div", { class: "frame " + (variant || "") },
      el("span", { class: "wire", "aria-hidden": "true" }), el("span", { class: "nail", "aria-hidden": "true" }),
      el("div", { class: "mat" }, el("div", { class: "art" }, content), extraMat || null));
  }
  function whenHung(hang) {
    hang.addEventListener("animationend", e => { if (e.animationName === "hangIn") hang.classList.add("hung"); if (e.animationName === "swing") hang.classList.remove("swing"); });
  }
  function swing(hang) {
    if (reduce || !hang.classList.contains("hung") || hang.classList.contains("swing")) return;
    hang.classList.add("swing");
  }

  /* ---------- hero tool wall ---------- */
  const toolWall = $("[data-tools]");
  const tools = (SITE.tools || []).filter(t => t && t.name).slice(0, 3);
  if (!tools.length) toolWall.hidden = true;
  tools.forEach((t, i) => {
    const sk = () => el("div", { html: sketch(toolKind(t.name)), style: "display:contents" });
    let art = sk();
    if (t.image) {
      art = el("img", { src: t.image, alt: t.name + " logo", loading: "eager", decoding: "async" });
      art.addEventListener("error", () => art.replaceWith(sk()));
    }
    const hang = el("div", { class: "hang", style: `--tilt:${[-1.5, 1.8, -.8][i]}deg` },
      framed(art, ["", "black", ""][i], el("p", { class: "tool-name", text: t.name })));
    whenHung(hang);
    const tool = el("div", { class: "tool", style: `--n:${i}` }, el("div", { class: "sway", style: `--dur:${3.4 + i * .9}s;animation-delay:-${i * 1.3}s` }, hang));
    tool.addEventListener("pointerenter", () => swing(hang));
    tool.addEventListener("click", () => swing(hang));
    toolWall.append(tool);
  });

  /* ---------- work wall ---------- */
  const grid = $("#grid");
  // the wall is grouped by style, in the order listed in content.js
  const STYLES = (SITE.styles || []).slice();
  const styleOf = p => p.style || STYLES[0] || "";
  projects.forEach(p => { const st = styleOf(p); if (st && !STYLES.includes(st)) STYLES.push(st); });
  const all = projects.map((p, i) => ({ p, i }));
  const groups = STYLES.length ? STYLES.map(st => ({ st, items: all.filter(o => styleOf(o.p) === st) })) : [{ st: "", items: all }];
  if (!projects.length) grid.append(el("p", { class: "grid-empty", text: "New work is on the way." }));
  const CATS = SITE.categories || [];
  const subOwner = {};
  CATS.forEach(c => (c.subs || []).forEach(sb => { subOwner[sb.name] = c.name; }));
  const mainsOf = p => [...new Set(catsOf(p).map(c => subOwner[c] || c))];
  let n = 0;
  function makeCard(p, i) {
    const tiltDeg = TILTS[n % TILTS.length];
    const tilt = el("div", { class: "tilt" }, framed(cover(p), FRAMES[n % FRAMES.length]));
    const hang = el("div", { class: "hang", style: `--tilt:${tiltDeg}deg` }, tilt);
    whenHung(hang);
    const card = el("a", {
      class: "card" + (p.featured ? " featured" : ""), href: "#project-" + (i + 1), "data-index": i, "data-cat": catsOf(p).join("|"), "data-main": mainsOf(p).join("|"),
      "aria-label": (p.title || "Untitled") + ", flip for details",
      style: `--dy:${p.featured ? 0 : [0, 2.5, 1, 3, .5, 1.8][n % 6]}rem;--d:${(n % 3) * .14}s;--lt:${-tiltDeg}deg`
    }, hang, el("div", { class: "label" }, el("span", { class: "label-title", text: p.title || "Untitled" }), catsOf(p).length ? el("span", { class: "label-cat", text: catText(p) }) : null));
    card.addEventListener("click", e => { e.preventDefault(); openFlip(i, card); });
    if (finePointer && !reduce) {
      const frame = $(".frame", tilt);
      card.addEventListener("pointerenter", () => swing(hang));
      card.addEventListener("pointermove", e => {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        tilt.style.transform = `perspective(900px) rotateX(${(.5 - y) * 10}deg) rotateY(${(x - .5) * 12}deg) translateZ(12px)`;
        frame.style.setProperty("--gx", x * 100 + "%");
        frame.style.setProperty("--gy", y * 100 + "%");
      });
      card.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
    }
    grid.append(card);
    n++;
  }
  groups.forEach(g => {
    if (!g.items.length) return;
    if (g.st && groups.filter(x => x.items.length).length > 1) grid.append(el("div", { class: "style-head", "data-style": g.st }, el("span", { text: g.st })));
    g.items.forEach(({ p, i }) => makeCard(p, i));
  });

  /* ---------- filters: main categories, then their smaller groups ---------- */
  const filterBar = $(".filters");
  const mains = (CATS.length ? CATS.map(c => c.name) : [...new Set(projects.flatMap(mainsOf))]).filter(m => projects.some(p => mainsOf(p).includes(m)));
  if (mains.length > 1 || CATS.some(c => (c.subs || []).length)) {
    filterBar.hidden = false;
    const row1 = el("div", { class: "filter-row" }), row2 = el("div", { class: "filter-row sub" }), note = el("p", { class: "filter-note" });
    row2.hidden = true; note.hidden = true;
    filterBar.append(row1, row2, note);
    let main = "All", sub = "";
    const press = (row, btn) => $$("button", row).forEach(x => x.setAttribute("aria-pressed", x === btn ? "true" : "false"));
    function apply() {
      let k = 0;
      $$(".card", grid).forEach(card => {
        const show = (main === "All" || card.dataset.main.split("|").includes(main)) && (!sub || card.dataset.cat.split("|").includes(sub));
        const was = !card.classList.contains("hide");
        card.classList.toggle("hide", !show);
        if (show && !reduce) {
          const h = $(".hang", card);
          h.classList.remove("hung", "swing");
          card.style.setProperty("--d", (k++ % 3) * .08 + "s");
          void h.offsetWidth;
        }
      });
      // hide a style title when none of its frames are showing
      $$(".style-head", grid).forEach(hd => {
        let x = hd.nextElementSibling, any = false;
        while (x && !x.classList.contains("style-head")) { if (!x.classList.contains("hide")) any = true; x = x.nextElementSibling; }
        hd.hidden = !any;
      });
    }
    function setNote(text) { note.textContent = text || ""; note.hidden = !text; }
    function showSubs(m) {
      row2.textContent = "";
      const c = CATS.find(x => x.name === m);
      const subs = c ? (c.subs || []).filter(sb => projects.some(p => catsOf(p).includes(sb.name))) : [];
      row2.hidden = !subs.length;
      if (!subs.length) return;
      const allBtn = el("button", { type: "button", "aria-pressed": "true", text: "All " + m });
      allBtn.addEventListener("click", () => { sub = ""; press(row2, allBtn); setNote(c.description); apply(); });
      row2.append(allBtn);
      subs.forEach(sb => {
        const b = el("button", { type: "button", "aria-pressed": "false", text: sb.name, title: sb.description || "" });
        b.addEventListener("click", () => { sub = sb.name; press(row2, b); setNote(sb.description); apply(); });
        row2.append(b);
      });
      if (!reduce) row2.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "ease-out" });
    }
    ["All", ...mains].forEach((m, idx) => {
      const b = el("button", { type: "button", "aria-pressed": idx === 0 ? "true" : "false", text: m });
      b.addEventListener("click", () => {
        main = m; sub = ""; press(row1, b);
        const c = CATS.find(x => x.name === m);
        showSubs(m); setNote(c && c.description); apply();
      });
      row1.append(b);
    });
  }

  /* ---------- flip a frame to read its back ---------- */
  const flip = $("#flip"), flipper = $(".flipper", flip);
  const front = $(".face-front", flip), back = $(".face-back", flip);
  let flipAnim = null, flipIdx = -1, flipCard = null;

  function fillBack(p) {
    $("[data-f-cat]", back).textContent = catText(p);
    $("[data-f-title]", back).textContent = p.title || "Untitled";
    const d = $("[data-f-desc]", back);
    d.textContent = "";
    const paras = String(p.description || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (paras.length) paras.forEach(t => d.append(el("p", { text: t })));
    else d.append(el("p", { text: "Full write-up coming soon." }));
    const link = $("[data-f-link]", back);
    link.hidden = !p.link;
    if (p.link) { link.href = p.link; link.textContent = /x\.com|twitter\.com/i.test(p.link) ? "View on X" : "View link"; }
    const old = $(".back-thumb", back); if (old) old.remove();
    back.append(el("div", { class: "back-thumb", "aria-hidden": "true" }, el("div", { class: "art" }, cover(p))));
  }

  function openFlip(i, card) {
    if (!flip.hidden || !projects[i]) return;
    flipIdx = i; flipCard = card;
    const frameEl = $(".frame", card);
    const r = frameEl.getBoundingClientRect();
    const W = Math.min(660, innerWidth * .92);
    const H = Math.min(innerHeight * .84, Math.max(W * .82, 440));
    flipper.style.cssText = `left:${(innerWidth - W) / 2}px;top:${(innerHeight - H) / 2}px;width:${W}px;height:${H}px`;
    front.textContent = "";
    const clone = frameEl.cloneNode(true);
    $$(".wire, .nail", clone).forEach(n => n.remove());
    front.append(clone);
    $$("video", clone).forEach(v => { v.muted = true; const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); });
    fillBack(projects[i]);
    back.scrollTop = 0;
    flip.hidden = false;
    document.body.classList.add("no-scroll");
    card.classList.add("flipped");
    const tiltDeg = parseFloat(getComputedStyle($(".hang", card)).getPropertyValue("--tilt")) || 0;
    const dx = r.left + r.width / 2 - innerWidth / 2, dy = r.top + r.height / 2 - innerHeight / 2;
    const sx = r.width / W, sy = r.height / H;
    flipAnim = flipper.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy}) rotateZ(${tiltDeg}deg) rotateY(0deg)` },
      { transform: `translate(${dx * .35}px,${dy * .35 - 50}px) scale(${(sx + 1) / 2 * 1.08}) rotateZ(-5deg) rotateY(75deg)`, offset: .45 },
      { transform: "translate(0,-6px) scale(1.02) rotateZ(1deg) rotateY(190deg)", offset: .8 },
      { transform: "translate(0,0) scale(1) rotateZ(0deg) rotateY(180deg)" }
    ], { duration: reduce ? 1 : 1000, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" });
    requestAnimationFrame(() => flip.classList.add("open"));
    flipAnim.finished.then(() => $(".flip-close", back).focus({ preventScroll: true }));
  }

  function closeFlip(instant) {
    if (flip.hidden || !flipAnim) return Promise.resolve();
    flip.classList.remove("open");
    const done = () => {
      flip.hidden = true;
      if (flipCard) { flipCard.classList.remove("flipped"); if (!instant) flipCard.focus({ preventScroll: true }); }
      if (viewer.hidden) document.body.classList.remove("no-scroll");
      flipAnim = null;
    };
    if (instant || reduce) { flipAnim.cancel(); done(); return Promise.resolve(); }
    flipAnim.playbackRate = 1.25;
    flipAnim.reverse();
    return flipAnim.finished.then(done, done);
  }
  $(".flip-close", back).addEventListener("click", () => closeFlip());
  $(".flip-backdrop", flip).addEventListener("click", () => closeFlip());
  $("[data-f-full]", back).addEventListener("click", () => {
    const r = flipper.getBoundingClientRect();
    const from = [r.top, innerWidth - r.right, innerHeight - r.bottom, r.left].map(v => Math.max(0, v) + "px");
    const i = flipIdx;
    closeFlip(true);
    openViewer(i, null, true, from);
  });

  /* ---------- full project viewer ---------- */
  const viewer = $("#viewer");
  const vBody = $(".viewer-body", viewer);
  let current = -1, lastFocus = null;

  function fillViewer(i) {
    const p = projects[i];
    const media = $("[data-v-media]", viewer);
    media.textContent = "";
    const add = (node, empty) => { const f = framed(node, ""); if (empty) $(".art", f).classList.add("empty"); $$(".wire, .nail", f).forEach(n => n.remove()); media.append(f); };
    mediaList(p).forEach((src, n) => {
      const k = kind(src), label = (p.title || "Project") + " " + (k === "image" ? "image " : "video ") + (n + 1);
      if (k === "yt") add(el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + ytId(src), title: label, allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: "", loading: "lazy" }));
      else if (k === "video") { const v = el("video", { src, controls: "", playsinline: "", preload: "metadata", "aria-label": label }); v.addEventListener("error", () => v.replaceWith(placeholder("Video not found"))); add(v); }
      else add(image(src, label, n === 0));
    });
    if (!media.children.length) add(placeholder(), true);
    // reference images (only for projects that have them)
    const refs = (p.references || []).filter(r => r && r.image);
    if (refs.length) {
      const box = el("div", { class: "refs" }, el("h3", { class: "refs-title", text: (SITE.labels || {}).reference || "Reference" }));
      const row = el("div", { class: "refs-row" });
      refs.forEach((r, n) => {
        const f = framed(image(r.image, "Reference " + (n + 1) + (r.credit ? ": " + r.credit : "")), "black");
        $$(".wire, .nail", f).forEach(x => x.remove());
        row.append(el("figure", { class: "ref" }, f, el("figcaption", { class: "ref-credit", text: "Reference" + (r.credit ? ": " + r.credit : "") })));
      });
      box.append(row);
      media.append(box);
    }
    $("[data-v-cat]", viewer).textContent = catText(p);
    $("[data-v-title]", viewer).textContent = p.title || "Untitled";
    const desc = $("[data-v-desc]", viewer);
    desc.textContent = "";
    const paras = String(p.description || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (paras.length) paras.forEach(t => desc.append(el("p", { text: t })));
    else desc.append(el("p", { text: "Full write-up coming soon." }));
    const link = $("[data-v-link]", viewer);
    link.hidden = !p.link;
    if (p.link) { link.href = p.link; link.textContent = /x\.com|twitter\.com/i.test(p.link) ? "View the post on X" : "View project"; }
    $("[data-v-count]", viewer).textContent = (i + 1) + " of " + projects.length;
    const multi = projects.length > 1;
    $(".viewer-prev", viewer).hidden = !multi;
    $(".viewer-next", viewer).hidden = !multi;
  }
  function setClip(v) { ["--ct", "--cr", "--cb", "--cl"].forEach((k, n) => viewer.style.setProperty(k, v ? v[n] : "0px")); }
  function cardInset(i) {
    const c = $('.card[data-index="' + i + '"] .frame');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) return null;
    return [r.top, innerWidth - r.right, innerHeight - r.bottom, r.left].map(v => Math.max(0, v) + "px");
  }
  function openViewer(i, _card, push, from) {
    if (!projects[i]) return;
    current = i;
    fillViewer(i);
    const hash = "#project-" + (i + 1);
    if (push && location.hash !== hash) history.pushState({ viewer: true }, "", hash);
    if (!viewer.hidden) return;
    lastFocus = $('.card[data-index="' + i + '"]');
    viewer.style.transition = "none";
    setClip(reduce ? null : (from || cardInset(i)));
    viewer.hidden = false;
    viewer.scrollTop = 0;
    document.body.classList.add("no-scroll");
    void viewer.offsetWidth;
    viewer.style.transition = "";
    setClip(null);
    $(".viewer-close", viewer).focus({ preventScroll: true });
  }
  function closeViewer() {
    if (viewer.hidden) return;
    const to = reduce ? null : cardInset(current);
    const done = () => {
      if (viewer.hidden) return;
      viewer.hidden = true;
      document.body.classList.remove("no-scroll");
      $$("video", viewer).forEach(v => v.pause());
      $("[data-v-media]", viewer).textContent = "";
      if (lastFocus) lastFocus.focus({ preventScroll: true });
      current = -1;
    };
    if (to) {
      setClip(to);
      viewer.addEventListener("transitionend", function te(e) { if (e.target === viewer) { viewer.removeEventListener("transitionend", te); done(); } });
      setTimeout(done, 900);
    } else done();
  }
  function requestClose() {
    if (history.state && history.state.viewer) history.back();
    else { history.replaceState(null, "", "#work"); closeViewer(); }
  }
  function step(d) {
    if (projects.length < 2) return;
    const next = (current + d + projects.length) % projects.length;
    const swap = () => { fillViewer(next); current = next; lastFocus = $('.card[data-index="' + next + '"]'); history.replaceState(history.state, "", "#project-" + (next + 1)); viewer.scrollTop = 0; };
    if (reduce) return swap();
    vBody.style.setProperty("--dir", (d > 0 ? -40 : 40) + "px");
    vBody.style.setProperty("--rot", (d > 0 ? -1.5 : 1.5) + "deg");
    vBody.classList.add("swap");
    setTimeout(() => {
      swap();
      vBody.style.setProperty("--dir", (d > 0 ? 40 : -40) + "px");
      vBody.style.setProperty("--rot", (d > 0 ? 1.5 : -1.5) + "deg");
      vBody.style.transition = "none"; void vBody.offsetWidth; vBody.style.transition = "";
      vBody.classList.remove("swap");
    }, 320);
  }
  $(".viewer-close", viewer).addEventListener("click", requestClose);
  $(".viewer-prev", viewer).addEventListener("click", () => step(-1));
  $(".viewer-next", viewer).addEventListener("click", () => step(1));

  function trapTab(e, box) {
    const f = $$("button:not([hidden]), a[href]:not([hidden]), video, iframe", box).filter(n => n.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  document.addEventListener("keydown", e => {
    if (!viewer.hidden) {
      if (e.key === "Escape") requestClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") trapTab(e, viewer);
    } else if (!flip.hidden) {
      if (e.key === "Escape") closeFlip();
      else if (e.key === "Tab") trapTab(e, back);
    }
  });
  function route() {
    const m = /^#project-(\d+)$/.exec(location.hash);
    if (m && projects[m[1] - 1]) openViewer(m[1] - 1, null, false);
    else closeViewer();
  }
  addEventListener("popstate", route);

  /* ---------- about ---------- */
  const bio = $("[data-bio]");
  (P.bio || []).forEach(t => bio.append(el("p", { class: "pop", text: t })));
  const proc = $("[data-process]");
  (P.process || []).forEach(s => proc.append(el("li", { class: "pop" }, el("strong", { text: s.title }), el("p", { text: s.text }))));
  if (!(P.process || []).length) proc.previousElementSibling.hidden = true;

  const facts = $("[data-facts]");
  const row = (dt, dd, cls) => facts.append(el("div", {}, el("dt", { text: dt }), el("dd", cls ? { class: cls } : {}, dd)));
  if (P.age) row("Age", P.age);
  if (P.location) row("Based in", P.location);
  const liveDd = el("span");
  row("My time now", liveDd, "live");
  (P.facts || []).forEach(f => row(f.label, f.value));

  const tl = $("[data-timeline]");
  (SITE.timeline || []).forEach((t, i) => tl.append(el("li", { style: `--i:${i}` }, el("span", { class: "when", text: t.when }), el("span", { class: "what", text: t.text }))));
  if (!(SITE.timeline || []).length) tl.previousElementSibling.hidden = true;

  const clock = $("[data-clock]");
  function timeNow() {
    try { return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: P.timeZone || "Africa/Cairo" }).format(new Date()); }
    catch (e) { const d = new Date(Date.now() + (P.utcOffset || 2) * 3600e3); return (d.getUTCHours() % 12 || 12) + ":" + String(d.getUTCMinutes()).padStart(2, "0"); }
  }
  function tick() {
    const t = timeNow();
    liveDd.textContent = t + (P.timezoneLabel ? " (" + P.timezoneLabel + ")" : "");
    clock.textContent = "It's " + t + " for me" + (P.location ? " in " + P.location : "") + " rn.";
  }
  tick(); setInterval(tick, 20000);

  /* ---------- skills ---------- */
  const sw = $("[data-skills]");
  (SITE.skills || []).forEach((g, n) => {
    const ul = el("ul");
    (g.items || []).forEach((it, i) => {
      const [nm, note] = String(it).split("|").map(s => s.trim());
      ul.append(el("li", { style: `--i:${i}` }, nm, note ? el("span", { class: "skill-note", text: note }) : null));
    });
    sw.append(el("div", { class: "skill-group" + (n === 0 ? " lead" : "") }, el("h3", { text: g.group }), ul));
  });

  /* ---------- contact ---------- */
  const discordBtn = $("[data-copy-discord]");
  if (C.discord) {
    setText("[data-discord]", C.discord);
    const status = $("[data-copy-status]");
    discordBtn.addEventListener("click", async e => {
      let ok = false;
      try { await navigator.clipboard.writeText(C.discord); ok = true; } catch (err) {
        const t = el("textarea", { readonly: "" }); t.value = C.discord; document.body.append(t); t.select();
        try { ok = document.execCommand("copy"); } catch (e2) { ok = false; } t.remove();
      }
      status.textContent = ok ? "Copied!" : "Select and copy: " + C.discord;
      if (ok) sparks(e.clientX || discordBtn.getBoundingClientRect().left + 40, e.clientY || discordBtn.getBoundingClientRect().top + 20);
      setTimeout(() => { status.textContent = "Copy username"; }, 2200);
    });
  } else discordBtn.hidden = true;
  const xA = $("[data-x]");
  if (C.xUrl) { xA.href = C.xUrl; setText("[data-x-handle]", C.xHandle || C.xUrl.replace(/^https?:\/\/(www\.)?/, "")); }
  else xA.hidden = true;
  if (C.email) { const m = $("[data-email]"); m.hidden = false; m.href = "mailto:" + C.email; setText("[data-email-value]", C.email); }

  function sparks(x, y) {
    if (reduce) return;
    for (let k = 0; k < 9; k++) {
      const s = el("span", { class: "spark", text: ["✦", "✧", "★"][k % 3], style: `left:${x}px;top:${y}px` });
      document.body.append(s);
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
      s.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1.1) rotate(${a * 60}deg)`, opacity: 0 }],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" }).finished.then(() => s.remove());
    }
  }

  /* ---------- editable titles + buttons ---------- */
  const L = SITE.labels || {};
  $$("[data-label]").forEach(n => { const v = L[n.dataset.label]; if (v) n.textContent = v; });

  /* ---------- split headings into letters ---------- */
  $$("[data-split]").forEach(h => {
    const text = h.textContent.trim();
    h.textContent = "";
    h.setAttribute("aria-label", text);
    let i = 0;
    text.split(" ").forEach((w, wi, arr) => {
      const word = el("span", { class: "word", "aria-hidden": "true" });
      [...w].forEach(ch => word.append(el("span", { class: "split-ch", style: `--i:${i++}`, text: ch })));
      h.append(word);
      if (wi < arr.length - 1) h.append(" ");
    });
    if (h.classList.contains("section-title")) {
      h.insertAdjacentHTML("beforeend", '<svg class="ink-underline" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10C60 4 140 3 297 8"/></svg>');
    }
  });

  /* ---------- nav, progress, glow ---------- */
  const nav = $("#nav"), prog = $(".progress");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("scrolled", scrollY > 30);
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max) : 0);
      ticking = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toggle = $(".nav-toggle"), links = $("#nav-links");
  const setMenu = open => { toggle.setAttribute("aria-expanded", open); links.classList.toggle("open", open); document.body.classList.toggle("no-scroll", open); };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  const navMap = new Map($$("a", links).map(a => [a.getAttribute("href").slice(1), a]));
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    const a = navMap.get(e.target.id);
    if (a && e.isIntersecting) { navMap.forEach(x => x.classList.remove("active")); a.classList.add("active"); }
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => secObs.observe(s));

  /* ---------- scroll reveals ---------- */
  const revealObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    revealObs.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$("[data-split], .card, .pop, .timeline, .skill-group").forEach((n, i) => {
    if (n.classList.contains("pop")) n.style.transitionDelay = (i % 3) * .1 + "s";
    revealObs.observe(n);
  });

  /* ---------- cursor ---------- */
  if (finePointer && !reduce) {
    const cur = $(".cursor");
    addEventListener("pointermove", e => { cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; cur.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.remove("on"));
    document.addEventListener("pointerover", e => {
      const t = e.target;
      cur.classList.toggle("big", !!t.closest(".card"));
      cur.classList.toggle("link", !t.closest(".card") && !!t.closest("a, button, .tool"));
    });
  }

  /* ---------- cozy cave scene ---------- */
  caveScene();

  /* ---------- loader ---------- */
  const start = performance.now();
  function finish() {
    const wait = reduce ? 0 : Math.max(0, 1300 - (performance.now() - start));
    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => { const l = $(".loader"); if (l) l.remove(); }, 1100);
      route();
    }, wait);
  }
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 2000))]).then(finish);

  /* =========================================================
     COZY CAVE SCENE: everything drawn into ONE canvas for speed
     (layered parallax, rain, waterfall, fireflies, ferns; original art)
     ========================================================= */
  function caveScene() {
    const root = $(".scene");
    if (!root) return;
    const cv = $(".scene-canvas", root), ctx = cv.getContext("2d", { alpha: false });
    const hint = $(".scene-hint");
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const f1 = n => n.toFixed(1);

    /* ---- artwork as SVG (built once) ---- */
    function skyline(o) {
      let x = -60, d = "M-60 1000", wins = "";
      while (x < 2060) {
        const w = o.wMin + rnd() * (o.wMax - o.wMin);
        const near = Math.max(.12, 1 - Math.abs(x / 2000 - o.peak) * 1.6);
        const h = o.hMin + (o.hMax - o.hMin) * near * (.55 + rnd() * .45);
        const top = 1000 - h, sp = w * (1 + rnd() * 1.8), sh = top + sp * .18;
        d += ` L${f1(x)} ${f1(sh)} L${f1(x + w * .14)} ${f1(sh)} L${f1(x + w * .14)} ${f1(top)} L${f1(x + w / 2)} ${f1(top - sp)} L${f1(x + w * .86)} ${f1(top)} L${f1(x + w * .86)} ${f1(sh)} L${f1(x + w)} ${f1(sh)}`;
        if (o.windows) for (let k = 0; k < 3; k++) if (rnd() < .33)
          wins += `<rect x="${f1(x + w * .3 + rnd() * w * .35)}" y="${f1(top + 30 + rnd() * h * .55)}" width="${f1(w * .09)}" height="${f1(w * .15)}" rx="2" fill="#F2C27B" opacity="${(.3 + rnd() * .45).toFixed(2)}"/>`;
        const gap = rnd() * o.gap;
        if (gap > 8) { const gy = 1000 - h * (.2 + rnd() * .25); d += ` L${f1(x + w)} ${f1(gy)} L${f1(x + w + gap)} ${f1(gy)}`; }
        x += w + gap;
      }
      return `<path d="${d} L2060 1000 Z" fill="${o.color}"/>` + wins;
    }
    const FAR1 = skyline({ color: "#1A3638", wMin: 28, wMax: 85, hMin: 220, hMax: 740, peak: .66, gap: 50 });
    const FAR2 = skyline({ color: "#122926", wMin: 60, wMax: 150, hMin: 140, hMax: 470, peak: .26, gap: 120, windows: true });
    const WF = { x0: 1750, x1: 1822, y0: 366, y1: 955 };
    let top = "M-20 -20 L2020 -20 L2020 70";
    for (let x = 2020; x > -20; x -= 40) {
      const drip = rnd() < .2 ? 50 + rnd() * 90 : 0, y = 62 + Math.sin(x * .013) * 24 + rnd() * 26;
      top += ` Q${f1(x - 20)} ${f1(y + 10 + drip)} ${f1(x - 40)} ${f1(y)}`;
    }
    top += " L-20 -20 Z";
    let vines = "";
    for (let x = 40; x < 1980; x += 70 + rnd() * 90) {
      if (x > 1700 && x < 1880) continue;
      const Lh = 110 + rnd() * 300, y = 70 + rnd() * 20, sw = (rnd() - .5) * 40;
      vines += `<path d="M${f1(x)} ${f1(y)} C${f1(x + sw)} ${f1(y + Lh * .35)} ${f1(x - sw)} ${f1(y + Lh * .65)} ${f1(x + sw * .4)} ${f1(y + Lh)}" fill="none" stroke="#173430" stroke-width="${f1(3 + rnd() * 3)}" stroke-linecap="round"/>`;
      for (let t = .12; t < 1; t += .1 + rnd() * .06) {
        const vx = x + sw * (t < .5 ? t : 1 - t) * 1.2, vy = y + Lh * t, side = rnd() < .5 ? -1 : 1;
        vines += `<ellipse cx="${f1(vx + side * 9)}" cy="${f1(vy)}" rx="${f1(9 + rnd() * 6)}" ry="${f1(4 + rnd() * 2)}" transform="rotate(${f1(side * (25 + rnd() * 30))} ${f1(vx + side * 9)} ${f1(vy)})" fill="#1C3D35"/>`;
      }
    }
    const MID = `<path d="${top}" fill="#0E201B"/>${vines}
      <path d="M-20 1000 L-20 380 C120 400 170 470 235 560 C292 642 305 760 385 862 C425 920 470 962 525 1000 Z" fill="#0D1E19"/>
      <path d="M-20 1000 L-20 600 C60 640 120 700 160 780 C190 850 240 930 300 1000 Z" fill="#0A1814"/>
      <path d="M2020 1000 L2020 230 C1975 240 1915 290 1860 336 L1834 356 L1742 368 C1766 384 1812 392 1838 412 C1892 470 1902 600 1884 720 C1870 820 1894 920 1944 1000 Z" fill="#0D1E19"/>
      <path d="M1742 368 C1776 362 1806 359 1834 356" stroke="#2C5248" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M1180 1000 C1230 760 1330 640 1420 610 C1470 596 1510 640 1530 700 C1560 800 1600 900 1640 1000 Z" fill="#0C1C17"/>
      <ellipse cx="1786" cy="962" rx="240" ry="34" fill="#14302D"/>
      <path d="M300 1000 Q700 958 1120 984 T1960 990 L1960 1000 Z" fill="#0B1915"/>`;
    function fernSvg() {
      let out = "";
      for (let k = 0; k < 7; k++) {
        const ang = (-70 + k * (140 / 6) + (rnd() - .5) * 14) * Math.PI / 180;
        const len = 210 + rnd() * 150, bend = (rnd() * .5 + .25) * (ang < 0 ? -1 : 1);
        const ex = 200 + Math.sin(ang) * len, ey = 400 - Math.cos(ang) * len;
        const cx = 200 + Math.sin(ang) * len * .5 + bend * 60, cy = 400 - Math.cos(ang) * len * .65;
        out += `<path d="M200 400 Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" stroke="#06100C" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        for (let t = .12; t < .98; t += .07) {
          const x = (1 - t) * (1 - t) * 200 + 2 * (1 - t) * t * cx + t * t * ex, y = (1 - t) * (1 - t) * 400 + 2 * (1 - t) * t * cy + t * t * ey;
          const dx = 2 * (1 - t) * (cx - 200) + 2 * t * (ex - cx), dy = 2 * (1 - t) * (cy - 400) + 2 * t * (ey - cy);
          const a = Math.atan2(dy, dx) * 180 / Math.PI, r = 26 * (1 - t) + 6;
          [62, -62].forEach(o => { out += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .3)}" transform="rotate(${f1(a + o)} ${f1(x)} ${f1(y)}) translate(${f1(r * .8)} 0)" fill="#06100C"/>`; });
        }
      }
      return out;
    }
    const FERN1 = fernSvg(), FERN2 = fernSvg();

    /* ---- turn SVG into bitmaps (redone on resize) ---- */
    function raster(inner, vb, par, w, h) {
      return new Promise(res => {
        const img = new Image();
        img.onload = () => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); res(c); };
        img.onerror = () => res(null);
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="${vb}" preserveAspectRatio="${par}">${inner}</svg>`);
      });
    }
    let W = 0, H = 0, q = 1, bmp = {}, ready = false, rTimer;
    function makeSky() {
      const c = document.createElement("canvas"); c.width = Math.round(W * q); c.height = Math.round(H * q);
      const g = c.getContext("2d"); g.scale(q, q);
      let gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "#091418"); gr.addColorStop(.42, "#0E2226"); gr.addColorStop(.72, "#11291F"); gr.addColorStop(1, "#08130F");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const mx0 = W * .82, my0 = H * .12, R0 = Math.max(W, H) * .55;
      gr = g.createRadialGradient(mx0, my0, 0, mx0, my0, R0);
      gr.addColorStop(0, "rgba(214,238,205,.22)"); gr.addColorStop(.3, "rgba(150,205,185,.08)"); gr.addColorStop(1, "rgba(150,205,185,0)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.save(); g.translate(mx0, my0);
      for (let k = 0; k < 9; k++) {
        const a = Math.PI * (.55 + k * .065), sp = .025;
        const rg = g.createRadialGradient(0, 0, 0, 0, 0, R0 * 1.3);
        rg.addColorStop(0, "rgba(215,240,210,.07)"); rg.addColorStop(1, "rgba(215,240,210,0)");
        g.fillStyle = rg; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R0 * 1.3, a - sp, a + sp); g.closePath(); g.fill();
      }
      g.restore();
      return c;
    }
    function makeFog() {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, "rgba(170,215,205,.16)"); gr.addColorStop(1, "rgba(170,215,205,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c;
    }
    async function build() {
      const LW = W * 1.12, LH = H * 1.12;
      const fw = Math.min(W * (W < 700 ? .62 : .36), 480);
      const [far1, far2, mid, fern1, fern2] = await Promise.all([
        raster(FAR1, "0 0 2000 1000", "xMidYMax slice", LW * q, LH * q),
        raster(FAR2, "0 0 2000 1000", "xMidYMax slice", LW * q, LH * q),
        raster(MID, "0 0 2000 1000", "xMaxYMax slice", LW * q, LH * q),
        raster(FERN1, "0 0 400 400", "xMidYMax meet", fw * q, fw * q),
        raster(FERN2, "0 0 400 400", "xMidYMax meet", fw * q, fw * q)
      ]);
      bmp = { sky: makeSky(), fog: bmp.fog || makeFog(), far1, far2, mid, fern1, fern2, fw };
      ready = true;
      if (reduce) draw(0, 0);
    }
    function resize() {
      W = innerWidth; H = innerHeight;
      // the scene is soft and painterly, so it renders below screen resolution: much smoother
      const area = W * H;
      q = Math.min(devicePixelRatio || 1, 1) * (area > 1.6e6 ? .55 : area > 6e5 ? .62 : .8);
      cv.width = Math.round(W * q); cv.height = Math.round(H * q);
      ctx.setTransform(q, 0, 0, q, 0, 0);
      clearTimeout(rTimer); rTimer = setTimeout(build, ready ? 200 : 0);
    }
    resize();
    addEventListener("resize", resize);

    /* ---- moving bits ---- */
    const spr = document.createElement("canvas"); spr.width = spr.height = 64;
    { const g = spr.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(246,255,200,1)"); gr.addColorStop(.16, "rgba(225,248,150,.95)"); gr.addColorStop(.42, "rgba(175,225,120,.28)"); gr.addColorStop(1, "rgba(150,210,120,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }
    const R = Math.random, small = W < 700;
    const flies = [], baseFlies = small ? 22 : 40;
    const mkFly = (x, y, burst) => ({ x: x ?? R() * W, y: y ?? R() * H, z: .35 + R() * .65, a: R() * 6.28, sp: .25 + R() * .45, ph: R() * 6.28, vx: burst ? (R() - .5) * 9 : 0, vy: burst ? (R() - .5) * 9 : 0 });
    for (let i = 0; i < baseFlies; i++) flies.push(mkFly());
    const drops = Array.from({ length: small ? 35 : 70 }, () => ({ x: R() * 1.2, y: R(), l: 10 + R() * 18, s: .9 + R() * .7 }));
    const streaks = Array.from({ length: 40 }, () => ({ u: R(), v: R(), l: .05 + R() * .16, sp: .0007 + R() * .0007, a: .15 + R() * .5, w: .8 + R() * 2.2 }));
    const splash = [], ripples = [{ t: 0 }, { t: .5 }];
    const fogs = [{ x: .25, y: .45, s: 1.2, sp: .000012, d: .2 }, { x: .5, y: .95, s: 1.3, sp: .000016, d: .7 }];
    const lean = [0, 0];

    let tmx = 0, tmy = 0, mx = 0, my = 0, px = -9999, py = -9999;
    if (!reduce) {
      addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; tmx = px / W * 2 - 1; tmy = py / H * 2 - 1; }, { passive: true });
      document.addEventListener("pointerleave", () => { px = py = -9999; });
      addEventListener("pointerdown", e => {
        if (e.target.closest("a, button, input, textarea, .card, .tool, .flip, .viewer, .nav")) return;
        for (let k = 0; k < 10; k++) flies.push(mkFly(e.clientX, e.clientY, true));
        while (flies.length > baseFlies + 50) flies.splice(baseFlies, 1);
        if (hint) hint.style.opacity = 0;
      });
    }
    const off = d => ({ x: -mx * d * 30, y: -my * d * 16 - Math.min(scrollY, H * 1.5) * d * .12 });
    function layer(c, d) { if (!c) return; const o = off(d); ctx.drawImage(c, -W * .06 + o.x, -H * .06 + o.y, W * 1.12, H * 1.12); }
    function midMap(vx, vy) {
      const LW = W * 1.12, LH = H * 1.12, s = Math.max(LW / 2000, LH / 1000), o = off(.55);
      return [-W * .06 + (LW - 2000 * s) + vx * s + o.x, -H * .06 + (LH - 1000 * s) + vy * s + o.y, s];
    }

    function draw(t, dt) {
      if (!ready) return;
      const sc = scrollY;
      mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(bmp.sky, 0, 0, W, H);
      layer(bmp.far1, .12);
      // drifting fog
      const fogSize = Math.max(W, H) * .7;
      fogs.forEach((f, i) => {
        if (i === 1) { layer(bmp.far2, .28); }
        f.x += f.sp * dt; if (f.x > 1.4) f.x = -.4; if (f.x < -.4) f.x = 1.4;
        const o = off(f.d);
        ctx.drawImage(bmp.fog, f.x * W - fogSize * f.s / 2 + o.x, f.y * H - fogSize * f.s * .3 + o.y, fogSize * f.s, fogSize * f.s * .6);
      });
      // rain (behind the cave)
      ctx.strokeStyle = "rgba(175,215,220,.13)"; ctx.lineWidth = 1; ctx.beginPath();
      drops.forEach(d => {
        d.y += d.s * dt * .0009; if (d.y > 1.05) { d.y = -.05; d.x = R() * 1.2; }
        const x = d.x * W - mx * 6, y = d.y * H;
        ctx.moveTo(x, y); ctx.lineTo(x - d.l * .18, y + d.l);
      });
      ctx.stroke();
      layer(bmp.mid, .55);

      // waterfall
      const [ax, ay, s] = midMap(WF.x0, WF.y0), [bx, by] = midMap(WF.x1, WF.y1);
      const w = bx - ax, h = by - ay, lw = Math.max(.6, s * 1.6);
      if (bx > -60 && ax < W + 60) {
        const gr = ctx.createLinearGradient(ax, 0, bx, 0);
        gr.addColorStop(0, "rgba(170,230,222,.05)"); gr.addColorStop(.5, "rgba(195,240,232,.24)"); gr.addColorStop(1, "rgba(170,230,222,.05)");
        ctx.fillStyle = gr; ctx.fillRect(ax, ay, w, h);
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "rgb(205,245,238)"; ctx.lineCap = "round";
        const near = px > ax - 30 && px < bx + 30;
        streaks.forEach(st => {
          st.v += st.sp * dt; if (st.v > 1) { st.v = -st.l; st.u = R(); }
          let x = ax + st.u * w + Math.sin(t * .003 + st.u * 20) * 1.2;
          const y = ay + Math.max(0, st.v) * h, y2 = Math.min(by, ay + (st.v + st.l) * h);
          if (y2 <= y) return;
          if (near && Math.abs(px - x) < 26 && py > y && py < y2 + 40) x += (x < px ? -1 : 1) * (26 - Math.abs(px - x)) * .8;
          ctx.globalAlpha = st.a; ctx.lineWidth = st.w * lw;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y2); ctx.stroke();
        });
        ctx.globalAlpha = .55; ctx.lineWidth = 3 * lw;
        ctx.beginPath(); ctx.moveTo(ax - 2, ay + 2); ctx.quadraticCurveTo(ax + w / 2, ay - 4, bx + 2, ay + 2); ctx.stroke();
        ctx.globalAlpha = .9;
        ctx.drawImage(bmp.fog, ax + w / 2 - w * 3, by - w * 1.2, w * 6, w * 2.4);
        ctx.strokeStyle = "rgba(200,240,235,.5)"; ctx.lineWidth = 1.2;
        ripples.forEach(r => {
          r.t += dt * .0004; if (r.t > 1) r.t = 0;
          ctx.globalAlpha = (1 - r.t) * .5;
          ctx.beginPath(); ctx.ellipse(ax + w / 2, by + 4 * s, w * (.6 + r.t * 2.4), w * (.12 + r.t * .4), 0, 0, 6.29); ctx.stroke();
        });
        for (let i = 0; i < 2; i++) splash.push({ x: ax + R() * w, y: by - 2, vx: (R() - .5) * 1.6, vy: -(1 + R() * 2.4), life: 1 });
        if (near && py > ay && py < by) splash.push({ x: px, y: py, vx: (R() - .5) * 3, vy: -(R() * 2), life: 1 });
        ctx.fillStyle = "rgb(215,248,242)";
        for (let i = splash.length - 1; i >= 0; i--) {
          const p = splash[i]; p.vy += .06 * dt / 16; p.x += p.vx * dt / 16; p.y += p.vy * dt / 16; p.life -= dt / 900;
          if (p.life <= 0) { splash.splice(i, 1); continue; }
          ctx.globalAlpha = p.life * .7; ctx.fillRect(p.x, p.y, 2, 2);
        }
        if (splash.length > 160) splash.splice(0, splash.length - 160);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }

      // fireflies
      ctx.globalCompositeOperation = "lighter";
      const shiftY = Math.min(sc, H * 1.5) * .1;
      flies.forEach(f => {
        f.a += Math.sin(t * .0007 + f.ph) * .02 + (R() - .5) * .08;
        f.vx *= .94; f.vy *= .94;
        f.x += (Math.cos(f.a) * f.sp * f.z + f.vx) * dt / 16;
        f.y += (Math.sin(f.a) * f.sp * f.z * .6 + f.vy + Math.sin(t * .001 + f.ph) * .12) * dt / 16;
        const sx = f.x - mx * f.z * 30, sy = f.y - my * f.z * 18 - shiftY * f.z;
        const dx = sx - px, dy = sy - py, d2 = dx * dx + dy * dy;
        if (d2 < 22500) { const d = Math.sqrt(d2) || 1, push = (150 - d) / 150 * .9; f.vx += dx / d * push; f.vy += dy / d * push; }
        if (f.x < -40) f.x = W + 40; else if (f.x > W + 40) f.x = -40;
        if (f.y < -40 - shiftY) f.y = H + 40; else if (f.y > H + 40 + shiftY) f.y = -40;
        const size = 8 + 20 * f.z, al = (.45 + .55 * Math.sin(t * .0021 + f.ph * 3)) * (.45 + .55 * f.z);
        if (al <= 0.02) return;
        ctx.globalAlpha = al;
        ctx.drawImage(spr, sx - size / 2, sy - size / 2, size, size);
      });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      // foreground ferns (fade out as you scroll), lean away from the cursor
      const fgA = 1 - Math.min(1, sc / (H * .8));
      if (fgA > 0 && bmp.fern1) {
        const fw = bmp.fw;
        [[bmp.fern1, -fw * .1 + fw / 2, 1], [bmp.fern2, W + fw * .12 - fw / 2, -1]].forEach(([img, bx0, flip], i) => {
          const o = off(1), x = bx0 + o.x * .6, near = px > -999 && py > H - fw * 1.1 ? Math.max(0, 1 - Math.abs(px - x) / (fw * .9)) : 0;
          lean[i] += ((px > x ? -1 : 1) * near * .09 - lean[i]) * .08;
          ctx.save(); ctx.globalAlpha = fgA;
          ctx.translate(x, H * 1.03 + Math.max(0, o.y) * .3);
          ctx.rotate(lean[i] + Math.sin(t * .0009 + i * 2) * .02);
          ctx.scale(flip, 1);
          ctx.drawImage(img, -fw / 2, -fw, fw, fw);
          ctx.restore();
        });
      }
      // darken behind the content further down the page
      const veil = Math.min(1, sc / H) * .62;
      if (veil > 0) { ctx.fillStyle = `rgba(6,16,18,${veil.toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
      if (hint && sc > 40) hint.style.opacity = 0;
    }

    if (reduce) return;
    let last = performance.now(), raf = 0, odd = false;
    function loop(t) {
      const dt = Math.min(50, t - last);
      // far down the page the scene is dimmed, so 30fps is plenty
      odd = !odd;
      if (scrollY < innerHeight * 1.2 || odd) { draw(t, dt); last = t; }
      raf = document.hidden ? 0 : requestAnimationFrame(loop);
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
    raf = requestAnimationFrame(loop);
  }
})();
