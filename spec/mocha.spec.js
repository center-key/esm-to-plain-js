// esm-to-plain-js
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual, fileToLines } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import assert from 'assert';
import fs     from 'fs';

// Setup
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'esm-to-plain-js.d.ts',
         'esm-to-plain-js.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: esmToPlainJs.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has functions named transform() and reporter()', () => {
      const module = esmToPlainJs;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['reporter',  'function'],
         ['transform', 'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Calling esmToPlainJs.transform()', () => {
   const options = { cd: 'spec/fixtures' };
   esmToPlainJs.transform('source/web-app.esm.js', 'target/web-app.js', options);

   it('creates the correct target file', () => {
      const actual =   fs.readdirSync('spec/fixtures/target').sort();
      const expected = ['web-app.js'];
      assertDeepStrictEqual(actual, expected);
      });

   it('comments out the imports and swaps the export for globalThis', () => {
      const actual = fileToLines('spec/fixtures/target/web-app.js');
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

////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {
   const run = (posix) => cliArgvUtil.run(pkg, posix);

   it('comments out the imports and swaps the export for globalThis', () => {
      run('esm-to-plain-js --cd=spec/fixtures/source web-app.esm.js ../target/web-app.cli.js');
      const actual = fileToLines('spec/fixtures/target/web-app.cli.js');
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
