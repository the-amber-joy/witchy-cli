# Installer Build Instructions

This directory contains configuration files for creating installers.

## Windows Installer (NSIS)

### Prerequisites
1. Install [NSIS (Nullsoft Scriptable Install System)](https://nsis.sourceforge.io/Download)
2. Add NSIS to your PATH (usually `C:\Program Files (x86)\NSIS`)

### Building the Windows Installer

```bash
# 1. Build the executable
npm run build:exe:all

# 2. Create the installer using NSIS
makensis /DVERSION=1.0.0 installers/windows-installer.nsi
```

The installer will be created in `dist/WitchyCLI-Setup-1.0.0.exe`

### Features
- Adds Witchy CLI to Program Files
- Optional: Adds to PATH environment variable
- Creates Start Menu shortcuts
- Creates Desktop shortcut
- Clean uninstaller

## macOS Installer (DMG)

### Prerequisites
- macOS system (for building)
- `create-dmg` utility

### Building the macOS DMG

```bash
# 1. Build the executable
npm run build:exe:all

# 2. Create app bundle structure
mkdir -p installers/macos/WitchyCLI.app/Contents/MacOS
cp dist/witchy-cli-macos installers/macos/WitchyCLI.app/Contents/MacOS/witchy
chmod +x installers/macos/WitchyCLI.app/Contents/MacOS/witchy

# 3. Create Info.plist
cat > installers/macos/WitchyCLI.app/Contents/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>witchy</string>
    <key>CFBundleIdentifier</key>
    <string>com.witchy.cli</string>
    <key>CFBundleName</key>
    <string>Witchy CLI</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# 4. Create DMG (requires macOS)
npx create-dmg installers/macos/WitchyCLI.app dist/ --overwrite
```

The DMG will be created in `dist/`

## Linux (Standalone Binary)

Linux users prefer standalone binaries, so no installer is created. The executable is distributed as-is:
- `dist/witchy-cli-linux` - Standalone executable

Users can install it manually:
```bash
sudo cp witchy-cli-linux /usr/local/bin/witchy
sudo chmod +x /usr/local/bin/witchy
```

## GitHub Actions Integration

The `.github/workflows/build-release.yml` workflow can be updated to automatically build installers on release:

1. Windows: Run NSIS on Windows runner
2. macOS: Run create-dmg on macOS runner  
3. Linux: Upload standalone binary

See the workflow file for implementation details.
