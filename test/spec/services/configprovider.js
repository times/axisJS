'use strict';

describe('Service: configProvider', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var configProvider;
  beforeEach(inject(function (_configProvider_) {
    configProvider = _configProvider_;
  }));

  it('should do something', function () {
    expect(!!configProvider).toBe(true);
  });

});
