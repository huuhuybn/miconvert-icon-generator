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
exports.createZip = createZip;
exports.createZipFromBuffers = createZipFromBuffers;
const archiver = __importStar(require("archiver"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Create a ZIP archive of a directory
 * @param sourceDir The directory to zip
 * @param outputPath The output ZIP file path
 */
async function createZip(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver.default('zip', { zlib: { level: 9 } });
        output.on('close', () => {
            resolve(outputPath);
        });
        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(sourceDir, path.basename(sourceDir));
        archive.finalize();
    });
}
/**
 * Add files to a ZIP archive from a map of relative paths to Buffers
 * @param files Map of relative file paths to Buffer contents
 * @param outputPath The output ZIP file path
 */
async function createZipFromBuffers(files, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver.default('zip', { zlib: { level: 9 } });
        output.on('close', () => {
            resolve(outputPath);
        });
        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        for (const [filePath, buffer] of files) {
            archive.append(buffer, { name: filePath });
        }
        archive.finalize();
    });
}
//# sourceMappingURL=zipExporter.js.map