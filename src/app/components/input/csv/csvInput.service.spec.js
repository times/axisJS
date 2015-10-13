/**
 * Spec for the csvInput service.
 */

describe('Service: csvInput', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  var csvInput,
      result,
      MainCtrl,
      scope;

  // instantiate service
  beforeEach(inject(function (_csvInput_, $controller, $rootScope, $httpBackend) {
    csvInput = _csvInput_;
    $httpBackend.expectGET('assets/i18n/en_GB.json');
    $httpBackend.whenGET('assets/i18n/en_GB.json').respond('{}');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond({});
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond({});

    scope = $rootScope.$new();
    MainCtrl = $controller('MainController as main', {
      $scope: scope,
      appConfig: {
        renderer: 'c3',
        input: 'csv',
        save: [
          'png',
          'svg'
        ],
        export: [
          'Embed code'
        ],
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {},
      }
    });
  }));

  describe('basic functionality', function(){
    it('should have default data', function(){
      expect(csvInput.defaultData).toBeDefined();
    });

    it('should validate CSV', function(){
      result = csvInput.validate('llamas\tducks\n55\t9001');
      expect(result).toBeTruthy();
    });

    // This is a dumb test due to inputService.input passing full scopes around.
    // @TODO improve this test.
    it('should parse a CSV into an array of columns', function(){
      result = csvInput.input(scope.main);
      expect(result).toBeDefined();
    });

    it('should be able to convert an array of columns into a CSV string', function(){
      result = csvInput.convert([['llamas', 55], ['ducks', 9001]]);

      expect(result).toBe('llamas\tducks\r\n55\t9001'); // N.b., Papa Parse newline is \r\n
    });
  });

  describe('edge cases', function(){
    it('should throw a CsvInputServiceException if invalid data', function() {
      expect(function(){
        csvInput.input({inputs: {inputData: 'hurrrr'}});
      }).toThrow(); // This needs to be wrapped in an anonymous function to catch the exception.
    });

    it('should remove separator commas from numbers', function(){
      scope.main.inputs.inputData = 'llamas\r\n"9,001"';
      result = csvInput.input(scope.main);
      expect(result.config.data.columns[0][1]).toBe('9001');
    });

    it('should be able to validate CSVs with only one column', function(){
      scope.main.inputs.inputData = 'llamas\r\nducks';
      result = csvInput.input(scope.main);
      expect(result.config.data.columns[0][0]).toBe('llamas');
      expect(result.config.data.columns[0][1]).toBe('ducks');
    });
  });
});
