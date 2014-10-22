'use strict';
/*global waitsFor*/

describe('Service: configProvider', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var configProvider;
  beforeEach(inject(function (_configProvider_) {
    configProvider = _configProvider_;
  }));

  it('should load the default config', function () {

    var config;

    waitsFor(function(){
      configProvider.then(function(data){
        dumps(data);
        config = data;
      });

      return config;
    }, 5000);

  });

});
