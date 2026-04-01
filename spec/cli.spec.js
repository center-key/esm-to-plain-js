// esm-to-plain-js
// CLI Specification Suite

// Imports
import { assertDeepStrictEqual, fileToLines } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import fs from 'node:fs';

// Setup
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const run = (posix) => cliArgvUtil.run(pkg, posix);

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {

   it('comments out the imports and swaps the export for globalThis', () => {
      run('esm-to-plain-js --cd=spec/fixtures web-app.esm.js ../target/cli/web-app.cli.js');
      const actual = fileToLines('spec/target/cli/web-app.cli.js');
      const expected = [
         '// Ensure library is loaded => import * as R from \'ramda\';',
         'const webApp = {',
         '   luckyNumbers: [3, 7, 21, 777],',
         '   setup() {',
         '      const elem = globalThis.document.getElementById(\'lucky-num\');',
         '      elem.innerText = R.last(webApp.luckyNumbers);',
         '      },',
         '   };',
         'globalThis.webApp = webApp;',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
