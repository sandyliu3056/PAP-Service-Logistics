#!/usr/bin/env python3
"""Merge the results of the fact-verification workflow into src/data/ver_data.json.
Usage: python3 -I tools/merge_ver.py results.json [--date YYYY-MM-DD]
results.json = [{"item": {...}, "research": {...}|null, "verdict": {...}|null}, ...]
A verdict that is not ok lowers the status to the skeptic's status and applies its corrected texts."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "ver_data.json")
ORDER = ["verified", "single", "conflict", "notfound"]


def src_obj(s):
    if not s or not isinstance(s, dict) or not s.get("t"):
        return None
    return {"t": s.get("t", ""), "p": s.get("p", ""), "u": s.get("u", ""), "d": s.get("d", "")}


def lower(a, b):
    """the weaker of two statuses"""
    ia = ORDER.index(a) if a in ORDER else len(ORDER)
    ib = ORDER.index(b) if b in ORDER else len(ORDER)
    return ORDER[max(ia, ib)] if max(ia, ib) < len(ORDER) else (a if ia < len(ORDER) else b)


def main():
    path = sys.argv[1]
    date = sys.argv[sys.argv.index("--date") + 1] if "--date" in sys.argv else "2026-10-27"
    results = json.load(open(path, encoding="utf-8"))
    ver = json.load(open(DATA, encoding="utf-8"))
    by = {r["id"]: r for r in ver}
    changed, added, skipped = [], [], []
    for x in results:
        it, r, v = x.get("item") or {}, x.get("research"), x.get("verdict")
        if not it or not r:
            skipped.append(it.get("id") if it else "?")
            continue
        status = r.get("status", "notfound")
        vz, ve, nz, ne = r.get("vz", ""), r.get("ve", ""), r.get("nz", ""), r.get("ne", "")
        if v:
            if not v.get("ok"):
                status = lower(status, v.get("status", status))
                vz, ve = v.get("fix_vz") or vz, v.get("fix_ve") or ve
                nz, ne = v.get("fix_nz") or nz, v.get("fix_ne") or ne
                if v.get("reason") and not (v.get("fix_nz") or v.get("fix_ne")):
                    ne = (ne + " " if ne else "") + "Reviewer: " + v["reason"]
        s1, s2 = src_obj(r.get("s1")), src_obj(r.get("s2"))
        if status == "verified" and not (s1 and s2):
            status = "single"
        row = by.get(it["id"])
        if not row:
            row = {"id": it["id"], "co": it.get("co", ""), "zh": it.get("zh", ""), "en": it.get("en", "")}
            ver.append(row)
            by[it["id"]] = row
            added.append(it["id"])
        else:
            changed.append(it["id"])
        row.update({"status": status, "vz": vz or row.get("vz", ""), "ve": ve or row.get("ve", ""), "nz": nz, "ne": ne, "s1": s1, "s2": s2, "more": [], "date": date})
        row.pop("src", None)
    json.dump(ver, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("changed:", changed)
    print("added:", added)
    print("skipped (no research):", skipped)


if __name__ == "__main__":
    main()
