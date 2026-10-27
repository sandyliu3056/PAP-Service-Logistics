(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var B = function (zh, en) { return '<span class="zh">' + zh + '</span><span class="en">' + en + "</span>"; };
  var NA = function (zh, en) { return '<span class="na">' + B(zh, en) + "</span>"; };
  var flag = function (cc) { return cc ? '<img class="flag" src="flags/' + cc + '.svg" alt="" loading="lazy">' : ""; };
  // 線條圖示（24×24，顏色跟隨文字）
  var ICON = {
    intro: '<path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    overview: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    org: '<rect x="9" y="3" width="6" height="5" rx="1.2"/><rect x="2.5" y="16" width="6" height="5" rx="1.2"/><rect x="9" y="16" width="6" height="5" rx="1.2"/><rect x="15.5" y="16" width="6" height="5" rx="1.2"/><path d="M12 8v8M5.5 16v-4h13v4"/>',
    sites: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    hsn: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.8 7.2 6.2 15.8M13.2 7.2l4.6 8.6M7.5 18h9"/>',
    ops: '<rect x="3" y="4" width="7.5" height="6" rx="1.3"/><rect x="13.5" y="14" width="7.5" height="6" rx="1.3"/><path d="M10.5 7H14a3.2 3.2 0 0 1 3.2 3.2V14"/><path d="m15 11.8 2.2 2.2 2.2-2.2"/>',
    pn: '<path d="M4 5v14M7 5v14M11 5v14M14 5v14M18 5v14M20.5 5v14"/>',
    ref: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6M9 11h4"/>',
    review: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.6 1.6L8 4.8M3.5 12l1.6 1.6L8 10.8M3.5 18l1.6 1.6L8 16.8"/>',
    ro: '<path d="M4 21V8l8-4.5L20 8v13"/><path d="M9.5 21v-5h5v5M8.5 11h2M13.5 11h2"/>',
    plan: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
    route: '<path d="M3 7h10.5v9.5H3z"/><path d="M13.5 10.5h3.8L20.5 14v2.5h-7"/><circle cx="7" cy="17.8" r="1.9"/><circle cx="17" cy="17.8" r="1.9"/>',
    tool: '<path d="M14.6 4.4a4.6 4.6 0 0 0-5.4 6.2L3.6 16.2a1.9 1.9 0 0 0 2.7 2.7l5.6-5.6a4.6 4.6 0 0 0 6.2-5.4l-2.7 2.7-2.5-.6-.6-2.5z"/>'
  };
  var ico = function (id) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[id] + "</svg>"; };
  var mark = function (v) { return v ? '<span class="yes" aria-label="yes">✓</span>' : '<span class="no" aria-label="no">—</span>'; };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 無痕模式等：不記住設定 */ } }
  };
  var root = document.documentElement;
  var LANG = "zh";

  /* ---------- 網站架構：主頁 → 子頁 ---------- */
  var NAV = [
    { id: "intro", home: true, emoji: "🏠", zh: "網站介紹", en: "About", subs: [] },
    { id: "overview", emoji: "🌏", zh: "總覽", en: "Overview", subs: [] },
    { id: "corp", emoji: "🏢", zh: "公司介紹", en: "Companies", dzh: "企業架構圖、宏碁與泛宏碁集團、集團子公司、ODM 代工廠、服務夥伴、資料查證", den: "Architecture chart, Acer and its family, subsidiaries, ODM manufacturers, service partners, verification",
      subs: [["corp-map", "企業架構圖", "Architecture chart"], ["corp-acer", "宏碁 Acer", "Acer"], ["corp-subs", "集團子公司", "Group subsidiaries"], ["corp-suppliers", "ODM 代工廠", "ODM manufacturers"], ["corp-service", "服務夥伴", "Service partners"], ["corp-verify", "資料查證", "Verification"]] },
    { id: "org", emoji: "📍", zh: "組織與據點", en: "Organisation & sites", dzh: "全球區域與據點、PAP 組織、服務據點類型與分布、倉庫與標案", den: "Regions and offices, PAP organisation, service sites, warehouses and tenders",
      subs: [["org-global", "全球區域", "Global regions"], ["org-offices", "全球據點", "Acer around the world"], ["org-pap", "PAP 組織", "PAP organisation"], ["org-points", "組織要點", "Key points"], ["sites-types", "據點類型", "Site types"], ["sites-map", "據點分布", "Service footprint"], ["sites-wh", "倉庫與 Uni-load", "Warehouses and Uni-load"], ["sites-tender", "標案與 Uni-load", "Tenders and Uni-load"]] },
    { id: "ops", emoji: "📦", zh: "作業與料號", en: "Operations & part numbers", dzh: "PAP 團隊之日常工作：採購角色、職能、系統、SPL 流程、Service BOM、規劃模式與料號規則", den: "The PAP team's day-to-day work: purchasing role, functions, systems, SPL flow, Service BOM, planning modes and part numbers",
      subs: [["ops-role", "團隊職責", "Team responsibilities"], ["ops-functions", "主要職能", "Main functions"], ["ops-systems", "系統", "Systems"], ["ops-spl", "SPL 定義流程", "SPL definition flow"], ["ops-bom", "Service BOM", "Service BOM"], ["ops-plan", "規劃模式", "Planning modes"], ["pn-rule", "料號命名規則", "Part number rule"], ["pn-decode", "料號解析", "Decoder"], ["pn-subcat", "子類別對照", "Sub-categories"]] },
    { id: "hsn", emoji: "🔧", zh: "HSN 集團", en: "HSN Group", dzh: "海柏特集團（Highpoint Service Network）概要、各國公司與流程調整", den: "Highpoint Service Network: overview, companies and process change",
      subs: [["hsn-about", "概要", "Overview"], ["hsn-companies", "各國公司", "Companies by country"], ["hsn-change", "流程調整", "Process change"]] },
    { id: "ref", emoji: "📖", zh: "名詞與代碼", en: "Terms & codes", dzh: "營運模式等產業名詞、區域與子公司代碼、縮寫說明", den: "Industry terms, region and subsidiary codes, abbreviations",
      subs: [["terms-model", "營運模式", "Business models"], ["terms-chain", "供應鏈角色", "Supply-chain roles"], ["terms-service", "售後服務名詞", "After-sales terms"], ["terms-market", "證券市場名詞", "Stock-market terms"], ["ref-region", "區域代碼", "Region codes"], ["ref-ns", "子公司代碼", "Subsidiary codes"], ["ref-other", "其他國家與單位", "Other countries and units"], ["ref-hsn", "HSN 代碼", "HSN codes"], ["ref-abbr", "縮寫說明", "Abbreviations"]] },
    { id: "review", emoji: "✅", zh: "重點複習", en: "Review", dzh: "18 題重點複習", den: "18 review questions", subs: [] }
  ];
  var ORDER = [], navN = 0;
  NAV.forEach(function (p) {
    p.num = p.home ? "" : ++navN;
    if (!p.subs.length) ORDER.push({ page: p, sub: null });
    p.subs.forEach(function (s, j) { s.num = p.num + "." + (j + 1); ORDER.push({ page: p, sub: s }); });
  });
  $$("[data-num]").forEach(function (el) {
    var id = el.getAttribute("data-num");
    ORDER.forEach(function (o) { if (o.sub && o.sub[0] === id) el.textContent = o.sub.num; });
  });
  var label = function (o) { return o.sub ? B(o.sub[1], o.sub[2]) : B(o.page.zh, o.page.en); };

  $("tabs").innerHTML = NAV.map(function (p) {
    return '<button type="button" role="tab" data-go="' + p.id + '"' + (p.home ? ' class="home"' : "") + '><span class="emo" aria-hidden="true">' + p.emoji + "</span>" + B(p.zh, p.en) + "</button>";
  }).join("");
  $$(".subnav").forEach(function (a) {
    var p = NAV.filter(function (x) { return x.id === a.getAttribute("data-page"); })[0];
    a.innerHTML = '<div class="pt">' + B(p.zh, p.en) + "<small>" + p.num + " · " + B(p.dzh, p.den) + "</small></div><nav>" +
      p.subs.map(function (s) { return '<button type="button" data-go="' + s[0] + '"><span class="n">' + s.num + "</span><span>" + B(s[1], s[2]) + "</span></button>"; }).join("") + "</nav>";
  });

  function findRoute(id) {
    for (var i = 0; i < ORDER.length; i++) {
      var o = ORDER[i];
      if ((o.sub && o.sub[0] === id) || (!o.sub && o.page.id === id)) return i;
    }
    for (var j = 0; j < ORDER.length; j++) if (ORDER[j].page.id === id) return j;
    return 0;
  }
  var current = 0;
  function go(id, fromUser) {
    current = findRoute(id);
    var o = ORDER[current], p = o.page;
    if (o.sub && o.sub[0] === "corp-map") setTimeout(orgShow, 0);
    $$("#tabs button").forEach(function (b) {
      var on = b.getAttribute("data-go") === p.id;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$("main .page").forEach(function (s) { s.classList.toggle("active", s.id === "page-" + p.id); });
    var page = $("page-" + p.id);
    $$(".sub", page).forEach(function (s) { s.classList.toggle("active", !!o.sub && s.id === "sub-" + o.sub[0]); });
    $$(".subnav button", page).forEach(function (b) { b.classList.toggle("active", !!o.sub && b.getAttribute("data-go") === o.sub[0]); });
    var crumb = page.querySelector(".crumb");
    if (crumb && o.sub) crumb.innerHTML = p.num + " " + B(p.zh, p.en) + " › <b>" + o.sub.num + " " + B(o.sub[1], o.sub[2]) + "</b>";
    var prev = ORDER[current - 1], next = ORDER[current + 1];
    var pg = page.querySelector(".pager");
    if (pg) {
      pg.innerHTML = (prev ? '<button type="button" class="prev" data-go="' + (prev.sub ? prev.sub[0] : prev.page.id) + '"><small>' + B("上一頁", "Previous") + "</small>← " + label(prev) + "</button>" : "") +
        (next ? '<button type="button" class="next" data-go="' + (next.sub ? next.sub[0] : next.page.id) + '"><small>' + B("下一頁", "Next") + "</small>" + label(next) + " →</button>" : "");
    }
    if (fromUser) {
      var hash = o.sub ? o.sub[0] : p.id;
      try { history.replaceState(null, "", "#" + hash); } catch (e) { /* 部分環境不允許改網址 */ }
      var top = $("tabs").getBoundingClientRect().top + window.pageYOffset;
      if (window.pageYOffset > top) window.scrollTo(0, top);
    }
  }
  document.addEventListener("click", function (e) {
    var g = e.target.closest ? e.target.closest("[data-go]") : null;
    if (!g) return;
    if (g.tagName === "A") e.preventDefault();
    go(g.getAttribute("data-go"), true);
  });
  window.addEventListener("hashchange", function () { go(location.hash.slice(1), false); });

  /* ---------- 設定：語言、字型、主題 ---------- */
  function orgShow() { if (!ORG) return; orgRender(); requestAnimationFrame(function () { orgHome(); if (orgSel) orgSelect(orgSel); }); }
  function setLang(l) {
    LANG = l === "en" ? "en" : "zh";
    root.setAttribute("data-lang", LANG);
    root.setAttribute("lang", LANG === "en" ? "en" : "zh-Hant");
    $("lang-sel").value = LANG;
    $$("option[data-zh]").forEach(function (o) { o.textContent = o.getAttribute("data-" + LANG); });
    $$("[data-ph-zh]").forEach(function (el) { el.placeholder = el.getAttribute("data-ph-" + LANG); });
    store.set("pap.lang", LANG);
    drawAllMaps();
    if (typeof orgReady !== "undefined" && orgReady) orgRender();
  }
  function setFont(f) { f = /^(hand|sans|mono)$/.test(f) ? f : "hand"; root.setAttribute("data-font", f); $("font-sel").value = f; store.set("pap.font", f); }
  // 只記住使用者自己選的主題；沒選過就用預設的土色
  function setTheme(t, save) { t = /^(green|blue|earth)$/.test(t) ? t : "earth"; root.setAttribute("data-theme", t); $("theme-sel").value = t; if (save) store.set("pap.color", t); }
  $("lang-sel").addEventListener("change", function () { setLang(this.value); });
  $("font-sel").addEventListener("change", function (e) { setFont(e.target.value); });
  $("theme-sel").addEventListener("change", function (e) { setTheme(e.target.value, true); });

  /* ---------- 條碼（裝飾） ---------- */
  function barcode(el, seed) {
    if (!el) return;
    var x = 0, i = 0, out = "";
    while (x < 400) {
      var c = seed.charCodeAt(i % seed.length) + i * 7, w = 1 + (c % 4), gap = 1 + ((c >> 2) % 3);
      if (x + w > 400) break;
      out += '<rect x="' + x + '" y="0" width="' + w + '" height="40"></rect>';
      x += w + gap; i++;
    }
    el.innerHTML = out;
  }
  barcode($("barcode"), "DGB88SA001PAP");

  /* ---------- 服務據點資料 ---------- */
  // [旗幟, 中文, English, 自有, 外包, ASP, Call Centre, Local Parts Hub, 經度, 緯度, 標籤 x, 標籤 y]；null = 未列示
  var INFRA = [
    ["in", "印度", "India", 0, 172, 126, 1, 2, 79, 22, 712, 200],
    ["th", "泰國", "Thailand", 12, null, 109, 1, null, 101, 15, 757, 212],
    ["id", "印尼", "Indonesia", null, 18, 91, 1, 1, 114, 0, 818, 262],
    ["tw", "台灣", "Taiwan", 6, 17, 58, 1, 7, 121, 23.7, 852, 182],
    ["au", "澳洲", "Australia", 1, null, 61, 0, 1, 134, -25, 872, 319],
    ["my", "馬來西亞", "Malaysia", 14, 2, 23, null, 1, 102.5, 4, 763, 236],
    ["bd", "孟加拉", "Bangladesh", null, 6, 4, null, null, 90.3, 23.7, 747, 166],
    ["mm", "緬甸", "Myanmar", null, null, 10, null, null, 96, 21, 770, 178],
    ["vn", "越南", "Vietnam", 2, null, 5, 1, 1, 108, 14.5, 818, 204],
    ["la", "寮國", "Laos", null, null, 6, null, null, 102.5, 19.5, 795, 184],
    ["nz", "紐西蘭", "New Zealand", 1, null, 4, null, null, 172, -41, 972, 350],
    ["jp", "日本", "Japan", null, 0, 2, 1, 1, 138, 36, 896, 146],
    ["kr", "韓國", "Korea", null, null, 1, 1, 1, 127.8, 36.3, 852, 136],
    ["lk", "斯里蘭卡", "Sri Lanka", null, null, 3, null, null, 80.7, 7.8, 710, 240],
    ["sg", "新加坡", "Singapore", 1, 0, null, null, 1, 103.8, 1.35, 780, 258],
    ["ph", "菲律賓", "Philippines", 0, null, 0, 1, 1, 122, 12, 846, 214],
    ["hk", "香港", "Hong Kong", null, 1, null, null, 1, 114.2, 22.3, 814, 172],
    ["kh", "柬埔寨", "Cambodia", null, null, 2, null, null, 105, 12.5, 797, 226],
    ["np", "尼泊爾", "Nepal", null, null, 1, null, null, 84, 28.3, 722, 156],
    ["mn", "蒙古", "Mongolia", null, null, 1, null, null, 103, 46.8, 786, 120]
  ];
  INFRA.forEach(function (r) { var t = 0; for (var i = 3; i <= 7; i++) t += r[i] || 0; r.total = t; });
  INFRA.sort(function (a, b) { return b.total - a.total; });
  var INFRA_BY = {};
  INFRA.forEach(function (r) { INFRA_BY[r[0]] = r; });
  var ISO = { in: "IND", th: "THA", id: "IDN", tw: "TWN", au: "AUS", my: "MYS", bd: "BGD", mm: "MMR", vn: "VNM", la: "LAO", nz: "NZL", jp: "JPN", kr: "KOR", lk: "LKA", sg: "SGP", ph: "PHL", hk: "HKG", kh: "KHM", np: "NPL", mn: "MNG" };

  var KPI = [
    [38, "自有服務中心", "Service centres (own)"],
    [216, "外包服務中心", "Service centres (outsourced)"],
    [507, "授權服務商 ASP", "Authorized service providers"],
    [8, "客服中心", "Call centres"],
    [18, "當地備品中心", "Local parts hubs"],
    [1, "區域備品中心", "Regional spare parts hub"]
  ];
  $("infra-kpis").innerHTML = KPI.map(function (k) { return '<div class="kpi"><div class="k">' + B(k[1], k[2]) + '</div><div class="v">' + k[0] + "</div></div>"; }).join("");
  var cell = function (v) { return '<td class="num">' + (v === null ? '<span class="no">—</span>' : v) + "</td>"; };
  var maxT = INFRA[0].total;
  $("infra-body").innerHTML = INFRA.map(function (r) {
    var pct = Math.max(0.8, r.total / maxT * 100);
    return '<tr id="row-' + r[0] + '"><td>' + flag(r[0]) + B(r[1], r[2]) + "</td>" + cell(r[3]) + cell(r[4]) + cell(r[5]) + cell(r[6]) + cell(r[7]) +
      '<td><div class="bar-cell"><b>' + r.total + '</b><div class="bar-track"><div class="bar" style="width:' + pct.toFixed(1) + '%"></div></div></div></td></tr>';
  }).join("");
  var sums = [0, 0, 0, 0, 0], all = 0;
  INFRA.forEach(function (r) { for (var i = 0; i < 5; i++) sums[i] += r[i + 3] || 0; });
  sums.forEach(function (s) { all += s; });
  $("infra-foot").innerHTML =
    "<tr><td>" + B("各國合計", "Sum of countries") + "</td>" + sums.map(function (s) { return '<td class="num">' + s + "</td>"; }).join("") + "<td><b>" + all + "</b></td></tr>" +
    "<tr><td>" + B("總數", "Reported total") + "</td>" + KPI.slice(0, 5).map(function (k) { return '<td class="num">' + k[0] + "</td>"; }).join("") + "<td></td></tr>";

  var WH = [
    ["au", "澳洲", "Australia", "ACA", 1, 1], ["nz", "紐西蘭", "New Zealand", "ACNZ", 1, 0], ["in", "印度", "India", "AIL", 1, 1],
    ["my", "馬來西亞", "Malaysia", "ASSB", 1, 1], ["ph", "菲律賓", "Philippines", "APHI", 1, 0], ["th", "泰國", "Thailand", "ATH", 1, 1],
    ["vn", "越南", "Vietnam", "AVN", 1, 0], ["id", "印尼", "Indonesia", "AIN (AMI)", 1, 1], ["sg", "新加坡", "Singapore", "ACS", 1, 1],
    ["jp", "日本", "Japan", "AJC", 1, 0], ["kr", "韓國", "Korea", "AKC", 1, 0]
  ];
  $("wh-body").innerHTML = WH.map(function (r) {
    return "<tr><td>" + flag(r[0]) + B(r[1], r[2]) + '</td><td class="code">' + r[3] + '</td><td class="c">' + mark(r[4]) + '</td><td class="c">' + mark(r[5]) + "</td></tr>";
  }).join("");

  var STYPES = [
    ["Service Centre (Own by Acer)", "自有服務中心", 38, "Acer 自營之維修中心，以馬來西亞 14 處、泰國 12 處、台灣 6 處最多。", "Repair centres operated by Acer; Malaysia (14), Thailand (12) and Taiwan (6) have the most."],
    ["Service Centre (Outsource)", "外包服務中心", 216, "委外經營之服務中心，其中印度 172 處。", "Outsourced service centres, 172 of them in India."],
    ["Authorized Service Provider (ASP)", "授權服務商", 507, "經 Acer 授權之外部服務商，提供收件服務，不具維修能力；為數量最多之據點類型。", "Authorised external providers that take in units but do not repair them; the most numerous site type."],
    ["Call Centre", "客服中心", 8, "客戶服務電話中心；印度、泰國、印尼、台灣、越南、日本、韓國、菲律賓各 1 處。", "Customer service phone centres; one each in India, Thailand, Indonesia, Taiwan, Vietnam, Japan, Korea and the Philippines."],
    ["Local Parts Hub", "當地備品中心", 18, "各國之零件總倉，各據點另設有庫房；以台灣 7 處最多。", "Each country's main parts warehouse, with storerooms at each site; Taiwan has the most (7)."],
    ["Regional Spared Part Hub", "區域備品中心", 1, "服務整個區域之備品中心。", "Spare-parts hub serving the whole region."],
    ["Warehouse (W/H)", "倉庫", "11", "PAP Service Org. 所列 11 國均設有倉庫。", "All 11 countries in the PAP Service Org. have a warehouse."],
    ["Uni-load", "當地產線／組裝廠", "6", "於當地設有產線或組裝廠：澳洲、印度、馬來西亞、泰國、印尼、新加坡。", "Local production or assembly: Australia, India, Malaysia, Thailand, Indonesia, Singapore."]
  ];
  $("code-sitetype").innerHTML = STYPES.map(function (s) {
    return "<tr><td><b>" + esc(s[0]) + '</b><br><span class="caption zh">' + s[1] + '</span></td><td class="num"><b>' + s[2] + '</b></td><td class="wrap">' + B(s[3], s[4]) + "</td></tr>";
  }).join("");

  /* ---------- 組織 ---------- */
  // [NS, 旗幟, 中文國名, English, 料號國碼, 下轄單位 [[名稱, 旗幟, 中文, English]], 倉庫, Uni-load]
  var NSC = [
    ["ASSB", "my", "馬來西亞", "Malaysia", "M", [["HSNM", "", "HSN Group 馬來西亞公司", "HSN Group, Malaysia"]], 1, 1],
    ["ACA", "au", "澳洲", "Australia", "A", [["ACNZ", "nz", "紐西蘭", "New Zealand"]], 1, 1],
    ["AIL", "in", "印度", "India", "I", [["Bangladesh", "bd", "孟加拉", "Bangladesh"]], 1, 1],
    ["ATH", "th", "泰國", "Thailand", "T", [["Indo-china", "", "中南半島", "Indo-china"]], 1, 1],
    ["AIN", "id", "印尼", "Indonesia", "N / D", [["AMI", "", "印尼 Uni-load 組裝廠", "Indonesian Uni-load assembly company"]], 1, 1],
    ["AVN", "vn", "越南", "Vietnam", "V", [], 1, 0],
    ["AJC", "jp", "日本", "Japan", "J", [], 1, 0],
    ["AKC", "kr", "韓國", "Korea", "J", [], 1, 0],
    ["AFE", "", "未載明", "Not specified", "—", [], null, null],
    ["APHI", "ph", "菲律賓", "Philippines", "P", [], 1, 0],
    ["ACS", "sg", "新加坡", "Singapore", "S", [["Sri Lanka", "lk", "斯里蘭卡", "Sri Lanka"], ["Mongolia", "mn", "蒙古", "Mongolia"], ["Nepal", "np", "尼泊爾", "Nepal"]], 1, 1]
  ];
  $("ns-table").innerHTML = NSC.map(function (n) {
    var subs = n[5].length ? n[5].map(function (s) { return flag(s[1]) + B(s[2], s[3]); }).join("、") : '<span class="no">—</span>';
    if (n[0] === "AKC") subs = B("由 AJC 管理", "Managed by AJC");
    return '<tr><td><b class="code">' + n[0] + "</b></td><td>" + (n[1] ? flag(n[1]) + B(n[2], n[3]) : NA(n[2], n[3])) + '</td><td class="wrap">' + subs + "</td></tr>";
  }).join("");

  /* ---------- 地圖 ---------- */
  var REGION = {};
  var assign = function (list, cls) { list.split(" ").forEach(function (iso) { REGION[iso] = cls; }); };
  assign("ARG BHS BLZ BMU BOL BRA CAN CHL COL CRI CUB DOM ECU FLK GTM GUF GUY HND HTI JAM MEX NIC PAN PER PRI PRY SLV SUR TTO URY USA VEN", "r-pa");
  assign("ALB AUT BEL BGR BIH BLR CHE CS-KM CYP CZE DEU DNK ESP EST FIN FRA GBR GRC HRV HUN IRL ISL ITA LTU LUX LVA MDA MKD MLT MNE NLD NOR POL PRT ROU RUS SRB SVK SVN SWE UKR ARM AZE GEO " +
    "ARE IRN IRQ ISR JOR KWT LBN OMN PSE QAT SAU SYR TUR YEM AGO BDI BEN BFA BWA CAF CIV CMR COD COG DJI DZA EGY ERI ESH ETH GAB GHA GIN GMB GNB GNQ KEN LBR LBY LSO MAR MDG MLI MOZ MRT MWI NAM NER NGA RWA SDN SEN SLE SOM SSD SWZ TCD TGO TUN TZA UGA ZAF ZMB ZWE", "r-emea");
  assign("CHN", "r-accn");
  assign("AUS BGD IDN IND JPN KHM KOR LAO LKA MMR MNG MYS NPL NZL PHL THA TWN VNM", "r-pap");
  var px = function (lon) { return (lon + 180) * 1000 / 360; };
  var py = function (lat) { return (90 - lat) * 500 / 180; };
  var textW = function (s) { var w = 0; for (var i = 0; i < s.length; i++) w += /[⺀-鿿]/.test(s.charAt(i)) ? 6.4 : 3.75; return w; };
  function drawMap(svg, vb, cls, pins, labels) {
    var W = window.PAP_WORLD;
    if (!W || !svg) return;
    var out = '<rect class="sea" x="' + vb[0] + '" y="' + vb[1] + '" width="' + vb[2] + '" height="' + vb[3] + '"></rect>';
    Object.keys(W.paths).forEach(function (iso) {
      var c = cls(iso);
      out += '<path d="' + W.paths[iso] + '"' + (c ? ' class="' + c + '"' : "") + "></path>";
    });
    var leads = "", pinOut = "";
    (pins || []).forEach(function (p) {
      var x = px(p.lon), y = py(p.lat), w = 11 + textW(String(p.text)) + 2.5, h = 9;
      if (Math.abs(p.lx - x) > 3 || Math.abs(p.ly - y) > 3) {
        leads += '<line class="lead" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + p.lx + '" y2="' + p.ly + '"></line><circle class="pt" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1"></circle>';
      }
      var bx = p.lx - w / 2, by = p.ly - h / 2;
      pinOut += '<g class="pin' + (p.ab ? " ab" : "") + '"' + (p.cc ? ' data-cc="' + p.cc + '"' : "") + (p.code ? ' data-code="' + esc(p.code) + '"' : "") + (p.ab ? ' data-ab="' + p.ab + '"' : "") + ' tabindex="0" role="button" aria-label="' + esc(p.title) + '"><title>' + esc(p.title) + "</title>" +
        '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h + '" rx="1.6"></rect>' +
        '<image href="flags/' + p.flag + '.svg" x="' + (bx + 1.4).toFixed(1) + '" y="' + (by + 1.5).toFixed(1) + '" width="8" height="6" preserveAspectRatio="xMidYMid slice"></image>' +
        '<text x="' + (bx + 11).toFixed(1) + '" y="' + (by + 6.9).toFixed(1) + '">' + esc(p.text) + "</text></g>";
    });
    var lab = (labels || []).map(function (l) { return '<text class="rlabel" x="' + l[0] + '" y="' + l[1] + '" text-anchor="middle">' + l[2] + "</text>"; }).join("");
    svg.innerHTML = out + leads + pinOut + lab;
  }
  var nm = function (zh, en) { return LANG === "en" ? en : zh; };
  var NS_OF = {};
  NSC.forEach(function (n) { if (n[1]) NS_OF[n[1]] = n; });
  var COVER_OF = { nz: "ACA", bd: "AIL", lk: "ACS", mn: "ACS", np: "ACS", tw: "PAP" };
  // 國家代碼導覽：國旗＋代碼＋英文國名＋中文國名；與地圖標記互相連動（data-map 指向對應的 svg）
  var NAV_OF = { "map-ns": "nav-ns", "map-sites": "nav-sites", "map-hsn": "nav-hsn", "map-intro": "ns-key" };
  function codeNav(el, items, svgId) {
    if (!el) return;
    el.setAttribute("data-map", svgId);
    el.innerHTML = items.map(function (it) {
      return '<button type="button" class="cn' + (it.cls ? " " + it.cls : "") + '" data-cc="' + (it.cc || "") + '" data-code="' + esc(it.code) + '"' + (it.ab ? ' data-ab="' + it.ab + '"' : "") + '>' +
        (it.cc ? flag(it.cc) : '<span class="flag none" aria-hidden="true"></span>') + "<b>" + esc(it.code) + '</b><span class="cn-en">' + esc(it.en) + '</span><span class="cn-zh">' + esc(it.zh) + "</span>" + (it.sub ? "<small>" + it.sub + "</small>" : "") + "</button>";
    }).join("");
  }
  function markCode(svgId, code, cc) {
    var svg = $(svgId), nav = $(NAV_OF[svgId]);
    var same = function (el) { return (code && el.getAttribute("data-code") === code) || (!code && cc && el.getAttribute("data-cc") === cc); };
    if (svg) $$(".pin", svg).forEach(function (g) { var on = same(g); g.classList.toggle("on", on); g.classList.toggle("focus", on); });
    if (nav) $$(".cn", nav).forEach(function (b) { b.classList.toggle("on", same(b)); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    var cn = t.closest ? t.closest(".code-nav .cn, .ns-key .cn") : null;
    if (cn) {
      var svgId = cn.parentElement.getAttribute("data-map");
      markCode(svgId, cn.getAttribute("data-code"), cn.getAttribute("data-cc"));
      var g = $(svgId) ? $$(".pin.on", $(svgId))[0] : null;
      if (g && g.scrollIntoView) g.scrollIntoView({ block: "nearest", inline: "center" });
      if (svgId === "map-sites") pickPin(cn.getAttribute("data-cc"));
      return;
    }
    var pin = t.closest ? t.closest(".map .pin[data-code], .wb-map .pin[data-code]") : null;
    if (pin) {
      var svg = pin.closest("svg");
      markCode(svg.id, pin.getAttribute("data-code"), pin.getAttribute("data-cc"));
      var nav = $(NAV_OF[svg.id]), card = nav ? $$(".cn.on", nav)[0] : null;
      if (card && card.scrollIntoView) card.scrollIntoView({ block: "nearest" });
    }
  });
  var WORLD_LABELS = [[225, 150, "PA"], [540, 215, "EMEA"], [790, 160, "ACCN"], [840, 300, "PAP"]];
  var HSNC = [
    ["HSNM", "my", "馬來西亞", "Malaysia", "est", "MYS"],
    ["HSNI", "id", "印尼", "Indonesia", "est", "IDN"],
    ["HSNV", "vn", "越南", "Vietnam", "est", "VNM"],
    ["HSNP", "ph", "菲律賓", "Philippines", "est", "PHL"],
    ["HSNT", "th", "泰國", "Thailand", "est", "THA"],
    ["HSN + India", "in", "印度", "India", "plan", "IND"],
    ["HSN + Australia", "au", "澳洲", "Australia", "plan", "AUS"],
    ["HSN + Japan", "jp", "日本", "Japan", "evalu", "JPN"]
  ];
  var HSN_ST = { est: ["已設立", "Established", "r-pap"], plan: ["規劃中", "Planned", "r-pa"], evalu: ["評估中", "Under evaluation", "r-emea"] };
  var HSN_ISO = {};
  HSNC.forEach(function (h) { HSN_ISO[h[5]] = HSN_ST[h[4]][2]; });
  var NS_ISO = { MYS: 1, AUS: 1, NZL: 1, IND: 1, THA: 1, IDN: 1, VNM: 1, JPN: 1, KOR: 1, PHL: 1 };

  function drawAllMaps() {
    var worldCls = function (iso) { return REGION[iso] || ""; };
    drawMap($("map-hero"), [0, 15, 1000, 410], worldCls, [], WORLD_LABELS);
    drawMap($("map-world"), [0, 15, 1000, 410], worldCls, [], WORLD_LABELS);
    drawOffices();
    drawIntro();
    if (typeof drawRegionKey === "function") drawRegionKey();
    var AP = [688, 100, 304, 278];
    drawMap($("map-sites"), AP, function (iso) { return INFRA.some(function (r) { return ISO[r[0]] === iso; }) ? "r-pap" : ""; },
      INFRA.map(function (r) {
        var parts = [["自有", "Own", r[3]], ["外包", "Outsourced", r[4]], ["ASP", "ASP", r[5]], ["Call Centre", "Call centre", r[6]], ["Parts Hub", "Parts hub", r[7]]]
          .filter(function (q) { return q[2] !== null; }).map(function (q) { return nm(q[0], q[1]) + " " + q[2]; }).join(" · ");
        var ns = NS_OF[r[0]];
        return { cc: r[0], flag: r[0], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: r.total, code: ns ? ns[0] : "", ab: ns ? ns[0].toLowerCase() : null, title: nm(r[1], r[2]) + "：" + r.total + "（" + parts + "）" };
      }));
    codeNav($("nav-sites"), INFRA.map(function (r) {
      var ns = NS_OF[r[0]], cov = COVER_OF[r[0]];
      return { cc: r[0], code: ns ? ns[0] : (cov ? cov : "—"), ab: ns ? ns[0].toLowerCase() : (cov ? cov.toLowerCase() : null), zh: r[1], en: r[2],
        sub: (ns ? "" : (cov ? nm("由 " + cov + " 代管", "Covered by " + cov) + " · " : nm("管轄單位未載明", "Responsible NS not specified") + " · ")) + r.total + " " + nm("處據點", r.total === 1 ? "site" : "sites"), cls: ns ? "" : "dim" };
    }), "map-sites");
    drawMap($("map-ns"), AP, function (iso) { return NS_ISO[iso] ? "r-pap" : (REGION[iso] === "r-pap" ? "r-pap2" : ""); },
      NSC.filter(function (n) { return n[1]; }).map(function (n) {
        var r = INFRA_BY[n[1]];
        return { cc: n[1], flag: n[1], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: n[0], code: n[0], ab: n[0].toLowerCase(), title: n[0] + " · " + nm(n[2], n[3]) };
      }));
    codeNav($("nav-ns"), NSC.map(function (n) {
      var subs = n[5].filter(function (x) { return x[0] === x[3]; }).map(function (x) { return nm(x[2], x[3]); });
      return { cc: n[1], code: n[0], ab: n[0].toLowerCase(), zh: n[1] ? n[2] : "未載明", en: n[1] ? n[3] : "Not specified", cls: n[1] ? "" : "dim",
        sub: n[0] === "AKC" ? nm("由 AJC 管理", "Managed by AJC") : (subs.length ? nm("代管：", "Covers: ") + subs.join(nm("、", ", ")) : "") };
    }), "map-ns");
    drawMap($("map-hsn"), AP, function (iso) { return HSN_ISO[iso] || ""; },
      HSNC.map(function (h) {
        var r = INFRA_BY[h[1]], st = HSN_ST[h[4]], ab = AB_BY[h[0].toLowerCase()] ? h[0].toLowerCase() : null;
        return { cc: h[1], flag: h[1], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: nm(h[2], h[3]), code: h[0], ab: ab, title: h[0] + " · " + nm(h[2], h[3]) + " · " + nm(st[0], st[1]) };
      }));
    codeNav($("nav-hsn"), HSNC.map(function (h) {
      var st = HSN_ST[h[4]];
      return { cc: h[1], code: h[0], ab: AB_BY[h[0].toLowerCase()] ? h[0].toLowerCase() : null, zh: h[2], en: h[3], sub: '<i class="st" style="background:var(--' + st[2] + ')"></i>' + nm(st[0], st[1]), cls: h[4] === "est" ? "" : "dim" };
    }), "map-hsn");
  }
  // 區域一覽：HQ → 四區，PAP 列出所轄國家／地區（代碼可點選）；語言切換時重畫
  function drawRegionKey() {
    var el = $("region-key");
    if (!el) return;
    var ab = function (id, txt) { return '<button type="button" class="ab" data-ab="' + id + '">' + txt + "</button>"; };
    var papList = INFRA.map(function (r) { return nm(r[1], r[2]); });
    var rows = [
      ["r-pa", ab("pa", "PA"), "Pan America", "泛美區", ""],
      ["r-emea", ab("emea", "EMEA"), "Europe, Middle East & Africa", "歐洲、中東與非洲", ""],
      ["r-pap", ab("pap", "PAP"), "Pan Asia Pacific", "泛亞太區", "= " + ab("twn", "TWN") + " " + nm("台灣區", "Taiwan") + " + " + ab("aap", "AAP") + " " + nm("亞太區", "Asia Pacific") + '<span class="rk-sub">' + nm("國家／地區（" + papList.length + "）：", "Countries and regions (" + papList.length + "): ") + papList.join(nm("、", ", ")) + "</span>"],
      ["r-accn", ab("accn", "ACCN"), "", "中國區", ""]
    ];
    el.innerHTML = '<div class="rk-root">' + ab("hq", "HQ") + " " + nm("總部", "Headquarters") + "</div><ul>" + rows.map(function (x) {
      return '<li><i style="background:var(--' + x[0] + ')"></i><span class="rk-code">' + x[1] + "</span> " + (x[2] ? '<span class="rk-en">' + x[2] + "</span> " : "") + '<span class="rk-zh">' + x[3] + "</span> " + x[4] + "</li>";
    }).join("") + "</ul>";
  }
  $$(".legend-regions").forEach(function (el) {
    el.innerHTML = [["r-pap", "PAP（TWN＋AAP）", "PAP (TWN + AAP)"], ["r-pa", "PA 泛美區", "PA · Pan America"], ["r-emea", "EMEA 歐洲、中東與非洲", "EMEA · Europe, Middle East & Africa"], ["r-accn", "ACCN 中國區", "ACCN · China"]]
      .map(function (l) { return '<span><i style="background:var(--' + l[0] + ')"></i>' + B(l[1], l[2]) + "</span>"; }).join("");
  });
  function pickPin(cc) {
    $$("#map-sites .pin").forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-cc") === cc); });
    $$("#nav-sites .cn").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-cc") === cc); });
    $$("#infra-body tr").forEach(function (tr) { tr.classList.toggle("on", tr.id === "row-" + cc); });
    var row = $("row-" + cc);
    if (row && row.scrollIntoView) row.scrollIntoView({ block: "nearest" });
  }
  $("map-sites").addEventListener("click", function (e) { var p = e.target.closest ? e.target.closest(".pin") : null; if (p) pickPin(p.getAttribute("data-cc")); });
  $("map-sites").addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var p = e.target.closest ? e.target.closest(".pin") : null; if (p) { e.preventDefault(); pickPin(p.getAttribute("data-cc")); }
  });

  /* ---------- 全球據點（Acer Around the World） ---------- */
  var OREG = [
    ["cn", "中國與台灣", "China & Taiwan", "r-accn"],
    ["emea", "歐洲、中東與非洲", "Europe, Middle East & Africa", "r-emea"],
    ["am", "美洲", "The Americas", "r-pa"],
    ["ap", "亞太", "Asia Pacific", "r-pap"]
  ];
  var OREG_BY = {};
  OREG.forEach(function (r) { OREG_BY[r[0]] = r; });
  var OROLE = {
    ghq: ["全球暨區域總部", "World & regional HQ"],
    rhq: ["區域總部", "Regional HQ"],
    ro: ["區域辦公室", "Regional office"],
    oro: ["大洋洲區域辦公室", "Oceania regional office"]
  };
  // [區域, 國旗, 中文, English, 角色, 公司, 地址, 電話, 傳真, 網站, 經度, 緯度, 子公司代碼, 地圖名稱（同國有兩處時區分）]
  var OFFICES = [
    ["cn", "tw", "台灣", "Taiwan", "ghq", "Acer Inc.", "8F, 88, Sec. 1, Xintai 5th Rd., Xizhi, New Taipei City 221, Taiwan", ["+886-2-2696-1234", "+886-2-2696-3131"], "+886-2-2696-3535", ["www.acer.com", "www.acer.com.tw"], 121.65, 25.06, ""],
    ["cn", "cn", "中國", "China", "rhq", "Acer Computer (Shanghai) Ltd.", "3F, Headquarters Building, No. 168, Xizang Middle Rd., Shanghai 200001, P.R. China", ["+86-21-5117-8999"], "+86-21-6352-8628", ["www.acer.com.cn"], 121.47, 31.23, ""],
    ["cn", "hk", "香港", "Hong Kong", "", "Acer Computer (Far East) Ltd.", "Unit 2301-02 & 08, Level 23, Tower 1, Millennium City 1, 388 Kwun Tong Rd., Kowloon, Hong Kong", ["+852-2821-0200"], "+852-2861-3758", ["www.acer.com.hk"], 114.22, 22.31, ""],

    ["emea", "ch", "瑞士", "Switzerland", "rhq", "Acer Europe SA", "Via della Posta 28, 6934 Bioggio, Switzerland", ["+41-(0)91-261-0111"], "+41-(0)91-261-0322", ["www.acer-euro.com"], 8.91, 46.01, "", ["瑞士（區域總部）", "Switzerland (regional HQ)"]],
    ["emea", "at", "奧地利", "Austria", "", "Acer Austria GmbH", "Europaring F14 202, 2345 Brunn am Gebirge, Austria", ["+43-2236-3075-200"], "+43-2236-3075-250", ["www.acer.at"], 16.29, 48.11, ""],
    ["emea", "nl", "比荷盧", "Benelux", "", "Acer Computer B.V.", "Europalaan 89, 5232 BC 's-Hertogenbosch, The Netherlands", ["+31-(0)73-645-9645"], "+31-(0)73-645-9693", ["www.acer.nl", "www.acer.be", "www.acer.lu"], 5.30, 51.69, ""],
    ["emea", "cz", "捷克", "Czech Republic", "", "Acer Czech Republic s.r.o.", "Na Hřebenech II 1718/10, 140 00 Praha 4, Czech Republic", ["+420-244-112-555"], "+420-244-112-599", ["www.acer.cz"], 14.42, 50.06, ""],
    ["emea", "dk", "丹麥", "Denmark", "", "Acer Denmark A/S", "Linde Allé 5B, 2850 Naerum, Denmark", ["+45-3916-8800"], "+45-3916-8801", ["www.acer.dk"], 12.53, 55.82, ""],
    ["emea", "de", "東歐", "Eastern Europe", "", "Acer Eastern Europe, Acer Computer GmbH", "Kornkamp 4, 22926 Ahrensburg, Germany", ["+49-4102-4880"], "+49-4102-488-270", [], 10.24, 53.67, ""],
    ["emea", "fi", "芬蘭", "Finland", "", "Acer Finland Oy", "Konalantie 47 C, 00390 Helsinki, Finland", ["+35-8922-526-90"], "+35-8922-526-916", ["www.acer.fi"], 24.94, 60.17, ""],
    ["emea", "fr", "法國", "France", "", "Acer Computer France SAS", "Parc des Reflets - Paris Nord 2, Bâtiment K, 165 Avenue du Bois de la Pie, BP 51301 Roissy en France, 95940 Roissy Charles de Gaulle Cedex, France", ["+33-1-48-635-151"], "+33-1-48-635-252", ["www.acer.fr"], 2.55, 49.00, ""],
    ["emea", "de", "德國", "Germany", "", "Acer Computer GmbH", "Kornkamp 4, 22926 Ahrensburg, Hamburg, Germany", ["+49-4102-4880"], "+49-4102-488-101", ["www.acer.de"], 10.24, 53.67, ""],
    ["emea", "hu", "匈牙利", "Hungary", "", "Acer Magyarorszag", "1023 Budapest, Árpád Fejedelem útja 26-28, Hungary", [], "+36-1-336-3309", ["www.acer.hu"], 19.04, 47.50, ""],
    ["emea", "it", "義大利", "Italy", "", "Acer Italy s.r.l", "Via Lepetit, 40, 20020 Lainate (MI), Italy", ["+39-02-939-921"], "+39-02-9399-2913", ["www.acer.it"], 9.03, 45.57, ""],
    ["emea", "no", "挪威", "Norway", "", "Acer Computer Norway AS", "Dølasletta 3, 3408 Tranby, Norway", ["+47-3284-3000"], "+47-3284-3001", ["www.acer.no"], 10.27, 59.78, ""],
    ["emea", "pl", "波蘭", "Poland", "", "Acer Polska", "ul. Domaniewska 41a, 02-672 Warszawa, Poland", ["+48-22-471-0600"], "+48-22-471-0700", ["www.acer.pl"], 21.01, 52.23, ""],
    ["emea", "ru", "俄羅斯", "Russia", "", "Acer Marketing Services LLC", "\"HI-TEC House\", 5A, Bolshaya Akademicheskaya str., Moscow, 127299, Russia", ["+7-495-212-2888"], "+7-495-212-2889", ["www.acer.ru"], 37.62, 55.75, ""],
    ["emea", "sk", "斯洛伐克", "Slovakia", "", "Acer Slovakia s.r.o.", "Trnavska cesta 50/B, 821 02 Bratislava, Slovakia", ["+421-2-4920-7000"], "+421-2-4920-7033", ["www.acer.sk"], 17.11, 48.15, ""],
    ["emea", "es", "西班牙／葡萄牙", "Spain / Portugal", "", "Acer Computer Ibérica", "Gavà Park, C/ Disseny, 3-5, 08850 Gavà, Barcelona, Spain", ["+34-93-492-2400"], "+34-93-492-2499", ["www.acer.es", "www.acer.pt"], 1.99, 41.31, ""],
    ["emea", "se", "瑞典", "Sweden", "", "Acer Sweden AB", "Mariehällsvägen 37B, SE-168 65 Bromma, Sweden", ["+46-(0)8-505-573-00"], "+46-(0)8-505-573-20", ["www.acercomputer.se"], 17.94, 59.34, ""],
    ["emea", "ch", "瑞士", "Switzerland", "", "Acer Computer (Switzerland) AG", "Moosmattstrasse 30, 8953 Dietikon, Switzerland", ["+41-(0)44-745-5858"], "+41-(0)44-742-0616", ["www.acer.ch"], 8.40, 47.40, ""],
    ["emea", "ua", "烏克蘭", "Ukraine", "", "Acer BSEC Inc.", "Business Center \"Forum Park Plaza\", 9 Moskovsky Ave., Office 4-404, Kiev 04073, Ukraine", ["+380-44-498-05-95"], "+380-44-498-05-97", ["www.acer.ua"], 30.52, 50.45, ""],
    ["emea", "gb", "英國", "United Kingdom", "", "Acer UK Ltd.", "Acer House, Heathrow Boulevard III, 282 Bath Road, West Drayton, Middlesex, UB7 0DQ, England", ["+44-(0)208-283-3000"], "+44-(0)208-283-3001", ["www.acer.co.uk"], -0.47, 51.50, ""],
    ["emea", "ae", "中東", "Middle East", "", "Acer Computer (M.E.) Ltd.", "P.O. Box 16951, Jebel Ali Free Zone, Dubai, UAE", ["+971-4-805-6000"], "+971-4-881-2200", ["www.acer.ae"], 55.03, 25.01, ""],
    ["emea", "tr", "土耳其", "Turkey", "", "Acer Bilişim Teknolojileri Ltd. Şirketi", "Veko Giz Plaza, Meydan Sokak No: 20, Daire: 27-28 34396, Maslak-Istanbul, Turkey", ["+90-212-290-2610"], "+90-212-290-2614", ["www.acer.com.tr"], 29.02, 41.11, ""],
    ["emea", "za", "非洲", "Africa", "", "Acer Africa (Pty) Ltd.", "Metropolitan Park, 82 Wessels Road, Rivonia, Sandton, Private Bag X28, Halfway House, 1685, South Africa", ["+27-11-233-6100"], "+27-11-233-6200", ["www.acer.co.za"], 28.06, -26.11, ""],

    ["am", "us", "美國", "United States", "rhq", "Acer America Corp.", "333 W. San Carlos Street, Suite 1500, San Jose, CA 95110, USA", ["+1-408-533-7700"], "+1-408-533-4555", ["www.acer.com/us"], -121.89, 37.34, ""],
    ["am", "br", "巴西", "Brazil", "", "AGP Tecnologia em Informática do Brasil Ltda", "Rua Flórida, 1758, 4º andar, São Paulo, SP 04565-001, Cidade Monções, Brasil", ["+55-11-5503-3588"], "+55-11-5503-3591", ["www.acer.com.br"], -46.63, -23.55, ""],
    ["am", "ca", "加拿大", "Canada", "", "Acer America Corp. (Canada)", "5600 Explorer Drive, Suite 201, Mississauga, Ontario, Canada L4W 4Y1", ["+1-905-755-7570"], "+1-905-755-7591", ["www.acer.ca"], -79.64, 43.59, ""],
    ["am", "us", "拉丁美洲", "Latin America", "ro", "Acer Latin America, Inc.", "3750 N.W. 87th Ave., Suite 640, Doral, FL 33178, USA", ["+1-305-392-7000"], "+1-305-477-5963", ["www.acer.com/latinoamerica"], -80.36, 25.82, ""],
    ["am", "mx", "墨西哥", "Mexico", "", "Acer Computec México, S.A. de C.V.", "Avenida Ejército Nacional No. 579, Piso 1, Col. Granada, 11520 México, D.F.", ["+52-55-5999-9400"], "+52-55-5999-9401", ["www.acer.com.mx"], -99.13, 19.43, ""],

    ["ap", "my", "馬來西亞", "Malaysia", "rhq", "Acer Sales & Services Sdn Bhd.", "Level 24, Menara Ambank, No. 8 Jalan Yap Kwan Seng, 50450 Kuala Lumpur, Malaysia", ["+60-3-2162-1388"], "+60-3-2162-4949", ["www.acer.com.my"], 101.69, 3.14, "ASSB"],
    ["ap", "au", "澳洲", "Australia", "oro", "Acer Computer Australia Pty. Ltd.", "8 Baywater Drive, Wentworth Point, NSW 2127, Australia", ["+61-2-8762-3000"], "+61-2-9764-2958", ["www.acer.com.au"], 151.07, -33.83, "ACA"],
    ["ap", "in", "印度", "India", "", "Acer India (Pvt) Ltd.", "Embassy Heights, 6th Floor, No. 13 Magrath Rd. (Next to Hosmat Hospital), Bangalore 560025, India", ["+91-80-3940-8700"], "+91-80-2532-9535", ["www.acer.co.in"], 77.59, 12.97, "AIL"],
    ["ap", "id", "印尼", "Indonesia", "", "PT Acer Indonesia", "The Plaza Office Tower, 42nd Floor, Jl. M.H. Thamrin Kav. 28-30, Jakarta 10350, Indonesia", ["+62-21-2992-2345"], "+62-21-2992-2346", ["www.acer.co.id"], 106.83, -6.19, "AIN"],
    ["ap", "jp", "日本", "Japan", "", "Acer Japan Corp.", "18F Nishi Shinjuku Mitsui Building, 6-24-1, Nishi Shinjuku, Shinjuku-ku, Tokyo, Japan, 160-0023", ["+81-3-5324-2788", "+81-3-5324-2789"], "+81-3-5324-2786", ["www.acer.co.jp"], 139.69, 35.69, "AJC"],
    ["ap", "kr", "韓國", "Korea", "", "Acer Asia Pacific", "No. 603 6F Chung-Jin B/D 53-5, Wonhyoro 3-ga, Yongsan-gu, Seoul, Korea", ["+82-1644-2225"], "+82-2-3775-1534", ["www.acer.co.kr"], 126.97, 37.54, "AKC"],
    ["ap", "nz", "紐西蘭", "New Zealand", "", "Acer Computer New Zealand Ltd.", "Suite 2, Ground Floor, Building A, Millenium Phase II, 600 Great South Road, Ellerslie, Auckland 1051, New Zealand", ["+64-9-969-5600"], "+64-9-526-5002", ["www.acer.co.nz"], 174.79, -36.88, "ACNZ"],
    ["ap", "ph", "菲律賓", "Philippines", "", "Acer Philippines, Inc.", "Unit A, B, C & F, Level 9, W Fifth Ave., Bonifacio Global City, Taguig City, 1634 Philippines", ["+632-815-3388"], "+632-815-4940", ["www.acer.com.ph"], 121.05, 14.55, "APHI"],
    ["ap", "sg", "新加坡", "Singapore", "", "Acer Computer (Singapore) Pte. Ltd.", "29 International Business Park, #01-01 Acer Building, Tower A, Singapore 609923", ["+65-6563-6563"], "+65-6567-6676", ["www.acer.com.sg"], 103.70, 1.33, "ACS"],
    ["ap", "th", "泰國", "Thailand", "", "Acer Computer Co., Ltd.", "191/62-63, 16th Floor, CTI Tower, Rachadapisek Rd., Klongtoey, Bangkok 10110, Thailand", ["+662-661-9700"], "+662-661-9721", ["www.acer.co.th"], 100.56, 13.72, "ATH"],
    ["ap", "vn", "越南", "Vietnam", "", "Acer Vietnam Co., Ltd.", "5th Floor, Rosana Building, 60 Nguyen Dinh Chieu St., Da Kao Ward, Dist. 1, Ho Chi Minh City, Vietnam", ["+848-3910-6888"], "+848-3910-1234", ["www.acer.com.vn"], 106.70, 10.78, "AVN"]
  ];
  var isHQ = function (o) { return o[4] === "ghq" || o[4] === "rhq"; };
  var OKPI = [
    [OFFICES.length, "據點", "Offices"],
    [OREG.length, "區域", "Regions"],
    [OFFICES.filter(isHQ).length, "總部（含全球總部）", "Headquarters (incl. world HQ)"],
    [OFFICES.filter(function (o) { return o[4] === "ro" || o[4] === "oro"; }).length, "區域辦公室", "Regional offices"]
  ];
  $("office-kpis").innerHTML = OKPI.map(function (k) { return '<div class="kpi"><div class="k">' + B(k[1], k[2]) + '</div><div class="v">' + k[0] + "</div></div>"; }).join("");
  $("office-legend").innerHTML = OREG.map(function (r) {
    return '<span><i style="background:var(--' + r[3] + ')"></i>' + B(r[1], r[2]) + "</span>";
  }).join("") + '<span><i class="hqdot"></i>' + B("大圓點：總部", "Large dot: headquarters") + "</span>";

  var oSel = -1, oReg = "all", oView = "world";
  // w：設計寬度（px），用來換算圓點與文字大小
  var OVIEW = {
    world: { vb: [0, 15, 1000, 410], w: 900, zh: "全球", en: "World" },
    eu: { vb: [461, 72, 172, 80], w: 900, zh: "歐洲", en: "Europe" },
    ap: { vb: [677, 118, 330, 272], w: 700, zh: "亞太", en: "Asia Pacific" }
  };
  var WORLD_NAMED = ["ae", "za", "in", "jp", "au", "nz"];
  // 地圖名稱：依序試放右、左、斜角、上、下，避開圓點與已放的名稱；放不下就拉遠並加引線
  function placeLabels(vb, k, dots, items) {
    var boxes = dots.map(function (p) { return { x: p.x - p.r, y: p.y - p.r, w: 2 * p.r, h: 2 * p.r }; });
    var pad = 2.5 * k, leads = "", texts = "", placed = [];
    var free = function (b) {
      if (b.x < vb[0] + pad || b.y < vb[1] + pad || b.x + b.w > vb[0] + vb[2] - pad || b.y + b.h > vb[1] + vb[3] - pad) return false;
      return !boxes.some(function (c) { return b.x < c.x + c.w + pad && b.x + b.w + pad > c.x && b.y < c.y + c.h + pad && b.y + b.h + pad > c.y; });
    };
    var DIRS = [[1, 0], [-1, 0], [.7, -.7], [.7, .7], [-.7, -.7], [-.7, .7], [0, -1], [0, 1]];
    items.forEach(function (p) {
      var w = (labelW(p.name) + 6 + (p.flag ? 11 : 0)) * k, h = 16 * k, pick = null;
      [0, 14, 30, 50, 74].some(function (d) {
        var g = p.r + (4 + d) * k;
        return DIRS.some(function (dir) {
          var cx = p.x + dir[0] * g, cy = p.y + dir[1] * g;
          var b = { x: dir[0] > 0 ? cx : dir[0] < 0 ? cx - w : cx - w / 2, y: dir[1] > 0 ? cy : dir[1] < 0 ? cy - h : cy - h / 2, w: w, h: h };
          if (free(b)) { pick = b; pick.d = d; return true; }
          return false;
        });
      });
      if (!pick) pick = { x: p.x + p.r + 4 * k, y: p.y - h / 2, w: w, h: h, d: 0 };
      boxes.push(pick);
      placed.push({ item: p, box: pick, w: w, h: h });
      if (pick.d) {
        var ex = Math.max(pick.x, Math.min(p.x, pick.x + w)), ey = Math.max(pick.y, Math.min(p.y, pick.y + h));
        leads += '<line class="olead" x1="' + p.x.toFixed(1) + '" y1="' + p.y.toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '" style="stroke-width:' + k.toFixed(2) + '"></line>';
      }
      texts += '<text class="' + p.cls + '"' + (p.attrs || "") + ' x="' + (pick.x + w / 2).toFixed(1) + '" y="' + (pick.y + h * .74).toFixed(1) + '" text-anchor="middle" style="font-size:' + (12.5 * k).toFixed(2) + "px;stroke-width:" + (3.4 * k).toFixed(2) + 'px">' + esc(p.name) + "</text>";
    });
    return { leads: leads, texts: texts, placed: placed };
  }
  function labelW(s) { var w = 0; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); w += /[⺀-鿿＀-￯]/.test(c) ? 12.4 : /[A-Z]/.test(c) ? 8.4 : c === " " ? 3.6 : 6.8; } return w; }
  function drawOffices() {
    var svg = $("map-offices"), v = OVIEW[oView], vb = v.vb, k = vb[2] / v.w;
    if (!svg || !window.PAP_WORLD) return;
    svg.setAttribute("viewBox", vb.join(" "));
    svg.style.maxWidth = oView === "ap" ? v.w + "px" : "";
    drawMap(svg, vb, function () { return ""; }, [], []);
    var inView = function (x, y) { return x > vb[0] && x < vb[0] + vb[2] && y > vb[1] && y < vb[1] + vb[3]; };
    var pts = OFFICES.map(function (o, i) {
      var hq = isHQ(o);
      return { i: i, o: o, hq: hq, x: px(o[10]), y: py(o[11]), r: (hq ? 7 : 4.6) * k };
    }).filter(function (p) { return inView(p.x, p.y); });
    var named = pts.filter(function (p) { return oView !== "world" || p.hq || p.o[0] === "am" || WORLD_NAMED.indexOf(p.o[1]) !== -1; });
    // 總部先放，其次是附近據點較多者
    named.forEach(function (p) { p.near = pts.filter(function (q) { return Math.abs(q.x - p.x) < 40 * k && Math.abs(q.y - p.y) < 40 * k; }).length; });
    named.sort(function (a, b) { return (b.hq - a.hq) || (b.near - a.near) || (a.i - b.i); });
    var lay = placeLabels(vb, k, pts, named.map(function (p) {
      return { x: p.x, y: p.y, r: p.r, flag: p.o[1], i: p.i, hq: p.hq, name: p.o[13] ? nm(p.o[13][0], p.o[13][1]) : nm(p.o[2], p.o[3]), cls: "olabel", attrs: "" };
    }));
    // 標籤改為與其他地圖相同之樣式：白底圓角框、國旗、名稱
    var pinsOut = lay.placed.map(function (q) {
      var b = q.box, it = q.item, fh = 7 * k, fw = 9.4 * k;
      return '<g class="pin opin' + (it.hq ? " hq" : "") + (it.i === oSel ? " on" : "") + '" data-i="' + it.i + '" tabindex="0" role="button">' +
        '<rect x="' + b.x.toFixed(1) + '" y="' + b.y.toFixed(1) + '" width="' + q.w.toFixed(1) + '" height="' + q.h.toFixed(1) + '" rx="' + (2.5 * k).toFixed(2) + '" style="stroke-width:' + (0.8 * k).toFixed(2) + '"></rect>' +
        '<image href="flags/' + it.flag + '.svg" x="' + (b.x + 2.2 * k).toFixed(1) + '" y="' + (b.y + (q.h - fh) / 2).toFixed(1) + '" width="' + fw.toFixed(1) + '" height="' + fh.toFixed(1) + '" preserveAspectRatio="xMidYMid slice"></image>' +
        '<text x="' + (b.x + 13.5 * k).toFixed(1) + '" y="' + (b.y + q.h * .72).toFixed(1) + '" style="font-size:' + (11.5 * k).toFixed(2) + 'px">' + esc(it.name) + "</text></g>";
    }).join("");
    var dots = pts.sort(function (a, b) { return a.hq - b.hq; }).map(function (p) {
      var t = nm(p.o[2], p.o[3]) + " · " + p.o[5];
      return '<circle class="odot' + (p.hq ? " hq" : "") + (p.i === oSel ? " on" : "") + '" data-i="' + p.i + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + p.r.toFixed(2) + '" style="fill:var(--' + OREG_BY[p.o[0]][3] + ');stroke-width:' + ((p.hq ? 1.8 : 1.2) * k).toFixed(2) + '" tabindex="0" role="button" aria-label="' + esc(t) + '"><title>' + esc(t) + "</title></circle>";
    }).join("");
    svg.insertAdjacentHTML("beforeend", lay.leads + dots + pinsOut);
  }
  $("office-views").innerHTML = Object.keys(OVIEW).map(function (key) {
    return '<button class="btn sm' + (key === oView ? " active" : "") + '" type="button" data-view="' + key + '">' + B(OVIEW[key].zh, OVIEW[key].en) + "</button>";
  }).join("");
  $("office-views").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-view]") : null;
    if (!b) return;
    oView = b.getAttribute("data-view");
    $$("#office-views .btn").forEach(function (x) { x.classList.toggle("active", x === b); });
    drawOffices();
  });
  function officeCard(o, i) {
    var reg = OREG_BY[o[0]], role = OROLE[o[4]];
    var tels = o[7].map(function (t, k) {
      return "<span>" + (k === 1 && o[1] === "jp" ? B("電話（業務）", "Tel (sales)") : B("電話", "Tel")) + "</span><span>" + esc(t) + "</span>";
    }).join("");
    return '<article class="office' + (i === oSel ? " on" : "") + '" id="office-' + i + '" style="--oc:var(--' + reg[3] + ')">' +
      '<div class="office-head"><b>' + flag(o[1]) + B(o[2], o[3]) + '</b><span class="office-tags">' +
      (role ? '<span class="rtag">' + B(role[0], role[1]) + "</span>" : "") +
      (o[12] ? '<span class="nstag" title="' + esc(nm("子公司代碼", "Subsidiary code")) + '">' + o[12] + "</span>" : "") + "</span></div>" +
      '<div class="office-name">' + esc(o[5]) + "</div>" +
      '<div class="office-addr">' + esc(o[6]) + "</div>" +
      '<div class="office-contact">' + tels + "<span>" + B("傳真", "Fax") + "</span><span>" + esc(o[8]) + "</span></div>" +
      (o[9].length ? '<div class="office-web"><span class="k">' + B("網站", "Web") + "</span>" + o[9].map(function (w) { return '<a href="https://' + w + '" target="_blank" rel="noopener">' + w.replace(/^www\./, "") + "</a>"; }).join('<span class="sep">·</span>') + "</div>" : "") +
      "</article>";
  }
  function renderOffices() {
    var q = $("office-search").value.trim().toLowerCase(), n = 0, html = "";
    $$("#office-regions .btn").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-reg") === oReg); });
    OREG.forEach(function (r) {
      if (oReg !== "all" && oReg !== r[0]) return;
      var items = [];
      OFFICES.forEach(function (o, i) {
        if (o[0] !== r[0]) return;
        if (q && [o[2], o[3], o[5], o[6], o[12], o[4] ? OROLE[o[4]].join(" ") : ""].join(" ").toLowerCase().indexOf(q) === -1) return;
        items.push(officeCard(o, i));
      });
      if (!items.length) return;
      n += items.length;
      html += '<section class="office-group"><h3><i style="background:var(--' + r[3] + ')"></i>' + B(r[1], r[2]) + ' <span class="count">' + items.length + '</span></h3><div class="office-grid">' + items.join("") + "</div></section>";
    });
    $("office-list").innerHTML = html || '<p class="ab-empty">' + B("查無「" + esc(q) + "」相關據點。", 'No offices match "' + esc(q) + '".') + "</p>";
    $("office-count").innerHTML = B("共 " + n + " 處據點", n + (n === 1 ? " office" : " offices"));
  }
  $("office-regions").innerHTML = [["all", "全部", "All", OFFICES.length]].concat(OREG.map(function (r) {
    return [r[0], r[1], r[2], OFFICES.filter(function (o) { return o[0] === r[0]; }).length];
  })).map(function (r) {
    return '<button class="btn sm" type="button" data-reg="' + r[0] + '">' + B(r[1], r[2]) + " · " + r[3] + "</button>";
  }).join("");
  $("office-regions").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-reg]") : null;
    if (!b) return;
    oReg = b.getAttribute("data-reg");
    renderOffices();
  });
  $("office-search").addEventListener("input", renderOffices);
  function pickOffice(i) {
    oSel = i;
    var o = OFFICES[i];
    if (oReg !== "all" && oReg !== o[0]) oReg = "all";
    $("office-search").value = "";
    renderOffices();
    $$("#map-offices .odot, #map-offices .opin").forEach(function (d) { d.classList.toggle("on", +d.getAttribute("data-i") === i); });
    var card = $("office-" + i);
    if (card && card.scrollIntoView) card.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  $("map-offices").addEventListener("click", function (e) {
    var d = e.target.closest ? e.target.closest(".odot, .opin") : null;
    if (d) pickOffice(+d.getAttribute("data-i"));
  });
  $("map-offices").addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var d = e.target.closest ? e.target.closest(".odot, .opin") : null;
    if (d) { e.preventDefault(); pickOffice(+d.getAttribute("data-i")); }
  });
  renderOffices();

  /* ---------- 網站介紹 ---------- */
  var CH = {
    overview: ["定位、涵蓋區域與重點數據", "Role, coverage and key figures"],
    corp: ["企業架構圖、宏碁與其集團公司、ODM 代工廠、服務夥伴與資料查證", "Architecture chart, Acer and its group companies, ODM manufacturers, service partners and verification"],
    org: ["全球區域與據點、PAP 組織、服務據點、倉庫與標案", "Regions and offices, PAP organisation, service sites, warehouses and tenders"],
    ops: ["採購角色、職能、系統、SPL 流程、Service BOM、規劃模式與料號規則", "Purchasing role, functions, systems, SPL flow, Service BOM, planning modes and part numbers"],
    hsn: ["Highpoint Service Network（海柏特）概要與 2026/12/1 起之流程調整", "Highpoint Service Network overview and the process change effective 1 Dec 2026"],
    ref: ["產業名詞、區域與子公司代碼、縮寫說明", "Industry terms, region and subsidiary codes, abbreviations"],
    review: ["18 題重點複習", "18 review questions"]
  };
  var nSubs = 0;
  NAV.forEach(function (p) { nSubs += p.subs.length; });
  $("toc-sum").innerHTML = "";
  var FC = ["var(--navy)", "var(--accent)", "var(--primary)", "var(--sel)", "var(--r-pa)"];
  $("chapters").innerHTML = NAV.filter(function (p) { return !p.home; }).map(function (p, i) {
    var d = CH[p.id], n = (p.num < 10 ? "0" : "") + p.num;
    var row = function (go, num, label) {
      return '<li><button type="button" data-go="' + go + '">' + (num ? '<span class="n">' + num + "</span>" : "") + '<span class="t">' + label + '</span><span class="dots"></span><span class="go" aria-hidden="true">→</span></button></li>';
    };
    return '<article class="folder" style="--fc:' + FC[i % FC.length] + '"><span class="ftab">' + n + '</span><span class="fbig" aria-hidden="true">' + n + "</span>" +
      '<button type="button" class="ftitle" data-go="' + p.id + '">' + B(p.zh, p.en) + "</button><p>" + B(d[0], d[1]) + "</p><ol>" +
      (p.subs.length ? p.subs.map(function (s) { return row(s[0], s.num, B(s[1], s[2])); }).join("") : row(p.id, "", B("單頁，直接閱讀", "Single page"))) + "</ol></article>";
  }).join("");
  $$("[data-ico]").forEach(function (el) { el.innerHTML = ico(el.getAttribute("data-ico")); });
  // 首頁背景：淡色世界地圖
  // 首頁地圖：PAP（台灣）至各國子公司的供應路線；標籤含國旗，沿線有移動的小點
  function drawIntro() {
    var svg = $("map-intro"), vb = [688, 100, 304, 278], k = vb[2] / 520;
    if (!svg || !window.PAP_WORLD) return;
    var tw = INFRA_BY.tw, ox = px(tw[8]), oy = py(tw[9]);
    var ns = NSC.filter(function (n) { return n[1] && INFRA_BY[n[1]]; });
    var pins = ns.map(function (n) {
      var r = INFRA_BY[n[1]];
      return { cc: n[1], flag: n[1], lon: r[8], lat: r[9], lx: r[10], ly: r[11], text: n[0], code: n[0], ab: n[0].toLowerCase(), title: n[0] + " · " + nm(n[2], n[3]) };
    });
    pins.unshift({ cc: "pap", flag: "tw", lon: tw[8], lat: tw[9], lx: tw[10], ly: tw[11], text: "PAP", code: "PAP", ab: "pap", title: "PAP · " + nm("泛亞太區 · 台灣", "Pan Asia Pacific · Taiwan") });
    drawMap(svg, vb, function (iso) { return NS_ISO[iso] ? "r-pap" : (REGION[iso] === "r-pap" ? "r-pap2" : ""); }, pins, []);
    var motion = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var arcs = "", movers = "";
    ns.forEach(function (n, j) {
      var r = INFRA_BY[n[1]], x = px(r[8]), y = py(r[9]), dx = x - ox, dy = y - oy;
      var cx = (ox + x) / 2 - dy * .22, cy = (oy + y) / 2 + dx * .22;
      var d = "M" + ox.toFixed(1) + " " + oy.toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1);
      arcs += '<path class="arc" d="' + d + '" style="stroke-width:' + (1.4 * k).toFixed(2) + ";stroke-dasharray:" + (4 * k).toFixed(2) + " " + (3 * k).toFixed(2) + '"></path>';
      if (motion) movers += '<circle class="mover" r="' + (2.6 * k).toFixed(2) + '"><animateMotion dur="' + (6 + (j % 4)) + 's" begin="-' + (j * 1.3).toFixed(1) + 's" repeatCount="indefinite" path="' + d + '"></animateMotion></circle>';
    });
    var hq = '<circle class="pulse" cx="' + ox.toFixed(1) + '" cy="' + oy.toFixed(1) + '" r="' + (16 * k).toFixed(2) + '"></circle>' +
      '<circle class="idot hq" cx="' + ox.toFixed(1) + '" cy="' + oy.toFixed(1) + '" r="' + (5 * k).toFixed(2) + '" style="stroke-width:' + (1.4 * k).toFixed(2) + '"></circle>';
    var first = svg.querySelector(".pin");
    if (first) first.insertAdjacentHTML("beforebegin", arcs + hq + movers); else svg.insertAdjacentHTML("beforeend", arcs + hq + movers);
    codeNav($("ns-key"), ns.map(function (n) {
      return { cc: n[1], code: n[0], ab: n[0].toLowerCase(), zh: n[2], en: n[3] };
    }), "map-intro");
  }

  /* ---------- 總覽 ---------- */
  var STATS = [[11, "國家子公司（NS）", "Nation subsidiaries (NS)"], [20, "設有據點之國家／地區", "Countries and regions with sites"], [507, "授權服務商（ASP）", "Authorized service providers"], [5, "HSN Group 公司", "HSN Group companies"]];
  $("hero-stats").innerHTML = STATS.map(function (s) { return "<div><b>" + s[0] + "</b><span>" + B(s[1], s[2]) + "</span></div>"; }).join("");
  /* ---------- 作業 ---------- */
  var SYS = [["RO", "Regional Office", "區域辦公室", 1, 1, 1, 1], ["NS", "Nation Subsidiary", "國家子公司", 1, 0, 1, 1], ["ASP", "Authorized Service Provider", "授權服務商", 1, 0, 0, 1]];
  $("sys-body").innerHTML = SYS.map(function (s) {
    return "<tr><td><b>" + s[0] + '</b> <span class="caption">' + B(s[2], s[1]) + "</span></td>" + [3, 4, 5, 6].map(function (i) { return '<td class="c">' + mark(s[i]) + "</td>"; }).join("") + "</tr>";
  }).join("");
  var CATS = ["ACCESSORY", "BOARD", "CABLE", "CASE/COVER/BRACKET ASSEMBLY", "CPU/PROCESSOR", "COMMUNICATION MODULE", "DVD-RW DRIVE", "HDD/HARD DISK DRIVE",
    "HEATSINK", "KEYBOARD", "MAINBOARD", "MEMORY", "POINTING DEVICE", "POWER SUPPLY", "SCREW", "SPEAKER", "ADAPTER", "BATTERY",
    "TOUCHPAD", "MISCELLANEOUS", "LCD MODULE", "LCD", "FAN", "CAMERA"];
  $("cats").innerHTML = CATS.map(function (c) { return "<div>" + esc(c) + "</div>"; }).join("");


  /* ---------- 料號 ---------- */
  var RO = { S: "AAP", C: "ACCN", E: "EMEA", A: "PA", T: "TWN" };
  var CC = {
    M: ["ASSB", "馬來西亞", "Malaysia"], A: ["ACA", "澳洲", "Australia"], S: ["ACS", "新加坡", "Singapore"], I: ["AIL", "印度", "India"],
    T: ["ATH", "泰國", "Thailand"], N: ["AIN", "印尼", "Indonesia"], D: ["AIN", "印尼", "Indonesia"], J: ["AJC / AKC", "日本／韓國", "Japan / Korea"],
    P: ["APHI", "菲律賓", "Philippines"], V: ["AVN", "越南", "Vietnam"]
  };
  $("map-ro").innerHTML = Object.keys(RO).map(function (k) { return "<div><b>" + k + "</b><span>" + RO[k] + "</span></div>"; }).join("");
  $("map-cc").innerHTML = [["M"], ["A"], ["S"], ["I"], ["T"], ["N", "D"], ["J"], ["P"], ["V"]].map(function (ks) {
    var v = CC[ks[0]];
    return "<div><b>" + ks.join("/") + "</b><span>" + v[0] + ' <span class="caption">' + B(v[1], v[2]) + "</span></span></div>";
  }).join("");

  var CCB = "CASE/COVER/BRACKET ASSEMBLY", FS = "FAN SINK/SPEAKER/EARPHONE/RTC";
  // [AA, Sub-Category, Category, Product group, 原表標示列, e-Mobility]
  var SUB = [
    ["19", "INVERTER BOARD", "Board", "Y1"], ["54", "COMMUNICATION BOARD", "Board", "Y1"], ["55", "BOARD", "Board", "Y1"],
    ["6M", "AV MODULE", "Board", "Y1"], ["6M", "DVI MODULE", "Board", "Y1"], ["6M", "TUNER MODULE", "Board", "Y1"],
    ["20", "CONNECTOR", CCB, "Y2"], ["22", "PCMCIA SLOT", CCB, "Y2"], ["33", "METAL", CCB, "Y2"],
    ["40", "NAME PLATE", CCB, "Y2"], ["42", "PLASTICS", CCB, "Y2"], ["47", "MISCELLANEOUS", CCB, "Y2"],
    ["58", "Light module", CCB, "Y2", 1], ["60", "ASSEMBLY", CCB, "Y2"], ["61", "LCD COVER", CCB, "Y2", 1],
    ["62", "LCD BEZEL", CCB, "Y2", 1], ["63", "UPPER CASE", CCB, "Y2", 1], ["64", "LOWER CASE", CCB, "Y2", 1],
    ["65", "Cover others", CCB, "Y2", 1], ["66", "Chassis", CCB, "Y2", 1], ["67", "Stand", CCB, "Y2", 1],
    ["68", "Stylus", CCB, "Y2", 1], ["6B", "KB ASSEMBLY", "KB ASSEMBLY", "YB"],
    ["6P", "UPPER CASE WITH TOUCHPAD", "TOUCHPAD ASSEMBLY", "YP"], ["6M", "HOUSING", CCB, "Y2"],
    ["23", "FAN", FS, "Y3"], ["23", "SPEAKER/MICROPHONE", FS, "Y3"], ["23", "RTC BATTERY", FS, "Y3"], ["24", "THERMAL", FS, "Y3"],
    ["25", "AC ADAPTER", "AC ADAPTER", "Y4"], ["25", "REMOTE CONTROLLER", "REMOTE CONTROLLER", "Y5"],
    ["27", "POWER CORD", "CABLE", "Y6"], ["50", "CABLE", "CABLE", "Y6"], ["56", "TOUCHPAD", "POINT DEVICE", "Y7"],
    ["57", "OPTICAL DEVICE", "OPTICAL DEVICE", "Y8"], ["57", "Camera", "OPTICAL DEVICE", "Y8"], ["86", "SCREW", "SCREW", "Y9"],
    ["6K", "KIT SET", "ACCESSORY", "YA"], ["6M", "LCD MODULE", "LCD MODULE", "YD"], ["6M", "ODD MODULE", "ODD MODULE", "YE"],
    ["70", "OT_AC ADAPTER", "AC ADAPTER", "Y4", 1, 1], ["70", "OT_Battery", "Battery", "YT", 1, 1],
    ["71", "OT_MOTOR", "MOTOR", "YM", 1, 1], ["71", "OT_CONTROLLER", "CONTROLLER", "YC", 1, 1],
    ["72", "OT_TIRE", CCB, "Y2", 1, 1], ["72", "OT_ME ASSEMBLY", CCB, "Y2", 1, 1], ["72", "OT_LED", CCB, "Y2", 1, 1],
    ["73", "OT_BRAKE SYSTEM", CCB, "Y2", 1, 1], ["74", "OT_CABLE", "CABLE", "Y6", 1, 1],
    ["75", "OT_MISCELLANEOUS", CCB, "Y2", 1, 1], ["75", "OT_SCREW", "SCREW", "Y9", 1, 1]
  ];
  function renderCats() {
    var q = $("cat-search").value.trim().toLowerCase(), emob = $("cat-emob").checked;
    var list = SUB.filter(function (s) {
      if (!emob && s[5]) return false;
      return !q || (s[0] + " " + s[1] + " " + s[2] + " " + s[3]).toLowerCase().indexOf(q) !== -1;
    });
    $("cat-body").innerHTML = list.length ? list.map(function (s) {
      return "<tr" + (s[4] ? ' class="hl"' : "") + '><td class="code"><b>' + s[0] + "</b></td><td>" + esc(s[1]) + (s[5] ? '<span class="emob">e-Mobility</span>' : "") +
        "</td><td>" + esc(s[2]) + '</td><td><span class="pg">' + s[3] + "</span></td></tr>";
    }).join("") : '<tr><td colspan="4" class="caption">' + B("查無符合「" + esc(q) + "」之子類別。", 'No sub-category matches "' + esc(q) + '".') + "</td></tr>";
    $("cat-count").innerHTML = B(list.length + " / " + SUB.length + " 筆", list.length + " of " + SUB.length);
  }
  $("cat-search").addEventListener("input", renderCats);
  $("cat-emob").addEventListener("change", renderCats);
  renderCats();

  function decode() {
    var raw = $("pn-input").value.toUpperCase().replace(/\s+/g, "");
    var m = raw.match(/^([A-Z0-9]{2})\.?([A-Z0-9]{3})([A-Z0-9])([A-Z0-9])\.?([A-Z0-9]{3})$/);
    var out = $("dec-out"), err = $("dec-err");
    if (!m) {
      out.innerHTML = "";
      err.hidden = false;
      err.innerHTML = raw
        ? B("格式應為 AA.BBBCD.EEE，共 10 碼（小數點可省略），例如 DG.B88SA.001。", "Format: AA.BBBCD.EEE, 10 characters (dots optional), e.g. DG.B88SA.001.")
        : B("請輸入料號，例如 DG.B88SA.001。", "Enter a part number, e.g. DG.B88SA.001.");
      return;
    }
    err.hidden = true;
    var aa = m[1], c = m[3], d = m[4];
    var hits = SUB.filter(function (s) { return s[0] === aa; });
    var aaM = hits.length ? hits.map(function (s) { return esc(s[1]); }).join(", ") : NA(esc(aa) + " 未列於對照表", esc(aa) + " is not listed");
    var roM = RO[c] ? RO[c] : NA(esc(c) + " 未列於代碼表", esc(c) + " is not listed");
    var ccM;
    if (c !== "S") ccM = RO[c] ? B("國別代碼僅適用於 AAP", "Country codes apply to AAP only") : "—";
    else ccM = CC[d] ? CC[d][0] + " " + B("（" + CC[d][1] + "）", "(" + CC[d][2] + ")") : NA(esc(d) + " 未列於 AAP 國別代碼", esc(d) + " is not an AAP country code");
    var na = NA("未載明", "Not specified");
    var cells = [
      [aa, B("AA · 子類別", "AA · sub-category"), aaM, 0],
      [m[2], "BBB", na, 0],
      [c, B("C · 第 6 碼 · RO", "C · 6th · RO"), roM, 1],
      [d, B("D · 第 7 碼 · 國別", "D · 7th · country"), ccM, 1],
      [m[5], "EEE", na, 0]
    ];
    out.innerHTML = cells.map(function (x) {
      return '<div class="dc' + (x[3] ? " hot" : "") + '"><span class="v">' + esc(x[0]) + '</span><span class="k">' + x[1] + '</span><span class="m">' + x[2] + "</span></div>";
    }).join("");
  }
  $("pn-input").addEventListener("input", decode);
  $$("[data-pn]").forEach(function (b) {
    b.addEventListener("click", function () { $("pn-input").value = b.getAttribute("data-pn"); decode(); });
  });
  decode();

  /* ---------- 縮寫 ---------- */
  // 來源：m = 取自教材；s = 業界通用；n = 全稱未載明；k = 內部補充說明
  var SRC = {
    m: ["教材", "Deck", "取自教材", "From the training deck"],
    s: ["通用", "Standard", "業界通用縮寫", "Standard industry abbreviation"],
    n: ["未載明", "Not specified", "全稱未載明", "Full name not specified"],
    k: ["補充", "Supplementary", "內部補充說明", "Internal supplementary information"],
    p: ["公開資料", "Public", "取自公開資料", "From public sources"]
  };
  var CATS_AB = [
    ["org", "Acer 組織與區域代碼", "Acer organisation and region codes"],
    ["role", "職務與角色", "Roles and titles"],
    ["site", "服務據點類型", "Service site types"],
    ["sys", "PAP 使用的系統", "Systems PAP uses"],
    ["part", "料件、BOM 與料號", "Parts, BOM and part numbers"],
    ["flow", "流程與參與單位", "Processes and the units involved"],
    ["ops", "採購與營運指標", "Purchasing and operations"],
    ["term", "一般名詞", "General terms"]
  ];
  // [id, 內文中要標示的字, 顯示名稱, 全稱, 中文名稱, 來源, 分類, 中文說明, English, English 名稱（無全稱時）]
  var AB = [
    {"id":"hq","keys":["HQ"],"code":"HQ","full":"Headquarters","zh":"總部","en":null,"src":"s","cat":"org","dzh":"Acer 總部，轄下設有 PA、EMEA、TWN、AAP、ACCN 等區域。PAP 彙整各 NS 之需求預測與特殊支援需求後提交 HQ。","den":"Acer headquarters, overseeing PA, EMEA, TWN, AAP and ACCN. PAP consolidates demand forecasts and special support requests from the NS and submits them to HQ.","cc":null,"region":null,"org":"Acer Inc.","urls":[{"t":"Headquarters","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Headquarters"},{"t":"內部教材 第 2 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"pa","keys":["PA"],"code":"PA","full":"Pan America","zh":"泛美區","en":null,"src":"s","cat":"org","dzh":"Acer 美洲區域，與 EMEA、TWN、AAP、ACCN 同屬 HQ 轄下。料號第 6 碼 A 代表 PA。","den":"Acer's Americas region, alongside EMEA, TWN, AAP and ACCN under HQ. A as the 6th character of a part number denotes PA.","cc":null,"region":"PA","org":"Acer Inc.","urls":[{"t":"Acer 4Q23 investor presentation（區域劃分）","p":"Acer · 2024","u":"https://images.acer.com/is/content/acer/Acer%204Q23%20Investor%20presentation-Engpdf"},{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""},{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"emea","keys":["EMEA"],"code":"EMEA","full":"Europe, Middle East & Africa","zh":"歐洲、中東與非洲區","en":null,"src":"s","cat":"org","dzh":"Acer 歐洲、中東與非洲區域。料號第 6 碼 E 代表 EMEA。","den":"Acer's Europe, Middle East and Africa region. E as the 6th character of a part number denotes EMEA.","cc":null,"region":"EMEA","org":"Acer Inc.","urls":[{"t":"Acer announces EMEA management changes","p":"PCR · 2014-07-11","u":"https://pcr-online.biz/2014/07/11/acer-announces-emea-management-changes/"},{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""},{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"accn","keys":["ACCN"],"code":"ACCN","full":null,"zh":"中國區","en":"China region","src":"m","cat":"org","dzh":"中國區，與 PAP 同屬 HQ 轄下，獨立運作。料號第 6 碼 C 代表 ACCN。","den":"China region, a peer of PAP under HQ that operates independently. C as the 6th character of a part number denotes ACCN.","cc":"cn","region":"ACCN","org":"Acer Inc.","urls":[{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"pap","keys":["PAP"],"code":"PAP","full":"Pan Asia Pacific","zh":"泛亞太區","en":null,"src":"s","cat":"org","dzh":"泛亞太區，由 TWN 與 AAP 於 2016/2017 年整併而成，為區域辦公室（RO），轄下設有 11 個國家子公司（NS）。PAP 服務物流負責備品規劃與採購、中央倉庫管理、RMA 與各 NS 績效監控；向 ODM 採購的料件自 2026 年 12 月 1 日起改經由 HSN Group 供應。與 AAP 的差別：AAP 是整併前的亞太區（不含台灣），PAP 是整併後涵蓋台灣與亞太的現行區域；PAP 本身沒有料號代碼，料號第 6 碼沿用 AAP 的 S 與 TWN 的 T。","den":"Pan Asia Pacific, formed in 2016/2017 by merging TWN and AAP; it is the regional office (RO) with 11 nation subsidiaries (NS) under it. PAP service logistics covers spare-parts planning and purchasing, central warehouse management, RMA and NS performance monitoring; from 1 December 2026 the parts it buys from the ODM are supplied through HSN Group. Difference from AAP: AAP was the pre-merger Asia Pacific region without Taiwan, while PAP is the current merged region covering Taiwan and Asia Pacific. PAP has no part-number code of its own; the 6th character keeps AAP's S and TWN's T.","cc":null,"region":"PAP","org":"Acer Inc. · PAP regional office (RO)","urls":[{"t":"Acer announces EMEA management changes（Pan-Asia Pacific formed）","p":"PCR · 2014-07-11","u":"https://pcr-online.biz/2014/07/11/acer-announces-emea-management-changes/"},{"t":"Andrew Hou · Management","p":"Acer","u":"https://www.acer.com/corporate/en/overview/management/andrew-hou"},{"t":"內部教材 第 2–3 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""},{"t":"內部教材 第 2–3 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"verified"},
    {"id":"twn","keys":["TWN"],"code":"TWN","full":"Taiwan","zh":"台灣區","en":null,"src":"s","cat":"org","dzh":"台灣區，2016/2017 年與 AAP 整併為 PAP。料號第 6 碼 T 代表 TWN；第 7 碼 T 則代表泰國（ATH）。","den":"Taiwan region, merged with AAP into PAP in 2016/2017. T as the 6th character denotes TWN; as the 7th character, T denotes Thailand (ATH).","cc":"tw","region":"TWN","org":"Acer Inc.","urls":[{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"aap","keys":["AAP"],"code":"AAP","full":null,"zh":"亞太區","en":"Asia Pacific","src":"m","cat":"org","dzh":"亞太區（Asia Pacific）。整併前五個區域之一，涵蓋台灣以外的亞太各國，與台灣區（TWN）並列；2016/2017 年與 TWN 整併為 PAP。整併後 AAP 的代碼仍用於料號第 6 碼（S），第 7 碼國別代碼適用於 AAP 各國。與 PAP 的差別：AAP 是整併前的亞太區（不含台灣），PAP 是整併後的現行區域。縮寫原文教材未載明；據點表中韓國辦公室的公司名稱為 Acer Asia Pacific。","den":"The Asia Pacific region: one of the five regions before the merger, covering the Asia Pacific countries other than Taiwan, alongside the Taiwan region (TWN); merged with TWN into PAP in 2016/2017. Its code lives on as the 6th character of part numbers (S), and the 7th-character country codes apply to the AAP countries. Difference from PAP: AAP is the pre-merger region without Taiwan, PAP the current merged region. The expansion of the abbreviation is not given in the material; the Korea office is listed under the company name Acer Asia Pacific.","cc":null,"region":"AAP","org":"Acer Inc.","urls":[{"t":"內部教材 第 2、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"ns","keys":["NS"],"code":"NS","full":"Nation Subsidiary","zh":"國家子公司","en":null,"src":"m","cat":"org","dzh":"PAP 轄下之各國子公司，例如 ACA（澳洲）、AIL（印度）。PAP 監控各 NS 之績效（502/503 aging、庫存、採購、達交、HFP），並彙整其需求與特殊支援需求提交 HQ。NS 使用 PLM、GLS、CSS。","den":"A subsidiary in one country under PAP, such as ACA (Australia) or AIL (India). PAP monitors NS performance (502/503 aging, inventory, purchase, fulfillment, HFP) and consolidates their demand and special support requests for HQ. NS use PLM, GLS and CSS.","cc":null,"region":null,"org":"Acer nation subsidiaries (NS)","urls":[{"t":"內部教材 第 3 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"assb","keys":["ASSB","ASSSB"],"code":"ASSB","full":null,"zh":"馬來西亞國家子公司","en":"Malaysia subsidiary","src":"m","cat":"org","dzh":"馬來西亞國家子公司，HSNM 隸屬其下。2016/2017 年以前為主導子公司；當時馬來西亞由海柏特與 Acer 共同營運。料號國別代碼 M；設有倉庫及 Uni-load。","den":"The Malaysia subsidiary, with HSNM under it. It was the lead subsidiary before 2016/2017, when Malaysia was operated jointly by HSN (Highpoint Service Network) and Acer. Country code M; has a warehouse and Uni-load.","cc":"my","region":"PAP","org":"Acer Sales & Services Sdn Bhd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"aca","keys":["ACA"],"code":"ACA","full":null,"zh":"澳洲國家子公司","en":"Australia subsidiary","src":"m","cat":"org","dzh":"澳洲國家子公司，ACNZ（紐西蘭）隸屬其下。料號國別代碼 A（例：DG.B88SA.001）；設有倉庫及 Uni-load。","den":"The Australia subsidiary, with ACNZ (New Zealand) under it. Country code A (e.g. DG.B88SA.001); has a warehouse and Uni-load.","cc":"au","region":"PAP","org":"Acer Computer Australia Pty. Ltd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"acnz","keys":["ACNZ"],"code":"ACNZ","full":null,"zh":"紐西蘭子公司","en":"New Zealand subsidiary","src":"m","cat":"org","dzh":"紐西蘭子公司，隸屬 ACA，未設獨立料號國別代碼。設有倉庫，未設 Uni-load。","den":"The New Zealand subsidiary, under ACA, without a separate country code. Has a warehouse but no Uni-load.","cc":"nz","region":"PAP","org":"Acer Computer New Zealand Ltd.","urls":[{"t":"內部教材 第 3–4 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ail","keys":["AIL"],"code":"AIL","full":null,"zh":"印度國家子公司","en":"India subsidiary","src":"m","cat":"org","dzh":"印度國家子公司，Bangladesh（孟加拉）隸屬其下。料號國別代碼 I。印度為 PAP 據點最多之國家，包括 172 個外包服務中心及 126 個 ASP；設有倉庫及 Uni-load。","den":"The India subsidiary, with Bangladesh under it. Country code I. India has the most PAP sites, including 172 outsourced service centres and 126 ASPs; it has a warehouse and Uni-load.","cc":"in","region":"PAP","org":"Acer India (Pvt) Ltd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ath","keys":["ATH"],"code":"ATH","full":null,"zh":"泰國國家子公司","en":"Thailand subsidiary","src":"m","cat":"org","dzh":"泰國國家子公司，Indo-china（中南半島）隸屬其下。料號國別代碼 T（第 6 碼 T 則為 TWN）。設有 12 個自有服務中心及 109 個 ASP，並設有倉庫及 Uni-load。","den":"The Thailand subsidiary, with Indo-china under it. Country code T (as the 6th character, T denotes TWN). It has 12 own service centres, 109 ASPs, a warehouse and Uni-load.","cc":"th","region":"PAP","org":"Acer Computer Co., Ltd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ain","keys":["AIN"],"code":"AIN","full":null,"zh":"印尼國家子公司","en":"Indonesia subsidiary","src":"m","cat":"org","dzh":"印尼國家子公司，倉庫表列為 AIN (AMI)。料號國別代碼 N 或 D，為唯一具兩個國別代碼之國家；設有倉庫及 Uni-load。","den":"The Indonesia subsidiary, listed as AIN (AMI) in the warehouse table. Country code N or D, the only country with two codes; it has a warehouse and Uni-load.","cc":"id","region":"PAP","org":"PT Acer Indonesia","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ami","keys":["AMI"],"code":"AMI","full":null,"zh":"印尼 Uni-load 組裝廠","en":"Indonesian Uni-load assembly company","src":"k","cat":"org","dzh":"印尼 Uni-load 組裝廠之公司代碼，倉庫表列為 Indonesia (AIN) (AMI)。","den":"Code for the Indonesian Uni-load assembly company, listed as Indonesia (AIN) (AMI) in the warehouse table.","cc":"id","region":"PAP","org":"AIN (Indonesia)","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"avn","keys":["AVN"],"code":"AVN","full":null,"zh":"越南國家子公司","en":"Vietnam subsidiary","src":"m","cat":"org","dzh":"越南國家子公司，料號國別代碼 V；設有倉庫，未設 Uni-load。","den":"The Vietnam subsidiary. Country code V; it has a warehouse but no Uni-load.","cc":"vn","region":"PAP","org":"Acer Vietnam Co., Ltd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ajc","keys":["AJC"],"code":"AJC","full":null,"zh":"日本國家子公司","en":"Japan subsidiary","src":"m","cat":"org","dzh":"日本國家子公司，料號國別代碼 J，並負責管理 AKC（韓國）；設有倉庫，未設 Uni-load。","den":"The Japan subsidiary. Country code J; it also manages AKC (Korea). It has a warehouse but no Uni-load.","cc":"jp","region":"PAP","org":"Acer Japan Corp.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"akc","keys":["AKC"],"code":"AKC","full":null,"zh":"韓國國家子公司","en":"Korea subsidiary","src":"m","cat":"org","dzh":"韓國國家子公司，由 AJC（日本）管理，料號國別代碼同為 J；設有倉庫，未設 Uni-load。","den":"The Korea subsidiary, managed by AJC (Japan) and sharing country code J. It has a warehouse but no Uni-load.","cc":"kr","region":"PAP","org":"Acer Asia Pacific (Korea office)","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"afe","keys":["AFE"],"code":"AFE","full":null,"zh":"國家子公司","en":"Nation subsidiary","src":"m","cat":"org","dzh":"PAP 國家子公司之一，所屬國家未載明，亦未列於倉庫表與料號國別代碼表。","den":"One of the PAP subsidiaries. Its country is not specified, and it is not in the warehouse table or the country-code list.","cc":null,"region":"PAP","org":"Acer PAP","urls":[{"t":"內部教材 第 3 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"aphi","keys":["APHI"],"code":"APHI","full":null,"zh":"菲律賓國家子公司","en":"Philippines subsidiary","src":"m","cat":"org","dzh":"菲律賓國家子公司，料號國別代碼 P；設有倉庫，未設 Uni-load。","den":"The Philippines subsidiary. Country code P; it has a warehouse but no Uni-load.","cc":"ph","region":"PAP","org":"Acer Philippines, Inc.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"acs","keys":["ACS"],"code":"ACS","full":null,"zh":"新加坡國家子公司","en":"Singapore subsidiary","src":"m","cat":"org","dzh":"新加坡國家子公司，Sri Lanka、Mongolia、Nepal 隸屬其下。料號國別代碼 S（第 6 碼 S 則為 AAP）；設有倉庫及 Uni-load。","den":"The Singapore subsidiary, with Sri Lanka, Mongolia and Nepal under it. Country code S (as the 6th character, S denotes AAP); it has a warehouse and Uni-load.","cc":"sg","region":"PAP","org":"Acer Computer (Singapore) Pte. Ltd.","urls":[{"t":"內部教材 第 3–4、14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"hsn","keys":["HSN","海柏特"],"code":"HSN","full":"Highpoint Service Network","zh":"海柏特集團","en":null,"src":"p","cat":"org","dzh":"HSN 為 Highpoint Service Network 之縮寫，中文名稱海柏特；HSN Group 指海柏特及其各國公司。源自宏碁於 1999 年在馬來西亞成立之售後服務子公司，2018 年於台灣成立，為多品牌授權維修服務商，提供保固外（OOW）售後維修服務，包括主機板維修；於各國設立公司，服務範圍涵蓋 Acer 及其他品牌。自 2026 年 12 月 1 日起，PAP 採購之料件改經由 HSN Group 供應。","den":"HSN stands for Highpoint Service Network (Chinese name 海柏特); HSN Group means HSN and its country companies. It grew out of Acer's after-sales subsidiary set up in Malaysia in 1999 and was established in Taiwan in 2018 as a multi-brand authorised repair provider, offering out-of-warranty (OOW) after-sales repair, including mainboard repair. It has companies in each country and serves Acer and other brands. From 1 December 2026, parts purchased by PAP are supplied through HSN Group.","cc":"tw","region":null,"org":"Highpoint Service Network（海柏特）","urls":[{"t":"Acer unit HSN to list (founded 14 Sep 2018)","p":"Taipei Times · 2025-11-27","u":"https://www.taipeitimes.com/News/biz/archives/2025/11/27/2003847885"},{"t":"海柏特上櫃掛牌","p":"工商時報 · 2025-12-17","u":"https://www.ctee.com.tw/news/20251217700532-430201"},{"t":"Highpoint Service Network","p":"Acer Malaysia","u":"https://www.acer.com/my-en/support/service-network/highpoint-service-network"}],"vs":"verified"},
    {"id":"hsnm","keys":["HSNM"],"code":"HSNM","full":null,"zh":"HSN Group 馬來西亞公司","en":"HSN Group, Malaysia","src":"k","cat":"org","dzh":"HSN Group（Highpoint Service Network）馬來西亞公司，隸屬 ASSB。代碼由 HSN 加國別字母 M（Malaysia）組成。","den":"HSN Group (Highpoint Service Network) company in Malaysia, under ASSB. The code is HSN plus the country letter M.","cc":"my","region":"PAP","org":"HSN Group · Malaysia","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"hsni","keys":["HSNI"],"code":"HSNI","full":null,"zh":"HSN Group 印尼公司","en":"HSN Group, Indonesia","src":"k","cat":"org","dzh":"HSN Group（Highpoint Service Network）印尼公司。代碼由 HSN 加國別字母 I（Indonesia）組成。","den":"HSN Group (Highpoint Service Network) company in Indonesia. The code is HSN plus the country letter I.","cc":"id","region":"PAP","org":"HSN Group · Indonesia","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"hsnv","keys":["HSNV"],"code":"HSNV","full":null,"zh":"HSN Group 越南公司","en":"HSN Group, Vietnam","src":"k","cat":"org","dzh":"HSN Group（Highpoint Service Network）越南公司。代碼由 HSN 加國別字母 V（Vietnam）組成。","den":"HSN Group (Highpoint Service Network) company in Vietnam. The code is HSN plus the country letter V.","cc":"vn","region":"PAP","org":"HSN Group · Vietnam","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"hsnp","keys":["HSNP"],"code":"HSNP","full":null,"zh":"HSN Group 菲律賓公司","en":"HSN Group, Philippines","src":"k","cat":"org","dzh":"HSN Group（Highpoint Service Network）菲律賓公司。代碼由 HSN 加國別字母 P（Philippines）組成。","den":"HSN Group (Highpoint Service Network) company in Philippines. The code is HSN plus the country letter P.","cc":"ph","region":"PAP","org":"HSN Group · Philippines","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"hsnt","keys":["HSNT"],"code":"HSNT","full":null,"zh":"HSN Group 泰國公司","en":"HSN Group, Thailand","src":"k","cat":"org","dzh":"HSN Group（Highpoint Service Network）泰國公司。代碼由 HSN 加國別字母 T（Thailand）組成。","den":"HSN Group (Highpoint Service Network) company in Thailand. The code is HSN plus the country letter T.","cc":"th","region":"PAP","org":"HSN Group · Thailand","urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"ro","keys":["RO"],"code":"RO","full":"Regional Office","zh":"區域辦公室","en":null,"src":"m","cat":"role","dzh":"區域辦公室。PAP 團隊即為 RO，負責採購作業。RO 使用 PLM、PLS、GLS、CSS 四套系統，PLS 僅供 RO 使用。SPL 定義流程最終將 SPL 發布予各 RO；料號第 6 碼即為 RO 代碼。五個 RO 於 2010 年以前各自獨立運作。","den":"Regional office. The PAP team is the RO and handles purchasing. ROs use PLM, PLS, GLS and CSS, and only ROs use PLS. The SPL flow ends with SPL release to all ROs, and the 6th character of a part number is the RO code. The five ROs operated independently before 2010.","cc":null,"region":null,"org":"PAP","urls":[{"t":"內部教材 第 3、16 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"gm","keys":["GM"],"code":"GM","full":"General Manager","zh":"總經理","en":null,"src":"s","cat":"role","dzh":"總經理。PAP 之 GM 為 Andrew Hou；Jacky Lin 兼任 HSN Group GM。","den":"General manager. PAP's GM is Andrew Hou; Jacky Lin also serves as GM of HSN Group.","cc":null,"region":null,"org":null,"urls":[{"t":"General manager","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/General_manager"}],"vs":"standard"},
    {"id":"avp","keys":["AVP"],"code":"AVP","full":"Assistant Vice President","zh":"協理","en":null,"src":"s","cat":"role","dzh":"協理。Jacky Lin 為 Service 部門 AVP，並兼任 HSN Group GM。","den":"Assistant vice president. Jacky Lin is AVP of Service and also GM of HSN Group.","cc":null,"region":null,"org":null,"urls":[{"t":"Vice president","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Vice_president"}],"vs":"standard"},
    {"id":"csd","keys":["CSD"],"code":"CSD","full":null,"zh":"","en":null,"src":"n","cat":"role","dzh":"「CSD Q2 2025 Infrastructure」之統計單位，負責彙整各國服務據點。","den":"The unit behind the CSD Q2 2025 Infrastructure figures for service sites by country.","cc":null,"region":null,"org":"Acer","urls":[{"t":"內部教材 第 5、11 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"asp","keys":["ASP"],"code":"ASP","full":"Authorized Service Provider","zh":"授權服務商","en":null,"src":"m","cat":"site","dzh":"經 Acer 授權之外部服務商，不具維修能力，提供收件（收機）服務。Q2 2025 PAP 全區共 507 家，以印度 126 家、泰國 109 家、印尼 91 家最多。ASP 使用 PLM 與 CSS。","den":"An external provider authorised by Acer that takes in units but does not repair them. PAP had 507 in Q2 2025, led by India (126), Thailand (109) and Indonesia (91). ASPs use PLM and CSS.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 5 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"wh","keys":["W/H"],"code":"W/H","full":"Warehouse","zh":"倉庫","en":null,"src":"s","cat":"site","dzh":"倉庫。PAP 11 國均設有倉庫；中央倉庫管理（Central W/H management）為 PAP 主要職能之一。","den":"Warehouse. All 11 PAP countries have one, and central warehouse management is one of PAP's main functions.","cc":null,"region":null,"org":null,"urls":[{"t":"Warehouse","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Warehouse"},{"t":"內部教材 第 4、9 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"uniload","keys":["Uni-load","Uni-Load"],"code":"Uni-load","full":null,"zh":"當地產線／組裝廠","en":"Local production line / assembly plant","src":"m","cat":"site","dzh":"於當地設有產線或組裝廠，主要用於滿足當地客戶（如標案）之規格與成本要求，例如澳洲向 ODM 採購半成品，並於當地採購 SSD、HDD 進行組裝。設有 Uni-load 之國家：澳洲、印度、馬來西亞、泰國、印尼、新加坡；印尼組裝廠代碼為 AMI。","den":"A local production line or assembly plant, mainly used to meet local customers' specifications and costs (e.g. tenders). Australia, for example, buys semi-finished parts from the ODM and assembles them with locally sourced SSDs and HDDs. Australia, India, Malaysia, Thailand, Indonesia and Singapore have Uni-load; the Indonesian assembly company is AMI.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 4 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"callc","keys":["Call Centre"],"code":"Call Centre","full":null,"zh":"客服中心","en":"Customer service phone centre","src":"m","cat":"site","dzh":"客戶服務電話中心。Q2 2025 PAP 全區共 8 處：印度、泰國、印尼、台灣、越南、日本、韓國、菲律賓各 1 處。","den":"Customer service phone centre. PAP had 8 in Q2 2025, one each in India, Thailand, Indonesia, Taiwan, Vietnam, Japan, Korea and the Philippines.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 5 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"lph","keys":["Local Parts Hub"],"code":"Local Parts Hub","full":null,"zh":"當地備品中心","en":"Local parts hub","src":"m","cat":"site","dzh":"各國之零件總倉，負責存放備品；各據點另設有庫房。Q2 2025 PAP 全區共 18 處，以台灣 7 處最多。","den":"Each country's main parts warehouse, with storerooms at each site. PAP had 18 in Q2 2025, the most in Taiwan (7).","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 5 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"rsph","keys":["Regional Spare Parts Hub","Regional Spared Part Hub"],"code":"Regional Spare Parts Hub","full":null,"zh":"區域備品中心","en":"Regional spare parts hub","src":"m","cat":"site","dzh":"服務整個區域之備品中心，PAP 全區共 1 處。","den":"A spare-parts hub serving the whole region; PAP has one.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 5 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"tender","keys":["標案"],"code":"Tender","full":null,"zh":"採購招標","en":"Procurement tender","src":"k","cat":"site","dzh":"政府機關或企業之採購招標。客戶（如警政單位）發布標書（規格書），各品牌依規格投標；得標後委託 ODM 生產，必要時於當地組裝（Uni-load）以符合標案價格。例如 ACA 之標案規模達兩萬台筆電。","den":"Public or corporate procurement. The customer (e.g. the police) issues a tender with a specification and brands bid against it; the winner has an ODM build the product, assembling locally (Uni-load) where needed to meet the tender price. One ACA tender, for example, covered 20,000 notebooks.","cc":null,"region":null,"org":null,"urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"plm","keys":["PLM"],"code":"PLM","full":"Product Lifecycle Management","zh":"產品生命週期管理系統","en":null,"src":"s","cat":"sys","dzh":"負責料件與 BOM 管理：為新料件申請料號、將 Service BOM 及新增料件匯入 Service PLM。RO、NS、ASP 皆使用。","den":"Manages parts and BOMs: applying for P/Ns for new items and importing the Service BOM and new parts into Service PLM. Used by ROs, NS and ASPs.","cc":null,"region":null,"org":null,"urls":[{"t":"Product lifecycle","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Product_lifecycle"},{"t":"內部教材 第 16–17 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"pls","keys":["PLS"],"code":"PLS","full":null,"zh":"","en":null,"src":"n","cat":"sys","dzh":"用於向 ODM 確認採購單（Confirm PO to ODM），僅供 RO 使用。","den":"Used to confirm POs to the ODM; used by ROs only.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 16、18 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"gls","keys":["GLS"],"code":"GLS","full":null,"zh":"","en":null,"src":"n","cat":"sys","dzh":"用於中央備品規劃（Central SP Planning），RO 與 NS 使用。","den":"Used for central spare-parts planning; used by ROs and NS.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 16、19 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"css","keys":["CSS"],"code":"CSS","full":null,"zh":"","en":null,"src":"n","cat":"sys","dzh":"用於建立採購單（Create PO）；502/503 aging 所列不良品滯留於 CSS。RO、NS、ASP 皆使用。","den":"Used to create POs; defective parts counted in 502/503 aging are held in CSS. Used by ROs, NS and ASPs.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 16、20 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"fru","keys":["FRU"],"code":"FRU","full":"Field Replaceable Unit","zh":"現場可更換單元","en":null,"src":"s","cat":"part","dzh":"可於維修現場直接更換之料件單位，例如鍵盤、螢幕模組。B 樣品完成後召開 FRU 審查會議；NPI 階段由 ODM 提供 FRU 清單草稿，審查後建立 Acer 料號。","den":"A part that can be replaced on site, such as a keyboard or LCD module. A FRU review meeting follows the B sample; for NPI the ODM drafts the FRU list, which is reviewed before Acer P/Ns are created.","cc":null,"region":null,"org":null,"urls":[{"t":"Field-replaceable unit","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Field-replaceable_unit"},{"t":"內部教材 第 11–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"spl","keys":["SPL"],"code":"SPL","full":"Spare Parts List","zh":"備品清單","en":null,"src":"m","cat":"part","dzh":"各機種可供售後維修使用之備品料件清單，列出料號與價格，為各區備品規劃與採購之依據。流程：ODM 提供未含價格之 SPL 草稿 → 為新料件申請料號 → ODM 報價 → Markup Review → 上傳 SPL 系統 → 於 FCS 前一週發布予各 RO。","den":"The list of spare parts available for after-sales repair of each model, with P/Ns and prices; the basis for regional spare-parts planning and purchasing. Flow: the ODM drafts the SPL without prices → P/Ns are applied for new items → the ODM quotes → markup review → upload to the SPL system → release to all ROs one week before FCS.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 10–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"sp","keys":["S/P","SP"],"code":"S/P · SP","full":"Spare Parts","zh":"備品","en":null,"src":"m","cat":"part","dzh":"維修用備品。相關項目包括 S/P Introduction、SP planning & Ordering（備品規劃與下單）、Central SP Planning（中央備品規劃）及 SP template。","den":"Spare parts for repairs. Related items include S/P Introduction, SP planning & ordering, central SP planning and the SP template.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7、10 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"bom","keys":["BOM"],"code":"BOM","full":"Bill of Materials","zh":"物料清單","en":null,"src":"s","cat":"part","dzh":"產品組成料件之清單。Service BOM 為維修用版本，分為 NPI 與 MP 兩類，各有其 SOP。","den":"The list of parts that make up a product. The Service BOM is the service version, in NPI and MP types, each with its own SOP.","cc":null,"region":null,"org":null,"urls":[{"t":"Bill of materials","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Bill_of_materials"},{"t":"內部教材 第 13、15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"pn","keys":["P/N"],"code":"P/N","full":"Part Number","zh":"料號","en":null,"src":"s","cat":"part","dzh":"料件編號。Acer 料號格式為 AA.BBBCD.EEE：AA 為子類別代碼；字元位置不計小數點，第 6 碼為 RO 代碼，第 7 碼為國別代碼。","den":"Part number. Acer P/Ns follow AA.BBBCD.EEE: AA is the sub-category code; not counting dots, the 6th character is the RO code and the 7th the country code.","cc":null,"region":null,"org":null,"urls":[{"t":"Part number","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Part_number"},{"t":"內部教材 第 14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"mb","keys":["MB"],"code":"MB","full":"Mainboard","zh":"主機板","en":null,"src":"s","cat":"part","dzh":"主機板。HQ/PM 於 FRU 審查會議提供 MB/KB P/N（主機板與鍵盤料號）。","den":"Mainboard. HQ/PM provides MB/KB P/Ns (mainboard and keyboard part numbers) for the FRU review meeting.","cc":null,"region":null,"org":null,"urls":[{"t":"Motherboard","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Motherboard"},{"t":"內部教材 第 11–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"kb","keys":["KB"],"code":"KB","full":"Keyboard","zh":"鍵盤","en":null,"src":"s","cat":"part","dzh":"鍵盤。HQ/PM 於 FRU 審查會議提供 MB/KB P/N；子類別 6B 為 KB ASSEMBLY。","den":"Keyboard. HQ/PM provides MB/KB P/Ns for the FRU review meeting; sub-category 6B is KB ASSEMBLY.","cc":null,"region":null,"org":null,"urls":[{"t":"Computer keyboard","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Computer_keyboard"},{"t":"內部教材 第 11–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"sku","keys":["SKU"],"code":"SKU","full":"Stock Keeping Unit","zh":"庫存單位","en":null,"src":"s","cat":"part","dzh":"各銷售配置之編號。Service BOM SOP 1.2／2.2 須檢查 AVLC 與 SKU BOM。","den":"The code for each sales configuration. Service BOM SOP 1.2 and 2.2 check AVLC and the SKU BOM.","cc":null,"region":null,"org":null,"urls":[{"t":"Stock keeping unit","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Stock_keeping_unit"},{"t":"內部教材 第 15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"avlc","keys":["AVLC"],"code":"AVLC","full":null,"zh":"","en":null,"src":"n","cat":"part","dzh":"Service BOM SOP 1.2／2.2「AVLC & SKU BOM Checking」之檢查項目，並由 HQ/PM 提供予 FRU 審查會議。業界 AVL 一般指 Approved Vendor List（合格供應商清單）。","den":"Checked in Service BOM SOP 1.2 and 2.2 (AVLC & SKU BOM Checking) and provided by HQ/PM for the FRU review meeting. In the industry, AVL generally means Approved Vendor List.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 11–12、15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"moq","keys":["MOQ"],"code":"MOQ","full":"Minimum Order Quantity","zh":"最小訂購量","en":null,"src":"s","cat":"part","dzh":"供應商可接受之最小訂購數量。Service BOM SOP 1.3／2.3 須審查 MOQ／RMA 建議。","den":"The smallest order quantity a supplier accepts. Service BOM SOP 1.3 and 2.3 review the MOQ/RMA suggestions.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 15、23–25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"bs","keys":["B/S"],"code":"B/S","full":null,"zh":"","en":null,"src":"n","cat":"part","dzh":"見於 SOP 1.4「Price Review – B/S & general parts markup %」，與一般料件分別審核 markup %。","den":"Appears in SOP 1.4 (Price Review – B/S & general parts markup %), where its markup % is reviewed separately from general parts.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"npi","keys":["NPI"],"code":"NPI","full":"New Product Introduction","zh":"新產品導入","en":null,"src":"s","cat":"part","dzh":"新機種導入階段。NPI Service BOM：FRU 會議後由 ODM 提供 FRU 清單草稿，審查後於 Service BOM 建立 Acer P/N，並將 NPI SPL（DT SPL、NB SPL）發布予各 RO。","den":"The new-model introduction phase. For the NPI Service BOM, the ODM drafts the FRU list after the FRU meeting, Acer P/Ns are created after review, and the NPI SPL (DT and NB) is released to all ROs.","cc":null,"region":null,"org":null,"urls":[{"t":"New product development","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/New_product_development"},{"t":"內部教材 第 13、22 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"mp","keys":["MP"],"code":"MP","full":"Mass Production","zh":"量產","en":null,"src":"s","cat":"part","dzh":"量產階段。MP Service BOM 由 ODM 每月定期更新，SOP 涵蓋料號審查、替代料檢查與維護、新增料件匯入 PLM 及價格維護。","den":"The mass-production phase. The ODM updates the MP Service BOM monthly; its SOP covers P/N review, substitute parts, importing new parts into PLM and price maintenance.","cc":null,"region":null,"org":null,"urls":[{"t":"Mass production","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Mass_production"},{"t":"內部教材 第 13、23 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"dt","keys":["DT"],"code":"DT","full":"Desktop","zh":"桌上型電腦","en":null,"src":"s","cat":"part","dzh":"桌上型電腦。相關項目包括 DT Demand Report（桌機需求報表）及 DT SPL。","den":"Desktop computers. Related items include the DT Demand Report and the DT SPL.","cc":null,"region":null,"org":null,"urls":[{"t":"Desktop computer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Desktop_computer"},{"t":"內部教材 第 7 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"nb","keys":["NB"],"code":"NB","full":"Notebook","zh":"筆記型電腦","en":null,"src":"s","cat":"part","dzh":"筆記型電腦。相關項目包括 NB NPI 之 BML、AML、PPB1/2 需求報表及 NB SPL。","den":"Notebook computers. Related items include the NB NPI demand reports (BML, AML, PPB1/2) and the NB SPL.","cc":null,"region":null,"org":null,"urls":[{"t":"Laptop","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Laptop"},{"t":"內部教材 第 7 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"bml","keys":["BML"],"code":"BML","full":"Before Mass Lock","zh":"量產鎖定前","en":null,"src":"m","cat":"part","dzh":"New Proactive（筆記型電腦）規劃模式之階段：量產鎖定前，每月 15 日提出 A、B、C 類料件之需求報表，備品於下單後 10 個工作天出貨。","den":"A stage of the New Proactive (notebook) planning mode: before Mass Lock, the demand report for A, B and C parts is submitted on the 15th of each month and spare parts ship 10 working days after the PO.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7、22–24 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"aml","keys":["AML"],"code":"AML","full":"After Mass Lock","zh":"量產鎖定後","en":null,"src":"m","cat":"part","dzh":"New Proactive 規劃模式之階段，於量產鎖定（ML）後 2 個月：所有料件仍可向 ODM 採購，C 類料件於此時最後採購（LTB），MOQ 與價格沿用 BML。","den":"A New Proactive stage two months after Mass Lock (ML): all parts can still be bought from the ODM, C parts are placed on last-time buy (LTB), and MOQ and price follow BML.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7、22–24 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"ppb","keys":["PPB1/2","PPB1","PPB2","PPB"],"code":"PPB1/2","full":"Post Production Buy 1 / 2","zh":"停產後採購 1／2","en":null,"src":"m","cat":"part","dzh":"New Proactive 規劃模式之停產後採購階段：PPB1 於 EOL 後 3 個月（AML + 6 個月）最後採購 B 類料件，PPB2 於 EOL 後 9 個月最後採購 A 類料件；MOQ 與價格重新議定，ODM 依 6 個月排程分批供貨。","den":"The post-production buy stages of the New Proactive mode: PPB1, three months after EOL (AML + 6 months), is the last-time buy of B parts; PPB2, nine months after EOL, is the last-time buy of A parts. MOQ and price are renegotiated and the ODM supplies in partial 6-month schedules.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7、22–24 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"odm","keys":["ODM"],"code":"ODM","full":"Original Design Manufacturer","zh":"委託設計製造商","en":null,"src":"s","cat":"flow","dzh":"為 Acer 設計與生產產品之代工廠，例如仁寶（Compal）。SPL 流程中負責 B 樣品、SPL 草稿及報價，並每月更新 MP Service BOM。PAP 透過 PLS 向 ODM 確認採購單，採購整機或料件後供應予各 NS。","den":"The contract manufacturer that designs and builds products for Acer, such as Compal. In the SPL flow it provides the B sample, the SPL draft and the quotation, and it updates the MP Service BOM monthly. PAP confirms POs to the ODM in PLS and supplies the purchased units and parts to the NS.","cc":null,"region":null,"org":"e.g. Compal (仁寶)","urls":[{"t":"Original design manufacturer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Original_design_manufacturer"},{"t":"內部教材 第 7、11–13 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"compal","keys":["仁寶","Compal"],"code":"Compal","full":"Compal Electronics, Inc.","zh":"仁寶電腦","en":null,"src":"p","cat":"flow","dzh":"仁寶電腦工業股份有限公司，1984 年創立於台灣，為全球主要筆記型電腦 ODM 廠商之一；依 Acer 規格設計與生產產品，並接受 PAP 之採購單。","den":"Compal Electronics, founded in Taiwan in 1984, is one of the world's leading notebook ODMs. It designs and builds products to Acer's specification and receives POs from PAP.","cc":"tw","region":null,"org":"Compal Electronics, Inc.","urls":[{"t":"仁寶（2324）公司資料","p":"Yahoo 股市","u":"https://tw.stock.yahoo.com/quote/2324.TW/profile"},{"t":"仁寶電腦 公司資料","p":"鉅亨網","u":"https://www.cnyes.com/archive/twstock/profile/2324.htm"}],"vs":"verified"},
    {"id":"oem","keys":["OEM"],"code":"OEM","full":"Original Equipment Manufacturer","zh":"原廠委託製造","en":null,"src":"s","cat":"flow","dzh":"代工廠依品牌商提供之設計與規格生產，產品以品牌商之品牌銷售。歐美 PC 產業中，「PC OEM」亦常指品牌電腦廠商本身。","den":"The manufacturer builds to the brand's design and specification, and the product is sold under the brand. In the Western PC industry, a \"PC OEM\" often means the brand itself.","cc":null,"region":null,"org":null,"urls":[{"t":"Original equipment manufacturer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Original_equipment_manufacturer"}],"vs":"standard"},
    {"id":"obm","keys":["OBM"],"code":"OBM","full":"Original Brand Manufacturer","zh":"自有品牌","en":null,"src":"s","cat":"flow","dzh":"以自有品牌行銷與銷售產品，並主導產品定義；生產可自行或委託 ODM／OEM。Acer 屬此模式。","den":"Markets and sells under its own brand and defines the product; production may be in-house or outsourced to an ODM or OEM. Acer works this way.","cc":null,"region":null,"org":null,"urls":[{"t":"Original brand manufacturer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Original_design_manufacturer"}],"vs":"standard"},
    {"id":"qsbu","keys":["QSBU"],"code":"QSBU","full":null,"zh":"","en":null,"src":"n","cat":"flow","dzh":"SPL 定義流程之負責單位之一（QSBU/GCSD），負責 FRU 審查會議、申請料號、Markup Review、上傳 SPL 系統及發布 SPL。","den":"One of the units responsible for the SPL flow (QSBU/GCSD): it holds the FRU review, applies for P/Ns, reviews markup, uploads to the SPL system and releases the SPL.","cc":null,"region":null,"org":"Acer","urls":[{"t":"內部教材 第 11–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"gcsd","keys":["GCSD"],"code":"GCSD","full":null,"zh":"","en":null,"src":"n","cat":"flow","dzh":"與 QSBU 共同負責 SPL 定義流程（QSBU/GCSD）。","den":"Shares responsibility for the SPL flow with QSBU (QSBU/GCSD).","cc":null,"region":null,"org":"Acer","urls":[{"t":"內部教材 第 12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"pm","keys":["PM"],"code":"PM","full":null,"zh":"","en":null,"src":"n","cat":"flow","dzh":"與 HQ 同屬 SPL 流程之一方（HQ/PM），提供 Matrix table、AVLC、MB/KB P/N 及 Carcass price。","den":"Part of the HQ/PM party in the SPL flow; provides the matrix table, AVLC, MB/KB P/Ns and the carcass price.","cc":null,"region":null,"org":"Acer HQ","urls":[{"t":"內部教材 第 11–12、25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"fcs","keys":["FCS"],"code":"FCS","full":"First Customer Shipment","zh":"首次客戶出貨","en":null,"src":"s","cat":"flow","dzh":"產品首次出貨予客戶之時點。SPL 須於 FCS-1wk（首次出貨前一週）發布予各 RO。","den":"The date a product first ships to customers. The SPL must be released to all ROs at FCS-1wk, one week before it.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 11–12、23、25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"fg","keys":["FG"],"code":"FG","full":"Finished Goods","zh":"成品","en":null,"src":"k","cat":"flow","dzh":"已完成組裝、可出貨之整機。標案中若成品成本高於標案價格，可改採購半成品（螢幕、主機板）於當地組裝。","den":"Fully assembled units ready to ship. If the FG cost of a tender exceeds the tender price, semi-finished parts (screen, mainboard) can be bought and assembled locally.","cc":null,"region":null,"org":null,"urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"keycomp","keys":["Key component"],"code":"Key component","full":null,"zh":"關鍵零件","en":"Key parts","src":"k","cat":"flow","dzh":"關鍵零件，例如主機板、螢幕、SSD。主機板須以高精密設備製造，故向 ODM 採購。","den":"Key parts such as the mainboard, screen and SSD. Mainboards require high-precision manufacturing and are sourced from the ODM.","cc":null,"region":null,"org":null,"urls":[{"t":"內部補充說明（教材之外之口頭與筆記資料）","p":"內部補充說明","u":""}],"vs":"internal"},
    {"id":"po","keys":["PO"],"code":"PO","full":"Purchase Order","zh":"採購單","en":null,"src":"s","cat":"ops","dzh":"採購單。PAP 於 CSS 建立 PO、於 PLS 向 ODM 確認，並更新 ETD 追蹤交期。月報包含 PO 相關資料（open PO、close PO、PO raise）。","den":"Purchase order. PAP creates POs in CSS, confirms them to the ODM in PLS and tracks delivery by updating the ETD. The monthly report includes PO files (open, closed and raised POs).","cc":null,"region":null,"org":null,"urls":[{"t":"Purchase order","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Purchase_order"},{"t":"內部教材 第 7–8 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"etd","keys":["ETD"],"code":"ETD","full":"Estimated Time of Departure","zh":"預計出貨日","en":null,"src":"s","cat":"ops","dzh":"貨物預計自供應商出貨之日期。PO 管理須持續更新並追蹤 ETD。","den":"The date goods are expected to leave the supplier. PO management keeps the ETD updated and tracked.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"hfp","keys":["HFP"],"code":"HFP","full":"Hold For Part","zh":"待料","en":null,"src":"m","cat":"ops","dzh":"因待料而延宕之維修案件（backorder），為 PAP 監控各 NS 績效之指標之一。","den":"Repair cases delayed while waiting for parts on backorder; one of the indicators PAP uses to monitor each NS.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 8 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"rma","keys":["RMA"],"code":"RMA","full":"Return Merchandise Authorization","zh":"退貨授權","en":null,"src":"s","cat":"ops","dzh":"不良品退回之授權與流程。RMA 為 PAP 主要職能之一；Service BOM SOP 亦須審查 MOQ/RMA 建議。","den":"Authorisation and process for returning defective parts. RMA is one of PAP's main functions, and the Service BOM SOP reviews the MOQ/RMA suggestions.","cc":null,"region":null,"org":null,"urls":[{"t":"Return merchandise authorization","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Return_merchandise_authorization"},{"t":"內部教材 第 9、15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"csat","keys":["CSAT"],"code":"CSAT","full":"Customer Satisfaction","zh":"客戶滿意度","en":null,"src":"m","cat":"ops","dzh":"客戶滿意度，為 PAP 主要職能（II）之一。","den":"Customer satisfaction, one of PAP's main functions (II).","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 9 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"aging","keys":["502/503"],"code":"502/503 aging","full":null,"zh":"不良品滯留時間","en":"Defective-part aging","src":"m","cat":"ops","dzh":"不良品滯留於 CSS 且尚未處理之時間，為 NS 績效監控指標。","den":"How long defective parts have been held in CSS without action; an NS performance indicator.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 8 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"agingstock","keys":["Aging Stock"],"code":"Aging Stock","full":null,"zh":"庫齡過長之庫存","en":"Aged inventory","src":"m","cat":"ops","dzh":"庫齡過長之庫存，列入每月服務與營運報告。","den":"Inventory beyond its holding period, included in the monthly service and operation report.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 8 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"oow","keys":["OOW"],"code":"OOW","full":"Out of Warranty","zh":"保固外","en":null,"src":"s","cat":"ops","dzh":"超過保固期之維修服務。HSN Group 主要提供保固外售後維修，包括主機板維修。","den":"Repair service after the warranty period. HSN Group mainly provides out-of-warranty after-sales repair, including mainboard repair.","cc":null,"region":null,"org":null,"urls":[{"t":"Warranty","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Warranty"}],"vs":"standard"},
    {"id":"cs","keys":["CS"],"code":"CS","full":"Customer Service","zh":"客戶服務","en":null,"src":"s","cat":"ops","dzh":"客戶服務及售後維修。","den":"Customer service and after-sales repair.","cc":null,"region":null,"org":null,"urls":[{"t":"Customer service","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Customer_service"}],"vs":"standard"},
    {"id":"carcass","keys":["Carcass price"],"code":"Carcass price","full":null,"zh":"Markup Review 輸入資料","en":"Markup review input","src":"m","cat":"term","dzh":"Markup Review 之輸入資料之一，由 HQ/PM 於 C sample ready 階段提供。維修業中 carcass 一般指回收之不良品（core）。","den":"One input to the markup review, provided by HQ/PM at the C sample stage. In repair, carcass generally refers to the returned defective unit (core).","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 11–12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"markup","keys":["Markup","markup"],"code":"Markup","full":null,"zh":"加價率","en":"Price uplift","src":"m","cat":"term","dzh":"加價（率）。NPI 階段審核 B/S 與一般料件之 markup %；SPL 流程之 Markup Review 未通過時，退回 ODM 重新提供草稿。","den":"Price uplift. NPI reviews the markup % for B/S and general parts; if the SPL markup review fails, the ODM must provide a new draft.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 12、15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"emob","keys":[],"code":"e-Mobility","full":null,"zh":"電動載具產品群","en":"Electric mobility","src":"m","cat":"term","dzh":"電動載具產品群；料號子類別以 OT_ 開頭者屬之，例如 OT_MOTOR、OT_TIRE、OT_BRAKE SYSTEM。","den":"The electric mobility product group; sub-categories starting with OT_ belong to it, e.g. OT_MOTOR, OT_TIRE, OT_BRAKE SYSTEM.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 子類別對照表","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"sbom","keys":[],"code":"Service BOM","full":null,"zh":"維修用 BOM","en":"Service BOM","src":"m","cat":"term","dzh":"維修用 BOM，分為 NPI 與 MP 兩類，各有其 SOP。","den":"The BOM used for service, in NPI and MP types, each with its own SOP.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 13、15 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"pc","keys":["PC"],"code":"PC","full":"Personal Computer","zh":"個人電腦","en":null,"src":"s","cat":"part","dzh":"個人電腦，包括筆記型電腦與桌上型電腦。","den":"A personal computer, including notebooks and desktops.","cc":null,"region":null,"org":null,"urls":[{"t":"Personal computer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Personal_computer"}],"vs":"standard"},
    {"id":"cpu","keys":["CPU"],"code":"CPU","full":"Central Processing Unit","zh":"中央處理器","en":null,"src":"s","cat":"part","dzh":"電腦之中央處理器；為備品類別之一（CPU/PROCESSOR）。","den":"The computer's central processor; one of the spare-parts categories (CPU/PROCESSOR).","cc":null,"region":null,"org":null,"urls":[{"t":"Central processing unit","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Central_processing_unit"},{"t":"內部教材 第 13 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"lcd","keys":["LCD"],"code":"LCD","full":"Liquid Crystal Display","zh":"液晶顯示器","en":null,"src":"s","cat":"part","dzh":"液晶螢幕；備品中分為 LCD 面板與 LCD 模組（LCD MODULE），子類別另有 LCD COVER、LCD BEZEL 等外殼件。","den":"The liquid-crystal screen. Spare parts include LCD panels and LCD modules, and sub-categories include housings such as the LCD cover and LCD bezel.","cc":null,"region":null,"org":null,"urls":[{"t":"Liquid-crystal display","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Liquid-crystal_display"},{"t":"內部教材 第 13 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"crt","keys":["CRT"],"code":"CRT","full":"Cathode Ray Tube","zh":"陰極射線管（映像管）","en":null,"src":"s","cat":"part","dzh":"早期映像管顯示器所用之技術；仁寶創立初期即生產 CRT 監視器。","den":"The technology used in early tube monitors; Compal made CRT monitors in its early years.","cc":null,"region":null,"org":null,"urls":[{"t":"Cathode-ray tube","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Cathode-ray_tube"}],"vs":"standard"},
    {"id":"ssd","keys":["SSD"],"code":"SSD","full":"Solid State Drive","zh":"固態硬碟","en":null,"src":"s","cat":"part","dzh":"以快閃記憶體儲存資料之硬碟；澳洲模式中於當地採購之料件之一。","den":"A drive that stores data in flash memory; one of the parts bought locally under the Australian model.","cc":null,"region":null,"org":null,"urls":[{"t":"Solid-state drive","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Solid-state_drive"}],"vs":"standard"},
    {"id":"hdd","keys":["HDD"],"code":"HDD","full":"Hard Disk Drive","zh":"傳統硬碟","en":null,"src":"s","cat":"part","dzh":"以磁碟儲存資料之硬碟；為備品類別之一，亦為澳洲模式中於當地採購之料件。","den":"A drive that stores data on magnetic disks; a spare-parts category and one of the parts bought locally under the Australian model.","cc":null,"region":null,"org":null,"urls":[{"t":"Hard disk drive","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Hard_disk_drive"},{"t":"內部教材 第 13 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"odd","keys":["ODD"],"code":"ODD","full":"Optical Disc Drive","zh":"光碟機","en":null,"src":"s","cat":"part","dzh":"光碟機；子類別對照中之 ODD MODULE 為光碟機模組。","den":"An optical disc drive; ODD MODULE in the sub-category table is the drive module.","cc":null,"region":null,"org":null,"urls":[{"t":"Optical disc drive","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Optical_disc_drive"}],"vs":"standard"},
    {"id":"rtc","keys":["RTC"],"code":"RTC","full":"Real-Time Clock","zh":"即時時鐘","en":null,"src":"s","cat":"part","dzh":"主機板上維持系統時間之時鐘；RTC BATTERY 為其供電之電池。","den":"The clock on the mainboard that keeps system time; the RTC battery powers it.","cc":null,"region":null,"org":null,"urls":[{"t":"Real-time clock","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Real-time_clock"}],"vs":"standard"},
    {"id":"ac","keys":["AC"],"code":"AC","full":"Alternating Current","zh":"交流電","en":null,"src":"s","cat":"part","dzh":"交流電；AC ADAPTER 為將交流電轉換為設備所需電源之變壓器。","den":"Alternating current; an AC adapter converts mains power for the device.","cc":null,"region":null,"org":null,"urls":[{"t":"Alternating current","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Alternating_current"},{"t":"內部教材 第 14 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"av","keys":["AV"],"code":"AV","full":"Audio/Video","zh":"影音","en":null,"src":"s","cat":"part","dzh":"影音訊號；AV MODULE 為影音模組。","den":"Audio and video signals; an AV module handles them.","cc":null,"region":null,"org":null,"urls":[{"t":"Audiovisual","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Audiovisual"}],"vs":"standard"},
    {"id":"dvi","keys":["DVI"],"code":"DVI","full":"Digital Visual Interface","zh":"數位視訊介面","en":null,"src":"s","cat":"part","dzh":"數位視訊傳輸介面；DVI MODULE 為相關模組。","den":"A digital video interface; DVI MODULE is the related module.","cc":null,"region":null,"org":null,"urls":[{"t":"Digital Visual Interface","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Digital_Visual_Interface"}],"vs":"standard"},
    {"id":"pcmcia","keys":["PCMCIA"],"code":"PCMCIA","full":"Personal Computer Memory Card International Association","zh":"PC 卡標準","en":null,"src":"s","cat":"part","dzh":"筆記型電腦擴充卡之介面標準；PCMCIA SLOT 為其插槽。","den":"An expansion-card standard for notebooks; PCMCIA SLOT is its slot.","cc":null,"region":null,"org":null,"urls":[{"t":"PC Card","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/PC_Card"}],"vs":"standard"},
    {"id":"sc","keys":["SC"],"code":"SC","full":"Service Centre","zh":"服務中心","en":null,"src":"s","cat":"site","dzh":"服務中心；分為自有（Own）與外包（Outsourced）。","den":"A service centre, either own (Acer-run) or outsourced.","cc":null,"region":null,"org":null,"urls":[{"t":"Service center","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Service_center"},{"t":"內部教材 第 5 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"ng","keys":["NG"],"code":"NG","full":"No Good","zh":"未通過","en":null,"src":"s","cat":"flow","dzh":"審核未通過；SPL 流程中 Markup Review 為 NG 時退回 ODM 重新提供 SPL 草稿。","den":"Not approved; if the markup review is NG, the SPL flow returns to the ODM for a new SPL draft.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 12 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"q2","keys":["Q2"],"code":"Q2","full":"Second Quarter","zh":"第二季","en":null,"src":"s","cat":"term","dzh":"一年之第二季（4–6 月）；CSD Q2 2025 為 2025 年第二季之據點統計。","den":"The second quarter of the year (April–June); CSD Q2 2025 is the site count for that quarter.","cc":null,"region":null,"org":null,"urls":[{"t":"Fiscal year","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Fiscal_year"}],"vs":"standard"},
    {"id":"ipo","keys":["IPO"],"code":"IPO","full":"Initial Public Offering","zh":"首次公開發行","en":null,"src":"s","cat":"term","dzh":"公司首次公開發行股票。","den":"A company's first public offering of shares.","cc":null,"region":null,"org":null,"urls":[{"t":"Initial public offering","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Initial_public_offering"}],"vs":"standard"},
    {"id":"tpex","keys":["TPEx"],"code":"TPEx","full":"Taipei Exchange","zh":"證券櫃檯買賣中心（櫃買中心）","en":null,"src":"s","cat":"term","dzh":"台灣上櫃與興櫃股票之交易市場；海柏特於 2025 年 12 月 17 日上櫃。","den":"Taiwan's over-the-counter market; HSN listed there on 17 December 2025.","cc":"tw","region":null,"org":"Taipei Exchange","urls":[{"t":"Taipei Exchange","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Taipei_Exchange"},{"t":"海柏特上櫃掛牌","p":"工商時報 · 2025-12-17","u":"https://www.ctee.com.tw/news/20251217700532-430201"}],"vs":"verified"},
    {"id":"ai","keys":["AI"],"code":"AI","full":"Artificial Intelligence","zh":"人工智慧","en":null,"src":"s","cat":"term","dzh":"人工智慧；AI 伺服器為仁寶近年拓展之產品。","den":"Artificial intelligence; AI servers are among Compal's newer products.","cc":null,"region":null,"org":null,"urls":[{"t":"Artificial intelligence","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Artificial_intelligence"}],"vs":"standard"},
    {"id":"ceo","keys":["CEO"],"code":"CEO","full":"Chief Executive Officer","zh":"執行長","en":null,"src":"s","cat":"role","dzh":"企業之最高經營主管。","den":"A company's chief executive.","cc":null,"region":null,"org":null,"urls":[{"t":"Chief executive officer","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Chief_executive_officer"}],"vs":"standard"},
    {"id":"auo","keys":["AUO","AU Optronics"],"code":"AUO","full":"AU Optronics","zh":"友達光電","en":null,"src":"p","cat":"org","dzh":"顯示器面板製造商，前身為宏碁集團之達碁科技，2001 年與聯友光電合併後更名；現為獨立公司。","den":"A display-panel maker, formerly the Acer group's Acer Display Technology; renamed after merging with Unipac in 2001, now independent.","cc":"tw","region":null,"org":"AU Optronics Corp.","urls":[{"t":"達碁與聯友合併為友達","p":"iThome","u":"https://www.ithome.com.tw/news/11958"},{"t":"友達做什麼（公司沿革）","p":"nstock","u":"https://www.nstock.tw/%E5%8F%8B%E9%81%94%E5%81%9A%E4%BB%80%E9%BA%BC.html"}],"vs":"verified"},
    {"id":"abw","keys":["ABW"],"code":"ABW","full":"Acer · BenQ · Wistron","zh":"宏碁、明基、緯創三家","en":null,"src":"p","cat":"org","dzh":"宏碁 2000 年再造後分出的三家公司之合稱（ABW family），創辦人施振榮建議以此取代「泛宏碁集團」之稱。","den":"The three companies that emerged from Acer's 2000 re-engineering (the ABW family); founder Stan Shih suggested the name in place of the pan-Acer group.","cc":"tw","region":null,"org":"Acer · BenQ · Wistron","urls":[{"t":"施振榮談 ABW family","p":"今周刊 · 2023-08-09","u":"https://www.businesstoday.com.tw/article/category/183015/post/202308090013/"}],"vs":"single"},
    {"id":"aeb","keys":["AEB"],"code":"AEB","full":"Acer e-Enabling Service Business","zh":"宏碁資訊","en":null,"src":"p","cat":"org","dzh":"宏碁子公司，提供雲端服務與軟體授權；2022 年上櫃（6811）。","den":"An Acer subsidiary providing cloud services and software licensing; listed on the TPEx in 2022 (6811).","cc":"tw","region":null,"org":"Acer e-Enabling Service Business","urls":[{"t":"宏碁資訊 基本資料","p":"Money-Link","u":"https://ww2.money-link.com.tw/TWStock/StockBasic.aspx?SymId=6811"},{"t":"宏碁資訊 AEB 介紹","p":"科技新報 · 2022-07-04","u":"https://finance.technews.tw/2022/07/04/aeb/"}],"vs":"verified"},
    {"id":"acsi","keys":["ACSI"],"code":"ACSI","full":"Acer Cyber Security Inc.","zh":"安碁資訊","en":null,"src":"p","cat":"org","dzh":"宏碁子公司，提供資安監控（SOC）、檢測與顧問服務；2019 年上櫃（6690）。","den":"An Acer subsidiary providing security monitoring (SOC), testing and consulting; listed on the TPEx in 2019 (6690).","cc":"tw","region":null,"org":"Acer Cyber Security Inc.","urls":[{"t":"安碁資訊上櫃：台灣首家上櫃資安公司","p":"科技新報 · 2019-10-30","u":"https://finance.technews.tw/2019/10/30/6690-acer-cyber-security-inc/"},{"t":"安碁資訊與宏碁雲架構","p":"數位時代","u":"https://www.bnext.com.tw/article/65988/acercsi-aceredc"}],"vs":"verified"},
    {"id":"ast","keys":["AST"],"code":"AST","full":"Acer Synergy Tech","zh":"智聯服務","en":null,"src":"p","cat":"org","dzh":"宏碁子公司，提供資訊系統整合與維運；2020 年上櫃（6751）。","den":"An Acer subsidiary providing IT system integration and maintenance; listed on the TPEx in 2020 (6751).","cc":"tw","region":null,"org":"Acer Synergy Tech","urls":[{"t":"智聯服務 AST 公司簡介","p":"Acer · 2023-10","u":"https://images.acer.com/is/content/acer/AST%206751%20202310pdf"},{"t":"智聯服務上櫃","p":"工商時報","u":"https://ctee.com.tw/news/stock/371890.html"}],"vs":"verified"},
    {"id":"anz","keys":["ANZ"],"code":"ANZ","full":"Australia and New Zealand","zh":"澳洲與紐西蘭","en":null,"src":"s","cat":"org","dzh":"澳洲與紐西蘭市場之合稱。","den":"Australia and New Zealand as one market.","cc":null,"region":null,"org":null,"urls":[{"t":"Australia–New Zealand relations","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Australia%E2%80%93New_Zealand_relations"}],"vs":"standard"},
    {"id":"hp","keys":["HP"],"code":"HP","full":"Hewlett-Packard（HP Inc.）","zh":"惠普","en":null,"src":"s","cat":"term","dzh":"美國個人電腦與印表機品牌，為台灣筆電代工廠之主要客戶之一。","den":"A US PC and printer brand, one of the main customers of Taiwan's notebook ODMs.","cc":"us","region":null,"org":"HP Inc.","urls":[{"t":"HP Inc.","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/HP_Inc."}],"vs":"standard"},
    {"id":"it","keys":["IT"],"code":"IT","full":"Information Technology","zh":"資訊科技","en":null,"src":"s","cat":"term","dzh":"資訊科技；IT 系統整合、IT 人力服務等。","den":"Information technology, as in IT system integration or IT staffing.","cc":null,"region":null,"org":null,"urls":[{"t":"Information technology","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Information_technology"}],"vs":"standard"},
    {"id":"ps5","keys":["PS5"],"code":"PS5","full":"PlayStation 5","zh":"PlayStation 5 遊戲主機","en":null,"src":"s","cat":"term","dzh":"Sony 之家用遊戲主機；宏碁遊戲自 2020 年起為其台灣獨家代理。","den":"Sony's home game console; Acer Gaming has been its exclusive agent in Taiwan since 2020.","cc":null,"region":null,"org":"Sony","urls":[{"t":"PlayStation 5","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/PlayStation_5"}],"vs":"standard"},
    {"id":"ntd","keys":["NT$","NT"],"code":"NT$","full":"New Taiwan dollar","zh":"新台幣","en":null,"src":"s","cat":"term","dzh":"台灣之貨幣單位。","den":"Taiwan's currency.","cc":"tw","region":null,"org":null,"urls":[{"t":"New Taiwan dollar","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/New_Taiwan_dollar"}],"vs":"standard"},
    {"id":"twse","keys":["TWSE"],"code":"TWSE","full":"Taiwan Stock Exchange","zh":"臺灣證券交易所","en":null,"src":"s","cat":"term","dzh":"台灣上市股票之交易所；上櫃與興櫃股票則於櫃買中心（TPEx）交易。","den":"The exchange for Taiwan's listed shares; over-the-counter and emerging-board shares trade on the TPEx.","cc":"tw","region":null,"org":"Taiwan Stock Exchange","urls":[{"t":"Taiwan Stock Exchange","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Taiwan_Stock_Exchange"}],"vs":"standard"},
    {"id":"ems","keys":["EMS"],"code":"EMS","full":"Electronics Manufacturing Services","zh":"電子製造服務","en":null,"src":"s","cat":"flow","dzh":"受託進行電子產品之製造與組裝，通常不負責產品設計；鴻海為此類廠商之代表。","den":"Contract manufacturing and assembly of electronics, usually without product design; Foxconn is the leading example.","cc":null,"region":null,"org":null,"urls":[{"t":"Electronics manufacturing services","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Electronics_manufacturing_services"}],"vs":"standard"},
    {"id":"culv","keys":["CULV"],"code":"CULV","full":"Consumer Ultra-Low Voltage","zh":"消費型超低電壓處理器平台","en":null,"src":"s","cat":"part","dzh":"Intel 於 2009 年推出之低耗電筆電處理器平台；Acer 當年之超薄筆電即採此平台。","den":"Intel's 2009 low-power notebook processor platform, used in Acer's ultra-thin notebooks that year.","cc":null,"region":null,"org":null,"urls":[],"vs":"standard"},
    {"id":"ipc","keys":["IPC"],"code":"IPC","full":"Industrial PC","zh":"工業電腦","en":null,"src":"s","cat":"term","dzh":"用於工業、零售、交通等環境之電腦；建碁自 2019 年起以此為主要業務。","den":"Computers for industrial, retail and transport environments; AOpen's main business since 2019.","cc":null,"region":null,"org":null,"urls":[{"t":"Industrial PC","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Industrial_PC"}],"vs":"standard"},
    {"id":"aiot","keys":["AIoT"],"code":"AIoT","full":"Artificial Intelligence of Things","zh":"智慧物聯網","en":null,"src":"s","cat":"term","dzh":"結合人工智慧與物聯網之應用。","den":"Applications that combine artificial intelligence with the Internet of Things.","cc":null,"region":null,"org":null,"urls":[{"t":"Internet of things","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Internet_of_things"}],"vs":"standard"},
    {"id":"soc","keys":["SOC"],"code":"SOC","full":"Security Operations Center","zh":"資安監控中心","en":null,"src":"s","cat":"term","dzh":"全天候監控資訊安全事件之中心；安碁資訊之核心業務。","den":"A centre that monitors information-security events around the clock; the core business of Acer Cyber Security.","cc":null,"region":null,"org":null,"urls":[{"t":"Information security operations center","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Information_security_operations_center"}],"vs":"standard"},
    {"id":"eol","keys":["EOL"],"code":"EOL","full":"End of Life","zh":"產品生命週期結束","en":null,"src":"m","cat":"flow","dzh":"產品生命週期結束之時點，日期由 PM 決定；量產鎖定（Mass Lock）為 EOL 前 3 個月，PPB1、PPB2 分別於 EOL 後 3 與 9 個月。SPL 持續更新至 EOL 通知為止。","den":"The end of a product's life, on a date decided by the PM. Mass Lock is three months before EOL, and PPB1 and PPB2 fall three and nine months after it. The SPL is kept up to date until the EOL notice.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 11、23、25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"eom","keys":["EOM"],"code":"EOM","full":"End of Manufacture","zh":"停止生產","en":null,"src":"m","cat":"flow","dzh":"ODM 最後一台出貨之日期。桌上型電腦（Proactive 模式）於 EOM 當月提出最後一次需求報表，EOM 之後依各 RO 分批排程供貨。","den":"The date the ODM ships its last unit. In the desktop (Proactive) mode the last demand report is submitted at EOM, after which parts follow each RO's partial schedule.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"eos","keys":["EOS"],"code":"EOS","full":null,"zh":"","en":null,"src":"n","cat":"flow","dzh":"桌上型電腦規劃模式中，最後採購（LTB）可於 EOM 至 EOS 期間提出；全稱未載明。","den":"In the desktop planning mode the last-time buy (LTB) may be raised between EOM and EOS; the full name is not specified.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"ltb","keys":["LTB"],"code":"LTB","full":"Last Time Buy","zh":"最後採購","en":null,"src":"s","cat":"flow","dzh":"停產前之最後一次採購。依合約條款（T&C）於原物料停產、模具損壞或修改、與 ODM 或供應商結束合作，或 RO 主動提出時進行；筆記型電腦依 AML（C 類）、PPB1（B 類）、PPB2（A 類）分階段執行。","den":"The final purchase before supply ends. Under the terms and conditions it is raised when raw material reaches EOM, tooling is damaged or modified, business with the ODM or vendor ends, or the RO initiates it; for notebooks it runs in stages, AML (C parts), PPB1 (B parts) and PPB2 (A parts).","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 23–25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"ml","keys":["Mass Lock","ML"],"code":"Mass Lock · ML","full":null,"zh":"量產鎖定","en":"Mass Lock","src":"m","cat":"flow","dzh":"Acer Fulfillment 向 ODM 提出全球成品最後需求之時點，為 EOL 前 3 個月；IMR 料件於此時提出最後採購。AML 於 ML 後 2 個月。","den":"When Acer Fulfillment calls the worldwide finished-goods last demand to the ODMs, three months before EOL; IMR material is placed on last-time buy at this point. AML follows two months after ML.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 23–25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"dr","keys":["Demand Report","DR"],"code":"DR","full":"Demand Report","zh":"需求報表","en":null,"src":"m","cat":"flow","dzh":"各區提出備品需求之報表。桌上型電腦每月 5 日提出、備品於次月 20 日出貨；筆記型電腦依 NPI、BML、AML、PPB1/2 各階段提出。","den":"The report in which each region states its spare-parts demand. For desktops it is submitted on the 5th of each month with parts shipped on the 20th of the following month; for notebooks it follows the NPI, BML, AML and PPB1/2 stages.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 7、25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"internal"},
    {"id":"imr","keys":["IMR"],"code":"IMR","full":null,"zh":"","en":null,"src":"n","cat":"part","dzh":"於量產鎖定（Mass Lock）時提出最後採購之料件類別；全稱未載明。","den":"A class of material placed on last-time buy at Mass Lock; the full name is not specified.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"pending"},
    {"id":"wd","keys":["WD"],"code":"WD","full":"Working Days","zh":"工作天","en":null,"src":"s","cat":"term","dzh":"工作天。例：初始備品於下單後 5 個工作天（PO+5WD）出貨，BML 備品於下單後 10 個工作天出貨。","den":"Working days. For example, initial spare parts ship five working days after the PO (PO+5WD) and BML parts after ten.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 23、25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"cd","keys":["CD"],"code":"CD","full":"Calendar Days","zh":"日曆天","en":null,"src":"s","cat":"term","dzh":"日曆天。FRU/SPL 流程中，FCS 前 14 天（FCS-14CD）提供主機板料號與 carcass price，FCS 前 5 天（FCS-5CD）SPL 凍結。","den":"Calendar days. In the FRU/SPL flow the mainboard P/N and carcass price are provided 14 days before FCS (FCS-14CD) and the SPL is frozen 5 days before (FCS-5CD).","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 11 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"lt","keys":["L/T"],"code":"L/T","full":"Lead Time","zh":"交期","en":null,"src":"s","cat":"term","dzh":"自下單至交貨所需時間。量產結束後，桌上型電腦備品依 ODM 之 MOQ 與交期供貨。","den":"The time from order to delivery. After mass production, desktop spare parts follow the ODM's MOQ and lead time.","cc":null,"region":null,"org":null,"urls":[{"t":"Lead time","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Lead_time"},{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"tc","keys":["T&C"],"code":"T&C","full":"Terms and Conditions","zh":"合約條款","en":null,"src":"s","cat":"term","dzh":"與 ODM 或供應商之合約條款；最後採購（LTB）依其規定提出。","den":"The contract terms with the ODM or vendor, under which a last-time buy (LTB) is raised.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"ww","keys":["WW"],"code":"WW","full":"Worldwide","zh":"全球","en":null,"src":"s","cat":"term","dzh":"全球。量產鎖定時，Acer Fulfillment 向 ODM 提出全球成品（WW FG）最後需求。","den":"Worldwide. At Mass Lock, Acer Fulfillment calls the worldwide finished-goods (WW FG) last demand to the ODMs.","cc":null,"region":null,"org":null,"urls":[{"t":"內部教材 第 25 頁","p":"PAP Service Logistics – Internal Training Material 2025","u":""}],"vs":"standard"},
    {"id":"sop","keys":["SOP"],"code":"SOP","full":"Standard Operating Procedure","zh":"標準作業程序","en":null,"src":"s","cat":"term","dzh":"標準作業程序。Service BOM SOP 分為 NPI（1.1–1.6）與 MP（2.1–2.7）兩部分。","den":"Standard operating procedure. The Service BOM SOP has NPI (1.1–1.6) and MP (2.1–2.7) parts.","cc":null,"region":null,"org":null,"urls":[{"t":"Standard operating procedure","p":"Wikipedia","u":"https://en.wikipedia.org/wiki/Standard_operating_procedure"}],"vs":"standard"}
  ];
  var AB_BY = {};
  AB.forEach(function (a) { AB_BY[a.id] = a; });
  var KEYMAP = {};
  AB.forEach(function (a) { a.keys.forEach(function (k) { KEYMAP[k] = a.id; }); });
  var reEsc = function (s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); };
  var KEYS = Object.keys(KEYMAP).sort(function (x, y) { return y.length - x.length; }).map(reEsc);
  var AB_RE = new RegExp("(^|[^A-Za-z0-9_])(" + KEYS.join("|") + ")(?=s?(?:[^A-Za-z0-9_]|$))", "g");
  // 說明文字中的其他縮寫也可點選（每個縮寫標示第一次；不標示本身）
  function linkText(html, selfId) {
    var seen = {};
    seen[selfId] = 1;
    return html.replace(AB_RE, function (all, pre, key) {
      var id = KEYMAP[key];
      if (!id || seen[id]) return all;
      seen[id] = 1;
      return pre + '<button type="button" class="ab" data-ab="' + id + '">' + key + "</button>";
    });
  }
  var descHTML = function (a) { return B(linkText(esc(a.dzh), a.id), linkText(esc(a.den), a.id)); };
  // 組織架構：上級 → 下級
  var TREE = [
    ["hq", [["pa"], ["emea"], ["accn"], ["pap", [["twn"], ["aap"], ["ns", [["assb"], ["aca", [["acnz"]]], ["ail"], ["ath"], ["ain", [["ami"]]], ["avn"], ["ajc"], ["akc"], ["afe"], ["aphi"], ["acs"]]]]]]],
    ["hsn", [["hsnm"], ["hsni"], ["hsnv"], ["hsnp"], ["hsnt"]]]
  ];

  function srcTag(s) { var x = SRC[s]; return '<span class="src ' + s + '">' + B(x[0], x[1]) + "</span>"; }
  // 名稱顯示：有全稱者顯示全稱＋中文；無全稱但有英文名者亦同；否則中文／英文各自顯示
  function fullHTML(a) {
    var en = a.full || a.en;
    if (en) return esc(en) + (a.zh ? '<small class="zh">' + esc(a.zh) + "</small>" : "");
    if (a.zh) return B(esc(a.zh), esc(a.code));
    return NA("全稱未載明", "Full name not specified");
  }
  function nameOf(a) {
    if (a.full || a.en) return esc(a.full || a.en) + (a.zh ? '<small class="zh"> · ' + esc(a.zh) + "</small>" : "");
    if (a.zh) return B(esc(a.zh), esc(a.code));
    return NA("全稱未載明", "Full name not specified");
  }
  var CNAME = {};
  INFRA.forEach(function (r) { CNAME[r[0]] = [r[1], r[2]]; });
  OFFICES.forEach(function (o) { if (!CNAME[o[1]]) CNAME[o[1]] = [o[2], o[3]]; });
  CNAME.cn = ["中國", "China"]; CNAME.tw = ["台灣", "Taiwan"]; CNAME.us = ["美國", "United States"];
  var catName = function (id) { var c = CATS_AB.filter(function (x) { return x[0] === id; })[0]; return c ? B(c[1], c[2]) : esc(id); };
  var VS_AB = { verified: ["已核實", "Verified"], single: ["單一來源", "Single source"], conflict: ["來源衝突", "Conflicting sources"], notfound: ["查無可靠來源", "Not found"], internal: ["內部文件", "Internal document"], pending: ["待內部確認", "Pending internal confirmation"], standard: ["通用名詞", "Standard term"] };
  function vsChip(st) { var v = VS_AB[st] || VS_AB.pending; return '<span class="vs ' + st + '">' + B(v[0], v[1]) + "</span>"; }
  function srcList(a) {
    if (!a.urls || !a.urls.length) return '<span class="no">—</span>';
    return '<ul class="src-list">' + a.urls.map(function (u) {
      return "<li>" + (u.u ? '<a href="' + esc(u.u) + '" target="_blank" rel="noopener">' + esc(u.t) + "</a>" : esc(u.t)) + (u.p ? "<small>" + esc(u.p) + "</small>" : "") + "</li>";
    }).join("") + "</ul>";
  }
  function placeHTML(a) {
    var out = "";
    if (a.cc && CNAME[a.cc]) out += flag(a.cc) + B(CNAME[a.cc][0], CNAME[a.cc][1]);
    if (a.region) out += (out ? " " : "") + '<span class="chip rg">' + B("區域 ", "Region ") + esc(a.region) + "</span>";
    return out;
  }
  function officeIdx(code) { for (var i = 0; i < OFFICES.length; i++) if (OFFICES[i][12] === code) return i; return -1; }
  var NS_IDS = {};
  NSC.forEach(function (n) { NS_IDS[n[0].toLowerCase()] = n; });
  var REGION_IDS = { pa: 1, emea: 1, pap: 1, twn: 1, aap: 1, accn: 1 };
  var WHAT_CAT = {
    role: ["職務或角色名稱的縮寫。", "An abbreviation of a job title or role."],
    site: ["服務據點類型的名稱。", "The name of a type of service site."],
    sys: ["PAP 作業使用的系統名稱。", "The name of a system used in PAP operations."],
    part: ["料件、BOM 或料號相關的名詞。", "A term about parts, the BOM or part numbers."],
    flow: ["作業流程或參與單位的名詞。", "A term about a process or one of the units involved."],
    ops: ["採購與營運相關的名詞或指標。", "A purchasing or operations term or indicator."],
    term: ["一般名詞。", "A general term."]
  };
  // 一句話說明：給第一次接觸的同仁看的
  function whatIs(a) {
    var c = a.cc && CNAME[a.cc] ? CNAME[a.cc] : ["", ""];
    if (NS_IDS[a.id]) return a.cc ? B("Acer 在" + c[0] + "的國家子公司（NS）的代碼。", "The code for Acer's nation subsidiary (NS) in " + c[1] + ".") : B("PAP 轄下國家子公司（NS）之一的代碼；所屬國家教材未載明。", "The code for one of the nation subsidiaries (NS) under PAP; its country is not specified in the material.");
    if (/^hsn[mivpt]$/.test(a.id)) return B("海柏特集團（HSN Group）在" + c[0] + "的公司代碼。", "The code for HSN Group's company in " + c[1] + ".");
    if (REGION_IDS[a.id]) return B("Acer 的區域代碼之一：總部之下的一個大區。", "One of Acer's region codes: a region under headquarters.");
    var ONE = { hq: ["Acer 總部之簡稱。", "Short for Acer headquarters."], ns: ["國家子公司之縮寫，指 Acer 於各國設立之公司。", "Short for nation subsidiary: Acer's company in each country."], ro: ["區域辦公室之縮寫；PAP 即為區域辦公室。", "Short for regional office; PAP is the regional office."],
      hsn: ["海柏特公司名稱的縮寫。", "The abbreviation of the company name Highpoint Service Network."], ami: ["印尼 Uni-load 組裝廠的公司代碼。", "The company code of the Uni-load assembly plant in Indonesia."], compal: ["Acer 的代工廠（ODM）之一，教材所載的採購對象。", "One of Acer's ODMs and the supplier named in the training material."],
      auo: ["公司名稱的縮寫。", "A company name abbreviation."], aeb: ["宏碁子公司名稱的縮寫。", "The abbreviation of an Acer subsidiary's name."], acsi: ["宏碁子公司名稱的縮寫。", "The abbreviation of an Acer subsidiary's name."], ast: ["宏碁子公司名稱的縮寫。", "The abbreviation of an Acer subsidiary's name."], abw: ["三家公司的合稱。", "A collective name for three companies."], anz: ["兩個國家市場的合稱。", "A collective name for two country markets."] };
    if (ONE[a.id]) return B(ONE[a.id][0], ONE[a.id][1]);
    var w = WHAT_CAT[a.cat] || WHAT_CAT.term;
    return B(w[0], w[1]);
  }
  function detailHTML(a) {
    var rows = [[B("定義", "Definition"), '<div class="ab-what">' + whatIs(a) + "</div>"]];
    rows.push([B("全稱", "Full name"), '<div class="ab-full">' + fullHTML(a) + "</div>"]);
    rows.push([B("類別", "Category"), catName(a.cat)]);
    var place = placeHTML(a);
    if (place) rows.push([B("國家／地區", "Country / region"), place]);
    if (a.org) rows.push([B("所屬公司／單位", "Company or unit"), esc(a.org)]);
    rows.push([B("說明", "Description"), descHTML(a)]);
    rows.push([B("資料來源", "Sources"), srcList(a)]);
    rows.push([B("資料查證", "Verification"), vsChip(a.vs)]);
    return '<dl class="kvl">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl>";
  }
  function abNode(a, rootNode) {
    return '<details class="tnode' + (rootNode ? " root" : "") + '" id="abc-' + a.id + '"><summary><span class="k">' + esc(a.code) + '</span><span class="f">' + nameOf(a) + "</span>" + srcTag(a.src) + '</summary><div class="tin">' + detailHTML(a) + "</div></details>";
  }
  function treeHTML(nodes, depth) {
    return nodes.map(function (n) {
      var a = AB_BY[n[0]];
      return "<li>" + abNode(a, depth === 0) + (n[1] ? "<ul>" + treeHTML(n[1], depth + 1) + "</ul>" : "") + "</li>";
    }).join("");
  }
  var abCat = "org";
  $("ab-cats").innerHTML = CATS_AB.map(function (c) {
    return '<button class="btn sm' + (c[0] === abCat ? " active" : "") + '" type="button" data-cat="' + c[0] + '">' + B(c[1], c[2]) + "</button>";
  }).join("");
  $("ab-cats").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-cat]") : null;
    if (!b) return;
    abCat = b.getAttribute("data-cat");
    $("ab-search").value = "";
    renderAbbr();
  });
  $("src-legend").innerHTML = Object.keys(SRC).map(function (k) { return "<span>" + srcTag(k) + " " + B(SRC[k][2], SRC[k][3]) + "</span>"; }).join("");
  function renderAbbr() {
    var q = $("ab-search").value.trim().toLowerCase(), html = "", n = 0;
    $$("#ab-cats .btn").forEach(function (x) { x.classList.toggle("active", !q && x.getAttribute("data-cat") === abCat); });
    if (q) {
      CATS_AB.forEach(function (c) {
        var items = AB.filter(function (a) { return a.cat === c[0] && [a.code, a.full || "", a.zh, a.dzh, a.den, a.en || "", a.org || ""].join(" ").toLowerCase().indexOf(q) !== -1; });
        if (!items.length) return;
        n += items.length;
        html += '<div class="ab-group"><h3>' + B(c[1], c[2]) + '</h3><div class="acc">' + items.map(function (a) { return abNode(a, false); }).join("") + "</div></div>";
      });
      if (!html) html = '<p class="ab-empty">' + B("查無「" + esc(q) + "」相關結果。", 'No results for "' + esc(q) + '".') + "</p>";
    } else if (abCat === "org") {
      n = AB.filter(function (a) { return a.cat === "org"; }).length;
      html = '<ul class="tree">' + treeHTML(TREE, 0) + "</ul>";
    } else {
      var items = AB.filter(function (a) { return a.cat === abCat; });
      n = items.length;
      html = '<div class="acc">' + items.map(function (a) { return abNode(a, false); }).join("") + "</div>";
    }
    $("ab-groups").innerHTML = html;
    $("ab-count").innerHTML = B(n + " 個", n + " entries");
  }
  $("ab-search").addEventListener("input", renderAbbr);
  $("ab-open").addEventListener("click", function () { $$("#ab-groups details").forEach(function (d) { d.open = true; }); });
  $("ab-close-all").addEventListener("click", function () { $$("#ab-groups details").forEach(function (d) { d.open = false; }); });
  renderAbbr();
  function showAbCard(id) {
    var a = AB_BY[id];
    if (!a) return;
    $("ab-search").value = "";
    abCat = a.cat;
    renderAbbr();
    go("ref-abbr", true);
    var d = $("abc-" + id);
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ block: "center" });
  }

  /* ---------- 代碼頁 ---------- */
  function sitesLine(cc) {
    var r = INFRA_BY[cc];
    if (!r) return '<span class="no">—</span>';
    var parts = [["自有", "Own", r[3]], ["外包", "Outsourced", r[4]], ["ASP", "ASP", r[5]], ["Call Centre", "Call centre", r[6]], ["Parts Hub", "Parts hub", r[7]]]
      .filter(function (p) { return p[2] !== null; })
      .map(function (p) { return "<span>" + B(p[0], p[1]) + " <b>" + p[2] + "</b></span>"; });
    return '<span class="sites-line">' + parts.join("") + "<span>" + B("合計", "Total") + " <b>" + r.total + "</b></span></span>";
  }
  var yn = function (v) { return v === null ? '<span class="no">—</span>' : mark(v); };
  var papA = AB_BY.pap;
  $("ns-tree").innerHTML = '<li><details class="tnode root" open><summary><span class="k">PAP</span><span class="f">' + B("泛亞太區 · 區域辦公室（RO）", "Pan Asia Pacific · Regional office (RO)") + '</span></summary><div class="tin">' + descHTML(papA) + "</div></details><ul>" +
    NSC.map(function (c) {
      var a = AB_BY[c[0].toLowerCase()];
      var children = c[5].map(function (s) {
        var isCode = s[0] !== s[3];
        return '<li><div class="tleaf">' + (isCode ? "<b>" + flag(s[1]) + esc(s[0]) + "</b><span>" + B(s[2], s[3]) + "</span>" : "<b>" + flag(s[1]) + B(s[2], s[3]) + "</b>") + "</div></li>";
      }).join("");
      return '<li><details class="tnode"><summary><span class="k">' + flag(c[1]) + c[0] + '</span><span class="f">' + (c[1] ? B(c[2], c[3]) : NA(c[2], c[3])) + '</span><span class="pnc" title="P/N">' + c[4] + "</span></summary>" +
        '<div class="tin">' +
        '<div class="kv"><span>' + B("料號國別代碼", "P/N country code") + '</span><span class="mono"><b>' + c[4] + "</b></span></div>" +
        '<div class="kv"><span>' + B("倉庫", "Warehouse") + "</span><span>" + yn(c[6]) + "</span></div>" +
        '<div class="kv"><span>Uni-load</span><span>' + yn(c[7]) + "</span></div>" +
        '<div class="kv"><span>' + B("Q2 2025 據點", "Q2 2025 sites") + "</span><span>" + sitesLine(c[1]) + "</span></div>" +
        "<div>" + descHTML(a) + "</div></div></details>" + (children ? "<ul>" + children + "</ul>" : "") + "</li>";
    }).join("") + "</ul></li>";

  var REG = [
    ["hq", "—", "總部，轄下設有五大區域。", "Headquarters, overseeing five regions."],
    ["pa", "A", "美洲區域。", "Americas region."],
    ["emea", "E", "歐洲、中東與非洲區域。", "Europe, Middle East and Africa region."],
    ["twn", "T", "台灣區，2016/2017 年與 AAP 整併為 PAP。", "Taiwan region; merged with AAP into PAP in 2016/2017."],
    ["aap", "S", "亞太區，2016/2017 年與 TWN 整併為 PAP；第 7 碼國別代碼適用於 AAP 各國。", "Asia Pacific region; merged with TWN into PAP in 2016/2017. 7th-character country codes apply to AAP countries."],
    ["accn", "C", "中國區，獨立運作。", "China region, operating independently."],
    ["pap", "—", "由 TWN 與 AAP 整併而成；RO 代碼沿用 AAP 之 S 與 TWN 之 T。", "Formed from TWN and AAP; RO codes S (AAP) and T (TWN) remain in use."]
  ];
  $("code-region").innerHTML = REG.map(function (r) {
    var a = AB_BY[r[0]];
    return "<tr><td><b>" + a.code + "</b></td><td>" + nameOf(a) + '</td><td class="c"><b class="mono">' + r[1] + '</b></td><td class="wrap">' + B(r[2], r[3]) + "</td></tr>";
  }).join("");

  var SITE_KIND = [["自有服務中心", "Own service centre", 3], ["外包服務中心", "Outsourced service centre", 4], ["授權服務商 ASP", "ASP", 5], ["客服中心", "Call centre", 6], ["備品中心", "Parts hub", 7]];
  function siteChips(cc) {
    var r = INFRA_BY[cc];
    if (!r) return NA("未列示據點", "No sites listed");
    return SITE_KIND.filter(function (s) { return r[s[2]]; }).map(function (s) { return '<span class="site-chip">' + B(s[0], s[1]) + " <b>" + r[s[2]] + "</b></span>"; }).join("");
  }
  // [管轄單位, 國旗, 中文, English, 說明（中）, 說明（英）, 國家／地區]
  var COVER = [
    ["TWN → PAP", "tw", "原 TWN 區域", "Former TWN region", "台灣原為獨立之 TWN 區域，於 2016/2017 年與 AAP 整併為 PAP。", "Taiwan was the separate TWN region; it merged with AAP into PAP in 2016/2017.", [["tw", "台灣", "Taiwan"]]],
    ["AIL", "in", "印度子公司", "India subsidiary", "", "", [["bd", "孟加拉", "Bangladesh"]]],
    ["ATH", "th", "泰國子公司", "Thailand subsidiary", "", "", [["", "中南半島", "Indo-china"]]],
    ["ACS", "sg", "新加坡子公司", "Singapore subsidiary", "", "", [["lk", "斯里蘭卡", "Sri Lanka"], ["mn", "蒙古", "Mongolia"], ["np", "尼泊爾", "Nepal"]]],
    ["", "", "管轄單位未載明", "Responsible subsidiary not specified", "列於 Q2 2025 據點統計，惟未載明管轄之子公司。", "Listed in the Q2 2025 site counts, but the responsible subsidiary is not specified.", [["hk", "香港", "Hong Kong"], ["mm", "緬甸", "Myanmar"], ["la", "寮國", "Laos"], ["kh", "柬埔寨", "Cambodia"]]]
  ];
  $("code-other").innerHTML = COVER.map(function (g) {
    var n = g[6].length, sub = g[0] && g[1] !== "tw" ? B("管轄 " + n + " 個國家／地區", "Covers " + n + (n === 1 ? " country or region" : " countries or regions")) : "";
    return '<article class="cover"><div class="cover-head">' + (g[0] ? '<span class="cover-code">' + esc(g[0]) + "</span>" : "") +
      "<div><b>" + (g[0] ? flag(g[1]) + B(g[2], g[3]) : NA(g[2], g[3])) + "</b>" + (sub ? "<small>" + sub + "</small>" : "") + "</div></div>" +
      (g[4] ? '<p class="cover-note">' + B(g[4], g[5]) + "</p>" : "") +
      '<ul class="cover-list">' + g[6].map(function (c) {
        var r = INFRA_BY[c[0]];
        return '<li><span class="cover-name">' + flag(c[0]) + B(c[1], c[2]) + '</span><span class="cover-total">' + (r ? "<b>" + r.total + "</b> " + B("處據點", r.total === 1 ? "site" : "sites") : "") + "</span>" +
          '<span class="site-chips">' + siteChips(c[0]) + "</span></li>";
      }).join("") + "</ul></article>";
  }).join("");
  $("code-hsn").innerHTML = HSNC.map(function (h) {
    var a = AB_BY[h[0].toLowerCase()], st = HSN_ST[h[4]];
    return "<tr><td><b>" + esc(h[0]) + "</b></td><td>" + flag(h[1]) + B(h[2], h[3]) + "</td><td>" + B(st[0], st[1]) +
      '</td><td class="wrap">' + (a ? B(esc(a.dzh), esc(a.den)) : B("HSN Group 擴展規劃。", "HSN Group expansion plan.")) + "</td></tr>";
  }).join("");


  /* ---------- 資料查證：每條公開事實的查證紀錄（資料：verify.js） ---------- */
  var VS = { verified: ["已核實", "Verified"], single: ["單一來源", "Single source"], conflict: ["來源衝突", "Conflicting sources"], notfound: ["查無可靠來源", "Not found"], internal: ["內部文件", "Internal document"], pending: ["待內部確認", "Pending internal confirmation"], standard: ["通用名詞", "Standard term"] };
  var verFilter = "all";
  function vsTag(st) { var v = VS[st] || VS.pending; return '<span class="vs ' + st + '">' + B(v[0], v[1]) + "</span>"; }
  function verSrc(x) {
    if (!x) return '<span class="no">—</span>';
    if (!x.u) return esc(x.t) + (x.p ? "<small>" + esc(x.p) + "</small>" : "");
    return '<a href="' + esc(x.u) + '" target="_blank" rel="noopener">' + esc(x.t) + "</a><small>" + esc(x.p) + (x.d ? " · " + esc(x.d) : "") + "</small>";
  }
  function renderVer() {
    var V = window.PAP_VER || [], n = 0;
    $("ver-body").innerHTML = V.map(function (r) {
      var show = verFilter === "all" || r.status === verFilter;
      if (show) n++;
      return "<tr" + (show ? "" : ' class="hide"') + ' id="ver-' + r.id + '"><td class="co">' + esc(r.co) + "</td><td>" + B(esc(r.zh), esc(r.en)) + "</td><td>" + B(esc(r.vz), esc(r.ve)) +
        "</td><td>" + verSrc(r.s1) + "</td><td>" + verSrc(r.s2) + (r.more && r.more.length ? "<small>" + B("另 " + r.more.length + " 個來源", r.more.length + " more") + "</small>" : "") +
        "</td><td>" + vsTag(r.status) + "</td><td>" + (r.nz || r.ne ? B(esc(r.nz), esc(r.ne)) : '<span class="no">—</span>') + "</td><td>" + esc(r.date) + "</td></tr>";
    }).join("");
    $("ver-count").innerHTML = B(n + " / " + V.length + " 條", n + " of " + V.length);
    $$("#ver-filter .btn").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-vs") === verFilter); });
  }
  (function () {
    var V = window.PAP_VER || [], counts = {};
    V.forEach(function (r) { counts[r.status] = (counts[r.status] || 0) + 1; });
    $("ver-filter").innerHTML = '<button class="btn sm" type="button" data-vs="all">' + B("全部", "All") + " · " + V.length + "</button>" + Object.keys(VS).filter(function (k) { return counts[k]; }).map(function (k) {
      return '<button class="btn sm" type="button" data-vs="' + k + '">' + B(VS[k][0], VS[k][1]) + " · " + counts[k] + "</button>";
    }).join("");
    $("ver-filter").addEventListener("click", function (e) { var b = e.target.closest ? e.target.closest("[data-vs]") : null; if (!b) return; verFilter = b.getAttribute("data-vs"); renderVer(); });
    renderVer();
  })();

  /* ---------- 企業架構圖（資料：org.js） ---------- */
  var ORG = window.PAP_ORG, LAY = ORG ? ORG.layout : null, POS = {}, orgSel = null, orgReady = false;
  var ORG_V = { k: 1, x: 0, y: 0 }, ORG_BOX = { w: 0, h: 0 };
  var SZ = { company: [164, 50], region: [120, 48], ro: [176, 70], ns: [134, 46], unit: [128, 40], country: [128, 38], dept: [144, 46], odm: [164, 48], hsn: [138, 42], partner: [164, 46], group: [170, 30], acer: [196, 66] };
  var TYPE_NAME = { company: ["法人公司", "Company"], region: ["區域", "Region"], ro: ["區域辦公室", "Regional office"], ns: ["國家子公司", "Nation subsidiary"], unit: ["下轄單位", "Unit"], country: ["代管國家", "Covered country"], dept: ["總部單位", "Headquarters unit"], odm: ["外部代工廠", "External manufacturer"], hsn: ["HSN 集團公司", "HSN Group company"], partner: ["服務夥伴", "Service partner"], group: ["分組", "Group"], acer: ["集團母公司", "Parent company"] };
  var GAP = { row: 18, list: 8, v: 34, indent: 22 };
  // 節點寬度依目前語言的文字計算（字不超出框框）
  function orgTextW(t, px, mono) { var w = 0; for (var i = 0; i < t.length; i++) { var c = t.charAt(i); w += /[⺀-鿿＀-￯]/.test(c) ? px * 1.02 : mono ? px * .62 : /[A-Z]/.test(c) ? px * .68 : c === " " ? px * .3 : px * .54; } return w; }
  function orgSize(n) {
    var base = SZ[n.id === "acer" ? "acer" : n.type] || SZ.company, w = base[0], h = base[1];
    if (n.type === "group") return [Math.max(w, orgTextW(nm(n.zh, n.en), 12) + 8), h];
    var tx = (n.cc && n.type !== "ro" && n.id !== "acer") ? 30 : (n.id === "acer" ? 80 : 10), big = n.type === "ro" || n.id === "acer";
    var name = nm(n.zh, n.en), need = Math.max(n.code ? orgTextW(n.code, big ? (n.type === "ro" ? 19 : 15) : 13, true) : 0, orgTextW(name, 11.5), n.sub && big ? orgTextW(nm(n.sub[0], n.sub[1]), 9) : 0);
    return [Math.max(w, Math.ceil(tx + need + 12)), h];
  }
  function orgMeasure(id) {
    var n = ORG.byId[id], sz = orgSize(n), spec = LAY.kids[id], m = { w: sz[0], h: sz[1], nw: sz[0], nh: sz[1] };
    if (spec) {
      var kids = spec.kids.map(orgMeasure);
      if (spec.mode === "row") {
        var kw = 0, kh = 0; kids.forEach(function (k, i) { kw += k.w + (i ? GAP.row : 0); kh = Math.max(kh, k.h); });
        m.kw = kw; m.w = Math.max(sz[0], kw); m.h = sz[1] + GAP.v + kh;
      } else if (spec.mode === "cols") {
        var per = Math.ceil(kids.length / spec.cols), cw = [], ch = [];
        for (var c = 0; c < spec.cols; c++) { cw[c] = 0; ch[c] = 0; }
        kids.forEach(function (k, i) { var c = Math.floor(i / per); cw[c] = Math.max(cw[c], k.w); ch[c] += k.h + GAP.list; });
        m.cw = cw; m.per = per; m.w = Math.max(sz[0], GAP.indent + cw.reduce(function (a, b) { return a + b + GAP.row; }, 0) - GAP.row); m.h = sz[1] + 14 + Math.max.apply(null, ch);
      } else {
        var mw = 0, hh = 0; kids.forEach(function (k) { mw = Math.max(mw, k.w); hh += k.h + GAP.list; });
        m.w = Math.max(sz[0], GAP.indent + mw); m.h = sz[1] + hh;
      }
    }
    POS[id] = m; return m;
  }
  function orgPlace(id, x, y) {
    var m = POS[id], spec = LAY.kids[id];
    m.x = (!spec || spec.mode === "row") ? x + (m.w - m.nw) / 2 : x; m.y = y;
    if (!spec) return;
    if (spec.mode === "row") { var cx = x + (m.w - m.kw) / 2; spec.kids.forEach(function (k) { orgPlace(k, cx, y + m.nh + GAP.v); cx += POS[k].w + GAP.row; }); }
    else if (spec.mode === "cols") {
      var colX = [], xx = x + GAP.indent; m.cw.forEach(function (w) { colX.push(xx); xx += w + GAP.row; });
      var cys = colX.map(function () { return y + m.nh + 14 + GAP.list; });
      spec.kids.forEach(function (k, i) { var c = Math.floor(i / m.per); orgPlace(k, colX[c], cys[c]); cys[c] += POS[k].h + GAP.list; });
      m.colX = colX;
    }
    else { var cy = y + m.nh + GAP.list; spec.kids.forEach(function (k) { orgPlace(k, x + GAP.indent, cy); cy += POS[k].h + GAP.list; }); }
  }
  var orgParent = {};
  function orgLayout() {
    POS = {}; orgParent = {};
    Object.keys(LAY.kids).forEach(function (pid) { LAY.kids[pid].kids.forEach(function (k) { orgParent[k] = pid; }); });
    var L = orgMeasure(LAY.left), T = orgMeasure(LAY.root), R = orgMeasure(LAY.right);
    var pad = 24, colGap = 70, top = pad;
    var papY = POS[LAY.root].nh + GAP.v + POS["g-reg"].nh + GAP.v;   // 區域列的高度，側欄對齊此高度
    orgPlace(LAY.left, pad, top + papY);
    orgPlace(LAY.root, pad + L.w + colGap, top);
    orgPlace(LAY.right, pad + L.w + colGap + T.w + colGap, top + papY);
    ORG_BOX.w = pad * 2 + L.w + T.w + R.w + colGap * 2;
    ORG_BOX.h = pad * 2 + Math.max(T.h, papY + L.h, papY + R.h);
  }
  function orgCenter(id, side) {
    var m = POS[id];
    if (side === "top") return [m.x + m.nw / 2, m.y];
    if (side === "bottom") return [m.x + m.nw / 2, m.y + m.nh];
    if (side === "left") return [m.x, m.y + m.nh / 2];
    return [m.x + m.nw, m.y + m.nh / 2];
  }
  function orgNodeSVG(n) {
    var m = POS[n.id], w = m.nw, h = m.nh, cls = "on t-" + (n.id === "acer" ? "acer" : n.type) + (n.planned ? " planned" : "") + (orgParent[n.id] === "g-fam" ? " fam" : "");
    var out = '<g class="' + cls + '" data-id="' + n.id + '" transform="translate(' + m.x.toFixed(1) + "," + m.y.toFixed(1) + ')" tabindex="0" role="button" aria-label="' + esc(n.code || n.en) + '">';
    if (n.type === "group") {
      out += '<text x="0" y="14">' + esc(nm(n.zh, n.en)) + "</text>" + '<line x1="0" y1="22" x2="' + w + '" y2="22"></line>';
      return out + "</g>";
    }
    out += '<rect class="box" x="0" y="0" width="' + w + '" height="' + h + '" rx="11"></rect>';
    var tx = 10, big = n.type === "ro" || n.id === "acer";
    if (n.cc && n.type !== "ro" && n.id !== "acer") { out += '<image href="flags/' + n.cc + '.svg" x="8" y="' + ((h - 11) / 2 - (n.type === "country" ? 0 : 7)).toFixed(1) + '" width="16" height="11" preserveAspectRatio="xMidYMid slice"></image>'; tx = 30; }
    if (n.id === "acer") { out += '<image href="logos/acer.svg" x="12" y="' + ((h - 22) / 2).toFixed(1) + '" width="58" height="22" preserveAspectRatio="xMidYMid meet" onerror="this.remove()"></image>'; tx = 80; }
    var name = function (cls2, y) { return '<text class="' + cls2 + '" x="' + tx + '" y="' + y + '">' + esc(nm(n.zh, n.en)) + "</text>"; };
    if (n.type === "country" || (!n.code)) out += name("", h / 2 + 4);
    else if (big) {
      out += '<text class="code" x="' + tx + '" y="' + (n.type === "ro" ? 24 : 22) + '">' + esc(n.code) + "</text>" + name("", n.type === "ro" ? 40 : 38);
      if (n.sub) out += '<text class="sub" x="' + tx + '" y="' + (n.type === "ro" ? 55 : 53) + '">' + esc(nm(n.sub[0], n.sub[1])) + "</text>";
    } else {
      out += '<text class="code" x="' + tx + '" y="' + (h / 2 - 3) + '">' + esc(n.code) + "</text>" + name("", h / 2 + 11);
    }
    if (n.vs === "pending" || n.vs === "notfound" || n.vs === "conflict") out += '<g class="badge"><title>' + nm("待確認 Pending verification", "Pending verification") + '</title><circle cx="' + (w - 1) + '" cy="1" r="7"></circle><text x="' + (w - 1) + '" y="4.5" text-anchor="middle">?</text></g>';
    return out + "</g>";
  }
  function orgTreeEdges() {
    var out = "";
    Object.keys(LAY.kids).forEach(function (pid) {
      var spec = LAY.kids[pid], pm = POS[pid], kind = spec.kind || "own";
      if (spec.mode === "row") {
        var b = orgCenter(pid, "bottom"), mid = b[1] + GAP.v / 2;
        spec.kids.forEach(function (k) {
          var t = orgCenter(k, "top"), pend = /pending|notfound|conflict/.test(ORG.byId[k].vs);
          out += '<path class="e-' + kind + (pend ? " e-pending" : "") + '" data-a="' + pid + '" data-b="' + k + '" d="M' + b[0].toFixed(1) + " " + b[1].toFixed(1) + " V" + mid.toFixed(1) + " H" + t[0].toFixed(1) + " V" + t[1].toFixed(1) + '"></path>';
        });
      } else if (spec.mode === "cols") {
        var bus = pm.y + pm.nh + 10, bc = orgCenter(pid, "bottom"), sx = pm.colX.map(function (cx) { return cx - 11; });
        out += '<path class="e-own" data-a="' + pid + '" data-b="' + pid + '" d="M' + bc[0].toFixed(1) + " " + bc[1].toFixed(1) + " V" + bus + " M" + sx[0] + " " + bus + " H" + sx[sx.length - 1] + '"></path>';
        spec.kids.forEach(function (k, i) {
          var km = POS[k], ky = km.y + km.nh / 2, c = Math.floor(i / pm.per), pend = /pending|notfound|conflict/.test(ORG.byId[k].vs);
          out += '<path class="e-own' + (pend ? " e-pending" : "") + '" data-a="' + pid + '" data-b="' + k + '" d="M' + sx[c] + " " + bus + " V" + ky.toFixed(1) + " H" + km.x.toFixed(1) + '"></path>';
        });
      } else {
        var x = pm.x + 11, y0 = pm.y + pm.nh;
        spec.kids.forEach(function (k) {
          var km = POS[k], ky = km.y + km.nh / 2, pend = /pending|notfound|conflict/.test(ORG.byId[k].vs);
          out += '<path class="e-' + kind + (pend ? " e-pending" : "") + '" data-a="' + pid + '" data-b="' + k + '" d="M' + x + " " + y0.toFixed(1) + " V" + ky.toFixed(1) + " H" + km.x.toFixed(1) + '"></path>';
        });
      }
    });
    return out;
  }
  function orgExtraEdges() {
    var out = "";
    ORG.edges.forEach(function (e, i) {
      var A = POS[e.from], Bm = POS[e.to];
      if (!A || !Bm) return;
      var a, b;
      if (e.toSpine) { a = orgCenter(e.from, A.x > Bm.x ? "left" : "right"); b = [Bm.colX ? Bm.colX[Bm.colX.length - 1] - 11 : Bm.x + 11, Bm.y + Bm.nh + 10]; }
      else if (Bm.x > A.x + A.nw + 10) { a = orgCenter(e.from, "right"); b = orgCenter(e.to, "left"); }
      else if (Bm.x + Bm.nw + 10 < A.x) { a = orgCenter(e.from, "left"); b = orgCenter(e.to, "right"); }
      else if (Bm.y > A.y) { a = orgCenter(e.from, "bottom"); b = orgCenter(e.to, "top"); }
      else { a = orgCenter(e.from, "top"); b = orgCenter(e.to, "bottom"); }
      var dx = (b[0] - a[0]) * .45, dy = (b[1] - a[1]) * .3, horiz = Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]);
      var d = horiz ? "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " C" + (a[0] + dx).toFixed(1) + " " + a[1].toFixed(1) + " " + (b[0] - dx).toFixed(1) + " " + b[1].toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1)
        : "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " C" + a[0].toFixed(1) + " " + (a[1] + dy * 2).toFixed(1) + " " + b[0].toFixed(1) + " " + (b[1] - dy * 2).toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1);
      var pend = /pending|notfound|conflict/.test(e.vs);
      out += '<path class="e-' + e.kind + (pend ? " e-pending" : "") + '" data-a="' + e.from + '" data-b="' + e.to + '" d="' + d + '"><title>' + esc(nm(e.label[0], e.label[1])) + "</title></path>";
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, lab = nm(e.label[0], e.label[1]), lw = labelW(lab) * .72 + 8;
      out += '<g class="elab" data-a="' + e.from + '" data-b="' + e.to + '"><rect x="' + (mx - lw / 2).toFixed(1) + '" y="' + (my - 7).toFixed(1) + '" width="' + lw.toFixed(1) + '" height="13" rx="3"></rect><text x="' + mx.toFixed(1) + '" y="' + (my + 3).toFixed(1) + '" text-anchor="middle">' + esc(lab) + "</text></g>";
    });
    return out;
  }
  function orgRender() {
    if (!ORG || !$("org-g")) return;
    orgLayout();
    $("org-g").innerHTML = orgTreeEdges() + ORG.nodes.filter(function (n) { return POS[n.id]; }).map(orgNodeSVG).join("");
    $("org-jump").innerHTML = '<option value="">' + nm("前往節點…", "Go to node…") + "</option>" + Object.keys(TYPE_NAME).filter(function (t) { return t !== "group" && t !== "acer"; }).map(function (t) {
      var items = ORG.nodes.filter(function (n) { return n.type === t && POS[n.id]; });
      return items.length ? '<optgroup label="' + esc(nm(TYPE_NAME[t][0], TYPE_NAME[t][1])) + '">' + items.map(function (n) { return '<option value="' + n.id + '">' + esc((n.code ? n.code + " · " : "") + nm(n.zh, n.en)) + "</option>"; }).join("") + "</optgroup>" : "";
    }).join("");
    orgApply();
    if (orgSel) orgMark(orgSel);
    orgReady = true;
  }
  function orgApply() { $("org-g").setAttribute("transform", "translate(" + ORG_V.x.toFixed(1) + "," + ORG_V.y.toFixed(1) + ") scale(" + ORG_V.k.toFixed(3) + ")"); }
  function orgFit() {
    var st = $("org-stage"); if (!st || !ORG_BOX.w) return;
    var W = st.clientWidth, H = st.clientHeight; if (!W) return;
    var k = Math.min(1.1, (W - 16) / ORG_BOX.w, (H - 16) / ORG_BOX.h);
    ORG_V = { k: k, x: (W - ORG_BOX.w * k) / 2, y: (H - ORG_BOX.h * k) / 2 };
    orgApply();
  }
  // 預設視圖：以可讀的比例顯示 Acer → 區域 → PAP 的核心
  function orgHome() {
    var st = $("org-stage"); if (!st || !ORG_BOX.w) return;
    var W = st.clientWidth, H = st.clientHeight, fit = Math.min(1.1, (W - 16) / ORG_BOX.w, (H - 16) / ORG_BOX.h);
    var k = Math.max(fit, W < 600 ? .62 : .72), pm = POS.pap, am = POS.acer;
    ORG_V = { k: k, x: W / 2 - (pm.x + pm.nw / 2) * k, y: 14 - (am.y - 8) * k };
    orgApply();
  }
  function orgZoom(f, cx, cy) {
    var st = $("org-stage"); cx = cx === undefined ? st.clientWidth / 2 : cx; cy = cy === undefined ? st.clientHeight / 2 : cy;
    var k = Math.min(3, Math.max(.25, ORG_V.k * f)), r = k / ORG_V.k;
    ORG_V = { k: k, x: cx - (cx - ORG_V.x) * r, y: cy - (cy - ORG_V.y) * r };
    orgApply();
  }
  function orgMark(id) {
    orgSel = id;
    var rel = {}; rel[id] = 1;
    $$("#org-g path[data-a], #org-g .elab").forEach(function (e) {
      var on = e.getAttribute("data-a") === id || e.getAttribute("data-b") === id;
      if (on) { rel[e.getAttribute("data-a")] = 1; rel[e.getAttribute("data-b")] = 1; }
      e.classList.toggle("hi", on && e.tagName === "path"); e.classList.toggle("edim", !on);
    });
    $$("#org-g .on").forEach(function (g) { var i = g.getAttribute("data-id"); g.classList.toggle("sel", i === id); g.classList.toggle("dim", !rel[i] && orgParent[i] !== id && orgParent[id] !== i); });
  }
  function orgClear() { orgSel = null; $$("#org-g .hi, #org-g .edim, #org-g .sel, #org-g .dim").forEach(function (e) { e.classList.remove("hi", "edim", "sel", "dim"); }); $("org-panel").hidden = true; }
  function orgSelect(id) {
    if (!orgReady) orgRender();
    var n = ORG.byId[id]; if (!n) return;
    orgMark(id); orgPanel(n);
    // 將節點移到視窗中央（保留目前縮放）
    var st = $("org-stage"), m = POS[id];
    if (st && m) { ORG_V.x = st.clientWidth / 2 - (m.x + m.nw / 2) * ORG_V.k; ORG_V.y = st.clientHeight / 2 - (m.y + m.nh / 2) * ORG_V.k; orgApply(); }
  }
  function orgPanel(n) {
    var pn = $("org-panel"), rows = [], kids = (LAY.kids[n.id] || { kids: [] }).kids, par = orgParent[n.id];
    var typeName = TYPE_NAME[n.id === "acer" ? "acer" : n.type];
    var logoBox = n.logo ? '<span class="logo-box sm" data-logo="' + n.logo + '" data-pz="Logo 待補" data-pe="Logo pending"><span class="initial">' + esc((n.zh || n.en).charAt(0)) + "</span></span>" : "";
    rows.push([B("名稱", "Name"), "<b>" + esc(n.zh) + "</b><br>" + esc(n.en) + (n.official ? '<br><small class="caption">' + esc(n.official) + "</small>" : "")]);
    if (logoBox) rows.push(["Logo", logoBox]);
    rows.push([B("組織類型", "Type"), '<span class="chip rg">' + B(typeName[0], typeName[1]) + "</span>"]);
    if (par && ORG.byId[par]) {
      var pp = ORG.byId[par], kind = (LAY.kids[par].kind || "own"), kn = { own: ["組織隸屬／持股", "Reporting line / ownership"], spin: ["分拆後獨立（歷史關係）", "Independent since the split (historical)"] }[kind];
      rows.push([B("上層單位", "Parent"), '<button type="button" class="org-par" data-org-go="' + par + '">' + esc(nm(pp.zh, pp.en)) + "</button> <small class=\"caption\">" + B(kn[0], kn[1]) + "</small> " + vsChip(n.vs)]);
    }
    if (kids.length) rows.push([B("下屬單位", "Units below"), '<div class="org-kids">' + kids.map(function (k) { var kk = ORG.byId[k]; return '<button type="button" data-org-go="' + k + '">' + esc(kk.code || nm(kk.zh, kk.en)) + "</button>"; }).join("") + "</div>"]);
    var place = "";
    if (n.cc && CNAME[n.cc]) place += flag(n.cc) + B(CNAME[n.cc][0], CNAME[n.cc][1]);
    if (n.region) place += (place ? " " : "") + '<span class="chip rg">' + B("區域 ", "Region ") + esc(n.region) + "</span>";
    if (place) rows.push([B("國家／區域", "Country / region"), place]);
    rows.push([B("業務角色", "Business role"), B(esc(n.role[0]), esc(n.role[1]))]);
    if (n.type === "ns" && n.cc && INFRA_BY[n.cc]) rows.push([B("據點", "Sites"), sitesLine(n.cc)]);
    var rel = ORG.edges.filter(function (e) { return e.from === n.id || e.to === n.id; });
    if (rel.length) rows.push([B("其他關係", "Other links"), '<ul class="src-list">' + rel.map(function (e) {
      var other = ORG.byId[e.from === n.id ? e.to : e.from], kn = { collab: ["協作", "Collaboration"], proc: ["採購流程", "Procurement"], spin: ["分拆", "Spin-off"] }[e.kind];
      return "<li>" + B(kn[0], kn[1]) + "：<button type=\"button\" class=\"org-par\" data-org-go=\"" + other.id + "\">" + esc(nm(other.zh, other.en)) + "</button> <small>" + B(esc(e.label[0]), esc(e.label[1])) + "</small> " + (/pending|notfound|conflict/.test(e.vs) ? vsChip(e.vs) : "") + "</li>";
    }).join("") + "</ul>"]);
    if (n.flows && n.flows.length) rows.push([B("相關流程", "Related processes"), '<div class="pop-acts">' + n.flows.map(function (f) { return '<button class="btn sm" type="button" data-go="' + f[2] + '">' + B(f[0], f[1]) + " →</button>"; }).join("") + "</div>"]);
    rows.push([B("資料來源", "Sources"), srcList({ urls: n.src })]);
    rows.push([B("查證狀態", "Verification"), vsChip(n.vs) + (n.note ? ' <small class="caption">' + B(esc(n.note[0]), esc(n.note[1])) + "</small>" : "")]);
    var acts = (n.ab && AB_BY[n.ab] ? '<button class="btn sm ab" type="button" data-ab="' + n.ab + '">' + B("代碼說明", "Code details") + "</button>" : "") + (n.code && officeIdx(n.code) >= 0 ? '<button class="btn sm" type="button" data-office-go="' + officeIdx(n.code) + '">' + B("據點資料 →", "Office details →") + "</button>" : "");
    pn.innerHTML = '<header><div><b>' + esc(n.code || nm(n.zh, n.en)) + "</b><small>" + B(esc(n.zh), esc(n.en)) + '</small></div><button type="button" aria-label="close" data-org-close>✕</button></header><div class="org-in"><dl class="kvl">' +
      rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl>" + (acts ? '<div class="pop-acts">' + acts + "</div>" : "") + "</div>";
    pn.hidden = false;
    $$(".logo-box[data-logo]", pn).forEach(function (box) { var id = box.getAttribute("data-logo"); if (LOGOS[id]) setLogo(box, id); else probeLogo(id, function (src) { if (src) setLogo(box, id, src); }); });
  }
  (function () {
    var st = $("org-stage"); if (!st || !ORG) return;
    $("org-legend").innerHTML = [["l-ro", "區域辦公室（PAP）", "Regional office (PAP)"], ["l-region", "區域", "Region"], ["l-ns", "國家子公司", "Nation subsidiary"], ["l-unit", "代管國家／下轄單位", "Covered country / unit"], ["", "法人公司（宏碁持股）", "Company (Acer-controlled)"], ["l-fam", "分拆後獨立", "Independent since the split"], ["l-dept", "總部單位", "Headquarters unit"], ["l-odm", "外部代工廠", "External manufacturer"], ["l-partner", "服務夥伴", "Service partner"]]
      .map(function (l) { return '<span class="lg"><i class="' + l[0] + '"></i>' + B(l[1], l[2]) + "</span>"; }).join("") +
      [["", "組織隸屬／持股", "Reporting line / ownership"], ["l-collab", "跨部門協作", "Cross-unit collaboration"], ["l-proc", "採購流程", "Procurement flow"], ["l-spin", "分拆／整併（歷史）", "Spin-off / merger (historical)"], ["l-pend", "未經證實（Pending Verification）", "Pending verification"]]
      .map(function (l) { return '<span class="lg"><s class="' + l[0] + '"></s>' + B(l[1], l[2]) + "</span>"; }).join("") + '<span class="lg"><b class="q">?</b>' + B("待確認的節點", "Node pending verification") + "</span>";
    var drag = null, pts = {}, pinch = null;
    st.addEventListener("pointerdown", function (e) { if (e.target.closest("button")) return; st.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY]; var ids = Object.keys(pts); if (ids.length === 1) { drag = { x: e.clientX, y: e.clientY, vx: ORG_V.x, vy: ORG_V.y, moved: false }; st.classList.add("drag"); } else if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k: ORG_V.k }; drag = null; } });
    st.addEventListener("pointermove", function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(pts);
      if (pinch && ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]), r = st.getBoundingClientRect(); orgZoom((pinch.k * d / pinch.d) / ORG_V.k, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); return; }
      if (drag) { var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true; ORG_V.x = drag.vx + dx; ORG_V.y = drag.vy + dy; orgApply(); }
    });
    var up = function (e) { delete pts[e.pointerId]; if (!Object.keys(pts).length) { pinch = null; st.classList.remove("drag"); } if (drag && !drag.moved) { var g = e.target.closest ? e.target.closest(".on") : null; if (g) orgSelect(g.getAttribute("data-id")); else if (!e.target.closest("button")) orgClear(); } drag = null; };
    st.addEventListener("pointerup", up); st.addEventListener("pointercancel", up);
    st.addEventListener("wheel", function (e) { e.preventDefault(); var r = st.getBoundingClientRect(); orgZoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    st.addEventListener("keydown", function (e) { if (e.key !== "Enter" && e.key !== " ") return; var g = e.target.closest ? e.target.closest(".on") : null; if (g) { e.preventDefault(); orgSelect(g.getAttribute("data-id")); } });
    document.addEventListener("click", function (e) {
      var t = e.target, b = t.closest ? t.closest("[data-org]") : null;
      if (b) { var a = b.getAttribute("data-org"); if (a === "in") orgZoom(1.25); else if (a === "out") orgZoom(1 / 1.25); else if (a === "fit") orgFit(); else orgHome(); return; }
      if (t.closest && t.closest("[data-org-close]")) { orgClear(); return; }
      var g = t.closest ? t.closest("#org-panel [data-org-go], .pop-acts [data-org-go]") : null;
      if (g && t.closest("#org-panel")) { orgSelect(g.getAttribute("data-org-go")); }
    });
    window.addEventListener("resize", function () { if (orgReady && $("sub-corp-map").classList.contains("active")) orgHome(); });
    $("org-jump").addEventListener("change", function () { if (this.value) { orgSelect(this.value); this.value = ""; } });
  })();


  /* ---------- 一件備品的旅程：手繪插畫站點（2.2px 墨線，同一組色） ---------- */
  (function () {
    var INK = "#4a3226", Y = "#F4C84A", B2 = "#CFE4F4", G = "#CFEBD9", C = "#F6E7C8", R = "#F2A7A0";
    var ART = [
      // 1 需求規劃：寫字板與勾選清單
      '<svg viewBox="0 0 120 120"><path class="ln" d="M30 22 h60 a6 6 0 0 1 6 6 v70 a6 6 0 0 1 -6 6 h-60 a6 6 0 0 1 -6 -6 v-70 a6 6 0 0 1 6 -6z" fill="' + C + '"/><rect x="46" y="14" width="28" height="14" rx="5" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.2"/><path class="ln th" d="M40 46 h40 M40 60 h40 M40 74 h26"/><path class="ln" d="M33 44 l4 4 l7 -8" stroke="#2E8B57"/><path class="ln" d="M33 58 l4 4 l7 -8" stroke="#2E8B57"/><path class="ln" d="M33 72 l4 4 l7 -8" stroke="#2E8B57"/><path class="ln" d="M86 88 l10 -10 m-10 10 l-3 3" stroke="' + INK + '"/></svg>',
      // 2 採購下單：採購單與印章
      '<svg viewBox="0 0 120 120"><path class="ln" d="M28 18 h48 l16 16 v66 h-64z" fill="#fffdf7"/><path class="ln" d="M76 18 v16 h16" fill="' + C + '"/><path class="ln th" d="M38 48 h36 M38 60 h36 M38 72 h22"/><text x="40" y="38" font-family="Consolas,monospace" font-weight="700" font-size="11" fill="' + INK + '">PO</text><circle cx="80" cy="86" r="16" fill="' + R + '" stroke="' + INK + '" stroke-width="2.2"/><circle cx="80" cy="86" r="10" fill="none" stroke="#fffdf7" stroke-width="1.6" stroke-dasharray="3 2"/><path class="ln" d="M74 86 l4 4 l8 -9" stroke="#fffdf7"/></svg>',
      // 3 倉儲與料號：倉庫與紙箱
      '<svg viewBox="0 0 120 120"><path class="ln" d="M14 52 L60 24 L106 52 V96 H14z" fill="' + C + '"/><path class="ln" d="M14 52 h92" /><rect x="26" y="62" width="22" height="34" fill="' + B2 + '" stroke="' + INK + '" stroke-width="2.2"/><rect x="60" y="68" width="18" height="16" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.2"/><rect x="80" y="68" width="18" height="16" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.2"/><rect x="70" y="52" width="18" height="16" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.2"/><path class="ln th" d="M69 76 h-9 M89 76 h-9 M79 60 h-9"/><path class="ln th" d="M30 70 h14 M30 78 h14 M30 86 h14"/></svg>',
      // 4 供應各國：飛機與路線
      '<svg viewBox="0 0 120 120"><path class="ln th" d="M14 96 C 40 70, 70 70, 106 40" stroke-dasharray="4 4"/><circle cx="14" cy="96" r="5" fill="' + G + '" stroke="' + INK + '" stroke-width="2.2"/><circle cx="106" cy="40" r="5" fill="' + G + '" stroke="' + INK + '" stroke-width="2.2"/><g transform="translate(60 62) rotate(-30)"><path class="ln" d="M-26 0 h40 l12 -6 l-4 6 l4 6 l-12 -6 h-40 a6 6 0 0 1 0 -12 z" fill="' + B2 + '"/><path class="ln" d="M-8 -6 l-10 -14 h8 l12 14 M-8 6 l-10 14 h8 l12 -14" fill="' + B2 + '"/><circle cx="-2" cy="-1" r="2" fill="' + INK + '"/><circle cx="6" cy="-1" r="2" fill="' + INK + '"/></g><rect x="78" y="86" width="20" height="14" rx="2" fill="' + Y + '" stroke="' + INK + '" stroke-width="2.2"/><path class="ln th" d="M88 86 v14 M78 92 h20"/></svg>',
      // 5 維修服務：筆電與扳手
      '<svg viewBox="0 0 120 120"><path class="ln" d="M28 36 h56 a4 4 0 0 1 4 4 v36 h-64 v-36 a4 4 0 0 1 4 -4z" fill="' + B2 + '"/><path class="ln" d="M16 76 h88 l-6 10 h-76z" fill="' + C + '"/><rect x="34" y="44" width="44" height="26" rx="2" fill="#fffdf7" stroke="' + INK + '" stroke-width="1.5"/><path class="ln" d="M46 62 l8 -8 l6 6 l10 -12" stroke="#2E8B57"/><g transform="translate(88 30) rotate(35)"><path class="ln" d="M-4 -22 a8 8 0 1 1 8 0 l-1 30 h-6z" fill="' + Y + '"/></g><path class="ln" d="M100 92 l6 -6 l5 5 l-6 6z" fill="' + R + '"/></svg>'
    ];
    $$("ol.journey > li").forEach(function (li, i) {
      var pi = li.querySelector(".pi");
      if (pi && ART[i]) pi.insertAdjacentHTML("afterend", '<span class="jart" aria-hidden="true">' + ART[i] + "</span>");
    });
  })();
  /* ---------- 每一章一隻：布偶貓或柯基從標題底線探出頭（畫法與 UPS Reprice 平台相同） ---------- */
  (function () {
    var INK = "#4a3226";
    function catPeek(prop) {
      return '<svg class="mz mz-cat" viewBox="0 0 64 40" aria-hidden="true"><g class="mz-body"><path class="fur" d="M14 36 q0 -5 5 -5 q5 0 5 5 z"/><path class="fur" d="M28 36 q0 -5 5 -5 q5 0 5 5 z"/><path class="ln" d="M17 34 v2 M19.5 33.5 v2.5 M31 34 v2 M33.5 33.5 v2.5" stroke-width="1.1"/><g class="mz-head"><path class="fur" d="M9 26 q-1 -12 10 -15 q7 -2 14 0 q11 3 10 15 q-1 8 -17 8 q-16 0 -17 -8 z"/><path class="pt" d="M12 18 l-2.5 -10 l8.5 5 z"/><path class="pt" d="M40 18 l2.5 -10 l-8.5 5 z"/><path class="innr" d="M12.6 16.4 l-1.4 -5.6 l4.6 2.8 z M39.4 16.4 l1.4 -5.6 l-4.6 2.8 z"/><path class="pt" d="M17 20 q9 -6 18 0 q-2 5 -6 6 l-3 -4 l-3 4 q-4 -1 -6 -6 z" opacity=".55"/><g class="mz-eyes"><ellipse cx="20" cy="23" rx="2.4" ry="2.9" fill="#4f86c6" stroke="' + INK + '" stroke-width="1.2"/><ellipse cx="32" cy="23" rx="2.4" ry="2.9" fill="#4f86c6" stroke="' + INK + '" stroke-width="1.2"/><circle cx="20.8" cy="22" r=".8" fill="#fff"/><circle cx="32.8" cy="22" r=".8" fill="#fff"/></g><path class="mz-lid" d="M17.4 23 q2.6 -2.6 5.2 0 M29.4 23 q2.6 -2.6 5.2 0"/><path class="innr" d="M24.6 27 h2.8 l-1.4 1.6 z"/><path class="ln" d="M26 28.6 q-1.5 1.8 -3 .4 M26 28.6 q1.5 1.8 3 .4" stroke-width="1.1"/><path class="ln" d="M13 26 h-5 M13.5 28.5 h-4.5 M39 26 h5 M38.5 28.5 h4.5" stroke-width="1" opacity=".7"/></g></g>' + (prop || "") + "</svg>";
    }
    function dogPeek(prop) {
      return '<svg class="mz mz-dog" viewBox="0 0 64 40" aria-hidden="true"><g class="mz-body"><path class="fur" d="M14 36 q0 -5 5 -5 q5 0 5 5 z"/><path class="fur" d="M28 36 q0 -5 5 -5 q5 0 5 5 z"/><path class="ln" d="M17 34 v2 M19.5 33.5 v2.5 M31 34 v2 M33.5 33.5 v2.5" stroke-width="1.1"/><g class="mz-head"><path class="fur" d="M9 27 q-1 -12 10 -15 q7 -2 14 0 q11 3 10 15 q-1 7 -17 7 q-16 0 -17 -7 z"/><path class="fur" d="M12 17 q-5 -8 -2 -13 q6 2 8 9 z"/><path class="flop mz-flop" d="M37 15 q8 -6 10 0 q1 6 -8 8 q-3 0 -2 -8 z"/><path class="snout" d="M19 24 q7 -5 14 0 q4 6 -1 9 q-6 2 -12 0 q-5 -3 -1 -9 z"/><g class="mz-eyes"><circle cx="20" cy="22.5" r="1.8" fill="' + INK + '"/><circle cx="32" cy="22.5" r="1.8" fill="' + INK + '"/><circle cx="20.6" cy="21.8" r=".6" fill="#fff"/><circle cx="32.6" cy="21.8" r=".6" fill="#fff"/></g><path class="mz-lid" d="M17.8 22.5 q2.2 -2 4.4 0 M29.8 22.5 q2.2 -2 4.4 0"/><circle cx="26" cy="27.5" r="2.1" fill="' + INK + '"/><path class="ln" d="M26 29.4 v1.6 M26 31 q-1.8 1.6 -3.4 0 M26 31 q1.8 1.6 3.4 0" stroke-width="1.1"/><path class="collar" d="M15 34.5 q11 4 22 0" stroke-width="2.4"/></g></g>' + (prop || "") + "</svg>";
    }
    var PROP = {
      ledger: '<g class="mz-prop"><rect x="45" y="22" width="15" height="12" rx="1.6" fill="#fffdf7" stroke="' + INK + '" stroke-width="1.6"/><rect x="45" y="19" width="15" height="12" rx="1.6" fill="#ffdd8f" stroke="' + INK + '" stroke-width="1.6"/><path d="M48 23 h9 M48 26 h6" stroke="' + INK + '" stroke-width="1" opacity=".7"/></g>',
      tag: '<g class="mz-prop"><path d="M47 22 l9 -4 l6 6 l-9 9 l-6 -6 z" fill="#ffdd8f" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><circle cx="56" cy="22.5" r="1.4" fill="#fffdf7" stroke="' + INK + '" stroke-width="1"/><path d="M49.5 25.5 l4 4" stroke="' + INK + '" stroke-width="1.2"/></g>',
      box: '<g class="mz-prop"><rect x="45" y="22" width="16" height="13" rx="1.5" fill="#ffb500" stroke="' + INK + '" stroke-width="1.6"/><path d="M53 22 v13" stroke="#fffdf7" stroke-width="2.4"/><path d="M53 22 v13" stroke="' + INK + '" stroke-width=".9" opacity=".6"/><path d="M45 26.5 H61" stroke="' + INK + '" stroke-width="1.1"/></g>',
      lens: '<g class="mz-prop"><circle cx="52" cy="25" r="6.5" fill="#e8f2fd" stroke="' + INK + '" stroke-width="1.8"/><path d="M56.8 29.8 l5 5" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M49 22.5 q1.5 -1.5 3 -1" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none"/></g>',
      invoice: '<g class="mz-prop"><path d="M46 19 h10 l5 5 v12 l-2 1.5 l-2 -1.5 l-2 1.5 l-2 -1.5 l-2 1.5 l-2 -1.5 l-2 1.5 l-1 -1 z" fill="#fffdf7" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M56 19 v5 h5" fill="#f7f1e4" stroke="' + INK + '" stroke-width="1.2"/><path d="M49 27 h8 M49 30 h5" stroke="' + INK + '" stroke-width="1" opacity=".7"/></g>',
      chart: '<g class="mz-prop"><path d="M45 35 h17" stroke="' + INK + '" stroke-width="1.4"/><rect x="46.5" y="29" width="3.5" height="6" fill="#ffdd8f" stroke="' + INK + '" stroke-width="1.2"/><rect x="51.5" y="24" width="3.5" height="11" fill="#ffb500" stroke="' + INK + '" stroke-width="1.2"/><rect x="56.5" y="19" width="3.5" height="16" fill="#8a6104" stroke="' + INK + '" stroke-width="1.2"/></g>',
      sheet: '<g class="mz-prop"><rect x="45" y="20" width="16" height="15" rx="1.5" fill="#fffdf7" stroke="' + INK + '" stroke-width="1.6"/><path d="M45 24.5 h16 M45 29 h16 M45 33.5 h16 M50.5 20 v15 M55.5 20 v15" stroke="' + INK + '" stroke-width=".9" opacity=".55"/><rect x="45" y="20" width="16" height="4.5" fill="#ffdd8f" stroke="' + INK + '" stroke-width="1.2"/></g>',
      plus: '<g class="mz-prop"><circle cx="53" cy="27" r="8" fill="#ffdd8f" stroke="' + INK + '" stroke-width="1.6"/><path d="M53 22.5 v9 M48.5 27 h9" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/></g>'
    };
    var PAGE_MASCOT = { intro: ["dog", "box"], overview: ["cat", "chart"], corp: ["cat", "ledger"], org: ["dog", "box"], ops: ["cat", "invoice"], hsn: ["dog", "lens"], ref: ["cat", "tag"], review: ["dog", "plus"] };
    var draw = function (k) { var m = PAGE_MASCOT[k]; return m ? (m[0] === "cat" ? catPeek : dogPeek)(PROP[m[1]]) : ""; };
    $$(".subnav").forEach(function (a) { var k = a.getAttribute("data-page"), pt = a.querySelector(".pt"); if (pt && draw(k)) pt.insertAdjacentHTML("beforeend", '<span class="mzwrap">' + draw(k) + "</span>"); });
    var singles = [["page-intro", ".intro-title", "intro"], ["page-overview", ".hero-title", "overview"], ["page-review", "h2.ptitle", "review"]];
    singles.forEach(function (x) { var el = document.querySelector("#" + x[0] + " " + x[1]); if (el) { el.classList.add("single-title"); el.insertAdjacentHTML("beforeend", '<span class="mzwrap">' + draw(x[2]) + "</span>"); } });
  })();
  /* ---------- 重點複習 ---------- */
  var QZ = [
    ["PAP 由哪兩個區域整併而成？", "Which two regions merged to form PAP?", "TWN（台灣）與 AAP（亞太），於 2016/2017 年整併。", "TWN (Taiwan) and AAP (Asia Pacific), in 2016/2017."],
    ["RO 與 NS 分別代表什麼？", "What do RO and NS stand for?", "RO：Regional Office（區域辦公室）；NS：Nation Subsidiary（國家子公司）。", "RO: Regional Office; NS: Nation Subsidiary."],
    ["哪些國家同時設有倉庫及 Uni-load？", "Which countries have both a warehouse and Uni-load?", "澳洲、印度、馬來西亞、泰國、印尼、新加坡，共 6 國。", "Australia, India, Malaysia, Thailand, Indonesia and Singapore (6 countries)."],
    ["料號 DG.B88SA.001 的第 6、7 碼分別代表什麼？", "What do the 6th and 7th characters of DG.B88SA.001 denote?", "第 6 碼 S 代表 AAP（RO），第 7 碼 A 代表 ACA（澳洲）；字元位置不計小數點。", "The 6th, S, denotes AAP (RO); the 7th, A, denotes ACA (Australia). Dots are not counted."],
    ["HFP 的定義為何？", "What is HFP?", "Hold For Part：因待料而延宕之維修案件（backorder）。", "Hold For Part: repair cases delayed while waiting for parts on backorder."],
    ["502/503 aging 衡量的是什麼？", "What does 502/503 aging measure?", "不良品滯留於 CSS 且尚未處理之時間。", "How long defective parts have been held in CSS without action."],
    ["Markup Review 未通過時，流程退回哪一步？", "Where does the flow return when the markup review fails?", "退回 ODM 重新提供未含價格之 SPL 草稿（步驟 03）。", "To the ODM for a new SPL draft without prices (step 03)."],
    ["SPL 應於何時發布予各 RO？", "When must the SPL be released to the ROs?", "FCS-1wk，即首次客戶出貨前一週。", "At FCS-1wk, one week before first customer shipment."],
    ["NS 使用哪些系統？", "Which systems do NS use?", "PLM、GLS、CSS；PLS 僅供 RO 使用。", "PLM, GLS and CSS; PLS is used by ROs only."],
    ["NPI 與 MP Service BOM 有何不同？", "How do the NPI and MP Service BOMs differ?", "NPI：FRU 會議後由 ODM 提供 FRU 清單草稿，審查後建立 Acer P/N。MP：由 ODM 每月定期更新。", "NPI: after the FRU meeting the ODM drafts the FRU list, and Acer P/Ns are created after review. MP: updated monthly by the ODM."],
    ["Create PO 與 Confirm PO to ODM 分別於哪個系統執行？", "In which systems are Create PO and Confirm PO to ODM done?", "Create PO 於 CSS；Confirm PO to ODM 於 PLS。", "Create PO in CSS; Confirm PO to ODM in PLS."],
    ["料號前兩碼為 86 代表何種子類別？", "Which sub-category does the prefix 86 denote?", "SCREW（螺絲），Product group Y9。", "SCREW, product group Y9."],
    ["HSN 代表什麼？", "What is HSN?", "HSN 為 Highpoint Service Network 之縮寫，中文名稱海柏特；HSN Group（海柏特集團）為源自馬來西亞之電腦維修集團。", "HSN stands for Highpoint Service Network (Chinese name 海柏特); HSN Group is a computer repair group that originated in Malaysia."],
    ["自 2026 年 12 月 1 日起，PAP 採購之料件改經由何者供應？", "From 1 December 2026, through whom are parts purchased by PAP supplied?", "HSN Group（Highpoint Service Network，海柏特）。", "HSN Group (Highpoint Service Network)."],
    ["ASP 是否提供維修服務？", "Do ASPs provide repairs?", "否。ASP 不具維修能力，提供收件（收機）服務。", "No. ASPs do not repair; they take in units."],
    ["設置 Uni-load 的主要目的為何？", "What is the main purpose of Uni-load?", "滿足當地客戶（如標案）之規格與成本要求，例如澳洲向 ODM 採購半成品，並於當地採購 SSD、HDD 組裝。", "To meet local customers' specifications and costs (e.g. tenders); Australia, for example, buys semi-finished parts from the ODM and assembles them with locally sourced SSDs and HDDs."],
    ["PAP 服務物流的三個核心簡碼為何？", "What are the three core abbreviations of PAP service logistics?", "RO、NS、HSN。", "RO, NS and HSN."],
    ["韓國（AKC）由哪個子公司管理？", "Which subsidiary manages Korea (AKC)?", "日本（AJC）。", "Japan (AJC)."]
  ];
  $("quiz-count").innerHTML = B(QZ.length + " 題", QZ.length + " questions");
  $("quiz-list").innerHTML = QZ.map(function (q, i) {
    var n = (i < 9 ? "0" : "") + (i + 1);
    return '<details><summary><span class="qn">Q' + n + "</span><span>" + B(esc(q[0]), esc(q[1])) + '</span><span class="more">' + B("答案", "Answer") + '</span></summary><p class="ans">' + B(esc(q[2]), esc(q[3])) + "</p></details>";
  }).join("");
  var toggleAll = function (open) { $$("#quiz-list details").forEach(function (d) { d.open = open; }); };
  $("quiz-open").addEventListener("click", function () { toggleAll(true); });
  $("quiz-close").addEventListener("click", function () { toggleAll(false); });

  /* ---------- 內文縮寫：每次出現都可點選（同頁重複者底線較淡） ---------- */
  var SKIP = "button, input, select, textarea, option, label, a, svg, script, style, th, h2, h3, .pn-segs, #cat-body, #dec-out, #sub-ref-abbr, #ns-tree, #office-list, .ab-pop, .subnav, .crumb, .pager, .toc, .folder, .wb-meta, .ns-key, .wb-foot-t, .mzwrap, .members, .pcard-head, .pcard-meta, .srcs, .cover-code, .site-chip, .onode, .elabel, .vc, .refs, .stag, .corp-head, .ty, .facts, .pg-abbr, .eyebrow, .hero-title, .node, .pnode, .plabel, .chip, .step-n, .lane-head, .doc";
  function linkAbbr(scope) {
    var seen = {};
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!/[A-Z0-9一-鿿]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        return p && !p.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var langEl = n.parentElement.closest(".zh, .en");
      var langs = langEl ? [langEl.classList.contains("en") ? "en" : "zh"] : ["zh", "en"];
      var s = n.nodeValue, m, last = 0, frag = null;
      AB_RE.lastIndex = 0;
      while ((m = AB_RE.exec(s))) {
        var id = KEYMAP[m[2]];
        var again = langs.every(function (l) { return seen[l + id]; });
        langs.forEach(function (l) { seen[l + id] = 1; });
        frag = frag || document.createDocumentFragment();
        var start = m.index + m[1].length, end = start + m[2].length;
        // 與前後括號、標點綁在一起，避免「（NS」與「）」分在兩行
        var pre = start > last && /[（(「『]/.test(s.charAt(start - 1)) ? 1 : 0;
        var post = (/^[）)」』、，。；：,.;:]+/.exec(s.slice(end)) || [""])[0].length;
        if (start - pre > last) frag.appendChild(document.createTextNode(s.slice(last, start - pre)));
        var b = document.createElement("button");
        b.type = "button"; b.className = again ? "ab again" : "ab"; b.setAttribute("data-ab", id); b.textContent = m[2];
        if (pre || post) {
          var w = document.createElement("span");
          w.className = "ab-wrap";
          if (pre) w.appendChild(document.createTextNode(s.charAt(start - 1)));
          w.appendChild(b);
          if (post) w.appendChild(document.createTextNode(s.substr(end, post)));
          frag.appendChild(w);
        } else frag.appendChild(b);
        last = end + post;
        AB_RE.lastIndex = post ? last - 1 : last;
      }
      if (!frag) return;
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  /* ---------- 每頁底部：本頁縮寫與名詞（含標題、表格、圖中出現者） ---------- */
  var AB_IDX = {};
  AB.forEach(function (a, i) { AB_IDX[a.id] = i; });
  function abbrPanel(scope) {
    var text = scope.textContent, ids = [], seen = {}, m;
    AB_RE.lastIndex = 0;
    while ((m = AB_RE.exec(text))) {
      var id = KEYMAP[m[2]];
      if (!seen[id]) { seen[id] = 1; ids.push(id); }
    }
    if (!ids.length) return;
    ids.sort(function (x, y) { return AB_IDX[x] - AB_IDX[y]; });
    var box = document.createElement("aside");
    box.className = "pg-abbr";
    box.innerHTML = "<h4>" + B("本頁縮寫與名詞", "Abbreviations and terms on this page") + "</h4><dl>" + ids.map(function (id) {
      var a = AB_BY[id];
      var name = fullHTML(a);
      return '<div><dt><button type="button" class="ab" data-ab="' + id + '">' + esc(a.code) + "</button></dt><dd>" + name + "</dd></div>";
    }).join("") + "</dl>";
    scope.appendChild(box);
  }

  /* ---------- 縮寫小視窗 ---------- */
  var pop = $("ab-pop"), popFor = null;
  function openPop(btn) {
    var a = AB_BY[btn.getAttribute("data-ab")];
    if (!a) return;
    var inPop = !pop.hidden && pop.contains(btn);
    var r = btn.getBoundingClientRect();
    if (!inPop) {
      if (popFor) popFor.classList.remove("on");
      popFor = btn; btn.classList.add("on");
    }
    $("ab-pop-key").textContent = a.code;
    $("ab-pop-src").innerHTML = srcTag(a.src) + " " + vsChip(a.vs);
    var oi = officeIdx(a.code);
    $("ab-pop-body").innerHTML = detailHTML(a) + '<div class="pop-acts"><button class="btn sm" type="button" data-ab-go="' + a.id + '">' + B("於縮寫說明中檢視 →", "View in Abbreviations →") + "</button>" +
      (oi >= 0 ? '<button class="btn sm" type="button" data-office-go="' + oi + '">' + B("據點資料 →", "Office details →") + "</button>" : "") +
      (window.PAP_ORG && window.PAP_ORG.byCode && window.PAP_ORG.byCode[a.code] ? '<button class="btn sm" type="button" data-org-go="' + window.PAP_ORG.byCode[a.code] + '">' + B("架構圖 →", "Architecture chart →") + "</button>" : "") + "</div>";
    pop.hidden = false;
    $("ab-pop-body").scrollTop = 0;
    if (inPop) return;
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(Math.max(8, r.left), document.documentElement.clientWidth - pw - 8);
    var top = r.bottom + 6;
    if (top + ph > window.innerHeight - 8 && r.top - ph - 6 > 8) top = r.top - ph - 6;
    pop.style.left = (left + window.pageXOffset) + "px";
    pop.style.top = (top + window.pageYOffset) + "px";
    try { pop.focus({ preventScroll: true }); } catch (e) { pop.focus(); }
  }
  function closePop(refocus) {
    if (pop.hidden) return;
    pop.hidden = true;
    var f = popFor;
    popFor = null;
    if (f) { f.classList.remove("on"); if (refocus) f.focus(); }
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    var goAb = t.closest ? t.closest("[data-ab-go]") : null;
    if (goAb) { closePop(false); showAbCard(goAb.getAttribute("data-ab-go")); return; }
    var goOff = t.closest ? t.closest("[data-office-go]") : null;
    if (goOff) { closePop(false); go("org-offices", true); pickOffice(+goOff.getAttribute("data-office-go")); return; }
    var goOrg = t.closest ? t.closest("[data-org-go]") : null;
    if (goOrg) { closePop(false); go("corp-map", true); if (typeof orgSelect === "function") orgSelect(goOrg.getAttribute("data-org-go")); return; }
    var ab = t.closest ? t.closest(".ab, .cn[data-ab]") : null;
    if (ab) {
      e.preventDefault();
      if (popFor === ab && !pop.hidden) closePop(true); else openPop(ab);
      return;
    }
    if (!pop.hidden && !pop.contains(t)) closePop(false);
  });
  $("ab-pop-close").addEventListener("click", function () { closePop(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(true); });
  window.addEventListener("resize", function () { closePop(false); });

  /* ---------- 啟動 ---------- */
  setTheme(store.get("pap.color"));
  setFont(store.get("pap.font"));
  setLang(store.get("pap.lang") || "zh");
  $$("#page-overview, main .sub, #page-review").forEach(function (s) { if (s.id !== "sub-ref-abbr" && !s.hasAttribute("data-noabbr")) abbrPanel(s); });
  $$("#page-intro, #page-overview, main .sub, #page-review").forEach(linkAbbr);
  // 公司 logo：logos/ 資料夾有檔案者顯示官方 logo；沒有的顯示公司首字並標示「Logo 待補」，不以其他圖片或表情符號代替。
  // 檔名即公司代號（見 logos/README.md）：先查 LOGOS 表，沒有時再嘗試 logos/<代號>.svg 與 .png（放入檔案即自動顯示）。
  var LOGOS = { acer: ["logos/acer.svg", "Acer"], benq: ["logos/benq.png", "BenQ"] };
  var LOGO_NAMES = { "宏碁": "acer", "Acer": "acer", "宏碁 Acer": "acer", "Acer Inc.": "acer", "宏碁股份有限公司": "acer", "Acer Incorporated": "acer",
    "明基 BenQ": "benq", "BenQ": "benq", "明基 BenQ／佳世達 Qisda": "benq", "BenQ / Qisda": "benq" };
  var HAND_LOGOS = { hsn: 1, compal: 1, quanta: 1, wistron: 1, inventec: 1, pegatron: 1, foxconn: 1, auo: 1, qisda: 1, weblink: 1, acsi: 1, aeb: 1, ast: 1, aopen: 1, acergaming: 1, acergadget: 1, acerpure: 1, acermedical: 1, enfinitec: 1 };
  var LOGO_ALT = { hsn: "HSN", compal: "Compal", quanta: "Quanta", wistron: "Wistron", inventec: "Inventec", pegatron: "Pegatron", foxconn: "Foxconn", auo: "AUO", weblink: "Weblink", acsi: "ACSI", aeb: "AEB", ast: "AST", aopen: "AOpen", acergaming: "Acer Gaming", acergadget: "Acer Gadget", acerpure: "Acerpure", acermedical: "Acer Medical", qisda: "Qisda", enfinitec: "Enfinitec" };
  var clogo = function (id, src) { var l = LOGOS[id]; src = src || (l && l[0]); return src ? '<img class="clogo" src="' + src + '" alt="' + (l ? l[1] : LOGO_ALT[id] || id) + '" onerror="PAP_logoFail(this)">' : ""; };
  window.PAP_logoFail = function (img) { var box = img.parentElement; img.remove(); if (box && box.classList.contains("logo-box")) box.classList.remove("has"); };
  var logoFor = function (el) {
    var zh = el.querySelector(".zh"), en = el.querySelector(".en");
    return LOGO_NAMES[(zh || el).textContent.trim()] || (en ? LOGO_NAMES[en.textContent.trim()] : null) || null;
  };
  $$(".members li button, .members li span, .onode > b").forEach(function (el) {
    var id = logoFor(el);
    if (id && LOGOS[id] && !el.querySelector(".clogo")) el.insertAdjacentHTML("afterbegin", clogo(id));
  });
  function setLogo(box, id, src) {
    box.classList.add("has");
    if (HAND_LOGOS[id]) { box.classList.add("hand"); box.setAttribute("data-hz", "手繪示意"); box.setAttribute("data-he", "Hand-drawn"); box.title = "手繪示意，非官方 logo / Hand-drawn placeholder, not the official logo"; }
    box.insertAdjacentHTML("afterbegin", clogo(id, src));
  }
  // 自動尋找 logos/<代號>.svg 或 .png
  var probed = {};
  function probeLogo(id, cb) {
    if (probed[id]) { probed[id].push(cb); return; }
    probed[id] = [cb];
    var tryExt = function (i) {
      var exts = ["svg", "png"];
      if (i >= exts.length) { probed[id].forEach(function (f) { f(null); }); return; }
      var im = new Image(), src = "logos/" + id + "." + exts[i];
      im.onload = function () { probed[id].forEach(function (f) { f(src); }); };
      im.onerror = function () { tryExt(i + 1); };
      im.src = src;
    };
    tryExt(0);
  }
  $$(".logo-box[data-logo]").forEach(function (box) {
    var id = box.getAttribute("data-logo");
    box.setAttribute("data-pz", "Logo 待補"); box.setAttribute("data-pe", "Logo pending");
    box.title = "Logo 待補 / Logo pending";
    if (LOGOS[id]) { setLogo(box, id); box.title = ""; return; }
    probeLogo(id, function (src) { if (src) { setLogo(box, id, src); box.title = ""; } });
  });
  // 組織圖與流程圖中的代碼（HQ、PA、PAP、NS、ODM…）也可點開說明；中英文各自處理
  function linkCodes(el) {
    var kids = el.querySelectorAll(".zh, .en");
    if (kids.length) kids.forEach(function (k) { if (!k.querySelector(".ab")) k.innerHTML = linkText(k.innerHTML, null); });
    else if (!el.querySelector(".ab")) el.innerHTML = linkText(el.innerHTML, null);
  }
  $$(".node > .code, .pnode > b, .pnode > small, .pap-tag").forEach(linkCodes);
  go(location.hash.slice(1), false);
})();
