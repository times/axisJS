describe('Directive: addColors', function () {
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

  it('should add data attributes to select options', inject(function ($compile, $timeout,  $httpBackend) {
    $httpBackend.expectGET('assets/i18n/en_GB.json');
    $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
    var element = angular.element('<select add-color-data-attributes id="a-select"><option value="0">#ffcc00</option></select>');
    element = $compile(element)(scope);
    angular.element('body').append(element);
    scope.$apply();
    $timeout.flush(500);
    expect(angular.element('select > option').eq(0).attr('data-color')).toBe('#ffcc00');
  }));
});
