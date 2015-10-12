// @TODO fill out the pending specs.

describe('Directive: spreadsheetInput', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // scope = $rootScope.$new();
    // element = angular.element('<textarea id="data-input" maintain-focus></textarea>');
    // element = $compile(element)(scope);
    // angular.element('body').append(element);
    // angular.element('#data-input').focus(); // grant focus
    // angular.element.event.trigger('keydown', {keyCode: 9}); // emulate pressing tab
  }));

  it('should attach the input provider from main controller');
  it('should clear HandsOnTable before adding data if data is pasted');
});
