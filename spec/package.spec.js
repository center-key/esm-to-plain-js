// esm-to-plain-js
// Package Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'node:fs';

// Setup
import { esmToPlainJs } from '../dist/esm-to-plain-js.js';

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
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const version =  esmToPlainJs.version;
      const semVer =   /\d+[.]\d+[.]\d+/;
      const actual =   { version: version, valid: semVer.test(version) };
      const expected = { version: version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is exported as an object', () => {
      const actual =   { type: typeof esmToPlainJs };
      const expected = { type: 'object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct properties', () => {
      const module = esmToPlainJs;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assertOk',  'function'],
         ['cli',       'function'],
         ['reporter',  'function'],
         ['transform', 'function'],
         ['version',   'string'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
