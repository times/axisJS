'use strict';

describe('Service: axismakerOutput', function () {

  // load the service's module
  beforeEach(module('axisJSapp'));

  // instantiate service
  var axismakerOutput;
  beforeEach(inject(function (_axismakerOutput_) {
    axismakerOutput = _axismakerOutput_;
  }));

  it('should do something', function () {
    expect(!!axismakerOutput).toBe(true);
  });

});
