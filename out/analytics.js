"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackPresetUsage = trackPresetUsage;
exports.getPresetUsageStats = getPresetUsageStats;
exports.getTotalGenerations = getTotalGenerations;
const ANALYTICS_KEY = 'miconvert.presetUsage';
/**
 * Track preset usage locally (no external analytics)
 */
function trackPresetUsage(context, presetId) {
    const usage = context.globalState.get(ANALYTICS_KEY, {});
    usage[presetId] = (usage[presetId] || 0) + 1;
    context.globalState.update(ANALYTICS_KEY, usage);
}
/**
 * Get local preset usage statistics
 */
function getPresetUsageStats(context) {
    return context.globalState.get(ANALYTICS_KEY, {});
}
/**
 * Get total generation count
 */
function getTotalGenerations(context) {
    const usage = getPresetUsageStats(context);
    return Object.values(usage).reduce((sum, count) => sum + count, 0);
}
//# sourceMappingURL=analytics.js.map