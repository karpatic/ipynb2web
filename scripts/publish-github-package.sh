#!/usr/bin/env bash
set -euo pipefail

# Publish a GitHub Packages mirror for ipynb2web
# npm package: ipynb2web
# GitHub Packages mirror: @karpatic/ipynb2web

REPO_OWNER="${GITHUB_OWNER:-karpatic}"
REGISTRY="https://npm.pkg.github.com"
TOKEN="${GITHUB_NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "Error: set GITHUB_NPM_TOKEN (or NODE_AUTH_TOKEN) with write:packages scope."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

# Pack the exact npm payload first, then republish under a scoped name.
PACK_JSON=$(npm pack --json --pack-destination "$TMP_DIR")
TARBALL=$(node -e 'const d=JSON.parse(process.argv[1]);console.log(d[0].filename)' "$PACK_JSON")

tar -xzf "$TMP_DIR/$TARBALL" -C "$TMP_DIR"

PKG_JSON="$TMP_DIR/package/package.json"
node - <<'NODE' "$PKG_JSON" "$REPO_OWNER" "$REGISTRY"
const fs = require('fs');
const [,, filePath, owner, registry] = process.argv;
const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
pkg.name = `@${owner}/${pkg.name}`;
pkg.publishConfig = {
  ...(pkg.publishConfig || {}),
  registry,
};
fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
NODE

cat > "$TMP_DIR/package/.npmrc" <<EOF
@${REPO_OWNER}:registry=${REGISTRY}
//npm.pkg.github.com/:_authToken=${TOKEN}
EOF

echo "Publishing @${REPO_OWNER}/ipynb2web to GitHub Packages..."
(
  cd "$TMP_DIR/package"
  npm publish --access public --ignore-scripts
)

echo "Published @${REPO_OWNER}/ipynb2web"
