//! esm-to-plain-js v1.1.2 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

import chalk from 'chalk';
import fs from 'fs';
import log from 'fancy-log';
import path from 'path';
import slash from 'slash';
const esmToPlainJs = {
    transform(sourceFile, targetFile, options) {
        const defaults = {
            cd: null,
        };
        const settings = { ...defaults, ...options };
        const startTime = Date.now();
        const normalize = (folder) => !folder ? '' : slash(path.normalize(folder)).replace(/\/$/, '');
        const startFolder = settings.cd ? normalize(settings.cd) + '/' : '';
        const source = sourceFile ? normalize(startFolder + sourceFile) : '';
        const sourceExists = source && fs.existsSync(source);
        const sourceIsFile = sourceExists && fs.statSync(source).isFile();
        const target = targetFile ? normalize(startFolder + targetFile) : null;
        const targetFolder = target ? path.dirname(target) : null;
        if (targetFolder)
            fs.mkdirSync(targetFolder, { recursive: true });
        const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
        const errorMessage = !sourceFile ? 'Must specify a source file.' :
            !sourceExists ? 'Source file does not exist: ' + source :
                !sourceIsFile ? 'Source is not a file: ' + source :
                    !target ? 'Must specify a target file.' :
                        badTargetFolder ? 'Target folder cannot be written to: ' + targetFolder :
                            null;
        if (errorMessage)
            throw Error('[esm-to-plain-js] ' + errorMessage);
        const esm = fs.readFileSync(source, 'utf-8');
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
        fs.writeFileSync(target, plainJs);
        return {
            origin: source,
            dest: target,
            length: plainJs.length,
            duration: Date.now() - startTime,
        };
    },
    reporter(result) {
        const name = chalk.gray('esm-to-plain-js');
        const origin = chalk.blue.bold(result.origin);
        const dest = chalk.magenta(result.dest);
        const arrow = chalk.gray.bold('→');
        const info = chalk.white(`(${result.duration}ms)`);
        log(name, origin, arrow, dest, info);
    },
};
export { esmToPlainJs };
