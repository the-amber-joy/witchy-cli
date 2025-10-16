# macOS DMG Issue - Fix Summary

## Problem

When macOS users downloaded `witchy-cli-macos` and tried to open it, they saw a "garbled mess of text" instead of the application working.

## Root Cause

The `witchy-cli-macos` file is a **command-line binary executable**, not a macOS application bundle (`.app`) or disk image (`.dmg`). When users double-clicked it, macOS opened it in TextEdit, displaying the raw binary code as garbled characters.

This is the expected behavior for binary files, but it's confusing for users who expect Mac software to come in `.dmg` or `.app` format.

## Solution Implemented

### 1. Created DMG Installer Script

- **File**: `scripts/create-macos-dmg.sh`
- Creates a proper macOS disk image (`.dmg`) file
- Includes:
  - The `witchy` binary
  - An `install.sh` script for easy installation
  - `INSTALL.txt` with instructions
- Uses macOS built-in `hdiutil` (no external dependencies)

### 2. Updated Build Process

- Added npm scripts:
  - `npm run build:macos:dmg` - Create DMG installer
  - `npm run build:macos:pkg` - Create .pkg installer (alternative)
- Updated GitHub Actions workflow to automatically create DMG on releases
- DMG is uploaded alongside the raw binary

### 3. Documentation

Created comprehensive documentation:

- **MACOS_INSTALL.md**: Step-by-step installation guide for Mac users
  - Explains the three installation methods
  - Addresses Gatekeeper warnings
  - Troubleshooting section
- **README.md**: Updated with warning about double-clicking the binary
  - Clear notice that it's a CLI tool, not an app
  - Links to detailed macOS installation guide
- **.github/RELEASE_TEMPLATE.md**: Template for future releases
  - Clear instructions for each platform
  - Prominent warning for macOS users
- **.github/ISSUE_TEMPLATE/macos-garbled-text.md**: Issue template

  - Pre-filled response for users who see garbled text
  - Quick solutions and links to documentation

- **BUILD.md**: Added troubleshooting section
  - Explains the garbled text issue
  - Documents DMG creation process

## Benefits

### For Users

1. **DMG Option**: Mac users can download a familiar `.dmg` file
2. **Easy Installation**: Double-click the DMG and run `install.sh`
3. **Clear Instructions**: Documentation explains what to do
4. **Better Experience**: Matches macOS user expectations

### For Maintainers

1. **Fewer Support Issues**: Clear documentation reduces confusion
2. **Professional Distribution**: DMG is the standard for Mac software
3. **Automated**: GitHub Actions creates DMG on every release
4. **Backward Compatible**: Raw binary still available for advanced users

## Testing

To test the DMG creation locally (on macOS):

```bash
# Build the binary first
npm run build

# Create the DMG
npm run build:macos:dmg

# Check the output
ls -lh dist/Witchy-CLI-*.dmg
```

The DMG will appear in the `dist/` folder.

## Future Releases

For the next release (v1.0.9+):

1. Tag and push as usual: `git tag v1.0.9 && git push origin v1.0.9`
2. GitHub Actions will automatically:
   - Build binaries for all platforms
   - Create macOS DMG
   - Upload both binary and DMG to the release
3. Use `.github/RELEASE_TEMPLATE.md` as template for release notes
4. Users will see both download options for macOS

## What Changed

### Files Modified

- `.github/workflows/build-release.yml` - Added DMG creation step
- `package.json` - Added `build:macos:dmg` and `build:macos:pkg` scripts
- `README.md` - Added macOS warning and DMG instructions
- `BUILD.md` - Added DMG creation and troubleshooting docs

### Files Created

- `scripts/create-macos-dmg.sh` - DMG creation script
- `scripts/create-macos-installer.sh` - Alternative .pkg creation script
- `MACOS_INSTALL.md` - Complete macOS installation guide
- `.github/RELEASE_TEMPLATE.md` - Release notes template
- `.github/ISSUE_TEMPLATE/macos-garbled-text.md` - Support template

## Notes

- The DMG is created using `hdiutil` (built into macOS), so no additional dependencies needed
- The raw binary is still available for users who prefer it
- GitHub Actions workflow uses `continue-on-error: true` for DMG upload, so build won't fail if DMG creation fails
- The install script in the DMG uses `sudo` to copy to `/usr/local/bin`, which is standard for CLI tools
