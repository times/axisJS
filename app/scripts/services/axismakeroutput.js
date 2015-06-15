/**
 * @ngdoc service
 * @name axisJsApp.githubOutput
 * @description
 * # axisMaker Output
 * Service for outputting to AxisMaker.
 */

'use strict';

angular.module('axisJSApp')
  .factory('axismakerOutput', ['GenericOutput', function githubOutput(GenericOutput) {
    var maker = angular.copy(GenericOutput);

    maker.serviceConfig = {
      type: 'export', // Options: 'save' and 'export'.
      label: 'Save' // Label to use on button.
    };

    maker.preprocess = function(scope){
      var chartConfig = scope.config;
      chartConfig.axis.x.tick.format = chartConfig.axis.x.tick.format.toString();
      chartConfig.axis.y.tick.format = chartConfig.axis.y.tick.format.toString();
      chartConfig.axis.y2.tick.format = chartConfig.axis.y2.tick.format.toString();
      chartConfig.pie.label.format = chartConfig.pie.label.format.toString();
      chartConfig.donut.label.format = chartConfig.donut.label.format.toString();
      chartConfig.gauge.label.format = chartConfig.gauge.label.format.toString();
      var chartTitle = chartConfig.chartTitle;
      var axisConfig = String(angular.toJson(chartConfig));
      var axisChart = String(angular.element('.savePNG').attr('href'));
      return {
        config: axisConfig,
        png: axisChart,
        title: chartTitle
      };
    };

    maker.process = function(payload){
      // Have use PostMessage to push outside the iframe
      window.parent.postMessage(
        JSON.stringify(payload),
        '*' // The intended origin, in this example we use the any origin wildcard.
      );
    };

    maker.complete = function(){
      console.log('Complete.');
    };

    maker.export = function(scope){
      var payload = maker.preprocess(scope);
      maker.process(payload);
      maker.complete();
    };

    return maker;
  }]);
