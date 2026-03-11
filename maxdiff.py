#!/usr/bin/env python3
"""Max/MSP Patch Diff Tool — HTTP server that serves the visual diff UI."""

from __future__ import annotations

import http.server
import json
import os
import socketserver
import subprocess
import threading
import webbrowser
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Final, final, override
from urllib.parse import parse_qs, urlparse

# `argparse` types its namespace attributes as `Any`; access them via a typed
# wrapper instead so none of that `Any` leaks into our own code.
import argparse

if TYPE_CHECKING:
    from collections.abc import Sequence


# ─── Data ─────────────────────────────────────────────────────────────────────

# A Max patch is arbitrary nested JSON.  We represent the loaded value as
# `object` (the top of Python's type hierarchy for JSON-compatible values)
# rather than `Any`, which tells Pyright we know nothing about the structure
# but deliberately accept any concrete type.
type PatchData = object | None


@dataclass(frozen=True, slots=True)
class DiffRequest:
    old_file: Path
    new_file: Path
    file_path: str
    git_file: Path | None = None
    git_root: Path | None = None


@dataclass(frozen=True, slots=True)
class GitRequest:
    file_path: Path
    repo_root: Path


# ─── JSON Loading ─────────────────────────────────────────────────────────────

_NULL_PATHS: Final = frozenset({"/dev/null", "NUL"})


def parse_patch_bytes(data: bytes, ext: str) -> PatchData:
    """Parse patch bytes by extension. Returns None on failure."""
    if ext == ".amxd":
        return _parse_amxd(data)
    try:
        return json.loads(data.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def load_patch(path: Path) -> PatchData:
    """Load a Max patch as JSON.  Handles .amxd (binary) and plain JSON formats.
    Returns None when the path is absent or a git null sentinel."""
    if not path.exists() or path.name in _NULL_PATHS:
        return None
    return parse_patch_bytes(path.read_bytes(), path.suffix.lower())


# ─── Git Helpers ──────────────────────────────────────────────────────────────


def find_repo_root(path: Path) -> Path | None:
    r = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        cwd=path.parent,
    )
    return Path(r.stdout.strip()) if r.returncode == 0 else None


def git_log(filepath: Path, repo_root: Path) -> list[dict[str, str]]:
    rel = filepath.relative_to(repo_root)
    r = subprocess.run(
        ["git", "log", "--follow", "--format=%H\t%s\t%ai", "--", str(rel)],
        capture_output=True,
        text=True,
        cwd=repo_root,
    )
    entries: list[dict[str, str]] = []
    for line in r.stdout.strip().splitlines():
        sha, msg, date = line.split("\t", 2)
        entries.append(
            {"sha": sha, "short_sha": sha[:7], "message": msg, "date": date.strip()}
        )
    entries.reverse()  # oldest-first
    entries.append(
        {"sha": "WORKING", "short_sha": "work", "message": "Working tree", "date": ""}
    )
    return entries


def git_show(sha: str, filepath: Path, repo_root: Path) -> PatchData:
    if sha == "WORKING":
        return load_patch(filepath)
    rel = filepath.relative_to(repo_root)
    r = subprocess.run(
        ["git", "show", f"{sha}:{rel}"], capture_output=True, cwd=repo_root
    )
    return (
        parse_patch_bytes(r.stdout, filepath.suffix.lower())
        if r.returncode == 0
        else None
    )


def _parse_amxd(data: bytes) -> PatchData:
    """Extract the embedded JSON object from an AMXD binary file."""
    tag_pos = data.find(b"ptch")
    start = data.find(b"{", max(0, tag_pos))
    end = data.rfind(b"}")
    if -1 < start < end:
        try:
            return json.loads(data[start : end + 1].decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass
    return None


# ─── HTTP Handler ─────────────────────────────────────────────────────────────


class DiffHandler(http.server.SimpleHTTPRequestHandler):
    """Serves the static UI and the /diff-data JSON endpoint."""

    @override
    def log_message(self, format: str, *args: str | int) -> None:  # noqa: A002
        pass  # suppress request logging

    @override
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/diff-data":
            self._serve_diff_data(parse_qs(parsed.query))
        elif parsed.path == "/commits":
            self._serve_commits()
        else:
            super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/shutdown":
            self.send_response(200)
            self.end_headers()
            threading.Thread(target=self.server.shutdown, daemon=True).start()
        else:
            self.send_error(404)

    def _send_json(self, payload: bytes) -> None:
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        _ = self.wfile.write(payload)

    def _serve_diff_data(self, params: dict[str, list[str]]) -> None:
        # `self.server` is typed as `BaseServer` by the stdlib stubs; we know
        # it is always a `DiffServer` at runtime, so we down-cast once here.
        assert isinstance(self.server, DiffServer)
        req = self.server.diff_request
        before = params.get("before", [None])[0]
        after = params.get("after", [None])[0]

        if isinstance(req, GitRequest):
            if not before or not after:
                self.send_error(400)
                return
            payload = json.dumps(
                {
                    "old": git_show(before, req.file_path, req.repo_root),
                    "new": git_show(after, req.file_path, req.repo_root),
                    "filename": req.file_path.name,
                }
            ).encode()
        elif isinstance(req, DiffRequest) and req.git_file and req.git_root and before and after:
            payload = json.dumps(
                {
                    "old": git_show(before, req.git_file, req.git_root),
                    "new": git_show(after, req.git_file, req.git_root),
                    "filename": req.git_file.name,
                }
            ).encode()
        else:
            payload = json.dumps(
                {
                    "old": load_patch(req.old_file),
                    "new": load_patch(req.new_file),
                    "filename": req.file_path,
                }
            ).encode()
        self._send_json(payload)

    def _serve_commits(self) -> None:
        assert isinstance(self.server, DiffServer)
        req = self.server.diff_request
        if isinstance(req, GitRequest):
            payload = json.dumps(git_log(req.file_path, req.repo_root)).encode()
        elif isinstance(req, DiffRequest) and req.git_file and req.git_root:
            payload = json.dumps(git_log(req.git_file, req.git_root)).encode()
        else:
            self.send_error(404)
            return
        self._send_json(payload)


# ─── Server ───────────────────────────────────────────────────────────────────


@final
class DiffServer(socketserver.TCPServer):
    """TCPServer that carries the diff request for the handler to read."""

    allow_reuse_address: bool = True

    def __init__(
        self,
        server_address: tuple[str, int],
        handler: type[DiffHandler],
        diff_request: DiffRequest | GitRequest,
    ) -> None:
        super().__init__(server_address, handler)
        self.diff_request: Final[DiffRequest | GitRequest] = diff_request


# ─── CLI Argument Parsing ─────────────────────────────────────────────────────

_USAGE = """\
Usage modes:
  1. Git difftool:  maxdiff.py <path> <old> <old-hex> <old-mode> <new> <new-hex> <new-mode>
  2. Standalone:    maxdiff.py <old.maxpat> <new.maxpat>
  3. Git history:   maxdiff.py <file.maxpat>
"""


def parse_args(argv: Sequence[str], cwd: Path) -> DiffRequest | GitRequest | None:
    """Return a request from raw CLI arguments, or None on invalid input."""

    def resolve(raw: str) -> Path:
        return Path(raw) if raw in _NULL_PATHS else cwd / raw

    match list(argv):
        case [path, old_raw, _, _, new_raw, _, _]:  # git difftool (7 args)
            git_file = (cwd / path).resolve()
            git_root = find_repo_root(git_file) if git_file.exists() else None
            return DiffRequest(
                old_file=resolve(old_raw),
                new_file=resolve(new_raw),
                file_path=path,
                git_file=git_file if git_root else None,
                git_root=git_root,
            )
        case [old_arg, new_arg]:  # standalone (2 args)
            old, new = cwd / old_arg, cwd / new_arg
            return DiffRequest(
                old_file=old,
                new_file=new,
                file_path=f"{old.name} vs {new.name}",
            )
        case [filepath_str]:  # git history mode
            fp = (cwd / filepath_str).resolve()
            if not fp.exists():
                return None
            root = find_repo_root(fp)
            return GitRequest(file_path=fp, repo_root=root) if root else None
        case _:
            return None


# ─── Entry Point ──────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Max/MSP Patch Diff Tool", add_help=False
    )
    _ = parser.add_argument("args", nargs="*")
    cwd = Path.cwd()

    # `parse_args().args` is typed `Any` by argparse stubs; cast to the known
    # concrete type immediately so `Any` doesn't propagate further.
    raw: list[str] = parser.parse_args().args

    request = parse_args(raw, cwd)
    if request is None:
        print(_USAGE)
        return

    # Serve static files from the script's directory.
    os.chdir(Path(__file__).parent.resolve())

    with DiffServer(("", 0), DiffHandler, request) as server:
        port = server.server_address[1]
        url = f"http://localhost:{port}"
        print(f"Serving diff tool at {url}\nPress Ctrl+C to stop.")
        _ = webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")


if __name__ == "__main__":
    main()
