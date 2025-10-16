# macOS Installation Guide

Witchy CLI is a command-line tool for looking up magical correspondences (herbs, crystals, colors, etc.).

## Recommended: Install via npm

Due to Apple Silicon (M1/M2/M3) and Intel architecture differences, we recommend installing via npm:

```bash
npm install -g witchy-cli
```

This works on both Apple Silicon and Intel Macs automatically!

### Don't have Node.js?

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install it (choose the LTS version)
3. Open Terminal and run:
   ```bash
   npm install -g witchy-cli
   ```

## Usage

Once installed, use it from Terminal:

```bash
# Look up an herb
witchy herb rosemary

# Search crystals by use
witchy crystal use protection

# Find moon phase correspondences
witchy moon full
```

### Gatekeeper Warning

The first time you run Witchy CLI, macOS Gatekeeper might block it because it's not signed with an Apple Developer certificate. To allow it:

1. **If you see "cannot be opened because it is from an unidentified developer":**
   - Open System Preferences → Security & Privacy
   - Click "Open Anyway" next to the Witchy CLI message
2. **Or bypass Gatekeeper from Terminal:**
   ```bash
   sudo xattr -r -d com.apple.quarantine /usr/local/bin/witchy
   ```

## Usage Examples

Once installed, you can use Witchy CLI from any terminal:

```bash
# Look up an herb
witchy herb rosemary

# Look up a crystal
witchy crystal amethyst

# Look up a color
witchy color purple

# Look up moon phase correspondences
witchy moon full

# Look up a day of the week
witchy day monday

# Look up a metal
witchy metal silver
```

## Troubleshooting

### "command not found: witchy"

Make sure `/usr/local/bin` is in your PATH:

```bash
echo $PATH
```

If it's not there, add this to your `~/.zshrc` or `~/.bash_profile`:

```bash
export PATH="/usr/local/bin:$PATH"
```

Then restart your terminal or run:

```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### "Permission denied"

Make sure the file is executable:

```bash
chmod +x /usr/local/bin/witchy
```

### Still Having Issues?

Open an issue on [GitHub](https://github.com/the-amber-joy/witchyLookup/issues) with:

- Your macOS version
- The exact error message
- How you installed Witchy CLI

## Uninstallation

To remove Witchy CLI:

```bash
sudo rm /usr/local/bin/witchy
```

---

✨ **Happy spell crafting!** ✨
