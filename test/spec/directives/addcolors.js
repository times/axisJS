'use strict';

describe('Directive: addColors', function () {

  // load the controller's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    $httpBackend.whenGET('default.config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.whenGET('config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.expectGET('config.yaml');

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    scope.$digest();
    $httpBackend.flush();
  }));

  afterEach(function(){
    angular.element('body').empty();
  });

  it('should add data attributes to select options', inject(function ($compile, $timeout) {
    var element = angular.element('<select add-colors id="a-select"><option value="0">#ffcc00</option></select>');
    element = $compile(element)(scope);
    angular.element('body').append(element);
    scope.$apply();
    $timeout.flush(500);

    expect(angular.element('select > option').eq(0).attr('data-color')).toBe('#ffcc00');
  }));
});
