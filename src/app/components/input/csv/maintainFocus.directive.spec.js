describe('Directive: maintainFocus', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /**
   * N.b., the following test passes, but triggering keyCode 9 programmatically
   * doesn't seem to unfocus it. Better test needed.
   */

  it('should maintain focus when tab is pressed', inject(function ($compile) {
    element = angular.element('<textarea id="data-input" maintain-focus></textarea>');
    element = $compile(element)(scope);
    angular.element('body').append(element);
    angular.element('#data-input').focus(); // grant focus
    angular.element.event.trigger('keydown', {keyCode: 9}); // emulate pressing tab

    expect(document.activeElement).toBe(angular.element('#data-input')[0]);
  }));
});
