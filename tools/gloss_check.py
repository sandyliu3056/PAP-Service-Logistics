#!/usr/bin/env python3
"""Compare the guide's glossary (src/data/glossary.json) with the code database in src/app.js and
write src/data/ab_extra.json with entries for glossary terms the database does not know, so that
every term of Chapter 26 can be clicked anywhere on the site.
Usage: python3 -I tools/gloss_check.py [--write]"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GL = json.load(open(os.path.join(ROOT, "src", "data", "glossary.json"), encoding="utf-8"))
app = open(os.path.join(ROOT, "src", "app.js"), encoding="utf-8").read()
m = re.search(r"^  var AB = \[\n(.*?)^  \];", app, re.S | re.M)
AB = json.loads("[" + m.group(1).strip().rstrip(",") + "]")
CAT_OF_GROUP = {"26.1": "org", "26.2": "term", "26.3": "ops", "26.4": "sys", "26.5": "part", "26.6": "site"}


def key(s):
    return re.sub(r"\s+", "", s or "").upper()


known = {}
for a in AB:
    known[key(a["code"])] = a["id"]
    for k in a["keys"]:
        known.setdefault(key(k), a["id"])

missing, present = [], []
for g in GL["groups"]:
    for t in g["terms"]:
        k = key(t["code"])
        if k in known:
            present.append((t["code"], known[k]))
            continue
        # also try each half of "A / B" codes
        halves = [key(x) for x in re.split(r"\s*/\s*", t["code"])]
        if len(halves) > 1 and all(h in known for h in halves):
            present.append((t["code"], "+".join(known[h] for h in halves)))
            continue
        missing.append((g["num"], t))

print("glossary terms:", sum(len(g["terms"]) for g in GL["groups"]), "known:", len(present), "missing:", len(missing))
for num, t in missing:
    print("  -", num, t["code"], "|", t.get("full", ""), "|", t.get("zh", ""))

if "--write" in sys.argv:
    extra = []
    used = set(a["id"] for a in AB)
    for num, t in missing:
        base = re.sub(r"[^a-z0-9]+", "-", t["code"].lower()).strip("-") or "term"
        aid = base
        n = 2
        while aid in used:
            aid = "%s-%d" % (base, n)
            n += 1
        used.add(aid)
        keys = [t["code"]] + [x.strip() for x in re.split(r"\s*/\s*", t["code"]) if x.strip() and x.strip() != t["code"]]
        keys = [k for k in keys if len(k) >= 2]
        extra.append({"id": aid, "keys": keys, "code": t["code"], "full": t.get("full") or None, "zh": t.get("zh", ""), "en": None,
                      "src": "n" if t.get("fullNotSpecified") and not t.get("full") else "m", "cat": CAT_OF_GROUP.get(num, "term"),
                      "dzh": t.get("dzh", ""), "den": t.get("den", ""), "cc": None, "region": None, "org": None,
                      "urls": [{"t": "PAP Service Logistics Guide · Chapter 26", "p": "本簡冊", "u": ""}], "vs": "internal"})
    json.dump(extra, open(os.path.join(ROOT, "src", "data", "ab_extra.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("wrote ab_extra.json:", len(extra))
