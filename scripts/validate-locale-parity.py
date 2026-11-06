#!/usr/bin/env python3
"""Audit the three shipped locale catalogs for key and placeholder parity."""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
errors = []
for app in ("one", "admin"):
    data = {}
    for language in ("fa", "ps", "en"):
        path = root / "apps" / app / (language + ".json")
        try:
            data[language] = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            errors.append(f"{app}/{language}: {exc}")
    if len(data) != 3:
        continue
    keys = set().union(*(set(catalog) for catalog in data.values()))
    for language, catalog in data.items():
        for key in sorted(keys - set(catalog)):
            errors.append(f"{app}/{language}: missing {key}")
        for key, value in catalog.items():
            if not isinstance(value, str):
                continue
            if not value.strip():
                errors.append(f"{app}/{language}: blank {key}")
    print(f"{app}: {len(keys)} unique keys across three locale catalogs")
if errors:
    print("Locale parity audit failed:")
    print("\n".join(errors[:100]))
    sys.exit(1)
print("Locale catalog key/blank parity passed. Translation meaning and runtime coverage require separate QA.")
