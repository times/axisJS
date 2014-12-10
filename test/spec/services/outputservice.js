'use strict';

// TODO write tests for OutputService

xdescribe('Service: outputService', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var outputService;
  beforeEach(inject(function (_outputService_) {
    outputService = _outputService_;
  }));

  it('should do something', function () {
    expect(!!outputService).toBe(true);
  });

});
