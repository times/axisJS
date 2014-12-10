'use strict';

// TODO write tests for chartProvider
describe('Service: chartProvider', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var chartProvider;
  beforeEach(inject(function (_chartProvider_) {
    chartProvider = _chartProvider_;
  }));

  it('should do something', function () {
    expect(!!chartProvider).toBe(true);
  });

});
