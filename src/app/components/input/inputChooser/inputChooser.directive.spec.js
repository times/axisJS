describe('Directive: inputChooser', function () {
  'use strict';
  
  // load the directive's module
  beforeEach(module('axis'));

  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  afterEach(function(){
    angular.element('body').empty();
  });

  xit('should create a bunch of buttons for input methods', inject(function ($compile, $timeout,  $httpBackend) {
    $httpBackend.expectGET('assets/i18n/en_GB.json');
    $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
  }));
});
