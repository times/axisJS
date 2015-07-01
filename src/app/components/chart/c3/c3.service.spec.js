describe('Service: c3Service', function () {
  'use strict';

  // load the service's module
  beforeEach(module('axis'));

  // instantiate service
  var c3Service,
      scope,
      element,
      appConfig = {
        framework: 'c3',
        colors: [
        'red',
        'blue'
        ],
        defaults: {
          'grid x': true,
          'grid y': true
        }
      };

  beforeEach(inject(function ($rootScope, _c3Service_) {
    scope = $rootScope.$new();
    c3Service = _c3Service_;

    element = angular.element('<div id="chart"></div>');
    angular.element('body').append(element);
    var configJSON = '{"data":{"x":"","y":"","y2":"","columns":[["dogs","10","20","40","60"],["bears","10","15","20","25"],["llamas","15","40","70","80"],["ducks","20","10","30","70"],["cows","30","20","10","60"],["sheep","40","25","35","50"],["orangutans","20","30","10","40"]],"axes":{},"groups":{},"type":"","types":{"data1":"line","data2":"line","dogs":"line","bears":"step","llamas":"area","ducks":"area-step","cows":"scatter","sheep":"bar","orangutans":"spline"},"colors":{"data1":"#78B8DF","data2":"#AFCBCE","dogs":"#1f77b4","bears":"#ff7f0e","llamas":"#2ca02c","ducks":"#d62728","cows":"#9467bd","sheep":"#8c564b","orangutans":"#e377c2"}},"axis":{"x":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y2":{"show":false,"accuracy":0,"prefix":"","suffix":"","tick":{}}},"point":{"show":false},"groups":{},"defaultColors":["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],"chartTitle":"","chartCredit":"","chartSource":"","chartWidth":1000,"chartGlobalType":"series","chartAccuracy":1,"cms":false,"pie":{"label":{}},"donut":{"label":{}},"gauge":{"label":{}}}';
    scope.config = angular.fromJson(configJSON);
    angular.element('body').empty();
  }));

  it('should produce a C3 chart', function () {
    var chart = c3Service.generate('chart', scope.config);
    expect(chart.data()[0].id).toBe('dogs');
    expect(angular.element('svg')).toBeTruthy();
  });

  it('should generate a config object', function() {
    expect(c3Service.getConfig(appConfig)).toBeTruthy();
  });

  // TODO flesh out these tests
  xdescribe('a spec with chart-specific tests', function() {
    xit('should be able to render a series chart', inject(function ($compile) {
      // Arrange
      var element = angular.element('<div id="chart" build-chart></div>');
      var configJSON = '{"data":{"x":"","y":"","y2":"","columns":[["dogs","10","20","40","60"],["bears","10","15","20","25"],["llamas","15","40","70","80"],["ducks","20","10","30","70"],["cows","30","20","10","60"],["sheep","40","25","35","50"],["orangutans","20","30","10","40"]],"axes":{},"groups":{},"type":"","types":{"data1":"line","data2":"line","dogs":"line","bears":"step","llamas":"area","ducks":"area-step","cows":"scatter","sheep":"bar","orangutans":"spline"},"colors":{"data1":"#78B8DF","data2":"#AFCBCE","dogs":"#1f77b4","bears":"#ff7f0e","llamas":"#2ca02c","ducks":"#d62728","cows":"#9467bd","sheep":"#8c564b","orangutans":"#e377c2"}},"axis":{"x":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y2":{"show":false,"accuracy":0,"prefix":"","suffix":"","tick":{}}},"point":{"show":false},"groups":{},"defaultColors":["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],"chartTitle":"","chartCredit":"","chartSource":"","chartWidth":1000,"chartGlobalType":"series","chartAccuracy":1,"cms":false,"pie":{"label":{}},"donut":{"label":{}},"gauge":{"label":{}}}';
      scope.config = angular.fromJson(configJSON);

      // Act
      element = $compile(element)(scope);
      scope.$apply();

      // Assert
      // TODO
    }));

    xit('should be able to render a pie chart', inject(function () {
      // Arrange
      // TODO

      // Act
      // TODO

      // Assert
      // TODO
    }));

    xit('should be able to render a donut chart', inject(function () {
      // Arrange
      // TODO

      // Act
      // TODO

      // Assert
      // TODO
    }));

    xit('should be able to render a gauge chart', inject(function () {
      // Arrange
      // TODO

      // Act
      // TODO

      // Assert
      // TODO
    }));
  });

});