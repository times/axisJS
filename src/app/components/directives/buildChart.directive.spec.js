'use strict';

/**
 * N.b., the tests in this spec are a TOTAL mess.
 * Mainly because the buildChart directive itself is a total mess.
 *
 * Please, if you want some project credit, FIX THIS MESS.
 * #messymessmessmess
 */

describe('Directive: BuildChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    $httpBackend.expectGET('default.config.yaml');
    $httpBackend.whenGET('default.config.yaml').respond('');
    $httpBackend.expectGET('config.yaml');
    $httpBackend.whenGET('config.yaml').respond('');
    $httpBackend.expectGET('partials/configChooser.html');
    $httpBackend.whenGET('partials/configChooser.html').respond(''); // due to angular-off-canvas
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      appConfig: {
        framework: 'c3',
        input: 'csv',
        colors: [
          {value: 'blue'},
          {value: 'red'}
        ],
        defaults: {},
      }
    });
    scope.$digest();
  }));

  it('should instantiate C3 on the #chart element', inject(function ($compile) {
    // Arrange
    var element = angular.element('<div id="chart" build-chart></div>');

    // Act
    element = $compile(element)(scope);
    angular.element('body').append(element);
    scope.$apply();

    // Assert
    expect(angular.element('#chart').children('svg')).toBeTruthy();
  }));

  describe('a spec with tests intended to prevent regression on closed issues', function() {
    var element;

    beforeEach(inject(function ($compile) {

      // Arrange
      element = angular.element('<div id="chart" build-chart></div>');
      var configJSON = '{"data":{"x":"","y":"","y2":"","columns":[["dogs","10","20","40","60"],["bears","10","15","20","25"],["llamas","15","40","70","80"],["ducks","20","10","30","70"],["cows","30","20","10","60"],["sheep","40","25","35","50"],["orangutans","20","30","10","40"]],"axes":{},"groups":{},"type":"","types":{"data1":"line","data2":"line","dogs":"line","bears":"step","llamas":"area","ducks":"area-step","cows":"scatter","sheep":"bar","orangutans":"spline"},"colors":{"data1":"#78B8DF","data2":"#AFCBCE","dogs":"#1f77b4","bears":"#ff7f0e","llamas":"#2ca02c","ducks":"#d62728","cows":"#9467bd","sheep":"#8c564b","orangutans":"#e377c2"}},"axis":{"x":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y2":{"show":false,"accuracy":0,"prefix":"","suffix":"","tick":{}}},"point":{"show":false},"groups":{},"defaultColors":["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],"chartTitle":"","chartCredit":"","chartSource":"","chartWidth":1000,"chartGlobalType":"series","chartAccuracy":1,"cms":false,"pie":{"label":{}},"donut":{"label":{}},"gauge":{"label":{}}}';
      scope.config = angular.fromJson(configJSON);

      // Act
      element = $compile(element)(scope);
      scope.$digest();
    }));

    afterEach(function(){
      angular.element('body').empty();
    });

    it('should hide the legend when config.legend.show is false', function () {
      // Arrange
      scope.config.legend = {show: false};

      // Act
      scope.$digest();

      // Assert
      expect(angular.element('#chart > svg > g').eq(2).css('visibility')).toBe('hidden'); // Updated — C3 0.4.9 removes all legend elements if hidden.
    });

    // Disabled because I can't get Jasmine to populate the DOM with the main.html view.
    xit('should update the colour pickers when data is added (#30)', function () {
      function hexToRgb(hex) {
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? 'rgb(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' +  parseInt(result[3], 16) + ')' : null;
      }

      var selectorButtonColor = angular.element('label:contains("dogs")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.dogs));

      selectorButtonColor = angular.element('label:contains("bears")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.bears));

      selectorButtonColor = angular.element('label:contains("llamas")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.llamas));

      selectorButtonColor = angular.element('label:contains("ducks")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.ducks));

      selectorButtonColor = angular.element('label:contains("cows")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.cows));

      selectorButtonColor = angular.element('label:contains("sheep")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.sheep));

      selectorButtonColor = angular.element('label:contains("orangutans")').siblings().find('.dropdown-colorselector .btn-colorselector').eq(0).css('background-color');
      expect(selectorButtonColor).toBe(hexToRgb(scope.config.data.colors.orangutans));
    });
  });
});
