#!/bin/bash
# Build macOS DMG Script
# Must be run on macOS

set -e

echo "========================================"
echo "Building Witchy CLI macOS DMG"
echo "========================================"
echo

# Step 1: Build the executable
echo "[1/4] Building executable..."
npm run build:exe:all
echo

# Step 2: Create app bundle structure
echo "[2/4] Creating app bundle..."
mkdir -p installers/macos/WitchyCLI.app/Contents/MacOS
mkdir -p installers/macos/WitchyCLI.app/Contents/Resources
cp dist/witchy-cli-macos installers/macos/WitchyCLI.app/Contents/MacOS/witchy
chmod +x installers/macos/WitchyCLI.app/Contents/MacOS/witchy
cp assets/icon.icns installers/macos/WitchyCLI.app/Contents/Resources/
echo

# Step 3: Create Info.plist
echo "[3/4] Creating Info.plist..."
cat > installers/macos/WitchyCLI.app/Contents/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>witchy</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.witchy.cli</string>
    <key>CFBundleName</key>
    <string>Witchy CLI</string>
    <key>CFBundleDisplayName</key>
    <string>Witchy CLI</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>NSHumanReadableCopyright</key>
    <string>© 2025 Amber Joy</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF
echo

# Step 4: Create DMG
echo "[4/4] Creating DMG..."
if ! command -v create-dmg &> /dev/null; then
    echo "Installing create-dmg..."
    npm install --global create-dmg
fi

create-dmg installers/macos/WitchyCLI.app dist/ --overwrite || true
# Rename to consistent name
mv dist/*.dmg dist/WitchyCLI-1.0.0.dmg 2>/dev/null || true

echo
echo "========================================"
echo "Build complete!"
echo "DMG: dist/WitchyCLI-1.0.0.dmg"
echo "========================================"
