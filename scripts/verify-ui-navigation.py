#!/usr/bin/env python3
"""Fail CI if the PDF route attribute intercepts all navigation clicks again."""
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
html = (root / "apps/one/index.html").read_text(encoding="utf-8")
route_map = (root / "apps/one/zavi-pdf-screen-map-v6740.js").read_text(encoding="utf-8")
ui_js = root / "apps/one/zavi-simple-workspace-v1.js"
ui_css = root / "apps/one/zavi-simple-workspace-v1.css"
head = html.split("</head>", 1)[0]

assert "document.body.dataset.zaviPage = route" in route_map, "Missing route attribute contract"
assert "const pagingButton=e.target.closest('button[data-zavi-page][data-direction]');" in html, "Pager must only handle explicit pager buttons"
assert "e.target.closest('[data-zavi-page]')" not in html, "Regression: global body attribute swallows all menu clicks"
assert "let goEl=e.target.closest('[data-go]');if(goEl){go(goEl.dataset.go);return}" in html, "Delegated main route click missing"
for route in ("sales", "purchases", "products", "contacts", "debtors", "creditors", "money", "reports", "settings"):
    assert f"['{route}'," in html, f"Navigation item missing: {route}"

assert '<link rel="stylesheet" href="./zavi-simple-workspace-v1.css?v=1">' in head, "Simple CSS is not loaded"
assert '<script defer src="./zavi-simple-workspace-v1.js?v=1"></script>' in head, "Simple settings code is not loaded"
assert ui_js.is_file() and ui_css.is_file(), "Simple workspace assets missing"
script = ui_js.read_text(encoding="utf-8")
for needle in ("zavi-settings-6546-group", "zavi-simple-settings-group", "MutationObserver", "openState"):
    assert needle in script, f"Settings grouping contract missing: {needle}"
if shutil.which("node"):
    subprocess.run(["node", "--check", str(ui_js)], check=True)
print("ZAVI navigation / simple workspace static checks: PASS")
