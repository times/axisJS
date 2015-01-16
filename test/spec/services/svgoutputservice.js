'use strict';

describe('Service: svgOutputService', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var svgOutputService;
  beforeEach(inject(function (_svgOutputService_) {
    svgOutputService = _svgOutputService_;
  }));

  it('should do something', function () {
    expect(!!svgOutputService).toBe(true);
  });

});
