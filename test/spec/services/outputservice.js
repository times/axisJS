'use strict';

describe('Service: outputProvider', function () {

  // load the service's module
  beforeEach(module('axisJsApp'));

  // instantiate service
  var outputProvider;
  beforeEach(inject(function (_outputProvider_) {
    outputProvider = _outputProvider_;
  }));

  it('should do something', function () {
    expect(!!outputProvider).toBe(true);
  });

});
