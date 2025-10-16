# Assets

This directory contains icon files for installers.

## Required Icons

- `icon.ico` - Windows icon (256x256, .ico format)
- `icon.icns` - macOS icon (512x512, .icns format)
- `icon.png` - Source icon (1024x1024 recommended)

## Creating Icons

You can use online tools or command-line utilities to convert a PNG to the required formats:

### For Windows (.ico)

- Use an online converter like https://convertio.co/png-ico/
- Or use ImageMagick: `convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`

### For macOS (.icns)

- Use an online converter like https://cloudconvert.com/png-to-icns
- Or use iconutil on macOS:
  ```bash
  mkdir icon.iconset
  sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
  sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
  sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
  sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
  sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
  sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
  sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
  sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
  sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
  sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
  iconutil -c icns icon.iconset
  ```

## Temporary Placeholder

For now, placeholder icons are created. Replace these with your actual witchy-themed icons!
