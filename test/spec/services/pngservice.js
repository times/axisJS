'use strict';

describe('Service: pngService', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var pngService;
  beforeEach(inject(function (_pngService_) {
    pngService = _pngService_;
  }));

  it('should do something', function () {
    expect(!!pngService).toBe(true);
  });

});
