describe('Service: embedcodeOutput', function() {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var embedcodeOutput,
      scope,
      MainCtrl;

  beforeEach(inject(function(_embedcodeOutput_, $controller, $rootScope, $httpBackend) {
    embedcodeOutput = _embedcodeOutput_;
    scope = $rootScope.$new();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/configChooser.html').respond('');
    $httpBackend.expectGET('partials/outputModal.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/outputModal.html').respond('');

    MainCtrl = $controller('MainController', {
      $scope: scope,
      appConfig: {
        renderer: 'c3',
        input: 'csv',
        export: 'Embed code',
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {}
      }
    });
  }));

  // DISABLED @TODO move this to an E2E test.
  xit('should launch a modal window', function() {
    // var a = embedcodeOutput.export(scope);
    // var modal = angular.element('.modal');
    // console.log(modal);
    // expect(modal.length).toBe(1);
  });
});
