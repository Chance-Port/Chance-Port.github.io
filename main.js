/* Chance portfolio, comic edition. Content lives in content.js */
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
        tag.style.cssText = "position:fixed;top:.5rem;left:50%;transform:translateX(-50%);z-index:300;background:#B3342B;color:#FFFAF0;padding:.4rem .9rem;font-weight:700;border:2px solid #16120F";
        document.body.appendChild(tag);
      }
    } catch (e) { /* storage unavailable */ }
  }
  const P = SITE.profile || {};
  const C = SITE.contact || {};
  const projects = (SITE.projects || []).filter(p => p && (p.title || p.image || p.link));
  const tools = (SITE.tools || []).filter(t => t && t.name);

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
  const paras = s => String(s || "").split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);

  /* ---------- hand-inked sketches (original drawings) ---------- */
  let sid = 0;
  function sketch(kind) {
    const u = "k" + (++sid);
    const S = 'stroke="#16120F" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"';
    const defs = `<defs><pattern id="${u}h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#16120F" stroke-width="1.4"/></pattern><pattern id="${u}x" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5M0 0H5" stroke="#16120F" stroke-width="1.2"/></pattern></defs>`;
    const face = (d, fill) => `<path d="${d}" fill="#FFFAF0"/><path d="${d}" fill="${fill}" ${S}/>`;
    const cube = (t, top) => `<g transform="${t}">${face("M50 18 80 34 50 50 20 34Z", top || "#FFFAF0")}${face("M20 34 50 50 50 84 20 68Z", `url(#${u}h)`)}${face("M50 50 80 34 80 68 50 84Z", `url(#${u}x)`)}</g>`;
    let body;
    if (kind === "mesh") {
      const dots = [[50, 18], [80, 34], [50, 50], [20, 34], [20, 68], [50, 84], [80, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#B3342B" stroke="#16120F" stroke-width="1.5"/>`).join("");
      body = cube("", "#EFCB6E") + `<path d="M35 26 65 42M65 26 35 42" stroke="#16120F" stroke-width="1.3" stroke-dasharray="3 3"/>` + dots;
    } else if (kind === "brush") {
      body = `<path d="M10 86C26 72 40 94 56 82S80 70 92 80" fill="none" stroke="#B3342B" stroke-width="7" stroke-linecap="round"/>
        <g transform="rotate(40 50 50)">
          <rect x="44" y="50" width="12" height="44" rx="5" fill="#FFFAF0"/><rect x="44" y="50" width="12" height="44" rx="5" fill="url(#${u}h)" ${S}/>
          <path d="M43 36h14v14H43z" fill="#EFCB6E" ${S}/><path d="M43 41h14M43 45h14" stroke="#16120F" stroke-width="1.3"/>
          <path d="M43 36C41 24 46 14 50 6 54 14 59 24 57 36Z" fill="#16120F" ${S}/>
          <path d="M48 10C47 18 47 26 48 34" stroke="#B3342B" stroke-width="2" fill="none"/>
        </g>`;
    } else if (kind === "blocks") {
      body = `<g transform="translate(9 -2) scale(1.25)">${cube("translate(2 44) scale(.5)")}${cube("translate(32 44) scale(.5)")}${cube("translate(17 27) scale(.5)", "#B3342B")}</g>`;
    } else {
      body = `<g transform="rotate(-35 50 50)"><rect x="42" y="18" width="16" height="58" fill="#FFFAF0"/><rect x="42" y="18" width="16" height="58" fill="url(#${u}h)" ${S}/><path d="M42 76h16L50 94Z" fill="#FFFAF0" ${S}/><path d="M47 88h6L50 94Z" fill="#16120F"/><path d="M42 18h16v-6H42z" fill="#B3342B" ${S}/></g>`;
    }
    return `<svg viewBox="0 0 100 100" aria-hidden="true" overflow="visible">${defs}${body}</svg>`;
  }
  const toolKind = n => /blender/i.test(n) ? "mesh" : /substance|paint/i.test(n) ? "brush" : /roblox/i.test(n) ? "blocks" : "pencil";
  const toolArt = t => t.image ? el("img", { src: t.image, alt: t.name + " logo", loading: "lazy" }) : el("div", { html: sketch(toolKind(t.name)) });
  function burst(text, cls) { return el("div", { class: "burst " + (cls || ""), "aria-hidden": "true" }, el("span", { text })); }

  /* ---------- media ---------- */
  const isVideoFile = s => /\.(mp4|webm|mov)(\?|$)/i.test(s || "");
  const ytId = s => { const m = /(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/.exec(s || ""); return m && m[1]; };
  function placeholder(label) {
    return el("div", { class: "ph" }, el("div", { class: "speed", "aria-hidden": "true" }), el("div", { html: sketch("mesh"), style: "display:contents" }),
      el("p", { class: "ph-text" }, el("span", { text: label || "Render coming soon" })));
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

  /* ---------- time in the artist's timezone ---------- */
  function egyptTime() {
    const tz = P.timeZone || "Africa/Cairo";
    try {
      const parts = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: false, timeZone: tz }).formatToParts(new Date());
      const h = +parts.find(x => x.type === "hour").value % 24, m = +parts.find(x => x.type === "minute").value;
      return { h, m, label: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date()) };
    } catch (e) {
      const d = new Date(Date.now() + (P.utcOffset || 2) * 3600e3), h = d.getUTCHours(), m = d.getUTCMinutes();
      return { h, m, label: (h % 12 || 12) + ":" + String(m).padStart(2, "0") + (h < 12 ? " AM" : " PM") };
    }
  }

  /* ---------- cover ---------- */
  const name = P.name || "Chance";
  const mt = $("[data-name]");
  mt.textContent = ""; mt.setAttribute("aria-label", name);
  [...name].forEach((ch, c) => mt.append(el("span", { class: "ch", "aria-hidden": "true", style: `--c:${c}`, text: ch === " " ? "\u00a0" : ch })));
  setText("[data-role]", P.role || "3D artist");
  setText("[data-location]", P.location || "");
  setText("[data-age]", P.age || "");
  if (!P.age) { const n = $("[data-age]"); n.previousSibling && (n.previousSibling.textContent = n.previousSibling.textContent.replace(", age", "")); }
  setText("[data-intro]", P.intro || "");
  if (!P.intro) $("[data-intro]").hidden = true;
  setText("[data-name-plain]", name);
  setText("[data-year]", new Date().getFullYear());
  document.title = name + " | " + (P.role || "3D artist");
  const feat = $("[data-featuring]");
  tools.forEach((t, i) => { if (i) feat.append(" · "); feat.append(el("span", { class: "feat-tool", text: t.name })); });
  if (!tools.length) $(".featuring").hidden = true;
  const coverArt = $("[data-cover-art]");
  coverArt.append(el("div", { class: "big", html: sketch("mesh") }));
  tools.slice(0, 3).forEach(t => coverArt.append(el("div", { class: "orbit" }, toolArt(t))));

  /* ---------- origin (about) ---------- */
  const origin = $("[data-origin]");
  const bio = P.bio || [];
  origin.append(el("div", { class: "panel span-8 intro-panel panel-pad dots-red" },
    el("div", { class: "speed speed-soft", "aria-hidden": "true" }),
    el("p", { class: "cap cap-tl", text: "Somewhere in " + (P.location || "the world") + "\u2026" }),
    bio[0] ? el("div", { class: "letter" }, el("p", { text: bio[0] })) : null));
  const clockSvg = `<svg class="clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#FFFAF0" stroke="#16120F" stroke-width="4"/>${Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return `<line x1="${50 + Math.sin(a) * 36}" y1="${50 - Math.cos(a) * 36}" x2="${50 + Math.sin(a) * (k % 3 ? 40 : 42)}" y2="${50 - Math.cos(a) * (k % 3 ? 40 : 42)}" stroke="#16120F" stroke-width="${k % 3 ? 2 : 4}" stroke-linecap="round"/>`; }).join("")}<line class="hand hand-h" x1="50" y1="50" x2="50" y2="27" stroke="#16120F" stroke-width="6" stroke-linecap="round"/><line class="hand hand-m" x1="50" y1="50" x2="50" y2="15" stroke="#B3342B" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#16120F"/></svg>`;
  origin.append(el("div", { class: "panel span-4 clock-panel dots-yellow" },
    el("p", { class: "cap cap-tl", text: "Right now" }),
    el("div", { html: clockSvg, style: "display:contents" }),
    el("p", { class: "letter", "data-clock-text": "" })));
  const tl = SITE.timeline || [];
  tl.forEach((t, i) => {
    const last = i === tl.length - 1 && tl.length > 1;
    const art = last ? burst(String(t.when).toUpperCase() + "!") : el("div", { html: sketch(i % 2 ? "mesh" : "blocks"), style: "display:contents" });
    origin.append(el("div", { class: "panel span-4 year-panel " + ["dots-olive", "dots-red", "dots-yellow"][i % 3] },
      el("p", { class: "cap cap-tl", text: t.when }), el("div", { class: "art" }, art), el("p", { class: "letter", text: t.text })));
  });
  if (bio.length > 1) {
    const story = el("div", { class: "panel span-7 story-panel dots-olive" }, el("div", { class: "speed speed-soft", "aria-hidden": "true" }), el("p", { class: "cap cap-tl", text: "Meanwhile\u2026" }));
    const mid = bio.slice(1, bio.length > 2 ? -1 : undefined);
    mid.forEach(t => story.append(el("div", { class: "letter" }, el("p", { text: t }))));
    if (bio.length > 2) story.append(el("div", { class: "bubble bubble-right" }, bio[bio.length - 1]));
    origin.append(story);
  }
  const statsDl = el("dl", { class: "stats" });
  const stat = (a, b) => statsDl.append(el("div", {}, el("dt", { text: a }), el("dd", { text: b })));
  if (P.age) stat("Age", P.age);
  if (P.location) stat("Based in", P.location);
  (P.facts || []).forEach(f => stat(f.label, f.value));
  origin.append(el("div", { class: "panel span-5 card-panel fill-red" }, el("p", { class: "card-name", text: name }), statsDl, burst("Open for work!")));
  (P.process || []).forEach((s, i) => origin.append(el("div", { class: "panel span-4 step-panel " + ["dots-yellow", "dots-red", "dots-olive"][i % 3] },
    el("span", { class: "step-num", "aria-hidden": "true", text: i + 1 }),
    el("strong", { class: "sfx", text: (s.title || "").toUpperCase() + "!" }),
    el("p", { class: "letter", text: s.text }))));

  /* ---------- gallery ---------- */
  const gallery = $("[data-gallery]");
  const ordered = projects.map((p, i) => ({ p, i })).sort((a, b) => (b.p.featured ? 1 : 0) - (a.p.featured ? 1 : 0));
  const spans = [];
  for (let k = 0, row = 0; k < ordered.length;) {
    if (ordered[k].p.featured) {
      const flip = row++ % 2;
      spans[k] = flip ? 5 : 7; if (k + 1 < ordered.length) spans[k + 1] = flip ? 7 : 5; k += 2;
    } else { for (let c = 0; c < 3 && k < ordered.length && !ordered[k].p.featured; c++) spans[k++] = 4; row++; }
  }
  if (!projects.length) gallery.append(el("div", { class: "panel span-12 panel-pad dots-yellow empty-note" }, el("p", { class: "letter", text: "New work is on the way!" })));
  ordered.forEach(({ p, i }, k) => {
    const panel = el("a", {
      class: `panel work-panel span-${spans[k]} ${spans[k] >= 7 ? "big " : ""}${["dots-red", "dots-olive", "dots-yellow"][k % 3]}`,
      href: "#project-" + (i + 1), "data-index": i, "data-cat": p.category || "", "aria-label": (p.title || "Untitled") + ", open project"
    },
      el("div", { class: "media" }, cover(p)),
      el("p", { class: "cap cap-tl", text: p.title || "Untitled" }),
      p.category ? el("span", { class: "tag", text: p.category }) : null,
      burst("Zoom!", "zoom"));
    gallery.append(panel);
  });
  const cats = [...new Set(projects.map(p => p.category).filter(Boolean))];
  const filterBar = $(".filters");
  if (cats.length > 1) {
    filterBar.hidden = false;
    ["All", ...cats].forEach((c, n) => {
      const b = el("button", { type: "button", "aria-pressed": n === 0 ? "true" : "false", text: c });
      b.addEventListener("click", () => {
        $$("button", filterBar).forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        $$(".work-panel", gallery).forEach(w => {
          const show = c === "All" || w.dataset.cat === c;
          w.classList.toggle("hide", !show);
          if (show && !reduce) w.animate([{ opacity: 0, transform: "scale(.85) rotate(-2deg)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" });
        });
      });
      filterBar.append(b);
    });
  }

  /* ---------- powers (skills) ---------- */
  const powers = $("[data-powers]");
  tools.forEach((t, i) => powers.append(el("div", { class: "panel span-4 tool-panel " + ["dots-red", "dots-olive", "dots-yellow"][i % 3] },
    el("div", { class: "speed", "aria-hidden": "true" }), el("div", { class: "art" }, toolArt(t)), el("strong", { class: "sfx", text: t.name.toUpperCase() + "!" }))));
  const groups = (SITE.skills || []).filter((g, n) => !(n === 0 && tools.length && /software/i.test(g.group || "")));
  groups.forEach((g, i) => {
    const ul = el("ul");
    (g.items || []).forEach(it => {
      const [nm, note] = String(it).split("|").map(s => s.trim());
      ul.append(el("li", {}, nm, note ? el("span", { class: "aside", text: "(" + note + "!)" }) : null));
    });
    const span = groups.length === 1 ? 12 : groups.length === 2 ? 6 : 4;
    powers.append(el("div", { class: `panel span-${span} group-panel ` + ["dots-yellow", "dots-olive", "dots-red"][i % 3] }, el("p", { class: "cap cap-tl", text: g.group }), ul));
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
      if (ok) popBurst("Copied!", e.clientX, e.clientY);
      setTimeout(() => { status.textContent = "Tap to copy"; }, 2200);
    });
  } else discordBtn.hidden = true;
  const xA = $("[data-x]");
  if (C.xUrl) { xA.href = C.xUrl; setText("[data-x-handle]", C.xHandle || C.xUrl.replace(/^https?:\/\/(www\.)?/, "")); }
  else xA.hidden = true;
  if (C.email) { const m = $("[data-email]"); m.hidden = false; m.href = "mailto:" + C.email; setText("[data-email-value]", C.email); }
  function popBurst(text, x, y) {
    if (reduce) return;
    const r = discordBtn.getBoundingClientRect();
    const b = burst(text, "pop-burst");
    b.style.left = ((x || r.right) - 64) + "px"; b.style.top = ((y || r.top) - 90) + "px";
    document.body.append(b);
    b.animate([{ transform: "scale(0) rotate(-40deg)" }, { transform: "scale(1.15) rotate(6deg)", offset: .35 }, { transform: "scale(1) rotate(0)", offset: .7 }, { transform: "scale(.6) rotate(0)", opacity: 0 }], { duration: 1100, easing: "ease-out" }).finished.then(() => b.remove());
  }

  /* clock + live time */
  function tick() {
    const t = egyptTime();
    $$(".hand-h").forEach(hd => { hd.style.transform = `rotate(${(t.h % 12) * 30 + t.m * .5}deg)`; });
    $$(".hand-m").forEach(hd => { hd.style.transform = `rotate(${t.m * 6}deg)`; });
    $$("[data-clock-text]").forEach(n => { n.textContent = "It's " + t.label + " in " + (P.location || "my timezone") + (P.timezoneLabel ? " (" + P.timezoneLabel + ")" : ""); });
    setText("[data-clock]", "It's " + t.label + " for me right now");
  }
  tick(); setInterval(tick, 20000);

  /* stagger order for page-enter animations */
  $$(".page").forEach(pg => {
    $$(".panel", pg).forEach((n, i) => n.style.setProperty("--i", i));
    $$(".cap, .bubble", pg).forEach((n, i) => { if (!n.style.getPropertyValue("--i")) n.style.setProperty("--i", i); });
  });

  /* ---------- the book: turning pages ---------- */
  const pages = $$(".page");
  const ids = pages.map(p => p.id);
  const book = $("#book");
  const dots = $("[data-dots]");
  const prevBtn = $("[data-prev]"), nextBtn = $("[data-next]");
  let cur = -1, busy = false;
  pages.forEach((p, i) => {
    dots.append(el("button", { type: "button", "aria-label": "Go to " + (p.getAttribute("aria-label") || $(".page-title", p)?.textContent || "page " + i), text: i === 0 ? "C" : i, "data-go": i }));
    if (i < pages.length - 1) {
      const curl = el("button", { type: "button", class: "curl", "aria-label": "Turn to next page" });
      curl.addEventListener("click", () => turnTo(i + 1));
      $(".sheet", p).append(curl);
    }
  });
  dots.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) turnTo(+b.dataset.go); });
  prevBtn.addEventListener("click", () => turnTo(cur - 1));
  nextBtn.addEventListener("click", () => turnTo(cur + 1));
  function turnTo(j) { if (j >= 0 && j < pages.length) location.hash = "#" + ids[j]; }

  let settleT;
  function enter(pg) {
    pg.classList.remove("enter", "settled");
    void pg.offsetWidth;
    pg.classList.add("enter");
    clearTimeout(settleT);
    settleT = setTimeout(() => pg.classList.add("settled"), reduce ? 50 : 2300);
  }
  function go(j, instant) {
    if (j < 0 || j >= pages.length || j === cur) return;
    if (busy) { pages.forEach(p => { p.getAnimations().forEach(a => a.finish()); }); }
    const from = pages[cur], to = pages[j];
    const hadFocus = from && from.contains(document.activeElement);
    pages.forEach((p, i) => { const on = i === j; p.inert = !on; p.setAttribute("aria-hidden", on ? "false" : "true"); });
    $$("[data-go]", dots).forEach((b, i) => b.setAttribute("aria-current", i === j ? "true" : "false"));
    $$(".toc a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + ids[j]));
    prevBtn.disabled = j === 0; nextBtn.disabled = j === pages.length - 1;
    to.scrollTop = 0;
    const forward = j > cur;
    const prev = cur;
    cur = j;
    if (instant || reduce || prev < 0) {
      pages.forEach(p => p.classList.remove("current", "turning"));
      to.classList.add("current"); enter(to);
      if (!instant && reduce) to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
    } else {
      busy = true;
      const opts = { duration: 850, easing: "cubic-bezier(.55,.05,.35,1)" };
      let anim;
      if (forward) {
        to.classList.add("current"); enter(to);
        from.classList.add("turning");
        anim = from.animate([{ transform: "rotateY(0deg)", filter: "brightness(1)" }, { transform: "rotateY(-60deg)", filter: "brightness(.85)", offset: .5 }, { transform: "rotateY(-118deg)", filter: "brightness(.55)" }], opts);
        anim.finished.then(() => { from.classList.remove("turning", "current"); busy = false; }, () => { busy = false; });
      } else {
        to.classList.add("turning"); enter(to);
        anim = to.animate([{ transform: "rotateY(-118deg)", filter: "brightness(.55)" }, { transform: "rotateY(-60deg)", filter: "brightness(.85)", offset: .5 }, { transform: "rotateY(0deg)", filter: "brightness(1)" }], opts);
        anim.finished.then(() => { to.classList.remove("turning"); to.classList.add("current"); from.classList.remove("current"); busy = false; }, () => { busy = false; });
      }
    }
    if (hadFocus) to.focus({ preventScroll: true });
  }
  pages.forEach(p => p.setAttribute("tabindex", "-1"));

  // swipe to turn
  let sx = 0, sy = 0, st = 0;
  book.addEventListener("touchstart", e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  book.addEventListener("touchend", e => {
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - st < 700) turnTo(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- splash: zoom into a project ---------- */
  const splash = $("#splash"), sBody = $(".splash-body", splash);
  let sIdx = -1, lastPanel = null;
  function fillSplash(i) {
    const p = projects[i];
    const media = $("[data-s-media]", splash);
    media.textContent = "";
    const add = (node, empty) => media.append(el("div", { class: "panel" + (empty ? " empty dots-yellow" : "") }, node));
    const yt = ytId(p.video);
    if (yt) add(el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + yt, title: (p.title || "Project") + " video", allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: "", loading: "lazy" }));
    else if (isVideoFile(p.video)) add(el("video", { src: p.video, controls: "", playsinline: "", preload: "metadata" }));
    [p.image, ...(p.gallery || [])].filter(Boolean).forEach((src, n) => add(image(src, (p.title || "Project") + " image " + (n + 1), n === 0)));
    if (!media.children.length) add(placeholder(), true);
    const cat = $("[data-s-cat]", splash); cat.textContent = p.category || "Project"; 
    $("[data-s-title]", splash).textContent = p.title || "Untitled";
    const d = $("[data-s-desc]", splash); d.textContent = "";
    const ps = paras(p.description);
    (ps.length ? ps : [p.link ? "Full write-up coming soon! The post on X has the details for now." : "Full write-up coming soon!"]).forEach(t => d.append(el("p", { text: t })));
    const link = $("[data-s-link]", splash);
    link.hidden = !p.link;
    if (p.link) { link.href = p.link; link.textContent = /x\.com|twitter\.com/i.test(p.link) ? "View the post on X" : "View project"; }
    $("[data-s-count]", splash).textContent = "Panel " + (i + 1) + " of " + projects.length;
    const multi = projects.length > 1;
    $("[data-s-prev]", splash).hidden = !multi; $("[data-s-next]", splash).hidden = !multi;
    if (!reduce) [...media.children, d, link].forEach((n, k) => n.animate([{ opacity: 0, transform: "scale(.85) rotate(-2deg)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 200 + k * 90, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
  }
  function setClip(v) { ["--ct", "--cr", "--cb", "--cl"].forEach((k, n) => splash.style.setProperty(k, v ? v[n] : "0px")); }
  function panelInset(i) {
    const n = $('.work-panel[data-index="' + i + '"]');
    if (!n || pages[cur] !== $("#gallery")) return null;
    const r = n.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) return null;
    return [r.top, innerWidth - r.right, innerHeight - r.bottom, r.left].map(v => Math.max(0, v) + "px");
  }
  function openSplash(i) {
    if (!projects[i]) return;
    sIdx = i; fillSplash(i);
    if (!splash.hidden) return;
    lastPanel = $('.work-panel[data-index="' + i + '"]');
    splash.style.transition = "none";
    setClip(reduce ? null : panelInset(i));
    splash.hidden = false; splash.scrollTop = 0;
    void splash.offsetWidth;
    splash.style.transition = "";
    setClip(null);
    $(".splash-close", splash).focus({ preventScroll: true });
  }
  function closeSplash() {
    if (splash.hidden) return;
    const to = reduce ? null : panelInset(sIdx);
    const done = () => {
      if (splash.hidden) return;
      splash.hidden = true;
      $$("video", splash).forEach(v => v.pause());
      $("[data-s-media]", splash).textContent = "";
      if (lastPanel) lastPanel.focus({ preventScroll: true });
    };
    if (to) { setClip(to); setTimeout(done, 660); } else done();
  }
  function sStep(d) {
    if (projects.length < 2) return;
    const next = (sIdx + d + projects.length) % projects.length;
    const swap = () => { history.replaceState(null, "", "#project-" + (next + 1)); sIdx = next; lastPanel = $('.work-panel[data-index="' + next + '"]'); fillSplash(next); splash.scrollTop = 0; };
    if (reduce) return swap();
    sBody.style.setProperty("--dir", (d > 0 ? -50 : 50) + "px"); sBody.style.setProperty("--rot", (d > 0 ? -2 : 2) + "deg");
    sBody.classList.add("swap");
    setTimeout(() => {
      swap();
      sBody.style.setProperty("--dir", (d > 0 ? 50 : -50) + "px"); sBody.style.setProperty("--rot", (d > 0 ? 2 : -2) + "deg");
      sBody.style.transition = "none"; void sBody.offsetWidth; sBody.style.transition = "";
      sBody.classList.remove("swap");
    }, 300);
  }
  $(".splash-close", splash).addEventListener("click", () => { location.hash = "#gallery"; });
  $("[data-s-prev]", splash).addEventListener("click", () => sStep(-1));
  $("[data-s-next]", splash).addEventListener("click", () => sStep(1));

  /* ---------- routing + keys ---------- */
  function route(first) {
    const h = location.hash.slice(1);
    const m = /^project-(\d+)$/.exec(h);
    if (m && projects[m[1] - 1]) {
      go(ids.indexOf("gallery"), true);
      openSplash(m[1] - 1);
      return;
    }
    closeSplash();
    const idx = Math.max(0, ids.indexOf(h));
    go(idx, first === true);
  }
  addEventListener("hashchange", () => route(false));
  document.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea, select")) return;
    if (!splash.hidden) {
      if (e.key === "Escape") location.hash = "#gallery";
      else if (e.key === "ArrowRight") sStep(1);
      else if (e.key === "ArrowLeft") sStep(-1);
      else if (e.key === "Tab") {
        const f = $$("button:not([hidden]), a[href]:not([hidden]), video, iframe", splash).filter(n => n.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      return;
    }
    if (e.key === "ArrowRight") turnTo(cur + 1);
    else if (e.key === "ArrowLeft") turnTo(cur - 1);
  });
  route(true);
})();
