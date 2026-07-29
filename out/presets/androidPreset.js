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
exports.generateAndroidPreset = generateAndroidPreset;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const imageProcessor_1 = require("../engine/imageProcessor");
const DENSITIES = [
    { name: 'mipmap-mdpi', size: 48 },
    { name: 'mipmap-hdpi', size: 72 },
    { name: 'mipmap-xhdpi', size: 96 },
    { name: 'mipmap-xxhdpi', size: 144 },
    { name: 'mipmap-xxxhdpi', size: 192 },
];
const PLAY_STORE_SIZE = 512;
/**
 * Generate Android launcher icons with proper folder structure
 */
async function generateAndroidPreset(sourceFile, outputDir, onProgress) {
    const files = [];
    const androidDir = path.join(outputDir, 'android-icons');
    const resDir = path.join(androidDir, 'res');
    const source = await (0, imageProcessor_1.getSourceBuffer)(sourceFile);
    // Generate launcher icons per density
    for (const density of DENSITIES) {
        onProgress?.(`Generating ${density.name} (${density.size}x${density.size})...`);
        const densityDir = path.join(resDir, density.name);
        fs.mkdirSync(densityDir, { recursive: true });
        const buffer = await (0, imageProcessor_1.resizeImage)(source, density.size, density.size);
        const filePath = path.join(densityDir, 'ic_launcher.png');
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
        // Also generate round icon
        const roundBuffer = await (0, imageProcessor_1.resizeImage)(source, density.size, density.size, {
            roundCorners: 50, // Circular
        });
        const roundPath = path.join(densityDir, 'ic_launcher_round.png');
        fs.writeFileSync(roundPath, roundBuffer);
        files.push(roundPath);
    }
    // Generate Play Store icon
    onProgress?.('Generating Play Store icon (512x512)...');
    const playStoreBuffer = await (0, imageProcessor_1.resizeImage)(source, PLAY_STORE_SIZE, PLAY_STORE_SIZE);
    const playStorePath = path.join(androidDir, 'playstore-icon.png');
    fs.writeFileSync(playStorePath, playStoreBuffer);
    files.push(playStorePath);
    // Generate adaptive icon foreground
    onProgress?.('Generating adaptive icon assets...');
    const foregroundSize = 432; // 108dp * 4 (xxxhdpi)
    const foregroundBuffer = await (0, imageProcessor_1.resizeImage)(source, foregroundSize, foregroundSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
    const foregroundDir = path.join(resDir, 'mipmap-xxxhdpi');
    fs.mkdirSync(foregroundDir, { recursive: true });
    const foregroundPath = path.join(foregroundDir, 'ic_launcher_foreground.png');
    fs.writeFileSync(foregroundPath, foregroundBuffer);
    files.push(foregroundPath);
    return {
        outputDir: androidDir,
        files,
        summary: `Generated ${files.length} files: ${DENSITIES.length} density folders with launcher + round icons + Play Store icon + adaptive foreground`,
    };
}
//# sourceMappingURL=androidPreset.js.map