# Chapter fragment specification (web edition of the PAP Service Logistics Guide)

Each chapter lives in `src/ch/chNN.html` (NN = two-digit chapter number). A fragment contains **only the chapter body**: no `<html>`, `<body>`, `<section>` wrapper, no chapter banner and no page header. The build script wraps the fragment, adds the banner (chapter number, English and Chinese title) and the previous/next navigation.

The fragment must be well-formed HTML (every tag closed, attributes quoted). Check it with:

```
python3 -I tools/checkfrag.py src/ch/chNN.html
```

## 1. Bilingual text

Every piece of text appears in **both languages, English first, then Traditional Chinese**, using the PDF's wording.

* Block text (paragraphs): two sibling paragraphs.
  ```html
  <p class="en">Service logistics is the planning, purchasing, warehousing and distribution of spare parts that support after-sales repair.</p>
  <p class="zh">服務物流係指支援售後維修之備品規劃、採購、倉儲與配送。</p>
  ```
* Inline text (headings, labels, table cells, list items): two sibling spans.
  ```html
  <li><span class="en">Define service logistics and its scope within Acer.</span><span class="zh">定義服務物流及其於宏碁之範圍。</span></li>
  ```
* Never mix the languages inside one span. Never leave a text in one language only (the PDF always gives both; if the PDF really has only one, give that one only).
* Emphasis inside text: `<b>service logistics</b>` (the PDF's bold-italic terms). Nothing else inline (no `<i>`, no `<u>`).
* Codes and abbreviations (PAP, NS, ODM, HQ, HSN, SPL, PO, …) are written as plain text. The site links them to their explanation automatically. Do not wrap them in tags.

## 2. Headings

* Numbered section heading (1.1, 1.2 …):
  ```html
  <h3 class="sec" id="s1-1"><span class="num">1.1</span><span class="en">Definition of Service Logistics</span><span class="zh">服務物流之定義</span></h3>
  ```
  `id` = `s` + chapter + `-` + section (section 4.2 → `id="s4-2"`).
* Sub-heading without a number (e.g. "What it does", "Relationship with Acer", "Customer types"):
  ```html
  <h4 class="subhd"><span class="en">Relationship with Acer</span><span class="zh">與 Acer 的關係</span></h4>
  ```

## 3. Boxes

All boxes share the pattern `<div class="box TYPE"><h4>LABEL</h4> … </div>`. Labels are fixed:

| Box in the PDF | class | label |
|---|---|---|
| In this chapter 本章學習目標 | `box obj` | `<h4><span class="en">In this chapter</span><span class="zh">本章學習目標</span></h4>` then `<ul class="bl">` with one `<li>` per objective |
| Start here 先從這裡開始 | `box start` | `<h4><span class="en">Start here</span><span class="zh">先從這裡開始</span></h4>` then paragraphs |
| KEY POINT 重點 | `box key` | `<h4><span class="en">KEY POINT</span><span class="zh">重點</span></h4>` then paragraphs |
| NOTE 說明 | `box note` | `<h4><span class="en">NOTE</span><span class="zh">說明</span></h4>` then paragraphs |
| What this means 名詞說明 | `box terms` | `<h4><span class="en">What this means</span><span class="zh">名詞說明</span></h4>` then a `<dl>` (see below) |

Term list inside a `box terms`:
```html
<dl>
  <div><dt>Multitech</dt><dd><span class="en">Acer's original company name. The company was founded in 1976 as Multitech Electronics Inc. and was renamed Acer in 1987; it is the same company under a new name.</span><span class="zh">宏碁創立時之公司名稱（Multitech Electronics Inc.）；1987 年更名為 Acer，為同一家公司。</span></dd></div>
  <div><dt>Forerunner <span class="zh">前身</span></dt><dd>…</dd></div>
</dl>
```
The `<dt>` holds the term exactly as in the PDF (English term, optionally followed by its Chinese in a `.zh` span).

Chapter order is always: `box obj` → `box start` → sections. Keep every box the PDF has, in the PDF's position.

## 4. Lists

* Bulleted: `<ul class="bl"><li>…</li></ul>`
* Numbered: `<ol class="nl"><li>…</li></ol>`
* Numbered step cards (the PDF's cards with a circled number, e.g. the eight SPL steps, PO lifecycle, tender process, four-step method):
  ```html
  <ol class="steps">
    <li><span class="n">1</span><div><b><span class="en">Start · ODM</span><span class="zh">B 樣品完成</span></b><p class="en">The B sample is ready and the flow starts.</p><p class="zh">B 樣品完成，流程啟動。</p></div></li>
  </ol>
  ```
* Milestone timeline (year tags on the left):
  ```html
  <ol class="timeline">
    <li><span class="yr">1976</span><div><b><span class="en">Founded</span><span class="zh">創立</span></b><p class="en">Founded on 1 August 1976 with NT$1 million in capital as Multitech, focused on microprocessor technology.</p><p class="zh">以新台幣 100 萬元創立，名為 Multitech，以微處理器技術為核心。</p></div></li>
  </ol>
  ```
  Use the PDF's year or label text in `.yr` (e.g. `2016/17`, `Recent`).

## 5. Company cards and facts

```html
<div class="co-card" data-badge="acer">
  <span class="badge" aria-hidden="true"></span>
  <div class="co-text">
    <b class="co-name">Acer Incorporated</b>
    <span class="co-zh">宏碁股份有限公司</span>
    <small class="co-role"><span class="en">Brand owner (OBM)</span><span class="zh">品牌商</span></small>
  </div>
</div>
<div class="facts">
  <span class="fact"><b>Founded <span class="zh">創立</span></b> 1 August 1976 (as Multitech)</span>
  <span class="fact"><b>Headquarters <span class="zh">總部</span></b> Xizhi, New Taipei City</span>
  <span class="fact"><b>Stock code <span class="zh">股票代碼</span></b> 2353, Taiwan Stock Exchange</span>
</div>
```
`data-badge` values: `acer`, `hsn`, `compal`, `quanta`, `wistron`, `inventec`, `pegatron`, `foxconn`, `benq`, `auo`, `weblink`, `acsi`, `aeb`, `ast`, `aopen`, `acergaming`, `acergadget`, `acerpure`, `acermedical`, `highpoint`. Nothing goes inside `.badge` (the site draws the pictogram).

## 6. Tables

```html
<div class="tblw">
<table class="tbl">
  <thead><tr><th><span class="en">Company</span> <span class="zh">公司</span></th><th><span class="en">Relationship to Acer</span> <span class="zh">與 Acer 之關係</span></th><th><span class="en">Main role</span> <span class="zh">主要角色</span></th></tr></thead>
  <tbody>
    <tr><td><b>Acer</b> <span class="zh">宏碁</span></td><td><span class="en">The brand owner</span> <span class="zh">品牌商本身</span></td><td><p class="en">Designs, markets and sells under its own brand; PAP is its Pan Asia Pacific organisation.</p><p class="zh">以自有品牌設計、行銷與銷售；PAP 為其泛亞太區組織。</p></td></tr>
  </tbody>
</table>
</div>
```
Short cells use inline spans; description cells use `p.en` / `p.zh`. Add `class="c"` to centred cells (check marks, numbers) and `class="code"` to code cells. Use `✓` for ticks and `—` for "not listed/none".

## 7. Figures

Every figure of the PDF is recreated with the components below inside a figure block with the PDF's caption:

```html
<figure class="fig">
  … figure content …
  <figcaption><b>Figure 1-1</b> <span class="en">Organisational position and supply flow</span><span class="zh">組織定位與供應流程</span></figcaption>
</figure>
```

Figure content components:

* **Flow row** (boxes joined by arrows):
  ```html
  <div class="flow">
    <div class="node"><b>HQ</b><small><span class="en">Headquarters</span><span class="zh">總部</span></small></div>
    <span class="arr">→</span>
    <div class="node tan"><b>PAP</b><small>…</small></div>
  </div>
  ```
  Node colours: default white, `tan`, `blue`, `green`, `orange`, `dashed` (external partner), `dark`. A row label in front of a flow: `<span class="flow-label"><span class="en">Organisation</span><span class="zh">組織</span></span>`.
* **Tree** (one parent, a row of children; nest for more levels):
  ```html
  <div class="tree">
    <div class="node orange root"><b>Acer Inc. HQ</b><small>…</small></div>
    <div class="kids">
      <div class="node"><b>PA</b><small>…</small></div>
      <div class="tree"><div class="node tan root"><b>PAP</b></div><div class="kids">…</div></div>
    </div>
  </div>
  ```
* **Stages** (the five stages of a spare part, numbered circles with an icon):
  ```html
  <div class="stages">
    <div class="stage"><span class="n">1</span><img class="ic" src="art/icon-demand.png" alt=""><b><span class="en">Demand</span><span class="zh">需求規劃</span></b></div>
  </div>
  ```
  Icons available: `art/icon-demand.png`, `art/icon-factory.png`, `art/icon-warehouse.png`, `art/icon-truck.png`, `art/icon-repair.png`.
* **Swim lanes** (rows labelled by responsible party, e.g. the SPL flow):
  ```html
  <div class="lanes">
    <div class="lane"><span class="lane-head">HQ / PM</span><div class="flow">…nodes…</div></div>
    <div class="lane"><span class="lane-head">QSBU / GCSD</span><div class="flow">…</div></div>
  </div>
  ```
* **Part-number boxes** (one character per box, dots between groups, highlighted characters):
  ```html
  <div class="pn"><span class="pn-ch">D</span><span class="pn-ch">G</span><span class="pn-dot">.</span><span class="pn-ch">B</span><span class="pn-ch">8</span><span class="pn-ch">8</span><span class="pn-ch hl">S</span><span class="pn-ch hl">A</span><span class="pn-dot">.</span><span class="pn-ch">0</span><span class="pn-ch">0</span><span class="pn-ch">1</span></div>
  ```
  Segment labels under the boxes: `<div class="pn-legend"><span><b>AA</b> <span class="en">sub-category</span><span class="zh">子類別</span></span> … </div>`.
* **Split bar** (the 2009 / 2014 order allocation bars): `<div class="bars"><div class="bar"><span class="bar-label">H1 2009</span><span class="seg" style="width:45%;background:var(--blue-node)">Compal 45%</span>…</div></div>`.
* Anything else: a simple `.flow` or a small table. Do not use inline `style` except for bar widths; do not use SVG.

## 8. Cross-references

References to other chapters, tables or figures become links: `(<a class="xref" href="#c11" data-go="c11">Chapter 11</a>)`, `<a class="xref" href="#c13" data-go="c13">Table 13-2</a>`. Page numbers are dropped (web edition has no pages).

## 9. Data-driven placeholders

Some tables and charts are rendered by the site from its own data. Where the PDF has one of these, put the marker on its own line instead of transcribing the table (keep the surrounding text, headings, notes and captions as usual):

| Chapter | PDF item | marker |
|---|---|---|
| 4 | after Figure 4-2 relationship chart (keep the static figure) | `<!-- WIDGET:orgchart -->` |
| 12 | after Figure 12-1 | `<!-- WIDGET:worldmap -->` |
| 13 | Table 13-2 "The Eleven Nation Subsidiaries" (the table only) | `<!-- WIDGET:nstable -->` and, right after it, `<!-- WIDGET:nsmap -->` |
| 14 | 14.7 site counts table (the table only) | `<!-- WIDGET:sitecounts -->` |
| 15 | 15.1 warehouses table (the table only) | `<!-- WIDGET:whtable -->` |
| 16 | 16.3 companies-by-country table (the table only) | `<!-- WIDGET:hsntable -->` |
| 21 | 21.3 spare-parts categories table (the table only) | `<!-- WIDGET:cats -->` |
| 23 | 23.5 sub-category code paragraph: keep the text, then add | `<!-- WIDGET:subcat -->` |
| 24 | at the end of 24.1 (after the four-step method), before the examples | `<!-- WIDGET:decoder -->` |
| 26 | whole glossary body | handled separately (JSON), not an HTML fragment |
| 27 | questions (27.1) and answer key (27.2) | data in src/data/review.json; the fragment holds the boxes, the 27.1 heading with `<!-- WIDGET:quiz -->`, the 27.2 heading with `<!-- WIDGET:answers -->`, 27.3 Sources and `<!-- WIDGET:verify-link -->` |

## 10. Content rules

* Transcribe faithfully: keep every section, paragraph, box, bullet, table row and figure of the PDF chapter, in order; keep the PDF's wording in both languages; fix only extraction artefacts (words split by line breaks, stray spaces inside Chinese text, hyphenation).
* Do not invent, extend or "improve" facts; do not add numbers that are not in the PDF.
* Omit author names and personal attributions of the source material (e.g. a line "by …" or "the training material by …"); keep the fact that the training material is the source.
* Phrases such as "Full name not specified in the source 原始資料未載明全稱" are facts from the PDF: keep them. Never write 待確認, TBD, TODO or similar.
* Drop page footers, running headers ("Part 2 · Chapter 5 · Acer"), page numbers and the side tab text ("CH 5 P2").
* Professional register only; no colloquial wording.
