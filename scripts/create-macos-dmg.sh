#!/bin/bash

# Script to create a macOS DMG installer for Witchy CLI
# This creates a drag-and-drop installer that macOS users expect

set -e

VERSION=$(node -p "require('./package.json').version")
# The pkg tool creates dist/witchy-cli (not dist/witchy-cli-macos)
BINARY_PATH="dist/witchy-cli"
DMG_NAME="Witchy-CLI-${VERSION}-macos.dmg"
APP_NAME="Witchy CLI"

echo "Creating macOS DMG for Witchy CLI v${VERSION}..."

# Check if binary exists (try both possible names)
if [ ! -f "$BINARY_PATH" ] && [ ! -f "dist/witchy-cli-macos" ]; then
    echo "Error: Binary not found at $BINARY_PATH or dist/witchy-cli-macos"
    echo "Please run 'npm run build' first"
    exit 1
fi

# Use whichever binary exists
if [ -f "dist/witchy-cli-macos" ]; then
    BINARY_PATH="dist/witchy-cli-macos"
fi

# Create temporary directory for DMG contents
TMP_DIR=$(mktemp -d)
DMG_CONTENTS="${TMP_DIR}/dmg-contents"
mkdir -p "$DMG_CONTENTS"

# Copy binary
cp "$BINARY_PATH" "$DMG_CONTENTS/witchy"
chmod +x "$DMG_CONTENTS/witchy"

# Create README for the DMG
cat > "$DMG_CONTENTS/INSTALL.txt" << 'EOF'
WITCHY CLI - Installation Instructions
=======================================

Witchy CLI is a command-line tool. To install:

1. Open Terminal (Applications > Utilities > Terminal)

2. Drag the 'witchy' file into the Terminal window

3. Press Enter to see the help message

4. To install system-wide, run:
   sudo cp /path/to/witchy /usr/local/bin/
   
   (Drag the witchy file after 'cp' and before '/usr/local/bin/')

5. Enter your password when prompted

6. Test by typing: witchy herb rosemary

For more information, visit:
https://github.com/the-amber-joy/witchyLookup

✨ Happy spell crafting! ✨
EOF

# Create symbolic link to /usr/local/bin for easy installation
# (This won't work in DMG, but we can create an install script)
cat > "$DMG_CONTENTS/install.sh" << 'EOF'
#!/bin/bash

# Install Witchy CLI to /usr/local/bin

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Installing Witchy CLI..."

if [ ! -w "/usr/local/bin" ]; then
    echo "Installing to /usr/local/bin (requires sudo)..."
    sudo cp "$SCRIPT_DIR/witchy" /usr/local/bin/witchy
    sudo chmod +x /usr/local/bin/witchy
else
    cp "$SCRIPT_DIR/witchy" /usr/local/bin/witchy
    chmod +x /usr/local/bin/witchy
fi

echo "✨ Witchy CLI installed successfully!"
echo "Run 'witchy herb rosemary' to test it out."
EOF

chmod +x "$DMG_CONTENTS/install.sh"

# Create the DMG using hdiutil (built into macOS)
echo "Creating DMG with hdiutil..."

# Remove old DMG if it exists
rm -f "dist/$DMG_NAME"

# Create DMG
hdiutil create -volname "Witchy CLI v${VERSION}" \
    -srcfolder "$DMG_CONTENTS" \
    -ov \
    -format UDZO \
    "dist/$DMG_NAME"

# Clean up
rm -rf "$TMP_DIR"

if [ -f "dist/$DMG_NAME" ]; then
    echo "✅ macOS DMG created: dist/$DMG_NAME"
    echo ""
    echo "Users can:"
    echo "  1. Mount the DMG file"
    echo "  2. Run the install.sh script"
    echo "  3. Or drag 'witchy' to /usr/local/bin manually"
else
    echo "❌ Failed to create DMG"
    exit 1
fi
