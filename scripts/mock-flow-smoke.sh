#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${TMPDIR:-/tmp}/gonghuixinfeng-mock-test"
rm -rf "$OUT"
tsc -p "$ROOT/apps/miniprogram/tsconfig.json" --outDir "$OUT" --noEmit false
node "$ROOT/scripts/mock-flow-smoke.cjs" "$OUT"
rm -rf "$OUT"
