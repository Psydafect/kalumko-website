(() => {
  const S = window.SITE;
  const M = window.MANIFEST || { projects: {}, motion: {} };
  const shell = document.getElementById("shell");
  const scroller = document.getElementById("scroller");
  const view = document.getElementById("view");
  const bar = document.getElementById("bar");
  const info = document.getElementById("info");
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const ratio = (o) => (o.w / o.h).toFixed(4);
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ── Data ────────────────────────────────────────────────
  const projects = S.projects.map((p) => {
    const images = M.projects[p.slug] || [];
    const loop = p.loop && M.motion[p.loop];
    const cover = images[(p.cover || 1) - 1];
    const hero = p.kind === "motion" && loop
      ? { src: loop.poster, loop: loop.src, w: loop.w, h: loop.h }
      : cover ? { src: cover.src, thumb: cover.thumb, w: cover.w, h: cover.h } : null;
    return { ...p, images, hero, kindLabel: p.kind === "stills" ? "Stills" : "Motion" };
  });
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const lists = {
    // landing: his home-page order first, then everything else
    landing: [...S.selected.map((s) => bySlug[s]), ...projects.filter((p) => !S.selected.includes(p.slug))].filter((p) => p.hero),
    stills: projects.filter((p) => p.kind === "stills"),
    motion: projects.filter((p) => p.kind === "motion"),
    personal: projects.filter((p) => p.group === "Personal"),
  };

  // ── Clocks ──────────────────────────────────────────────
  function tickClocks() {
    const html = S.clocks.map((c) => {
      const [h, m] = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: c.tz })
        .format(new Date()).split(":");
      return `<span class="clock">${esc(c.label)}<b>${h}<span class="colon">:</span>${m}</b></span>`;
    }).join("");
    document.querySelectorAll(".clocks").forEach((el) => (el.innerHTML = html));
  }
  setInterval(tickClocks, 15000);

  // name on top, clocks underneath
  const idBlock = `<div class="bar-id"><a class="mark-name" href="#/">kalum ko</a>
    <div class="clocks mono" aria-label="Local times"></div></div>`;

  // ── Bottom bar: the same menu everywhere ────────────────
  bar.innerHTML = `${idBlock}
    ${["stills", "motion", "personal"].map((k) => `
      <a class="bar-link" href="#/${k}" data-nav="${k}">
        <span class="mono">${cap(k)}</span><span class="mono n">${pad(lists[k].length)}</span></a>`).join("")}
    <a class="bar-link bar-end" href="#/info" data-nav="info"><span class="mono">Info</span><span class="mono n">&nbsp;</span></a>`;
  function setNav(id) {
    bar.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  let teardown = () => {};
  const listen = (ac) => (t, ev, fn, o) => t.addEventListener(ev, fn, { ...o, signal: ac.signal });
  // Soft rise: each tile fades in and drifts up as it first scrolls into view,
  // staggered left to right across the items that arrive together (one row at a time).
  function rise(root, selector) {
    const els = [...root.querySelectorAll(selector)];
    els.forEach((el) => el.classList.add("rise"));
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, n) => {
          e.target.style.setProperty("--d", `${Math.min(n, 6) * 70}ms`);
          e.target.classList.add("up");
          io.unobserve(e.target);
        });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }

  function fadeIn(root) {
    root.querySelectorAll("img[data-fade]").forEach((img) => {
      const done = () => img.classList.add("in");
      if (img.complete && img.naturalWidth) done(); else img.addEventListener("load", done, { once: true });
    });
  }

  // ── Landing: previews stay centred, scrolling cross-fades ─
  function renderLanding() {
    const items = lists.landing;
    setNav(null);
    document.title = "Kalum Ko — photographer + director";
    if (!finePointer) scroller.classList.add("snap");   // phones: native swipe + snap

    view.innerHTML = `
      <div class="land-track"><div class="l-stage">${items.map((p, i) => `
        <div class="l-item" data-i="${i}">
          <a class="l-media" href="#/p/${p.slug}" style="--ar:${ratio(p.hero)}" aria-label="View ${esc(p.title)}" tabindex="-1">
            <img src="${i < 2 ? p.hero.src : ""}" data-src="${p.hero.src}" ${p.hero.loop ? `data-loop="${p.hero.loop}"` : ""} alt="" decoding="async">
            <span class="view mono">View</span>
          </a>
          <a class="l-cap" href="#/p/${p.slug}" tabindex="-1"><b>${esc(p.title)}</b><span class="mono">${p.kindLabel}</span></a>
        </div>`).join("")}</div>
        ${items.map(() => `<section aria-hidden="true"></section>`).join("")}
        <section aria-hidden="true" data-loop-end></section></div>
      <nav class="ticks" aria-label="Projects">${items.map((p, i) =>
        `<a href="#/p/${p.slug}" data-n="${i}"><span class="mono">${esc(p.title)}</span><i></i></a>`).join("")}</nav>
      <div class="nums mono">${items.map((p, i) =>
        `<button type="button" data-n="${i}" aria-label="${esc(p.title)}">${pad(i + 1)}</button>`).join("")}</div>`;

    const ac = new AbortController(), on = listen(ac);
    const els = [...view.querySelectorAll(".l-item")];
    const ticks = [...view.querySelectorAll(".ticks a")];
    const nums = [...view.querySelectorAll(".nums button")];
    let cur = -1, raf = 0;

    const imgOf = (k) => els[k] && els[k].querySelector("img");
    function load(k) { const img = imgOf(k); if (img && !img.getAttribute("src")) img.src = img.dataset.src; }

    function activate(k) {
      if (k === cur) return;
      const prev = cur;
      cur = k;
      els.forEach((el, n) => {
        const on = n === k;
        el.classList.toggle("on", on);
        el.querySelectorAll("a").forEach((a) => (a.tabIndex = on ? 0 : -1));
      });
      [k - 1, k, k + 1].forEach(load);
      const img = imgOf(k);
      if (img.dataset.loop) img.src = img.dataset.loop;               // moving preview
      if (prev >= 0) {
        const old = imgOf(prev);
        if (old.dataset.loop) setTimeout(() => { if (cur !== prev) old.src = old.dataset.src; }, 800);
      }
      nums.forEach((n, i) => n.setAttribute("aria-current", i === k));
      ticks.forEach((t, i) => t.classList.toggle("on", i === k));
    }

    const N = items.length;
    let settle = 0;
    function update() {
      raf = 0;
      view.style.setProperty("--sh", `${scroller.clientHeight}px`);
      const pos = scroller.scrollTop / scroller.clientHeight;
      ticks.forEach((t, i) => {
        const d = Math.min(Math.abs(pos - i), i === 0 ? Math.abs(pos - N) : Infinity);
        const near = Math.max(0, 1 - d);
        t.style.setProperty("--w", `${(6 + 26 * near * near).toFixed(1)}px`);
      });
      activate(Math.round(pos) % N);                  // the extra end section shows project 1
    }
    // jump straight to a project (the cross-fade is the transition), wrapping at both ends
    const go = (k) => scroller.scrollTo({ top: ((k + N) % N) * scroller.clientHeight, behavior: "instant" });
    on(scroller, "scroll", () => {
      if (!raf) raf = requestAnimationFrame(update);
      clearTimeout(settle);                           // landed on the extra end section: quietly reset to the top
      settle = setTimeout(() => { if (Math.round(scroller.scrollTop / scroller.clientHeight) >= N) scroller.scrollTo({ top: 0, behavior: "instant" }); }, 160);
    }, { passive: true });
    on(window, "resize", update);
    // desktop: one wheel/trackpad gesture = one project
    if (finePointer) {
      let lastEvt = 0, lastStep = 0, stepped = false;
      on(scroller, "wheel", (e) => {
        if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
        e.preventDefault();
        const now = Date.now();
        if (now - lastEvt > 220) stepped = false;          // a new gesture
        lastEvt = now;
        if (stepped || now - lastStep < 650 || Math.abs(e.deltaY) < 4) return;
        stepped = true; lastStep = now;
        go(cur + Math.sign(e.deltaY));
      }, { passive: false });
    }
    nums.forEach((n) => on(n, "click", () => go(+n.dataset.n)));
    ticks.forEach((t) => on(t, "click", (e) => { e.preventDefault(); go(+t.dataset.n); }));
    on(window, "keydown", (e) => {
      if (shell.classList.contains("info-open")) return;
      if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); go(cur + 1); }
      else if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
      else if (e.key === "Enter") location.hash = `#/p/${items[cur].slug}`;
    });

    teardown = () => { ac.abort(); cancelAnimationFrame(raf); clearTimeout(settle); scroller.classList.remove("snap"); };
    return update;
  }

  // ── Section index: true proportions, motion moving ──────
  function renderIndex(id) {
    const items = lists[id];
    setNav(id);
    document.title = `${cap(id)} — Kalum Ko`;
    view.innerHTML = `<section class="index fade-in">${items.map((p) => {
      const src = p.hero ? (p.hero.loop || p.hero.thumb) : "";
      return `<a class="card" href="#/p/${p.slug}" style="--ar:${p.hero ? ratio(p.hero) : 1.25}">
        <div class="card-img">${src ? `<img data-fade src="${src}" alt="" loading="lazy" decoding="async">` : ""}</div>
        <div class="card-cap mono"><span>${esc(p.title)}</span>
          <span class="n">${p.kindLabel}${p.kind === "stills" ? ` · ${pad(p.images.length)}` : ""}</span></div>
      </a>`;
    }).join("")}</section>`;
    fadeIn(view);
    teardown = rise(view, ".card");
  }

  // ── Project pages ───────────────────────────────────────
  const linkOr = ([label, url]) => url ? `<a href="${url}" target="_blank" rel="noopener">${esc(label)} ↗</a>` : esc(label);
  // Project info column, pinned on the right above Personal / Info in the menu:
  // title, subtitle, kind — group, about, credits (one per line), recognition,
  // and previous / next pinned to the bottom of the column.
  // Tablet + phone: .p-top (title, about) above the work, .p-more (credits) below it.
  function side(p, back) {
    const order = lists.landing, k = order.indexOf(p), N = order.length;
    const prev = order[(k - 1 + N) % N], next = order[(k + 1) % N];
    const credits = p.credits && `<ul class="p-lines mono">${p.credits.map(([r, n]) =>
      `<li><span class="r">${esc(r)}</span> — ${esc(n)}</li>`).join("")}</ul>`;
    const rec = p.recognition && `<ul class="p-lines mono">${p.recognition.map((r) => `<li>${linkOr(r)}</li>`).join("")}</ul>`;
    return `<aside class="p-side"><div class="p-top">
      <nav class="p-nav p-nav-top" aria-label="Projects">
        <a href="#/p/${prev.slug}"><span class="lbl mono">Previous</span><span class="mono t">← ${esc(prev.title)}</span></a>
        <a href="#/p/${next.slug}"><span class="lbl mono">Next</span><span class="mono t">${esc(next.title)} →</span></a>
      </nav>
      <h1 class="p-title">${esc(p.title)}</h1>
      ${p.subtitle ? `<p class="p-sub">${esc(p.subtitle)}</p>` : ""}
      <span class="p-kind mono">${p.kindLabel} — ${esc(p.group)}</span>
      ${p.text ? `<div class="p-text">${p.text.map((t) => `<p>${esc(t)}</p>`).join("")}
        ${p.note ? `<p class="note">${esc(p.note)}</p>` : ""}</div>` : ""}
      </div><div class="p-more">
      ${credits ? `<div class="p-block"><span class="lbl mono">Credits</span>${credits}</div>` : ""}
      ${rec ? `<div class="p-block"><span class="lbl mono">Recognition</span>${rec}</div>` : ""}
      <a class="back mono" href="${back}">← Index</a>
      </div>
      <nav class="p-nav-foot mono" aria-label="Projects">
        <a href="#/p/${prev.slug}">← ${esc(prev.title)}</a><a href="#/p/${next.slug}">${esc(next.title)} →</a>
      </nav>
    </aside>`;
  }

  function renderStills(p, back) {
    view.innerHTML = `<article class="proj fade-in">
      ${side(p, back)}
      <div class="p-main p-grid">${p.images.map((im, i) => `
        <button type="button" data-i="${i}" style="--ar:${ratio(im)}" aria-label="Open image ${i + 1}">
          <div class="card-img"><img data-fade src="${im.thumb}" alt="${esc(p.title)} ${i + 1}" loading="lazy" decoding="async"></div>
          <div class="card-cap mono">${pad(i + 1)}</div>
        </button>`).join("")}</div>
    </article>`;
    fadeIn(view);
    const ac = new AbortController(), on = listen(ac);
    view.querySelectorAll("[data-i]").forEach((b) => on(b, "click", () => openLB(p, +b.dataset.i)));
    const stopRise = rise(view, ".p-grid button");
    teardown = () => { ac.abort(); stopRise(); };
  }

  // custom player: thin progress line, title on the left, time / pause / mute / fullscreen on the right
  function renderMotion(p, back) {
    view.innerHTML = `<article class="proj proj-film fade-in">
      ${side(p, back)}
      <div class="p-main film-wrap"><div class="film" style="--far:${p.ratio || "16 / 9"}">
        <div class="f-frame">
          <button class="f-poster" type="button" aria-label="Play ${esc(p.title)}">
            ${p.hero ? `<img src="${p.hero.loop || p.hero.src}" alt="">` : ""}<span class="mono">Play film</span></button>
        </div>
        <div class="f-line" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><i></i></div>
        <div class="f-row mono">
          <span><b>${esc(p.title)}</b>${p.subtitle ? ` <span class="sub">— ${esc(p.subtitle)}</span>` : ""}</span>
          <span class="f-ctl">
            <span class="time">0:00 / 0:00</span>
            <button type="button" data-act="play">Play</button>
            <button type="button" data-act="mute">Mute</button>
            <button type="button" data-act="fs">Fullscreen</button>
          </span>
        </div>
      </div></div>
    </article>`;

    const ac = new AbortController(), on = listen(ac);
    const film = view.querySelector(".film"), frame = film.querySelector(".f-frame");
    // tallest the film can be and still show whole (with its control row) above the menu
    const fit = () => {
      const barH = bar.getBoundingClientRect().height;
      const above = innerWidth > 1000 ? 0 : view.querySelector(".p-top").getBoundingClientRect().height;
      film.style.setProperty("--fit", `${Math.max(220, scroller.clientHeight - above - barH - 90)}px`);
    };
    fit();
    on(window, "resize", fit);
    const line = film.querySelector(".f-line"), time = film.querySelector(".time");
    const btn = (a) => film.querySelector(`[data-act="${a}"]`);
    const fmt = (s) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
    let player = null, duration = 0, playing = false, muted = false;

    function mount() {
      if (player) return Promise.resolve(player);
      // controls=0 hides Vimeo's own UI (needs a Vimeo Plus/Pro account on the video owner's side)
      frame.innerHTML = `<iframe src="https://player.vimeo.com/video/${p.vimeo}?controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1"
        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(p.title)}"></iframe>`;
      if (!window.Vimeo) return Promise.resolve(null);
      player = new Vimeo.Player(frame.querySelector("iframe"));
      player.on("play", () => { playing = true; btn("play").textContent = "Pause"; });
      player.on("pause", () => { playing = false; btn("play").textContent = "Play"; });
      player.on("ended", () => { playing = false; btn("play").textContent = "Play"; });
      player.on("timeupdate", (d) => {
        duration = d.duration;
        line.style.setProperty("--p", `${(d.percent * 100).toFixed(2)}%`);
        line.setAttribute("aria-valuenow", Math.round(d.percent * 100));
        time.textContent = `${fmt(d.seconds)} / ${fmt(d.duration)}`;
      });
      player.getDuration().then((d) => { duration = d; time.textContent = `0:00 / ${fmt(d)}`; }).catch(() => {});
      Promise.all([player.getVideoWidth(), player.getVideoHeight()])
        .then(([w, h]) => { if (w && h) film.style.setProperty("--far", `${w} / ${h}`); }).catch(() => {});
      return Promise.resolve(player);
    }
    const toggle = () => mount().then((pl) => pl && (playing ? pl.pause() : pl.play()));

    on(film.querySelector(".f-poster"), "click", () => mount().then((pl) => pl && pl.play()));
    on(btn("play"), "click", toggle);
    on(btn("mute"), "click", () => mount().then((pl) => {
      if (!pl) return;
      muted = !muted; pl.setMuted(muted); btn("mute").textContent = muted ? "Unmute" : "Mute";
    }));
    on(btn("fs"), "click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (film.requestFullscreen) film.requestFullscreen().then(() => mount());
      else mount().then((pl) => pl && pl.requestFullscreen());   // iPhone: Vimeo's own fullscreen
    });
    on(document, "fullscreenchange", () => { btn("fs").textContent = document.fullscreenElement ? "Exit" : "Fullscreen"; });
    const seek = (x) => mount().then((pl) => {
      const r = line.getBoundingClientRect();
      if (pl && duration) pl.setCurrentTime(Math.max(0, Math.min(1, (x - r.left) / r.width)) * duration);
    });
    on(line, "click", (e) => seek(e.clientX));
    on(line, "keydown", (e) => {
      if (!player || !duration) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        player.getCurrentTime().then((t) => player.setCurrentTime(Math.max(0, t + (e.key === "ArrowRight" ? 5 : -5))));
      }
    });
    teardown = () => { ac.abort(); if (player) player.destroy().catch(() => {}); };
  }

  // ── Lightbox for stills ─────────────────────────────────
  const lb = document.getElementById("lb");
  const lbStage = lb.querySelector(".lb-stage");
  let lbP = null, lbI = 0, lbToken = 0;
  function showLB(n) {
    const imgs = lbP.images;
    lbI = (n + imgs.length) % imgs.length;
    const im = imgs[lbI], my = ++lbToken;
    lb.querySelector(".lb-count").textContent = `${pad(lbI + 1)} / ${pad(imgs.length)}`;
    const cur = lbStage.querySelector(".lb-img");
    if (cur) cur.classList.add("out");
    // each photo gets a fresh <img>, fully loaded off-stage, then swapped in alone
    // (iOS Safari keeps painting the old picture if you just change src on one element)
    const next = new Image();
    next.className = "lb-img out"; next.alt = `${lbP.title} ${lbI + 1}`; next.draggable = false;
    const loaded = new Promise((r) => { next.onload = next.onerror = r; next.src = im.src; if (next.complete) r(); })
      .then(() => next.decode && next.decode().catch(() => {}));
    Promise.all([loaded, new Promise((r) => setTimeout(r, cur ? 250 : 0))]).then(() => {
      if (my !== lbToken) return;
      lbStage.replaceChildren(next);   // only ever one photo on stage
      void next.offsetWidth;           // commit opacity 0 so the fade-in runs
      next.classList.remove("out");
    });
    [1, -1].forEach((d) => { new Image().src = imgs[(lbI + d + imgs.length) % imgs.length].src; });
  }
  function openLB(p, i) {
    lbP = p;
    lb.querySelector(".lb-title").textContent = p.title;
    lbStage.replaceChildren();
    lb.hidden = false;
    showLB(i);
    lb.focus();
  }
  function closeLB() {
    lb.hidden = true;
    const el = view.querySelector(`[data-i="${lbI}"]`);
    if (el) { el.scrollIntoView({ block: "center" }); el.focus({ preventScroll: true }); }
  }
  lb.querySelector(".lb-close").addEventListener("click", closeLB);
  lb.querySelector(".lb-prev").addEventListener("click", () => showLB(lbI - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => showLB(lbI + 1));
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB();
    else if (e.key === "ArrowRight") showLB(lbI + 1);
    else if (e.key === "ArrowLeft") showLB(lbI - 1);
  });
  let tx = 0, ty = 0, tt = 0;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = Date.now(); }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (e.target.closest(".lb-close")) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showLB(lbI + (dx < 0 ? 1 : -1));
    else if (dy > 80) closeLB();
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && Date.now() - tt < 300) showLB(lbI + 1);
  });

  // ── Info: the page slides up and the bar becomes the header ─
  const I = S.info;
  const list = (rows) => `<ul>${rows.map((r) => `<li>${r}</li>`).join("")}</ul>`;
  info.innerHTML = `
    <div class="info-top">${idBlock}
      <span class="spacer"></span><span class="spacer"></span><span class="spacer"></span>
      <a class="bar-link bar-end" href="#/" data-close><span class="mono">Close</span><span class="mono n">&nbsp;</span></a>
    </div>
    <div class="info-body"><div class="info-cols">
      <div class="bio">
        <img class="portrait" src="media/kalum-portrait.jpg" alt="Kalum Ko on a Brooklyn rooftop at dusk" loading="lazy">
        ${I.bio.map((p) => `<p>${p}</p>`).join("")}
      </div>
      <div class="info-col mono">
        <h2 class="h mono">Contact</h2>
        ${list([
          `<a href="mailto:${S.email}">${S.email}</a>`,
          `<a href="https://instagram.com/${S.instagram}" target="_blank" rel="noopener">Instagram</a>`,
          `<a href="https://vimeo.com/${S.vimeo}" target="_blank" rel="noopener">Vimeo</a>`,
        ])}
        <h2 class="h mono">Representation</h2>
        <dl class="rep">${I.representation.map(([k, v, url]) =>
          `<dt>${esc(k)}</dt><dd>${linkOr([v, url])}</dd>`).join("")}</dl>
      </div>
      <div class="info-col mono">
        <h2 class="h mono">Recognition</h2>
        ${list(I.awards.map(([k, v, url]) => linkOr([`${k} — ${v}`, url])))}
        <h2 class="h mono">Press</h2>
        ${list(I.press.map(linkOr))}
      </div>
      <div class="info-col mono">
        <h2 class="h mono">Select clients</h2>
        ${list(I.clients.split(", ").map(esc))}
        <h2 class="h mono">Agencies</h2>
        ${list(I.agencies.split(", ").map(esc))}
      </div>
    </div>
    <footer class="info-foot mono"><span>© Kalum Ko ${new Date().getFullYear()}</span></footer>
    </div>`;
  tickClocks();

  // The whole page slides up as one piece. To keep that smooth (especially on phones, mid-scroll):
  // freeze the page's scrolling so momentum can't fight the slide, and put the page on its own
  // GPU layer for the length of the move.
  let slideEnd = 0;
  function slide(open) {
    if (shell.classList.contains("info-open") === open) return;
    clearTimeout(slideEnd);
    const y = scroller.scrollTop;
    scroller.style.overflowY = "hidden";
    scroller.scrollTop = y;
    shell.classList.add("moving");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      shell.classList.toggle("info-open", open);
      const ms = parseFloat(getComputedStyle(shell).transitionDuration) * 1000 || 0;
      slideEnd = setTimeout(() => {
        shell.classList.remove("moving");
        if (!open) scroller.style.overflowY = "";
      }, ms + 60);
    }));
  }
  function openInfo() {
    info.querySelector(".info-body").scrollTop = 0;
    slide(true);
    info.setAttribute("aria-hidden", "false");
    tickClocks();
  }
  function closeInfo() {
    slide(false);
    info.setAttribute("aria-hidden", "true");
  }
  info.querySelector("[data-close]").addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = `#/${rendered || ""}`;
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shell.classList.contains("info-open")) location.hash = `#/${rendered || ""}`;
  });

  // ── Router ──────────────────────────────────────────────
  // #/  #/stills  #/motion  #/personal  #/info  #/p/<slug>
  const scrollMemo = {};
  let rendered = null;      // route drawn in the page (stays put under Info)
  let lastList = "";        // where a project's Back goes

  function renderBase(h) {
    if (rendered !== null) scrollMemo[rendered] = scroller.scrollTop;
    teardown(); teardown = () => {};
    let after = null;
    const [a, b] = h.split("/");
    if (a === "p" && bySlug[b]) {
      const p = bySlug[b], back = lastList ? `#/${lastList}` : "#/";
      setNav(lastList === "personal" && p.group === "Personal" ? "personal" : p.kind);
      document.title = `${p.title} — Kalum Ko`;
      (p.kind === "stills" ? renderStills : renderMotion)(p, back);
    } else if (lists[a] && a !== "landing") { lastList = a; renderIndex(a); }
    else { lastList = ""; h = ""; after = renderLanding(); }
    rendered = h;
    scroller.scrollTop = scrollMemo[h] || 0;
    if (after) after();
    view.focus({ preventScroll: true });
  }

  let target = null, navToken = 0;
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    if (h === "info") {
      if (rendered === null) { target = ""; renderBase(""); }
      openInfo();
      return;
    }
    closeInfo();
    const norm = h.split("/")[0] === "p" || lists[h] ? h : "";
    if (norm === target) return;
    target = norm;
    if (rendered === null) { renderBase(norm); return; }
    const t = ++navToken;
    view.classList.add("leaving");
    setTimeout(() => {
      if (t !== navToken) return;
      renderBase(norm);
      view.classList.remove("leaving");
    }, 420);
  }
  addEventListener("hashchange", route);
  route();
})();
