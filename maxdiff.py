import argparse
import http.server
import json
import os
import socketserver
import threading
import webbrowser
from pathlib import Path
from typing import Any

class DiffServer(socketserver.TCPServer):
    def __init__(
        self,
        server_address: tuple[str, int],
        RequestHandlerClass: type[http.server.SimpleHTTPRequestHandler],
        old_file: str,
        new_file: str,
        file_path: str,
    ) -> None:
        super().__init__(server_address, RequestHandlerClass)
        self.old_file = old_file
        self.new_file = new_file
        self.file_path = file_path

class DiffHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        """Suppress logging to keep console clean."""
        pass

    def load_json_safe(self, filepath: str) -> Any | None:
        """Safely load JSON from a file, handling git's /dev/null and AMXD binary formats."""
        path = Path(filepath)
        if filepath in ("/dev/null", "NUL") or (os.name == "nt" and filepath.upper() == "NUL") or not path.exists():
            return None

        # AMXD files are binary with embedded JSON.
        if path.suffix.lower() == ".amxd" or self.server.file_path.lower().endswith(".amxd"):
            try:
                content = path.read_bytes()
                ptch_idx = content.find(b"ptch")
                start = content.find(b"{", ptch_idx) if ptch_idx != -1 else content.find(b"{")
                end = content.rfind(b"}")
                if -1 < start < end:
                    return json.loads(content[start : end + 1].decode("utf-8"))
            except Exception:
                pass

        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None

    def do_GET(self) -> None:
        if self.path == "/diff-data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            try:
                data = {
                    "old": self.load_json_safe(self.server.old_file),
                    "new": self.load_json_safe(self.server.new_file),
                    "filename": self.server.file_path,
                }
                self.wfile.write(json.dumps(data).encode("utf-8"))
            except Exception:
                pass
        else:
            super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/shutdown":
            self.send_response(200)
            self.end_headers()
            threading.Thread(target=self.server.shutdown).start()
        else:
            self.send_error(404)

def main() -> None:
    cwd = Path.cwd()
    os.chdir(Path(__file__).parent.absolute())

    parser = argparse.ArgumentParser(description="Max/MSP Patch Diff Tool")
    parser.add_argument("args", nargs="*", help="Arguments")
    raw_args = parser.parse_args().args

    match raw_args:
        case [path, old_raw, _, _, new_raw, _, _]: # Git difftool mode
            file_path = path
            old_file = str((cwd / old_raw).resolve()) if old_raw != "/dev/null" else old_raw
            new_file = str((cwd / new_raw).resolve()) if new_raw != "/dev/null" else new_raw
        case [old_arg, new_arg]: # Standalone mode
            file_path = f"{Path(old_arg).name} vs {Path(new_arg).name}"
            old_file = str((cwd / old_arg).resolve())
            new_file = str((cwd / new_arg).resolve())
        case _:
            print("Usage modes:\n  1. Git difftool: maxdiff.py path old_file old_hex old_mode new_file new_hex new_mode\n  2. Standalone:   maxdiff.py old.maxpat new.maxpat")
            return

    with DiffServer(("", 0), DiffHandler, old_file, new_file, file_path) as httpd:
        url = f"http://localhost:{httpd.server_address[1]}"
        print(f"Serving diff tool at {url}\nPress Ctrl+C to stop.")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    main()
