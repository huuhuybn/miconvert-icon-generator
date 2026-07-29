# Free VS Code App Icon Generator

Generate **production-ready app icons** for all major platforms from a single image — directly inside VS Code.

> 🎯 **One image → All platforms → Ready to ship.**

## ✨ Supported Platforms

| Platform | Output |
|----------|--------|
| 🍎 **iOS** | `AppIcon.appiconset` + `Contents.json` (Xcode-ready) |
| 📱 **Android** | `res/mipmap-*` folders + round icons + adaptive foreground |
| 🌐 **Web / PWA** | Favicons + PWA icons + `manifest.json` + HTML snippet |
| 🖥 **Windows** | Multi-size `.ico` (16–256) |
| 🍏 **macOS** | `.icns` with @1x/@2x retina variants |
| 🎮 **Unity** | Android + iOS + WebGL combined ZIP |

## 🚀 Why This Extension?

- ✅ **Xcode-compatible** — Generates `Contents.json` that Xcode recognizes instantly
- ✅ **Android Studio ready** — Proper `mipmap-mdpi` through `mipmap-xxxhdpi` folder structure
- ✅ **Zero config** — Works out of the box, no settings needed
- ✅ **All formats** — Accepts PNG, JPG, SVG, WebP
- ✅ **Smart validation** — Warns about non-square images, low resolution, missing transparency
- ✅ **ZIP export** — Package icons for easy sharing
- ✅ **100% local** — No upload, no server, no tracking

## 📦 What Gets Generated

### iOS Output
```
AppIcon.appiconset/
├── Icon-App-20x20@2x.png      (40×40)
├── Icon-App-20x20@3x.png      (60×60)
├── Icon-App-29x29@2x.png      (58×58)
├── Icon-App-29x29@3x.png      (87×87)
├── Icon-App-40x40@2x.png      (80×80)
├── Icon-App-40x40@3x.png      (120×120)
├── Icon-App-60x60@2x.png      (120×120)
├── Icon-App-60x60@3x.png      (180×180)
├── Icon-App-76x76@1x.png      (76×76)
├── Icon-App-76x76@2x.png      (152×152)
├── Icon-App-83.5x83.5@2x.png  (167×167)
├── Icon-App-1024x1024@1x.png  (App Store)
└── Contents.json               (Xcode metadata)
```

### Android Output
```
res/
├── mipmap-mdpi/
│   ├── ic_launcher.png         (48×48)
│   └── ic_launcher_round.png
├── mipmap-hdpi/                (72×72)
├── mipmap-xhdpi/               (96×96)
├── mipmap-xxhdpi/              (144×144)
├── mipmap-xxxhdpi/             (192×192)
│   └── ic_launcher_foreground.png
└── playstore-icon.png          (512×512)
```

### Web / PWA Output
```
web-icons/
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-64x64.png
├── favicon.ico          (multi-layer)
├── icon-192x192.png     (PWA)
├── icon-512x512.png     (PWA)
├── apple-touch-icon.png (180×180)
├── manifest.json        (PWA manifest snippet)
└── icon-links.html      (copy-paste HTML tags)
```

## 🎯 How to Use

### Method 1: Right-Click (Fastest)
1. Right-click any image file in Explorer
2. Select **"MiConvert: Generate App Icons"**
3. Pick your platform → Choose output folder → Done! ✅

### Method 2: Command Palette
1. Press `Cmd+Shift+P` (macOS) / `Ctrl+Shift+P` (Windows/Linux)
2. Type **"MiConvert: Generate App Icons"**
3. Select source image → Follow wizard

## 🛡 Smart Validation

Before generating, the extension validates your source image:

| Check | Warning |
|-------|---------|
| Non-square image | `"Image is not square. Square images produce the best icons."` |
| Low resolution | `"Recommended size ≥ 1024×1024"` |
| No transparency | `"Transparent PNG recommended for adaptive icons"` |
| JPG format | `"PNG or SVG recommended for best quality"` |

> 💡 **Best practice**: Use a **1024×1024 transparent PNG** for optimal results across all platforms.

## 📋 Supported Input Formats

| Format | Support |
|--------|---------|
| PNG | ✅ Recommended |
| SVG | ✅ Auto-rasterized |
| WebP | ✅ Full support |
| JPG/JPEG | ⚠️ Works but PNG preferred |

## ⚙️ Tech Stack

- **[Sharp](https://sharp.pixelplumbing.com/)** — High-performance C++ image processing
- **png-to-ico** — Multi-layer ICO generation
- **Pure JS ICNS** — macOS icon format (no native dependencies)
- **archiver** — ZIP export

## 🔒 Privacy

- **100% local processing** — Your images never leave your machine
- **No telemetry** — Zero external analytics or tracking
- **No network calls** — Works completely offline

## 🤝 More from MiConvert

Need more advanced features?

🌐 **[MiConvert.com](https://miconvert.com)** — AI background removal, smart crop, batch processing, and 100+ file conversion tools.

## 💬 Support & Contact

- 🐛 **Report a bug**: [GitHub Issues](https://github.com/huuhuybn/miconvert-icon-generator/issues)
- 📧 **Contact us**: [miconvert.com/en/contact](https://miconvert.com/en/contact)
- 🌐 **Website**: [miconvert.com](https://miconvert.com)

## 📝 License

MIT © [MiConvert](https://miconvert.com)
