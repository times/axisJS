'use strict';

describe('Directive: addColors', function () {

  // load the directive's module
  beforeEach(module('axisJsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-colors></add-colors>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addColors directive');
  }));
});
