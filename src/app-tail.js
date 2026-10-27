
  /* ================================================================
     Guide navigation: Parts → Chapters (data: window.PAP_TOC)
     ================================================================ */
  var TOC = window.PAP_TOC, ROUTES = [], RBY = {};
  function addRoute(r) { ROUTES.push(r); RBY[r.id] = r; }
  addRoute({ id: "home", kind: "home", lab: "", en: "Contents", zh: "目錄" });
  TOC.parts.forEach(function (p) {
    addRoute({ id: "p" + p.n, kind: "part", part: p, lab: "PART " + p.n, en: p.en, zh: p.zh, lzh: "第 " + p.n + " 篇" });
    p.chapters.forEach(function (c) {
      var ch = TOC.chapters[String(c)];
      addRoute({ id: "c" + c, kind: "chapter", part: p, n: c, lab: "Chapter " + c, en: ch.en, zh: ch.zh, lzh: "第 " + c + " 章" });
    });
    if (p.n === TOC.appendix.part) addRoute({ id: TOC.appendix.id, kind: "chapter", part: p, lab: "Appendix", en: TOC.appendix.en, zh: TOC.appendix.zh, lzh: "附錄" });
  });
  $id("tabs").innerHTML = '<button type="button" class="home" data-go="home">' + B("目錄", "Contents") + "</button>" + TOC.parts.map(function (p) {
    return '<button type="button" data-go="p' + p.n + '"><small>PART ' + p.n + "</small>" + B(esc(p.zh), esc(p.en)) + "</button>";
  }).join("");
  function chipHTML(r, on) { return '<a href="#' + r.id + '" data-go="' + r.id + '"' + (on ? ' class="active"' : "") + '><span class="cn">' + r.lab + "</span>" + B(esc(r.zh), esc(r.en)) + "</a>"; }
  function pagerLink(r, cls, zh, en) {
    var t = r.kind === "home" ? B("目錄", "Contents") : B((r.lzh ? r.lzh + " · " : "") + esc(r.zh), r.lab + " · " + esc(r.en));
    return '<a class="' + cls + '" href="#' + r.id + '" data-go="' + r.id + '"><small>' + (cls === "prev" ? "← " : "") + B(zh, en) + (cls === "next" ? " →" : "") + "</small>" + t + "</a>";
  }
  var current = "home";
  function go(id, fromUser) {
    var r = RBY[id] || RBY.home;
    current = r.id;
    $$("main .page").forEach(function (s) { s.classList.toggle("active", s.id === "pg-" + r.id); });
    var tabId = r.part ? "p" + r.part.n : "home";
    $$("#tabs button").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-go") === tabId); });
    $id("chips").innerHTML = r.part ? ROUTES.filter(function (x) { return x.part === r.part && x.kind === "chapter"; }).map(function (x) { return chipHTML(x, x.id === r.id); }).join("") : "";
    var i = ROUTES.indexOf(r), prev = ROUTES[i - 1], next = ROUTES[i + 1];
    var pg = document.querySelector('[data-pager="' + r.id + '"]');
    if (pg) pg.innerHTML = (prev ? pagerLink(prev, "prev", "上一頁", "Previous") : "") + (next ? pagerLink(next, "next", "下一頁", "Next") : "");
    document.title = (r.kind === "home" ? "" : (LANG === "en" ? r.lab + " · " + r.en : (r.lzh || "") + " " + r.zh) + " · ") + "PAP Service Logistics Guide";
    if (r.id === "c4") setTimeout(orgShow, 0);
    if (fromUser) {
      try { history.replaceState(null, "", "#" + r.id); } catch (e) { /* some environments forbid URL changes */ }
      var top = $id("tabs").getBoundingClientRect().top + window.pageYOffset;
      if (window.pageYOffset > top) window.scrollTo(0, top);
    }
  }
  function orgShow() { if (!ORG || !$id("org-stage")) return; orgRender(); requestAnimationFrame(function () { orgFit(); if (orgSel) orgSelect(orgSel); }); }
  document.addEventListener("click", function (e) {
    var g = e.target.closest ? e.target.closest("[data-go]") : null;
    if (!g) return;
    if (g.tagName === "A") e.preventDefault();
    go(g.getAttribute("data-go"), true);
  });
  window.addEventListener("hashchange", function () { go(location.hash.slice(1), false); });

  /* ---------- language mode: both (guide order), zh, en ---------- */
  var painted = false;
  function setLang(l) {
    LANG = (l === "en" || l === "zh") ? l : "both";
    root.setAttribute("data-lang", LANG);
    root.lang = LANG === "en" ? "en" : "zh-Hant";
    $id("lang-sel").value = LANG;
    store.set("pap.lang", LANG);
    drawAllMaps();
    if (painted) { if (orgReady) orgRender(); renderOffices(); if ($id("pn-input")) decode(); renderGloss(); }
  }
  $id("lang-sel").addEventListener("change", function () { setLang(this.value); });

  /* ---------- maps (data: world.js) ---------- */
  var AP_VB = [688, 100, 304, 278];
  function drawAllMaps() {
    var worldCls = function (iso) { return REGION[iso] || ""; };
    drawMap($id("map-world"), [0, 15, 1000, 410], worldCls, [], WORLD_LABELS);
    $$(".legend-regions").forEach(function (el) {
      el.innerHTML = [["r-pap", "PAP 泛亞太區（TWN＋AAP）", "PAP · Pan Asia Pacific (TWN + AAP)"], ["r-pa", "PA 泛美區", "PA · Pan America"], ["r-emea", "EMEA 歐洲、中東與非洲", "EMEA · Europe, Middle East & Africa"], ["r-accn", "ACCN 中國區", "ACCN · China"]]
        .map(function (l) { return '<span><i style="background:var(--' + l[0] + ')"></i>' + B(l[1], l[2]) + "</span>"; }).join("");
    });
    drawOffices();
    drawMap($id("map-sites"), AP_VB, function (iso) { return INFRA.some(function (r) { return ISO[r[0]] === iso; }) ? "r-pap" : ""; },
      INFRA.map(function (r) {
        var parts = [["自有", "Own", r[3]], ["外包", "Outsourced", r[4]], ["ASP", "ASP", r[5]], ["Call Centre", "Call centre", r[6]], ["Parts Hub", "Parts hub", r[7]]]
          .filter(function (q) { return q[2] !== null; }).map(function (q) { return nm(q[0], q[1]) + " " + q[2]; }).join(" · ");
        var ns = NS_OF[r[0]];
        return { cc: r[0], flag: r[0], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: r.total, code: ns ? ns[0] : "", ab: ns ? ns[0].toLowerCase() : null, title: nm(r[1], r[2]) + "：" + r.total + "（" + parts + "）" };
      }));
    codeNav($id("nav-sites"), INFRA.map(function (r) {
      var ns = NS_OF[r[0]], cov = COVER_OF[r[0]];
      return { cc: r[0], code: ns ? ns[0] : (cov ? cov : "—"), ab: ns ? ns[0].toLowerCase() : (cov ? cov.toLowerCase() : null), zh: r[1], en: r[2],
        sub: (ns ? "" : (cov ? nm("由 " + cov + " 代管", "Covered by " + cov) + " · " : nm("管轄單位未載明", "Responsible NS not specified") + " · ")) + r.total + " " + nm("處據點", r.total === 1 ? "site" : "sites") };
    }), "map-sites");
    drawMap($id("map-ns"), AP_VB, function (iso) { return NS_ISO[iso] ? "r-pap" : (REGION[iso] === "r-pap" ? "r-pap2" : ""); },
      NSC.filter(function (n) { return n[1]; }).map(function (n) {
        var r = INFRA_BY[n[1]];
        return { cc: n[1], flag: n[1], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: n[0], code: n[0], ab: n[0].toLowerCase(), title: n[0] + " · " + nm(n[2], n[3]) };
      }));
    codeNav($id("nav-ns"), NSC.map(function (n) {
      var subs = n[5].filter(function (x) { return x[0] === x[3]; }).map(function (x) { return nm(x[2], x[3]); });
      return { cc: n[1], code: n[0], ab: n[0].toLowerCase(), zh: n[1] ? n[2] : "未載明", en: n[1] ? n[3] : "Not specified", cls: n[1] ? "" : "dim",
        sub: n[0] === "AKC" ? nm("由 AJC 管理", "Managed by AJC") : (subs.length ? nm("代管：", "Covers: ") + subs.join(nm("、", ", ")) : "") };
    }), "map-ns");
    drawMap($id("map-hsn"), AP_VB, function (iso) { return HSN_ISO[iso] || ""; },
      HSNC.map(function (h) {
        var r = INFRA_BY[h[1]], st = HSN_ST[h[4]], ab = AB_BY[h[0].toLowerCase()] ? h[0].toLowerCase() : null;
        return { cc: h[1], flag: h[1], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: nm(h[2], h[3]), code: h[0], ab: ab, title: h[0] + " · " + nm(h[2], h[3]) + " · " + nm(st[0], st[1]) };
      }));
    codeNav($id("nav-hsn"), HSNC.map(function (h) {
      var st = HSN_ST[h[4]];
      return { cc: h[1], code: h[0], ab: AB_BY[h[0].toLowerCase()] ? h[0].toLowerCase() : null, zh: h[2], en: h[3], sub: '<i class="st" style="background:var(--' + st[2] + ')"></i>' + nm(st[0], st[1]), cls: h[4] === "est" ? "" : "dim" };
    }), "map-hsn");
  }

  /* ---------- data tables rendered from the site's own data ---------- */
  function renderNsTable() {
    var tb = $id("ns-table"); if (!tb) return;
    tb.innerHTML = NSC.map(function (n) {
      var subs = n[5].length ? n[5].map(function (s) { return (s[1] ? flag(s[1]) : "") + (s[0] !== s[3] ? "<b>" + esc(s[0]) + "</b> " : "") + B(s[2], s[3]); }).join("、") : '<span class="no">—</span>';
      if (n[0] === "AKC") subs = B("由 AJC 管理", "Managed by AJC");
      if (n[0] === "AJC") subs = B("管理 AKC", "Manages AKC");
      return '<tr><td class="code">' + n[0] + "</td><td>" + (n[1] ? flag(n[1]) + B(n[2], n[3]) : NA(n[2], n[3])) + "</td><td>" + subs + '</td><td class="c code">' + esc(n[4]) + "</td></tr>";
    }).join("");
  }
  function renderSites() {
    var tb = $id("infra-body"); if (!tb) return;
    var cell = function (v) { return '<td class="c">' + (v === null ? '<span class="no">—</span>' : v) + "</td>"; };
    tb.innerHTML = INFRA.map(function (r) {
      return '<tr id="row-' + r[0] + '"><td>' + flag(r[0]) + B(r[1], r[2]) + "</td>" + cell(r[3]) + cell(r[4]) + cell(r[5]) + cell(r[6]) + cell(r[7]) + '<td class="c"><b>' + r.total + "</b></td></tr>";
    }).join("");
    var sums = [0, 0, 0, 0, 0], all = 0;
    INFRA.forEach(function (r) { for (var i = 0; i < 5; i++) sums[i] += r[i + 3] || 0; });
    sums.forEach(function (s) { all += s; });
    $("infra-foot").innerHTML = "<tr><td>" + B("PAP 合計（各國加總）", "PAP total (sum of countries)") + "</td>" + sums.map(function (s) { return '<td class="c">' + s + "</td>"; }).join("") + '<td class="c">' + all + "</td></tr>" +
      "<tr><td>" + B("報表所列總數", "Reported totals") + "</td>" + KPI.slice(0, 5).map(function (k) { return '<td class="c">' + k[0] + "</td>"; }).join("") + '<td class="c">' + B("788 + 1 區域備品中心", "788 + 1 regional hub") + "</td></tr>";
  }
  function renderWh() {
    var tb = $id("wh-body"); if (!tb) return;
    tb.innerHTML = WH.map(function (r) {
      return "<tr><td>" + flag(r[0]) + B(r[1], r[2]) + '</td><td class="code">' + r[3] + '</td><td class="c">' + mark(r[4]) + '</td><td class="c">' + mark(r[5]) + "</td></tr>";
    }).join("");
  }
  function renderHsn() {
    var tb = $id("code-hsn"); if (!tb) return;
    tb.innerHTML = HSNC.map(function (h) {
      var st = HSN_ST[h[4]];
      return '<tr><td class="code">' + (h[4] === "est" ? esc(h[0]) : "—") + "</td><td>" + flag(h[1]) + B(h[2], h[3]) + "</td><td>" + B(st[0], st[1]) + "</td></tr>";
    }).join("");
  }
  var CAT_ROWS = [["Accessory", "配件"], ["Board", "板卡"], ["Cable", "線材"], ["Case / cover / bracket assembly", "機殼組件"], ["CPU / processor", "處理器"], ["Communication module", "通訊模組"], ["DVD-RW drive", "光碟機"], ["HDD / hard disk drive", "硬碟"],
    ["Heatsink", "散熱片"], ["Keyboard", "鍵盤"], ["Mainboard", "主機板"], ["Memory", "記憶體"], ["Pointing device", "指標裝置"], ["Power supply", "電源供應器"], ["Screw", "螺絲"], ["Speaker", "喇叭"],
    ["Adapter", "變壓器"], ["Battery", "電池"], ["Touchpad", "觸控板"], ["Miscellaneous", "其他"], ["LCD module", "面板模組"], ["LCD", "面板"], ["Fan", "風扇"], ["Camera", "攝影機"]];
  function renderCatsTable() {
    var t = $id("cats-table"); if (!t) return;
    var head = "<tr>" + "<th>No.</th><th>" + B("類別", "Category") + "</th>".replace("</th><th>", "</th><th>") + "<th>No.</th><th>" + B("類別", "Category") + "</th><th>No.</th><th>" + B("類別", "Category") + "</th></tr>";
    var rows = "";
    for (var i = 0; i < 8; i++) {
      rows += "<tr>" + [i, i + 8, i + 16].map(function (k) { return '<td class="c code">' + (k + 1) + "</td><td>" + esc(CAT_ROWS[k][0]) + ' <span class="zh">' + esc(CAT_ROWS[k][1]) + "</span></td>"; }).join("") + "</tr>";
    }
    t.innerHTML = "<thead>" + head + "</thead><tbody>" + rows + "</tbody>";
  }

  /* ---------- glossary (data: src/data/glossary.json, inlined as PAP_GLOSS) ---------- */
  var GL = window.PAP_GLOSS, AB_BY_CODE = {};
  var glKey = function (s) { return String(s || "").replace(/\s+/g, "").toUpperCase(); };
  AB.forEach(function (a) { AB_BY_CODE[glKey(a.code)] = a.id; a.keys.forEach(function (k) { if (!AB_BY_CODE[glKey(k)]) AB_BY_CODE[glKey(k)] = a.id; }); });
  function glEntry(t) {
    var abid = AB_BY_CODE[glKey(t.code)];
    var full = t.full ? esc(t.full) : NA("原始資料未載明全稱", "Full name not specified in the source");
    return '<article class="gl" data-code="' + esc(glKey(t.code)) + '"' + (abid ? ' data-ab-id="' + abid + '"' : "") + '><span class="code">' + esc(t.code) + '</span><div><div class="gl-t">' + full +
      (t.fullNotSpecified && t.full ? ' <span class="na">' + B("原始資料未載明", "not stated in the source") + "</span>" : "") + (t.zh ? ' <span class="zh">' + esc(t.zh) + "</span>" : "") + "</div>" +
      '<p class="en">' + esc(t.den) + '</p><p class="zh">' + esc(t.dzh) + "</p>" +
      (abid ? '<div class="gl-meta"><button type="button" class="btn sm" data-ab="' + abid + '">' + B("代碼說明", "Code details") + "</button></div>" : "") + "</div></article>";
  }
  function renderGloss() {
    var box = $id("gl-groups"); if (!box || !GL) return;
    var q = ($id("gl-search") ? $id("gl-search").value : "").trim().toLowerCase(), n = 0;
    var html = GL.groups.map(function (g) {
      var items = g.terms.filter(function (t) { return !q || [t.code, t.full, t.zh, t.den, t.dzh].join(" ").toLowerCase().indexOf(q) !== -1; });
      if (!items.length) return "";
      n += items.length;
      return '<div class="gl-group"><h3 class="sec" id="s26-' + esc(String(g.num).split(".")[1] || "") + '"><span class="num">' + esc(g.num) + "</span>" + B(esc(g.zh), esc(g.en)) + "</h3>" + items.map(glEntry).join("") + "</div>";
    }).join("");
    box.innerHTML = html || '<p class="gl-empty">' + B("查無「" + esc(q) + "」相關條目。", 'No entry matches "' + esc(q) + '".') + "</p>";
    $("gl-count").innerHTML = B(n + " 個條目", n + " entries");
    linkAbbr(box);
  }
  if ($id("gl-search")) $id("gl-search").addEventListener("input", renderGloss);
  function showGloss(id) {
    go("c26", true);
    var s = $id("gl-search"); if (s && s.value) { s.value = ""; renderGloss(); }
    var a = AB_BY[id], el = document.querySelector('.gl[data-ab-id="' + id + '"]') || (a ? document.querySelector('.gl[data-code="' + glKey(a.code) + '"]') : null);
    $$(".gl.hit").forEach(function (x) { x.classList.remove("hit"); });
    if (el) { el.classList.add("hit"); el.scrollIntoView({ block: "center" }); }
  }

  /* ---------- review questions (data: src/data/review.json, inlined as PAP_REVIEW) ---------- */
  var RV = window.PAP_REVIEW;
  function renderQuiz() {
    var ol = $id("quiz-list"); if (!ol || !RV) return;
    ol.innerHTML = RV.questions.map(function (q) {
      return '<li><span class="qn">' + q.n + '</span><div><div class="q">' + B(esc(q.qzh), esc(q.qen)) + "</div><details><summary>" + B("解答", "Answer") + '</summary><div class="ans">' + B(esc(q.azh), esc(q.aen)) + "</div></details></div></li>";
    }).join("");
    $("quiz-count").innerHTML = B(RV.questions.length + " 題", RV.questions.length + " questions");
    var all = function (open) { $$("#quiz-list details").forEach(function (d) { d.open = open; }); };
    $("quiz-open").addEventListener("click", function () { all(true); });
    $("quiz-close").addEventListener("click", function () { all(false); });
  }

  /* ---------- company badges: drawn pictograms (no third-party logos) ---------- */
  var BADGE = {
    laptop: '<rect x="3.5" y="5.5" width="17" height="11" rx="1.5"/><path d="M2 19h20"/>',
    wrench: '<path d="M14.5 5.5a4 4 0 0 0-5.3 5.3L4 16l3.5 3.5 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.1-2.1z"/>',
    factory: '<path d="M3 20V9l5 3.5V9l5 3.5V9l5 3.5V20z"/><path d="M15 12.5V4h3v8"/><path d="M6 16.5h2M10 16.5h2M14 16.5h2"/>',
    monitor: '<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M12 16.5V20M8 20h8"/>',
    truck: '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    signage: '<rect x="4" y="3" width="16" height="12" rx="1.5"/><path d="M8 21h8M12 15v6M8 9h8M8 6.5h5"/>',
    gamepad: '<path d="M7 8h10a4 4 0 0 1 4 4l-1 5a2 2 0 0 1-3.5 1L15 16H9l-1.5 2A2 2 0 0 1 4 17l-1-5a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3M16 12h.01M18 13.5h.01"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9"/>',
    cross: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>'
  };
  var BADGE_OF = { acer: "laptop", hsn: "wrench", highpoint: "wrench", compal: "factory", quanta: "factory", wistron: "factory", inventec: "factory", pegatron: "factory", foxconn: "factory", benq: "monitor", auo: "monitor",
    weblink: "truck", acsi: "shield", aeb: "cloud", ast: "gear", aopen: "signage", acergaming: "gamepad", acergadget: "headphones", acerpure: "leaf", acermedical: "cross" };
  $$(".co-card[data-badge]").forEach(function (c) {
    var k = BADGE_OF[c.getAttribute("data-badge")] || "factory", b = c.querySelector(".badge");
    if (b) b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + BADGE[k] + "</svg>";
  });

  /* ---------- start ---------- */
  renderNsTable(); renderSites(); renderWh(); renderHsn(); renderCatsTable(); renderQuiz();
  setLang(store.get("pap.lang") || "both");
  renderGloss();
  $$(".ch-body").forEach(linkAbbr);
  painted = true;
  go(location.hash.slice(1), false);
})();
