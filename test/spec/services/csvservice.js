'use strict';

// TODO write tests for csvService

xdescribe('Service: csvService', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var csvService;
  beforeEach(inject(function (_csvService_) {
    csvService = _csvService_;
  }));

  it('should do something', function () {
    expect(!!csvService).toBe(true);
  });

});
