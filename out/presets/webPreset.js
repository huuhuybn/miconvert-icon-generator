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
exports.generateWebPreset = generateWebPreset;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const imageProcessor_1 = require("../engine/imageProcessor");
const icoGenerator_1 = require("../engine/icoGenerator");
const FAVICON_SIZES = [16, 32, 48, 64];
const PWA_SIZES = [192, 512];
const APPLE_TOUCH_SIZE = 180;
/**
 * Generate Web/PWA icons
 */
async function generateWebPreset(sourceFile, outputDir, onProgress) {
    const files = [];
    const webDir = path.join(outputDir, 'web-icons');
    fs.mkdirSync(webDir, { recursive: true });
    const source = await (0, imageProcessor_1.getSourceBuffer)(sourceFile);
    // Generate favicon PNGs
    onProgress?.('Generating favicons...');
    const icoBuffers = [];
    for (const size of FAVICON_SIZES) {
        const buffer = await (0, imageProcessor_1.resizeImage)(source, size, size);
        const filePath = path.join(webDir, `favicon-${size}x${size}.png`);
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
        icoBuffers.push(buffer);
    }
    // Generate favicon.ico (multi-layer)
    onProgress?.('Generating favicon.ico...');
    const icoBuffer = await (0, icoGenerator_1.generateIco)(icoBuffers);
    const icoPath = path.join(webDir, 'favicon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    files.push(icoPath);
    // Generate PWA icons
    onProgress?.('Generating PWA icons...');
    for (const size of PWA_SIZES) {
        const buffer = await (0, imageProcessor_1.resizeImage)(source, size, size);
        const filePath = path.join(webDir, `icon-${size}x${size}.png`);
        fs.writeFileSync(filePath, buffer);
        files.push(filePath);
    }
    // Generate Apple Touch Icon
    onProgress?.('Generating Apple Touch Icon...');
    const appleBuffer = await (0, imageProcessor_1.resizeImage)(source, APPLE_TOUCH_SIZE, APPLE_TOUCH_SIZE);
    const applePath = path.join(webDir, 'apple-touch-icon.png');
    fs.writeFileSync(applePath, appleBuffer);
    files.push(applePath);
    // Generate manifest.json snippet
    onProgress?.('Generating manifest.json...');
    const manifest = {
        icons: [
            ...PWA_SIZES.map((size) => ({
                src: `icon-${size}x${size}.png`,
                sizes: `${size}x${size}`,
                type: 'image/png',
                purpose: 'any maskable',
            })),
        ],
    };
    const manifestPath = path.join(webDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    files.push(manifestPath);
    // Generate HTML link snippet
    onProgress?.('Generating HTML snippet...');
    const htmlSnippet = `<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">

<!-- PWA -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#ffffff">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
`;
    const htmlPath = path.join(webDir, 'icon-links.html');
    fs.writeFileSync(htmlPath, htmlSnippet);
    files.push(htmlPath);
    return {
        outputDir: webDir,
        files,
        summary: `Generated ${files.length} files: ${FAVICON_SIZES.length} favicons + favicon.ico + ${PWA_SIZES.length} PWA icons + Apple Touch Icon + manifest.json + HTML snippet`,
    };
}
//# sourceMappingURL=webPreset.js.map