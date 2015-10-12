(function() {
  'use strict';

  describe('Controller: MainController -- WITHOUT external data', function () {

    // load the controller's module
    beforeEach(
      module('axis')
    );

    var MainController,
        scope,
        configChooser;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
      scope = $rootScope.$new();
      MainController = $controller('MainController as main', {
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

      configChooser = $injector.get('configChooser');
    }));

    it('should attach a list of config options to the scope', function() {
      expect(typeof scope.main.config).not.toBe('undefined');
    });

    it('should validate if the data is only one column', function() {
      var gaugeCSV = 'llamas\n70';
      expect(scope.main.validateData(gaugeCSV)).toBeTruthy();
    });

    it('should validate non-string-delimited TSV input with commas (#39)', function() {
      var wordyTSV = 'The PM should pay up	The PM should try to reduce the bill, but if unsuccessful, should still pay	The PM should try to reduce the bill, and refuse to pay if unsuccessful	Don\'t know\n9	25	54	12';
      expect(scope.main.validateData(wordyTSV)).toBeTruthy();
    });

    it('should also still validate CSV (#39)', function() {
      var wordyCSV = '"The PM should pay up","The PM should try to reduce the bill, but if unsuccessful, should still pay","The PM should try to reduce the bill, and refuse to pay if unsuccessful","Don\'t know"\n9,25,54,12';
      expect(scope.main.validateData(wordyCSV)).toBeTruthy();
    });

    it('should be able to reset config to standard');
    it('should be able to set the global chart type');
    it('should be able to set data groups for stacked charts');
    it('should be able to set the input service');
    it('should be able to detect if a chart type uses areas');
  });

  describe('Controller: MainController -- WITH external data', function() {

    // load the controller's module
    beforeEach(module('axis'));

    var MainController,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $window) {
      var configObjectString = 'eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19';
      $window.parent = {
        tinymce: {
          activeEditor: {
            windowManager: {
              getParams: function() {
                return {
                  axisJS: configObjectString
                };
              }
            }
          }
        }
      };

      scope = $rootScope.$new();
      MainController = $controller('MainController as main', {
        $scope: scope,
        appConfig: {
          renderer: 'c3',
          input: 'csv',
          export: [
            'wordpress'
          ],
          colors: [
            {value: 'blue'},
            {value: 'red'}
          ],
          defaults: {},
        }
      });
    }));

    it('should populate the chart title if given config from WordPress', function() {
      expect(scope.main.config.chartTitle).toBe('testing', 'Config title not populating properly...');
    });

    it('should populate chartData if given config from WordPress', function(){
      expect(scope.main.chartData.length).toBe(6, 'Config data not populating properly...');
    });

    it('should populate columns if given config from WordPress', function(){
      expect(scope.main.columns.length).toBe(2, 'Config columns not populating properly...');
    });

  });
})();
