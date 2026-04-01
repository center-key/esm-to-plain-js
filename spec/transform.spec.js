// esm-to-plain-js
// Function transform() Specification Suite

// Imports
import { assertDeepStrictEqual, fileToLines } from 'assert-deep-strict-equal';
import fs from 'node:fs';

// Setup
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

////////////////////////////////////////////////////////////////////////////////
describe('Calling esmToPlainJs.transform()', () => {
   const options = { cd: 'spec' };
   esmToPlainJs.transform('fixtures/web-app.esm.js', 'target/transform/web-app.js', options);

   it('creates the correct target file', () => {
      const actual =   fs.readdirSync('spec/target/transform').sort();
      const expected = ['web-app.js'];
      assertDeepStrictEqual(actual, expected);
      });

   it('comments out the imports and swaps the export for globalThis', () => {
      const actual = fileToLines('spec/target/transform/web-app.js');
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
