#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

printf "Serving NovaBoutique on http://localhost:%s (Ctrl+C pour quitter)\n" "$PORT"
python3 -m http.server "$PORT"
