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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const imageProcessor_1 = require("./engine/imageProcessor");
const presetRegistry_1 = require("./presets/presetRegistry");
const zipExporter_1 = require("./engine/zipExporter");
const analytics_1 = require("./analytics");
let nlsMessages = {};
function loadNls() {
    try {
        // VS Code sets process.env.VSCODE_NLS_CONFIG with locale info
        const nlsConfig = process.env.VSCODE_NLS_CONFIG;
        let locale = 'en';
        if (nlsConfig) {
            try {
                const config = JSON.parse(nlsConfig);
                locale = config.locale || 'en';
            }
            catch { }
        }
        const extPath = path.join(__dirname, '..');
        // Try locale-specific file first
        const localeFile = path.join(extPath, `package.nls.${locale}.json`);
        const defaultFile = path.join(extPath, 'package.nls.json');
        if (locale !== 'en' && fs.existsSync(localeFile)) {
            // Load default first, then overlay locale
            const defaults = JSON.parse(fs.readFileSync(defaultFile, 'utf8'));
            const localized = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
            nlsMessages = { ...defaults, ...localized };
        }
        else {
            nlsMessages = JSON.parse(fs.readFileSync(defaultFile, 'utf8'));
        }
    }
    catch {
        // Fallback: empty messages, will use key as-is
        nlsMessages = {};
    }
}
function t(key, ...args) {
    let msg = nlsMessages[key] || key;
    // Replace {0}, {1}, etc. with args
    args.forEach((arg, i) => {
        msg = msg.replace(`{${i}}`, String(arg));
    });
    return msg;
}
function activate(context) {
    loadNls();
    console.log('MiConvert Icon Generator is active');
    const generateCommand = vscode.commands.registerCommand('miconvert.generateIcons', async (uri) => {
        try {
            // Step 1: Get the source image file
            let sourceFile;
            if (uri) {
                sourceFile = uri.fsPath;
            }
            else {
                const selected = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'Images': ['png', 'jpg', 'jpeg', 'svg', 'webp'],
                    },
                    title: t('select.source'),
                });
                if (!selected || selected.length === 0) {
                    return;
                }
                sourceFile = selected[0].fsPath;
            }
            if (!sourceFile) {
                return;
            }
            // Step 2: Enhanced validation
            const validation = await (0, imageProcessor_1.validateImage)(sourceFile);
            if (!validation.valid) {
                vscode.window.showErrorMessage(`❌ ${t('error.invalid')}: ${validation.warnings.join('. ')}`);
                return;
            }
            const info = validation.info;
            const warnings = [...validation.warnings];
            // Enhanced validation warnings
            if (!info.isSquare) {
                warnings.push(`⚠️ ${t('warn.notSquare', info.width, info.height)}`);
            }
            if (info.width < 1024 || info.height < 1024) {
                warnings.push(`⚠️ ${t('warn.lowRes', info.width, info.height)}`);
            }
            if (!info.hasAlpha && info.format !== 'svg') {
                warnings.push(`💡 ${t('warn.noAlpha')}`);
            }
            if (info.format === 'jpeg' || info.format === 'jpg') {
                warnings.push(`💡 ${t('warn.jpgFormat')}`);
            }
            // Show warnings if any
            if (warnings.length > 0) {
                const proceed = await vscode.window.showWarningMessage(warnings.join(' | '), { modal: false }, t('action.continue'), t('action.cancel'));
                if (proceed !== t('action.continue')) {
                    return;
                }
            }
            // Show image info
            const alphaText = info.hasAlpha ? t('info.transparent') : t('info.opaque');
            vscode.window.showInformationMessage(`📷 ${t('info.source', info.width, info.height, info.format.toUpperCase(), alphaText)}`);
            // Step 3: Choose preset(s)
            const presetOptions = (0, presetRegistry_1.getAllPresetOptions)();
            const selectedPreset = await vscode.window.showQuickPick(presetOptions.map((p) => ({
                label: p.label,
                description: p.description,
                preset: p,
            })), {
                placeHolder: t('select.platform'),
                title: t('command.generateIcons.title'),
            });
            if (!selectedPreset) {
                return;
            }
            // Step 4: Choose output folder
            const outputChoice = await vscode.window.showQuickPick([
                {
                    label: `📁 ${t('output.workspace')}`,
                    description: t('output.workspace.desc'),
                    value: 'workspace',
                },
                {
                    label: `📂 ${t('output.beside')}`,
                    description: t('output.beside.desc'),
                    value: 'beside',
                },
                {
                    label: `🗂 ${t('output.custom')}`,
                    description: t('output.custom.desc'),
                    value: 'custom',
                },
            ], {
                placeHolder: t('select.output'),
                title: t('select.output.title'),
            });
            if (!outputChoice) {
                return;
            }
            let outputDir;
            switch (outputChoice.value) {
                case 'workspace':
                    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                    if (!workspaceFolder) {
                        vscode.window.showErrorMessage(t('error.noWorkspace'));
                        return;
                    }
                    outputDir = workspaceFolder.uri.fsPath;
                    break;
                case 'beside':
                    outputDir = path.dirname(sourceFile);
                    break;
                case 'custom':
                    const customSelected = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        title: t('select.output'),
                    });
                    if (!customSelected || customSelected.length === 0) {
                        return;
                    }
                    outputDir = customSelected[0].fsPath;
                    break;
                default:
                    return;
            }
            // Step 5: Additional options
            const additionalOptions = await vscode.window.showQuickPick([
                { label: `📦 ${t('option.zip')}`, description: t('option.zip.desc'), picked: false, value: 'zip' },
                { label: `🎨 ${t('option.bgWhite')}`, description: t('option.bgWhite.desc'), picked: false, value: 'bg-white' },
                { label: `🌈 ${t('option.transparent')}`, description: t('option.transparent.desc'), picked: true, value: 'transparent' },
            ], {
                placeHolder: t('select.options'),
                title: t('select.options.title'),
                canPickMany: true,
            });
            const wantZip = additionalOptions?.some((o) => o.value === 'zip') || false;
            // Step 6: Generate icons with progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: t('progress.title'),
                cancellable: false,
            }, async (progress) => {
                const onProgress = (msg) => {
                    progress.report({ message: msg });
                };
                const results = [];
                const generatedPresetIds = [];
                if (selectedPreset.preset.id === 'all') {
                    const mainPresets = presetRegistry_1.PRESETS.filter((p) => p.id !== 'unity');
                    const total = mainPresets.length;
                    let current = 0;
                    for (const preset of mainPresets) {
                        current++;
                        progress.report({
                            message: t('progress.step', current, total, preset.label),
                            increment: (100 / total),
                        });
                        const result = await preset.generate(sourceFile, outputDir, onProgress);
                        results.push(result);
                        generatedPresetIds.push(preset.id);
                    }
                }
                else {
                    const presetInfo = selectedPreset.preset;
                    progress.report({ message: t('progress.generating', selectedPreset.label) });
                    const result = await presetInfo.generate(sourceFile, outputDir, onProgress);
                    results.push(result);
                    generatedPresetIds.push(presetInfo.id);
                }
                // ZIP if requested
                if (wantZip && results.length > 0) {
                    progress.report({ message: t('progress.zip') });
                    for (const result of results) {
                        const zipPath = result.outputDir + '.zip';
                        await (0, zipExporter_1.createZip)(result.outputDir, zipPath);
                    }
                }
                // Track analytics locally
                for (const presetId of generatedPresetIds) {
                    (0, analytics_1.trackPresetUsage)(context, presetId);
                }
                // Show summary with upsell CTA
                const totalFiles = results.reduce((sum, r) => sum + r.files.length, 0);
                const totalGens = (0, analytics_1.getTotalGenerations)(context);
                const action = await vscode.window.showInformationMessage(`✅ ${t('success.generated', totalFiles)}`, t('action.openFolder'), `🚀 ${t('action.openAdvanced')}`, t('action.ok'));
                if (action === t('action.openFolder')) {
                    const folderUri = vscode.Uri.file(results[0].outputDir);
                    await vscode.commands.executeCommand('revealFileInOS', folderUri);
                }
                else if (action === `🚀 ${t('action.openAdvanced')}`) {
                    vscode.env.openExternal(vscode.Uri.parse('https://miconvert.com/en/png-to-ico?utm_source=vscode&utm_medium=extension&utm_campaign=icon-gen'));
                }
                // Soft upsell after every 5th generation
                if (totalGens > 0 && totalGens % 5 === 0) {
                    const upsellAction = await vscode.window.showInformationMessage(`🎉 ${t('upsell.milestone', totalGens)}`, t('action.openMiConvert'), t('action.dismiss'));
                    if (upsellAction === t('action.openMiConvert')) {
                        vscode.env.openExternal(vscode.Uri.parse('https://miconvert.com/en/png-to-ico?utm_source=vscode&utm_medium=extension&utm_campaign=milestone'));
                    }
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`${t('error.general')}: ${error.message}`);
            console.error('MiConvert Icon Generator error:', error);
        }
    });
    context.subscriptions.push(generateCommand);
}
function deactivate() {
    // cleanup
}
//# sourceMappingURL=extension.js.map