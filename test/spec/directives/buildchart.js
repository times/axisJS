'use strict';

describe('Directive: BuildChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should instantiate C3 on the #chart element', inject(function ($compile) {
    var element = angular.element('<div id="chart" build-chart></div>');
    element = $compile(element)(scope);
    scope.$apply();

    setTimeout(function(){
      expect(element.children('svg')).toBeTruthy();
    }, 500);
  }));
});
