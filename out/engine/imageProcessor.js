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
exports.validateImage = validateImage;
exports.resizeImage = resizeImage;
exports.addSolidBackground = addSolidBackground;
exports.addGradientBackground = addGradientBackground;
exports.convertSvgToPng = convertSvgToPng;
exports.getSourceBuffer = getSourceBuffer;
const sharp = require("sharp");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Validate an image file and return metadata
 */
async function validateImage(filePath) {
    const warnings = [];
    const ext = path.extname(filePath).toLowerCase();
    const supportedFormats = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    if (!supportedFormats.includes(ext)) {
        return { valid: false, warnings: [`Unsupported format: ${ext}. Supported: PNG, JPG, SVG, WebP`] };
    }
    if (!fs.existsSync(filePath)) {
        return { valid: false, warnings: ['File does not exist'] };
    }
    try {
        const metadata = await sharp(filePath).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;
        const isSquare = width === height;
        const hasAlpha = metadata.hasAlpha || false;
        const format = metadata.format || ext.replace('.', '');
        if (!isSquare) {
            warnings.push(`Image is not square (${width}x${height}). Icons work best with square images. It will be center-cropped.`);
        }
        if (width < 1024 || height < 1024) {
            warnings.push(`Image resolution (${width}x${height}) is below recommended 1024x1024. Some icons may appear blurry.`);
        }
        return {
            valid: true,
            info: { width, height, format, isSquare, hasAlpha },
            warnings,
        };
    }
    catch (err) {
        return { valid: false, warnings: [`Failed to read image: ${err.message}`] };
    }
}
/**
 * Resize an image to the specified dimensions, returns a PNG buffer
 */
async function resizeImage(input, width, height, options) {
    let pipeline = sharp(input).resize(width, height, {
        fit: options?.fit || 'cover',
        position: 'centre',
        background: options?.background || { r: 0, g: 0, b: 0, alpha: 0 },
    });
    let buffer = await pipeline.png().toBuffer();
    // Apply round corners if requested
    if (options?.roundCorners && options.roundCorners > 0) {
        buffer = await applyRoundCorners(buffer, width, height, options.roundCorners);
    }
    return buffer;
}
/**
 * Apply rounded corners to an image using SVG mask overlay
 */
async function applyRoundCorners(input, width, height, radiusPercent) {
    const radius = Math.round(Math.min(width, height) * (radiusPercent / 100));
    const roundedMask = Buffer.from(`<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`);
    return sharp(input)
        .composite([
        {
            input: roundedMask,
            blend: 'dest-in',
        },
    ])
        .png()
        .toBuffer();
}
/**
 * Add a solid color background behind a transparent image
 */
async function addSolidBackground(input, width, height, color) {
    const bg = await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: color,
        },
    })
        .png()
        .toBuffer();
    return sharp(bg)
        .composite([{ input, blend: 'over' }])
        .png()
        .toBuffer();
}
/**
 * Add a gradient background behind a transparent image
 */
async function addGradientBackground(input, width, height, startColor, endColor) {
    const gradientSvg = Buffer.from(`<svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
    </svg>`);
    const bg = await sharp(gradientSvg).png().toBuffer();
    return sharp(bg)
        .composite([{ input, blend: 'over' }])
        .png()
        .toBuffer();
}
/**
 * Convert SVG to PNG buffer at given dimensions
 */
async function convertSvgToPng(svgPath, width, height) {
    return sharp(svgPath)
        .resize(width, height)
        .png()
        .toBuffer();
}
/**
 * Get a high-res source buffer from any supported input
 */
async function getSourceBuffer(filePath, targetSize = 1024) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.svg') {
        return convertSvgToPng(filePath, targetSize, targetSize);
    }
    // Read and ensure PNG format at source resolution
    const metadata = await sharp(filePath).metadata();
    const maxDim = Math.max(metadata.width || targetSize, metadata.height || targetSize);
    if (maxDim >= targetSize) {
        return sharp(filePath).png().toBuffer();
    }
    // Upscale if needed (not recommended but handle gracefully)
    return sharp(filePath)
        .resize(targetSize, targetSize, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer();
}
//# sourceMappingURL=imageProcessor.js.map