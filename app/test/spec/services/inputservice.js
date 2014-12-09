'use strict';

describe('Service: inputservice', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var inputservice;
  beforeEach(inject(function (_inputservice_) {
    inputservice = _inputservice_;
  }));

  it('should do something', function () {
    expect(!!inputservice).toBe(true);
  });

});
