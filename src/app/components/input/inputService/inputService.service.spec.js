// TODO write tests for inputService. I'm not really sure how, TBH...

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

  xit('should do something', function () {
    expect(!!inputService).toBe(true);
  });

});