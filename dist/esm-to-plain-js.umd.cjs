//! esm-to-plain-js v1.0.1 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "slash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.esmToPlainJs = void 0;
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const slash_1 = __importDefault(require("slash"));
    const esmToPlainJs = {
        transform(sourceFile, targetFile, options) {
            const defaults = {
                cd: null,
            };
            const settings = Object.assign(Object.assign({}, defaults), options);
            const startTime = Date.now();
            const normalize = (folder) => !folder ? '' : (0, slash_1.default)(path_1.default.normalize(folder)).replace(/\/$/, '');
            const startFolder = settings.cd ? normalize(settings.cd) + '/' : '';
            const source = sourceFile ? normalize(startFolder + sourceFile) : '';
            const sourceExists = source && fs_1.default.existsSync(source);
            const sourceIsFile = sourceExists && fs_1.default.statSync(source).isFile();
            const target = targetFile ? normalize(startFolder + targetFile) : null;
            const targetFolder = target ? path_1.default.dirname(target) : null;
            if (targetFolder)
                fs_1.default.mkdirSync(targetFolder, { recursive: true });
            const badTargetFolder = !targetFolder || !fs_1.default.existsSync(targetFolder);
            const errorMessage = !sourceFile ? 'Must specify a source file.' :
                !sourceExists ? 'Source file does not exist: ' + source :
                    !sourceIsFile ? 'Source is not a file: ' + source :
                        !target ? 'Must specify a target file.' :
                            badTargetFolder ? 'Target folder cannot be written to: ' + targetFolder :
                                null;
            if (errorMessage)
                throw Error('[esm-to-plain-js] ' + errorMessage);
            const esm = fs_1.default.readFileSync(source, 'utf-8');
            const normalizeEol = /\r/g;
            const normalizeEof = /\s*$(?!\n)/;
            const replaceImport = (stmt) => '// Ensure library is loaded => ' + stmt;
            const toGlobal = (module) => `globalThis.${module} = ${module};`;
            const replaceExport = (stmt, modules) => modules.split(', ').map(toGlobal).join('\n');
            const importPattern = /^import .*/mg;
            const exportPattern = /^export \{ (.*) \};$/m;
            const plainJs = esm
                .replace(normalizeEol, '')
                .replace(normalizeEof, '\n')
                .replace(importPattern, replaceImport)
                .replace(exportPattern, replaceExport);
            fs_1.default.writeFileSync(target, plainJs);
            return {
                origin: source,
                dest: target,
                length: plainJs.length,
                duration: Date.now() - startTime,
            };
        },
    };
    exports.esmToPlainJs = esmToPlainJs;
});
