'use strict';

describe('Directive: exportChart', function () {

  // load the directive's module
  beforeEach(module('llamaChartsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<export-chart></export-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the exportChart directive');
  }));
});
