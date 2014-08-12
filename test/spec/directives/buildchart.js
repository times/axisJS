'use strict';

describe('Directive: BuildChart', function () {

  // load the directive's module
  beforeEach(module('llamaChartsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-build-chart></-build-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the BuildChart directive');
  }));
});
