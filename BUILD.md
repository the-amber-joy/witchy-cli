# Building Standalone Executables

This guide explains how to build standalone executables of Witchy CLI that don't require Node.js to be installed.

## Prerequisites

- Node.js 18+ installed (for building only, not for running the executable)
- All dependencies installed (`npm install`)

## Pre-populated Database

Starting with v1.0.6, Witchy CLI includes a pre-populated database with the executable. Before building:

```bash
# Generate the pre-populated database
npm run db:prepopulate

# Verify the database
npm run db:verify
```

This creates `assets/witchy.db` which is bundled with the executable.

## Building for Your Platform

To build executables for Windows and Linux:

```bash
npm run build
```

This creates executables in the `dist/` folder:

- **Windows**: `dist/witchy-cli-win.exe`
- **Linux**: `dist/witchy-cli-linux`

> **Note:** We don't build macOS binaries due to Apple Silicon (ARM64) vs Intel (x86_64) architecture differences. Mac users should install via npm instead.

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

### Database issues

The executable includes a pre-populated database. On first run, this database is copied to the user's data directory:

- Windows: `%APPDATA%\WitchyCLI\witchy.db`
- macOS: `~/Library/Application Support/WitchyCLI/witchy.db`
- Linux: `~/.local/share/witchy-cli/witchy.db`

If searches aren't working, check if the database was copied correctly.

### macOS "unverified developer" warning

Users may need to right-click → Open the first time, or run:

```bash
xattr -cr witchy-cli
```

### macOS Users Seeing Garbled Text

If macOS users report seeing "garbled text" when opening the file, they're trying to open the binary executable in a text editor instead of running it from Terminal.

**Solution:**

- Direct them to [MACOS_INSTALL.md](MACOS_INSTALL.md) for proper installation instructions
- Remind them it's a CLI tool that must be run from Terminal

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
