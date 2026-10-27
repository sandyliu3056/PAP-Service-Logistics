#!/usr/bin/env python3
"""Generate verify.js and VERIFICATION.md from src/data/ver_data.json and src/data/ver_sources.json.
Each statement row has either a source expression `src` (e.g. "Acer 1–4, 18; F9") resolved against the numbered
source lists, or explicit source objects `s1`, `s2`, `more` ({t, p, u, d}). Rows may carry their own `date`."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data")
DATE = "2026-10-27"

R = json.load(open(os.path.join(DATA, "ver_sources.json"), encoding="utf-8"))
VER = json.load(open(os.path.join(DATA, "ver_data.json"), encoding="utf-8"))
INTERNAL = {"t": "內部教材 PAP Service Logistics – Internal Training Material 2025", "p": "內部文件", "u": "", "d": ""}


def resolve(src):
    out = []
    for part in re.split(r"[;；]", src or ""):
        part = part.strip()
        if not part or part == "—":
            continue
        if part == "教材":
            out.append(INTERNAL)
            continue
        if part.startswith("Acer"):
            key, rest = "A", part[4:]
        elif re.match(r"^[A-Z]\d", part):
            key, rest = part[0], part
        else:
            key, rest = "A", part
        for seg in rest.split(","):
            seg = re.sub(r"[A-Za-z\s]", "", seg)
            if not seg:
                continue
            nums = range(int(seg.split("–")[0]), int(seg.split("–")[1]) + 1) if "–" in seg else [int(seg)]
            for n in nums:
                pub, date, title, url = R[key][n - 1]
                out.append({"t": title, "p": pub, "u": url, "d": date, "k": key + str(n)})
    return out


rows = []
for r in VER:
    if r.get("s1") or r.get("s2"):
        refs = [x for x in [r.get("s1"), r.get("s2")] if x] + list(r.get("more") or [])
    else:
        refs = resolve(r.get("src"))
    rows.append({"id": r["id"], "co": r["co"], "zh": r["zh"], "en": r["en"], "vz": r["vz"], "ve": r["ve"], "status": r["status"], "nz": r.get("nz", ""), "ne": r.get("ne", ""),
                 "s1": refs[0] if refs else None, "s2": refs[1] if len(refs) > 1 else None, "more": refs[2:], "date": r.get("date", DATE)})

open(os.path.join(ROOT, "verify.js"), "w", encoding="utf-8").write("// 資料查證清單（由 tools/build_verify.py 產生）\nwindow.PAP_VER = " + json.dumps(rows, ensure_ascii=False, indent=1) + ";\n")

ST = {"verified": "Verified 已核實", "single": "Single Source 單一來源", "conflict": "Conflicting Sources 來源衝突", "notfound": "Not Found 查無可靠來源", "internal": "Internal Document 內部文件", "pending": "Pending Internal Confirmation 需內部確認"}
counts = {}
for r in rows:
    counts[r["status"]] = counts.get(r["status"], 0) + 1
md = ["# 資料查證清單 Verification register", "",
      "網站（index.html，附錄「資料查證紀錄」）中每一條公開事實的查證紀錄。最後更新：%s。" % max(r["date"] for r in rows), "",
      "狀態：Verified＝兩個以上獨立來源一致；Single Source＝僅一個來源；Conflicting Sources＝來源互異；Not Found＝未找到可靠來源；Internal Document＝僅見於內部教材；Pending Internal Confirmation＝需內部資料確認。", "",
      "統計：" + "；".join("%s %d" % (ST[k], counts[k]) for k in ST if counts.get(k)) + "。", "",
      "| # | 公司 | 原始敘述 | 查證後敘述 | 來源 1 | 來源 2 | 查證結果 | 衝突或限制 | 最後更新 |", "|---|---|---|---|---|---|---|---|---|"]


def mdsrc(x):
    if not x:
        return "—"
    return ("[" + x["t"] + "](" + x["u"] + ")" if x.get("u") else x["t"]) + "（" + x["p"] + (" · " + x["d"] if x.get("d") else "") + "）"


for i, r in enumerate(rows, 1):
    md.append("| %d | %s | %s<br>%s | %s<br>%s | %s | %s | %s | %s | %s |" % (
        i, r["co"], r["zh"], r["en"], r["vz"], r["ve"], mdsrc(r["s1"]), mdsrc(r["s2"]) + (("<br>另 %d 個來源" % len(r["more"])) if r["more"] else ""),
        ST.get(r["status"], r["status"]), (r["nz"] + "<br>" + r["ne"]) if (r["nz"] or r["ne"]) else "—", r["date"]))
open(os.path.join(ROOT, "VERIFICATION.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
print("verify rows:", len(rows), counts)
