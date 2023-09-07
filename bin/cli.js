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
//    $ npm install --save-dev esm-to-plain-js
//    $ npx esm-to-plain-js web-app.esm.js web-app.js
//
// Contributors to this project:
//    $ cd esm-to-plain-js
//    $ npm install
//    $ npm test
//    $ node bin/cli.js --cd=spec/fixtures source/web-app.esm.js target/web-app.js

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

// Parameters and flags
const validFlags = ['cd', 'note', 'quiet'];
const cli =        cliArgvUtil.parse(validFlags);
const source =     cli.params[0];
const target =     cli.params[1];

// Copy File
const error =
   cli.invalidFlag ?     cli.invalidFlagMsg :
   cli.paramsCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
   !source ?             'Missing source file.' :
   !target ?             'Missing target file.' :
   null;
if (error)
   throw Error('[esm-to-plain-js] ' + error);
const options = {
   cd: cli.flagMap.cd ?? null,
   };
const result = esmToPlainJs.transform(source, target, options);
if (!cli.flagOn.quiet)
   esmToPlainJs.reporter(result);
