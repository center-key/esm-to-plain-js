// esm-to-plain-js ~~ MIT License

import fs    from 'fs';
import path  from 'path';
import slash from 'slash';

export type Settings = {
   cd: string,  //change working directory before starting copy
   };
export type Options = Partial<Settings>;
export type Result = {
   origin:   string,  //path of source file
   dest:     string,  //path of targe file
   length:   number,  //size of the target file in bytes
   duration: number,  //execution time in milliseconds
   };

const esmToPlainJs = {

   transform(sourceFile: string, targetFile: string, options: Options): Result {
      const defaults = {
         cd: null,
         };
      const settings = { ...defaults, ...options };
      const startTime = Date.now();
      const normalize = (folder: string | null) =>
         !folder ? '' : slash(path.normalize(folder)).replace(/\/$/, '');
      const startFolder =  settings.cd ? normalize(settings.cd) + '/' : '';
      const source =       sourceFile ? normalize(startFolder + sourceFile) : '';
      const sourceExists = source && fs.existsSync(source);
      const sourceIsFile = sourceExists && fs.statSync(source).isFile();
      const target =       targetFile ? normalize(startFolder + targetFile) : null;
      const targetFolder = target ? path.dirname(target) : null;
      if (targetFolder)
         fs.mkdirSync(targetFolder, { recursive: true });
      const badTargetFolder = !targetFolder || !fs.existsSync(targetFolder);
      const errorMessage =
         !sourceFile ?     'Must specify a source file.' :
         !sourceExists ?   'Source file does not exist: ' + source :
         !sourceIsFile ?   'Source is not a file: ' + source :
         !target ?         'Must specify a target file.' :
         badTargetFolder ? 'Target folder cannot be written to: ' + targetFolder :
         null;
      if (errorMessage)
         throw Error('[esm-to-plain-js] ' + errorMessage);
      const esm = fs.readFileSync(source, 'utf-8');
      const normalizeEol =   /\r/g;
      const normalizeEof =   /\s*$(?!\n)/;
      const replaceImport = (stmt: string) => '// Ensure library is loaded => ' + stmt;
      const toGlobal =      (module: string) => `globalThis.${module} = ${module};`;
      const replaceExport = (stmt: string, modules: string) => modules.split(', ').map(toGlobal).join('\n');
      const importPattern = /^import .*/mg;           //example: import * as R from 'ramda';
      const exportPattern = /^export \{ (.*) \};$/m;  //example: export { webApp };
      const plainJs = esm
         .replace(normalizeEol, '')
         .replace(normalizeEof, '\n')
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

   };

export { esmToPlainJs };
