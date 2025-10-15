# Building Standalone Executables

This guide explains how to build standalone executables of Witchy CLI that don't require Node.js to be installed.

## Prerequisites

- Node.js 18+ installed (for building only, not for running the executable)
- All dependencies installed (`npm install`)

## Building for Your Platform

To build an executable for your current platform:

```bash
npm run build
```

This creates an executable in the `dist/` folder:

- **Windows**: `dist/witchy-cli.exe`
- **macOS**: `dist/witchy-cli`
- **Linux**: `dist/witchy-cli`

## Building for All Platforms

To build executables for Windows, macOS, and Linux at once:

```bash
npm run build:all
```

This creates:

- `dist/witchy-cli-win.exe` - Windows executable
- `dist/witchy-cli-macos` - macOS executable
- `dist/witchy-cli-linux` - Linux executable

## Running the Executable

Once built, users can run the executable without Node.js:

**Windows:**

```cmd
witchy-cli.exe herb rosemary
```

**macOS/Linux:**

```bash
chmod +x witchy-cli  # Make executable (first time only)
./witchy-cli herb rosemary
```

## File Size

The executables are approximately 40-50MB each because they include:

- Node.js runtime
- All dependencies (sqlite3, etc.)
- All source code and data files

## Distribution

### Method 1: GitHub Releases (Automated)

When you push a version tag, GitHub Actions automatically builds and publishes executables:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Users can then download from the [Releases page](https://github.com/the-amber-joy/witchy-cli/releases).

### Method 2: Manual Distribution

Simply share the built executable file. Users can:

1. Download the file
2. Run it directly (no installation needed)

## Troubleshooting

### "Cannot find module" errors

Make sure all required files are in the `pkg.assets` section of `package.json`.

### Database not working

The database is created on first run in the same directory as the executable.

### macOS "unverified developer" warning

Users may need to right-click → Open the first time, or run:

```bash
xattr -cr witchy-cli
```

### Linux permissions

Make the file executable:

```bash
chmod +x witchy-cli
```

## Technical Details

We use [pkg](https://github.com/vercel/pkg) to bundle Node.js and the application into a single executable. The `pkg` configuration in `package.json` specifies:

- Target platforms and Node.js version
- Assets to include (JSON data, source files)
- Scripts to bundle

The executable includes everything needed to run, making distribution simple for end users.
