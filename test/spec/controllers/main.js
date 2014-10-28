'use strict';

describe('Controller: MainCtrl -- WITHOUT external data', function () {

  // load the controller's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    $httpBackend.whenGET('default.config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.whenGET('config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.expectGET('config.yaml');

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    scope.$digest();
    $httpBackend.flush();
  }));

  it('should attach a list of config options to the scope', function() {
    expect(typeof scope.config).not.toBe('undefined');
  });

  it('should validate if the data is only one column', function() {
    var gaugeCSV = 'llamas\n70';
    expect(scope.validateCSV(gaugeCSV)).toBeTruthy();
  });

  it('should validate non-string-delimited TSV input with commas (#39)', function() {
    var wordyTSV = 'The PM should pay up	The PM should try to reduce the bill, but if unsuccessful, should still pay	The PM should try to reduce the bill, and refuse to pay if unsuccessful	Don\'t know\n9	25	54	12';
    expect(scope.validateCSV(wordyTSV)).toBeTruthy();
  });
});

describe('Controller: MainCtrl -- WITH external data', function() {

  // load the controller's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    var configObjectString = 'eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19';
    window.parent = {
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


    $httpBackend.whenGET('default.config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.whenGET('config.yaml').respond('colors:\n  - label: "neutral 1"\n    value: "#78B8DF"\n  - label: "neutral 2"\n    value: "#AFCBCE"');
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.expectGET('config.yaml');

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    scope.$digest();
    $httpBackend.flush();
  }));

  it('should populate the chart title if given config from WordPress', function() {
    expect(scope.config.chartTitle).toBe('testing', 'Config title not populating properly...');
  });

  it('should populate chartData if given config from WordPress', function(){
    expect(scope.chartData.length).toBe(6, 'Config data not populating properly...');
  });

  it('should populate columns if given config from WordPress', function(){
    expect(scope.columns.length).toBe(2, 'Config columns not populating properly...');
  });

});
