// esm-to-plain-js
// Error Handling Specification Suite

// Imports
import assert from 'assert';

// Setup
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the "source" file parameter is missing', () => {
      const makeBogusCall = () => esmToPlainJs.transform();
      const exception =     { message: '[esm-to-plain-js] Must specify a source file.' };
      assert.throws(makeBogusCall, exception);
      });

   it('when the "target" file parameter is missing', () => {
      const source =        'spec/fixtures/web-app.esm.js';
      const makeBogusCall = () => esmToPlainJs.transform(source);
      const exception =     { message: '[esm-to-plain-js] Must specify a target file.' };
      assert.throws(makeBogusCall, exception);
      });

   });
