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
if [ -d "android/build/generated/source/codegen/android/app/build/generated/source/codegen/jni" ]; then
  echo "Copying codegen headers to correct location..."
  mkdir -p android/build/generated/source/codegen/jni
  cp -r android/build/generated/source/codegen/android/app/build/generated/source/codegen/jni/* \
        android/build/generated/source/codegen/jni/
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
