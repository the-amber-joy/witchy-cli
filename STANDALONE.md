# Witchy CLI - Standalone Executables Setup

## Summary

Successfully configured Witchy CLI to build standalone executables that work **without Node.js installation**. Updated in v1.0.6 to include a pre-populated database for maximum reliability.

## What Was Done

### 1. Package Configuration (`package.json`)

Added:

- `pkg` as a dev dependency
- Build scripts: `npm run build` and `npm run build:all`
- pkg configuration specifying:
  - Target platforms: Windows, macOS, Linux (Node 18)
  - Assets to bundle: JSON data, source files, lists, and pre-populated database
  - Output directory: `dist/`

### 2. Pre-populated Database

Added:

- Script to generate a fully populated database (`create-populated-db.js`)
- Bundled database in `assets/witchy.db`
- Database verification script (`scripts/verify-db.js`)
- Automatic copy from bundled database to user directory on first run

### 3. Database Path Configuration

Modified `src/database/config.js` to:

- Check for bundled database in assets directory
- Copy bundled database to user directory if needed
- Use user directory for persistent data storage
- Maintain backward compatibility with development mode

**Before:**

```javascript
const DB_PATH = path.join(__dirname, "../data/witchy.db");
```

**After:**

```javascript
const isPkg = typeof process.pkg !== "undefined";
const DB_PATH = isPkg
  ? path.join(path.dirname(process.execPath), "witchy.db")
  : path.join(__dirname, "../data/witchy.db");
```

### 3. GitHub Actions Workflow

Created `.github/workflows/build-release.yml` to:

- Automatically build executables for all platforms when a version tag is pushed
- Upload artifacts for each platform
- Create GitHub releases with downloadable executables

### 4. Documentation

- **BUILD.md**: Complete guide for building executables locally
- **README.md**: Updated with standalone executable instructions as primary option
- **Quick Start**: Shows executable download as Option 1 (easiest)

### 5. Git Configuration

Updated `.gitignore` to exclude:

- `dist/` folder (build output)
- `*.exe` files
- Database files in executable directory

## Testing

✅ Built all three platform executables (40-50MB each)  
✅ Tested Windows executable - works perfectly  
✅ Database created on first run in executable directory  
✅ Subsequent runs are instant (no migration needed)  
✅ No Node.js required to run the executable

## Usage

### Building

```bash
# Current platform only
npm run build

# All platforms
npm run build:all
```

Output in `dist/`:

- `witchy-cli-win.exe` (Windows)
- `witchy-cli-macos` (macOS)
- `witchy-cli-linux` (Linux)

### Running

**Windows:**

```cmd
witchy-cli-win.exe herb rosemary
```

**macOS/Linux:**

```bash
chmod +x witchy-cli-macos
./witchy-cli-macos herb rosemary
```

### Distributing

1. **Manual**: Share the executable file directly
2. **GitHub Releases**: Push a version tag to trigger automatic build

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Benefits

✅ Users don't need Node.js installed  
✅ Single file distribution  
✅ Works offline after download  
✅ Cross-platform (Windows, macOS, Linux)  
✅ Portable (can run from USB drive)  
✅ No dependencies to manage

## Technical Details

- Uses [pkg](https://github.com/vercel/pkg) by Vercel
- Bundles Node.js v18.5.0 runtime
- Virtual filesystem for code, real filesystem for database
- SQLite3 native bindings included for all platforms
- ~40-50MB per executable (due to Node.js runtime + dependencies)

## Next Steps

1. Test on actual macOS and Linux systems (currently only tested on Windows)
2. Push a version tag to test GitHub Actions workflow
3. Create first official release with executables
4. Optionally: Add code signing for Windows/macOS executables

## Limitations

- File size is larger than source (40-50MB vs ~few KB)
- Native module (sqlite3) must be compatible with pkg
- Some npm scripts won't work in executable (they require Node.js environment)
- Debug/inspect flags don't work with executables

## Migration Notes

Users with existing installations can:

1. Continue using Node.js version (no changes needed)
2. Switch to executable version (independent, separate database)

Both versions work identically, just different distribution methods.
