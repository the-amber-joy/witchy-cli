# Installer Setup Complete! 🎉

## What Was Added

### 1. Windows Installer (NSIS)
- **File**: `installers/windows-installer.nsi`
- **Output**: `WitchyCLI-Setup-{version}.exe`
- **Features**:
  - Professional installer with GUI
  - Adds to Program Files
  - Optional PATH integration
  - Start Menu shortcuts
  - Desktop shortcut
  - Clean uninstaller
  - Registry integration

### 2. macOS DMG
- **Output**: `WitchyCLI-{version}.dmg`
- **Features**:
  - Native macOS app bundle
  - Drag-and-drop to Applications
  - Standard DMG interface
  - Info.plist with proper metadata

### 3. Linux Standalone
- **Output**: `witchy-cli-linux`
- Kept as standalone binary (Linux users prefer this)
- Manual installation instructions provided

## Build Scripts

### Local Development

**Windows**:
```bash
build-windows-installer.bat
```
Requires: NSIS installed and in PATH

**macOS**:
```bash
chmod +x build-macos-dmg.sh
./build-macos-dmg.sh
```
Requires: macOS system, create-dmg (installed automatically)

### GitHub Actions (Automated)

The workflow `.github/workflows/build-release.yml` now:
1. Builds executables for all platforms
2. Creates Windows installer on Windows runner
3. Creates macOS DMG on macOS runner
4. Uploads all files to GitHub Release

When you push a tag (e.g., `v1.0.1`), GitHub Actions will:
- Build everything automatically
- Create a release
- Attach all files:
  - `WitchyCLI-Setup-{version}.exe` (Windows installer)
  - `WitchyCLI-{version}.dmg` (macOS installer)
  - `witchy-cli-win.exe` (Windows standalone)
  - `witchy-cli-macos` (macOS standalone)
  - `witchy-cli-linux` (Linux standalone)

## Package.json Updates

New scripts added:
- `build:exe` - Build single executable
- `build:exe:all` - Build all platforms
- `build:installer:win` - Build Windows installer (local)
- `build:installer:mac` - Build macOS DMG (local)
- `build:installers` - Build both installers (local)

Old scripts kept for compatibility:
- `build` → renamed to `build:exe`
- `build:all` → renamed to `build:exe:all`

## Documentation

- Updated `README.md` with installer download options
- Created `installers/README.md` with detailed build instructions
- Created `assets/README.md` for icon guidelines

## Next Steps

1. **Optional**: Add custom icons
   - Windows: `assets/icon.ico` (256x256)
   - macOS: `assets/icon.icns` (512x512)
   - See `assets/README.md` for conversion tools

2. **Test locally**:
   ```bash
   # Windows (requires NSIS)
   build-windows-installer.bat
   
   # macOS (requires macOS)
   ./build-macos-dmg.sh
   ```

3. **Push a new tag to test automated builds**:
   ```bash
   git add .
   git commit -m "feat: add Windows and macOS installers"
   git push origin main
   git tag -a v1.0.1 -m "v1.0.1 - Added installers"
   git push origin v1.0.1
   ```

4. **Check GitHub Actions** to see the automated build

## Files Modified/Created

- `.github/workflows/build-release.yml` - Updated with installer jobs
- `package.json` - Added installer build scripts
- `.gitignore` - Added installer artifacts
- `README.md` - Updated with installer instructions
- `installers/windows-installer.nsi` - NSIS script
- `installers/README.md` - Build instructions
- `build-windows-installer.bat` - Local Windows build script
- `build-macos-dmg.sh` - Local macOS build script
- `assets/README.md` - Icon guidelines

## Removed

- `electron-builder` configuration (not needed for pre-built executables)
- Simplified approach using platform-native tools
