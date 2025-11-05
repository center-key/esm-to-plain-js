// esm-to-plain-js ~~ MIT License

// Imports
import { EOL } from 'node:os';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';
import slash from 'slash';

// Types
export type Settings = {
   cd: string | null,  //change working directory before starting copy
   };
export type Result = {
   origin:   string,  //path of source file
   dest:     string,  //path of targe file
   length:   number,  //size of the target file in bytes
   duration: number,  //execution time in milliseconds
   };

const esmToPlainJs = {

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[esm-to-plain-js] ${message}`);
      },

   transform(sourceFile: string, targetFile: string, options?: Partial<Settings>): Result {
      const defaults: Settings = {
         cd: null,
         };
      const settings =     { ...defaults, ...options };
      const startTime =    Date.now();
      const clean =        (folder: string) => slash(path.normalize(folder)).replace(/\/$/, '');
      const cleanPath =    (folder: string | null) => !folder ? '' : clean(folder);
      const startFolder =  settings.cd ? cleanPath(settings.cd) + '/' : '';
      const source =       sourceFile ? cleanPath(startFolder + sourceFile) : '';
      const sourceExists = source && fs.existsSync(source);
      const sourceIsFile = sourceExists && fs.statSync(source).isFile();
      const target =       targetFile ? cleanPath(startFolder + targetFile) : null;
      const targetFolder = target ? path.dirname(target) : null;
      if (targetFolder)
         fs.mkdirSync(targetFolder, { recursive: true });
      const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
      const error =
         !sourceFile ?     'Must specify a source file.' :
         !sourceExists ?   'Source file does not exist: ' + source :
         !sourceIsFile ?   'Source is not a file: ' + source :
         !target ?         'Must specify a target file.' :
         badTargetFolder ? 'Target folder cannot be written to: ' + String(targetFolder) :
         null;
      esmToPlainJs.assert(!error, error);
      const esm =           fs.readFileSync(source, 'utf-8');
      const importPattern = /^import .*/mg;           //example: "import * as R from 'ramda';"
      const exportPattern = /^export \{ (.*) \};$/m;  //example: "export { webApp };"
      const replaceImport = (stmt: string) => '// Ensure library is loaded => ' + stmt;
      const toGlobal =      (module: string) => `globalThis.${module} = ${module};`;
      const replaceExport = (stmt: string, modules: string) =>
         modules.split(', ').map(toGlobal).join(EOL);
      const plainJs = esm
         .replace(importPattern, replaceImport)
         .replace(exportPattern, replaceExport);
      fs.writeFileSync(target!, plainJs);
      return {
         origin:   source,
         dest:     target!,
         length:   plainJs.length,
         duration: Date.now() - startTime,
         };
      },

   reporter(result: Result) {
      const name =   chalk.gray('esm-to-plain-js');
      const origin = chalk.blue.bold(result.origin);
      const dest =   chalk.magenta(result.dest);
      const arrow =  chalk.gray.bold('→');
      const info =   chalk.white(`(${result.duration}ms)`);
      log(name, origin, arrow, dest, info);
      },

   };

export { esmToPlainJs };
