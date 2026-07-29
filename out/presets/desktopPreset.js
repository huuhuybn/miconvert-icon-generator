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
exports.generateWindowsPreset = generateWindowsPreset;
exports.generateMacPreset = generateMacPreset;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const imageProcessor_1 = require("../engine/imageProcessor");
const icoGenerator_1 = require("../engine/icoGenerator");
const icnsGenerator_1 = require("../engine/icnsGenerator");
const WINDOWS_ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];
const MAC_ICON_SPECS = [
    { label: '16x16', size: 16, retina: false },
    { label: '16x16@2x', size: 32, retina: true },
    { label: '32x32', size: 32, retina: false },
    { label: '32x32@2x', size: 64, retina: true },
    { label: '128x128', size: 128, retina: false },
    { label: '128x128@2x', size: 256, retina: true },
    { label: '256x256', size: 256, retina: false },
    { label: '256x256@2x', size: 512, retina: true },
    { label: '512x512', size: 512, retina: false },
    { label: '512x512@2x', size: 1024, retina: true },
];
/**
 * Generate Windows .ico file
 */
async function generateWindowsPreset(sourceFile, outputDir, onProgress) {
    const files = [];
    const winDir = path.join(outputDir, 'windows-icons');
    fs.mkdirSync(winDir, { recursive: true });
    const source = await (0, imageProcessor_1.getSourceBuffer)(sourceFile);
    // Generate individual PNGs
    const icoBuffers = [];
    for (const size of WINDOWS_ICO_SIZES) {
        onProgress?.(`Generating ${size}x${size} PNG...`);
        const buffer = await (0, imageProcessor_1.resizeImage)(source, size, size);
        const filePath = path.join(winDir, `icon-${size}x${size}.png`);
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
        icoBuffers.push(buffer);
    }
    // Generate multi-size .ico
    onProgress?.('Generating app.ico (multi-size)...');
    const icoBuffer = await (0, icoGenerator_1.generateIco)(icoBuffers);
    const icoPath = path.join(winDir, 'app.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    files.push(icoPath);
    return {
        outputDir: winDir,
        files,
        summary: `Generated ${files.length} files: ${WINDOWS_ICO_SIZES.length} PNGs + multi-size app.ico`,
    };
}
/**
 * Generate macOS .icns file
 */
async function generateMacPreset(sourceFile, outputDir, onProgress) {
    const files = [];
    const macDir = path.join(outputDir, 'macos-icons');
    fs.mkdirSync(macDir, { recursive: true });
    const source = await (0, imageProcessor_1.getSourceBuffer)(sourceFile);
    // Generate all sizes and collect for ICNS
    const icnsMap = new Map();
    for (const spec of MAC_ICON_SPECS) {
        onProgress?.(`Generating ${spec.label} (${spec.size}x${spec.size})...`);
        const buffer = await (0, imageProcessor_1.resizeImage)(source, spec.size, spec.size);
        // Save individual PNG
        const filename = `icon_${spec.label.replace('@', '_at_')}.png`;
        const filePath = path.join(macDir, filename);
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
        // Map for ICNS: use size×size or size×size@2x format
        const icnsKey = spec.retina
            ? `${spec.size}x${spec.size}@2x`
            : `${spec.size}x${spec.size}`;
        icnsMap.set(icnsKey, buffer);
    }
    // Generate .icns file
    onProgress?.('Generating app.icns...');
    const icnsBuffer = (0, icnsGenerator_1.generateIcns)(icnsMap);
    const icnsPath = path.join(macDir, 'app.icns');
    fs.writeFileSync(icnsPath, icnsBuffer);
    files.push(icnsPath);
    return {
        outputDir: macDir,
        files,
        summary: `Generated ${files.length} files: ${MAC_ICON_SPECS.length} PNGs + app.icns`,
    };
}
//# sourceMappingURL=desktopPreset.js.map