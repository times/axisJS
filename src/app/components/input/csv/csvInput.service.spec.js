/**
 * @TODO write a better spec for csvInput
 */

describe('Service: csvInput', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var csvInput;
  beforeEach(inject(function (_csvInput_) {
   csvInput = _csvInput_;
  }));

  xit('should do something', function () {
   expect(!!csvInput).toBe(true);
  });
});