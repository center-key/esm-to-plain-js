# esm-to-plain-js
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Simplistic string substitution to replace export with a globalThis assignment (CLI tool designed for use in npm scripts)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/esm-to-plain-js/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/esm-to-plain-js.svg)](https://www.npmjs.com/package/esm-to-plain-js)
[![Vulnerabilities](https://snyk.io/test/github/center-key/esm-to-plain-js/badge.svg)](https://snyk.io/test/github/center-key/esm-to-plain-js)
[![Build](https://github.com/center-key/esm-to-plain-js/workflows/build/badge.svg)](https://github.com/center-key/esm-to-plain-js/actions/workflows/run-spec-on-push.yaml)

**esm-to-plain-js** transforms an ES modules file into a plain JavaScript file for browsers by commenting out the imports and replacing the export statement wth globalThis assignments.&nbsp;
The command's console output includes a timestamp and formatting helpful in build systems.

## A) Setup
Install package for node:
```shell
$ npm install --save-dev esm-to-plain-js
```

## B) Usage
### 1. npm scripts
Run `esm-to-plain-js` from the `"scripts"` section of your **package.json** file.

Parameters:
* The **first** parameter is the *source* file.
* The **second** parameter is the *target* file or folder (use the `--folder` flag).

Example **package.json** script:
```json
   "scripts": {
      "make-plain-js": "esm-to-plain-js --cd=build web-app.esm.js web-app.js"
   },
```

### 2. Global
You can install **esm-to-plain-js** globally and then run it anywhere directly from the terminal.

Example terminal commands:
```shell
$ npm install --global esm-to-plain-js
$ esm-to-plain-js web-app.esm.js web-app.js
```

### 3. CLI flags
Command-line flags:
| Flag      | Description                                    | Values     |
| --------- | ---------------------------------------------- | ---------- |
| `--cd`    | Change working directory before starting copy. | **string** |
| `--note`  | Place to add a comment only for humans.        | **string** |
| `--quiet` | Suppress informational messages.               | N/A        |

Examples:
   - `esm-to-plain-js --cd=build web-app.esm.js web-app.js`<br>
   Transforms **build/web-app.esm.js** to **build/web-app.js**

   - `esm-to-plain-js web-app.esm.js web-app.js --quiet`<br>
   Displays no output.

## C) Application Code
Even though **esm-to-plain-js** is primarily intended for build scripts, the package can easily be used programmatically in ESM and TypeScript projects.

Example:
``` typescript
import { esmToPlainJs } from 'esm-to-plain-js';

const result = esmToPlainJs.transform('build/web-app.esm.js', 'build/web-app.js');
console.log('Execution time:', result.duration, 'ms');
```

See the **TypeScript Declarations** at the top of [esm-to-plain-js.ts](esm-to-plain-js.ts) for documentation.

<br>

---
**CLI Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [copy-file-util](https://github.com/center-key/copy-file-util):&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [copy-folder-util](https://github.com/center-key/copy-folder-util):&nbsp; _Recursively copy files from one folder to another folder_
   - 🔍 [replacer-util](https://github.com/center-key/replacer-util):&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [run-scripts-util](https://github.com/center-key/run-scripts-util):&nbsp; _Organize npm scripts into named groups of easy to manage commands_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

[MIT License](LICENSE.txt)
