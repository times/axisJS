'use strict';

describe('Controller: HeadCtrl', function () {

  // load the controller's module
  beforeEach(function(){
    module('axisJSApp', function(configProviderProvider){
      configProviderProvider.setConfigFile('test/test.config.yaml');
    });
  });

  var HeadCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('stylesheet: "themes/default.css"');

    $httpBackend.expectGET('test/test.config.yaml');
    $httpBackend.whenGET('test/test.config.yaml').respond('stylesheet: "themes/test.css"\nfonts:\n    - "http://www.thetimes.co.uk/fonts/Solido-Bold.css"\n    - "http://www.thetimes.co.uk/fonts/Solido-ExtraBold.css"\n    - "http://www.thetimes.co.uk/fonts/Solido-Book-Italic.css"');

    HeadCtrl = $controller('HeadCtrl', {
      $scope: scope
    });
    scope.$digest();
    $httpBackend.flush();
  }));

  it('should attach a stylesheet from config', function () {
    expect(scope.stylesheet).toBe('themes/test.css');
  });

  it('should load an array of font URLs from config', function () {
    expect(scope.fonts.length).toBe(3);
  });
});
