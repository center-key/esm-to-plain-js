//! esm-to-plain-js v1.2.3 ~~ https://github.com/center-key/esm-to-plain-js ~~ MIT License

import { cliArgvUtil } from 'cli-argv-util';
import chalk from 'chalk';
import fs from 'node:fs';
import log from 'fancy-log';
import os from 'node:os';
import path from 'node:path';
import slash from 'slash';
const esmToPlainJs = {
    version: '1.2.3',
    assertOk(ok, message) {
        if (!ok)
            throw new Error(`[esm-to-plain-js] ${message}`);
    },
    transform(sourceFile, targetFile, options) {
        const defaults = {
            cd: null,
        };
        const settings = { ...defaults, ...options };
        const startTime = Date.now();
        const clean = (folder) => slash(path.normalize(folder)).replace(/\/$/, '');
        const cleanPath = (folder) => !folder ? '' : clean(folder);
        const startFolder = settings.cd ? cleanPath(settings.cd) + '/' : '';
        const source = sourceFile ? cleanPath(startFolder + sourceFile) : '';
        const sourceExists = source && fs.existsSync(source);
        const sourceIsFile = sourceExists && fs.statSync(source).isFile();
        const target = targetFile ? cleanPath(startFolder + targetFile) : null;
        const targetFolder = target ? path.dirname(target) : null;
        if (targetFolder)
            fs.mkdirSync(targetFolder, { recursive: true });
        const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
        const error = !sourceFile ? 'Must specify a source file.' :
            !sourceExists ? 'Source file does not exist: ' + source :
                !sourceIsFile ? 'Source is not a file: ' + source :
                    !target ? 'Must specify a target file.' :
                        badTargetFolder ? 'Target folder cannot be written to: ' + String(targetFolder) :
                            null;
        esmToPlainJs.assertOk(!error, error);
        const esm = fs.readFileSync(source, 'utf-8');
        const importPattern = /^import .*/mg;
        const exportPattern = /^export \{ (.*) \};$/m;
        const replaceImport = (stmt) => '// Ensure library is loaded => ' + stmt;
        const toGlobal = (module) => `globalThis.${module} = ${module};`;
        const replaceExport = (stmt, modules) => modules.split(', ').map(toGlobal).join(os.EOL);
        const plainJs = esm
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
        const version = chalk.gray('v' + esmToPlainJs.version);
        const info = chalk.blue(`(${result.duration}ms)`);
        log(name, version, cliArgvUtil.colorizePath(result.dest), info);
    },
    cli() {
        const validFlags = ['cd', 'note', 'quiet'];
        const cli = cliArgvUtil.parse(validFlags);
        const source = cli.params[0];
        const target = cli.params[1];
        const error = cli.invalidFlag ? cli.invalidFlagMsg :
            cli.paramCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
                !source ? 'Missing source file.' :
                    !target ? 'Missing target file.' :
                        null;
        esmToPlainJs.assertOk(!error, error);
        const options = {
            cd: cli.flagMap.cd ?? null,
        };
        const result = esmToPlainJs.transform(source, target, options);
        if (!cli.flagOn.quiet)
            esmToPlainJs.reporter(result);
    },
};
export { esmToPlainJs };
