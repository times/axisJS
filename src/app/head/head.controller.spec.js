(function(){
  'use strict';

  describe('Controller: HeadController', function () {

    // load the controller's module
    beforeEach(function(){
      // This test suite doesn't seem to be actually loading test.config.yaml.
      // TODO make this test suite more robust.
      var store = {
        'theme': 'test'
      };

      spyOn(localStorage, 'getItem').andCallFake(function (key) {
        return store[key];
      });
      spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
        return store[key] = value + '';
      });
      spyOn(localStorage, 'clear').andCallFake(function () {
          store = {};
      });
      
      module('axis');
    });

    var HeadController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      $httpBackend.expectGET('default.config.yaml');
      $httpBackend.whenGET('default.config.yaml').respond('stylesheet: "themes/default.css"');

      $httpBackend.expectGET('config.yaml');
      $httpBackend.whenGET('config.yaml').respond('stylesheet: "themes/test.css"\nfonts:\n    - "http://www.thetimes.co.uk/fonts/Solido-Bold.css"\n    - "http://www.thetimes.co.uk/fonts/Solido-ExtraBold.css"\n    - "http://www.thetimes.co.uk/fonts/Solido-Book-Italic.css"');

      HeadController = $controller('HeadController', {
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
})();