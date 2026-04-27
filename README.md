# 🧙✨ Witchy CLI

Your magical correspondence companion.

Witchy CLI is a command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

## ⚡ Quick Start

Requires Node.js 20.20.2 or newer.

You can be up and running in under a minute.

### 💻 Install From Source (All Platforms)

```bash
git clone https://github.com/the-amber-joy/witchy-cli.git
cd witchy-cli
npm install
npm link
```

After `npm link`, the `witchy` command is available globally from this local checkout.

Try your first lookup:

### Windows (PowerShell or Command Prompt)

```powershell
witchy herb rosemary
```

### macOS (Terminal)

```bash
witchy herb rosemary
```

### Linux (Terminal)

```bash
witchy herb rosemary
```

If you prefer not to link globally, run directly:

```bash
node lookup.js herb rosemary
```

### Optional Manual PATH Setup (without npm link)

macOS/Linux:

```bash
chmod +x lookup.js
sudo ln -s "$(pwd)/lookup.js" /usr/local/bin/witchy
```

Windows: use `npm link` (recommended), or create a `witchy.cmd` launcher that runs `node <full-path-to>\lookup.js %*` in a directory on your PATH.

## 🔮 Usage

### Interactive CLI Mode

Launch the interactive CLI for an immersive experience:

```bash
npm start
# or
node src/cli.js
```

This opens an interactive prompt where you can do multiple lookups without retyping full commands each time:

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

### ⚡ Direct Command Mode

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

## 🛠️ Development

For maintainers and contributors:

```bash
npm test               # run tests
npm run test:watch     # watch mode
npm run test:coverage  # coverage report
```

Commits are protected by a husky pre-commit hook. CI runs on every push/PR via GitHub Actions.

## 📂 Data Storage

SQLite database in your user data directory:

- Windows: `%APPDATA%\WitchyCLI\witchy.db`
- macOS: `~/Library/Application Support/WitchyCLI/witchy.db`
- Linux: `~/.local/share/witchy-cli/witchy.db`

If the database is unavailable, Witchy CLI falls back to the JSON data files. To rebuild/reset your DB:

```bash
npm run db:reset
```

## 📚 Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## ✨ Credits

This tool was built with assistance from GitHub Copilot. (Almost entirely, really, but I've gone back and started doing a lot of cleanup, oof)
