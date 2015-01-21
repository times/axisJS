'use strict';

describe('Service: embedcodeOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var embedcodeOutput,
      scope,
      MainCtrl;

  beforeEach(inject(function (_embedcodeOutput_, $controller, $rootScope, $httpBackend) {
    embedcodeOutput = _embedcodeOutput_;
    scope = $rootScope.$new();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/configChooser.html').respond('');

    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      appConfig: {
        framework: 'c3',
        input: 'csv',
        export: 'Embed code',
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {},
      }
    });
  }));

  it('should launch a modal window', function () {
    embedcodeOutput.export(scope);
    scope.$apply();
    var modal = angular.element('.modal');
    expect(modal.length).toBe(1);
  });
});
