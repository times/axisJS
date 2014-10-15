'use strict';

describe('Directive: BuildChart', function () {

  // load the directive's module
  beforeEach(module('axisJSApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock MainCtrl scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should instantiate C3 on the #chart element', inject(function ($compile) {
    var element = angular.element('<div id="chart" build-chart></div>');
    element = $compile(element)(scope);
    scope.$apply();

    setTimeout(function(){
      expect(element.children('svg')).toBeTruthy();
    }, 500);
  }));

  describe('a spec with chart-specific tests', function() {
    it('should be able to render a series chart', inject(function ($compile) {
      var element = angular.element('<div id="chart" build-chart></div>');
      var configJSON = '{"data":{"x":"","y":"","y2":"","columns":[["dogs","10","20","40","60"],["bears","10","15","20","25"],["llamas","15","40","70","80"],["ducks","20","10","30","70"],["cows","30","20","10","60"],["sheep","40","25","35","50"],["orangutans","20","30","10","40"]],"axes":{},"groups":{},"type":"","types":{"data1":"line","data2":"line","dogs":"line","bears":"step","llamas":"area","ducks":"area-step","cows":"scatter","sheep":"bar","orangutans":"spline"},"colors":{"data1":"#78B8DF","data2":"#AFCBCE","dogs":"#1f77b4","bears":"#ff7f0e","llamas":"#2ca02c","ducks":"#d62728","cows":"#9467bd","sheep":"#8c564b","orangutans":"#e377c2"}},"axis":{"x":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y":{"show":true,"accuracy":0,"prefix":"","suffix":"","tick":{}},"y2":{"show":false,"accuracy":0,"prefix":"","suffix":"","tick":{}}},"point":{"show":false},"groups":{},"defaultColors":["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],"chartTitle":"","chartCredit":"","chartSource":"","chartWidth":1000,"chartGlobalType":"series","chartAccuracy":1,"cms":false,"pie":{"label":{}},"donut":{"label":{}},"gauge":{"label":{}}}';
      scope.config = angular.fromJson(configJSON);
      element = $compile(element)(scope);
      scope.$apply();

      setTimeout(function(){
        
      }, 500);
    }));

    it('should be able to render a pie chart', inject(function ($compile) {

    }));

    it('should be able to render a donut chart', inject(function ($compile) {

    }));

    it('should be able to render a gauge chart', inject(function ($compile) {

    }));
  });

  describe('a spec with tests intended to prevent regression on closed issues', function() {
    it('should update the colour pickers when data is added (#30)', inject(function ($compile) {

    }));

    it('should should work properly when the dataset only has one non-header row', inject(function ($compile) {

    }));
  });



  // @TODO This probably won't work until after I abstract redraw() into a Service.
  // @sa #15.

  // it('should fire redraw when sundry config options change', inject(function($compile){
  //   var element = angular.element('<div id="chart" build-chart></div>');
  //   element = $compile(element)(scope);
  //   scope.$apply();
  //
  //   setTimeout(function(){
  //     expect(element.children('svg')).toBeTruthy();
  //   }, 500);
  // }));
});
