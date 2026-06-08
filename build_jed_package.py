#!/usr/bin/env python3
"""Build clean Joomla install archives for HC Carlix."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent
TEMPLATE_ZIP = ROOT / "tpl_hc_carlix.zip"
PACKAGE_ZIP = ROOT / "pkg_hc_carlix.zip"

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
    "build_jed_package.py",
    "pkg_hc_carlix.xml",
    "en-GB.pkg_hc_carlix.sys.ini",
    "pt-BR.pkg_hc_carlix.sys.ini",
    TEMPLATE_ZIP.name,
    PACKAGE_ZIP.name,
}

TEMPLATE_EXCLUDE_SUFFIXES = {
    ".pyc",
}

PACKAGE_FILES = [
    "pkg_hc_carlix.xml",
    "en-GB.pkg_hc_carlix.sys.ini",
    "pt-BR.pkg_hc_carlix.sys.ini",
    TEMPLATE_ZIP.name,
]


def should_skip(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)

    if parts & TEMPLATE_EXCLUDE_NAMES:
        return True

    return path.suffix in TEMPLATE_EXCLUDE_SUFFIXES


def add_file(archive: ZipFile, path: Path, arcname: str | None = None) -> None:
    archive.write(path, arcname or path.relative_to(ROOT).as_posix())


def build_template_zip() -> None:
    if TEMPLATE_ZIP.exists():
        TEMPLATE_ZIP.unlink()

    with ZipFile(TEMPLATE_ZIP, "w", ZIP_DEFLATED) as archive:
        for path in sorted(ROOT.rglob("*")):
            if path.is_dir() or should_skip(path):
                continue

            add_file(archive, path)


def build_package_zip() -> None:
    if PACKAGE_ZIP.exists():
        PACKAGE_ZIP.unlink()

    with ZipFile(PACKAGE_ZIP, "w", ZIP_DEFLATED) as archive:
        for filename in PACKAGE_FILES:
            add_file(archive, ROOT / filename, filename)


def main() -> None:
    build_template_zip()
    build_package_zip()
    print(f"Built {TEMPLATE_ZIP.name}")
    print(f"Built {PACKAGE_ZIP.name}")


if __name__ == "__main__":
    main()
