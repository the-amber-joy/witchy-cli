# macOS Installation Guide

Witchy CLI is a command-line tool for looking up magical correspondences (herbs, crystals, colors, etc.).

## Quick Install

1. Download `witchy-cli-macos` from the [Releases page](https://github.com/the-amber-joy/witchyLookup/releases)
2. Open Terminal
3. Navigate to your Downloads folder:
   ```bash
   cd ~/Downloads
   ```
4. Make the file executable:
   ```bash
   chmod +x witchy-cli-macos
   ```
5. Move it to your PATH:
   ```bash
   sudo mv witchy-cli-macos /usr/local/bin/witchy
   ```
6. Test it:
   ```bash
   witchy herb rosemary
   ```

## Alternative: Run Without Installing

If you don't want to install system-wide, you can run it directly:

```bash
cd ~/Downloads
chmod +x witchy-cli-macos
./witchy-cli-macos herb rosemary
```

## Alternative: Install via npm

If you have Node.js installed:

```bash
npm install -g witchy-cli
```

## ⚠️ Important: Don't Double-Click!

**DO NOT** try to open the `witchy-cli-macos` file by double-clicking it! It's a command-line tool, not a regular macOS app.

If you accidentally opened it in a text editor and saw garbled text, that's normal - it's a compiled binary. Close the text editor and follow the installation instructions above.

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
