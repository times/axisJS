describe('Directive: maintainFocus', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<textarea id="data-input" maintain-focus></textarea>');
    element = $compile(element)(scope);
    angular.element('body').append(element);
    angular.element('#data-input').focus(); // grant focus
    angular.element.event.trigger('keydown', {keyCode: 9}); // emulate pressing tab
  }));

  /**
   * N.b., the following test passes, but triggering keyCode 9 programmatically
   * doesn't seem to unfocus it. Better test needed.
   */

  it('should maintain focus when tab is pressed', function() {
    expect(document.activeElement).toBe(angular.element('#data-input')[0]);
  });

  it('should output a tab character when tab is pressed');

  it('should move the caret one character forward after tab is pressed');
});
