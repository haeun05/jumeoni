
#!/usr/bin/env python3
"""로컬 미리보기 서버 — 런처의 깨진 cwd와 무관하게 절대 경로로만 동작한다."""
import functools
import http.server
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
http.server.ThreadingHTTPServer(("127.0.0.1", 8747), Handler).serve_forever()
