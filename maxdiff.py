#!/usr/bin/env python3
"""Max/MSP Patch Diff Tool — HTTP server that serves the visual diff UI."""

from __future__ import annotations

import http.server
import json
import os
import socketserver
import threading
import webbrowser
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Final, final, override

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


# ─── JSON Loading ─────────────────────────────────────────────────────────────

_NULL_PATHS: Final = frozenset({"/dev/null", "NUL"})


def load_patch(path: Path) -> PatchData:
    """Load a Max patch as JSON.  Handles .amxd (binary) and plain JSON formats.
    Returns None when the path is absent or a git null sentinel."""
    if not path.exists() or path.name in _NULL_PATHS:
        return None

    raw = path.read_bytes()

    if path.suffix.lower() == ".amxd":
        return _parse_amxd(raw)

    try:
        return json.loads(raw.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


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
        if self.path == "/diff-data":
            self._serve_diff_data()
        else:
            super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/shutdown":
            self.send_response(200)
            self.end_headers()
            threading.Thread(target=self.server.shutdown, daemon=True).start()
        else:
            self.send_error(404)

    def _serve_diff_data(self) -> None:
        # `self.server` is typed as `BaseServer` by the stdlib stubs; we know
        # it is always a `DiffServer` at runtime, so we down-cast once here.
        assert isinstance(self.server, DiffServer)
        req = self.server.diff_request
        payload = json.dumps(
            {
                "old": load_patch(req.old_file),
                "new": load_patch(req.new_file),
                "filename": req.file_path,
            }
        ).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        _ = self.wfile.write(payload)


# ─── Server ───────────────────────────────────────────────────────────────────


@final
class DiffServer(socketserver.TCPServer):
    """TCPServer that carries the DiffRequest for the handler to read."""

    allow_reuse_address: bool = True

    def __init__(
        self,
        server_address: tuple[str, int],
        handler: type[DiffHandler],
        diff_request: DiffRequest,
    ) -> None:
        super().__init__(server_address, handler)
        self.diff_request: Final[DiffRequest] = diff_request


# ─── CLI Argument Parsing ─────────────────────────────────────────────────────

_USAGE = """\
Usage modes:
  1. Git difftool:  maxdiff.py <path> <old> <old-hex> <old-mode> <new> <new-hex> <new-mode>
  2. Standalone:    maxdiff.py <old.maxpat> <new.maxpat>
"""


def parse_args(argv: Sequence[str], cwd: Path) -> DiffRequest | None:
    """Return a DiffRequest from raw CLI arguments, or None on invalid input."""

    def resolve(raw: str) -> Path:
        return Path(raw) if raw in _NULL_PATHS else cwd / raw

    match list(argv):
        case [path, old_raw, _, _, new_raw, _, _]:  # git difftool (7 args)
            return DiffRequest(
                old_file=resolve(old_raw),
                new_file=resolve(new_raw),
                file_path=path,
            )
        case [old_arg, new_arg]:  # standalone (2 args)
            old, new = cwd / old_arg, cwd / new_arg
            return DiffRequest(
                old_file=old,
                new_file=new,
                file_path=f"{old.name} vs {new.name}",
            )
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
