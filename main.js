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
  function cover(p) {
    const src = p.image || (p.gallery || [])[0];
    if (src) return image(src, p.title);
    if (isVideoFile(p.video)) { const v = el("video", { src: p.video, loop: "", playsinline: "", autoplay: "", preload: "metadata" }); v.muted = true; return v; }
    return placeholder();
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
    const art = t.image ? image(t.image, t.name + " logo", true) : el("div", { html: sketch(toolKind(t.name)), style: "display:contents" });
    const hang = el("div", { class: "hang", style: `--tilt:${[-1.5, 1.8, -.8][i]}deg` },
      framed(art, ["", "black", ""][i], el("p", { class: "tool-name", text: t.name })));
    whenHung(hang);
    const tool = el("div", { class: "tool", style: `--n:${i}` }, el("div", { class: "sway", style: `--dur:${3.4 + i * .9}s;animation-delay:-${i * 1.3}s` }, hang));
    tool.addEventListener("pointerenter", () => swing(hang));
    tool.addEventListener("click", () => swing(hang));
    toolWall.append(tool);
  });
  if (tools.length) {
    toolWall.append(el("div", { class: "lamp", "aria-hidden": "true", html:
      `<svg viewBox="0 0 100 150"><circle class="lamp-light" cx="62" cy="52" r="48"/>
       <rect x="14" y="78" width="14" height="40" rx="4" fill="#7A5A2E" stroke="#1E1A16" stroke-width="2.5"/>
       <path d="M21 96C21 70 62 76 62 50" fill="none" stroke="#B8935A" stroke-width="5" stroke-linecap="round"/>
       <path d="M42 50h40l-8-30H50z" fill="#E8DCC4" stroke="#1E1A16" stroke-width="2.5" stroke-linejoin="round"/>
       <path d="M47 42h30M49 34h26M51 27h22" stroke="#B8935A" stroke-width="1.5"/>
       <circle cx="62" cy="56" r="5" fill="#F6C66F"/></svg>` }));
  }

  /* ---------- work wall ---------- */
  const grid = $("#grid");
  const ordered = projects.map((p, i) => ({ p, i })).sort((a, b) => (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0));
  if (!projects.length) grid.append(el("p", { class: "grid-empty", text: "New work is on the way." }));
  ordered.forEach(({ p, i }, n) => {
    const tiltDeg = TILTS[n % TILTS.length];
    const tilt = el("div", { class: "tilt" }, framed(cover(p), FRAMES[n % FRAMES.length]));
    const hang = el("div", { class: "hang", style: `--tilt:${tiltDeg}deg` }, tilt);
    whenHung(hang);
    const card = el("a", {
      class: "card" + (p.featured ? " featured" : ""), href: "#project-" + (i + 1), "data-index": i, "data-cat": p.category || "",
      "aria-label": (p.title || "Untitled") + ", flip for details",
      style: `--dy:${p.featured ? 0 : [0, 2.5, 1, 3, .5, 1.8][n % 6]}rem;--d:${(n % 3) * .14}s;--lt:${-tiltDeg}deg`
    }, hang, el("div", { class: "label" }, el("span", { class: "label-title", text: p.title || "Untitled" }), p.category ? el("span", { class: "label-cat", text: p.category }) : null));
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
  });

  const cats = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const filterBar = $(".filters");
  if (cats.length > 1) {
    filterBar.hidden = false;
    ["All", ...cats].forEach((c, n) => {
      const b = el("button", { type: "button", "aria-pressed": n === 0 ? "true" : "false", text: c });
      b.addEventListener("click", () => {
        $$("button", filterBar).forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        let k = 0;
        $$(".card", grid).forEach(card => {
          const show = c === "All" || card.dataset.cat === c;
          card.classList.toggle("hide", !show);
          if (show && !reduce) {
            const h = $(".hang", card);
            h.classList.remove("hung", "swing");
            card.style.setProperty("--d", (k++ % 3) * .1 + "s");
            void h.offsetWidth;
          }
        });
      });
      filterBar.append(b);
    });
  }

  /* ---------- flip a frame to read its back ---------- */
  const flip = $("#flip"), flipper = $(".flipper", flip);
  const front = $(".face-front", flip), back = $(".face-back", flip);
  let flipAnim = null, flipIdx = -1, flipCard = null;

  function fillBack(p) {
    $("[data-f-cat]", back).textContent = p.category || "";
    $("[data-f-title]", back).textContent = p.title || "Untitled";
    const d = $("[data-f-desc]", back);
    d.textContent = "";
    const paras = String(p.description || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (paras.length) paras.forEach(t => d.append(el("p", { text: t })));
    else d.append(el("p", { text: p.link ? "Full write-up coming soon. The post on X has the details for now." : "Full write-up coming soon." }));
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
    const yt = ytId(p.video);
    const add = (node, empty) => { const f = framed(node, ""); if (empty) $(".art", f).classList.add("empty"); $$(".wire, .nail", f).forEach(n => n.remove()); media.append(f); };
    if (yt) add(el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + yt, title: (p.title || "Project") + " video", allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: "", loading: "lazy" }));
    else if (isVideoFile(p.video)) add(el("video", { src: p.video, controls: "", playsinline: "", preload: "metadata" }));
    [p.image, ...(p.gallery || [])].filter(Boolean).forEach((src, n) => add(image(src, (p.title || "Project") + " image " + (n + 1), n === 0)));
    if (!media.children.length) add(placeholder(), true);
    $("[data-v-cat]", viewer).textContent = p.category || "";
    $("[data-v-title]", viewer).textContent = p.title || "Untitled";
    const desc = $("[data-v-desc]", viewer);
    desc.textContent = "";
    const paras = String(p.description || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (paras.length) paras.forEach(t => desc.append(el("p", { text: t })));
    else if (p.link) desc.append(el("p", { text: "Full write-up coming soon. The post on X has the details for now." }));
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
    clock.textContent = "It's " + t + " for me in " + (P.location || "my timezone") + " right now.";
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
  const nav = $("#nav"), prog = $(".progress"), glow = $(".glow");
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

  /* ---------- cursor + lamp light ---------- */
  if (finePointer && !reduce) {
    const cur = $(".cursor");
    let x = innerWidth * .75, y = innerHeight * .25, cx = x, cy = y, gx = x, gy = y;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; cur.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.remove("on"));
    document.addEventListener("pointerover", e => {
      const t = e.target;
      cur.classList.toggle("big", !!t.closest(".card"));
      cur.classList.toggle("link", !t.closest(".card") && !!t.closest("a, button, .tool"));
    });
    (function loop() {
      cx += (x - cx) * .22; cy += (y - cy) * .22;
      gx += (x - gx) * .06; gy += (y - gy) * .06;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      glow.style.setProperty("--mx", gx + "px");
      glow.style.setProperty("--my", gy + "px");
      requestAnimationFrame(loop);
    })();
  }

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
})();
