'use strict';

describe('Service: configProvider', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var configProvider;
  beforeEach(inject(function (_configProvider_) {
    configProvider = _configProvider_;
  }));

  it('should load the default config', inject(function ($httpBackend) {

    $httpBackend.whenGET('default.config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.whenGET('config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.flush();

    expect(configProvider.$$state.value.colors.length).toBe(2);

  }));

});
