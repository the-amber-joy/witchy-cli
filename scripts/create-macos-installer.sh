#!/bin/bash

# Script to create a macOS installer package (.pkg) for Witchy CLI
# This creates a proper installer that macOS users can double-click

set -e

VERSION=$(node -p "require('./package.json').version")
BINARY_PATH="dist/witchy-cli-macos"
INSTALL_DIR="/usr/local/bin"
PKG_NAME="witchy-cli-${VERSION}-macos.pkg"

echo "Creating macOS installer for Witchy CLI v${VERSION}..."

# Check if binary exists
if [ ! -f "$BINARY_PATH" ]; then
    echo "Error: Binary not found at $BINARY_PATH"
    echo "Please run 'npm run build' first"
    exit 1
fi

# Create temporary directory structure
TMP_DIR=$(mktemp -d)
PAYLOAD_DIR="${TMP_DIR}/payload"
SCRIPTS_DIR="${TMP_DIR}/scripts"

mkdir -p "$PAYLOAD_DIR$INSTALL_DIR"
mkdir -p "$SCRIPTS_DIR"

# Copy binary to payload
cp "$BINARY_PATH" "$PAYLOAD_DIR$INSTALL_DIR/witchy"
chmod +x "$PAYLOAD_DIR$INSTALL_DIR/witchy"

# Create postinstall script
cat > "$SCRIPTS_DIR/postinstall" << 'EOF'
#!/bin/bash
chmod +x /usr/local/bin/witchy
echo "✨ Witchy CLI installed successfully!"
echo "Run 'witchy herb rosemary' to test it out."
exit 0
EOF

chmod +x "$SCRIPTS_DIR/postinstall"

# Build the package
pkgbuild --root "$PAYLOAD_DIR" \
         --scripts "$SCRIPTS_DIR" \
         --identifier "dev.amberjoy.witchy-cli" \
         --version "$VERSION" \
         --install-location / \
         "dist/$PKG_NAME"

# Clean up
rm -rf "$TMP_DIR"

echo "✅ macOS installer created: dist/$PKG_NAME"
echo ""
echo "Users can install by:"
echo "  1. Double-clicking the .pkg file"
echo "  2. Following the installer prompts"
echo "  3. Running 'witchy' from any terminal"
