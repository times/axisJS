/**
 * @TODO write a better spec for genericInput
 */

describe('Service: genericInput', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var genericInput;
  beforeEach(inject(function (_genericInput_) {
   genericInput = _genericInput_;
  }));

  xit('should do something', function () {
   expect(!!genericInput).toBe(true);
  });
});