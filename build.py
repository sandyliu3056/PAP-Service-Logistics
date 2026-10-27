#!/usr/bin/env python3
"""Assemble index.html from src/ (template, style, app, toc, chapter fragments, widgets).
Usage: python3 build.py            -> writes index.html
       python3 build.py --check    -> build to a temp string and validate only"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def bil(en, zh, cls_en="en", cls_zh="zh"):
    return '<span class="%s">%s</span><span class="%s">%s</span>' % (cls_en, esc(en), cls_zh, esc(zh))


# ---------------------------------------------------------------- part art
ART = {
    "town": """<div class="scene town">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt="">
  <img class="sc plane" src="art/plane.png" alt=""><span class="sc sun"></span>
  <img class="sc factory" src="art/factory.png" alt="Factory"><img class="sc warehouse" src="art/warehouse.png" alt="Warehouse">
  <img class="sc truck t1" src="art/truck.png" alt="Spare-parts truck"><img class="sc hq" src="art/hq-building.png" alt="Pan Asia Pacific office">
  <img class="sc truck t2" src="art/truck.png" alt=""><img class="sc shop" src="art/service-shop.png" alt="Service centre">
  <span class="sc road"></span>
</div>""",
    "buildings": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row"><img src="art/bldg-compal.png" alt="Compal"><img src="art/bldg-acer.png" alt="Acer"><img src="art/bldg-highpoint.png" alt="Highpoint"><img src="art/bldg-wistron.png" alt="Wistron"><img src="art/bldg-weblink.png" alt="Weblink"><img src="art/bldg-auo.png" alt="AUO"></div>
  <span class="sc ground"></span>
</div>""",
    "globe": """<div class="scene row globe">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row"><span class="tag-node"><b>HQ → PAP → NS</b><small>組織層級</small></span><span class="globe-wrap"><img src="art/globe.png" alt="Globe"><img class="pin p1" src="art/pin-red.png" alt=""><img class="pin p2" src="art/pin-orange.png" alt=""><img class="pin p3" src="art/pin-blue.png" alt=""><img class="pin p4" src="art/pin-green.png" alt=""></span><span class="tag-node"><b>11 NS</b><small>國家子公司</small></span></div>
  <span class="sc ground"></span>
</div>""",
    "hsn": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row hsn"><img src="art/warehouse-b.png" alt="Warehouse"><img class="truck" src="art/truck-b.png" alt=""><span class="hp"><span class="tag-node"><b>HSN Group</b><small>2026/12/1</small></span><img src="art/bldg-highpoint.png" alt="Highpoint"></span><img class="truck" src="art/truck-b.png" alt=""><img src="art/service-shop-b.png" alt="Service centre"></div>
  <span class="sc ground"></span>
</div>""",
    "tools": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row tools"><img src="art/laptop-chart.png" alt="Report"><img src="art/calendar.png" alt="Calendar"><img src="art/clipboard.png" alt="Checklist"><span class="gears"><img src="art/gear-gold.png" alt=""><img src="art/gear-blue.png" alt=""></span></div>
  <span class="sc ground"></span>
</div>""",
    "pn": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row pn"><img class="star" src="art/star-small.png" alt=""><img class="tag" src="art/barcode-tag.png" alt="Part-number tag"><img class="mag" src="art/magnifier.png" alt=""><span class="boxes"><i></i><i></i><i></i></span></div>
  <span class="sc ground"></span>
</div>""",
    "glossary": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row gloss"><span class="tag-node"><b>RO</b><small>Regional Office</small></span><img class="book" src="art/book.png" alt="Glossary"><img class="pencil" src="art/pencil.png" alt=""><span class="tag-node"><b>LTB</b><small>Last-Time Buy</small></span></div>
  <span class="sc ground"></span>
</div>""",
    "review": """<div class="scene row">
  <img class="sc cloud c1" src="art/cloud-a.png" alt=""><img class="sc cloud c2" src="art/cloud-b.png" alt=""><span class="sc sun"></span>
  <div class="sc-row review"><img class="star s1" src="art/star-big.png" alt=""><img class="board" src="art/clipboard-check.png" alt="Checklist"><img class="pencil" src="art/pencil.png" alt=""><img class="star s2" src="art/star-tan.png" alt=""><img class="star s3" src="art/star-mini.png" alt=""></div>
  <span class="sc ground"></span>
</div>""",
}


def chapter_box(n, ch):
    return ('<a class="chbox" href="#c%d" data-go="c%d"><span class="cn">Chapter %d</span>%s</a>'
            % (n, n, n, bil(ch["en"], ch["zh"])))


def build_home(toc):
    t = toc["title"]
    out = ['<section class="page home" id="pg-home">',
           '<div class="cover">',
           '  <div class="cover-text"><span class="kicker">%s</span>' % esc(t["kicker"]),
           '  <h1 class="cover-title">PAP Service<br>Logistics<br>Guide</h1>',
           '  <p class="cover-zh">%s</p>' % esc(t["zh"]),
           '  <p class="cover-lead"><span class="en">The web edition of the guide: eight parts and twenty-seven chapters, from the purpose of service logistics to the codes used every day. Start with Part 1, or open any chapter from the contents.</span><span class="zh">本簡冊之網頁版共八篇、二十七章，自服務物流之目的至日常使用之代碼。建議自第一篇開始閱讀，亦可由目錄直接進入任一章。</span></p>',
           '  <p class="cover-cta"><a class="btn primary" href="#p1" data-go="p1"><span class="en">Start with Part 1 →</span><span class="zh">從第一篇開始 →</span></a><a class="btn" href="#c26" data-go="c26"><span class="en">Glossary</span><span class="zh">名詞說明</span></a></p>',
           '  </div>',
           ART["town"],
           '</div>',
           '<section class="contents" id="contents">',
           '  <h2 class="big-title">Contents <span class="zh">目錄</span></h2>']
    for p in toc["parts"]:
        out.append('  <div class="toc-part" style="--pc:%s">' % p["color"])
        out.append('    <a class="toc-bar" href="#p%d" data-go="p%d"><span class="pt">PART %d</span><span class="ptitle">%s</span></a>' % (p["n"], p["n"], p["n"], bil(p["en"], p["zh"])))
        out.append('    <ol class="toc-list">')
        for c in p["chapters"]:
            ch = toc["chapters"][str(c)]
            out.append('      <li><a href="#c%d" data-go="c%d"><span class="cno">%d</span>%s</a></li>' % (c, c, c, bil(ch["en"], ch["zh"])))
        if p["n"] == toc["appendix"]["part"]:
            a = toc["appendix"]
            out.append('      <li><a href="#%s" data-go="%s"><span class="cno">A</span>%s</a></li>' % (a["id"], a["id"], bil(a["en"], a["zh"])))
        out.append('    </ol>')
        out.append('  </div>')
    out.append('</section>')
    out.append('</section>')
    return "\n".join(out)


def build_parts(toc):
    out = []
    for p in toc["parts"]:
        out.append('<section class="page part" id="pg-p%d" style="--pc:%s">' % (p["n"], p["color"]))
        out.append('<div class="part-head"><span class="part-pill">PART %d</span><h2 class="part-title">%s</h2><p class="part-zh">%s</p></div>' % (p["n"], esc(p["en"]), esc(p["zh"])))
        out.append(ART[p["art"]])
        out.append('<p class="part-desc"><span class="en">%s</span><span class="zh">%s</span></p>' % (esc(p["den"]), esc(p["dzh"])))
        out.append('<div class="chboxes">')
        for c in p["chapters"]:
            out.append(chapter_box(c, toc["chapters"][str(c)]))
        if p["n"] == toc["appendix"]["part"]:
            a = toc["appendix"]
            out.append('<a class="chbox" href="#%s" data-go="%s"><span class="cn">Appendix</span>%s</a>' % (a["id"], a["id"], bil(a["en"], a["zh"])))
        out.append('</div>')
        out.append('<nav class="pager" data-pager="p%d"></nav>' % p["n"])
        out.append('</section>')
    return "\n".join(out)


def load_widgets():
    w = {}
    d = os.path.join(SRC, "widgets")
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.endswith(".html"):
                w[f[:-5]] = read(os.path.join(d, f))
    return w


def build_chapters(toc, widgets, problems):
    out = []
    part_of = {}
    for p in toc["parts"]:
        for c in p["chapters"]:
            part_of[c] = p
    for n in range(1, len(toc["chapters"]) + 1):
        ch = toc["chapters"][str(n)]
        p = part_of[n]
        path = os.path.join(SRC, "ch", "ch%02d.html" % n)
        if os.path.exists(path):
            body = read(path)
        else:
            problems.append("missing fragment ch%02d" % n)
            body = '<p class="en">This chapter is not available yet.</p><p class="zh">本章內容尚未提供。</p>'

        def sub(m):
            name = m.group(1)
            if name in widgets:
                return widgets[name]
            problems.append("ch%02d: unknown widget %s" % (n, name))
            return ""
        body = re.sub(r"<!--\s*WIDGET:([a-z0-9_-]+)\s*-->", sub, body)
        out.append('<section class="page chapter" id="pg-c%d" data-part="%d" style="--pc:%s">' % (n, p["n"], p["color"]))
        out.append('<div class="crumb"><a href="#p%d" data-go="p%d">Part %d · %s</a><span class="sep">·</span><b>Chapter %d</b></div>' % (p["n"], p["n"], p["n"], esc(p["en"]), n))
        out.append('<header class="ch-banner"><span class="edge-tab"><small>CH</small><b>%d</b><small>P%d</small></span><div class="ch-kicker">CHAPTER <b>%d</b></div><h2 class="ch-title">%s</h2><p class="ch-zh">%s</p></header>' % (n, p["n"], n, esc(ch["en"]), esc(ch["zh"])))
        out.append('<div class="ch-body">')
        out.append(body)
        out.append('</div>')
        out.append('<nav class="pager" data-pager="c%d"></nav>' % n)
        out.append('</section>')
    # appendix
    a = toc["appendix"]
    p = [x for x in toc["parts"] if x["n"] == a["part"]][0]
    body = widgets.get("verify", '<p class="en">Verification register.</p><p class="zh">資料查證紀錄。</p>')
    out.append('<section class="page chapter" id="pg-%s" data-part="%d" style="--pc:%s">' % (a["id"], p["n"], p["color"]))
    out.append('<div class="crumb"><a href="#p%d" data-go="p%d">Part %d · %s</a><span class="sep">·</span><b>Appendix</b></div>' % (p["n"], p["n"], p["n"], esc(p["en"])))
    out.append('<header class="ch-banner"><span class="edge-tab"><small>APP</small><b>A</b><small>P%d</small></span><div class="ch-kicker">APPENDIX</div><h2 class="ch-title">%s</h2><p class="ch-zh">%s</p></header>' % (p["n"], esc(a["en"]), esc(a["zh"])))
    out.append('<div class="ch-body">')
    out.append(body)
    out.append('</div>')
    out.append('<nav class="pager" data-pager="%s"></nav>' % a["id"])
    out.append('</section>')
    return "\n".join(out)


def main():
    check_only = "--check" in sys.argv
    toc = json.loads(read(os.path.join(SRC, "toc.json")))
    problems = []
    widgets = load_widgets()
    html = read(os.path.join(SRC, "template.html"))
    style = read(os.path.join(SRC, "style.css"))
    legacy = os.path.join(SRC, "legacy.css")
    if os.path.exists(legacy):
        style += "\n/* ---- map and chart rules carried over ---- */\n" + read(legacy)
    app = read(os.path.join(SRC, "app.js"))
    html = html.replace("{{STYLE}}", style).replace("{{APP}}", app)
    html = html.replace("{{TOC_JSON}}", json.dumps(toc, ensure_ascii=False))
    for key, name in (("{{GLOSS_JSON}}", "glossary.json"), ("{{REVIEW_JSON}}", "review.json"), ("{{AB_EXTRA_JSON}}", "ab_extra.json")):
        p = os.path.join(SRC, "data", name)
        if os.path.exists(p):
            data = json.loads(read(p))
            html = html.replace(key, json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
        elif name == "ab_extra.json":
            html = html.replace(key, "[]")
        else:
            problems.append("missing data file " + name)
            html = html.replace(key, "null")
    html = html.replace("{{HOME}}", build_home(toc))
    html = html.replace("{{PARTS}}", build_parts(toc))
    html = html.replace("{{CHAPTERS}}", build_chapters(toc, widgets, problems))
    left = re.findall(r"{{[A-Z_]+}}", html)
    if left:
        problems.append("unreplaced placeholders: %s" % left)
    # JS syntax check
    tmp = os.path.join(ROOT, ".app-check.js")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(app)
    r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
    os.remove(tmp)
    if r.returncode:
        problems.append("app.js syntax: " + r.stderr.strip()[:400])
    for pr in problems:
        print("WARN", pr)
    if not check_only:
        with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
            f.write(html)
        print("index.html written: %d bytes, %d problem(s)" % (len(html.encode("utf-8")), len(problems)))
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
