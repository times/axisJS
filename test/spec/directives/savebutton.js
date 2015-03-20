'use strict';

describe('Directive: saveButton', function () {

  // load the directive's module
  beforeEach(module('axisJsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<save-button></save-button>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the saveButton directive');
  }));
});
