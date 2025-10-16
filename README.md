# 🧙✨ Witchy CLI

Your magical correspondence companion! A command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

## ⚡ Quick Start

### 📦 Download and Run (Easiest!)

No installation needed! Download the standalone executable for your platform from [Releases](https://github.com/the-amber-joy/witchy-cli/releases):

**Windows:**

```cmd
# Download witchy-cli-win.exe
# Run directly - no installation needed!
witchy-cli-win.exe herb rosemary
```

**macOS:**

```bash
# Download witchy-cli-macos
chmod +x witchy-cli-macos
./witchy-cli-macos herb rosemary
```

**Linux:**

```bash
# Download witchy-cli-linux
chmod +x witchy-cli-linux
./witchy-cli-linux herb rosemary

# Optional: Install system-wide
sudo cp witchy-cli-linux /usr/local/bin/witchy
witchy herb rosemary
```

✨ **Benefits:**

- No admin rights required
- No installation wizard
- Portable - run from anywhere
- Works offline
- Single file, no dependencies

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

- **Building Executables**: See [BUILD.md](BUILD.md) for instructions on building from source
- **Linux Desktop Integration**: See [LINUX_ICONS.md](LINUX_ICONS.md) for adding desktop shortcuts and icons

## Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## Credits

This tool was built with assistance from **GitHub Copilot** (Claude Sonnet 4) - the AI pair programmer that helped convert raw magical correspondence data into a searchable CLI tool with highlighting, emoji formatting, and organized file structure.
