#!/usr/bin/env bash

set -euo pipefail

# Script to build the React UI and copy it to the Go kodata directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
UI_DIR="$ROOT_DIR/ui"
KODATA_DIR="$ROOT_DIR/cmd/sockeye/kodata"

echo "Building React UI..."
cd "$UI_DIR"
yarn build

echo "Cleaning existing kodata directory..."
rm -rf "$KODATA_DIR"
mkdir -p "$KODATA_DIR"

echo "Copying build output to kodata..."
cp -r "$UI_DIR/build/"* "$KODATA_DIR/"

echo "UI build complete! Files copied to $KODATA_DIR"