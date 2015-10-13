/**
 * This is a basic test suite for axisOutput. It would be good to decouple it from MainController
 * because there is some weird testing behaviour as a result.
 */

describe('Service: axisOutput', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('axis'));

  var MainCtrl,
  element,
  scope,
  body,
  c3,
  configObjectString,
  parent,
  spy,
  imported;


  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $window, $compile) {
    c3 = $window.c3;
    body = angular.element('body');
    body.empty(); // clean up previous tests
    body.append(angular.element('<canvas id="canvas"></canvas>'));
    body.append(angular.element('<div id="chart"></div>'));

    c3.generate({data: {columns: [['data1', 1, 2, 3], ['data2', 4, 5, 6]]}});

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

    configObjectString = 'eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19';

    element = angular.element('<save-button type="save" />');
    element = $compile(element)(scope);
    scope.$apply();

    body.append(element);
    angular.element('[export-chart="save"]').eq(0).trigger('click');

    parent = $window.parent = {};
    spy = jasmine.createSpy('postmessage');
    parent.postMessage = spy;
    parent.axisConfig = atob('eyJkYXRhIjp7IngiOiIiLCJ5IjoiIiwieTIiOiIiLCJjb2x1bW5zIjpbWyJkYXRhMSIsIjMwIiwiMjAwIiwiMTAwIiwiNDAwIiwiMTUwIiwiMjUwIl0sWyJkYXRhMiIsIjUwIiwiMjAiLCIxMCIsIjQwIiwiMTUiLCIyNSJdXSwiYXhlcyI6e30sImdyb3VwcyI6e30sInR5cGUiOiIiLCJ0eXBlcyI6eyJkYXRhMSI6ImxpbmUiLCJkYXRhMiI6ImxpbmUifSwiY29sb3JzIjp7ImRhdGExIjoiIzc4QjhERiIsImRhdGEyIjoiI0FGQ0JDRSJ9fSwiYXhpcyI6eyJ4Ijp7InNob3ciOnRydWUsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX0sInkiOnsic2hvdyI6dHJ1ZSwiYWNjdXJhY3kiOjAsInByZWZpeCI6IiIsInN1ZmZpeCI6IiIsInRpY2siOnt9fSwieTIiOnsic2hvdyI6ZmFsc2UsImFjY3VyYWN5IjowLCJwcmVmaXgiOiIiLCJzdWZmaXgiOiIiLCJ0aWNrIjp7fX19LCJwb2ludCI6eyJzaG93IjpmYWxzZX0sImdyb3VwcyI6e30sImRlZmF1bHRDb2xvcnMiOlsiIzFmNzdiNCIsIiNhZWM3ZTgiLCIjZmY3ZjBlIiwiI2ZmYmI3OCIsIiMyY2EwMmMiLCIjOThkZjhhIiwiI2Q2MjcyOCIsIiNmZjk4OTYiLCIjOTQ2N2JkIiwiI2M1YjBkNSIsIiM4YzU2NGIiLCIjYzQ5Yzk0IiwiI2UzNzdjMiIsIiNmN2I2ZDIiLCIjN2Y3ZjdmIiwiI2M3YzdjNyIsIiNiY2JkMjIiLCIjZGJkYjhkIiwiIzE3YmVjZiIsIiM5ZWRhZTUiXSwiY2hhcnRUaXRsZSI6InRlc3RpbmciLCJjaGFydENyZWRpdCI6IiIsImNoYXJ0U291cmNlIjoiIiwiY2hhcnRXaWR0aCI6MTAwMCwiY2hhcnRHbG9iYWxUeXBlIjoic2VyaWVzIiwiY2hhcnRBY2N1cmFjeSI6MSwiY21zIjpmYWxzZSwicGllIjp7ImxhYmVsIjp7fX0sImRvbnV0Ijp7ImxhYmVsIjp7fX0sImdhdWdlIjp7ImxhYmVsIjp7fX19');
  }));


  it('should return an object with config, base64 PNG and title on preprocess()', inject(function(axisOutput){
    var preprocessed = axisOutput.preprocess(scope);
    expect(typeof preprocessed.config).toBe('string');
    expect(preprocessed.png.indexOf('data:image/png;base64,')).toBe(0);
    expect(preprocessed.title).toBeUndefined();
  }));


  it('should push a postMessage to parent iframe on process()', inject(function(axisOutput){
    axisOutput.process({});
    expect(spy).toHaveBeenCalled();
  }));

  it('should run preprocess, process and complete on axisOutput.export()', inject(function(axisOutput){
    spyOn(axisOutput, 'preprocess');
    spyOn(axisOutput, 'process');
    spyOn(axisOutput, 'complete');
    axisOutput.export(scope);

    expect(axisOutput.preprocess).toHaveBeenCalled();
    expect(axisOutput.process).toHaveBeenCalled();
    expect(axisOutput.complete).toHaveBeenCalled();
  }));

  it('should return an object with config and input data on axisOutput.import()', inject(function(axisOutput, inputService){
    var input = inputService(scope.main.appConfig);
    imported = axisOutput.import(input);
    expect(imported.inputData.split('\t').length).toBe(8);
  }));
});
