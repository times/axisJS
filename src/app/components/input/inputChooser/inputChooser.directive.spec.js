/**
 * Spec for input chooser directive
 */
describe('Directive: inputChooser', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var scope,
      inputCtrl,
      main,
      element;

  describe('a single input method', function(){
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $controller, $compile, $httpBackend) {
      scope = $rootScope.$new();
      main = $controller('MainController as main', {
        $scope: scope,
        appConfig: {
          renderer: 'c3',
          input: 'csv',
          colors: [
            {value: 'blue'},
            {value: 'red'}
          ],
          defaults: {}
        }
      });

      inputCtrl = $controller('InputChooserController', {
        '$scope': scope
      });

      $httpBackend.expectGET('assets/i18n/en_GB.json');
      $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
      $httpBackend.expectGET('default.config.yaml');
      $httpBackend.whenGET('default.config.yaml').respond('');
      $httpBackend.expectGET('config.yaml');
      $httpBackend.whenGET('config.yaml').respond('input: "csv"');

      element = angular.element('<input-chooser config="{config: main.config, appConfig: main.appConfig, inputs: main.inputs, updateData: main.updateData, resetConfig: main.resetConfig, setInput: main.setInput}"></input-chooser>');
      element = $compile(element)(scope);
      scope.$apply();
    }));

    afterEach(function(){
      angular.element('body').empty();
    });

    it('should load the first input method if there\'s only one', function() {
      expect(element.html()).toMatch(/id="csvInput"/);
    });
  });

  describe('multiple input methods', function(){
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $controller, $compile, $httpBackend) {
      scope = $rootScope.$new();
      main = $controller('MainController as main', {
        $scope: scope,
        appConfig: {
          renderer: 'c3',
          input: ['csv', 'spreadsheet'],
          colors: [
            {value: 'blue'},
            {value: 'red'}
          ],
          defaults: {}
        }
      });

      inputCtrl = $controller('InputChooserController', {
        '$scope': scope
      });

      $httpBackend.expectGET('assets/i18n/en_GB.json');
      $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
      $httpBackend.expectGET('default.config.yaml');
      $httpBackend.whenGET('default.config.yaml').respond('');
      $httpBackend.expectGET('config.yaml');
      $httpBackend.whenGET('config.yaml').respond('input: "csv"');

      element = angular.element('<input-chooser config="{config: main.config, appConfig: main.appConfig, inputs: main.inputs, updateData: main.updateData, resetConfig: main.resetConfig, setInput: main.setInput}"></input-chooser>');
      element = $compile(element)(scope);
      scope.$apply();
    }));

    afterEach(function(){
      angular.element('body').empty();
    });

    it('should show buttons for each input method', function() {
      var buttons = element.find('button');

      expect(buttons.eq(0).text().trim()).toBe('csv');
      expect(buttons.eq(1).text().trim()).toBe('spreadsheet');
    });
  });
});
