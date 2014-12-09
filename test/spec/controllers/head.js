'use strict';

describe('Controller: HeadCtrl', function () {

  // load the controller's module
  beforeEach(function(){
    module('axisJSApp', function(){})
    .config(function(configProviderProvider){ // "Natascha! Launch the anti-anti-missile-missile-missile!"
      configProviderProvider.setConfigFile('test/test.config.yaml');
    });
  });

  var HeadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (configProvider, $controller, $rootScope) {
    scope = $rootScope.$new();
    HeadCtrl = $controller('HeadCtrl', {
      $scope: scope,
      configProvider: configProvider
    });
  }));

  it('should attach a stylesheet from ', function () {
    expect(scope.stylesheet).toBe('themes/test.css');
    expect(scope.fonts.length).toBe(3);
  });
});
