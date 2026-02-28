# pyright: basic

import argparse
import http.server
import socketserver
import threading
import webbrowser
import json


class DiffHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path == "/diff-data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            with open(self.server.old_file, "r") as f_old, open(
                self.server.new_file, "r"
            ) as f_new:
                data = {"old": json.load(f_old), "new": json.load(f_new)}
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=str)
    parser.add_argument("old_file", type=str)
    parser.add_argument("old_hex", type=str)
    parser.add_argument("old_mode", type=str)
    parser.add_argument("new_file", type=str)
    parser.add_argument("new_hex", type=str)
    parser.add_argument("new_mode", type=str)
    args = parser.parse_args()

    with socketserver.TCPServer(("", 0), DiffHandler) as httpd:
        port = httpd.server_address[1]
        httpd.old_file = args.old_file
        httpd.new_file = args.new_file
        webbrowser.open(f"http://localhost:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
