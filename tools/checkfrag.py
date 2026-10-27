#!/usr/bin/env python3
"""Check a chapter fragment: well-formed HTML, bilingual pairs, forbidden strings.
Usage: python3 -I tools/checkfrag.py src/ch/ch05.html [more files]
Exit code 1 when a problem is found."""
import re
import sys
from html.parser import HTMLParser

VOID = {"br", "img", "hr", "input", "meta", "link", "wbr", "source"}
FORBIDDEN = ["待確認", "TBD", "TODO", "Vivian", "Lo, Vivian", "lorem ipsum", "<script", "<style", "javascript:", "<svg"]
ALLOWED_CLASSES = None  # free


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack = []
        self.errors = []
        self.text_en = 0
        self.text_zh = 0
        self.widgets = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()))
        d = dict(attrs)
        cls = (d.get("class") or "").split()
        if "en" in cls:
            self.text_en += 1
        if "zh" in cls:
            self.text_zh += 1
        if tag == "a" and "data-go" in d and not d.get("href"):
            self.errors.append("line %d: <a data-go> needs href" % self.getpos()[0])

    def handle_startendtag(self, tag, attrs):
        if tag not in VOID:
            self.errors.append("line %d: self-closing <%s/> is not allowed" % (self.getpos()[0], tag))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append("line %d: stray </%s>" % (self.getpos()[0], tag))
            return
        top, pos = self.stack[-1]
        if top != tag:
            self.errors.append("line %d: </%s> closes <%s> opened at line %d" % (self.getpos()[0], tag, top, pos[0]))
            # try to recover
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    return
            return
        self.stack.pop()

    def handle_comment(self, data):
        m = re.match(r"\s*WIDGET:([a-z0-9_-]+)\s*$", data)
        if m:
            self.widgets.append(m.group(1))


def check(path):
    src = open(path, encoding="utf-8").read()
    c = Checker()
    c.feed(src)
    c.close()
    errs = list(c.errors)
    for tag, pos in c.stack:
        errs.append("line %d: <%s> never closed" % (pos[0], tag))
    for f in FORBIDDEN:
        if f.lower() in src.lower():
            errs.append("forbidden text: %r" % f)
    if re.search(r"<(html|body|head|section)\b", src):
        errs.append("fragment must not contain <html>, <body>, <head> or <section>")
    if re.search(r"\sstyle=\"(?!width:)", src):
        errs.append("inline style other than width: is not allowed")
    if re.search(r"[一-鿿][ ]+[一-鿿]", src):
        errs.append("stray spaces inside Chinese text (extraction artefact)")
    if c.text_en == 0 or c.text_zh == 0:
        errs.append("no bilingual spans found (en=%d zh=%d)" % (c.text_en, c.text_zh))
    ratio = c.text_zh / max(1, c.text_en)
    if ratio < 0.7 or ratio > 1.4:
        errs.append("unbalanced bilingual spans: en=%d zh=%d (every text needs both languages)" % (c.text_en, c.text_zh))
    return errs, c.widgets


def main():
    bad = 0
    for p in sys.argv[1:]:
        errs, widgets = check(p)
        print("%s: %s%s" % (p, "OK" if not errs else "%d problem(s)" % len(errs), (" widgets=" + ",".join(widgets)) if widgets else ""))
        for e in errs:
            print("  - " + e)
        bad += bool(errs)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
