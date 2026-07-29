"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIco = generateIco;
const pngToIco = require("png-to-ico");
/**
 * Generate a multi-layer .ico file from multiple PNG buffers
 * Each buffer should be already resized to the desired dimensions
 */
async function generateIco(pngBuffers) {
    return pngToIco(pngBuffers);
}
//# sourceMappingURL=icoGenerator.js.map