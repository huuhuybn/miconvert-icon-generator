"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateiOSPreset = generateiOSPreset;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const imageProcessor_1 = require("../engine/imageProcessor");
/**
 * Full iOS icon specifications matching Xcode requirements
 */
const IOS_ICON_SPECS = [
    // iPhone Notification
    { idiom: 'iphone', size: 20, scale: 2, filename: 'Icon-App-20x20@2x.png' },
    { idiom: 'iphone', size: 20, scale: 3, filename: 'Icon-App-20x20@3x.png' },
    // iPhone Settings
    { idiom: 'iphone', size: 29, scale: 2, filename: 'Icon-App-29x29@2x.png' },
    { idiom: 'iphone', size: 29, scale: 3, filename: 'Icon-App-29x29@3x.png' },
    // iPhone Spotlight
    { idiom: 'iphone', size: 40, scale: 2, filename: 'Icon-App-40x40@2x.png' },
    { idiom: 'iphone', size: 40, scale: 3, filename: 'Icon-App-40x40@3x.png' },
    // iPhone App
    { idiom: 'iphone', size: 60, scale: 2, filename: 'Icon-App-60x60@2x.png' },
    { idiom: 'iphone', size: 60, scale: 3, filename: 'Icon-App-60x60@3x.png' },
    // iPad Notification
    { idiom: 'ipad', size: 20, scale: 1, filename: 'Icon-App-20x20@1x.png' },
    { idiom: 'ipad', size: 20, scale: 2, filename: 'Icon-App-20x20@2x~ipad.png' },
    // iPad Settings
    { idiom: 'ipad', size: 29, scale: 1, filename: 'Icon-App-29x29@1x.png' },
    { idiom: 'ipad', size: 29, scale: 2, filename: 'Icon-App-29x29@2x~ipad.png' },
    // iPad Spotlight
    { idiom: 'ipad', size: 40, scale: 1, filename: 'Icon-App-40x40@1x.png' },
    { idiom: 'ipad', size: 40, scale: 2, filename: 'Icon-App-40x40@2x~ipad.png' },
    // iPad App
    { idiom: 'ipad', size: 76, scale: 1, filename: 'Icon-App-76x76@1x.png' },
    { idiom: 'ipad', size: 76, scale: 2, filename: 'Icon-App-76x76@2x.png' },
    // iPad Pro App
    { idiom: 'ipad', size: 83.5, scale: 2, filename: 'Icon-App-83.5x83.5@2x.png' },
    // App Store
    { idiom: 'ios-marketing', size: 1024, scale: 1, filename: 'Icon-App-1024x1024@1x.png' },
];
/**
 * Generate iOS AppIcon.appiconset with Contents.json
 */
async function generateiOSPreset(sourceFile, outputDir, onProgress) {
    const files = [];
    const iosDir = path.join(outputDir, 'ios-icons');
    const appiconsetDir = path.join(iosDir, 'AppIcon.appiconset');
    fs.mkdirSync(appiconsetDir, { recursive: true });
    const source = await (0, imageProcessor_1.getSourceBuffer)(sourceFile);
    // Track unique filenames to avoid duplicates
    const generated = new Set();
    for (const spec of IOS_ICON_SPECS) {
        if (generated.has(spec.filename)) {
            continue;
        }
        generated.add(spec.filename);
        const pixelSize = Math.round(spec.size * spec.scale);
        onProgress?.(`Generating ${spec.filename} (${pixelSize}x${pixelSize})...`);
        const buffer = await (0, imageProcessor_1.resizeImage)(source, pixelSize, pixelSize);
        const filePath = path.join(appiconsetDir, spec.filename);
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
    }
    // Generate Contents.json
    onProgress?.('Generating Contents.json...');
    const contentsJson = {
        images: IOS_ICON_SPECS.map((spec) => ({
            idiom: spec.idiom,
            size: `${spec.size}x${spec.size}`,
            scale: `${spec.scale}x`,
            filename: spec.filename,
        })),
        info: {
            version: 1,
            author: 'MiConvert Icon Generator',
        },
    };
    const contentsPath = path.join(appiconsetDir, 'Contents.json');
    fs.writeFileSync(contentsPath, JSON.stringify(contentsJson, null, 2));
    files.push(contentsPath);
    return {
        outputDir: iosDir,
        files,
        summary: `Generated ${files.length} files: ${generated.size} icon variants + Contents.json in AppIcon.appiconset (Xcode-ready)`,
    };
}
//# sourceMappingURL=iosPreset.js.map