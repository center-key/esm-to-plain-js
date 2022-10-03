// esm-to-plain-js
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import assert from 'assert';
import fs from 'fs';
import slash from 'slash';

// Setup
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

// Utilities
const readFolder = (folder) => fs.readdirSync(folder).map(file => slash(file)).sort();

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = readFolder('dist');
      const expected = [
         'esm-to-plain-js.d.ts',
         'esm-to-plain-js.js',
         'esm-to-plain-js.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: esmToPlainJs.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has a transform() function', () => {
      const actual =   { validate: typeof esmToPlainJs.transform };
      const expected = { validate: 'function' };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Calling esmToPlainJs.transform()', () => {
   const options = { cd: 'spec/fixtures' };
   esmToPlainJs.transform('source/web-app.esm.js', 'target/web-app.js', options);

   it('creates the correct target file', () => {
      const actual =   readFolder('spec/fixtures/target');
      const expected = ['web-app.js'];
      assertDeepStrictEqual(actual, expected);
      });

   it('comments out the imports and swaps the export for globalThis', () => {
      const actual =   fs.readFileSync('spec/fixtures/target/web-app.js', 'utf-8').split('\n');
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
         '',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" file parameter is missing', () => {
      const makeBogusCall = () => esmToPlainJs.transform();
      const exception =     { message: '[esm-to-plain-js] Must specify a source file.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" file parameter is missing', () => {
      const source = 'spec/fixtures/source/web-app.esm.js';
      const makeBogusCall = () => esmToPlainJs.transform(source);
      const exception =     { message: '[esm-to-plain-js] Must specify a target file.' };
      assert.throws(makeBogusCall, exception);
      });

   });
