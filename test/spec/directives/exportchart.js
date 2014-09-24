'use strict';

describe('Directive: exportChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should create chart images if the "save" button is clicked', inject(function ($compile) {
    // Arrange
    element = angular.element('<a href="#" export-chart id="a-button">');
    element = $compile(element)(scope);

    // Act
    angular.element(element).trigger('click');

    // Assert
    expect(angular.element('canvas').length).toBe(1);
  }));
});
