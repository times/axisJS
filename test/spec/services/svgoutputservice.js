'use strict';
// Disabled until svgOutput service is populated.
xdescribe('Service: svgOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var svgOutput;
  beforeEach(inject(function (_svgOutput_) {
    svgOutput = _svgOutput_;
  }));

  it('should do something', function () {
    expect(!!svgOutput).toBe(true);
  });

});
