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

  it('should validate() as true if any value given');
  it('should validate() as false if no value given');
  it('should return the scope object on input()');
  it('should return the scope object on convert()');
});
