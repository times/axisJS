// @TODO write a saveButton test spec.

describe('Directive: saveButton', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should show an export button if type attribute is "export"');
  it('should show a save button if type attribute is not "export"');
});
