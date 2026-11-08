#!/usr/bin/env python3
"""Fail fast on missing, duplicated or obsolete active HTML assets.
Only the real HTML <head> is checked; printable templates embedded in JS are ignored.
"""
from pathlib import Path
import re
from collections import Counter

root=Path(__file__).resolve().parents[1]
apps=("one","admin")
for app in apps:
    base=root/"apps"/app
    html=(base/"index.html").read_text(encoding="utf-8")
    head=html.split("</head>",1)[0]
    assets=re.findall(r'<(?:script|link)\b[^>]*?(?:src|href)=["\'](\./[^"\']+\.(?:js|css)(?:\?[^"\']*)?)["\']',head,re.I)
    names=[a.split("?",1)[0].removeprefix("./") for a in assets]
    missing=[n for n in names if not (base/n).is_file()]
    duplicates=[n for n,c in Counter(names).items() if c>1]
    assert not missing, f"{app}: missing active assets: {missing}"
    assert not duplicates, f"{app}: duplicate active assets: {duplicates}"
    if app=="one":
        obsolete=("zavi-settings-priority-v6546.js","zavi-simple-workspace-v1.js")
        assert not any((base/n).exists() for n in obsolete), "Obsolete settings scripts returned"
        assert all(n not in head for n in obsolete), "Obsolete settings script loaded"
    print(f"{app}: {len(names)} head assets verified; no duplicates or missing files")
