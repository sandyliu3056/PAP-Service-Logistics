#!/usr/bin/env python3
"""Assemble src/app.js = app-head.js + selected blocks of the previous site's script (src/old.js) + app-tail.js.
The carried-over blocks (site data, maps, code database, chart, popup) are patched for the guide layout."""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
old = open(os.path.join(SRC, "old.js"), encoding="utf-8").read()


def block(start_re, end_re, include_end=True, after=None):
    """Return old.js text from the first line matching start_re (searching after `after` if given)
    to the first following line matching end_re."""
    pos = 0
    if after:
        m = re.search(after, old, re.M)
        if not m:
            raise SystemExit("anchor not found: " + after)
        pos = m.end()
    s = re.compile(start_re, re.M).search(old, pos)
    if not s:
        raise SystemExit("start not found: " + start_re)
    e = re.compile(end_re, re.M).search(old, s.end())
    if not e:
        raise SystemExit("end not found: " + end_re + " (after " + start_re + ")")
    return old[s.start():(e.end() if include_end else e.start())] + "\n"


def patch(text, old_s, new_s, count=1, name=""):
    n = text.count(old_s)
    if n < count:
        raise SystemExit("patch target missing (%s): %r" % (name, old_s[:80]))
    return text.replace(old_s, new_s)


parts = []
parts.append(open(os.path.join(SRC, "app-head.js"), encoding="utf-8").read())

# site data: service sites, ISO map, reported totals, warehouses, nation subsidiaries
parts.append(block(r"^  /\* ---------- 服務據點資料", r"^  var ISO = .*$"))
parts.append(block(r"^  var KPI = \[", r"^  \];$"))
parts.append(block(r"^  var WH = \[", r"^  \];$"))
parts.append(block(r"^  var NSC = \[", r"^  \];$"))
# map core: region classes, projection, drawMap, nm, code navigation, pin highlighting and the click handler
mapcore = block(r"^  /\* ---------- 地圖 ---------- \*/", r"^  var WORLD_LABELS", include_end=False)
mapcore = patch(mapcore, 'var NAV_OF = { "map-ns": "nav-ns", "map-sites": "nav-sites", "map-hsn": "nav-hsn", "map-intro": "ns-key" };',
                'var NAV_OF = { "map-ns": "nav-ns", "map-sites": "nav-sites", "map-hsn": "nav-hsn" };', name="NAV_OF")
mapcore = patch(mapcore, 'var nm = function (zh, en) { return LANG === "en" ? en : zh; };', 'var nm = function (zh, en) { return LANG === "en" ? en : zh; };', name="nm")
parts.append(mapcore)
wl = block(r"^  var WORLD_LABELS", r"^  var NS_ISO = .*$")
# HSN Group companies in the guide's order (Table 16.3): Malaysia, Philippines, Thailand, Indonesia, Vietnam
_rows = re.findall(r'^    \["HSN[MIVPT]".*$', wl, re.M)
_order = {"HSNM": 0, "HSNP": 1, "HSNT": 2, "HSNI": 3, "HSNV": 4}
_sorted = sorted(_rows, key=lambda r: _order[r[6:10]])
for _o, _n in zip(_rows, _sorted):
    pass
_blk = "\n".join(_rows)
assert _blk in wl, "HSN rows not contiguous"
wl = wl.replace(_blk, "\n".join(r.rstrip(",") + "," for r in _sorted))
parts.append(wl)
pick = block(r"^  function pickPin\(cc\) \{", r"^  \}$")
pick += '''  (function () {
    var m = $id("map-sites"); if (!m) return;
    m.addEventListener("click", function (e) { var p = e.target.closest ? e.target.closest(".pin") : null; if (p) pickPin(p.getAttribute("data-cc")); });
    m.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var p = e.target.closest ? e.target.closest(".pin") : null; if (p) { e.preventDefault(); pickPin(p.getAttribute("data-cc")); }
    });
  })();
'''
parts.append(pick)
# Acer offices worldwide (map views, label placement, office cards)
offices = block(r"^  /\* ---------- 全球據點（Acer Around the World） ---------- \*/", r"^  var CH = ", include_end=False)
offices = patch(offices, '$("office-kpis").innerHTML = OKPI.map(function (k) { return \'<div class="kpi"><div class="k">\' + B(k[1], k[2]) + \'</div><div class="v">\' + k[0] + "</div></div>"; }).join("");', "", name="office-kpis")
parts.append(offices)
# categories, part-number codes, sub-category table, decoder
tools = block(r"^  var CATS = \[", r"^  decode\(\);$")
tools = patch(tools, '$("cats").innerHTML = CATS.map(function (c) { return "<div>" + esc(c) + "</div>"; }).join("");', "", name="cats")
parts.append(tools)
# code database and detail rendering
ab = block(r"^  /\* ---------- 縮寫 ---------- \*/", r"^  function abNode\(", include_end=False)
ab = ab.replace('pending: ["待內部確認", "Pending internal confirmation"]', 'pending: ["教材未載明全稱", "Full name not stated in the material"]')
ab = patch(ab, '  var AB_BY = {};', '  (window.PAP_AB_EXTRA || []).forEach(function (a) { AB.push(a); });\n  var AB_BY = {};', name='AB extra hook')
parts.append(ab)
# verification register table
ver = block(r"^  /\* ---------- 資料查證", r"^  \}\)\(\);$")
ver = ver.replace('pending: ["待內部確認", "Pending internal confirmation"]', 'pending: ["教材未載明全稱", "Full name not stated in the material"]')
parts.append(ver)
# architecture chart
org = block(r"^  /\* ---------- 企業架構圖（資料：org.js） ---------- \*/", r"^  \}\)\(\);$", after=r"^  /\* ---------- 資料查證")
org = patch(org, "(n.id === \"acer\" ? 80 : 10)", "10", name="acer tx")
org = re.sub(r"\n    if \(n\.id === \"acer\"\) \{ out \+= '<image href=\"logos/acer\.svg\"[^\n]*\n", "\n", org)
org = patch(org, 'nm("待確認 Pending verification", "Pending verification")', 'nm("查證狀態見節點說明", "See the node details for its verification status")', name="pending title")
org = re.sub(r"\n    var logoBox = n\.logo \?[^\n]*\n", "\n    var logoBox = \"\";\n", org)
org = re.sub(r"\n    \$\$\(\"\.logo-box\[data-logo\]\", pn\)\.forEach[^\n]*\n", "\n", org)
org = patch(org, 'if (orgReady && $("sub-corp-map").classList.contains("active")) orgHome();', 'if (orgReady && current === "c4") orgFit();', name="org resize")
org = patch(org, '[["l-ro", "區域辦公室（PAP）", "Regional office (PAP)"]', '[["l-ro", "區域辦公室（PAP）", "Regional office (PAP)"]', name="legend")
org = patch(org, 'B("待確認的節點", "Node pending verification")', 'B("公開來源尚未核實之節點", "Node not yet confirmed by public sources")', name="legend pending")
parts.append(org)
# in-text code linking
link = block(r"^  /\* ---------- 內文縮寫", r"^  var AB_IDX = ", include_end=False)
link = re.sub(r'var SKIP = "[^"]*";', 'var SKIP = "button, input, select, textarea, option, label, a, svg, script, style, th, h2, h3, h4, dt, .ab-pop, .tabs, .chips, .crumb, .pager, .ch-banner, .part-head, .cover-text, .toc-bar, .chbox, .co-name, .co-zh, .fact b, .gl .code, .pn, .code-nav, .map, .badge, .yr, .num, .flow-label, .lane-head, .stage b, figcaption b, .dc, #cat-body, #dec-out, #ver-body, .qa .qn, .org-wrap, .edge-tab";', link)
parts.append(link)
# code popup
pop = block(r"^  /\* ---------- 縮寫小視窗 ---------- \*/", r'^  window\.addEventListener\("resize", function \(\) \{ closePop\(false\); \}\);$')
pop = patch(pop, 'B("於縮寫說明中檢視 →", "View in Abbreviations →")', 'B("於名詞說明中檢視 →", "View in the glossary →")', name="pop gloss")
pop = patch(pop, 'B("據點資料 →", "Office details →")', 'B("據點資料 →", "Office details →")', name="pop office")
pop = patch(pop, 'if (goAb) { closePop(false); showAbCard(goAb.getAttribute("data-ab-go")); return; }', 'if (goAb) { closePop(false); showGloss(goAb.getAttribute("data-ab-go")); return; }', name="pop goAb")
pop = patch(pop, 'if (goOff) { closePop(false); go("org-offices", true); pickOffice(+goOff.getAttribute("data-office-go")); return; }', 'if (goOff) { closePop(false); go("c12", true); pickOffice(+goOff.getAttribute("data-office-go")); return; }', name="pop goOff")
pop = patch(pop, 'if (goOrg) { closePop(false); go("corp-map", true); if (typeof orgSelect === "function") orgSelect(goOrg.getAttribute("data-org-go")); return; }', 'if (goOrg) { closePop(false); go("c4", true); setTimeout(function () { orgSelect(goOrg.getAttribute("data-org-go")); }, 30); return; }', name="pop goOrg")
pop = patch(pop, 'var ab = t.closest ? t.closest(".ab, .cn[data-ab]") : null;', 'var ab = t.closest ? t.closest(".ab, [data-ab]") : null;', name="pop selector")
parts.append(pop)

parts.append(open(os.path.join(SRC, "app-tail.js"), encoding="utf-8").read())
out = "".join(parts)
# leftovers that must not survive
for bad in ["待內部確認", "待確認", "showAbCard(", "probeLogo(", "LOGOS[", "mzwrap", "drawIntro(", "$(\"hero-stats\")", "data-noabbr"]:
    if bad in out:
        raise SystemExit("leftover reference: " + bad)
open(os.path.join(SRC, "app.js"), "w", encoding="utf-8").write(out)
print("app.js: %d lines, %d bytes" % (out.count("\n"), len(out.encode("utf-8"))))
