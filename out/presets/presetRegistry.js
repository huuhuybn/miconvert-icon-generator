"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESETS = void 0;
exports.getAllPresetOptions = getAllPresetOptions;
const webPreset_1 = require("./webPreset");
const androidPreset_1 = require("./androidPreset");
const iosPreset_1 = require("./iosPreset");
const desktopPreset_1 = require("./desktopPreset");
const unityPreset_1 = require("./unityPreset");
exports.PRESETS = [
    {
        id: 'web',
        label: '🌐 Web / PWA',
        description: 'Favicons, PWA icons, Apple Touch Icon, manifest.json, HTML snippets',
        icon: '🌐',
        generate: webPreset_1.generateWebPreset,
    },
    {
        id: 'android',
        label: '📱 Android',
        description: 'Launcher icons (mdpi–xxxhdpi), Play Store, adaptive icon, folder structure',
        icon: '📱',
        generate: androidPreset_1.generateAndroidPreset,
    },
    {
        id: 'ios',
        label: '🍎 iOS',
        description: 'All icon sizes @1x/@2x/@3x, App Store, AppIcon.appiconset + Contents.json',
        icon: '🍎',
        generate: iosPreset_1.generateiOSPreset,
    },
    {
        id: 'windows',
        label: '🖥 Windows',
        description: 'Multi-size .ico (16–256), individual PNGs',
        icon: '🖥',
        generate: desktopPreset_1.generateWindowsPreset,
    },
    {
        id: 'macos',
        label: '🍏 macOS',
        description: '.icns with @1x/@2x retina (16–512), individual PNGs',
        icon: '🍏',
        generate: desktopPreset_1.generateMacPreset,
    },
    {
        id: 'unity',
        label: '🎮 Unity',
        description: 'Android + iOS + WebGL combined, ZIP export ready',
        icon: '🎮',
        generate: unityPreset_1.generateUnityPreset,
    },
];
/**
 * Get all presets plus an "All Platforms" option
 */
function getAllPresetOptions() {
    return [
        ...exports.PRESETS,
        {
            id: 'all',
            label: '🚀 All Platforms',
            description: 'Generate icons for Web, Android, iOS, Windows, macOS',
            icon: '🚀',
            generate: async () => ({ outputDir: '', files: [], summary: '' }), // placeholder
        },
    ];
}
//# sourceMappingURL=presetRegistry.js.map