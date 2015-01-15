'use strict';

describe('Service: pdfOutputService', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var pdfOutputService;
  beforeEach(inject(function (_pdfOutputService_) {
    pdfOutputService = _pdfOutputService_;
  }));

  it('should do something', function () {
    expect(!!pdfOutputService).toBe(true);
  });

});
