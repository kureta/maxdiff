import argparse
import http.server
import json
import socketserver
import threading
import webbrowser
from pathlib import Path
from typing import Any, Final


class DiffHandler(http.server.SimpleHTTPRequestHandler):
    """Handles requests for the diff tool UI and data."""

    def log_message(self, format: str, *args: Any) -> None:
        """Suppress logging to keep console clean."""

    def load_patch_json(self, path: Path | str) -> Any | None:
        """Safely load JSON from a file, handling git's /dev/null and AMXD binary
        formats."""
        path = Path(path)
        if not path.exists() or path.name in ("/dev/null", "NUL"):
            return None

        try:
            # AMXD files are binary with embedded JSON.
            if path.suffix.lower() == ".amxd":
                content = path.read_bytes()
                # Find the 'ptch' tag or just the first JSON object
                start_idx = content.find(b"ptch")
                start = content.find(b"{", max(0, start_idx))
                end = content.rfind(b"}")
                if -1 < start < end:
                    return json.loads(content[start: end + 1].decode("utf-8"))

            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError, UnicodeDecodeError):
            return None

    def do_GET(self) -> None:
        if self.path == "/diff-data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            server: DiffServer = self.server  # type: ignore
            data = {
                "old": self.load_patch_json(server.old_file),
                "new": self.load_patch_json(server.new_file),
                "filename": server.file_path,
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/shutdown":
            self.send_response(200)
            self.end_headers()
            threading.Thread(target=self.server.shutdown).start()
        else:
            self.send_error(404)


class DiffServer(socketserver.TCPServer):
    """A simple TCP server that stores diff-related file paths."""

    def __init__(self, server_address: tuple[str, int],
                 RequestHandlerClass: type[DiffHandler], old_file: str | Path,
                 new_file: str | Path, file_path: str, ) -> None:
        super().__init__(server_address, RequestHandlerClass)
        self.old_file: Final = old_file
        self.new_file: Final = new_file
        self.file_path: Final = file_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Max/MSP Patch Diff Tool")
    parser.add_argument("args", nargs="*", help="Arguments")
    raw_args = parser.parse_args().args

    cwd = Path.cwd()
    # Change to the script's directory to serve static files correctly
    import os
    os.chdir(Path(__file__).parent.resolve())

    match raw_args:
        case [path, old_raw, _, _, new_raw, _, _]:  # Git difftool mode
            file_path = path
            old_file = cwd / old_raw if old_raw != "/dev/null" else Path(old_raw)
            new_file = cwd / new_raw if new_raw != "/dev/null" else Path(new_raw)
        case [old_arg, new_arg]:  # Standalone mode
            file_path = f"{Path(old_arg).name} vs {Path(new_arg).name}"
            old_file, new_file = cwd / old_arg, cwd / new_arg
        case _:
            print("""Usage modes:
    1. Git difftool: maxdiff.py path old_file old_hex old_mode new_file new_hex new_mode
    2. Standalone:   maxdiff.py old.maxpat new.maxpat""")
            return

    with DiffServer(("", 0), DiffHandler, old_file, new_file, file_path) as httpd:
        port = httpd.server_address[1]
        url = f"http://localhost:{port}"
        print(f"Serving diff tool at {url}\nPress Ctrl+C to stop.")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")


if __name__ == "__main__":
    main()
