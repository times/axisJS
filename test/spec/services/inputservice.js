'use strict';

// TODO write testes for inputService

xdescribe('Service: inputService', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var inputService;
  beforeEach(inject(function (_inputService_) {
    inputService = _inputService_;
  }));

  it('should do something', function () {
    expect(!!inputService).toBe(true);
  });

});
