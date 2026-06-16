#!/usr/bin/env python3
"""Build a clean Joomla template install archive for HC Carlix."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent
TEMPLATE_ZIP = ROOT / "tpl_hc_carlix.zip"

TEMPLATE_EXCLUDE_NAMES = {
    ".git",
    ".idea",
    "__pycache__",
    ".gitignore",
    "AGENTS.md",
    "CLAUDE.md",
    "CODEX.md",
    "README.md",
    "SKILL.md",
    "build_template_zip.py",
    TEMPLATE_ZIP.name,
}

TEMPLATE_EXCLUDE_SUFFIXES = {
    ".pyc",
}


def should_skip(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)

    if parts & TEMPLATE_EXCLUDE_NAMES:
        return True

    return path.suffix in TEMPLATE_EXCLUDE_SUFFIXES


def build_template_zip() -> None:
    if TEMPLATE_ZIP.exists():
        TEMPLATE_ZIP.unlink()

    with ZipFile(TEMPLATE_ZIP, "w", ZIP_DEFLATED) as archive:
        for path in sorted(ROOT.rglob("*")):
            if path.is_dir() or should_skip(path):
                continue

            archive.write(path, path.relative_to(ROOT).as_posix())


def main() -> None:
    build_template_zip()
    print(f"Built {TEMPLATE_ZIP.name}")


if __name__ == "__main__":
    main()
