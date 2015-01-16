'use strict';

describe('Service: embedcodeOutput', function () {

  // load the service's module
  beforeEach(module('axisJSApp'));

  // instantiate service
  var embedOutput,
      scope,
      MainCtrl;

  beforeEach(inject(function (_embedOutput_, $controller, $rootScope, $httpBackend) {
    embedOutput = _embedOutput_;
    scope = $rootScope.$new();
    $httpBackend.expectGET('partials/configChooser.html'); // due to angular-off-canvas.
    $httpBackend.whenGET('partials/configChooser.html').respond('');

    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      appConfig: {
        framework: 'c3',
        colors: [
        {value: 'blue'},
        {value: 'red'}
        ],
        defaults: {},
      }
    });
  }));

  it('should launch a modal window', function () {
    embedOutput.export(scope);
    scope.$apply();
    var modal = angular.element('.modal');
    expect(modal.length).toBe(1);
  });
});
