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
            old_file: str, new_file: str, file_path: str, ) -> None:
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

                data = {"old": old_data, "new": new_data,
                    "filename": self.server.file_path, }
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
    # Capture current working directory before changing it
    cwd = os.getcwd()
    
    # Change to script directory to serve static files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    parser = argparse.ArgumentParser(description="Max/MSP Patch Diff Tool")
    
    # We accept arbitrary arguments and parse them manually to support both modes
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
        
        # Resolve paths relative to original CWD if they are not absolute
        if not os.path.isabs(old_file) and old_file != "/dev/null":
            old_file = os.path.abspath(os.path.join(cwd, old_file))
        if not os.path.isabs(new_file) and new_file != "/dev/null":
            new_file = os.path.abspath(os.path.join(cwd, new_file))
            
    elif len(raw_args) == 2:
        # Standalone mode: old_file new_file
        old_file_arg = raw_args[0]
        new_file_arg = raw_args[1]
        
        file_path = f"{os.path.basename(old_file_arg)} vs {os.path.basename(new_file_arg)}"
        
        # Resolve paths relative to original CWD
        old_file = os.path.abspath(os.path.join(cwd, old_file_arg))
        new_file = os.path.abspath(os.path.join(cwd, new_file_arg))
        
    else:
        print("Usage modes:")
        print("  1. Git difftool: maxdiff.py path old_file old_hex old_mode new_file new_hex new_mode")
        print("  2. Standalone:   maxdiff.py old_file.maxpat new_file.maxpat")
        return

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
