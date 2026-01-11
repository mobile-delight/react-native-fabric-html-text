#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Android CI Test Runner ==="
echo "Working directory: $PACKAGE_DIR"
echo ""

# ========== Generate Codegen Headers ==========
echo "=== Generating Codegen Headers ==="
echo "Running React Native codegen to generate JNI headers..."
echo ""

cd "$PACKAGE_DIR"
node node_modules/react-native/scripts/generate-codegen-artifacts.js \
  --targetPlatform android \
  --path . \
  --outputPath android/build/generated/source/codegen

# Copy headers to expected location (codegen may output to nested path)
CODEGEN_SOURCE="android/build/generated/source/codegen/android/app/build/generated/source/codegen/jni"
CODEGEN_DEST="android/build/generated/source/codegen/jni"

if [ -d "$CODEGEN_SOURCE" ]; then
  # Verify source directory is non-empty before copying
  if [ -z "$(ls -A "$CODEGEN_SOURCE")" ]; then
    echo "ERROR: Codegen source directory is empty: $CODEGEN_SOURCE"
    exit 1
  fi

  echo "Copying codegen headers to correct location..."
  mkdir -p "$CODEGEN_DEST"

  # Use -P to avoid following symlinks
  if ! cp -rP "$CODEGEN_SOURCE"/* "$CODEGEN_DEST"/; then
    echo "ERROR: Failed to copy codegen headers from $CODEGEN_SOURCE to $CODEGEN_DEST"
    exit 1
  fi

  # Validate that files were actually copied
  if [ -z "$(ls -A "$CODEGEN_DEST")" ]; then
    echo "ERROR: Codegen destination is empty after copy: $CODEGEN_DEST"
    exit 1
  fi

  echo "Successfully copied codegen headers"
fi

echo ""

# ========== Standalone Tests ==========
echo "=== Running Standalone Tests ==="
echo "These tests run the core library code without React Native dependencies."
echo ""

cd "$SCRIPT_DIR"
./gradlew test --console=plain

echo ""
echo "=== Android Tests Complete ==="
