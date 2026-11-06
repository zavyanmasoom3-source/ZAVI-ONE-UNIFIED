#!/usr/bin/env python3
"""Fail the build when approved UI resources are absent from the actual app shells."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
APPS = ("one", "admin")
errors = []
for app in APPS:
    base = ROOT / "apps" / app
    html = (base / "index.html").read_text(encoding="utf-8")
    approved = base / "zavi-approved-compact-v1.css"
    if not approved.is_file() or approved.stat().st_size < 100:
        errors.append(f"{app}: missing/empty approved compact stylesheet")
    if app == "one":
        if "zavi-approved-compact-v1.css" not in html:
            errors.append("one: approved stylesheet not referenced in index.html")
    else:
        showcase = base / "zavi-admin-showcase-v1459.css"
        if "zavi-admin-showcase-v1459.css" not in html:
            errors.append("admin: showcase stylesheet not referenced in index.html")
        if not showcase.is_file() or "zavi-approved-compact-v1.css" not in showcase.read_text(encoding="utf-8"):
            errors.append("admin: approved stylesheet not imported by showcase")
    # Every explicitly referenced local stylesheet/script must exist.
    for tag, attr in (("script", "src"), ("link", "href")):
        pattern = rf'<{tag}\\b[^>]*\\b{attr}=["\\']([^"\\']+)'
        for match in re.finditer(pattern, html, re.IGNORECASE):
            value = match.group(1).split("?", 1)[0].split("#", 1)[0]
            if not value or value.startswith(("https:", "http:", "data:", "//", "/")):
                continue
            if not value.endswith((".js", ".css")):
                continue
            resolved = (base / value).resolve()
            if not resolved.is_relative_to(ROOT) or not resolved.is_file():
                errors.append(f"{app}: missing referenced asset {value}")
if errors:
    print("Approved UI build preflight FAILED:")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print("Approved UI build preflight passed for both apps; functional QA remains required.")
