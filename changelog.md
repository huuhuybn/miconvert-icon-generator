# Change Log

## [1.0.0] - 2026-02-17

### 🚀 Initial Release

- **Web/PWA**: Favicons (16–64), multi-layer `favicon.ico`, PWA icons (192, 512), Apple Touch Icon, `manifest.json`, HTML snippet
- **Android**: Launcher icons (mdpi–xxxhdpi) with `mipmap-*` folder structure, round icons, Play Store icon, adaptive foreground
- **iOS**: All required sizes @1x/@2x/@3x, 1024×1024 App Store, Xcode-compatible `AppIcon.appiconset` with `Contents.json`
- **Windows**: Multi-size `.ico` (16–256) + individual PNGs
- **macOS**: `.icns` with retina @2x variants (16–512)
- **Unity**: Combined Android + iOS + WebGL with ZIP export
- Smart image validation (square check, resolution, transparency, format)
- Right-click context menu on image files
- Command palette integration
- ZIP export option
- Local analytics (preset usage tracking, no external calls)
