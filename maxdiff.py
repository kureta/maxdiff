import argparse
import http.server
import socketserver
import threading
import webbrowser
import json
import os
from typing import Tuple, Optional, Any


class DiffServer(socketserver.TCPServer):
    def __init__(
        self,
        server_address: Tuple[str, int],
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
    server: DiffServer

    def log_message(self, format: str, *args: Any) -> None:
        # Suppress logging to keep console clean for git
        pass

    def load_json_safe(self, filepath: str) -> Optional[Any]:
        # Handle git's /dev/null for added/removed files
        if filepath == "/dev/null" or (os.name == "nt" and filepath.upper() == "NUL"):
            return None
            
        if not os.path.exists(filepath):
            return None

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return None
                return json.loads(content)
        except (OSError, json.JSONDecodeError):
            # If we can't read it as JSON, treat as empty/None
            # This handles binary files or non-JSON files gracefully
            return None

    def do_GET(self) -> None:
        if self.path == "/diff-data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            try:
                old_data = self.load_json_safe(self.server.old_file)
                new_data = self.load_json_safe(self.server.new_file)
                
                data = {
                    "old": old_data,
                    "new": new_data,
                    "filename": self.server.file_path,
                }
                self.wfile.write(json.dumps(data).encode("utf-8"))
            except Exception as e:
                # Fallback error handling
                # We can't use send_error here easily if headers are already sent
                # but we can try to write an error json if possible
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
    # Ensure we serve files from the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    parser = argparse.ArgumentParser(description="Max/MSP Patch Diff Tool")
    parser.add_argument("path", type=str, help="Path to the file being compared")
    parser.add_argument("old_file", type=str, help="Path to the old version")
    parser.add_argument("old_hex", type=str, help="SHA1 hash of the old version")
    parser.add_argument("old_mode", type=str, help="File mode of the old version")
    parser.add_argument("new_file", type=str, help="Path to the new version")
    parser.add_argument("new_hex", type=str, help="SHA1 hash of the new version")
    parser.add_argument("new_mode", type=str, help="File mode of the new version")
    args = parser.parse_args()

    with DiffServer(
        ("", 0), DiffHandler, args.old_file, args.new_file, args.path
    ) as httpd:
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
