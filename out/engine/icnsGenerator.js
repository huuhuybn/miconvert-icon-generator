"use strict";
/**
 * Pure JS ICNS generator
 *
 * ICNS file format:
 * - Header: 4 bytes magic ('icns') + 4 bytes total file size
 * - Data blocks: each has 4 byte type + 4 byte block size + PNG data
 *
 * We use the PNG-based icon types introduced in macOS 10.7+
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIcns = generateIcns;
// Map of icon sizes to ICNS type identifiers (PNG-based types)
const ICNS_TYPES = {
    '16x16': 'icp4', // 16x16
    '32x32': 'icp5', // 32x32
    '64x64': 'icp6', // 64x64
    '128x128': 'ic07', // 128x128
    '256x256': 'ic08', // 256x256
    '512x512': 'ic09', // 512x512
    '1024x1024': 'ic10', // 1024x1024 (512@2x)
    // Retina variants
    '32x32@2x': 'ic11', // 16@2x = 32x32
    '64x64@2x': 'ic12', // 32@2x = 64x64
    '256x256@2x': 'ic13', // 128@2x = 256x256
    '512x512@2x': 'ic14', // 256@2x = 512x512
};
/**
 * Generate an ICNS file buffer from a map of size labels to PNG buffers
 * @param icons Map of size strings (e.g., '16x16', '32x32@2x') to PNG Buffer
 */
function generateIcns(icons) {
    const entries = [];
    for (const [sizeLabel, pngBuffer] of icons) {
        const type = ICNS_TYPES[sizeLabel];
        if (type) {
            entries.push({ type, pngBuffer });
        }
    }
    // Calculate total file size
    // Header = 8 bytes (magic + size)
    // Each entry = 8 bytes header (type + size) + PNG data length
    let totalSize = 8;
    for (const entry of entries) {
        totalSize += 8 + entry.pngBuffer.length;
    }
    const buffer = Buffer.alloc(totalSize);
    let offset = 0;
    // Write file header
    buffer.write('icns', offset, 4, 'ascii');
    offset += 4;
    buffer.writeUInt32BE(totalSize, offset);
    offset += 4;
    // Write each entry
    for (const entry of entries) {
        const blockSize = 8 + entry.pngBuffer.length;
        // Write type (4 chars)
        buffer.write(entry.type, offset, 4, 'ascii');
        offset += 4;
        // Write block size (4 bytes, big-endian)
        buffer.writeUInt32BE(blockSize, offset);
        offset += 4;
        // Write PNG data
        entry.pngBuffer.copy(buffer, offset);
        offset += entry.pngBuffer.length;
    }
    return buffer;
}
//# sourceMappingURL=icnsGenerator.js.map