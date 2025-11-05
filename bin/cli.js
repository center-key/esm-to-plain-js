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
//    $ node bin/cli.js --cd=spec fixtures/web-app.esm.js target/web-app.js

import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

esmToPlainJs.cli();
