---
name: macOS - Seeing Garbled Text
about: The downloaded file shows garbled text when opened
title: "[macOS] Seeing garbled text when opening witchy-cli-macos"
labels: "question, documentation, macos"
assignees: ""
---

## 👋 Hi there!

If you're seeing garbled text when trying to open `witchy-cli-macos`, **this is completely normal**! You're trying to open a binary executable file in a text editor.

### The Issue

`witchy-cli-macos` is a **command-line tool**, not a regular macOS application. When you double-click it, macOS tries to open it in TextEdit (or another text editor), which shows the raw binary code as garbled characters.

### The Solution

**Run it from Terminal:**

1. Open **Terminal** (Applications → Utilities → Terminal)
2. Navigate to your Downloads folder:
   ```bash
   cd ~/Downloads
   ```
3. Make the file executable:
   ```bash
   chmod +x witchy-cli-macos
   ```
4. Run it:
   ```bash
   ./witchy-cli-macos herb rosemary
   ```
5. (Optional) Install system-wide:
   ```bash
   sudo mv witchy-cli-macos /usr/local/bin/witchy
   ```

### Full Documentation

See our detailed [macOS Installation Guide](https://github.com/the-amber-joy/witchyLookup/blob/main/MACOS_INSTALL.md) for complete instructions and troubleshooting.

---

**Still having issues?** Please provide:

- Your macOS version
- Which file you downloaded
- The exact steps you took
- Any error messages you're seeing
