// Disabling until pngOutput service is populated.
xdescribe('Service: pngService', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var pngService;
  beforeEach(inject(function (_pngService_) {
    pngService = _pngService_;
  }));

  it('should do something', function () {
    expect(!!pngService).toBe(true);
  });

});