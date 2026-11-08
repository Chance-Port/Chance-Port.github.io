/* Chance portfolio. You shouldn't need to edit this file; content lives in content.js */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        tag.style.cssText = "position:fixed;bottom:1rem;left:1rem;z-index:140;background:#2A1E18;color:#E9E2D4;padding:.5rem .9rem;font-weight:700";
        document.body.appendChild(tag);
      }
    } catch (e) { /* storage unavailable: show the normal content */ }
  }
  const P = SITE.profile || {};
  const C = SITE.contact || {};
  const projects = (SITE.projects || []).filter(p => p && (p.title || p.image || p.link));

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(c => c != null && n.append(c));
    return n;
  }
  const setText = (sel, v) => $$(sel).forEach(n => { n.textContent = v; });

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
    const ph = el("div", { class: "placeholder" });
    ph.innerHTML = '<svg viewBox="0 0 120 110" aria-hidden="true"><path d="M14 52 60 14l46 38"/><path d="M22 46v52h76V46"/><path d="M50 98V68h20v30"/></svg>';
    ph.append(el("span", { text: label || "Render coming soon" }));
    return ph;
  }
  function image(src, alt, eager) {
    const img = el("img", { src, alt: alt || "", loading: eager ? "eager" : "lazy", decoding: "async" });
    img.addEventListener("error", () => img.replaceWith(placeholder("Image not found")));
    return img;
  }
  function cover(p) {
    const src = p.image || (p.gallery || [])[0];
    if (src) return image(src, p.title);
    if (isVideoFile(p.video)) {
      const v = el("video", { src: p.video, muted: "", loop: "", playsinline: "", autoplay: "", preload: "metadata" });
      v.muted = true;
      return v;
    }
    return placeholder();
  }

  /* ---------- work grid ---------- */
  const grid = $("#grid");
  const ordered = projects.map((p, i) => ({ p, i })).sort((a, b) => (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0));
  if (!projects.length) grid.append(el("p", { class: "grid-empty", text: "New work is on the way." }));
  ordered.forEach(({ p, i }) => {
    const frame = el("div", { class: "card-frame reveal" }, el("div", { class: "card-frame-in" }, cover(p)));
    const card = el("a", { class: "card" + (p.featured ? " featured" : ""), href: "#project-" + (i + 1), "data-index": i, "data-cat": p.category || "" },
      frame,
      el("div", { class: "card-meta" },
        el("h3", { class: "card-title", text: p.title || "Untitled" }),
        p.category ? el("span", { class: "card-cat", text: p.category }) : null));
    card.addEventListener("click", e => { e.preventDefault(); openViewer(i, card, true); });
    grid.append(card);
  });

  // filters: only shown when there is more than one category
  const cats = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const filterBar = $(".filters");
  if (cats.length > 1) {
    filterBar.hidden = false;
    ["All", ...cats].forEach((c, n) => {
      const b = el("button", { type: "button", "aria-pressed": n === 0 ? "true" : "false", text: c });
      b.addEventListener("click", () => {
        $$("button", filterBar).forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        $$(".card", grid).forEach(card => {
          const show = c === "All" || card.dataset.cat === c;
          card.classList.toggle("hide", !show);
          if (show && !reduce) card.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.22,.8,.2,1)" });
        });
      });
      filterBar.append(b);
    });
  }

  /* ---------- project viewer ---------- */
  const viewer = $("#viewer");
  const vBody = $(".viewer-body", viewer);
  let current = -1, lastCard = null;

  function fill(i) {
    const p = projects[i];
    const media = $("[data-v-media]", viewer);
    media.textContent = "";
    const yt = ytId(p.video);
    if (yt) media.append(el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + yt, title: (p.title || "Project") + " video", allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: "", loading: "lazy" }));
    else if (isVideoFile(p.video)) media.append(el("video", { src: p.video, controls: "", playsinline: "", preload: "metadata" }));
    [p.image, ...(p.gallery || [])].filter(Boolean).forEach((src, n) => media.append(image(src, (p.title || "Project") + " image " + (n + 1), n === 0)));
    if (!media.children.length) media.append(el("div", { class: "frame" }, placeholder()));

    $("[data-v-cat]", viewer).textContent = p.category || "";
    $("[data-v-title]", viewer).textContent = p.title || "Untitled";
    const desc = $("[data-v-desc]", viewer);
    desc.textContent = "";
    const paras = String(p.description || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (paras.length) paras.forEach(t => desc.append(el("p", { text: t })));
    else if (p.link) desc.append(el("p", { class: "note", text: "Full write-up coming soon. The post on X has the details for now." }));
    const link = $("[data-v-link]", viewer);
    link.hidden = !p.link;
    if (p.link) {
      link.href = p.link;
      link.textContent = /x\.com|twitter\.com/i.test(p.link) ? "View the post on X" : "View project";
    }
    $("[data-v-count]", viewer).textContent = (i + 1) + " of " + projects.length;
    const multi = projects.length > 1;
    $(".viewer-prev", viewer).hidden = !multi;
    $(".viewer-next", viewer).hidden = !multi;
  }

  function rectInset(node) {
    if (!node) return null;
    const r = (node.querySelector(".card-frame") || node).getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) return null;
    return [r.top, innerWidth - r.right, innerHeight - r.bottom, r.left].map(v => Math.max(0, v) + "px");
  }
  function setClip(v) { ["--ct", "--cr", "--cb", "--cl"].forEach((k, n) => viewer.style.setProperty(k, v ? v[n] : "0px")); }

  function openViewer(i, card, push) {
    if (!projects[i]) return;
    current = i;
    lastCard = card || $('.card[data-index="' + i + '"]');
    fill(i);
    const hash = "#project-" + (i + 1);
    if (push && location.hash !== hash) history.pushState({ viewer: true }, "", hash);
    if (!viewer.hidden) return;
    const from = reduce ? null : rectInset(card);
    viewer.style.transition = "none";
    setClip(from);
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
    const to = reduce ? null : rectInset($('.card[data-index="' + current + '"]'));
    const done = () => {
      viewer.hidden = true;
      document.body.classList.remove("no-scroll");
      $$("video", viewer).forEach(v => v.pause());
      $("[data-v-media]", viewer).textContent = "";
      if (lastCard) lastCard.focus({ preventScroll: true });
      current = -1;
    };
    if (to) {
      setClip(to);
      viewer.addEventListener("transitionend", function te(e) { if (e.target === viewer) { viewer.removeEventListener("transitionend", te); done(); } });
      setTimeout(() => { if (!viewer.hidden && current !== -1) done(); }, 900);
    } else done();
  }
  function requestClose() {
    if (history.state && history.state.viewer) history.back();
    else { history.replaceState(null, "", "#work"); closeViewer(); }
  }
  function step(d) {
    if (projects.length < 2) return;
    const next = (current + d + projects.length) % projects.length;
    const swap = () => { fill(next); current = next; lastCard = $('.card[data-index="' + next + '"]'); history.replaceState(history.state, "", "#project-" + (next + 1)); viewer.scrollTop = 0; };
    if (reduce) return swap();
    vBody.style.setProperty("--dir", (d > 0 ? -30 : 30) + "px");
    vBody.classList.add("swap");
    setTimeout(() => {
      swap();
      vBody.style.setProperty("--dir", (d > 0 ? 30 : -30) + "px");
      vBody.style.transition = "none";
      void vBody.offsetWidth;
      vBody.style.transition = "";
      vBody.classList.remove("swap");
    }, 300);
  }
  $(".viewer-close", viewer).addEventListener("click", requestClose);
  $(".viewer-prev", viewer).addEventListener("click", () => step(-1));
  $(".viewer-next", viewer).addEventListener("click", () => step(1));
  document.addEventListener("keydown", e => {
    if (viewer.hidden) return;
    if (e.key === "Escape") requestClose();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") {
      const f = $$("button:not([hidden]), a[href]:not([hidden]), video, iframe", viewer).filter(n => n.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
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
  (P.bio || []).forEach(t => bio.append(el("p", { text: t })));
  const proc = $("[data-process]");
  (P.process || []).forEach(s => proc.append(el("li", {}, el("strong", { text: s.title }), el("p", { text: s.text }))));
  if (!(P.process || []).length) proc.previousElementSibling.hidden = true;

  const facts = $("[data-facts]");
  const row = (dt, dd, cls) => facts.append(el("div", {}, el("dt", { text: dt }), el("dd", cls ? { class: cls } : {}, dd)));
  if (P.age) row("Age", P.age);
  if (P.location) row("Based in", P.location);
  const liveDd = el("span");
  row("My time now", liveDd, "live");
  (P.facts || []).forEach(f => row(f.label, f.value));

  const tl = $("[data-timeline]");
  (SITE.timeline || []).forEach(t => tl.append(el("li", {}, el("span", { class: "when", text: t.when }), el("span", { class: "what", text: t.text }))));
  if (!(SITE.timeline || []).length) tl.previousElementSibling.hidden = true;

  // live clock in the artist's timezone
  const clock = $("[data-clock]");
  function timeNow() {
    try {
      return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: P.timeZone || "Africa/Cairo" }).format(new Date());
    } catch (e) {
      const d = new Date(Date.now() + (P.utcOffset || 2) * 3600e3);
      return d.getUTCHours() % 12 + ":" + String(d.getUTCMinutes()).padStart(2, "0");
    }
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
    (g.items || []).forEach(it => {
      const [nm, note] = String(it).split("|").map(s => s.trim());
      ul.append(el("li", {}, el("span", { text: nm }), note ? el("span", { class: "skill-note", text: note }) : null));
    });
    sw.append(el("div", { class: "skill-group reveal" + (n === 0 ? " lead" : "") }, el("h3", { text: g.group }), ul));
  });

  /* ---------- contact ---------- */
  const discordBtn = $("[data-copy-discord]");
  if (C.discord) {
    setText("[data-discord]", C.discord);
    const status = $("[data-copy-status]");
    discordBtn.addEventListener("click", async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(C.discord); ok = true; } catch (e) {
        const t = el("textarea", { readonly: "" }); t.value = C.discord; document.body.append(t); t.select();
        try { ok = document.execCommand("copy"); } catch (e2) { ok = false; } t.remove();
      }
      status.textContent = ok ? "Copied" : "Select and copy: " + C.discord;
      setTimeout(() => { status.textContent = "Copy username"; }, 2200);
    });
  } else discordBtn.hidden = true;
  const xA = $("[data-x]");
  if (C.xUrl) { xA.href = C.xUrl; setText("[data-x-handle]", C.xHandle || C.xUrl.replace(/^https?:\/\/(www\.)?/, "")); }
  else xA.hidden = true;
  if (C.email) { const m = $("[data-email]"); m.hidden = false; m.href = "mailto:" + C.email; setText("[data-email-value]", C.email); }

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
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
  // watch each element's parent: a fully clipped element can't be observed reliably
  const revealMap = new Map();
  const revealObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    (revealMap.get(e.target) || []).forEach(n => n.classList.add("in"));
    revealObs.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .section-title, .timeline").forEach((n, i) => {
    if (n.classList.contains("card-frame")) n.style.transitionDelay = (i % 3) * 0.08 + "s";
    const t = n.classList.contains("reveal") ? n.parentElement : n;
    if (!revealMap.has(t)) revealMap.set(t, []);
    revealMap.get(t).push(n);
    revealObs.observe(t);
  });

  /* ---------- cursor ---------- */
  const cur = $(".cursor");
  if (matchMedia("(pointer: fine)").matches && !reduce) {
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; cur.classList.add("on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.remove("on"));
    document.addEventListener("pointerover", e => cur.classList.toggle("big", !!e.target.closest(".card")));
    (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  }

  /* ---------- loader ---------- */
  const start = performance.now();
  function finish() {
    const wait = reduce ? 0 : Math.max(0, 1000 - (performance.now() - start));
    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => { const l = $(".loader"); if (l) l.remove(); }, 900);
      route();
    }, wait);
  }
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1800))]).then(finish);

  /* ---------- hero house: a tiny live 3D model, hatched like ink ---------- */
  const canvas = $("#house");
  if (canvas && canvas.getContext) houseRenderer(canvas);

  function houseRenderer(cv) {
    const ctx = cv.getContext("2d");
    const INK = "#2A1E18";
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = cv.width = Math.max(1, Math.round(r.width * dpr));
      H = cv.height = Math.max(1, Math.round(r.height * dpr));
      if (stopped) draw();
    };

    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const mid = pts => pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
    const newell = pts => {
      let n = [0, 0, 0];
      pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]); });
      return norm(n);
    };
    const layers = [];
    function part(faces, fill, tone, kind) {
      const c = mid(faces.flat());
      layers.push(faces.map((pts, id) => {
        let n = newell(pts);
        if (dot(n, sub(mid(pts), c)) < 0) n = n.map(v => -v);
        return { pts, n, fill, tone, kind, id: layers.length * 10 + id };
      }));
    }
    function decal(pts, n, fill, tone, kind) { layers.push([{ pts, n, fill, tone, kind, id: layers.length * 10 }]); }
    function box(x0, x1, y0, y1, z0, z1) {
      const v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      return [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]].map(f => f.map(i => v[i]));
    }

    // body
    part(box(-1, 1, 0, 1.2, -.8, .8), "#EFE9DD", 0);
    // door + windows (drawn on the walls)
    const e = .806;
    decal([[-.22, 0, e], [.22, 0, e], [.22, .74, e], [-.22, .74, e]], [0, 0, 1], "#6E6A55", .28, "door");
    decal([[.42, .45, e], [.78, .45, e], [.78, .82, e], [.42, .82, e]], [0, 0, 1], "#3B2C24", 0, "window");
    decal([[-.78, .45, e], [-.42, .45, e], [-.42, .82, e], [-.78, .82, e]], [0, 0, 1], "#3B2C24", 0, "window");
    decal([[1.006, .45, -.3], [1.006, .45, .3], [1.006, .85, .3], [1.006, .85, -.3]], [1, 0, 0], "#3B2C24", 0, "window");
    decal([[-1.006, .45, -.3], [-1.006, .45, .3], [-1.006, .85, .3], [-1.006, .85, -.3]], [-1, 0, 0], "#3B2C24", 0, "window");
    decal([[-.5, .45, -e], [0, .45, -e], [0, .82, -e], [-.5, .82, -e]], [0, 0, -1], "#3B2C24", 0, "window");
    // roof
    const A = [-1.15, 1.15, .95], B = [1.15, 1.15, .95], Cc = [1.15, 1.9, 0], D = [-1.15, 1.9, 0], E = [-1.15, 1.15, -.95], F = [1.15, 1.15, -.95];
    part([[A, B, Cc, D], [F, E, D, Cc], [E, A, D], [B, F, Cc], [A, E, F, B]], "#B98F5F", .12);
    // chimney sitting on the ridge
    const x0 = .4, x1 = .72, zb = .18, yb = 1.9 - zb / .95 * .75, yt = 2.28;
    part([
      [[x0, yb, zb], [x1, yb, zb], [x1, yt, zb], [x0, yt, zb]],
      [[x0, yb, -zb], [x1, yb, -zb], [x1, yt, -zb], [x0, yt, -zb]],
      [[x0, yt, -zb], [x1, yt, -zb], [x1, yt, zb], [x0, yt, zb]],
      [[x0, yb, zb], [x0, yt, zb], [x0, yt, -zb], [x0, yb, -zb], [x0, 1.9, 0]],
      [[x1, yb, zb], [x1, yt, zb], [x1, yt, -zb], [x1, yb, -zb], [x1, 1.9, 0]]
    ], "#8A503B", .1);
    const ground = [];
    for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; ground.push([Math.cos(a) * 1.75, 0, Math.sin(a) * 1.45]); }

    let yaw = -.6, pitch = .32, vel = reduce ? 0 : .0045, drag = null, stopped = false, visible = true;
    const L = norm([-.5, .62, .62]);
    const rand = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

    function xf(p) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x = p[0], y = p[1] - 1.05, z = p[2];
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
    }
    function rot(n) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = n[0] * cy - n[2] * sy, z1 = n[0] * sy + n[2] * cy;
      return [x1, n[1] * cp - z1 * sp, n[1] * sp + z1 * cp];
    }
    const Dcam = 9;
    function proj(c) { const s = Dcam / (Dcam - c[2]) * W * .225; return [W / 2 + c[0] * s, H * .53 - c[1] * s]; }

    function path(pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }
    function hatch(sp, level, seed, alpha) {
      const xs = sp.map(p => p[0]), ys = sp.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, R = Math.hypot(maxX - minX, maxY - minY) / 2 + 4;
      const angles = [-Math.PI / 4, Math.PI / 4, Math.PI / 14];
      ctx.save(); path(sp); ctx.clip();
      ctx.strokeStyle = INK; ctx.globalAlpha = alpha; ctx.lineCap = "round";
      for (let k = 0; k < level; k++) {
        const a = angles[k], ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
        const gap = (k === 2 ? 4.2 : 5.4) * dpr;
        ctx.lineWidth = (k === 0 ? 1.15 : 1) * dpr;
        ctx.beginPath();
        // anchor lines to the screen grid so they don't crawl
        const off = (cx * nx + cy * ny);
        const t0 = Math.floor((off - R) / gap) * gap, t1 = off + R;
        for (let t = t0, j = 0; t <= t1; t += gap, j++) {
          const ln = Math.round(t / gap);
          const j1 = (rand(ln * 7 + k * 131) - .5) * 1.6 * dpr, j2 = (rand(ln * 13 + k * 71 + 5) - .5) * 1.6 * dpr;
          const bx = nx * t, by = ny * t;
          const along = ux * cx + uy * cy;
          ctx.moveTo(bx + ux * (along - R) + nx * j1, by + uy * (along - R) + ny * j1);
          ctx.lineTo(bx + ux * (along + R) + nx * j2, by + uy * (along + R) + ny * j2);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      // ground shadow
      const gs = ground.map(p => proj(xf(p)));
      hatch(gs, 1, 1, .45);
      ctx.save(); path(gs); ctx.setLineDash([2 * dpr, 7 * dpr]); ctx.lineWidth = 1.6 * dpr; ctx.strokeStyle = "rgba(42,30,24,.5)"; ctx.stroke(); ctx.restore();

      layers.forEach(faces => faces.forEach(f => {
        const cam = f.pts.map(xf);
        const n = rot(f.n), c = mid(cam);
        if (dot(n, [-c[0], -c[1], Dcam - c[2]]) <= 0) return;
        const sp = cam.map(proj);
        const b = Math.max(0, dot(n, L));
        const dark = 1 - b + f.tone;
        path(sp); ctx.fillStyle = f.fill; ctx.fill();
        if (f.kind === "window") {
          // two light mullions
          const m = (a, b2) => [(a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2];
          ctx.save(); path(sp); ctx.clip();
          ctx.strokeStyle = "#E3D7C2"; ctx.lineWidth = 2 * dpr; ctx.beginPath();
          const p1 = m(sp[0], sp[1]), p2 = m(sp[3], sp[2]), p3 = m(sp[0], sp[3]), p4 = m(sp[1], sp[2]);
          ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.moveTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]); ctx.stroke();
          ctx.restore();
        } else {
          const level = dark < .42 ? 0 : dark < .68 ? 1 : dark < .9 ? 2 : 3;
          if (level) hatch(sp, level, f.id, .82);
        }
        path(sp); ctx.strokeStyle = INK; ctx.lineWidth = (f.kind ? 2 : 2.7) * dpr; ctx.stroke();
      }));
    }

    let last = performance.now(), raf = 0;
    function frame(t) {
      const dt = Math.min(50, t - last); last = t;
      if (!drag) { yaw += vel * dt / 16.7; if (!reduce) vel += (.0045 - vel) * .02; }
      draw();
      raf = (visible && !document.hidden) ? requestAnimationFrame(frame) : 0;
      stopped = !raf;
    }
    const startLoop = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); stopped = false; } };

    cv.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; cv.setPointerCapture(e.pointerId); if (!reduce) startLoop(); });
    cv.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now();
      yaw += dx * .012; pitch = Math.min(.62, Math.max(.08, pitch + dy * .006));
      vel = dx * .012 / Math.max(1, (now - drag.t) / 16.7);
      drag = { x: e.clientX, y: e.clientY, t: now };
      if (reduce) draw();
    });
    const end = () => { drag = null; if (reduce) vel = 0; };
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);

    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduce) startLoop(); }).observe(cv);
    document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !reduce) startLoop(); });
    new ResizeObserver(resize).observe(cv);
    resize();
    if (reduce) { stopped = true; draw(); } else startLoop();
  }
})();
