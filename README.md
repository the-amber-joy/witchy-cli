# 🧙✨ Witchy CLI — Pi Zero Edition

Your magical correspondence companion. **Lightweight. JSON-only. Perfect for Raspberry Pi Zero.**

This is the `pi-zero-json-runtime` branch — optimized for low-powered devices with minimal dependencies. Witchy CLI is a command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

**Why this branch?** The main branch uses SQLite for persistence. This branch strips that away completely and runs on pure JSON, making it ideal for Raspberry Pi Zero where native SQLite compilation can be slow or problematic. Install size is ~200 KB, startup is instant, and no database migrations are needed.

## ⚡ Quick Start (Pi Zero Optimized)

Requires Node.js 20.20.2 or newer. On Raspberry Pi Zero, installation takes 2–5 minutes depending on your network.

You can be up and running in under a minute.

### 💻 Install From Source (All Platforms, Pi Zero Ready)

```bash
git clone https://github.com/the-amber-joy/witchy-cli.git
cd witchy-cli
git checkout pi-zero-json-runtime
npm ci --omit=dev --no-audit --no-fund
npm link
```

**Pi Zero tip:** `npm ci` is preferred over `npm install` for reproducible, faster installs. The `--omit=dev` flag skips test dependencies, keeping the footprint minimal (~200 KB installed).

After `npm link`, the `witchy` command is available globally from this local checkout.

Try your first lookup:

```bash
witchy herb rosemary
```

If you prefer not to link globally, run directly:

```bash
node lookup.js herb rosemary
```

### Optional Manual PATH Setup (without npm link)

```bash
chmod +x lookup.js
sudo ln -s "$(pwd)/lookup.js" /usr/local/bin/witchy
```

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

CI runs on every push/PR via GitHub Actions.

## 📂 Data Storage — JSON-Only (No SQLite)

Witchy CLI reads its correspondence data directly from the bundled JSON files in `src/data`.

**Why JSON-only on Pi Zero?**

- **No native compilation:** SQLite requires a C compiler and build tools, which adds ~15–30 minutes to Pi Zero installs. JSON avoids this entirely.
- **Instant startup:** Data loads into memory in milliseconds. No database setup, no migrations.
- **Minimal footprint:** Complete runtime + data is ~200 KB. Main branch with SQLite is ~1.5+ MB after first-run setup.
- **Zero dependencies:** No system libraries needed. Pure Node.js.

All correspondence data is read at startup and held in memory. Lookups are fast array-based searches. For a data set this size (herbs, crystals, days, etc.), in-memory JSON is more than adequate and significantly lighter than a database engine.

## 🍓 Pi Zero Setup Guide

### Prerequisites

Ensure you have Node.js 20.20.2+ installed. On Raspberry Pi OS:

```bash
node --version  # Check current version
npm --version
```

If you need to upgrade Node.js on Pi:

```bash
# Unofficial binary:
wget https://unofficial-builds.nodejs.org/download/release/v20.20.2/node-v20.20.2-linux-armv6l.tar.xz

# extract and install
tar -xJf node-v20.20.2-linux-armv6l.tar.xz
sudo mv node-v20.20.2-linux-armv6l /usr/local/node20
echo 'export PATH=/usr/local/node20/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Installation

```bash
# Clone and checkout this branch
git clone https://github.com/the-amber-joy/witchy-cli.git
cd witchy-cli
git checkout pi-zero-json-runtime

# Install with minimal footprint
npm ci --omit=dev --no-audit --no-fund

# Link globally
npm link

# Test it works
witchy herb rosemary
```

### Persistence (Optional)

If you want `witchy` to remain available after your Pi restarts or you pull fresh, add it to your cron or systemd startup. For a simple approach:

```bash
# Make it part of your shell profile
echo 'npm link' >> ~/.bashrc
```

Or, run `npm link` whenever you pull updates.

### Troubleshooting

**`witchy: command not found`**

- Ensure `npm link` completed: run `npm link` again.
- Verify npm's global bin directory is in your PATH: `echo $PATH`.

**Slow initial lookup**

- First lookup may take 2–3 seconds as JSON data loads into memory. Subsequent lookups are instant. This is normal.

**Out of memory errors**

- Unlikely on Pi Zero (512 MB RAM), but if it occurs, restart the interactive mode: `npm start`.

## 📊 Performance Notes

- **Startup:** ~50 ms to load all JSON data
- **Per-lookup:** <1 ms for in-memory array search
- **Memory usage:** ~15 MB (herbs, crystals, colors, metals, days, moon phases in memory)
- **Disk footprint:** ~200 KB installed (vs ~1.5+ MB with SQLite)
- **Installation time:** 2–5 minutes on Pi Zero (vs 15–30+ minutes for SQLite on Pi)

## 📚 Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## ✨ Credits

This tool was built with assistance from GitHub Copilot. (Almost entirely, really, but I've gone back and started doing a lot of cleanup, oof)
