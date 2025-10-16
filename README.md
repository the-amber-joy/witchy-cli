# 🧙✨ Witchy CLI

Your magical correspondence companion! A command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

## ⚡ Quick Start

Choose your preferred installation method:

### 🎁 Installers (Easiest)

Download from [Releases](https://github.com/the-amber-joy/witchy-cli/releases):

| Platform    | File                            | What You Get                                                |
| ----------- | ------------------------------- | ----------------------------------------------------------- |
| **Windows** | `WitchyCLI-Setup-{version}.exe` | Professional installer, Start Menu shortcuts, optional PATH |
| **macOS**   | `WitchyCLI-{version}.dmg`       | Drag-and-drop to Applications, native app bundle            |
| **Linux**   | `witchy-cli-linux`              | Standalone binary ([icon setup guide](LINUX_ICONS.md))      |

**Linux installation:**

```bash
sudo cp witchy-cli-linux /usr/local/bin/witchy
sudo chmod +x /usr/local/bin/witchy
witchy herb rosemary  # Ready to use!
```

### 📦 Standalone Executables (No Installation)

Download and run directly - no installation needed!

From [Releases](https://github.com/the-amber-joy/witchy-cli/releases):

- `witchy-cli-win.exe` (Windows)
- `witchy-cli-macos` (macOS)
- `witchy-cli-linux` (Linux)

```bash
# Make executable (macOS/Linux only)
chmod +x witchy-cli-macos

# Run anywhere
./witchy-cli-macos herb rosemary
```

### 💻 For Developers (Node.js)

```bash
# Clone and install
git clone https://github.com/the-amber-joy/witchy-cli.git
cd witchy-cli
npm install

# Launch interactive CLI
npm start
```

## Usage

### Interactive CLI Mode

Launch the interactive CLI for an immersive experience:

```bash
npm start
# or
node src/cli.js
```

This opens an interactive prompt where you can run multiple lookups without retyping commands:

```
✨🧙 Welcome to Witchy CLI! 🔮✨

🌟 Available Lookup Types:
  🌿 herbs    - Discover magical plants and their ritual uses
  💎 crystals - Explore gemstones and their mystical properties
  🎨 colors   - Learn about color magic and meanings
  🌙 moon     - Find moon phases perfect for your spellwork
  🪨 metals   - Understand metallic energies and correspondences
  📅 days     - Discover which days are best for specific magical work

🪄 witchy > herb rosemary
🪄 witchy > crystal use protection
🪄 witchy > exit
```

### Direct Command Mode

For quick, one-off lookups:

```bash
witchy <type> [command] <search-term>
```

**Available Lookup Types:**

- 🌿 `herbs` - Discover magical plants and their ritual uses
- 💎 `crystals` - Explore gemstones and their mystical properties
- 🎨 `colors` - Learn about color magic and meanings
- 🌙 `moon` - Find moon phases perfect for your spellwork
- 🪨 `metals` - Understand metallic energies and correspondences
- 📅 `days` - Discover which days are best for specific magical work

**Command Formats:**

- `<type> <name>` - Look up by name
- `<type> use <term>` - Search by magical use/property

**Examples:**

```bash
witchy herb rosemary
witchy crystal use protection
witchy day monday
witchy moon use banishing
witchy color red
witchy metal use prosperity
```

## 🛠️ Development Setup

Want to contribute or run from source?

```bash
git clone https://github.com/the-amber-joy/witchy-cli.git
cd witchy-cli
npm install
npm start  # Interactive CLI
```

Or run direct commands:

```bash
./lookup.js herb rosemary  # macOS/Linux
node lookup.js herb rosemary  # Windows
```

**Update anytime**: `git pull origin main`

## 📚 Additional Info

- **Building Installers**: See [BUILD.md](BUILD.md) for instructions on building executables and installers from source
- **Code Signing**: See [CODE_SIGNING.md](CODE_SIGNING.md) for information about Windows publisher warnings
- **Linux Icons**: See [LINUX_ICONS.md](LINUX_ICONS.md) for desktop integration

## Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## Credits

This tool was built with assistance from **GitHub Copilot** (Claude Sonnet 4) - the AI pair programmer that helped convert raw magical correspondence data into a searchable CLI tool with highlighting, emoji formatting, and organized file structure.
