# Linux Icon Setup

The Linux standalone binary (`witchy-cli-linux`) doesn't have embedded icons like Windows and macOS installers. Linux users can manually set up desktop integration with the custom icon.

## Icon File Location

The icon is available in the repository:

- **PNG**: `assets/icon.png` (1024x1024, works with most Linux desktop environments)
- **Source**: Can be downloaded from GitHub releases or repository

## Manual Desktop Integration

### Option 1: Create Desktop Entry (Recommended)

Create a `.desktop` file for desktop integration:

```bash
# 1. Copy the executable to a standard location
sudo cp witchy-cli-linux /usr/local/bin/witchy
sudo chmod +x /usr/local/bin/witchy

# 2. Download or copy the icon
sudo mkdir -p /usr/share/pixmaps
sudo cp icon.png /usr/share/pixmaps/witchy-cli.png

# 3. Create desktop entry
sudo tee /usr/share/applications/witchy-cli.desktop > /dev/null <<EOF
[Desktop Entry]
Name=Witchy CLI
Comment=Magical Correspondence Lookup Tool
Exec=/usr/local/bin/witchy
Icon=/usr/share/pixmaps/witchy-cli.png
Terminal=true
Type=Application
Categories=Utility;ConsoleOnly;
Keywords=witchcraft;magic;correspondences;herbs;crystals;
EOF

# 4. Update desktop database
sudo update-desktop-database
```

### Option 2: User-Level Installation

For installation without sudo:

```bash
# 1. Copy executable to user bin
mkdir -p ~/.local/bin
cp witchy-cli-linux ~/.local/bin/witchy
chmod +x ~/.local/bin/witchy

# 2. Copy icon to user icons
mkdir -p ~/.local/share/icons
cp icon.png ~/.local/share/icons/witchy-cli.png

# 3. Create user desktop entry
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/witchy-cli.desktop <<EOF
[Desktop Entry]
Name=Witchy CLI
Comment=Magical Correspondence Lookup Tool
Exec=$HOME/.local/bin/witchy
Icon=$HOME/.local/share/icons/witchy-cli.png
Terminal=true
Type=Application
Categories=Utility;ConsoleOnly;
Keywords=witchcraft;magic;correspondences;herbs;crystals;
EOF

# 4. Update desktop database
update-desktop-database ~/.local/share/applications
```

### Option 3: Distribution Package (Future)

For easier installation, consider creating distribution-specific packages:

**Debian/Ubuntu (.deb):**

```bash
# Future: Create .deb package with icon and desktop file included
# dpkg-deb --build witchy-cli_1.0.1_amd64
```

**Fedora/RHEL (.rpm):**

```bash
# Future: Create .rpm package with icon and desktop file included
# rpmbuild -bb witchy-cli.spec
```

**Arch (.pkg.tar.zst):**

```bash
# Future: Create PKGBUILD with icon and desktop file
# makepkg -si
```

## Desktop Environment Notes

### GNOME / Ubuntu

- Icon will appear in Activities overview
- Can be pinned to favorites
- Searchable by name and keywords

### KDE Plasma

- Icon will appear in Application Launcher
- Can be added to panel or desktop
- Searchable by name

### XFCE

- Icon will appear in Application Finder
- Can be added to panel menu

### i3 / Window Managers

- Use dmenu or rofi to launch
- Desktop file enables integration with application launchers

## Icon Specifications

The provided icon follows these Linux icon theme specifications:

- **Format**: PNG (supports transparency)
- **Size**: 1024x1024 (scalable to all required sizes)
- **Location**: Standard Linux paths
  - System-wide: `/usr/share/pixmaps/` or `/usr/share/icons/hicolor/`
  - User: `~/.local/share/icons/`

## Troubleshooting

**Icon doesn't appear:**

```bash
# Refresh icon cache
sudo gtk-update-icon-cache /usr/share/icons/hicolor -f

# Or for user installation
gtk-update-icon-cache ~/.local/share/icons -f
```

**Desktop entry not showing:**

```bash
# Update desktop database
sudo update-desktop-database /usr/share/applications

# Or for user installation
update-desktop-database ~/.local/share/applications
```

## Future Enhancements

Consider these improvements for Linux distribution:

1. **AppImage** - Single-file executable with icon embedded
2. **Flatpak** - Universal package format with automatic icon handling
3. **Snap** - Canonical's universal package format
4. **.deb/.rpm packages** - Native package formats with desktop integration

These would automatically handle icon installation and desktop integration.
