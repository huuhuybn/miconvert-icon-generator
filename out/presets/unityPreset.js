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
exports.generateUnityPreset = generateUnityPreset;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const androidPreset_1 = require("./androidPreset");
const iosPreset_1 = require("./iosPreset");
const webPreset_1 = require("./webPreset");
const zipExporter_1 = require("../engine/zipExporter");
/**
 * Generate Unity icons — combines Android + iOS + WebGL presets into one export
 */
async function generateUnityPreset(sourceFile, outputDir, onProgress) {
    const unityDir = path.join(outputDir, 'unity-icons');
    fs.mkdirSync(unityDir, { recursive: true });
    const allFiles = [];
    // Android platform
    onProgress?.('Generating Android icons for Unity...');
    const androidResult = await (0, androidPreset_1.generateAndroidPreset)(sourceFile, unityDir, onProgress);
    allFiles.push(...androidResult.files);
    // iOS platform
    onProgress?.('Generating iOS icons for Unity...');
    const iosResult = await (0, iosPreset_1.generateiOSPreset)(sourceFile, unityDir, onProgress);
    allFiles.push(...iosResult.files);
    // WebGL (same as PWA/Web)
    onProgress?.('Generating WebGL icons for Unity...');
    const webResult = await (0, webPreset_1.generateWebPreset)(sourceFile, unityDir, onProgress);
    allFiles.push(...webResult.files);
    // Create ZIP for easy import
    onProgress?.('Creating Unity export ZIP...');
    const zipPath = path.join(outputDir, 'unity-icons.zip');
    await (0, zipExporter_1.createZip)(unityDir, zipPath);
    allFiles.push(zipPath);
    return {
        outputDir: unityDir,
        files: allFiles,
        summary: `Generated Unity icon package: Android + iOS + WebGL icons + ZIP export (${allFiles.length} files)`,
    };
}
//# sourceMappingURL=unityPreset.js.map