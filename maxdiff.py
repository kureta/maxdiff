import argparse
import http.server
import json
import os
import socketserver
import threading
import webbrowser
from typing import Tuple, Optional, Any


class DiffServer(socketserver.TCPServer):
    def __init__(self, server_address: Tuple[str, int],
                 RequestHandlerClass: type[http.server.SimpleHTTPRequestHandler],
                 old_file: str, new_file: str, file_path: str) -> None:
        super().__init__(server_address, RequestHandlerClass)
        self.old_file = old_file
        self.new_file = new_file
        self.file_path = file_path


class DiffHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        # Suppress logging to keep console clean
        pass

    def load_json_safe(self, filepath: str) -> Optional[Any]:
        # Handle git's /dev/null for added/removed files
        if filepath == "/dev/null" or (os.name == "nt" and filepath.upper() == "NUL"):
            return None

        if not os.path.exists(filepath):
            return None

        # Check extension to decide how to parse
        is_amxd = filepath.lower().endswith(
            ".amxd") or self.server.file_path.lower().endswith(".amxd")

        if is_amxd:
            try:
                with open(filepath, "rb") as f:
                    content = f.read()

                # AMXD files are binary with embedded JSON.
                # We look for the JSON object bounded by { and }.
                # We prioritize finding "ptch" marker which usually precedes the JSON
                # in AMXD.
                start_idx = content.find(b'{')
                ptch_idx = content.find(b'ptch')

                if ptch_idx != -1:
                    possible_start = content.find(b'{', ptch_idx)
                    if possible_start != -1:
                        start_idx = possible_start

                end_idx = content.rfind(b'}')

                if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                    json_bytes = content[start_idx: end_idx + 1]
                    return json.loads(json_bytes.decode("utf-8"))
            except Exception:
                pass

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError, UnicodeDecodeError):
            return None

    def do_GET(self) -> None:
        if self.path == "/diff-data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            try:
                old_data = self.load_json_safe(self.server.old_file)
                new_data = self.load_json_safe(self.server.new_file)

                data = {"old": old_data, "new": new_data,
                        "filename": self.server.file_path, }
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
    cwd = os.getcwd()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    parser = argparse.ArgumentParser(description="Max/MSP Patch Diff Tool")
    parser.add_argument("args", nargs="*", help="Arguments")
    args = parser.parse_args()
    raw_args = args.args

    old_file = ""
    new_file = ""
    file_path = ""

    if len(raw_args) == 7:
        # Git difftool mode: path old_file old_hex old_mode new_file new_hex new_mode
        file_path = raw_args[0]
        old_file = raw_args[1]
        new_file = raw_args[4]

        if not os.path.isabs(old_file) and old_file != "/dev/null":
            old_file = os.path.abspath(os.path.join(cwd, old_file))
        if not os.path.isabs(new_file) and new_file != "/dev/null":
            new_file = os.path.abspath(os.path.join(cwd, new_file))

    elif len(raw_args) == 2:
        # Standalone mode: old_file new_file
        old_file_arg = raw_args[0]
        new_file_arg = raw_args[1]

        file_path = (f"{os.path.basename(old_file_arg)} vs "
                     f"{os.path.basename(new_file_arg)}")
        old_file = os.path.abspath(os.path.join(cwd, old_file_arg))
        new_file = os.path.abspath(os.path.join(cwd, new_file_arg))

    else:
        print("Usage modes:")
        print("  1. Git difftool: maxdiff.py path old_file old_hex old_mode new_file "
              "new_hex new_mode")
        print("  2. Standalone:   maxdiff.py old_file.maxpat new_file.maxpat")
        return

    # Use port 0 to let the OS choose an available port
    with DiffServer(("", 0), DiffHandler, old_file, new_file, file_path) as httpd:
        port = httpd.server_address[1]
        print(f"Serving diff tool at http://localhost:{port}")
        print("Press Ctrl+C to stop manually.")

        webbrowser.open(f"http://localhost:{port}")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
