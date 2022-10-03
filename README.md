# esm-to-plain-js
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Simplistic string substitution to replace export with a globalThis assignment (CLI tool designed for use in npm scripts)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/esm-to-plain-js/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/esm-to-plain-js.svg)](https://www.npmjs.com/package/esm-to-plain-js)
[![Vulnerabilities](https://snyk.io/test/github/center-key/esm-to-plain-js/badge.svg)](https://snyk.io/test/github/center-key/esm-to-plain-js)
[![Build](https://github.com/center-key/esm-to-plain-js/workflows/build/badge.svg)](https://github.com/center-key/esm-to-plain-js/actions/workflows/run-spec-on-push.yaml)

**esm-to-plain-js** transforms an ES modules file into a plain JavaScript file for browsers by commenting out the imports and replacing the export statement wth globalThis assignments.
The command's console output includes a timestamp and formatting helpful in build systems.

## A) Setup
Install package for node:
```shell
$ npm install --save-dev esm-to-plain-js
```

## B) Usage
### 1. npm scripts
Run `esm-to-plain-js` from the `"scripts"` section of your **package.json** file.

The **first** parameter is the *source* file.
The **second** parameter is the *target* file or folder (use the `--folder` flag).

Example **package.json** script:
```json
   "scripts": {
      "make-plain-js": "esm-to-plain-js --cd=build web-app.esm.js web-app.js"
   },
```
Try out the first script with the command: `make-plain-js`

### 2. Global
You can install **esm-to-plain-js** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global esm-to-plain-js
$ esm-to-plain-js web-app.esm.js web-app.js
```

### 3. CLI Flags
Command-line flags:
| Flag      | Description                                    | Values     |
| --------- | ---------------------------------------------- | ---------- |
| `--cd`    | Change working directory before starting copy. | **string** |
| `--quiet` | Suppress informational messages.               | N/A        |

Examples:
   - `esm-to-plain-js --cd=build web-app.esm.js web-app.js` &nbsp; Transforms **build/web-app.esm.js** to **build/web-app.js**
   - `esm-to-plain-js web-app.esm.js web-app.js --quite`    &nbsp; Displays no output.

## C) Application Code
Even though **esm-to-plain-js** is primarily intended for build scripts, the package can easily be used in ESM and TypeScript projects.

Example:
``` typescript
import { esmToPlainJs } from 'esm-to-plain-js';
const result = esmToPlainJs.transform('build/web-app.esm.js', 'build/web-app.js');
console.log('Execution time:', result.duration, 'ms');
```

See the **TypeScript Declarations** at the top of [esm-to-plain-js.ts](esm-to-plain-js.ts) for documentation.

<br>

---
[MIT License](LICENSE.txt)
