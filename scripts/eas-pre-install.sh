#!/bin/bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
# EAS pre-install hook for the mobile app.
#
# The root monorepo requires Node 18 (packages, turbo build),
# but Expo / Metro needs Node 22.  EAS sets Node 22 via
# eas.json "node" field, so we temporarily switch to 18 here
# to install + build the monorepo dependencies, then switch
# back to 22 so EAS continues with the correct versions.
# ──────────────────────────────────────────────────────────────

MONOREPO_NODE_VERSION=18
EXPO_NODE_VERSION=22

# Load nvm (available on EAS build VMs)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# ── Step 1: Switch to Node 18 for monorepo build ─────────────
echo "[eas-pre-install] Switching to Node $MONOREPO_NODE_VERSION for monorepo build..."
nvm install "$MONOREPO_NODE_VERSION"
nvm use "$MONOREPO_NODE_VERSION"
echo "[eas-pre-install] Node version: $(node -v)"

cd ../..

# Read the exact pnpm version from the root package.json packageManager field
PNPM_VERSION=$(node -e "const pkg = require('./package.json'); const m = pkg.packageManager?.match(/pnpm@(.+)/); console.log(m ? m[1] : '8.6.0')")
echo "[eas-pre-install] Installing pnpm@$PNPM_VERSION (from root package.json)"
npm install -g "pnpm@$PNPM_VERSION"
# --ignore-scripts: skip native addon builds (node-gyp) for desktop-only
# packages like win-verify-signature, bigint-buffer, @serialport/bindings.
pnpm install --frozen-lockfile --ignore-scripts
# This skips desktop/cli app builds entirely.
pnpm turbo build --filter='./packages/*'

echo "[eas-pre-install] Monorepo build complete."

# ── Step 2: Switch back to Node 22 for Expo/Metro ────────────
echo "[eas-pre-install] Restoring Node $EXPO_NODE_VERSION for Expo build..."
nvm use "$EXPO_NODE_VERSION"
# Reinstall latest pnpm under Node 22 so EAS doesn't inherit the old version
npm install -g pnpm
echo "[eas-pre-install] Restored — Node: $(node -v), pnpm: $(pnpm -v)"
