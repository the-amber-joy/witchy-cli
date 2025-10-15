# ✨ Witchy Lookup Tool

Your magical correspondence companion! A command-line tool for looking up magical correspondences including herbs, crystals, colors, moon phases, metals, and days of the week.

## Usage

```
✨ Witchy Lookup Tool - Your magical correspondence companion! ✨

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

### Method 1: Global Installation (Recommended)

#### On macOS/Linux:

To use the `witchy` command from anywhere in your terminal:

1. **Clone or download this repository** to a permanent location:

   ```bash
   git clone https://github.com/the-amber-joy/witchyLookup.git ~/witchy-lookup
   cd ~/witchy-lookup
   ```

2. **Make the script executable**:

   ```bash
   chmod +x lookup.js
   ```

3. **Create a directory for your personal binaries** (if it doesn't exist):

   ```bash
   mkdir -p ~/bin
   ```

4. **Create a symbolic link to the script**:

   ```bash
   ln -sf ~/witchy-lookup/lookup.js ~/bin/witchy
   ```

5. **Add ~/bin to your PATH** (if not already done):

   For **zsh** (macOS default):

   ```bash
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   For **bash**:

   ```bash
   echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

6. **Test the installation**:
   ```bash
   witchy herb rosemary
   ```

#### On Windows:

To use the `witchy` command from anywhere in Command Prompt or PowerShell:

1. **Clone or download this repository** to a permanent location:

   ```cmd
   git clone https://github.com/the-amber-joy/witchyLookup.git C:\path\to\witchy-lookup
   cd C:\path\to\witchy-lookup
   ```

2. **Create a batch file wrapper**:

   Create a file called `witchy.bat` in a directory that's in your PATH (like `C:\Windows\System32` or create a personal bin directory):

   ```batch
   @echo off
   node "C:\path\to\witchy-lookup" %*
   ```

   Or if you prefer PowerShell, create `witchy.ps1`:

   ```powershell
   node "C:\path\to\witchy-lookup" $args
   ```

3. **Alternative: Add to PATH directly**:

   - Open **System Properties** → **Advanced** → **Environment Variables**
   - Under **User variables**, find or create the `PATH` variable
   - Add `C:\path\to\witchy-lookup` to the PATH
   - Create a `witchy.bat` file in `C:\path\to\witchy-lookup`:
     ```batch
     @echo off
     node "%~dp0lookup.js" %*
     ```

4. **Test the installation**:
   ```cmd
   witchy herb rosemary
   ```

**Note for Windows users**: Make sure you have [Node.js](https://nodejs.org/) installed, as the script requires it to run.

### Method 2: Local Usage

If you prefer to run it locally without global installation:

**macOS/Linux**:

```bash
cd /path/to/witchy-lookup
./lookup.js herb rosemary
```

**Windows**:

```cmd
cd C:\path\to\witchy-lookup
node lookup.js herb rosemary
```

### Updating

To update your installation:

**macOS/Linux**:

```bash
cd /path/to/witchy-lookup
git pull origin main
```

**Windows**:

```cmd
cd C:\path\to\witchy-lookup
git pull origin main
```

The symlink (or batch file) will automatically point to the updated version.

## Data Sources

The magical correspondence data used in this tool comes from these sources:

- **Herbs**: [A List of Herbs and Their Magical Uses - Spiral Rain](https://spiralrain.ca/blogs/blog-posts/a-list-of-herbs-and-their-magickal-uses)
- **Multiple Correspondences**: [Tables of Magical Correspondences - Light Warriors Legion](https://lightwarriorslegion.com/tables-of-magickal-correspondences/)

## Credits

This tool was built with assistance from **GitHub Copilot** (Claude Sonnet 4) - the AI pair programmer that helped convert raw magical correspondence data into a searchable CLI tool with highlighting, emoji formatting, and organized file structure.
