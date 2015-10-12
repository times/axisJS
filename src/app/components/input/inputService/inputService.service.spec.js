// @TODO fill out the pending specs.

describe('Service: inputService', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var inputService,
      instanceType;

  beforeEach(inject(function (_inputService_) {
    inputService = _inputService_;
    instanceType = Object.prototype.toString.call(inputService);
  }));

  it('should return an injected input service');
  it('should return the first input service if there are multiple listed');
});
