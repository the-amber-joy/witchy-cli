# ✨ Witchy Lookup Tool

Your magical reference companion! A command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

## Usage

```
✨ Witchy Lookup Tool - Your magical reference companion! ✨

Usage: witchy <type> [command] <search-term>

🔮 Available Lookup Types:
  🌿 herbs    - Discover magical plants and their ritual uses
  💎 crystals - Explore gemstones and their mystical properties
  🎨 colors   - Learn about color magic and meanings
  🌙 moon     - Find moon phases perfect for your spellwork
  🪨 metals   - Understand metallic energies and correspondences
  📅 days     - Discover which days are best for specific magical work

📖 How to Use:
  <type> <name>      - Look up by name
  <type> use <term>  - Search by magical use/property

✨ Examples:
  witchy herb rosemary
  witchy crystal use protection
  witchy day monday
  witchy moon use banishing
```

## Installation

To use the `witchy` command globally:

1. Make the script executable: `chmod +x lookup.js`
2. Create a symlink in your PATH: `ln -s /path/to/lookup.js ~/bin/witchy`
3. Ensure `~/bin` is in your PATH: `export PATH="$HOME/bin:$PATH"`

## Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## Credits

This tool was built with assistance from **GitHub Copilot** (Claude Sonnet 4) - the AI pair programmer that helped convert raw magical correspondence data into a searchable CLI tool with highlighting, emoji formatting, and organized file structure.
