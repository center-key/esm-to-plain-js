#!/usr/bin/env node
/////////////////////
// esm-to-plain-js //
// MIT License     //
/////////////////////

// Usage in package.json:
//    "scripts": {
//       "make-plain-js": "esm-to-plain-js --cd=build web-app.esm.js web-app.js"
//    },
//
// Usage from command line:
//    $ npm install --global esm-to-plain-js
//    $ esm-to-plain-js web-app.esm.js web-app.js
//
// Contributors to this project:
//    $ cd esm-to-plain-js
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures source/web-app.esm.js target/web-app.js

// Imports
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';
import chalk from 'chalk';
import log   from 'fancy-log';

// Parameters
const validFlags =  ['cd', 'quiet'];
const args =        process.argv.slice(2);
const flags =       args.filter(arg => /^--/.test(arg));
const flagMap =     Object.fromEntries(flags.map(flag => flag.replace(/^--/, '').split('=')));
const invalidFlag = Object.keys(flagMap).find(key => !validFlags.includes(key));
const params =      args.filter(arg => !/^--/.test(arg));

// Data
const source = params[0];
const target = params[1];
const mode =   { quiet: 'quiet' in flagMap };

// Reporting
const printReport = (result) => {
   const name =   chalk.gray('esm-to-plain-js');
   const origin = chalk.blue.bold(result.origin);
   const dest =   chalk.magenta(result.dest);
   const arrow =  chalk.gray.bold(' ⟹  ');  //extra space for alignment
   const info =   chalk.white(`(${result.duration}ms)`);
   log(name, origin, arrow, dest, info);
   };

// Copy File
const error =
   invalidFlag ?       'Invalid flag: ' + invalidFlag :
   params.length > 2 ? 'Extraneous parameter: ' + params[2] :
   !source ?           'Missing source file.' :
   !target ?           'Missing target file.' :
   null;
if (error)
   throw Error('[esm-to-plain-js] ' + error);
const options = {
   cd: flagMap.cd ?? null,
   };
const result = esmToPlainJs.transform(source, target, options);
if (!mode.quiet)
   printReport(result);
